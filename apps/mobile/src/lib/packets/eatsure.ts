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

    getSearchUrl: (query: string, location: any) => {
        // EatSure uses lat/lng query params for location-based results
        if (location && location.latitude && location.longitude) {
            return `https://www.eatsure.com/search?q=${encodeURIComponent(query)}&lat=${location.latitude}&lng=${location.longitude}`;
        }
        return `https://www.eatsure.com/search?q=${encodeURIComponent(query)}`;
    },

    getExtractorInjection: (url: string, query: string, location: any) => {
        const lat = location?.latitude || 0;
        const lng = location?.longitude || 0;
        const locName = (location?.name || '').replace(/"/g, '\\"');

        return `
            (function() {
                var q = "${query.toLowerCase().replace(/"/g, '\\"')}";
                var userLat = ${lat};
                var userLng = ${lng};
                var locName = "${locName}";

                // ── Step 1: Force EatSure to use our location ──────────────────
                // EatSure reads from localStorage key "location" or similar
                if (userLat && userLng) {
                    try {
                        // Try multiple storage keys EatSure might use
                        var locPayload = JSON.stringify({ lat: userLat, lng: userLng, address: locName });
                        localStorage.setItem('es_location', locPayload);
                        localStorage.setItem('user_location', locPayload);
                        localStorage.setItem('location', locPayload);
                        // Also set cookies EatSure checks
                        document.cookie = 'lat=' + userLat + '; path=/; max-age=86400';
                        document.cookie = 'lng=' + userLng + '; path=/; max-age=86400';
                        document.cookie = 'user_lat=' + userLat + '; path=/; max-age=86400';
                        document.cookie = 'user_lng=' + userLng + '; path=/; max-age=86400';
                    } catch(e) {}
                }

                function sendResults(items) {
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

                // ── Step 2: Extract real dish cards from DOM ───────────────────
                function extractData() {
                    // EatSure renders dish cards with price using rupee symbol
                    // Filter divs that: have an image, have price text, reasonable height
                    var allDivs = Array.from(document.querySelectorAll('div, article, li, section'));
                    var cards = allDivs.filter(function(el) {
                        var txt = el.innerText || el.textContent || '';
                        var hasPrice = txt.indexOf('₹') !== -1;
                        var hasImg = el.querySelector('img') !== null;
                        var h = el.clientHeight;
                        var w = el.clientWidth;
                        return hasPrice && hasImg && h > 80 && h < 600 && w > 100;
                    });

                    // Deduplicate: keep only the smallest (most specific) matching containers
                    var deduped = cards.filter(function(el) {
                        return !cards.some(function(other) {
                            return other !== el && other.contains(el) &&
                                   (other.clientHeight - el.clientHeight) < 80;
                        });
                    });

                    if (deduped.length === 0) return false;

                    var items = [];
                    var seen = {};

                    deduped.forEach(function(card) {
                        var text = card.innerText || card.textContent || '';
                        var lowerText = text.toLowerCase();

                        // Skip unavailable items
                        if (lowerText.indexOf('closed') !== -1 ||
                            lowerText.indexOf('currently unavailable') !== -1 ||
                            lowerText.indexOf('out of stock') !== -1 ||
                            lowerText.indexOf('opens at') !== -1) {
                            return;
                        }

                        // Skip if no query relevance
                        var qWords = q.split(/\\s+/).filter(function(w) { return w.length > 2; });
                        var isRelevant = qWords.length === 0 || qWords.some(function(w) {
                            return lowerText.indexOf(w) !== -1;
                        });
                        if (!isRelevant) return;

                        // ── Extract price (FIXED regex — single backslash in runtime JS) ──
                        var priceRegex = /₹\\s*(\\d+)/g;
                        var priceMatches = [];
                        var m;
                        while ((m = priceRegex.exec(text)) !== null) {
                            var p = parseInt(m[1], 10);
                            if (p > 10 && p < 5000) priceMatches.push(p);
                        }

                        var finalPrice = 0, originalPrice = 0;
                        if (priceMatches.length >= 2) {
                            finalPrice = Math.min.apply(null, priceMatches);
                            originalPrice = Math.max.apply(null, priceMatches);
                        } else if (priceMatches.length === 1) {
                            finalPrice = priceMatches[0];
                            originalPrice = priceMatches[0];
                        } else {
                            return; // No real price found — skip
                        }

                        // ── Extract discount / coupon text ──
                        var offerText = '';
                        var couponCode = '';
                        var discountMatch = text.match(/(\\d+\\s*%\\s*OFF)/i) ||
                                           text.match(/(FLAT\\s*(?:₹|Rs\\.?)?\\s*\\d+\\s*OFF)/i) ||
                                           text.match(/(Buy\\s*\\d+\\s*Get\\s*\\d+)/i);
                        var couponMatch = text.match(/(?:USE|CODE)[:\\s]+([A-Z0-9]{3,15})/i);

                        if (discountMatch) offerText = discountMatch[1].toUpperCase();
                        if (couponMatch) {
                            couponCode = couponMatch[1];
                            offerText = offerText ? offerText + ' | ' + couponCode : couponCode;
                        }

                        // ── Extract dish name & restaurant ──
                        var lines = text.split('\\n')
                            .map(function(s) { return s.trim(); })
                            .filter(function(s) { return s.length > 1; });

                        var dishName = lines[0] || q.toUpperCase();
                        var restaurantName = 'EatSure';

                        // EatSure usually shows brand name (Faasos, OvenStory etc) in the card
                        var knownBrands = ['Faasos', 'OvenStory', 'Behrouz', "Wendy's", 'The Good Bowl',
                                           'Mandarin Oak', 'Lunchbox', 'Firangi Bake', 'SLAY Coffee',
                                           'Yo China', 'Sweet Truth'];
                        for (var bi = 0; bi < knownBrands.length; bi++) {
                            if (lowerText.indexOf(knownBrands[bi].toLowerCase()) !== -1) {
                                restaurantName = knownBrands[bi] + ' (EatSure)';
                                break;
                            }
                        }
                        // Fallback: second line might be restaurant
                        if (restaurantName === 'EatSure' && lines.length > 1) {
                            restaurantName = lines[1] + ' (EatSure)';
                        }

                        // Dedup by dishName+price
                        var key = dishName + '_' + finalPrice;
                        if (seen[key]) return;
                        seen[key] = true;

                        var discount = originalPrice - finalPrice;

                        items.push({
                            title: dishName,
                            providerName: 'EatSure',
                            dishId: 'es_' + Math.random().toString(36).substr(2, 9),
                            dishName: dishName,
                            restaurantName: restaurantName,
                            restaurantUrl: window.location.href,
                            menuPrice: originalPrice,
                            autoCouponSavings: discount,
                            effectivePrice: finalPrice,
                            price: {
                                finalPayablePrice: finalPrice,
                                menuPrice: originalPrice,
                                basePrice: originalPrice,
                                discount: discount
                            },
                            offerText: offerText || (discount > 0 ? discount + ' OFF' : 'Best Price'),
                            couponCode: couponCode,
                            additionalOffers: couponCode ? [{
                                code: couponCode,
                                description: offerText,
                                flat: discount,
                                percent: 0,
                                maxCap: discount,
                                minOrder: 0
                            }] : []
                        });
                    });

                    if (items.length > 0) {
                        sendResults(items);
                        return true;
                    }
                    return false;
                }

                // ── Step 3: Poll every second for up to 15 seconds ────────────
                var attempts = 0;
                var timer = setInterval(function() {
                    attempts++;
                    var found = extractData();
                    if (found || attempts >= 15) {
                        clearInterval(timer);
                        // Send empty only if truly no results (not just slow DOM)
                        if (!found) {
                            window.ReactNativeWebView && window.ReactNativeWebView.postMessage(
                                JSON.stringify({ type: 'SEARCH_RESULTS', success: true, data: [] })
                            );
                        }
                    }
                }, 1000);
            })();
            true;
        `;
    }
};
