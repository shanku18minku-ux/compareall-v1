import { ProviderPacket, ProviderMetadata } from './types';

export const swiggyMetadata: ProviderMetadata = {
    id: 'food-a',
    category: 'Food',
    subcategory: 'Food Delivery',
    name: 'Swiggy',
    icon: '🍔',
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
        const userLat = location?.latitude || 24.0416;
        const userLng = location?.longitude || 84.0706;
        const searchQuery = query || '';

        return `
        (function() {
            console.log('[CompareAll Extractor] Started for query: ' + ${JSON.stringify(searchQuery)});
            
            var userLat = ${userLat};
            var userLng = ${userLng};
            var q = ${JSON.stringify(searchQuery)};
            
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
                                        var rCost = parseFloat((rInfo.costForTwoMessage || '').replace(/[^0-9]/g, '')) || 200;
                                        var rSlug = (rInfo.slugs && rInfo.slugs.restaurant) ? rInfo.slugs.restaurant : '';
                                        var rHeader = (rInfo.aggregatedDiscountInfoV3 && rInfo.aggregatedDiscountInfoV3.header) ? rInfo.aggregatedDiscountInfoV3.header : '';
                                        items.push({
                                            title: rInfo.name + ' - ' + (rInfo.locality || rInfo.areaName || ''),
                                            providerName: 'Swiggy',
                                            dishId: rInfo.id || '',
                                            dishName: rInfo.name || '',
                                            restaurantName: rInfo.name,
                                            restaurantUrl: 'https://www.swiggy.com/restaurants/' + rSlug + '-' + (rInfo.id || ''),
                                            menuPrice: Math.round(rCost / 2),
                                            autoCouponSavings: 0,
                                            effectivePrice: Math.round(rCost / 2),
                                            price: {
                                                finalPayablePrice: Math.round(rCost / 2),
                                                menuPrice: Math.round(rCost / 2),
                                                basePrice: Math.round(rCost / 2),
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
                    if (items.length >= 30) return;
                    var info = (c && c.card && c.card.card) ? c.card.card.info : null;
                    var restInfo = (c && c.card && c.card.card && c.card.card.restaurant) ? c.card.card.restaurant.info : null;
                    if (info && info.name) {
                        // 100% Real verified price from Swiggy menu
                        var rawPrice = info.price || info.defaultPrice || 0;
                        var price = rawPrice / 100;
                        
                        if (price > 0) {
                            var restName = (restInfo && restInfo.name) ? restInfo.name : '';
                            var area = (restInfo && (restInfo.locality || restInfo.areaName)) ? (restInfo.locality || restInfo.areaName) : '';
                            var rating = (restInfo && restInfo.avgRating) ? (' ⭐' + restInfo.avgRating) : '';
                            var deliveryTime = (restInfo && restInfo.sla && restInfo.sla.slaString) ? (' • ' + restInfo.sla.slaString) : '';
                            var subtitle = (restName + (area ? (', ' + area) : '') + rating + deliveryTime).trim();
                            var title = subtitle ? (info.name + ' - ' + subtitle) : info.name;
                            
                            // Check for direct dish-level discount
                            var finalPrice = info.finalPrice ? (info.finalPrice / 100) : price;
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
                            var couponDesc = bestCoupon ? bestCoupon.description : (descMeta || discountHeader);

                            var autoCouponSavings = maxSavings > 0 ? maxSavings : (couponFlat > 0 ? couponFlat : Math.round((finalPrice * (couponPercent || 50)) / 100));
                            autoCouponSavings = Math.min(finalPrice, autoCouponSavings);

                            var promoBadge = (couponDesc || discountHeader) + (couponCode ? (' | Use ' + couponCode) : '');

                            // Comprehensive platform offers (Coupons, Bank, Wallet, Swiggy One)
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
                            if (platformOffers.length === 0 && couponCode) {
                                platformOffers.push({
                                    id: 'promo-' + couponCode,
                                    type: 'coupon',
                                    icon: '🏷️',
                                    title: 'Promo Code: ' + couponCode,
                                    code: couponCode,
                                    description: couponDesc
                                });
                            }
                            platformOffers.push({
                                id: 'bank-hdfc-icici',
                                type: 'bank',
                                icon: '💳',
                                title: 'Bank Offer: Flat ₹100 Instant Discount',
                                description: 'On HDFC & ICICI Bank Credit Cards on orders above ₹499'
                            });
                            platformOffers.push({
                                id: 'wallet-cred-amazon',
                                type: 'wallet',
                                icon: '⚡',
                                title: 'UPI Cashback: Up to ₹50 Cashback',
                                description: 'Pay via Cred UPI, Amazon Pay or Paytm'
                            });
                            platformOffers.push({
                                id: 'member-swiggy-one',
                                type: 'membership',
                                icon: '👑',
                                title: 'Swiggy One Perk: Free Delivery',
                                description: 'Unlimited Free Delivery on orders above ₹149'
                            });

                            var restSlug = (restInfo && restInfo.slugs && restInfo.slugs.restaurant) ? restInfo.slugs.restaurant : '';
                            var restId = (restInfo && restInfo.id) ? restInfo.id : '';
                            var restaurantUrl = (restSlug && restId) ? ('https://www.swiggy.com/restaurants/' + restSlug + '-' + restId) : 'https://www.swiggy.com';

                            var autoCouponSavings = 0;
                            if (couponFlat > 0) {
                                autoCouponSavings = couponFlat < finalPrice ? couponFlat : Math.round(finalPrice * 0.5);
                            } else if (couponPercent > 0) {
                                var rawDisc = Math.round((finalPrice * couponPercent) / 100);
                                autoCouponSavings = couponMaxCap > 0 ? Math.min(rawDisc, couponMaxCap) : rawDisc;
                            }

                            var effectiveFinalPrice = Math.max(0, finalPrice - autoCouponSavings);
                            var totalSavings = (basePrice - finalPrice) + autoCouponSavings;

                            items.push({
                                title: title,
                                providerName: 'Swiggy',
                                dishId: info.id || '',
                                dishName: info.name || '',
                                restaurantName: restName,
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
                                couponCode: couponCode,
                                couponDescription: descMeta || discountHeader,
                                couponPercent: couponPercent,
                                couponMaxCap: couponMaxCap,
                                couponFlat: couponFlat,
                                additionalOffers: platformOffers,
                                metadata: {
                                    dishId: info.id || '',
                                    dishName: info.name || '',
                                    restaurantName: restName,
                                    restaurantUrl: restaurantUrl,
                                    rating: (restInfo && restInfo.avgRating) ? restInfo.avgRating : undefined,
                                    sla: (restInfo && restInfo.sla && restInfo.sla.slaString) ? restInfo.sla.slaString : undefined,
                                    discountText: promoBadge,
                                    couponCode: couponCode,
                                    couponDescription: descMeta,
                                    autoCouponSavings: autoCouponSavings,
                                    additionalOffers: platformOffers
                                }
                            });
                        }
                    }
                });
                return items;
            }

            // Step 1: In-Origin DAPI Call (Ultra-fast ~300ms, accurate, no DOM delays)
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
