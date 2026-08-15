export const getSwiggySearchInjection = (query: string) => {
  return `
    (function() {
      let attempts = 0;
      const interval = setInterval(() => {
          attempts++;
          if (attempts > 30) {
              clearInterval(interval);
              window.ReactNativeWebView.postMessage(JSON.stringify({ success: false, error: 'Timeout waiting for Swiggy results' }));
              return;
          }
          
          try {
            const results = [];
            
            // Wait for results to render
            if (document.body.innerText.toLowerCase().includes('result') || document.body.innerText.toLowerCase().includes('dish') || document.body.innerText.toLowerCase().includes('item')) {
                // Swiggy uses generic data-testid attributes or specific classes. 
                const items = document.querySelectorAll('div[data-testid="normal-dish-item"], div[class*="styles_container__"], div[class*="RestaurantList__"], div[class*="Dish__"]');
                
                items.forEach((item) => {
                   const nameElement = item.querySelector('h3, div[class*="itemNameText"], div[class*="styles_itemName"]');
                   const priceElement = item.querySelector('.rupee, span[class*="styles_price"], span[class*="styles_itemPrice"]');
                   const descElement = item.querySelector('div[class*="itemDesc"]');
                   
                   if (nameElement && priceElement) {
                       let priceText = priceElement.innerText.replace(/[^0-9]/g, '');
                       let price = parseInt(priceText, 10);
                       
                       // Swiggy often shows price as 15000 for 150 (since it might include decimal zeros without dot)
                       if (price > 1000 && !priceText.includes('.')) price = Math.floor(price/100);
                       
                       if (price > 0 && !results.find(r => r.title === nameElement.innerText.trim())) {
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
                   }
                });
                
                if (results.length > 0) {
                   clearInterval(interval);
                   const extractedData = {
                      success: true,
                      timestamp: Date.now(),
                      provider: 'food-a',
                      type: 'SEARCH_RESULTS',
                      data: results
                   };
                   window.ReactNativeWebView.postMessage(JSON.stringify(extractedData));
                }
            }
          } catch (e) {
             // Let it retry
          }
      }, 500);
    })();
    true;
  `;
};
