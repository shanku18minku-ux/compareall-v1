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
                  'belgaum', 'rohtak', 'all']
    },
    
    getLoginDetectionScript: () => {
        return `
            (function() {
                var checkLoginInterval = setInterval(function() {
                    var isLoggedIn = false;
                    try {
                        var token = localStorage.getItem('token') || localStorage.getItem('access_token');
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
        // We load the homepage first to set location cookies in the injected script,
        // then the script itself redirects to the actual search URL.
        return `https://www.eatsure.com/`;
    },

    getExtractorInjection: (url: string, query: string, location: any) => {
        const lat = location?.latitude || 0;
        const lng = location?.longitude || 0;
        const locName = location?.name || '';
        
        const safeQuery = JSON.stringify(query.toLowerCase());
        const safeLocName = JSON.stringify(locName);

        return `
            (function() {
                var q = ${safeQuery};
                var userLat = ${lat};
                var userLng = ${lng};
                var locName = ${safeLocName};

                // ── Step 1: Force EatSure to use our location ──────────────────
                if (userLat && userLng) {
                    try {
                        var locPayload = JSON.stringify({ lat: userLat, lng: userLng, address: locName });
                        localStorage.setItem('es_location', locPayload);
                        localStorage.setItem('user_location', locPayload);
                        localStorage.setItem('location', locPayload);
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

                // If we are on the homepage, wait for location auto-redirect to city page.
                // If we are on a city page, we try to click the Search icon and type the query!
                let searchAttempts = 0;
                function attemptSearchTrigger() {
                    // Try to find the search button (contains SVG and text "Search" or "search")
                    const allEls = document.querySelectorAll('div, button, a');
                    let searchBtn = null;
                    for (let i = 0; i < allEls.length; i++) {
                        const el = allEls[i];
                        if (el.textContent && el.textContent.trim().toLowerCase() === 'search' && el.querySelector('svg')) {
                            searchBtn = el;
                            break;
                        }
                    }

                    if (searchBtn) {
                        searchBtn.click();
                        // Wait for search input to appear in modal
                        setTimeout(() => {
                            const input = document.querySelector('input[placeholder*="earch"], input[type="text"]');
                            if (input) {
                                let lastValue = input.value;
                                input.value = q;
                                let event = new Event('input', { bubbles: true });
                                let tracker = input._valueTracker;
                                if (tracker) {
                                    tracker.setValue(lastValue);
                                }
                                input.dispatchEvent(event);
                                input.dispatchEvent(new Event('change', { bubbles: true }));
                            }
                        }, 1000);
                        return true;
                    }
                    return false;
                }

                // Try to trigger search once page is somewhat loaded
                setTimeout(() => {
                    if (!attemptSearchTrigger()) {
                        // Retry once after 2 seconds if not found
                        setTimeout(attemptSearchTrigger, 2000);
                    }
                }, 1500);

                var isDispatched = false;

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

                    // Deduplicate: keep only the most specific inner containers
                    var deduped = cards.filter(function(el) {
                        return !cards.some(function(other) {
                            return other !== el && el.contains(other) &&
                                   (el.clientHeight - other.clientHeight) < 80;
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

                        // ── Extract price (ignore 'OFF' or 'Cashback' numbers) ──
                        var rawPriceText = text.replace(/₹\s*\d+\s*(?:OFF|Cashback|Discount)/gi, '');
                        var priceRegex = /₹\s*(\d+)/g;
                        var priceMatches = [];
                        var m;
                        while ((m = priceRegex.exec(rawPriceText)) !== null) {
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
                        var discountMatch = text.match(/(\d+\s*%\s*OFF)/i) ||
                                           text.match(/(FLAT\s*(?:₹|Rs\.?)?\s*\d+\s*OFF)/i) ||
                                           text.match(/(Buy\s*\d+\s*Get\s*\d+)/i);
                        var couponMatch = text.match(/(?:USE|CODE)[:\s]+([A-Z0-9]{3,15})/i);

                        if (discountMatch) offerText = discountMatch[1].toUpperCase();
                        if (couponMatch) {
                            couponCode = couponMatch[1];
                            offerText = offerText ? offerText + ' | ' + couponCode : couponCode;
                        }

                        // ── Extract dish name & restaurant ──
                        var lines = text.split('\n')
                            .map(function(s) { return s.trim(); })
                            .filter(function(s) { 
                                return s.length > 2 && 
                                       !/^(BESTSELLER|MUST TRY|NEW|VEG|NON-VEG|PREMIUM|OFF|₹)/i.test(s); 
                            });

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
                        // Fallback: second line might be restaurant if it doesn't look like a price/desc
                        if (restaurantName === 'EatSure' && lines.length > 1 && lines[1].indexOf('₹') === -1) {
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
                            autoCouponSavings: couponCode ? discount : 0,
                            effectivePrice: finalPrice,
                            price: {
                                finalPayablePrice: finalPrice,
                                menuPrice: finalPrice, // Keep selling price as menuPrice unless coupon exists
                                basePrice: originalPrice,
                                discount: couponCode ? discount : 0
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
                        isDispatched = true;
                        sendResults(items);
                        return true;
                    }
                    return false;
                }

                // ── Step 3: Poll every 250ms for up to 15 seconds ────────────
                var attempts = 0;
                var timer = setInterval(function() {
                    if (isDispatched) {
                        clearInterval(timer);
                        return;
                    }
                    attempts++;
                    var found = extractData();
                    if (found || attempts >= 60) {
                        clearInterval(timer);
                        // Send empty only if truly no results (not just slow DOM)
                        if (!found) {
                            isDispatched = true;
                            window.ReactNativeWebView && window.ReactNativeWebView.postMessage(
                                JSON.stringify({ type: 'SEARCH_RESULTS', success: true, data: [] })
                            );
                        }
                    }
                }, 250);
            })();
            true;
        `;
    }
};
