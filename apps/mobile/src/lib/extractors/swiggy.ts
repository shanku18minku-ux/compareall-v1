export const getSwiggySearchInjection = (query: string) => {
  return `
    (function() {
      try {
        // Find all restaurant/dish cards
        // Swiggy uses generic data-testid attributes or specific classes. 
        // This is a robust selector logic for Swiggy's current web UI
        const results = [];
        
        // Wait for results to render
        if (document.body.innerText.toLowerCase().includes('results for') || document.body.innerText.toLowerCase().includes('dishes')) {
            const items = document.querySelectorAll('div[data-testid="normal-dish-item"], .styles_container__1ie7h, .RestaurantList__RestaurantContainer');
            
            items.forEach((item) => {
               const nameElement = item.querySelector('.styles_itemNameText__3ZmZZ') || item.querySelector('h3') || item.querySelector('.styles_itemName__hLfgz');
               const priceElement = item.querySelector('.rupee') || item.querySelector('.styles_price__2xrhD');
               const descElement = item.querySelector('.styles_itemDesc__3vhM0');
               
               if (nameElement && priceElement) {
                   let priceText = priceElement.innerText.replace(/[^0-9]/g, '');
                   let price = parseInt(priceText, 10);
                   
                   results.push({
                       id: 'swiggy-' + Math.random().toString(36).substr(2, 9),
                       providerId: 'food-a',
                       providerName: 'Swiggy',
                       title: nameElement.innerText.trim(),
                       description: descElement ? descElement.innerText.trim() : '',
                       category: 'food',
                       status: 'LIVE',
                       price: {
                           basePrice: price,
                           finalPayablePrice: price + 40, // Mock delivery fee for now
                           discount: 0,
                           currency: 'INR'
                       },
                       isAvailable: true,
                       deepLinkUrl: window.location.href,
                   });
               }
            });
            
            if (results.length > 0) {
               const extractedData = {
                  success: true,
                  timestamp: Date.now(),
                  provider: 'food-a',
                  type: 'SEARCH_RESULTS',
                  data: results
               };
               window.ReactNativeWebView.postMessage(JSON.stringify(extractedData));
               return; // Exit once successful
            }
        }
      } catch (e) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ success: false, error: e.message }));
      }
    })();
    true;
  `;
};
