import { ProviderPacket } from '../types';

export const EatSurePacket: ProviderPacket = {
    metadata: {
        id: 'food-eatsure',
        name: 'EatSure',
        category: 'Food',
        subcategory: 'Food Delivery',
        icon: 'E',
        brandColor: '#4945be',
        authType: 'otp',
        url: 'https://www.eatsure.com',
        loginUrl: 'https://www.eatsure.com/login',
        checkoutUrl: 'https://www.eatsure.com/cart',
        actionTitle: 'Order on EatSure',
        desc: 'Foodcourt on an app. 100% safe & hygienic.',
        regions: ['mumbai', 'pune', 'delhi', 'ncr', 'gurgaon', 'noida', 'faridabad', 'ghaziabad',
                  'bangalore', 'bengaluru', 'hyderabad', 'chennai', 'kolkata', 'ahmedabad', 'surat',
                  'vadodara', 'jaipur', 'chandigarh', 'lucknow', 'kanpur', 'indore', 'bhopal',
                  'nagpur', 'patna', 'ludhiana', 'agra', 'nashik', 'meerut', 'rajkot', 'varanasi',
                  'srinagar', 'aurangabad', 'dhanbad', 'amritsar', 'navi mumbai', 'allahabad',
                  'ranchi', 'howrah', 'coimbatore', 'jabalpur', 'gwalior', 'vijayawada', 'jodhpur',
                  'madurai', 'raipur', 'kota', 'guwahati', 'solapur', 'hubli', 'bareilly',
                  'moradabad', 'mysore', 'gurugram', 'jalandhar', 'tiruchirappalli', 'bhubaneswar',
                  'salem', 'warangal', 'thiruvananthapuram', 'kochi', 'udaipur', 'dehradun',
                  'belgaum', 'rohtak']
    },
    
    getLoginDetectionScript: () => {
        return `
            (function() {
                var checkLoginInterval = setInterval(function() {
                    var isLoggedIn = false;
                    try {
                        var token = localStorage.getItem('token') || localStorage.getItem('access_token') || localStorage.getItem('user_details') || localStorage.getItem('user') || document.cookie.indexOf('is_logged_in=true') !== -1 || document.cookie.indexOf('token=') !== -1 || document.cookie.indexOf('user_id=') !== -1 || document.cookie.indexOf('customer') !== -1;
                        if (token) isLoggedIn = true;
                    } catch(e) {}
                    
                    if (isLoggedIn) {
                        clearInterval(checkLoginInterval);
                        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'SUCCESS',
                            provider: 'EatSure'
                        }));
                    }
                }, 1000);
            })();
            true;
        `;
    },

    getSearchUrl: (query: string, location: any) => {
        const lat = location?.latitude || 0;
        const lng = location?.longitude || 0;
        // Pass lat/lng so EatSure serves the right city's restaurants
        if (lat && lng) {
            return `https://www.eatsure.com/search?q=${encodeURIComponent(query)}&lat=${lat}&lng=${lng}`;
        }
        return `https://www.eatsure.com/search?q=${encodeURIComponent(query)}`;
    },

    getExtractorInjection: (searchUrl: string, query?: string, location?: any) => {
        query = query || "";
        const safeQuery = JSON.stringify(query.toLowerCase());
        return `
            (function() {
                try {
                    
        var q = ${safeQuery};
        
        // Since we mapped the URL directly to the brand menu, we just wait for the menu to load!
        var scrapeAttempts = 0;
        var scrapeInterval = setInterval(function() {
            scrapeAttempts++;
            
            // Look for product cards
            var cards = document.querySelectorAll('div[class*="product-card"], div[class*="ProductCard"], article, div[class*="dish"]');
            
            if (cards.length > 0 || scrapeAttempts >= 20) {
                clearInterval(scrapeInterval);
                
                var items = [];
                cards.forEach(function(card) {
                    var titleEl = card.querySelector('h3, h4, div[class*="name"], div[class*="title"]');
                    var priceEl = card.querySelector('div[class*="price"], span[class*="price"]');
                    
                    if (!titleEl || !priceEl) return;
                    
                    var title = titleEl.innerText.trim();
                    var priceText = priceEl.innerText.trim();
                      var prices = priceText.match(/\d+/g);
                      if (!prices) return;
                      // Often DOM shows "200 150", so we take the lowest visible price as the discounted price
                      var price = Math.min(...prices.map(p => parseInt(p, 10)));
                      
                      var autoCouponSavings = 0;
                      var couponCode = '';
                      var basePrice = Math.max(...prices.map(p => parseInt(p, 10)));
                      if (basePrice > price) {
                          autoCouponSavings = basePrice - price;
                          couponCode = 'EATSURE_OFFER';
                      }
                      
                      // Also look for explicit coupon tags in the card
                      var offerEl = card.querySelector('div[class*="offer"], span[class*="offer"], div[class*="discount"]');
                      if (offerEl && autoCouponSavings === 0) {
                          var oTxt = offerEl.innerText.trim().toUpperCase();
                          var pMatch = oTxt.match(/(\d+)\s*%/);
                          var fMatch = oTxt.match(/(\d+)\s*(?:OFF|\u20B9|RS)/i) || oTxt.match(/(?:\u20B9|RS.?)\s*(\d+)/i);
                          if (pMatch) {
                              var p = parseInt(pMatch[1], 10);
                              autoCouponSavings = Math.round((price * p) / 100);
                              couponCode = 'EATSURE' + p;
                              basePrice = price;
                              price = Math.max(10, price - autoCouponSavings);
                          } else if (fMatch) {
                              var f = parseInt(fMatch[1], 10);
                              autoCouponSavings = f;
                              couponCode = 'EATSURE_FLAT';
                              basePrice = price;
                              price = Math.max(10, price - autoCouponSavings);
                          }
                      }
                    
                    // Simple fuzzy match
                    if (q !== 'pizza' && q !== 'biryani' && q !== 'burger') {
                        var words = q.split(' ');
                        var matchCount = 0;
                        words.forEach(function(w) { if (title.toLowerCase().includes(w)) matchCount++; });
                        if (matchCount === 0 && words.length > 0) return;
                    }
                    
                    // Get brand name from URL
                    var brand = "EatSure";
                    var brandEl = card.querySelector('div[class*="brand"], span[class*="brand"]');
                    if (brandEl) brand = brandEl.innerText.trim();
                    var imgEl = card.querySelector('img');
                    var extractedImageUrl = imgEl ? imgEl.src : '';
                    
                    items.push({
                        title: title + ' - ' + brand,
                        providerName: 'EatSure',
                        price: {
                              finalPayablePrice: price,
                              basePrice: basePrice,
                              discount: autoCouponSavings
                          },
                          menuPrice: price,
                          autoCouponSavings: autoCouponSavings,
                          couponCode: couponCode,
                        restaurantName: brand,
                            imageUrl: typeof extractedImageUrl !== 'undefined' ? extractedImageUrl : '',
                        dishName: title,
                        inStock: true
                    });
                });
                
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'SEARCH_RESULTS',
                    data: items
                }));
            }
        }, 500);

                } catch (e) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'SEARCH_RESULTS',
                        data: []
                    }));
                }
            })();
        `;
    },

    // ── Personal Offers Extraction (after login) ──────────────────────────────
    getPersonalOffersInjection: () => `
(function() {
    var sent = false;
    var providerId = 'food-eatsure';
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
                if (u.includes('coupon') || u.includes('offer') || u.includes('voucher') || u.includes('discount') || u.includes('wallet') || u.includes('promo')) {
                    cloned.json().then(function(data) {
                        try {
                            var list = data.data || data.offers || data.coupons || data.result || [];
                            if (!Array.isArray(list)) list = Object.values(list).find(function(v) { return Array.isArray(v); }) || [];
                            var offers = list.map(function(o) { return { code: o.couponCode || o.code || '', description: o.description || o.title || o.offerText || '', discount: o.discountAmount || o.discount || 0, minOrder: o.minOrderValue || 0, source: 'eatsure' }; }).filter(function(o) { return o.code || o.description; });
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
            fetch('https://www.eatsure.com/api/v1/coupons', { credentials: 'include' }).then(function(r) { return r.json(); }).then(function(d) {
                var list = d.data || d.coupons || d.offers || [];
                if (Array.isArray(list) && list.length > 0) {
                    collected = list.map(function(o) { return { code: o.couponCode || o.code || '', description: o.description || o.title || '', discount: o.discountAmount || 0, minOrder: o.minOrderValue || 0, source: 'eatsure' }; });
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






