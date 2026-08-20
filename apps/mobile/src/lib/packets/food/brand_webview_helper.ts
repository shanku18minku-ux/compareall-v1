// @ts-nocheck
/**
 * makeWebViewBrandPacket — reusable factory for direct-brand WebView packets.
 *
 * Architecture:
 *  - connectionType: 'WEBVIEW_EXTRACT'
 *    → WebView loads the brand's search/menu page during search
 *    → Extractor script scrapes real price + name + offer from DOM
 *    → Falls back to staticOffers if DOM scrape yields nothing
 *  - getPublicOffers(query): pure-JS fallback used by handleSearch
 *    → Returns matching static offers instantly, before WebView loads
 *  - Connections page: brand shows in its subcategory with "🌐 ORDER" button
 *    (no account login needed — just opens official ordering URL)
 */

export function makeWebViewBrandPacket(meta: any, staticOffers: any[], extractorConfig: any) {
    const {
        searchUrlFn,         // (query, location?) => url to load in WebView
        itemSelector,        // CSS selector for item cards on the page
        nameSelector,        // relative selector for dish name within card
        priceSelector,       // relative selector for price within card
        imageSelector,       // relative selector for image within card
        offerSelector,       // relative selector for offer/discount text (optional)
        unavailableSignals,  // strings that indicate "not in your area"
    } = extractorConfig;

    return {
        metadata: meta,
        connectionType: 'WEBVIEW_EXTRACT',   // ← real WebView scraping

        // ── Pure-JS fallback: instant static results while WebView loads ──────
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

        // ── Not a login WebView ───────────────────────────────────────────────
        getLoginDetectionScript: () => `(function(){})();`,

        // ── Search URL: the brand's menu/search page ──────────────────────────
        getSearchUrl: (query: string, location?: any) => searchUrlFn(query, location),

        // ── WebView extractor: real DOM scraping with static fallback ─────────
        getExtractorInjection: (url: string, searchQuery: string) => {
            const staticJson = JSON.stringify(staticOffers);
            const q = JSON.stringify(searchQuery || '');
            const itemSel = JSON.stringify(itemSelector);
            const nameSel = JSON.stringify(nameSelector);
            const priceSel = JSON.stringify(priceSelector);
            const imgSel = JSON.stringify(imageSelector || '');
            const offerSel = JSON.stringify(offerSelector || '');
            const unavailSigs = JSON.stringify(unavailableSignals || []);
            const brandName = JSON.stringify(meta.name);
            const maxWait = 12;

            return `
(function() {
    var q = ${q};
    var BRAND = ${brandName};
    var staticOffers = ${staticJson};
    var itemSel = ${itemSel};
    var nameSel = ${nameSel};
    var priceSel = ${priceSel};
    var imgSel = ${imgSel};
    var offerSel = ${offerSel};
    var unavailSigs = ${unavailSigs};
    var attempts = 0;
    var maxAttempts = ${maxWait};
    var sent = false;

    function sendResult(data) {
        if (sent) return;
        sent = true;
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(
            JSON.stringify({ type: 'SEARCH_RESULTS', success: true, data: data })
        );
    }

    function matchQuery(text) {
        if (!q || q === 'food') return true;
        return text.toLowerCase().indexOf(q.toLowerCase()) !== -1;
    }

    function parsePrice(txt) {
        var m = (txt || '').match(/[\\d,]+/);
        return m ? parseInt(m[0].replace(/,/g, ''), 10) : 0;
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

    function tryExtract() {
        attempts++;

        // 1. Check unavailability signals
        var bodyText = (document.body ? document.body.innerText : '').toLowerCase();
        var isUnavail = unavailSigs.some(function(sig) {
            return bodyText.indexOf(sig.toLowerCase()) !== -1;
        });
        if (isUnavail) { sendResult([]); return; }

        // 2. Try real DOM scraping
        var cards = document.querySelectorAll(itemSel);
        if (!cards || cards.length === 0) {
            if (attempts < maxAttempts) { setTimeout(tryExtract, 800); }
            else { sendResult(staticFallback()); }
            return;
        }

        var results = [];
        cards.forEach(function(card) {
            var nameEl = nameSel ? card.querySelector(nameSel) : null;
            var priceEl = priceSel ? card.querySelector(priceSel) : null;
            var imgEl = imgSel ? card.querySelector(imgSel) : null;
            var offerEl = offerSel ? card.querySelector(offerSel) : null;

            var dishName = nameEl ? (nameEl.innerText || nameEl.textContent || '').trim() : '';
            var priceText = priceEl ? (priceEl.innerText || priceEl.textContent || '').trim() : '';
            var basePrice = parsePrice(priceText);
            var imgSrc = imgEl ? (imgEl.src || imgEl.getAttribute('data-src') || '') : '';
            var offerText = offerEl ? (offerEl.innerText || offerEl.textContent || '').trim() : '';

            if (!dishName || basePrice <= 0) return;
            if (!matchQuery(dishName)) return;

            // Parse offer/discount
            var discount = 0;
            var coupon = '';
            if (offerText) {
                var pct = offerText.match(/(\\d+)%/);
                if (pct) { discount = Math.min(Math.round(basePrice * parseInt(pct[1]) / 100), 150); }
                var flat = offerText.match(/(?:₹|Rs\\.?\\s*)(\\d+)\\s*(?:off|OFF)/i);
                if (flat && !discount) { discount = parseInt(flat[1], 10); }
                var codeMatch = offerText.match(/(?:use|code)[\\s:]+([A-Z0-9]{4,})/i);
                if (codeMatch) coupon = codeMatch[1].toUpperCase();
            }
            var finalPrice = discount > 0 ? Math.max(basePrice - discount, 10) : basePrice;

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

        if (results.length > 0) {
            sendResult(results);
        } else if (attempts < maxAttempts) {
            setTimeout(tryExtract, 800);
        } else {
            // DOM found but no matching items — use static fallback
            sendResult(staticFallback());
        }
    }

    setTimeout(tryExtract, 2500);
})();
`;
        },

        parseExtraction: (data: any) => data,
    };
}
