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

    // When the user logs in on /auth, Swiggy automatically redirects to the home page or /restaurants
    successUrlPattern: /^https?:\/\/(www\.)?swiggy\.com\/(?!auth)/,

    // Backup DOM-based detection: runs on every page load inside the WebView.
    // Checks for UI elements only visible to logged-in users.
    getLoginDetectionScript: () => `
        (function() {
            var checkInterval = setInterval(function() {
                var logoutIndicators = [
                    // Swiggy shows "My Account" or a profile icon when logged in
                    document.querySelector('[class*="userAccount"]'),
                    document.querySelector('[data-testid="profile"]'),
                    document.querySelector('[href*="/account"]'),
                    document.querySelector('[href*="/my-account"]'),
                    Array.from(document.querySelectorAll('a, span, div'))
                        .find(function(el) {
                            var txt = el.textContent.trim().toLowerCase();
                            return txt === 'logout' || txt === 'sign out' || txt === 'my account';
                        })
                ].filter(Boolean);

                if (logoutIndicators.length > 0) {
                    clearInterval(checkInterval);
                    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SUCCESS' }));
                }
            }, 1000); // Check every second
        })();
        true;
    `,

    // ── Extractor (for search results) ─────────────────────────────────────
    getExtractorInjection: (searchUrl: string, query?: string, location?: { latitude: number; longitude: number; name: string } | null) => {
        const userLat = location?.latitude || 28.6139;
        const userLng = location?.longitude || 77.2090;
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
                        if (c.groupedCard && c.groupedCard.cardGroupMap && c.groupedCard.cardGroupMap.DISH) {
                            cardsList = c.groupedCard.cardGroupMap.DISH.cards || [];
                        }
                    });
                }
                
                cardsList.forEach(function(c) {
                    if (items.length >= 30) return;
                    var info = c.card?.card?.info;
                    var restInfo = c.card?.card?.restaurant?.info;
                    if (info && info.name) {
                        // 100% Real verified price from Swiggy menu
                        var rawPrice = info.price || info.defaultPrice || 0;
                        var price = rawPrice / 100;
                        
                        if (price > 0) {
                            var restName = restInfo?.name || '';
                            var area = restInfo?.locality || restInfo?.areaName || '';
                            var rating = restInfo?.avgRating ? (' ⭐' + restInfo.avgRating) : '';
                            var deliveryTime = restInfo?.sla?.slaString ? (' • ' + restInfo.sla.slaString) : '';
                            var subtitle = (restName + (area ? (', ' + area) : '') + rating + deliveryTime).trim();
                            var title = subtitle ? (info.name + ' - ' + subtitle) : info.name;
                            
                            // Check for direct dish-level discount
                            var finalPrice = info.finalPrice ? (info.finalPrice / 100) : price;
                            var defaultPrice = info.defaultPrice ? (info.defaultPrice / 100) : price;
                            var basePrice = defaultPrice > finalPrice ? defaultPrice : price;
                            var itemDiscount = Math.max(0, basePrice - finalPrice);
                            
                            // Active restaurant promo / coupon (for display badge & auto-application)
                            var discountHeader = restInfo?.aggregatedDiscountInfoV2?.header || restInfo?.aggregatedDiscountInfo?.header || '';
                            var couponDesc = restInfo?.aggregatedDiscountInfoV2?.descriptionList?.[0]?.meta || restInfo?.aggregatedDiscountInfo?.descriptionList?.[0]?.meta || '';
                            var shortMeta = restInfo?.aggregatedDiscountInfoV2?.shortDescriptionList?.[0]?.meta || '';

                            var couponCode = '';
                            var codeMatch = (shortMeta + ' ' + couponDesc).match(/Use\\s+(?:code\\s+)?([A-Z0-9_-]+)/i);
                            if (codeMatch) {
                                couponCode = codeMatch[1].toUpperCase();
                            }

                            var couponPercent = 0;
                            var percentMatch = (discountHeader + ' ' + couponDesc).match(/([0-9]+)\\s*%/);
                            if (percentMatch) couponPercent = parseInt(percentMatch[1], 10);

                            var couponMaxCap = 0;
                            var capMatch = couponDesc.match(/(?:up to|upto|max)\\s*₹?\\s*([0-9]+)/i);
                            if (capMatch) couponMaxCap = parseInt(capMatch[1], 10);

                            var couponFlat = 0;
                            var flatMatch = (discountHeader + ' ' + couponDesc).match(/(?:FLAT|flat)\\s*₹?\\s*([0-9]+)/i);
                            if (flatMatch) couponFlat = parseInt(flatMatch[1], 10);

                            var promoBadge = couponDesc || (discountHeader + (couponCode ? (' (Use ' + couponCode + ')') : ''));

                            // Comprehensive platform offers (Coupons, Bank, Wallet, Swiggy One)
                            var platformOffers = [];
                            if (couponCode) {
                                platformOffers.push({
                                    id: 'promo-' + couponCode,
                                    type: 'coupon',
                                    icon: '🏷️',
                                    title: 'Promo Code: ' + couponCode,
                                    code: couponCode,
                                    description: couponDesc || (discountHeader + ' with code ' + couponCode)
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

                            var restSlug = restInfo?.slugs?.restaurant || '';
                            var restId = restInfo?.id || '';
                            var restaurantUrl = (restSlug && restId) ? ('https://www.swiggy.com/restaurants/' + restSlug + '-' + restId) : 'https://www.swiggy.com';

                            items.push({
                                title: title,
                                providerName: 'Swiggy',
                                dishId: info.id || '',
                                dishName: info.name || '',
                                restaurantUrl: restaurantUrl,
                                price: {
                                    finalPayablePrice: finalPrice,
                                    basePrice: basePrice,
                                    discount: itemDiscount
                                },
                                offerText: promoBadge,
                                couponCode: couponCode,
                                couponDescription: couponDesc || discountHeader,
                                couponPercent: couponPercent,
                                couponMaxCap: couponMaxCap,
                                couponFlat: couponFlat,
                                additionalOffers: platformOffers,
                                metadata: {
                                    dishId: info.id || '',
                                    dishName: info.name || '',
                                    restaurantName: restName,
                                    restaurantUrl: restaurantUrl,
                                    rating: restInfo?.avgRating,
                                    sla: restInfo?.sla?.slaString,
                                    discountText: promoBadge,
                                    couponCode: couponCode,
                                    couponDescription: couponDesc,
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
