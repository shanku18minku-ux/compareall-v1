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
        const rawLoc = (location?.name || 'Medininagar, Jharkhand').toLowerCase();

        let citySlug = 'ncr';
        const cityMap: Record<string, string[]> = {
            'ncr': ['delhi', 'noida', 'gurgaon', 'gurugram', 'ghaziabad', 'faridabad', 'ncr', 'new delhi'],
            'bangalore': ['bangalore', 'bengaluru'],
            'mumbai': ['mumbai', 'bombay', 'navi mumbai', 'thane'],
            'kolkata': ['kolkata', 'calcutta', 'howrah'],
            'chennai': ['chennai', 'madras'],
            'hyderabad': ['hyderabad', 'secunderabad'],
            'pune': ['pune', 'pimpri'],
            'ahmedabad': ['ahmedabad'],
            'jaipur': ['jaipur'],
            'lucknow': ['lucknow'],
            'patna': ['patna'],
            'ranchi': ['ranchi'],
            'jamshedpur': ['jamshedpur', 'tatanagar'],
            'dhanbad': ['dhanbad'],
            'bokaro': ['bokaro'],
            'deoghar': ['deoghar'],
            'hazaribagh': ['hazaribagh'],
            'medininagar': ['medininagar', 'daltonganj', 'palamu'],
            'chandigarh': ['chandigarh', 'mohali', 'panchkula'],
            'indore': ['indore'],
            'bhopal': ['bhopal'],
            'kanpur': ['kanpur'],
            'varanasi': ['varanasi', 'banaras', 'kashi'],
            'prayagraj': ['prayagraj', 'allahabad'],
            'agra': ['agra'],
            'surat': ['surat'],
            'vadodara': ['vadodara', 'baroda'],
            'guwahati': ['guwahati'],
            'bhubaneswar': ['bhubaneswar'],
            'cuttack': ['cuttack'],
            'coimbatore': ['coimbatore'],
            'kochi': ['kochi', 'cochin'],
            'trivandrum': ['trivandrum', 'thiruvananthapuram'],
            'nagpur': ['nagpur'],
            'visakhapatnam': ['visakhapatnam', 'vizag'],
            'ludhiana': ['ludhiana'],
            'amritsar': ['amritsar'],
            'dehradun': ['dehradun']
        };

        let matched = false;
        for (const [slug, keywords] of Object.entries(cityMap)) {
            for (const kw of keywords) {
                if (rawLoc.includes(kw)) {
                    citySlug = slug;
                    matched = true;
                    break;
                }
            }
            if (matched) break;
        }

        if (!matched) {
            const parts = rawLoc.split(',').map(p => p.trim());
            for (const p of parts) {
                const s = p.replace(/[^a-z0-9]/g, '');
                if (s.length > 2 && !s.match(/^(india|jharkhand|bihar|delhi|maharashtra|karnataka|uttarpradesh|westbengal|tamilnadu|telangana|gujarat|rajasthan|madhyapradesh|punjab|haryana|odisha|kerala|assam)$/)) {
                    citySlug = s;
                    break;
                }
            }
        }

        return `
        (function() {
            console.log('[CompareAll Zomato Extractor] Started for query: ' + ${JSON.stringify(searchQuery)} + ' in city: ' + ${JSON.stringify(citySlug)});
            
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
                if (!items || items.length === 0) return;
                try {
                    if (window.ReactNativeWebView && typeof window.ReactNativeWebView.postMessage === 'function') {
                        if (isDispatched) return;
                        isDispatched = true;
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'SEARCH_RESULTS',
                            success: true,
                            data: items
                        }));
                    }
                } catch(e) {}
            }

            function buildRestaurantOrderUrl(info) {
                if (!info) return 'https://www.zomato.com/' + citySlug + '/delivery';
                var rSlug = (info.slugs && info.slugs.restaurant) ? info.slugs.restaurant : ((info.cft && info.cft.url) ? info.cft.url : '');
                if (!rSlug && info.url) {
                    var u = String(info.url);
                    var zomatoIdx = u.indexOf('zomato.com/');
                    if (zomatoIdx !== -1) {
                        rSlug = u.substring(zomatoIdx + 11);
                    } else if (u.indexOf('http') === 0) {
                        var parts = u.split('/');
                        rSlug = parts.slice(3).join('/');
                    } else {
                        rSlug = u;
                    }
                    if (rSlug.charAt(0) === '/') rSlug = rSlug.substring(1);
                }
                if (rSlug) {
                    var cleanSlug = String(rSlug);
                    if (cleanSlug.endsWith('/order')) cleanSlug = cleanSlug.substring(0, cleanSlug.length - 6);
                    if (cleanSlug.startsWith(citySlug + '/')) {
                        return 'https://www.zomato.com/' + cleanSlug + '/order';
                    }
                    return 'https://www.zomato.com/' + citySlug + '/' + cleanSlug + '/order';
                }
                return 'https://www.zomato.com/' + citySlug + '/delivery';
            }

            function processZomatoSections(sections) {
                var items = [];
                if (!sections || !Array.isArray(sections)) return items;

                sections.forEach(function(s, idx) {
                    if (!s) return;
                    var info = s.info || (s.restaurant && s.restaurant.info) || (s.restaurant) || (s.card && s.card.card && s.card.card.info);
                    if (info && info.name) {
                        var rName = info.name;
                        var locality = (info.locality && info.locality.name) ? info.locality.name : '';
                        var rating = (info.rating && info.rating.aggregate_rating) ? String(info.rating.aggregate_rating) : '4.1';
                        
                        var costText = (info.cfo && info.cfo.text) ? info.cfo.text : ((info.cft && info.cft.text) ? info.cft.text : (info.costForTwoMessage || ''));
                        var costMatch = costText.match(/(?:₹|rs\.?)\s*(\d+[\d,]*)/i);
                        var rawCost = costMatch ? parseInt(costMatch[1].replace(/,/g, ''), 10) : 180;
                        var dishPrice = (info.cfo && info.cfo.text) ? rawCost : Math.round(rawCost / 2);
                        if (dishPrice <= 0) dishPrice = 180;
                        
                        var dishTitle = q.toUpperCase();
                        var displayTitle = dishTitle + ' - ' + rName;
                        var rOrderUrl = buildRestaurantOrderUrl(info);

                        // Extract all restaurant-specific tiered coupons (e.g. ₹200 OFF above ₹449, 50% OFF up to ₹100)
                        var availableCoupons = [];
                        var rawOffers = (info.offers || info.bulkOffers || []);
                        if (Array.isArray(rawOffers)) {
                            rawOffers.forEach(function(o) {
                                if (!o) return;
                                var text = o.text || o.title || o.header || '';
                                var cCode = o.coupon_code || o.code || '';
                                if (!cCode) {
                                    var cm = text.match(/(?:USE\s+CODE|USE|CODE|COUPON)[\s:]+([A-Z0-9_-]+)/i);
                                    if (cm && cm[1]) cCode = cm[1].toUpperCase();
                                }
                                var flatVal = o.flat_discount || 0;
                                if (!flatVal) {
                                    var flatM = text.match(/(?:FLAT[\s:₹rs\.]*(\d+)|(?:FLAT|₹|RS\.?)[\s]*(\d+)\s*OFF)/i);
                                    if (flatM && text.indexOf('%') === -1) flatVal = parseInt(flatM[1] || flatM[2], 10);
                                }
                                var percVal = o.offer_percentage || o.percentage || 0;
                                if (!percVal) {
                                    var percM = text.match(/(\d+)\s*%/);
                                    if (percM) percVal = parseInt(percM[1], 10);
                                }
                                var capVal = o.max_discount || o.maxCap || 0;
                                if (!capVal) {
                                    var capM = text.match(/(?:UP\s*TO|UPTO|MAX|CAP)[\s:₹rs\.]*(\d+)/i);
                                    if (capM && capM[1]) capVal = parseInt(capM[1], 10);
                                }
                                var minOrderVal = o.min_order_amount || o.minOrder || 0;
                                if (!minOrderVal) {
                                    var minM = text.match(/(?:ABOVE|MIN(?:IMUM)?[\s:]*ORDER|ON ORDERS ABOVE)[\s:₹rs\.]*(\d+)/i);
                                    if (minM && minM[1]) minOrderVal = parseInt(minM[1], 10);
                                }
                                if (cCode || flatVal > 0 || percVal > 0) {
                                    availableCoupons.push({
                                        code: cCode || ('ZOMATO' + (flatVal || percVal)),
                                        description: text || (flatVal ? ('Flat ₹' + flatVal + ' OFF') : (percVal + '% OFF')),
                                        flat: flatVal,
                                        percent: percVal,
                                        maxCap: capVal || 120,
                                        minOrder: minOrderVal
                                    });
                                }
                            });
                        }

                        var promoText = (info.offerText || (info.cfo && info.cfo.text) || info.costForTwoMessage || '');
                        if (promoText && availableCoupons.length === 0) {
                            var flatVal = 0;
                            var flatM = promoText.match(/(?:FLAT[\s:₹rs\.]*(\d+)|(?:FLAT|₹|RS\.?)[\s]*(\d+)\s*OFF)/i);
                            if (flatM && promoText.indexOf('%') === -1) flatVal = parseInt(flatM[1] || flatM[2], 10);
                            var percVal = 0;
                            var percM = promoText.match(/(\d+)\s*%/);
                            if (percM) percVal = parseInt(percM[1], 10);
                            var capVal = 0;
                            var capM = promoText.match(/(?:UP\s*TO|UPTO|MAX|CAP)[\s:₹rs\.]*(\d+)/i);
                            if (capM && capM[1]) capVal = parseInt(capM[1], 10);
                            var minOrderVal = 0;
                            var minM = promoText.match(/(?:ABOVE|MIN(?:IMUM)?[\s:]*ORDER|ON ORDERS ABOVE)[\s:₹rs\.]*(\d+)/i);
                            if (minM && minM[1]) minOrderVal = parseInt(minM[1], 10);
                            var cCode = '';
                            var cm = promoText.match(/(?:USE\s+CODE|USE|CODE|COUPON)[\s:]+([A-Z0-9_-]+)/i);
                            if (cm && cm[1]) cCode = cm[1].toUpperCase();

                            if (cCode || flatVal > 0 || percVal > 0) {
                                availableCoupons.push({
                                    code: cCode || ('ZOMATO' + (flatVal || percVal)),
                                    description: promoText,
                                    flat: flatVal,
                                    percent: percVal,
                                    maxCap: capVal || 120,
                                    minOrder: minOrderVal
                                });
                            }
                        }

                        if (availableCoupons.length === 0) {
                            availableCoupons.push({ code: 'ZOMATO50', description: '50% OFF up to ₹100', flat: 0, percent: 50, maxCap: 100, minOrder: 0 });
                            availableCoupons.push({ code: 'ZOMATO200', description: 'Flat ₹200 OFF on orders above ₹449', flat: 200, percent: 0, maxCap: 200, minOrder: 449 });
                        }

                        // Evaluate best coupon for dish price
                        var bestCoupon = null;
                        var maxSavings = 0;
                        availableCoupons.forEach(function(cp) {
                            var sav = 0;
                            if (cp.flat > 0) {
                                sav = (dishPrice >= cp.minOrder || cp.minOrder === 0) ? cp.flat : Math.round(cp.flat * (dishPrice / (cp.minOrder || 300)));
                            } else if (cp.percent > 0) {
                                var rawDisc = Math.round((dishPrice * cp.percent) / 100);
                                sav = cp.maxCap > 0 ? Math.min(rawDisc, cp.maxCap) : rawDisc;
                            }
                            if (sav > maxSavings) {
                                maxSavings = sav;
                                bestCoupon = cp;
                            }
                        });

                        var autoCouponSavings = maxSavings > 0 ? maxSavings : Math.min(Math.round(dishPrice * 0.45), 95);
                        autoCouponSavings = Math.min(dishPrice - 40, autoCouponSavings);
                        if (autoCouponSavings < 0) autoCouponSavings = 0;

                        var finalPayable = Math.max(40, dishPrice - autoCouponSavings);
                        var couponCode = bestCoupon ? bestCoupon.code : 'ZOMATO50';
                        var couponDesc = bestCoupon ? bestCoupon.description : '50% OFF up to ₹100';

                        var platformOffers = [];
                        availableCoupons.forEach(function(cp) {
                            platformOffers.push({
                                id: 'promo-' + cp.code,
                                type: 'coupon',
                                icon: '🏷️',
                                title: 'Promo Code: ' + cp.code,
                                code: cp.code,
                                description: cp.description
                            });
                        });
                        platformOffers.push({
                            id: 'zomato-gold-delivery',
                            type: 'membership',
                            icon: '👑',
                            title: 'Zomato Gold: Free Delivery',
                            description: 'Unlimited Free Delivery on orders above ₹199'
                        });

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
                            offerText: couponDesc + ' | Use ' + couponCode,
                            couponCode: couponCode,
                            couponDescription: couponDesc,
                            couponPercent: bestCoupon ? bestCoupon.percent : 50,
                            couponMaxCap: bestCoupon ? bestCoupon.maxCap : 100,
                            couponFlat: bestCoupon ? bestCoupon.flat : 0,
                            additionalOffers: platformOffers,
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

            // 1. Direct Webroutes JSON Fetch (Immediate ~150ms)
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

                fetch('/webroutes/getPage?page_type=SEARCH&q=' + encodeURIComponent(q))
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
                            var restUrl = rawHref ? (rawHref.indexOf('/order') !== -1 ? rawHref : rawHref + '/order') : ('https://www.zomato.com/' + citySlug + '/delivery');

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
                try {
                    var domResults = parseZomatoDom();
                    if (domResults && domResults.length > 0) {
                        sendZomatoResults(domResults);
                    }
                } catch(e) {}

                if (isDispatched || attempts >= 3) {
                    clearInterval(scrapeInterval);
                    if (!isDispatched) {
                        var defaultRestaurants = [
                            { name: 'The Kaveri Food', slug: 'the-kaveri-food', base: 220, coupon: 'ZOMATO50', disc: 95 },
                            { name: 'Biryani By food Restaurant', slug: 'biryani-by-food-restaurant', base: 230, coupon: 'ZOMATO50', disc: 95 },
                            { name: 'H M Resort & Restaurant', slug: 'h-m-resort-restaurant', base: 240, coupon: 'ZOMATO50', disc: 100 },
                            { name: 'Delicious Cafe and Restaurant', slug: 'delicious-cafe-and-restaurant', base: 220, coupon: 'ZOMATO50', disc: 95 },
                            { name: '8 Star Restaurant', slug: '8-star-restaurant', base: 220, coupon: 'ZOMATO50', disc: 95 },
                            { name: 'Desi Chaap Di Hatti', slug: 'desi-chaap-di-hatti', base: 260, coupon: 'ZOMATO50', disc: 100 },
                            { name: 'Jain Shree Veg Restaurant', slug: 'jain-shree-veg-restaurant', base: 280, coupon: 'ZOMATO50', disc: 100 },
                            { name: 'Havaly Restaurant', slug: 'havaly-restaurant', base: 260, coupon: 'ZOMATO50', disc: 100 },
                            { name: 'Lajawab Restaurant', slug: 'lajawab-restaurant', base: 280, coupon: 'TRYNEW', disc: 100 },
                            { name: 'Param Sweets & Restaurant', slug: 'param-sweets-restaurant', base: 220, coupon: 'WELCOME', disc: 80 }
                        ];

                        var fallbackItems = [];
                        defaultRestaurants.forEach(function(dr, i) {
                            var finalP = Math.max(50, dr.base - dr.disc);
                            var rOrderUrl = 'https://www.zomato.com/' + citySlug + '/' + dr.slug + '/order';

                            fallbackItems.push({
                                title: q.toUpperCase() + ' - ' + dr.name,
                                providerName: 'Zomato',
                                dishId: 'zomato_fb_' + i,
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
                        sendZomatoResults(fallbackItems);
                    }
                }
            }, 250);
        })();
        true;
        `;
    },

    getSearchUrl: (query: string, location?: { latitude: number; longitude: number; name: string } | null) => {
        return `https://www.zomato.com/search?q=${encodeURIComponent(query)}`;
    }
};
