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
        regions: ['all'],
        hideFromConnections: true, // Data source only — not a user-login platform
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

        return `
(function() {
    var q = ${q};
    var sent = false;

    function sendResults(data) {
        if (sent || !data || !data.length) return;
        sent = true;
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'SEARCH_RESULTS',
            success: true,
            data: data
        }));
    }

    function matchQuery(text) {
        if (!q || q === '""' || q === '' || q.replace(/"/g,'') === 'food') return true;
        var qc = q.replace(/"/g, '').toLowerCase();
        return (text || '').toLowerCase().indexOf(qc) !== -1;
    }

    function parsePrice(val) {
        if (!val) return 0;
        var m = String(val).replace(/,/g,'').match(/[\\d]+(?:\\.\\d+)?/);
        return m ? Math.round(parseFloat(m[0])) : 0;
    }

    // ── GOLDEN PATH: Parse __NEXT_DATA__ JSON (most reliable for Next.js) ──
    function tryNextData() {
        try {
            var el = document.getElementById('__NEXT_DATA__');
            if (!el || !el.textContent) return false;
            var json = JSON.parse(el.textContent);

            // Walk the Next.js page props tree
            var props = json?.props?.pageProps;
            if (!props) return false;

            // Try multiple field names Magicpin might use
            var lists = [
                props?.merchants, props?.restaurants, props?.outlets,
                props?.data?.merchants, props?.data?.restaurants,
                props?.initialData?.merchants, props?.listings,
                props?.searchResults?.merchants, props?.results,
            ].filter(Boolean).find(function(l) { return Array.isArray(l) && l.length > 0; });

            if (!lists || !lists.length) return false;

            var results = [];
            lists.forEach(function(m) {
                var name = m.name || m.merchantName || m.merchant_name || m.title || '';
                if (!name) return;
                if (!matchQuery(name)) return;

                var cashbackPct = m.cashbackPct || m.cashback_pct || m.cashback || 0;
                var discountPct = m.discountPct || m.discount_percent || m.discount || 0;
                var minSpend = parsePrice(m.minSpend || m.min_spend || m.minimumSpend || 0);
                var avgCost = parsePrice(m.averageCost || m.avgCost || m.averagePrice || m.priceForTwo || 0) / 2;
                var rating = m.rating || m.avgRating || m.average_rating || '4.0';

                // Compute effective price
                var basePrice = avgCost || 150;
                var saving = 0;
                if (discountPct > 0) saving = Math.round(basePrice * discountPct / 100);
                var finalPrice = saving > 0 ? Math.max(basePrice - saving, 1) : basePrice;

                // Deal text
                var offerText = m.offerText || m.deal || m.dealText || m.tagline || '';
                if (!offerText && cashbackPct > 0) offerText = cashbackPct + '% Cashback on Magicpin';
                if (!offerText && discountPct > 0) offerText = discountPct + '% OFF';

                // Best coupon code from nested offers
                var coupon = '';
                var offers = m.offers || m.deals || m.coupons || [];
                if (Array.isArray(offers) && offers.length > 0) {
                    coupon = offers[0].code || offers[0].couponCode || '';
                    if (!offerText) offerText = offers[0].title || offers[0].description || '';
                }

                results.push({
                    dishName: name + (offerText ? ' — ' + offerText.slice(0, 60) : ''),
                    restaurantName: name,
                    dishImage: m.image || m.merchant_image || m.logo || m.imageUrl || '',
                    price: {
                        finalPayablePrice: finalPrice,
                        basePrice: Math.round(basePrice),
                        discount: saving
                    },
                    deliveryTime: m.eta || m.deliveryTime || '~30-40 mins',
                    rating: String(rating),
                    couponCode: coupon,
                    autoCouponSavings: saving,
                    offerStatus: (saving > 0 || cashbackPct > 0) ? 'LIVE_OFFER' : 'PUBLIC',
                    offerLabel: offerText || 'Magicpin Deal',
                    magicpinCashback: cashbackPct,
                    minSpend: minSpend,
                });
            });

            if (results.length > 0) { sendResults(results); return true; }
            return false;
        } catch(e) { return false; }
    }

    // ── API Interception (catches dynamic loads after __NEXT_DATA__) ─────────
    var origFetch = window.fetch;
    if (origFetch) {
        window.fetch = function() {
            var args = arguments;
            var url = typeof args[0] === 'string' ? args[0] : (args[0] && args[0].url ? args[0].url : '');
            return origFetch.apply(this, args).then(function(res) {
                var cloned = res.clone();
                var u = (url || '').toLowerCase();
                if (u.includes('merchant') || u.includes('outlet') || u.includes('search') ||
                    u.includes('listing') || u.includes('feed') || u.includes('restaurant')) {
                    cloned.json().then(function(data) {
                        try {
                            // Search common list fields
                            var lists = [
                                data?.data?.merchants, data?.merchants, data?.data?.restaurants,
                                data?.restaurants, data?.results, data?.data?.results,
                                data?.items, data?.data?.items,
                            ].filter(Boolean).find(function(l) { return Array.isArray(l) && l.length > 0; });

                            if (!lists) return;
                            var results = [];
                            lists.forEach(function(m) {
                                var name = m.name || m.merchantName || m.title || '';
                                if (!name || !matchQuery(name)) return;
                                var cashback = m.cashbackPct || m.cashback_pct || 0;
                                var disc = m.discountPct || m.discount || 0;
                                var base = parsePrice(m.averageCost || m.priceForTwo || 0) / 2 || 150;
                                var saving = disc > 0 ? Math.round(base * disc / 100) : 0;
                                results.push({
                                    dishName: name + (cashback > 0 ? ' — ' + cashback + '% Cashback' : disc > 0 ? ' — ' + disc + '% OFF' : ''),
                                    restaurantName: name,
                                    dishImage: m.image || '',
                                    price: { finalPayablePrice: Math.max(base - saving, 1), basePrice: base, discount: saving },
                                    deliveryTime: '~30-40 mins',
                                    rating: String(m.rating || '4.0'),
                                    couponCode: '',
                                    autoCouponSavings: saving,
                                    offerStatus: (saving > 0 || cashback > 0) ? 'LIVE_OFFER' : 'PUBLIC',
                                    offerLabel: cashback > 0 ? cashback + '% Cashback' : disc > 0 ? disc + '% OFF' : 'Magicpin Deal',
                                    magicpinCashback: cashback,
                                });
                            });
                            if (results.length > 0) sendResults(results);
                        } catch(e) {}
                    }).catch(function(){});
                }
                return res;
            });
        };
    }

    // ── Poll for __NEXT_DATA__ (Next.js populates it on load) ───────────────
    var attempts = 0;
    var maxAttempts = 20;
    function poll() {
        if (sent) return;
        attempts++;
        if (tryNextData()) return;
        if (attempts < maxAttempts) setTimeout(poll, 700);
        else {
            // Final fallback: send empty (public offers DB already shown instantly)
            window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'SEARCH_RESULTS', success: false, data: []
            }));
        }
    }
    // Give Next.js 1.5s to hydrate
    setTimeout(poll, 1500);

    // Hard timeout
    setTimeout(function() {
        if (!sent) window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'SEARCH_RESULTS', success: false, data: []
        }));
    }, 14000);
})();
true;
`;
    },

    getSearchUrl: (query: string, location?: any) => {
        // Magicpin URL format: magicpin.in/India/{City}/{Locality}/Restaurant
        const cityAliases: Record<string, string> = {
            'bengaluru': 'Bangalore', 'bengaluru, karnataka': 'Bangalore',
            'new delhi': 'New-Delhi', 'ncr': 'New-Delhi', 'delhi': 'New-Delhi',
            'gurugram': 'Gurgaon', 'gurgaon': 'Gurgaon',
            'bombay': 'Mumbai', 'mumbai': 'Mumbai',
        };

        let city = 'Bangalore';
        let locality = '';

        if (location?.name) {
            const parts = location.name.split(',').map((p: string) => p.trim());
            const rawCity = (parts[1] || parts[0] || '').toLowerCase();
            const rawLocality = parts[0] || '';

            city = cityAliases[rawCity] ||
                   cityAliases[rawCity.replace(/\s+/g, '-').toLowerCase()] ||
                   rawCity.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join('-');

            locality = rawLocality.split(' ')
                .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
                .join('-')
                .replace(/[^a-zA-Z0-9-]/g, '');
        }

        // Use locality if available, else city-level
        const base = locality && locality !== city
            ? `https://magicpin.in/India/${city}/${locality}/Restaurant`
            : `https://magicpin.in/India/${city}/Restaurant`;

        return base;
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
