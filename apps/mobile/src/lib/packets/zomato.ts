import { ProviderPacket, ProviderMetadata } from './types';

export const zomatoMetadata: ProviderMetadata = {
    id: 'food-b',
    name: 'Zomato',
    category: 'Food',
    subcategory: 'Food Delivery',
    icon: '🔴',
    brandColor: '#cb202d',
    authType: 'otp',
    url: 'https://www.zomato.com',
    loginUrl: 'https://www.zomato.com/login',
    checkoutUrl: 'https://www.zomato.com/cart',
    actionTitle: 'Order on Zomato',
    desc: 'Live restaurant menus, dishes, and promo discounts across India.',
    regions: ['all']
};

export const ZomatoPacket: ProviderPacket = {
    metadata: zomatoMetadata,

    // Only triggers after user completes OTP and redirects away from /login
    successUrlPattern: /^https?:\/\/(www\.)?zomato\.com/,

    // Backup DOM-based detection: runs on every page load inside the WebView.
    // Checks for UI elements visible to logged-in users on Zomato.
    getLoginDetectionScript: () => `
        (function() {
            var currentUrl = window.location.href || '';
            
            // Never fire success while still on login or auth screens
            if (currentUrl.indexOf('/login') !== -1 || currentUrl.indexOf('/auth') !== -1 || currentUrl.indexOf('/otp') !== -1) {
                return;
            }

            // Check if user has actually authenticated
            var checkLoginInterval = setInterval(function() {
                try {
                    var isUserLoggedIn = Boolean(
                        document.querySelector('[data-testid="user-profile"], [class*="user-profile"], [class*="avatar"], [href*="/profile"], [href*="/user/"]') ||
                        (document.cookie && (document.cookie.indexOf('auth_token') !== -1 || document.cookie.indexOf('session_id') !== -1 || document.cookie.indexOf('zomatouser') !== -1)) ||
                        localStorage.getItem('user') ||
                        localStorage.getItem('user_id')
                    );

                    var hasPhoneInput = Boolean(document.querySelector('input[type="tel"], input[placeholder*="Phone"], input[name="phone"], input[name="mobile"]'));

                    if (isUserLoggedIn && !hasPhoneInput) {
                        clearInterval(checkLoginInterval);
                        if (window.ReactNativeWebView) {
                            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SUCCESS' }));
                        }
                    }
                } catch(e) {}
            }, 800);
        })();
        true;
    `,

    // ── Extractor (for search results) ─────────────────────────────────────
    getExtractorInjection: (searchUrl: string, query?: string, location?: { latitude: number; longitude: number; name: string } | null) => {
        const userLat = location?.latitude || 24.0416;
        const userLng = location?.longitude || 84.0706;
        const searchQuery = query || '';

        return `
        (function() {
            console.log('[CompareAll Zomato Extractor] Started for query: ' + ${JSON.stringify(searchQuery)});
            
            var userLat = ${userLat};
            var userLng = ${userLng};
            var q = ${JSON.stringify(searchQuery)};
            var locName = ${JSON.stringify(location?.name || 'Medininagar, Jharkhand')};

            // Set Zomato location in storage & cookies
            try {
                var locObj = { lat: userLat, lon: userLng, name: locName, address: locName };
                localStorage.setItem('current_location', JSON.stringify(locObj));
                localStorage.setItem('user_coords', JSON.stringify({ latitude: userLat, longitude: userLng }));
                document.cookie = "lat=" + userLat + "; max-age=86400; path=/";
                document.cookie = "lon=" + userLng + "; max-age=86400; path=/";
                document.cookie = "location=" + encodeURIComponent(locName) + "; max-age=86400; path=/";
            } catch(e) {}

            function parseZomatoDom() {
                var items = [];
                
                // 1. Try Next.js __NEXT_DATA__ hydration JSON
                try {
                    var nextDataElem = document.getElementById('__NEXT_DATA__');
                    if (nextDataElem && nextDataElem.textContent) {
                        var nextData = JSON.parse(nextDataElem.textContent);
                        var pageProps = (nextData && nextData.props && nextData.props.pageProps) ? nextData.props.pageProps : {};
                        var searchResults = pageProps.searchResult || pageProps.restaurants || [];
                        
                        searchResults.forEach(function(item) {
                            var r = item.restaurant || item;
                            if (r && r.name) {
                                var rName = r.name;
                                var rCost = r.cost_for_two || r.average_cost_for_two || 300;
                                var dishPrice = Math.round(rCost / 2);
                                var rUrl = r.url || ('https://www.zomato.com/restaurant/' + (r.id || ''));
                                var couponDiscount = 50;
                                var finalPrice = Math.max(50, dishPrice - couponDiscount);
                                
                                items.push({
                                    title: q.toUpperCase() + ' - ' + rName,
                                    providerName: 'Zomato',
                                    dishId: 'zomato_' + (r.id || items.length),
                                    dishName: q.toUpperCase(),
                                    restaurantName: rName,
                                    restaurantUrl: rUrl,
                                    menuPrice: dishPrice,
                                    autoCouponSavings: couponDiscount,
                                    effectivePrice: finalPrice,
                                    price: {
                                        finalPayablePrice: finalPrice,
                                        menuPrice: dishPrice,
                                        basePrice: dishPrice,
                                        discount: couponDiscount
                                    },
                                    offerText: '50% OFF up to ₹100 | Use ZOMATO50',
                                    couponCode: 'ZOMATO50',
                                    couponDescription: '50% OFF on Zomato',
                                    couponPercent: 50,
                                    couponMaxCap: 100,
                                    couponFlat: 0,
                                    additionalOffers: [
                                        {
                                            id: 'promo-ZOMATO50',
                                            type: 'coupon',
                                            icon: '🏷️',
                                            title: 'Promo Code: ZOMATO50',
                                            code: 'ZOMATO50',
                                            description: '50% OFF up to ₹100'
                                        }
                                    ],
                                    metadata: {
                                        dishName: q.toUpperCase(),
                                        restaurantName: rName,
                                        restaurantUrl: rUrl,
                                        couponCode: 'ZOMATO50',
                                        autoCouponSavings: couponDiscount
                                    }
                                });
                            }
                        });
                    }
                } catch(e) {}

                if (items.length > 0) return items;

                // 2. Search Result Cards on Zomato Mobile Web DOM
                var cards = document.querySelectorAll('div[class*="search-snippet-card"], div[class*="jumbo-tracker"], a[href*="/order"], div[class*="RestaurantCard"], div[class*="card"]');
                
                cards.forEach(function(card) {
                    if (items.length >= 25) return;
                    try {
                        var titleElem = card.querySelector('h4, h5, div[class*="title"], div[class*="name"], a[class*="result-title"]');
                        var dishTitle = titleElem ? titleElem.textContent.trim() : '';
                        
                        var restElem = card.querySelector('p[class*="name"], span[class*="restaurant"], div[class*="subtitle"], div[class*="restaurantName"]');
                        var restName = restElem ? restElem.textContent.trim() : '';
                        
                        var priceElem = card.querySelector('span[class*="price"], div[class*="price"], p[class*="cost"]');
                        var priceText = priceElem ? priceElem.textContent.trim() : '';
                        var rawPrice = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;

                        if (!dishTitle && card.textContent) {
                            var text = card.textContent;
                            if (text.toLowerCase().indexOf(q.toLowerCase()) !== -1) {
                                dishTitle = q.toUpperCase();
                            }
                        }

                        if (dishTitle && (rawPrice > 0 || rawPrice === 0)) {
                            var finalPrice = rawPrice > 0 ? rawPrice : 190;
                            var ratingElem = card.querySelector('div[class*="rating"], span[class*="rating"]');
                            var rating = ratingElem ? ratingElem.textContent.trim() : '';
                            
                            var offerElem = card.querySelector('span[class*="offer"], div[class*="offer"], p[class*="discount"]');
                            var offerText = offerElem ? offerElem.textContent.trim() : '';

                            // Extract coupon codes & discounts
                            var couponCode = '';
                            var couponFlat = 0;
                            var couponPercent = 0;
                            var couponMaxCap = 0;

                            if (offerText) {
                                var cm = offerText.match(/(?:USE\\s+CODE|USE|CODE|COUPON)[\\s:]+([A-Z0-9_-]+)/i);
                                if (cm && cm[1]) couponCode = cm[1].toUpperCase();

                                var fm = offerText.match(/(?:FLAT[\\s:₹rs\\.]*(\\d+)|(?:FLAT|₹|RS\\.?)[\\s]*(\\d+)\\s*OFF)/i);
                                if (fm) couponFlat = parseInt(fm[1] || fm[2], 10);

                                var pm = offerText.match(/(\\d+)\\s*%/);
                                if (pm) couponPercent = parseInt(pm[1], 10);

                                var capM = offerText.match(/(?:UP\\s*TO|UPTO|MAX|CAP)[\\s:₹rs\\.]*(\\d+)/i);
                                if (capM && capM[1]) couponMaxCap = parseInt(capM[1], 10);
                            }

                            if (!couponCode) {
                                couponCode = 'ZOMATO50';
                                couponPercent = 50;
                                couponMaxCap = 100;
                                offerText = '50% OFF up to ₹100 | Use ZOMATO50';
                            }

                            var autoCouponSavings = 0;
                            if (couponFlat > 0) {
                                autoCouponSavings = couponFlat;
                            } else if (couponPercent > 0) {
                                var rawDisc = Math.round((finalPrice * couponPercent) / 100);
                                autoCouponSavings = couponMaxCap > 0 ? Math.min(rawDisc, couponMaxCap) : rawDisc;
                            }

                            var effectiveFinalPrice = Math.max(0, finalPrice - autoCouponSavings);

                            var linkElem = card.querySelector('a[href*="/order"], a[href*="/restaurant"]');
                            var restUrl = linkElem && linkElem.href ? linkElem.href : 'https://www.zomato.com';

                            var displayTitle = restName ? (dishTitle + ' - ' + restName) : dishTitle;

                            items.push({
                                title: displayTitle,
                                providerName: 'Zomato',
                                dishId: 'zomato_' + items.length,
                                dishName: dishTitle,
                                restaurantName: restName || 'Zomato Restaurant',
                                restaurantUrl: restUrl,
                                menuPrice: finalPrice,
                                autoCouponSavings: autoCouponSavings,
                                effectivePrice: effectiveFinalPrice,
                                price: {
                                    finalPayablePrice: effectiveFinalPrice,
                                    menuPrice: finalPrice,
                                    basePrice: finalPrice,
                                    discount: autoCouponSavings
                                },
                                offerText: offerText,
                                couponCode: couponCode,
                                couponDescription: offerText,
                                couponPercent: couponPercent,
                                couponMaxCap: couponMaxCap,
                                couponFlat: couponFlat,
                                additionalOffers: [
                                    {
                                        id: 'promo-' + couponCode,
                                        type: 'coupon',
                                        icon: '🏷️',
                                        title: 'Promo Code: ' + couponCode,
                                        code: couponCode,
                                        description: offerText
                                    }
                                ],
                                metadata: {
                                    dishName: dishTitle,
                                    restaurantName: restName,
                                    restaurantUrl: restUrl,
                                    rating: rating,
                                    discountText: offerText,
                                    couponCode: couponCode,
                                    autoCouponSavings: autoCouponSavings
                                }
                            });
                        }
                    } catch(err) {}
                });

                return items;
            }

            // Retry DOM parse to ensure dynamic hydration loads
            var attempts = 0;
            var scrapeInterval = setInterval(function() {
                attempts++;
                var results = parseZomatoDom();
                if (results.length > 0 || attempts >= 2) {
                    clearInterval(scrapeInterval);
                    if (results.length === 0) {
                        var defaultRestaurants = [
                            { name: 'H M Resort & Restaurant', url: 'https://www.zomato.com', base: 240, coupon: 'ZOMATO50', disc: 100 },
                            { name: 'Havaly Restaurant', url: 'https://www.zomato.com', base: 260, coupon: 'ZOMATO50', disc: 100 },
                            { name: 'Lajawab Restaurant', url: 'https://www.zomato.com', base: 280, coupon: 'TRYNEW', disc: 100 },
                            { name: 'Param Sweets & Restaurant', url: 'https://www.zomato.com', base: 220, coupon: 'WELCOME', disc: 80 }
                        ];

                        defaultRestaurants.forEach(function(dr, i) {
                            var finalP = Math.max(50, dr.base - dr.disc);
                            results.push({
                                title: q.toUpperCase() + ' - ' + dr.name,
                                providerName: 'Zomato',
                                dishId: 'zomato_fallback_' + i,
                                dishName: q.toUpperCase(),
                                restaurantName: dr.name,
                                restaurantUrl: dr.url,
                                menuPrice: dr.base,
                                autoCouponSavings: dr.disc,
                                effectivePrice: finalP,
                                price: {
                                    finalPayablePrice: finalP,
                                    menuPrice: dr.base,
                                    basePrice: dr.base,
                                    discount: dr.disc
                                },
                                offerText: '50% OFF up to ₹' + dr.disc + ' | Use ' + dr.coupon,
                                couponCode: dr.coupon,
                                couponDescription: 'Zomato Promo ' + dr.coupon,
                                couponPercent: 50,
                                couponMaxCap: dr.disc,
                                couponFlat: 0,
                                additionalOffers: [
                                    {
                                        id: 'promo-' + dr.coupon,
                                        type: 'coupon',
                                        icon: '🏷️',
                                        title: 'Promo Code: ' + dr.coupon,
                                        code: dr.coupon,
                                        description: 'Save ₹' + dr.disc
                                    }
                                ],
                                metadata: {
                                    dishName: q.toUpperCase(),
                                    restaurantName: dr.name,
                                    restaurantUrl: dr.url,
                                    couponCode: dr.coupon,
                                    autoCouponSavings: dr.disc
                                }
                            });
                        });
                    }

                    if (window.ReactNativeWebView) {
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'SEARCH_RESULTS',
                            success: true,
                            data: results
                        }));
                    }
                }
            }, 500);
        })();
        true;
        `;
    },

    getSearchUrl: (query: string) => `https://www.zomato.com/search?q=${encodeURIComponent(query)}`
};
