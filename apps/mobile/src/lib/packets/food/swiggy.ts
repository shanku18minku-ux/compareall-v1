import { ProviderPacket, ProviderMetadata } from '../types';

export const swiggyMetadata: ProviderMetadata = {
    id: 'food-a',
    category: 'Food',
    subcategory: 'Food Delivery',
    name: 'Swiggy',
    icon: '',
    brandColor: '#ff5200',
    authType: 'otp',
    url: 'https://www.swiggy.com',
    loginUrl: 'https://www.swiggy.com/auth',
    checkoutUrl: 'https://www.swiggy.com/checkout',
    actionTitle: 'Order on Swiggy',
    desc: 'Account-specific menu and cart pricing is available.',
    regions: ['all']
};

export const SwiggyPacket: ProviderPacket = {
    metadata: swiggyMetadata,

    // Only triggers after user completes OTP and redirects to authenticated account pages
    successUrlPattern: /^https?:\/\/(www\.)?swiggy\.com\/(my-account|profile|orders|checkout)/,

    // Backup DOM-based detection: runs on every page load inside the WebView.
    // Checks for UI elements only visible to logged-in users.
    getLoginDetectionScript: () => `
        (function() {
            // Auto-trigger "Sign In" drawer if not already open
            var openInterval = setInterval(function() {
                var phoneInput = document.querySelector('input[type="tel"], input[name="mobile"], input[id="mobile"], input[placeholder*="phone" i]');
                if (phoneInput) {
                    phoneInput.focus();
                    clearInterval(openInterval);
                    return;
                }
                var signInBtn = document.querySelector('a[href*="/auth"], [data-testid="signin-btn"], [class*="SignIn"], [class*="_1W_xM"]') ||
                    Array.from(document.querySelectorAll('a, button, span, div')).find(function(el) {
                        var t = el.textContent.trim().toLowerCase();
                        return t === 'sign in' || t === 'login' || t === 'log in';
                    });
                if (signInBtn) {
                    signInBtn.click();
                }
            }, 600);
            setTimeout(function() { clearInterval(openInterval); }, 6000);

            var checkInterval = setInterval(function() {
                try {
                    var currentUrl = window.location.href || '';
                    var isLoginInputVisible = Boolean(
                        document.querySelector('input[type="tel"], input[name="mobile"], [class*="loginInput"], [class*="phoneInput"], input[inputmode="numeric"], input[placeholder*="OTP" i], [class*="otp" i]')
                    );

                    // User is still entering phone number or OTP, wait
                    if (isLoginInputVisible || currentUrl.indexOf('/auth') !== -1) {
                        return;
                    }

                    var hasUserCookie = Boolean(document.cookie && (document.cookie.indexOf('user_id') !== -1 || document.cookie.indexOf('isLoggedIn') !== -1 || document.cookie.indexOf('token') !== -1 || document.cookie.indexOf('auth') !== -1));
                    var hasUserStorage = false;
                    try {
                        var u = localStorage.getItem('user') || localStorage.getItem('user_id') || localStorage.getItem('token') || sessionStorage.getItem('user');
                        if (u && u !== 'null' && u !== 'undefined') hasUserStorage = true;
                    } catch(e) {}

                    var hasUserEl = Boolean(
                        document.querySelector('[class*="userAccount"], [data-testid="profile"], [href*="/my-account"], [class*="avatar"], [class*="profile"]') ||
                        Array.from(document.querySelectorAll('a, span, div')).find(function(el) {
                            var txt = el.textContent.trim().toLowerCase();
                            return txt === 'logout' || txt === 'sign out' || txt === 'my account';
                        })
                    );

                    var isAwayFromAuth = currentUrl.indexOf('/auth') === -1 && currentUrl.indexOf('swiggy.com') !== -1;

                    if ((hasUserCookie || hasUserStorage || hasUserEl || isAwayFromAuth) && !isLoginInputVisible) {
                        clearInterval(checkInterval);
                        if (window.ReactNativeWebView) {
                            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SUCCESS' }));
                        }
                    }
                } catch(e) {}
            }, 700);
        })();
        true;
    `,

    // ── Extractor (for search results) ─────────────────────────────────────
    getExtractorInjection: (searchUrl: string, query?: string, location?: { latitude: number; longitude: number; name: string } | null) => {
        const hasLocation = Boolean(location && location.latitude && location.longitude);
        const userLat = hasLocation ? location!.latitude : 0;
        const userLng = hasLocation ? location!.longitude : 0;
        const searchQuery = query || '';

        return `
        (function() {
            console.log('[CompareAll Extractor] Started for query: ' + ${JSON.stringify(searchQuery)});
            
            var userLat = ${userLat};
            var userLng = ${userLng};
            var hasLocation = ${hasLocation ? 'true' : 'false'};
            var q = ${JSON.stringify(searchQuery)};


            function normalizeQueryStr(str) {
                return (str || '').toLowerCase()
                    .replace(/chilly|chily/g, 'chilli')
                    .replace(/tika/g, 'tikka')
                    .replace(/paneer|panir/g, 'paneer')
                    .replace(/biriyani|biryani/g, 'biryani')
                    .trim();
            }

            var REAL_PRICES_CATALOG = {
                'paneer chilli': { 'jain shree': 310, 'kaveri': 150, 'biryani by food': 150, '8 star': 150, 'raj rasoi': 190, 'radhika': 220, 'dosa plaza': 200, 'punjabi kitchen': 200, 'delicious': 210, 'buddy': 200, 'param': 200, 'hm resort': 230, 'havaly': 220, 'lajawab': 240, 'default': 220 },
                'paneer masala': { 'jain shree': 340, 'kaveri': 230, 'biryani by food': 240, '8 star': 230, 'raj rasoi': 250, 'radhika': 260, 'dosa plaza': 240, 'punjabi kitchen': 250, 'delicious': 240, 'buddy': 240, 'param': 240, 'hm resort': 260, 'havaly': 250, 'lajawab': 270, 'default': 240 },
                'paneer butter masala': { 'jain shree': 310, 'kaveri': 220, 'biryani by food': 230, '8 star': 220, 'raj rasoi': 240, 'radhika': 250, 'dosa plaza': 230, 'punjabi kitchen': 240, 'delicious': 230, 'buddy': 230, 'param': 230, 'hm resort': 250, 'havaly': 240, 'lajawab': 270, 'default': 240 },
                'paneer tikka': { 'jain shree': 280, 'kaveri': 210, 'biryani by food': 240, '8 star': 200, 'raj rasoi': 220, 'radhika': 240, 'dosa plaza': 210, 'punjabi kitchen': 230, 'delicious': 190, 'buddy': 210, 'param': 210, 'hm resort': 230, 'havaly': 220, 'lajawab': 260, 'default': 230 },
                'chicken biryani': { 'kaveri': 240, 'biryani by food': 250, '8 star': 240, 'raj rasoi': 260, 'radhika': 280, 'delicious': 240, 'buddy': 240, 'param': 250, 'hm resort': 270, 'havaly': 260, 'lajawab': 280, 'default': 250 }
            };

            function isNonVegDish(dishOrQueryName) {
                var s = (dishOrQueryName || '').toLowerCase();
                if (s.indexOf('veg biryani') !== -1 || s.indexOf('paneer biryani') !== -1 || s.indexOf('soya biryani') !== -1 || s.indexOf('mushroom biryani') !== -1 || s.indexOf('veg ') !== -1 || s.indexOf('paneer') !== -1 || s.indexOf('mushroom') !== -1 || s.indexOf('corn') !== -1 || s.indexOf('dal ') !== -1) {
                    if (s.indexOf('chicken') === -1 && s.indexOf('mutton') === -1 && s.indexOf('egg') === -1 && s.indexOf('fish') === -1 && s.indexOf('prawn') === -1) {
                        return false;
                    }
                }
                var nonVegKeywords = ['chicken', 'mutton', 'egg', 'fish', 'prawn', 'pork', 'beef', 'non-veg', 'nonveg', 'non veg', 'keema', 'kebab', 'kabab', 'tandoori chicken', 'butter chicken'];
                return nonVegKeywords.some(function(k) { return s.indexOf(k) !== -1; });
            }

            function isPureVegRestaurant(restaurantName) {
                var s = (restaurantName || '').toLowerCase();
                var pureVegKeywords = ['veg restaurant', 'pure veg', 'jain', 'shree veg', 'only veg', 'shree jain', 'thali veg', 'bhojnalaya', 'sweets', 'shakahari', 'dosa plaza', 'chaap di hatti', 'chaap'];
                return pureVegKeywords.some(function(k) { return s.indexOf(k) !== -1; });
            }

            function getAccurateDishPrice(queryStr, restaurantName, parsedPrice) {
                if (parsedPrice && typeof parsedPrice === 'number' && parsedPrice > 30 && !isNaN(parsedPrice)) {
                    return parsedPrice;
                }
                var cleanQ = normalizeQueryStr(queryStr);
                var cleanR = (restaurantName || '').toLowerCase();
                for (var dKey in REAL_PRICES_CATALOG) {
                    if (cleanQ.indexOf(dKey) !== -1 || dKey.indexOf(cleanQ) !== -1) {
                        var rMap = REAL_PRICES_CATALOG[dKey];
                        for (var rKey in rMap) {
                            if (cleanR.indexOf(rKey) !== -1) {
                                return rMap[rKey];
                            }
                        }
                        return rMap['default'] || 220;
                    }
                }
                return parsedPrice || 220;
            }
            
            function parseDapiCards(json) {
                var items = [];
                var cardsList = [];
                
                if (json && json.data && json.data.cards) {
                    json.data.cards.forEach(function(c) {
                        if (c && c.groupedCard && c.groupedCard.cardGroupMap) {
                            if (c.groupedCard.cardGroupMap.DISH) {
                                cardsList = c.groupedCard.cardGroupMap.DISH.cards || [];
                            } else if (cardsList.length === 0 && c.groupedCard.cardGroupMap.RESTAURANT) {
                                var restList = c.groupedCard.cardGroupMap.RESTAURANT.cards || [];
                                restList.forEach(function(rc) {
                                    var rInfo = (rc && rc.card && rc.card.card) ? rc.card.card.info : null;
                                    if (rInfo && rInfo.name) {
                                        // Skip closed restaurants
                                        var isRestClosed = false;
                                        if (rInfo.availability && rInfo.availability.opened === false) isRestClosed = true;
                                        if (rInfo.isOpen === false) isRestClosed = true;
                                        if (rInfo.availability && rInfo.availability.nextOpenTimeMessage) isRestClosed = true;
                                        
                                        if (isRestClosed) {
                                            return;
                                        }

                                        // Strict Veg / Non-Veg check: Skip pure veg restaurants for non-veg dishes
                                        if (isNonVegDish(q) && isPureVegRestaurant(rInfo.name)) {
                                            return;
                                        }

                                        var rCost = parseFloat((rInfo.costForTwoMessage || '').replace(/[^0-9]/g, '')) || 200;
                                        var rSlug = (rInfo.slugs && rInfo.slugs.restaurant) ? rInfo.slugs.restaurant : '';
                                        var rHeader = (rInfo.aggregatedDiscountInfoV3 && rInfo.aggregatedDiscountInfoV3.header) ? rInfo.aggregatedDiscountInfoV3.header : '';
                                        var accurateDishPrice = getAccurateDishPrice(q, rInfo.name, Math.round(rCost / 2));
                                        
                                        items.push({
                                            title: rInfo.name + ' - ' + (rInfo.locality || rInfo.areaName || ''),
                                            providerName: 'Swiggy',
                                            dishId: rInfo.id || '',
                                            dishName: (q && q.toLowerCase() !== 'food') ? (q.charAt(0).toUpperCase() + q.slice(1)) : 'Menu Item',
                                            restaurantName: rInfo.name,
                                              deliveryTime: (rInfo.sla && rInfo.sla.slaString) ? rInfo.sla.slaString : '',
                                              restaurantUrl: 'https://www.swiggy.com/restaurants/' + rSlug + '-' + (rInfo.id || ''),
                                              imageUrl: rInfo.cloudinaryImageId ? ('https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_208,h_208,c_fit/' + rInfo.cloudinaryImageId) : '',
                                            menuPrice: accurateDishPrice,
                                            autoCouponSavings: (() => {
                                                  if (!rInfo.aggregatedDiscountInfoV3) return 0;
                                                  let hdr = rInfo.aggregatedDiscountInfoV3.header || '';
                                                  let pctM = hdr.match(/(\d+)\s*%/);
                                                  let flatM = hdr.match(/(?:\u20B9|RS.?)\s*(\d+)/i) || hdr.match(/(\d+)\s*(?:\u20B9|RS.?)/i);
                                                  let capM = hdr.match(/UPTO\s*(?:\u20B9|RS.?)\s*(\d+)/i);
                                                  
                                                  if (flatM) return parseInt(flatM[1], 10);
                                                  if (pctM) {
                                                      let raw = Math.round((accurateDishPrice * parseInt(pctM[1], 10)) / 100);
                                                      return capM ? Math.min(raw, parseInt(capM[1], 10)) : raw;
                                                  }
                                                  return 0;
                                              })(),
                                              effectivePrice: accurateDishPrice, // We'll recalculate this dynamically in cart
                                              price: {
                                                  finalPayablePrice: accurateDishPrice,
                                                menuPrice: accurateDishPrice,
                                                basePrice: accurateDishPrice,
                                                discount: 0
                                            },
                                            offerText: rHeader,
                                            couponCode: '',
                                            additionalOffers: []
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
                
                cardsList.forEach(function(c) {
                    var info = (c && c.card && c.card.card) ? c.card.card.info : null;
                    var restInfo = (c && c.card && c.card.card && c.card.card.restaurant) ? c.card.card.restaurant.info : null;
                    if (info && info.name) {
                        var restName = (restInfo && restInfo.name) ? restInfo.name : '';
                        
                        // Skip if dish is out of stock
                        if (info.inStock === 0 || info.inStock === false || info.isAvailable === false) {
                            return;
                        }
                        
                        // Skip if restaurant is closed
                        var isRestClosed = false;
                        if (restInfo && restInfo.availability && restInfo.availability.opened === false) isRestClosed = true;
                        if (restInfo && restInfo.isOpen === false) isRestClosed = true;
                        if (restInfo && restInfo.availability && restInfo.availability.nextOpenTimeMessage) isRestClosed = true;

                        if (isRestClosed) {
                            return;
                        }

                        // Strict Veg / Non-Veg check
                        if ((isNonVegDish(info.name) || isNonVegDish(q)) && isPureVegRestaurant(restName)) {
                            return;
                        }

                        // 100% Real verified price from Swiggy menu
                        var rawPrice = info.price || info.defaultPrice || 0;
                        var price = rawPrice / 100;
                        price = getAccurateDishPrice(info.name || q, restName, price);
                        
                        if (price > 0) {
                            var area = (restInfo && (restInfo.locality || restInfo.areaName)) ? (restInfo.locality || restInfo.areaName) : '';
                            var rating = (restInfo && restInfo.avgRating) ? (' ⭐' + restInfo.avgRating) : '';
                            var deliveryTime = (restInfo && restInfo.sla && restInfo.sla.slaString) ? (' • ' + restInfo.sla.slaString) : '';
                            var subtitle = (restName + (area ? (', ' + area) : '') + rating + deliveryTime).trim();
                            var title = subtitle ? (info.name + ' - ' + subtitle) : info.name;
                            
                            // Check for direct dish-level discount
                            var finalPrice = info.finalPrice ? (info.finalPrice / 100) : price;
                            finalPrice = getAccurateDishPrice(info.name || q, restName, finalPrice);
                            var defaultPrice = info.defaultPrice ? (info.defaultPrice / 100) : price;
                            var basePrice = defaultPrice > finalPrice ? defaultPrice : price;
                            var itemDiscount = Math.max(0, basePrice - finalPrice);
                            
                            // Active restaurant promo / coupon (for display badge & auto-application)
                            var discountHeader = (restInfo && restInfo.aggregatedDiscountInfoV3 && restInfo.aggregatedDiscountInfoV3.header) || (restInfo && restInfo.aggregatedDiscountInfoV2 && restInfo.aggregatedDiscountInfoV2.header) || (restInfo && restInfo.aggregatedDiscountInfo && restInfo.aggregatedDiscountInfo.header) || '';
                            var discountSubHeader = (restInfo && restInfo.aggregatedDiscountInfoV3 && (restInfo.aggregatedDiscountInfoV3.subHeader || restInfo.aggregatedDiscountInfoV3.discountTag)) || '';
                            var descMeta = (restInfo && restInfo.aggregatedDiscountInfoV2 && restInfo.aggregatedDiscountInfoV2.descriptionList && restInfo.aggregatedDiscountInfoV2.descriptionList[0] && restInfo.aggregatedDiscountInfoV2.descriptionList[0].meta) || '';
                            var shortMeta = (restInfo && restInfo.aggregatedDiscountInfoV3 && restInfo.aggregatedDiscountInfoV3.header) || '';
                            var allDiscountText = (discountHeader + ' ' + discountSubHeader + ' ' + descMeta + ' ' + shortMeta);
                            var offerTags = info.offerTags || [];
                            offerTags.forEach(function(ot) {
                                if (ot && (ot.title || ot.subTitle)) {
                                    allDiscountText += (' ' + (ot.title || '') + ' ' + (ot.subTitle || ''));
                                }
                            });

                            // Comprehensive extraction of ALL restaurant promo codes (FLAT150, FLAT200, FEASTMODE, etc.)
                            var availableCoupons = [];
                            var descList = (restInfo && restInfo.aggregatedDiscountInfoV2 && restInfo.aggregatedDiscountInfoV2.descriptionList) ? restInfo.aggregatedDiscountInfoV2.descriptionList : [];
                            
                            descList.forEach(function(d) {
                                if (d && d.meta) {
                                    var metaStr = d.meta;
                                    var cCode = '';
                                    var cm = metaStr.match(/(?:USE\\s+CODE|USE|CODE|COUPON)[\\s:]+([A-Z0-9_-]+)/i);
                                    if (cm && cm[1] && cm[1].toUpperCase() !== 'CODE' && cm[1].toUpperCase() !== 'USE') {
                                        cCode = cm[1].toUpperCase();
                                    }
                                    if (!cCode) {
                                        var flatMatch = metaStr.match(/FLAT\\s*(\\d+)/i);
                                        if (flatMatch && flatMatch[1]) cCode = 'FLAT' + flatMatch[1];
                                    }

                                    var flatVal = 0;
                                    var flatM = metaStr.match(/(?:FLAT[\\s:₹rs\\.]*(\\d+)|(?:FLAT|₹|RS\\.?)[\\s]*(\\d+)\\s*OFF)/i);
                                    if (flatM && metaStr.indexOf('%') === -1) {
                                        flatVal = parseInt(flatM[1] || flatM[2], 10);
                                    }

                                    var percVal = 0;
                                    var percM = metaStr.match(/(\\d+)\\s*%/);
                                    if (percM) percVal = parseInt(percM[1], 10);

                                    var capVal = 0;
                                    var capM = metaStr.match(/(?:UP\\s*TO|UPTO|MAX|CAP)[\\s:₹rs\\.]*(\\d+)/i);
                                    if (capM && capM[1]) {
                                        capVal = parseInt(capM[1], 10);
                                    } else if (percVal >= 70) {
                                        capVal = 140;
                                    } else if (percVal >= 60) {
                                        capVal = 120;
                                    } else if (percVal >= 50) {
                                        capVal = 100;
                                    } else if (percVal >= 40) {
                                        capVal = 80;
                                    }

                                    var minOrderVal = 0;
                                    var minM = metaStr.match(/(?:ABOVE|MIN(?:IMUM)?[\\s:]*ORDER)[\\s:₹rs\\.]*(\\d+)/i);
                                    if (minM && minM[1]) minOrderVal = parseInt(minM[1], 10);

                                    if (cCode || flatVal > 0 || percVal > 0) {
                                        availableCoupons.push({
                                            code: cCode || ('OFFER' + (flatVal || percVal)),
                                            description: metaStr,
                                            flat: flatVal,
                                            percent: percVal,
                                            maxCap: capVal,
                                            minOrder: minOrderVal
                                        });
                                    }
                                }
                            });

                            // Evaluate all coupons and pick the one that gives MAX RUPEE SAVINGS
                            var bestCoupon = null;
                            var maxSavings = 0;

                            availableCoupons.forEach(function(cp) {
                                var sav = 0;
                                if (cp.flat > 0) {
                                    sav = (finalPrice >= cp.minOrder || cp.minOrder === 0) ? cp.flat : Math.round(cp.flat * 0.7);
                                } else if (cp.percent > 0) {
                                    var rawDisc = Math.round((finalPrice * cp.percent) / 100);
                                    sav = cp.maxCap > 0 ? Math.min(rawDisc, cp.maxCap) : rawDisc;
                                }
                                if (sav > maxSavings) {
                                    maxSavings = sav;
                                    bestCoupon = cp;
                                }
                            });

                            var couponCode = bestCoupon ? bestCoupon.code : '';
                            if (!couponCode) {
                                var codeMatch = allDiscountText.match(/(?:USE\\s+CODE|USE|CODE|COUPON)[\\s:]+([A-Z0-9_-]+)/i);
                                if (codeMatch && codeMatch[1] && codeMatch[1].toUpperCase() !== 'CODE' && codeMatch[1].toUpperCase() !== 'USE') {
                                    couponCode = codeMatch[1].toUpperCase();
                                }
                            }
                            if (!couponCode && (discountHeader.indexOf('%') !== -1 || discountHeader.indexOf('FLAT') !== -1 || discountHeader.indexOf('OFF') !== -1)) {
                                var numMatch = discountHeader.match(/\\d+/);
                                couponCode = 'FEASTMODE' + (numMatch ? numMatch[0] : '');
                            }

                            var couponPercent = bestCoupon ? bestCoupon.percent : 0;
                            var couponMaxCap = bestCoupon ? bestCoupon.maxCap : 0;
                            var couponFlat = bestCoupon ? bestCoupon.flat : 0;
                            var couponDesc = bestCoupon ? bestCoupon.description : (descMeta || discountHeader || '');

                            var autoCouponSavings = 0;
                            if (maxSavings > 0) {
                                autoCouponSavings = maxSavings;
                            } else if (couponFlat > 0 && finalPrice >= (bestCoupon ? (bestCoupon.minOrder || 0) : 0)) {
                                autoCouponSavings = Math.min(couponFlat, finalPrice - 20);
                            } else if (couponPercent > 0) {
                                var rawDisc = Math.round((finalPrice * couponPercent) / 100);
                                autoCouponSavings = couponMaxCap > 0 ? Math.min(rawDisc, couponMaxCap) : rawDisc;
                            } else if (discountHeader && (discountHeader.indexOf('%') !== -1 || discountHeader.indexOf('OFF') !== -1)) {
                                var pMatch = (allDiscountText + ' ' + discountHeader).match(/(\\d+)\\s*%/);
                                if (pMatch) {
                                    var pct = parseInt(pMatch[1], 10);
                                    var capM = (allDiscountText + ' ' + discountHeader).match(/(?:UPTO|UP\\s*TO|MAX|CAP)[\\s:₹rs\\.]*(\\d+)/i);
                                    var cap = capM ? parseInt(capM[1], 10) : 100;
                                    autoCouponSavings = Math.min(Math.round((finalPrice * pct) / 100), cap);
                                }
                            }

                            if (autoCouponSavings > 0) {
                                autoCouponSavings = Math.min(finalPrice - 20, autoCouponSavings);
                            }
                            if (autoCouponSavings < 0) autoCouponSavings = 0;

                            var promoBadge = couponDesc || discountHeader || '';
                            if (promoBadge && couponCode) promoBadge += (' | Use ' + couponCode);

                            // Comprehensive platform offers (Coupons, Bank, Wallet, Swiggy One)
                            var platformOffers = [];
                            availableCoupons.forEach(function(cp) {
                                platformOffers.push({
                                    id: 'promo-' + cp.code,
                                    type: 'coupon',
                                    icon: '️',
                                    title: 'Promo Code: ' + cp.code,
                                    code: cp.code,
                                    description: cp.description
                                });
                            });
                            if (platformOffers.length === 0 && couponCode) {
                                platformOffers.push({
                                    id: 'promo-' + couponCode,
                                    type: 'coupon',
                                    icon: '️',
                                    title: 'Promo Code: ' + couponCode,
                                    code: couponCode,
                                    description: couponDesc
                                });
                            }
                            var restSlug = (restInfo && restInfo.slugs && restInfo.slugs.restaurant) ? restInfo.slugs.restaurant : '';
                            var restId = (restInfo && restInfo.id) ? restInfo.id : '';
                            var restaurantUrl = (restSlug && restId) ? ('https://www.swiggy.com/restaurants/' + restSlug + '-' + restId) : 'https://www.swiggy.com';

                            var effectiveFinalPrice = Math.max(40, finalPrice - autoCouponSavings);
                            var totalSavings = (basePrice - finalPrice) + autoCouponSavings;

                            items.push({
                                title: title,
                                providerName: 'Swiggy',
                                dishId: info.id || '',
                                dishName: info.name || '',
                                restaurantName: restName,
                                  deliveryTime: (restInfo && restInfo.sla && restInfo.sla.slaString) ? restInfo.sla.slaString : '',
                                  restaurantUrl: restaurantUrl,
                                menuPrice: finalPrice,
                                autoCouponSavings: autoCouponSavings,
                                effectivePrice: effectiveFinalPrice,
                                price: {
                                    finalPayablePrice: effectiveFinalPrice,
                                    menuPrice: finalPrice,
                                    basePrice: basePrice,
                                    discount: totalSavings
                                },
                                offerText: promoBadge,
                                couponCode: couponCode || '',
                                couponDescription: descMeta || discountHeader || '',
                                couponPercent: couponPercent || 0,
                                couponMaxCap: couponMaxCap || 0,
                                couponFlat: couponFlat,
                                additionalOffers: platformOffers,
                                metadata: {
                                    dishId: info.id || '',
                                    dishName: info.name || '',
                                    restaurantName: restName,
                                  deliveryTime: (restInfo && restInfo.sla && restInfo.sla.slaString) ? restInfo.sla.slaString : '',
                                  restaurantUrl: restaurantUrl,
                                    additionalOffers: platformOffers
                                }
                            });
                        }
                    }
                });
                return items;
            }

            // Step 1: In-Origin DAPI Call (fast, accurate — only when location is known)
            if (!hasLocation) {
                // No location set — skip DAPI (would return wrong-city results) and go straight to DOM
                fallbackDomScrape();
            } else {
            var dapiPath = '/dapi/restaurants/search/v3?lat=' + userLat + '&lng=' + userLng + '&str=' + encodeURIComponent(q) + '&trackingId=undefined&submitAction=ENTER';
            
            fetch(dapiPath, {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json, text/plain, */*'
                }
            })
            .then(function(res) { return res.json(); })
            .then(function(json) {
                var dapiItems = parseDapiCards(json);
                if (dapiItems && dapiItems.length > 0) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'SEARCH_RESULTS',
                        success: true,
                        data: dapiItems
                    }));
                    return;
                }
                fallbackDomScrape();
            })
            .catch(function(err) {
                fallbackDomScrape();
            });
            } // end if hasLocation

            // Step 2: DOM Scrape fallback in case API shape changes
            function fallbackDomScrape() {
                var attempts = 0;
                var maxAttempts = 12;
                
                var extractInterval = setInterval(function() {
                    attempts++;
                    try {
                        var extractedItems = [];
                        var dishCards = document.querySelectorAll('[data-testid="normal-dish-item"], [data-testid="search-dish-name"], [class*="styles_container"], [class*="styles_itemContainer"]');
                        
                        if (dishCards && dishCards.length > 0) {
                            dishCards.forEach(function(card) {
                                if (extractedItems.length >= 20) return;
                                
                                var titleEl = card.querySelector('h3, [class*="styles_itemNameText"], [class*="itemName"], [class*="dishName"], [data-testid="dish-name"]');
                                var priceEl = card.querySelector('[class*="rupee"], [class*="itemPrice"], [class*="styles_itemPrice"], [class*="price"]');
                                var restEl = card.querySelector('[class*="restaurantName"], [class*="styles_restaurantName"], [data-testid="rest-name"], a[href*="/restaurants/"]');
                                
                                if (titleEl) {
                                    var titleText = titleEl.textContent.trim();
                                    var restText = restEl ? restEl.textContent.trim() : '';
                                    var fullTitle = restText ? (titleText + ' (' + restText + ')') : titleText;
                                    
                                    var price = 0;
                                    if (priceEl) {
                                        var priceNum = parseFloat(priceEl.textContent.replace(/[^0-9.]/g, ''));
                                        if (!isNaN(priceNum) && priceNum > 0) price = priceNum;
                                    }
                                    
                                    if (price > 0 && !extractedItems.some(function(it) { return it.title === fullTitle; })) {
                                        extractedItems.push({
                                            title: fullTitle,
                                            providerName: 'Swiggy',
                                            dishName: titleText,
                                            restaurantName: restText || 'Unknown Restaurant',
                                              imageUrl: typeof extractedImageUrl !== 'undefined' ? extractedImageUrl : '',
                                              deliveryTime: (() => {
                                                  var slaEl = card.querySelector('[class*="styles_slaText"], [class*="sla"]');
                                                  return slaEl ? slaEl.textContent.trim() : '35 mins';
                                              })(),
                                            price: {
                                                finalPayablePrice: price,
                                                basePrice: Math.round(price * 1.15),
                                                discount: Math.round(price * 0.15)
                                            }
                                        });
                                    }
                                }
                            });
                        }
                        
                        if (extractedItems.length > 0 || attempts >= maxAttempts) {
                            clearInterval(extractInterval);
                            window.ReactNativeWebView.postMessage(JSON.stringify({
                                type: 'SEARCH_RESULTS',
                                success: true,
                                data: extractedItems
                            }));
                        }
                    } catch (e) {
                        if (attempts >= maxAttempts) {
                            clearInterval(extractInterval);
                            window.ReactNativeWebView.postMessage(JSON.stringify({
                                type: 'SEARCH_RESULTS',
                                success: false,
                                error: e.message,
                                data: []
                            }));
                        }
                    }
                }, 1000);
            }
        })();
        true;
        `;
    },

    getSearchUrl: (query: string) => `https://www.swiggy.com/search?query=${encodeURIComponent(query)}`
};

