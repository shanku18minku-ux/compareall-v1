export const getZomatoSearchInjection = (query: string) => {
  return `
    (function() {
      try {
        const results = [];
        
        // Zomato typically wraps items in specific container classes
        const items = document.querySelectorAll('div[class*="sc-"] section');
        
        items.forEach((item) => {
           const nameElement = item.querySelector('h4');
           const priceElement = item.querySelector('span[class*="price"]');
           const descElement = item.querySelector('p');
           
           if (nameElement && priceElement) {
               let priceText = priceElement.innerText.replace(/[^0-9]/g, '');
               let price = parseInt(priceText, 10);
               
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
        });
        
        if (results.length > 0) {
           const extractedData = {
              success: true,
              timestamp: Date.now(),
              provider: 'food-b',
              type: 'SEARCH_RESULTS',
              data: results
           };
           window.ReactNativeWebView.postMessage(JSON.stringify(extractedData));
           return; 
        }
      } catch (e) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ success: false, error: e.message }));
      }
    })();
    true;
  `;
};
