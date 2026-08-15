export const getZomatoSearchInjection = (query: string) => {
  return `
    (function() {
      let attempts = 0;
      const interval = setInterval(() => {
          attempts++;
          if (attempts > 30) {
              clearInterval(interval);
              window.ReactNativeWebView.postMessage(JSON.stringify({ success: false, error: 'Timeout waiting for Zomato results' }));
              return;
          }
          
          try {
            const results = [];
            
            // Zomato uses specific container classes or h4 tags for dish names
            const items = document.querySelectorAll('div[class*="sc-"] section, div[class*="jumbo-tracker"]');
            
            items.forEach((item) => {
               const nameElement = item.querySelector('h4');
               const priceElement = item.querySelector('span[class*="price"], div[class*="price"]');
               const descElement = item.querySelector('p');
               
               if (nameElement && priceElement) {
                   let priceText = priceElement.innerText.replace(/[^0-9]/g, '');
                   let price = parseInt(priceText, 10);
                   
                   // Sometimes price is 15000 for 150.00
                   if (price > 1000 && !priceText.includes('.')) price = Math.floor(price/100);
                   
                   if (price > 0 && !results.find(r => r.title === nameElement.innerText.trim())) {
                       results.push({
                           id: 'zomato-' + Math.random().toString(36).substr(2, 9),
                           providerId: 'food-b',
                           providerName: 'Zomato',
                           title: nameElement.innerText.trim(),
                           description: descElement ? descElement.innerText.trim() : '',
                           category: 'food',
                           status: 'LIVE',
                           price: {
                               basePrice: price,
                               finalPayablePrice: price + 40,
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
                  provider: 'food-b',
                  type: 'SEARCH_RESULTS',
                  data: results
               };
               window.ReactNativeWebView.postMessage(JSON.stringify(extractedData));
            }
          } catch (e) {
             // Let it retry
          }
      }, 500);
    })();
    true;
  `;
};
