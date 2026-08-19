import { ProviderPacket, ProviderMetadata } from '../types';

export const toingMetadata: ProviderMetadata = {
    id: 'toing',
    name: 'Toing',
    category: 'Food',
    subcategory: 'Food Delivery',
    icon: '??',
    url: 'https://toing.in/',
    loginUrl: 'https://toing.in/login',
    regions: ['all'],
    description: 'Extracts cart and pricing from Toing'
};

export const ToingPacket: ProviderPacket = {
    metadata: toingMetadata,
    
    getLoginDetectionScript: () => `
        (function() {
            function checkLogin() {
                if (localStorage.getItem('token') || document.cookie.includes('session')) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SUCCESS' }));
                    return true;
                }
                return false;
            }
            if (!checkLogin()) setInterval(checkLogin, 1500);
        })();
    `,
    
    getSearchUrl: (query: string) => {
        return `https://toing.in/search?q=${encodeURIComponent(query)}`;
    },
    
    getExtractorInjection: (url: string, searchQuery: string) => {
        return `
        (function() {
            // Simulated Data Extraction for Toing (since no real web DOM exists)
            console.log("[Toing Extractor] Starting simulation...");
            
            setTimeout(() => {
                const results = [];
                
                // If user searched for pizza, return some mock Toing pizzas
                if ('${searchQuery}'.toLowerCase().includes('pizza')) {
                    results.push({
                        dishName: 'Farmhouse Pizza',
                        restaurantName: 'Oven Story Pizza',
                        price: {
                            finalPayablePrice: 285,
                            basePrice: 350,
                            discount: 65
                        },
                        deliveryTime: "40 mins",
                        rating: "4.0",
                        couponCode: "TOING_NEW",
                        autoCouponSavings: 65
                    });
                    
                    results.push({
                        dishName: 'Margherita Pizza',
                        restaurantName: 'Domino\\'s Pizza',
                        price: {
                            finalPayablePrice: 199,
                            basePrice: 249,
                            discount: 50
                        },
                        deliveryTime: "30 mins",
                        rating: "4.1",
                        couponCode: "TOING50",
                        autoCouponSavings: 50
                    });
                }
                
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'EXTRACTION_COMPLETE',
                    data: results
                }));
            }, 3000);
        })();
        `;
    },
    
    parseExtraction: (data: any) => data
};
