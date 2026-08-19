import { ProviderPacket, ProviderMetadata } from '../types';

export const toingMetadata: ProviderMetadata = {
    id: 'toing',
    name: 'Toing',
    category: 'Food',
    subcategory: 'Food Delivery',
    icon: '🛵',
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
            // No live website available for Toing, returning empty array as per strict instructions (No Mock Data)
            setTimeout(() => {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'EXTRACTION_COMPLETE',
                    data: []
                }));
            }, 1000);
        })();
        `;
    },
    
    parseExtraction: (data: any) => data
};
