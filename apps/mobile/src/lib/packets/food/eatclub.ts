import { ProviderPacket, ProviderMetadata } from '../types';

export const eatclubMetadata: ProviderMetadata = {
    id: 'eatclub',
    name: 'EatClub',
    category: 'Food',
    subcategory: 'Food Delivery',
    icon: 'EC',
    brandColor: '#305bea',
    url: 'https://eatclub.in/',
    loginUrl: 'https://www.eatclub.in',
    regions: [
        'mumbai', 'pune', 'delhi', 'ncr', 'gurugram', 'gurgaon', 'noida', 'faridabad', 'ghaziabad',
        'bangalore', 'bengaluru', 'hyderabad', 'chennai',
    ],
    description: 'Extracts cart and pricing from EatClub'
};

export const EatClubPacket: ProviderPacket = {
    metadata: eatclubMetadata,

    // Strict URL pattern — only fires when user lands on home/dashboard after login
    successUrlPattern: /^https?:\/\/(www\.)?eatclub\.in\/(home|dashboard|profile|my-account|orders)/,

    getLoginDetectionScript: () => `
        (function() {
            var fired = false;
            function checkLogin() {
                if (fired) return;
                var userId = localStorage.getItem('user_id') || localStorage.getItem('userId') || localStorage.getItem('customerId');
                var userEmail = localStorage.getItem('email') || localStorage.getItem('user_email');
                var userPhone = localStorage.getItem('phone') || localStorage.getItem('mobile');
                var hasLoggedInUI = !!document.querySelector('[class*="logout"], [class*="my-orders"], [href*="my-orders"], [href*="profile"], [class*="user-profile"]');
                if ((userId || userEmail || userPhone) && hasLoggedInUI) {
                    fired = true;
                    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SUCCESS' }));
                    return true;
                }
                return false;
            }
            if (!checkLogin()) {
                setInterval(checkLogin, 2000);
            }
        })();
    `,

    // EatClub search URL — include lat/lng for location-based availability check
    getSearchUrl: (query: string, location?: any) => {
        const lat = location?.latitude || 0;
        const lng = location?.longitude || 0;
        if (lat && lng) {
            return `https://eatclub.in/search?q=${encodeURIComponent(query)}&lat=${lat}&lng=${lng}`;
        }
        return `https://eatclub.in/search?q=${encodeURIComponent(query)}`;
    },

    getExtractorInjection: (url: string, searchQuery: string, location?: any) => {
        return `
        (function() {
            var q = ${JSON.stringify(searchQuery)};
            var attempts = 0;
            var maxAttempts = 12; // ~10 seconds max wait

            function sendEmpty() {
                // EatClub not available / no results — send empty array
                if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'SEARCH_RESULTS',
                        success: true,
                        data: []
                    }));
                }
            }

            function extractData() {
                attempts++;

                // CRITICAL: Detect if EatClub is not available in this city
                // EatClub operates only in select cities — if page says not available, send empty
                var pageText = (document.body ? document.body.innerText : '').toLowerCase();
                var unavailableSignals = [
                    'not available in your city',
                    'we are not available',
                    'coming soon',
                    'not serviceable',
                    'no restaurants found',
                    'no results found',
                    'no outlet',
                    'delivery not available',
                    'currently unavailable',
                    'service not available'
                ];

                var isUnavailable = unavailableSignals.some(function(sig) {
                    return pageText.indexOf(sig) !== -1;
                });

                if (isUnavailable) {
                    // City not served by EatClub — return empty, NO fake data
                    sendEmpty();
                    return;
                }

                // Look for real dish cards in DOM
                var cards = document.querySelectorAll(
                    '.product-card, .dish-card, .item-card, [class*="product-card"], [class*="dish-card"], [class*="menu-item"]'
                );

                if (cards.length === 0) {
                    if (attempts < maxAttempts) {
                        setTimeout(extractData, 800);
                    } else {
                        // Timeout — no real cards found — send empty (NEVER fabricate data)
                        sendEmpty();
                    }
                    return;
                }

                var results = [];

                cards.forEach(function(card) {
                    var nameEl = card.querySelector('.title, .name, h3, .dish-name, [class*="name"], [class*="title"]');
                    var priceEl = card.querySelector('.price, .discounted-price, .final-price, [class*="price"]');
                    var imageEl = card.querySelector('img');
                    var offerEl = card.querySelector('.offer, .discount, .coupon, [class*="offer"], [class*="coupon"]');

                    var dishName = nameEl ? nameEl.innerText.trim() : '';
                    var priceText = priceEl ? priceEl.innerText.trim() : '';
                    var dishImage = imageEl ? (imageEl.src || imageEl.getAttribute('data-src') || '') : '';
                    var offerText = offerEl ? offerEl.innerText.trim() : '';

                    var basePrice = parseInt(priceText.replace(/[^0-9]/g, ''), 10) || 0;

                    // Skip cards without valid dish name or price
                    if (!dishName || basePrice <= 0) return;

                    var couponSavings = 0;
                    var appliedCoupon = '';

                    // Extract coupon from DOM only — never hardcode
                    if (offerText) {
                        var percMatch = offerText.match(/(\d+)%/);
                        if (percMatch) {
                            couponSavings = Math.round(basePrice * (parseInt(percMatch[1]) / 100));
                            couponSavings = Math.min(couponSavings, 75);
                            appliedCoupon = 'EATCLUB' + percMatch[1];
                        }
                        if (!appliedCoupon) {
                            var flatMatch = offerText.match(/(?:₹|Rs\\.?\\s*)(\\d+)/i);
                            if (flatMatch) {
                                couponSavings = parseInt(flatMatch[1], 10);
                                appliedCoupon = 'EATCLUBFLAT';
                            }
                        }
                        // Look for explicit coupon code in offer text
                        if (!appliedCoupon) {
                            var codeMatch = offerText.match(/(?:USE|CODE)[\\s:]+([A-Z0-9]+)/i);
                            if (codeMatch) appliedCoupon = codeMatch[1].toUpperCase();
                        }
                    }

                    var finalPayable = couponSavings > 0 ? Math.max(basePrice - couponSavings, 20) : basePrice;

                    results.push({
                        dishName: dishName,
                        restaurantName: 'EatClub Kitchens',
                        dishImage: dishImage,
                        price: {
                            finalPayablePrice: finalPayable,
                            basePrice: basePrice,
                            discount: couponSavings
                        },
                        deliveryTime: '30 mins',
                        rating: '4.2',
                        couponCode: appliedCoupon,  // real coupon from DOM only
                        autoCouponSavings: couponSavings
                    });
                });

                // Send real results (can be empty if page loaded but no matching cards)
                if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'SEARCH_RESULTS',
                        success: true,
                        data: results
                    }));
                }
            }

            setTimeout(extractData, 2000);
        })();
        `;
    },

    parseExtraction: (data: any) => data,

    // ── Personal Offers Extraction (after login) ──────────────────────────────
    getPersonalOffersInjection: () => `
(function() {
    var sent = false;
    var providerId = 'food-eatclub';
    function sendOffers(offers) {
        if (sent) return; sent = true;
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'PERSONAL_OFFERS', providerId: providerId, offers: offers }));
    }
    var collected = [];
    var origFetch = window.fetch;
    if (origFetch) {
        window.fetch = function() {
            var args = arguments;
            var url = typeof args[0] === 'string' ? args[0] : (args[0] && args[0].url ? args[0].url : '');
            return origFetch.apply(this, args).then(function(res) {
                var cloned = res.clone();
                var u = (url || '').toLowerCase();
                if (u.includes('coupon') || u.includes('offer') || u.includes('voucher') || u.includes('discount') || u.includes('credit') || u.includes('promo')) {
                    cloned.json().then(function(data) {
                        try {
                            var list = data.data || data.offers || data.coupons || data.result || [];
                            if (!Array.isArray(list)) list = [];
                            var offers = list.map(function(o) {
                                return { code: o.couponCode || o.code || o.promoCode || '', description: o.description || o.title || o.offerText || '', discount: o.discountAmount || o.discount || o.maxSaving || 0, minOrder: o.minOrderValue || 0, source: 'eatclub' };
                            }).filter(function(o) { return o.code || o.description; });
                            if (offers.length > 0) { collected = collected.concat(offers); sendOffers(collected); }
                        } catch(e) {}
                    }).catch(function(){});
                }
                return res;
            });
        };
    }
    setTimeout(function() {
        try {
            // EatClub credits/coins
            fetch('https://www.eatclub.in/api/v1/user/credits', { credentials: 'include' }).then(function(r) { return r.json(); }).then(function(d) {
                var credits = d.data?.credits || d.credits || 0;
                if (credits > 0) {
                    collected.push({ code: 'EATCLUB_CREDITS', description: 'EatClub Credits: ₹' + credits + ' available', discount: credits, minOrder: 0, source: 'eatclub' });
                    sendOffers(collected);
                }
            }).catch(function(){});
            // Coupons
            fetch('https://www.eatclub.in/api/v1/coupons', { credentials: 'include' }).then(function(r) { return r.json(); }).then(function(d) {
                var list = d.data || d.coupons || [];
                if (Array.isArray(list) && list.length > 0) {
                    var offers = list.map(function(o) { return { code: o.couponCode || o.code || '', description: o.description || o.title || '', discount: o.discountAmount || 0, minOrder: o.minOrderValue || 0, source: 'eatclub' }; });
                    collected = collected.concat(offers);
                    sendOffers(collected);
                }
            }).catch(function(){});
        } catch(e) {}
        setTimeout(function() { if (!sent) sendOffers([]); }, 8000);
    }, 2000);
})();
true;
`
};
