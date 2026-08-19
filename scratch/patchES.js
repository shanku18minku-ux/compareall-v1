const fs = require('fs');
const file = 'apps/mobile/src/lib/packets/eatsure.ts';
let content = fs.readFileSync(file, 'utf8');

const oldUrlLogic = `    getSearchUrl: (query: string, location?: any) => {
        // EatSure doesn't use query params for search on web, it uses a dynamic React state modal.
        // We navigate to home, then our injected script will click the search icon and type.
        return 'https://www.eatsure.com/';
    },`;

const newUrlLogic = `    getSearchUrl: (query: string, location?: any) => {
        const q = query.toLowerCase();
        // EatSure has NO search bar on their website. 
        // Since they own specific brands, we map keywords directly to their brand pages!
        if (q.includes('pizza') || q.includes('oven')) return 'https://www.eatsure.com/ovenstory';
        if (q.includes('biryani') || q.includes('behrouz')) return 'https://www.eatsure.com/behrouz-biryani';
        if (q.includes('wrap') || q.includes('roll') || q.includes('faasos')) return 'https://www.eatsure.com/faasos';
        if (q.includes('burger') || q.includes('wendy')) return 'https://www.eatsure.com/wendys';
        if (q.includes('thali') || q.includes('meal') || q.includes('lunchbox')) return 'https://www.eatsure.com/lunchbox';
        if (q.includes('dessert') || q.includes('cake') || q.includes('sweet')) return 'https://www.eatsure.com/sweet-truth';
        if (q.includes('coffee') || q.includes('slay')) return 'https://www.eatsure.com/slay-coffee';
        if (q.includes('bowl') || q.includes('good bowl')) return 'https://www.eatsure.com/the-good-bowl';
        
        // Fallback to home if no keyword matches
        return 'https://www.eatsure.com/';
    },`;

content = content.replace(oldUrlLogic, newUrlLogic);

const replacementScript = `
        var q = \`\${safeQuery}\`;
        
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
                    var priceMatch = priceText.match(/\\d+/);
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
`;

content = content.replace(/getExtractorInjection:\s*\([^)]*\)\s*=>\s*\{[\s\S]*?return\s*`([\s\S]*?)`;\s*\}/, (match, p1) => {
    return `getExtractorInjection: (query: string, location?: any) => {
        const safeQuery = JSON.stringify(query.toLowerCase());
        return \`
            (function() {
                try {
                    ${replacementScript}
                } catch (e) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'SEARCH_RESULTS',
                        data: []
                    }));
                }
            })();
        \`;
    }`;
});

fs.writeFileSync(file, content);
console.log('Patched EatSure!');
