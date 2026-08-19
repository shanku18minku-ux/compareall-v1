import { ProviderPacket, ProviderMetadata } from '../types';

export const ownlyMetadata: ProviderMetadata = {
    id: 'ownly',
    name: 'Ownly',
    category: 'Food',
    subcategory: 'Food Delivery',
    icon: '??',
    url: 'https://ownly.in/',
    loginUrl: 'https://ownly.in/login',
    regions: ['all'],
    description: 'Extracts cart and pricing from Ownly'
};

export const OwnlyPacket: ProviderPacket = {
    metadata: ownlyMetadata,
    
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
        return `https://ownly.in/search?q=${encodeURIComponent(query)}`;
    },
    
    getExtractorInjection: (url: string, searchQuery: string) => {
        return `
        (function() {
            setTimeout(() => {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'EXTRACTION_COMPLETE',
                    data: []
                }));
            }, 3000);
        })();
        `;
    },
    
    parseExtraction: (data: any) => data
};
