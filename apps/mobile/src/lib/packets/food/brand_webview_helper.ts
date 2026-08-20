// @ts-nocheck
/**
 * makeWebViewBrandPacket v2 — Production-quality WebView extractor for direct-brand sites.
 *
 * Strategy (same as Swiggy/Zomato):
 * 1. Intercept XHR/fetch calls inside the brand's WebView (like Swiggy does)
 * 2. Look for menu API responses (storeId-gated BFF APIs)
 * 3. Parse real JSON — dish names, prices, offers from actual API response
 * 4. Fall back to DOM scraping if API interception yields nothing
 * 5. Fall back to static offers if both above fail
 *
 * Each brand has its own extractor config including:
 *  - API path patterns to intercept (e.g. /api/v1/menu, /orderapi/v1/menu/items)
 *  - JSON parsers for that brand's API response shape
 *  - DOM selectors as fallback
 */

export function makeWebViewBrandPacket(meta: any, staticOffers: any[], extractorConfig: any) {
    const {
        searchUrlFn,
        menuApiPatterns,    // string[] — URL substrings to intercept (menu/catalog APIs)
        parseMenuApi,       // (jsonData, query) => NormalizedItem[]
        itemSelector,
        nameSelector,
        priceSelector,
        imageSelector,
        offerSelector,
        unavailableSignals,
    } = extractorConfig;

    return {
        metadata: meta,
        connectionType: 'WEBVIEW_EXTRACT',

        // ── Pure-JS instant fallback ─────────────────────────────────────────
        getPublicOffers: (query: string) => {
            const q = (query || '').toLowerCase().trim();
            const matched = (!q || q === 'food')
                ? staticOffers
                : staticOffers.filter(o => {
                    const t = (o.dishName || '').toLowerCase();
                    const c = (o.category || '').toLowerCase();
                    const b = (o.brandName || '').toLowerCase();
                    return t.includes(q) || c.includes(q) || b.includes(q);
                });
            return matched.map(o => ({
                dishName: o.dishName,
                restaurantName: o.brandName,
                dishImage: o.dishImage || '',
                price: { finalPayablePrice: o.finalPrice, basePrice: o.basePrice, discount: o.discount || 0 },
                deliveryTime: o.deliveryTime || '~30-45 mins',
                rating: o.rating || '4.0',
                couponCode: o.couponCode || '',
                autoCouponSavings: o.discount || 0,
                offerStatus: 'PUBLIC',
                offerLabel: o.offerLabel || 'Public Offer',
            }));
        },

        getLoginDetectionScript: () => `(function(){})();`,

        getSearchUrl: (query: string, location?: any) => searchUrlFn(query, location),

        // ── WebView injection: intercept brand APIs + DOM fallback ─────────
        getExtractorInjection: (url: string, searchQuery: string, location?: any) => {
            const staticJson = JSON.stringify(staticOffers);
            const q = JSON.stringify(searchQuery || '');
            const brandName = JSON.stringify(meta.name);
            const patterns = JSON.stringify(menuApiPatterns || []);
            const parseMenuApiStr = parseMenuApi
                ? parseMenuApi.toString()
                : 'function(data, q) { return []; }';
            const itemSel = JSON.stringify(itemSelector || '.product-card,.menu-item,.item');
            const nameSel = JSON.stringify(nameSelector || '.name,h3,[class*="name"]');
            const priceSel = JSON.stringify(priceSelector || '.price,[class*="price"]');
            const imgSel = JSON.stringify(imageSelector || 'img');
            const offerSel = JSON.stringify(offerSelector || '[class*="offer"],[class*="badge"]');
            const unavailSigs = JSON.stringify(unavailableSignals || ['not available', 'not serviceable']);

            return `
(function() {
    var BRAND = ${brandName};
    var q = ${q};
    var staticOffers = ${staticJson};
    var menuApiPatterns = ${patterns};
    var itemSel = ${itemSel};
    var nameSel = ${nameSel};
    var priceSel = ${priceSel};
    var imgSel = ${imgSel};
    var offerSel = ${offerSel};
    var unavailSigs = ${unavailSigs};
    var sent = false;
    var parseMenuApiFn = ${parseMenuApiStr};

    function postResults(data) {
        if (sent || !data) return;
        sent = true;
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(
            JSON.stringify({ type: 'SEARCH_RESULTS', success: true, data: data })
        );
    }

    function matchQuery(text) {
        if (!q || q === '' || q === 'food') return true;
        return (text || '').toLowerCase().indexOf(q.toLowerCase()) !== -1;
    }

    function parsePrice(txt) {
        var m = (txt || '').match(/[\\d,]+(?:\\.\\d+)?/);
        return m ? parseFloat(m[0].replace(/,/g, '')) : 0;
    }

    function staticFallback() {
        var qLow = (q || '').toLowerCase();
        var matched = (!q || q === 'food') ? staticOffers : staticOffers.filter(function(o) {
            return (o.dishName||'').toLowerCase().indexOf(qLow) !== -1 ||
                   (o.category||'').toLowerCase().indexOf(qLow) !== -1;
        });
        return matched.map(function(o) {
            return {
                dishName: o.dishName,
                restaurantName: o.brandName,
                dishImage: o.dishImage || '',
                price: { finalPayablePrice: o.finalPrice, basePrice: o.basePrice, discount: o.discount || 0 },
                deliveryTime: o.deliveryTime || '~30-45 mins',
                rating: o.rating || '4.0',
                couponCode: o.couponCode || '',
                autoCouponSavings: o.discount || 0,
                offerStatus: 'PUBLIC',
                offerLabel: o.offerLabel || 'Public Offer'
            };
        });
    }

    // ── 1. XHR interception (same technique as Swiggy/Zomato extractors) ──────
    var OrigXHR = window.XMLHttpRequest;
    function InterceptedXHR() {
        var xhr = new OrigXHR();
        var _open_url = '';
        var origOpen = xhr.open.bind(xhr);
        var origSend = xhr.send.bind(xhr);
        xhr.open = function(method, url) {
            _open_url = url || '';
            return origOpen.apply(xhr, arguments);
        };
        xhr.send = function(body) {
            var isMenuCall = menuApiPatterns.some(function(p) {
                return _open_url.indexOf(p) !== -1;
            });
            if (isMenuCall && !sent) {
                xhr.addEventListener('load', function() {
                    try {
                        var data = JSON.parse(xhr.responseText);
                        var parsed = parseMenuApiFn(data, q);
                        if (parsed && parsed.length > 0) {
                            postResults(parsed);
                        }
                    } catch(e) {}
                });
            }
            return origSend.apply(xhr, arguments);
        };
        return xhr;
    }
    try { window.XMLHttpRequest = InterceptedXHR; } catch(e) {}

    // ── 2. fetch() interception ───────────────────────────────────────────────
    var origFetch = window.fetch;
    if (origFetch) {
        window.fetch = function(input, init) {
            var url = (typeof input === 'string') ? input : (input && input.url) || '';
            var isMenuCall = menuApiPatterns.some(function(p) { return url.indexOf(p) !== -1; });
            var prom = origFetch.apply(window, arguments);
            if (isMenuCall && !sent) {
                prom.then(function(res) {
                    var cloned = res.clone();
                    cloned.json().then(function(data) {
                        try {
                            var parsed = parseMenuApiFn(data, q);
                            if (parsed && parsed.length > 0) postResults(parsed);
                        } catch(e) {}
                    }).catch(function(){});
                }).catch(function(){});
            }
            return prom;
        };
    }

    // ── 3. DOM scraping fallback (runs after page renders) ───────────────────
    var domAttempts = 0;
    var maxDomAttempts = 15;

    function tryDom() {
        if (sent) return;
        domAttempts++;

        var bodyText = (document.body ? document.body.innerText : '').toLowerCase();
        var isUnavail = unavailSigs.some(function(sig) {
            return bodyText.indexOf(sig.toLowerCase()) !== -1;
        });
        if (isUnavail) { postResults([]); return; }

        var cards = document.querySelectorAll(itemSel);
        if (!cards || cards.length === 0) {
            if (domAttempts < maxDomAttempts) setTimeout(tryDom, 700);
            else postResults(staticFallback());
            return;
        }

        var results = [];
        cards.forEach(function(card) {
            var nameEl = card.querySelector(nameSel);
            var priceEl = card.querySelector(priceSel);
            var imgEl = card.querySelector(imgSel);
            var offerEl = card.querySelector(offerSel);

            var dishName = nameEl ? (nameEl.innerText || nameEl.textContent || '').trim() : '';
            var priceText = priceEl ? (priceEl.innerText || priceEl.textContent || '').trim() : '';
            var basePrice = parsePrice(priceText);
            var imgSrc = imgEl ? (imgEl.src || imgEl.getAttribute('data-src') || '') : '';
            var offerText = offerEl ? (offerEl.innerText || offerEl.textContent || '').trim() : '';

            if (!dishName || basePrice <= 0) return;
            if (!matchQuery(dishName)) return;

            var discount = 0, coupon = '', finalPrice = basePrice;
            if (offerText) {
                var pct = offerText.match(/(\\d+)%/);
                var flat = offerText.match(/(?:₹|Rs\\.?\\s*)(\\d+)\\s*(?:off|OFF)/i);
                var codeMatch = offerText.match(/(?:use|code)[\\s:]+([A-Z0-9]{4,})/i);
                if (flat) discount = parseInt(flat[1], 10);
                else if (pct) discount = Math.min(Math.round(basePrice * parseInt(pct[1]) / 100), 150);
                if (codeMatch) coupon = codeMatch[1].toUpperCase();
                if (discount > 0) finalPrice = Math.max(basePrice - discount, 10);
            }

            results.push({
                dishName: dishName,
                restaurantName: BRAND,
                dishImage: imgSrc,
                price: { finalPayablePrice: finalPrice, basePrice: basePrice, discount: discount },
                deliveryTime: '~30-45 mins',
                rating: '4.1',
                couponCode: coupon,
                autoCouponSavings: discount,
                offerStatus: discount > 0 ? 'LIVE_OFFER' : 'PUBLIC',
                offerLabel: discount > 0 ? ('₹' + discount + ' OFF') : 'Public Price'
            });
        });

        if (results.length > 0) postResults(results);
        else if (domAttempts < maxDomAttempts) setTimeout(tryDom, 700);
        else postResults(staticFallback());
    }

    // Start DOM polling after 3 seconds (let SPA hydrate)
    setTimeout(tryDom, 3000);

    // Final safety net — send static after 14s if nothing sent yet
    setTimeout(function() {
        if (!sent) postResults(staticFallback());
    }, 14000);
})();
`;
        },

        parseExtraction: (data: any) => data,
    };
}
