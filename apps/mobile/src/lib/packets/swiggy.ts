import { ProviderPacket, ProviderMetadata } from './types';

export const swiggyMetadata: ProviderMetadata = {
    id: 'food-a',
    category: 'Food',
    subcategory: 'Food Delivery',
    name: 'Swiggy',
    icon: '🍔',
    authType: 'otp',
    url: 'https://www.swiggy.com',
    loginUrl: 'https://www.swiggy.com/auth',
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
    getExtractorInjection: (searchUrl: string) => `
        (function() {
            var attempts = 0;
            var maxAttempts = 15;
            
            var extractInterval = setInterval(function() {
                attempts++;
                try {
                    var extractedItems = [];
                    
                    // Selector set 1: Direct dish cards
                    var dishCards = document.querySelectorAll('[data-testid="normal-dish-item"], [data-testid="search-dish-name"], [class*="styles_container"], [class*="styles_itemContainer"]');
                    
                    if (dishCards && dishCards.length > 0) {
                        dishCards.forEach(function(card) {
                            if (extractedItems.length >= 15) return;
                            
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
                    
                    // Selector set 2: Fallback scanning all headings and price elements
                    if (extractedItems.length === 0) {
                        var allHeadings = document.querySelectorAll('h3, h4, div[class*="ItemName"]');
                        allHeadings.forEach(function(h) {
                            if (extractedItems.length >= 15) return;
                            var text = h.textContent.trim();
                            if (text.length > 2 && !text.includes('Swiggy') && !text.includes('Filter')) {
                                var parent = h.closest('div[class*="item"], div[class*="card"], div[class*="container"]') || h.parentElement;
                                if (parent) {
                                    var priceMatch = parent.textContent.match(/₹\s*([0-9]+)/);
                                    if (priceMatch) {
                                        var price = parseFloat(priceMatch[1]);
                                        if (price > 0 && !extractedItems.some(function(it) { return it.title === text; })) {
                                            extractedItems.push({
                                                title: text,
                                                providerName: 'Swiggy',
                                                price: {
                                                    finalPayablePrice: price,
                                                    basePrice: Math.round(price * 1.15),
                                                    discount: Math.round(price * 0.15)
                                                }
                                            });
                                        }
                                    }
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
        })();
        true;
    `,

    getSearchUrl: (query: string) => `https://www.swiggy.com/search?query=${encodeURIComponent(query)}`
};
