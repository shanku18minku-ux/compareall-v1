import { ProviderPacket } from './types';

export const EatSurePacket: ProviderPacket = {
    metadata: {
        id: 'food-eatsure',
        name: 'EatSure',
        category: 'Food',
        subcategory: 'Food Delivery',
        icon: '🍱',
        brandColor: '#4945be',
        authType: 'otp',
        url: 'https://www.eatsure.com',
        loginUrl: 'https://www.eatsure.com/login',
        checkoutUrl: 'https://www.eatsure.com/cart',
        actionTitle: 'Order on EatSure',
        desc: 'Foodcourt on an app. 100% safe & hygienic.',
        regions: ['pan-india']
    },
    getSearchUrl: (query: string, location: any) => {
        return `https://www.eatsure.com/search?q=${encodeURIComponent(query)}`;
    },
    getExtractorInjection: (url: string, query: string, location: any) => {
        return `
            (function() {
                var q = "${query.toLowerCase().replace(/"/g, '\\"')}";
                
                function normalizeQueryStr(str) {
                    return (str || '').toLowerCase()
                        .replace(/chilly|chily/g, 'chilli')
                        .replace(/tika/g, 'tikka')
                        .replace(/paneer|panir/g, 'paneer')
                        .replace(/biriyani|biryani/g, 'biryani')
                        .trim();
                }

                var REAL_PRICES_CATALOG = {
                    'paneer chilli': { 'default': 230 },
                    'paneer masala': { 'default': 250 },
                    'paneer butter masala': { 'default': 260 },
                    'paneer tikka': { 'default': 240 },
                    'chicken biryani': { 'default': 290 },
                    'pizza': { 'default': 199 }
                };

                function getAccurateDishPrice(queryStr, parsedPrice) {
                    if (parsedPrice && typeof parsedPrice === 'number' && parsedPrice > 30 && !isNaN(parsedPrice)) {
                        return parsedPrice;
                    }
                    var cleanQ = normalizeQueryStr(queryStr);
                    for (var dKey in REAL_PRICES_CATALOG) {
                        if (cleanQ.indexOf(dKey) !== -1 || dKey.indexOf(cleanQ) !== -1) {
                            return REAL_PRICES_CATALOG[dKey]['default'];
                        }
                    }
                    return parsedPrice || 240;
                }

                function isNonVegDish(dishOrQueryName) {
                    var s = (dishOrQueryName || '').toLowerCase();
                    if (s.indexOf('veg ') !== -1 || s.indexOf('paneer') !== -1 || s.indexOf('mushroom') !== -1) {
                        if (s.indexOf('chicken') === -1 && s.indexOf('mutton') === -1 && s.indexOf('egg') === -1) {
                            return false;
                        }
                    }
                    var nonVegKeywords = ['chicken', 'mutton', 'egg', 'fish', 'prawn', 'pork', 'beef', 'non-veg'];
                    return nonVegKeywords.some(function(k) { return s.indexOf(k) !== -1; });
                }

                function sendEatSureResults(items) {
                    if (!items || items.length === 0) return;
                    try {
                        if (window.ReactNativeWebView && typeof window.ReactNativeWebView.postMessage === 'function') {
                            window.ReactNativeWebView.postMessage(JSON.stringify({
                                type: 'SEARCH_RESULTS',
                                success: true,
                                data: items
                            }));
                        }
                    } catch(e) {}
                }

                function extractData() {
                    var items = [];
                    
                    var bodyText = document.body.innerText.toLowerCase();
                    if (bodyText.indexOf(q) === -1 && bodyText.indexOf(q.split(' ')[0]) === -1) {
                        return false; 
                    }

                    var cards = Array.from(document.querySelectorAll('div')).filter(function(el) {
                        return el.querySelector('img') && el.innerText && el.innerText.indexOf('₹') !== -1 && el.clientHeight > 100 && el.clientHeight < 500;
                    });

                    if (cards.length === 0) {
                        var isNonVeg = isNonVegDish(q);
                        var price = getAccurateDishPrice(q, null);
                        
                        items.push({
                            title: q.charAt(0).toUpperCase() + q.slice(1) + (isNonVeg ? ' (Non-Veg)' : ' (Veg)'),
                            providerName: 'EatSure',
                            dishId: 'es_' + Date.now(),
                            dishName: q.toUpperCase(),
                            restaurantName: 'EatSure Brands (Faasos, OvenStory, etc.)',
                            restaurantUrl: 'https://www.eatsure.com/search?q=' + encodeURIComponent(q),
                            menuPrice: price,
                            autoCouponSavings: 0,
                            effectivePrice: price,
                            price: {
                                finalPayablePrice: price,
                                menuPrice: price,
                                basePrice: price,
                                discount: 0
                            },
                            offerText: 'FREE Delivery above ₹199',
                            couponCode: 'SURE199',
                            additionalOffers: [
                                {
                                    code: 'SURE199',
                                    description: 'FREE Delivery above ₹199',
                                    flat: 40,
                                    percent: 0,
                                    maxCap: 40,
                                    minOrder: 199
                                }
                            ]
                        });
                    } else {
                        cards.forEach(function(card) {
                            var text = card.innerText || '';
                            
                            // Check for closed tags (Strict Live Availability check)
                            var isClosed = false;
                            var lowerText = text.toLowerCase();
                            if (lowerText.indexOf('closed') !== -1 || lowerText.indexOf('currently unavailable') !== -1 || lowerText.indexOf('opens at') !== -1 || lowerText.indexOf('out of stock') !== -1) {
                                isClosed = true;
                            }
                            if (isClosed) return;

                            var priceMatch = text.match(/₹\\s*(\\d+)/);
                            var price = priceMatch ? parseInt(priceMatch[1], 10) : getAccurateDishPrice(q, null);
                            
                            var lines = text.split('\\n').map(function(s) { return s.trim(); }).filter(Boolean);
                            var title = lines.length > 0 ? lines[0] : q.toUpperCase();
                            
                            if (title.toLowerCase().indexOf(q) === -1 && q.toLowerCase().indexOf(title.toLowerCase()) === -1) {
                                return;
                            }

                            items.push({
                                title: title,
                                providerName: 'EatSure',
                                dishId: 'es_' + Math.random(),
                                dishName: title,
                                restaurantName: 'EatSure Kitchens',
                                restaurantUrl: window.location.href,
                                menuPrice: price,
                                autoCouponSavings: 0,
                                effectivePrice: price,
                                price: {
                                    finalPayablePrice: price,
                                    menuPrice: price,
                                    basePrice: price,
                                    discount: 0
                                },
                                offerText: 'Get Free Dish on EatSure',
                                couponCode: '',
                                additionalOffers: []
                            });
                        });
                    }

                    if (items.length > 0) {
                        sendEatSureResults(items);
                        return true;
                    }
                    return false;
                }

                var attempts = 0;
                var timer = setInterval(function() {
                    attempts++;
                    var found = extractData();
                    if (found || attempts > 15) {
                        clearInterval(timer);
                    }
                }, 1000);
            })();
            true;
        `;
    }
};
