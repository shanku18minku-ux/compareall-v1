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
        // We load the homepage first to set location cookies in the injected script,
        // then the script itself redirects to the actual search URL.
        return `https://www.eatsure.com/`;
    },

    getExtractorInjection: (query: string, location?: any) => {
        const safeQuery = JSON.stringify(query.toLowerCase());
        return `
            (function() {
                try {
                    
        var q = `${safeQuery}`;
        
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
                    var priceMatch = priceText.match(/\d+/);
                    if (!priceMatch) return;
                    
                    var price = parseInt(priceMatch[0], 10);
                    
                    // Simple fuzzy match
                    if (q !== 'pizza' && q !== 'biryani' && q !== 'burger') {
                        var words = q.split(' ');
                        var matchCount = 0;
                        words.forEach(function(w) { if (title.toLowerCase().includes(w)) matchCount++; });
                        if (matchCount === 0 && words.length > 0) return;
                    }
                    
                    // Get brand name from URL
                    var brand = "EatSure Brand";
                    if (window.location.href.includes('ovenstory')) brand = "Oven Story Pizza";
                    if (window.location.href.includes('behrouz')) brand = "Behrouz Biryani";
                    if (window.location.href.includes('faasos')) brand = "Faasos";
                    if (window.location.href.includes('wendys')) brand = "Wendy's";
                    
                    items.push({
                        title: title + ' - ' + brand,
                        providerName: 'EatSure',
                        price: {
                            finalPayablePrice: price
                        },
                        menuPrice: price,
                        restaurantName: brand,
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
    }
};






