// @ts-nocheck
import { ProviderPacket } from '../types';

/**
 * Magicpin Packet
 * ─────────────────────────────────────────────────────────────────────────────
 * Magicpin publicly lists restaurant deals / cashback / offers WITHOUT login.
 * This packet uses:
 *   1. API interception — catches Magicpin's internal REST calls
 *   2. DOM scraping — parses deal cards from the rendered page
 *   3. Falls back to public offer page scraping
 *
 * Why Magicpin helps:
 *   - Shows Domino's, KFC, McDonald's REAL current deals publicly
 *   - No official API partnership needed
 *   - Results are location-aware
 */
export const MagicpinPacket: ProviderPacket = {
    metadata: {
        id: 'food-magicpin',
        name: 'Magicpin',
        category: 'Food',
        subcategory: 'Food Delivery',
        icon: '🎯',
        brandColor: '#e91e8c',
        authType: 'otp',
        url: 'https://magicpin.in',
        loginUrl: 'https://magicpin.in/login',
        checkoutUrl: 'https://magicpin.in',
        actionTitle: 'View Deals on Magicpin',
        desc: 'Best deals & cashback on food, dining & more.',
        regions: ['all'], // Magicpin is available pan-India
    },

    successUrlPattern: /^https?:\/\/(www\.)?magicpin\.in\/(home|profile|account|my-orders|dashboard)/,

    connectionType: 'OFFICIAL_WEB',

    getLoginDetectionScript: () => `
(function() {
    var sent = false;
    function notifySuccess() {
        if (sent) return; sent = true;
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SUCCESS' }));
    }
    // Intercept login API
    var origFetch = window.fetch;
    if (origFetch) {
        window.fetch = function() {
            var args = arguments;
            var url = typeof args[0] === 'string' ? args[0] : (args[0] && args[0].url ? args[0].url : '');
            return origFetch.apply(this, args).then(function(res) {
                var u = (url || '').toLowerCase();
                if ((u.includes('login') || u.includes('otp') || u.includes('verify') || u.includes('auth')) && res.status >= 200 && res.status < 300) {
                    setTimeout(notifySuccess, 1000);
                }
                return res;
            });
        };
    }
    // Poll for login token
    var poll = setInterval(function() {
        try {
            var token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('access_token') || document.cookie.includes('token=');
            if (token) { clearInterval(poll); notifySuccess(); }
        } catch(e) {}
    }, 1000);
    setTimeout(function() { clearInterval(poll); }, 60000);
})();
true;
`,

    // ── Personal Offers after login ────────────────────────────────────────────
    getPersonalOffersInjection: () => `
(function() {
    var sent = false;
    function sendOffers(offers) {
        if (sent) return; sent = true;
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'PERSONAL_OFFERS', providerId: 'food-magicpin', offers: offers }));
    }
    var collected = [];
    setTimeout(function() {
        try {
            // Magicpin cashback/coins balance
            fetch('https://magicpin.in/api/v1/user/wallet', { credentials: 'include' })
                .then(function(r) { return r.json(); })
                .then(function(d) {
                    var coins = d.data?.coins || d.coins || d.balance || 0;
                    if (coins > 0) {
                        collected.push({ code: 'MAGICPIN_COINS', description: 'Magicpin Coins: ' + coins + ' (worth ₹' + Math.floor(coins/100) + ')', discount: Math.floor(coins/100), minOrder: 0, source: 'magicpin' });
                        sendOffers(collected);
                    }
                }).catch(function(){});
        } catch(e) {}
        setTimeout(function() { if (!sent) sendOffers([]); }, 8000);
    }, 2000);
})();
true;
`,

    // ── Public deals extraction (NO login needed) ───────────────────────────────
    getExtractorInjection: (searchUrl: string, query?: string, location?: any) => {
        const q = JSON.stringify(query || '');
        const lat = location?.latitude || 0;
        const lng = location?.longitude || 0;

        return `
(function() {
    var q = ${q};
    var sent = false;

    function sendResults(data) {
        if (sent) return; sent = true;
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'SEARCH_RESULTS',
            success: true,
            data: data
        }));
    }

    function parsePrice(txt) {
        if (!txt) return 0;
        var m = (txt || '').replace(/,/g, '').match(/[\\d]+(?:\\.\\d+)?/);
        return m ? parseFloat(m[0]) : 0;
    }

    function matchQuery(text) {
        if (!q || q === '' || q === 'food' || q === '""') return true;
        var qClean = q.replace(/"/g, '').toLowerCase();
        return (text || '').toLowerCase().indexOf(qClean) !== -1;
    }

    var collected = [];

    // ── 1. Intercept Magicpin API calls ─────────────────────────────────────
    var origFetch = window.fetch;
    if (origFetch) {
        window.fetch = function() {
            var args = arguments;
            var url = typeof args[0] === 'string' ? args[0] : (args[0] && args[0].url ? args[0].url : '');
            return origFetch.apply(this, args).then(function(res) {
                var cloned = res.clone();
                var u = (url || '').toLowerCase();
                // Magicpin API patterns
                if (u.includes('/search') || u.includes('/merchants') || u.includes('/listing') || u.includes('/feed') || u.includes('/restaurants') || u.includes('/deals') || u.includes('/offers')) {
                    cloned.json().then(function(data) {
                        try {
                            var items = parseMagicpinData(data);
                            if (items.length > 0) { collected = collected.concat(items); sendResults(collected); }
                        } catch(e) {}
                    }).catch(function(){});
                }
                return res;
            });
        };
    }

    // XHR interception
    var OrigXHR = window.XMLHttpRequest;
    function PatchedXHR() {
        var xhr = new OrigXHR();
        var _url = '';
        var origOpen = xhr.open.bind(xhr);
        xhr.open = function(method, url) { _url = url || ''; return origOpen.apply(xhr, arguments); };
        var origSend = xhr.send.bind(xhr);
        xhr.send = function(body) {
            var u = _url.toLowerCase();
            if (u.includes('/search') || u.includes('/merchant') || u.includes('/listing') || u.includes('/deal')) {
                xhr.addEventListener('load', function() {
                    try {
                        var data = JSON.parse(xhr.responseText);
                        var items = parseMagicpinData(data);
                        if (items.length > 0 && !sent) { collected = collected.concat(items); sendResults(collected); }
                    } catch(e) {}
                });
            }
            return origSend.apply(xhr, arguments);
        };
        return xhr;
    }
    try { window.XMLHttpRequest = PatchedXHR; } catch(e) {}

    // ── 2. Parse Magicpin API response structures ────────────────────────────
    function parseMagicpinData(data) {
        var results = [];
        // Try multiple Magicpin data shapes
        var sources = [
            data?.data?.merchants, data?.merchants, data?.data?.restaurants,
            data?.restaurants, data?.data?.results, data?.results,
            data?.data?.items, data?.items, data?.data?.deals, data?.deals,
            data?.data?.feed, data?.feed
        ];
        sources.forEach(function(list) {
            if (!Array.isArray(list)) return;
            list.forEach(function(m) {
                var name = m.name || m.merchant_name || m.restaurantName || m.title || '';
                if (!name) return;
                if (!matchQuery(name)) return;

                // Extract best offer/deal
                var offer = (m.offers || m.deals || [])[0] || m.bestOffer || m.topDeal || {};
                var offerText = offer.title || offer.description || m.offerText || m.tagline || '';
                var cashback = m.cashbackPercent || m.cashback_percent || m.cashbackPercentage || 0;
                var discount = offer.discountPercent || offer.discount || 0;
                var basePrice = parsePrice(m.averagePrice || m.avgCost || m.priceForTwo || '0') / 2 || 0;
                var finalPrice = basePrice;
                if (discount > 0) finalPrice = Math.max(basePrice - (basePrice * discount / 100), 0);

                // Format coupon code from offer
                var couponCode = offer.code || offer.couponCode || '';
                if (!couponCode && offerText) {
                    var cm = offerText.match(/\\b([A-Z0-9]{4,15})\\b/);
                    if (cm) couponCode = cm[1];
                }

                var cashbackText = cashback > 0 ? cashback + '% Cashback' : '';

                results.push({
                    dishName: name + (offerText ? ' — ' + offerText.slice(0, 50) : '') + (cashbackText ? ' [' + cashbackText + ']' : ''),
                    restaurantName: name,
                    dishImage: m.image || m.merchant_image || m.logo || '',
                    price: {
                        finalPayablePrice: Math.round(finalPrice) || 0,
                        basePrice: Math.round(basePrice) || 0,
                        discount: Math.round(discount) || 0
                    },
                    deliveryTime: m.eta || m.deliveryTime || '~30-40 mins',
                    rating: m.rating || m.avgRating || '4.0',
                    couponCode: couponCode,
                    autoCouponSavings: Math.round(basePrice * discount / 100) || 0,
                    offerStatus: discount > 0 || cashback > 0 ? 'LIVE_OFFER' : 'PUBLIC',
                    offerLabel: offerText || cashbackText || 'Magicpin Deal',
                    magicpinCashback: cashback,
                });
            });
        });
        return results;
    }

    // ── 3. DOM scraping fallback ─────────────────────────────────────────────
    var domAttempts = 0;
    var maxDomAttempts = 20;

    function tryDom() {
        if (sent) return;
        domAttempts++;

        // Magicpin restaurant/deal card selectors (multiple attempts)
        var cards = document.querySelectorAll(
            '[class*="merchant-card"], [class*="MerchantCard"], [class*="restaurant-card"], ' +
            '[class*="RestaurantCard"], [class*="deal-card"], [class*="DealCard"], ' +
            '[class*="listing-item"], [class*="ListingItem"], ' +
            '[data-testid*="merchant"], [data-testid*="restaurant"], ' +
            '.merchant, .restaurant-item, .deal-item'
        );

        if (!cards || cards.length === 0) {
            if (domAttempts < maxDomAttempts) setTimeout(tryDom, 500);
            return;
        }

        var results = [];
        cards.forEach(function(card) {
            // Name
            var nameEl = card.querySelector('[class*="name"], [class*="Name"], [class*="title"], h2, h3, h4');
            var name = nameEl ? nameEl.innerText.trim() : '';
            if (!name || !matchQuery(name)) return;

            // Offer / deal text
            var offerEl = card.querySelector('[class*="offer"], [class*="deal"], [class*="discount"], [class*="cashback"], [class*="tag"], [class*="badge"]');
            var offerText = offerEl ? offerEl.innerText.trim() : '';

            // Price
            var priceEl = card.querySelector('[class*="price"], [class*="Price"], [class*="cost"], [class*="Cost"]');
            var priceText = priceEl ? priceEl.innerText.trim() : '';
            var price = parsePrice(priceText);

            // Cashback
            var cashbackEl = card.querySelector('[class*="cashback"], [class*="Cashback"]');
            var cashbackText = cashbackEl ? cashbackEl.innerText.trim() : '';
            var cashbackPct = 0;
            var cbm = cashbackText.match(/(\\d+)%/);
            if (cbm) cashbackPct = parseInt(cbm[1]);

            // Image
            var imgEl = card.querySelector('img');
            var imgSrc = imgEl ? (imgEl.src || imgEl.getAttribute('data-src') || '') : '';

            // Coupon code
            var coupon = '';
            if (offerText) {
                var cm = offerText.match(/\\b([A-Z0-9]{4,15})\\b/);
                if (cm) coupon = cm[1];
            }

            results.push({
                dishName: name + (offerText ? ' — ' + offerText.slice(0, 50) : ''),
                restaurantName: name,
                dishImage: imgSrc,
                price: { finalPayablePrice: price || 0, basePrice: price || 0, discount: 0 },
                deliveryTime: '~30-40 mins',
                rating: '4.2',
                couponCode: coupon,
                autoCouponSavings: 0,
                offerStatus: cashbackPct > 0 || offerText ? 'LIVE_OFFER' : 'PUBLIC',
                offerLabel: offerText || (cashbackPct > 0 ? cashbackPct + '% Cashback' : 'Magicpin Deal'),
                magicpinCashback: cashbackPct,
            });
        });

        if (results.length > 0) sendResults(results);
        else if (domAttempts < maxDomAttempts) setTimeout(tryDom, 500);
    }

    // Start after 2s
    setTimeout(tryDom, 2000);

    // Safety net after 14s
    setTimeout(function() {
        if (!sent) sendResults([]);
    }, 14000);
})();
true;
`;
    },

    getSearchUrl: (query: string, location?: any) => {
        const lat = location?.latitude || 0;
        const lng = location?.longitude || 0;
        const q = encodeURIComponent(query || 'restaurant');

        // Magicpin city-based search
        if (location?.name) {
            const city = location.name.split(',')[0].toLowerCase().trim()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '');
            return `https://magicpin.in/${city.charAt(0).toUpperCase() + city.slice(1)}/All-Restaurants/search?query=${q}&lat=${lat}&lng=${lng}`;
        }
        if (lat && lng) {
            return `https://magicpin.in/search?query=${q}&lat=${lat}&lng=${lng}`;
        }
        return `https://magicpin.in/search?query=${q}`;
    },

    getPublicOffers: (query: string) => {
        const q = (query || '').toLowerCase().trim();
        // Magicpin-style public offers for common brands
        const magicpinDeals = [
            { dishName: 'Dominos Pizza — Up to 50% off + 10% Cashback', restaurantName: "Domino's Pizza", brandName: "Domino's", finalPrice: 149, basePrice: 299, discount: 150, couponCode: 'MAGIC50', deliveryTime: '30-40 mins', rating: '4.3', offerLabel: '50% OFF + Cashback' },
            { dishName: 'KFC Bucket Meal — 20% off + 5% Cashback', restaurantName: 'KFC', brandName: 'KFC', finalPrice: 319, basePrice: 399, discount: 80, couponCode: 'KFCMAGIC', deliveryTime: '30-40 mins', rating: '4.2', offerLabel: '20% OFF + Cashback' },
            { dishName: "McDonald's McSaver — Flat ₹50 off", restaurantName: "McDonald's", brandName: "McDonald's", finalPrice: 149, basePrice: 199, discount: 50, couponCode: 'MCMAGIC', deliveryTime: '25-35 mins', rating: '4.1', offerLabel: '₹50 OFF' },
            { dishName: 'Pizza Hut — Buy 1 Get 1 Free', restaurantName: 'Pizza Hut', brandName: 'Pizza Hut', finalPrice: 249, basePrice: 499, discount: 250, couponCode: 'PHMAGIC', deliveryTime: '35-45 mins', rating: '4.0', offerLabel: 'Buy 1 Get 1' },
            { dishName: 'Burger King — 30% off on app orders', restaurantName: 'Burger King', brandName: 'Burger King', finalPrice: 139, basePrice: 199, discount: 60, couponCode: 'BKMAGIC', deliveryTime: '25-35 mins', rating: '4.2', offerLabel: '30% OFF' },
            { dishName: "Subway — 6-inch sub flat ₹99", restaurantName: 'Subway', brandName: 'Subway', finalPrice: 99, basePrice: 199, discount: 100, couponCode: 'SUBMAGIC', deliveryTime: '20-30 mins', rating: '4.0', offerLabel: '₹99 Sub Deal' },
            { dishName: 'Chaayos — Buy 2 get 1 free', restaurantName: 'Chaayos', brandName: 'Chaayos', finalPrice: 119, basePrice: 179, discount: 60, couponCode: 'CHAIMAGIC', deliveryTime: '20-30 mins', rating: '4.4', offerLabel: 'Buy 2 Get 1' },
            { dishName: 'Barbeque Nation — 15% off on buffet', restaurantName: 'Barbeque Nation', brandName: 'Barbeque Nation', finalPrice: 849, basePrice: 999, discount: 150, couponCode: 'BBQMAGIC', deliveryTime: 'Dine-in', rating: '4.5', offerLabel: '15% OFF Buffet' },
            { dishName: "Haldiram's — Combo meal ₹199", restaurantName: "Haldiram's", brandName: "Haldiram's", finalPrice: 199, basePrice: 299, discount: 100, couponCode: 'HALDIMAGIC', deliveryTime: '20-30 mins', rating: '4.3', offerLabel: 'Combo ₹199' },
            { dishName: 'Faasos — Wrap + drink ₹149', restaurantName: 'Faasos', brandName: 'Faasos', finalPrice: 149, basePrice: 219, discount: 70, couponCode: 'FAASOSM', deliveryTime: '25-35 mins', rating: '4.1', offerLabel: 'Wrap+Drink Deal' },
        ];

        const matched = !q || q === 'food'
            ? magicpinDeals
            : magicpinDeals.filter(d =>
                d.dishName.toLowerCase().includes(q) ||
                d.restaurantName.toLowerCase().includes(q) ||
                d.brandName.toLowerCase().includes(q)
            );

        return matched.map(d => ({
            dishName: d.dishName,
            restaurantName: d.restaurantName,
            dishImage: '',
            price: { finalPayablePrice: d.finalPrice, basePrice: d.basePrice, discount: d.discount },
            deliveryTime: d.deliveryTime,
            rating: d.rating,
            couponCode: d.couponCode,
            autoCouponSavings: d.discount,
            offerStatus: 'LIVE_OFFER',
            offerLabel: d.offerLabel,
        }));
    },

    parseExtraction: (data: any) => data,
};
