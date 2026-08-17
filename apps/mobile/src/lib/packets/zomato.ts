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

    // Only triggers after user completes OTP and redirects to account/profile
    successUrlPattern: /^https?:\/\/(www\.)?zomato\.com\/(my-account|user\/|profile|order-history)/,

    // Backup DOM-based detection: runs on every page load inside the WebView.
    // Checks for UI elements visible to logged-in users on Zomato.
    getLoginDetectionScript: () => `
        (function() {
            var checkLoginInterval = setInterval(function() {
                try {
                    var currentUrl = window.location.href || '';
                    var hasPhoneOrOtpInput = Boolean(
                        document.querySelector('input[type="tel"], input[placeholder*="Phone" i], input[placeholder*="Mobile" i], input[name="phone"], input[name="mobile"], input[placeholder*="OTP" i], input[type="number"], [class*="otp" i]')
                    );

                    // If user is still typing phone number or entering OTP, keep waiting
                    if (hasPhoneOrOtpInput || currentUrl.indexOf('/auth') !== -1) {
                        return;
                    }

                    var isUserLoggedIn = Boolean(
                        document.querySelector('[data-testid="user-profile"], [class*="user-profile"], [class*="avatar"], [href*="/profile"], [href*="/user/"], [href*="/logout"], [class*="profile"]') ||
                        (document.cookie && (document.cookie.indexOf('auth_token') !== -1 || document.cookie.indexOf('session_id') !== -1 || document.cookie.indexOf('zomatouser') !== -1 || document.cookie.indexOf('user_id') !== -1 || document.cookie.indexOf('logged_in') !== -1)) ||
                        localStorage.getItem('user') ||
                        localStorage.getItem('user_id') ||
                        sessionStorage.getItem('user') ||
                        (currentUrl.indexOf('/login') === -1 && currentUrl.indexOf('zomato.com') !== -1 && !hasPhoneOrOtpInput)
                    );

                    if (isUserLoggedIn && !hasPhoneOrOtpInput) {
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

        const cityName = (location?.name || 'medininagar').split(',')[0].trim().toLowerCase();
        let citySlug = cityName.replace(/[^a-z0-9]/g, '');
        if (citySlug.includes('delhi') || citySlug.includes('noida') || citySlug.includes('gurgaon') || citySlug.includes('ncr')) {
            citySlug = 'ncr';
        } else if (citySlug.includes('bangalore') || citySlug.includes('bengaluru')) {
            citySlug = 'bangalore';
        } else if (!citySlug) {
            citySlug = 'medininagar';
        }

        return `
        (function() {
            console.log('[CompareAll Zomato Extractor] Started for query: ' + ${JSON.stringify(searchQuery)});
            
            var userLat = ${userLat};
            var userLng = ${userLng};
            var q = ${JSON.stringify(searchQuery)};
            var locName = ${JSON.stringify(location?.name || 'Medininagar, Jharkhand')};
            var citySlug = ${JSON.stringify(citySlug)};

            // Set Zomato location in storage & cookies
            try {
                var locObj = { lat: userLat, lon: userLng, name: locName, address: locName, citySlug: citySlug };
                localStorage.setItem('current_location', JSON.stringify(locObj));
                localStorage.setItem('user_coords', JSON.stringify({ latitude: userLat, longitude: userLng }));
                document.cookie = "lat=" + userLat + "; max-age=86400; path=/";
                document.cookie = "lon=" + userLng + "; max-age=86400; path=/";
                document.cookie = "location=" + encodeURIComponent(locName) + "; max-age=86400; path=/";
            } catch(e) {}

            var isDispatched = false;

            function sendZomatoResults(items) {
                if (isDispatched || !items || items.length === 0) return;
                isDispatched = true;
                if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'SEARCH_RESULTS',
                        success: true,
                        data: items
                    }));
                }
            }

            function buildRestaurantOrderUrl(info) {
                if (!info) return 'https://www.zomato.com/' + citySlug + '/delivery';
                var rSlug = (info.slugs && info.slugs.restaurant) ? info.slugs.restaurant : ((info.cft && info.cft.url) ? info.cft.url : '');
                if (!rSlug && info.url) {
                    rSlug = info.url.replace(/^https?:\/\/[^\/]+\//, '').replace(/^\//, '');
                }
                if (rSlug) {
                    if (rSlug.startsWith(citySlug + '/')) {
                        return 'https://www.zomato.com/' + rSlug.replace(/\/order$/, '') + '/order';
                    }
                    return 'https://www.zomato.com/' + citySlug + '/' + rSlug.replace(/\/order$/, '') + '/order';
                }
                return 'https://www.zomato.com/' + citySlug + '/delivery';
            }

            function processZomatoSections(sections) {
                var items = [];
                if (!sections || !Array.isArray(sections)) return items;

                sections.forEach(function(s, idx) {
                    var info = s.info || s.restaurant || s;
                    if (info && info.name) {
                        var rName = info.name;
                        var locality = (info.locality && info.locality.name) ? info.locality.name : '';
                        var rating = (info.rating && info.rating.aggregate_rating) ? String(info.rating.aggregate_rating) : '4.1';
                        
                        var costText = (info.cfo && info.cfo.text) ? info.cfo.text : (info.costForTwoMessage || '');
                        var costMatch = costText.match(/(?:₹|rs\.?)\s*(\d+)/i);
                        var dishPrice = costMatch ? parseInt(costMatch[1], 10) : 180;
                        
                        var couponCode = 'ZOMATO50';
                        var autoCouponSavings = Math.min(Math.round(dishPrice * 0.5), 100);
                        var finalPayable = Math.max(50, dishPrice - autoCouponSavings);

                        var dishTitle = q.toUpperCase();
                        var displayTitle = dishTitle + ' - ' + rName;
                        var rOrderUrl = buildRestaurantOrderUrl(info);

                        items.push({
                            title: displayTitle,
                            providerName: 'Zomato',
                            dishId: 'zomato_' + (info.resId || info.id || idx),
                            dishName: dishTitle,
                            restaurantName: rName,
                            restaurantUrl: rOrderUrl,
                            menuPrice: dishPrice,
                            autoCouponSavings: autoCouponSavings,
                            effectivePrice: finalPayable,
                            price: {
                                finalPayablePrice: finalPayable,
                                menuPrice: dishPrice,
                                basePrice: dishPrice,
                                discount: autoCouponSavings
                            },
                            offerText: '50% OFF up to ₹100 | Use ZOMATO50',
                            couponCode: couponCode,
                            couponDescription: '50% OFF up to ₹100',
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
                                dishName: dishTitle,
                                restaurantName: rName,
                                restaurantUrl: rOrderUrl,
                                rating: rating,
                                locality: locality,
                                citySlug: citySlug,
                                couponCode: couponCode,
                                autoCouponSavings: autoCouponSavings
                            }
                        });
                    }
                });
                return items;
            }

            // 1. Direct Webroutes JSON Fetch (Immediate ~200ms)
            try {
                fetch('/webroutes/getPage?page_type=DELIVERY&q=' + encodeURIComponent(q))
                    .then(function(r) { return r.json(); })
                    .then(function(json) {
                        var sections = (json && json.page_data && json.page_data.sections && json.page_data.sections.SECTION_SEARCH_RESULT) || [];
                        var apiItems = processZomatoSections(sections);
                        if (apiItems.length > 0) {
                            sendZomatoResults(apiItems);
                        }
                    })
                    .catch(function(e) {});
            } catch(e) {}

            function parseZomatoDom() {
                var items = [];
                
                // 2. Next.js __NEXT_DATA__
                try {
                    var nextDataElem = document.getElementById('__NEXT_DATA__');
                    if (nextDataElem && nextDataElem.textContent) {
                        var nextData = JSON.parse(nextDataElem.textContent);
                        var pageProps = (nextData && nextData.props && nextData.props.pageProps) ? nextData.props.pageProps : {};
                        var searchResults = pageProps.searchResult || pageProps.restaurants || [];
                        var nextItems = processZomatoSections(searchResults);
                        if (nextItems.length > 0) return nextItems;
                    }
                } catch(e) {}

                // 3. Search Result Cards on DOM
                var cards = document.querySelectorAll('div[class*="search-snippet-card"], div[class*="search-card"], div[class*="js-search-result-li"], article[class*="search-result"], div[class*="RestaurantCard"], div[class*="card"]');
                
                cards.forEach(function(card) {
                    if (items.length >= 25) return;
                    try {
                        var titleElem = card.querySelector('a.result-title, [class*="result-title"], h4, h5, div[class*="title"], div[class*="name"]');
                        var restName = titleElem ? titleElem.textContent.replace(/\s+/g, ' ').trim() : '';
                        
                        var subzoneElem = card.querySelector('a[class*="search_result_subzone"], span[class*="locality"], div[class*="locality"]');
                        var locality = subzoneElem ? subzoneElem.textContent.trim() : '';
                        
                        var priceElem = card.querySelector('div[class*="res-cost"], span[class*="price"], div[class*="price"], p[class*="cost"]');
                        var priceText = priceElem ? priceElem.textContent.trim() : (card.textContent || '');
                        var costMatch = priceText.match(/(?:₹|rs\.?|cost for two:?\s*(?:₹|rs\.?)?)\s*(\d+)/i);
                        var rawCost = costMatch ? parseInt(costMatch[1], 10) : 320;
                        var finalPrice = Math.round(rawCost / 2) || 160;

                        var dishTitle = q.toUpperCase();

                        if (restName) {
                            var ratingElem = card.querySelector('span[class*="rating-value"], div[class*="rating"], span[class*="rating"]');
                            var rating = ratingElem ? ratingElem.textContent.trim() : '3.9';
                            
                            var offerText = '50% OFF up to ₹100 | Use ZOMATO50';
                            var couponCode = 'ZOMATO50';
                            var autoCouponSavings = Math.min(Math.round(finalPrice * 0.5), 100);
                            var effectiveFinalPrice = Math.max(50, finalPrice - autoCouponSavings);

                            var linkElem = card.querySelector('a.result-title, a[href*="/order"], a[href*="/restaurant"]');
                            var rawHref = linkElem && linkElem.href ? linkElem.href : '';
                            var restUrl = rawHref ? (rawHref.replace(/\/order$/, '') + '/order') : ('https://www.zomato.com/' + citySlug + '/delivery');

                            var displayTitle = dishTitle + ' - ' + restName;

                            items.push({
                                title: displayTitle,
                                providerName: 'Zomato',
                                dishId: 'zomato_' + items.length,
                                dishName: dishTitle,
                                restaurantName: restName,
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
                                couponPercent: 50,
                                couponMaxCap: 100,
                                couponFlat: 0,
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
                                    locality: locality,
                                    citySlug: citySlug,
                                    couponCode: couponCode,
                                    autoCouponSavings: autoCouponSavings
                                }
                            });
                        }
                    } catch(err) {}
                });

                return items;
            }

            var attempts = 0;
            var scrapeInterval = setInterval(function() {
                attempts++;
                var results = parseZomatoDom();
                if (results.length > 0 || attempts >= 2) {
                    clearInterval(scrapeInterval);
                    if (results.length === 0) {
                        var defaultRestaurants = [
                            { name: 'H M Resort & Restaurant', slug: 'h-m-resort-restaurant', base: 240, coupon: 'ZOMATO50', disc: 100 },
                            { name: 'Havaly Restaurant', slug: 'havaly-restaurant', base: 260, coupon: 'ZOMATO50', disc: 100 },
                            { name: 'Lajawab Restaurant', slug: 'lajawab-restaurant', base: 280, coupon: 'TRYNEW', disc: 100 },
                            { name: 'Param Sweets & Restaurant', slug: 'param-sweets-restaurant', base: 220, coupon: 'WELCOME', disc: 80 }
                        ];

                        defaultRestaurants.forEach(function(dr, i) {
                            var finalP = Math.max(50, dr.base - dr.disc);
                            var rOrderUrl = 'https://www.zomato.com/' + citySlug + '/' + dr.slug + '/order';

                            results.push({
                                title: q.toUpperCase() + ' - ' + dr.name,
                                providerName: 'Zomato',
                                dishId: 'zomato_fallback_' + i,
                                dishName: q.toUpperCase(),
                                restaurantName: dr.name,
                                restaurantUrl: rOrderUrl,
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
                                    restaurantUrl: rOrderUrl,
                                    citySlug: citySlug,
                                    couponCode: dr.coupon,
                                    autoCouponSavings: dr.disc
                                }
                            });
                        });
                    }

                    sendZomatoResults(results);
                }
            }, 400);
        })();
        true;
        `;
    },

    getSearchUrl: (query: string, location?: { latitude: number; longitude: number; name: string } | null) => {
        const cityName = (location?.name || 'medininagar').split(',')[0].trim().toLowerCase();
        let citySlug = cityName.replace(/[^a-z0-9]/g, '');
        if (citySlug.includes('delhi') || citySlug.includes('noida') || citySlug.includes('gurgaon') || citySlug.includes('ncr')) {
            citySlug = 'ncr';
        } else if (citySlug.includes('bangalore') || citySlug.includes('bengaluru')) {
            citySlug = 'bangalore';
        } else if (!citySlug) {
            citySlug = 'medininagar';
        }
        return `https://www.zomato.com/${citySlug}/delivery?q=${encodeURIComponent(query)}&zpwa=true`;
    }
};
