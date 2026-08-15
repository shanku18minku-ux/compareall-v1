export const getSwiggyExtractorScript = (searchUrl: string) => `
(function() {
    // Basic extraction script
    var results = [];
    var seenIds = new Set();
    
    // We intercept XHR/Fetch to grab React Native DAPI responses
    var originalFetch = window.fetch;
    window.fetch = async function() {
        var response = await originalFetch.apply(this, arguments);
        var clone = response.clone();
        try {
            var data = await clone.json();
            if (arguments[0].includes && arguments[0].includes('/dapi/restaurants/search')) {
                parseSwiggySearchData(data);
            }
        } catch(e) {}
        return response;
    };

    function parseSwiggySearchData(data) {
        function searchObj(obj, currentRest) {
            if (!obj || typeof obj !== 'object' || results.length >= 10) return;
            
            var rest = currentRest;
            if (obj.restaurant && obj.restaurant.info) rest = obj.restaurant.info;
            
            if (Array.isArray(obj.dishes)) {
                obj.dishes.forEach(function(dish) {
                    if (dish.info && dish.info.name && dish.info.price && !seenIds.has(dish.info.id)) {
                        seenIds.add(dish.info.id);
                        results.push({
                            id: dish.info.id,
                            title: dish.info.name + ' (' + (rest ? rest.name : 'Swiggy') + ')',
                            originalPrice: dish.info.price / 100,
                            finalPrice: dish.info.price / 100, // Normalized logic in app
                            category: 'food'
                        });
                    }
                });
            }
            
            for (var k in obj) {
                if (typeof obj[k] === 'object') searchObj(obj[k], rest);
            }
        }
        
        searchObj(data, null);
        window.ReactNativeWebView.postMessage(JSON.stringify({ success: true, data: results }));
    }
})();
true;
`;
