// @ts-nocheck
import { ProviderPacket, ProviderMetadata } from '../types';

function makeDirectOrderPacket(meta: ProviderMetadata, publicOffers: any[]): ProviderPacket {
    return {
        metadata: meta,
        connectionType: 'OFFICIAL_WEB',
        getLoginDetectionScript: () => `(function(){ if(window.ReactNativeWebView){window.ReactNativeWebView.postMessage(JSON.stringify({type:'OPEN_OFFICIAL'}));} })();`,
        getSearchUrl: (query: string, location?: any) => meta.loginUrl,
        getExtractorInjection: (url: string, searchQuery: string, location?: any) => {
            const offersJson = JSON.stringify(publicOffers);
            const q = JSON.stringify(searchQuery);
            return `(function(){var q=${q};var publicOffers=${offersJson};var results=publicOffers.filter(function(o){if(!q||q==='food')return true;var t=(o.dishName||'').toLowerCase();return t.indexOf(q.toLowerCase())!==-1||(o.category||'').toLowerCase().indexOf(q.toLowerCase())!==-1;}).map(function(o){return{dishName:o.dishName,restaurantName:o.brandName,price:{finalPayablePrice:o.finalPrice,basePrice:o.basePrice,discount:o.discount||0},deliveryTime:o.deliveryTime||'~30-45 mins',rating:o.rating||'4.0',couponCode:o.couponCode||'',autoCouponSavings:o.discount||0,offerStatus:'PUBLIC',offerLabel:o.offerLabel||'Public Offer',offerVerified:true,lastVerifiedAt:o.lastVerifiedAt||'2025-08-01'};});if(window.ReactNativeWebView){window.ReactNativeWebView.postMessage(JSON.stringify({type:'SEARCH_RESULTS',success:true,data:results}));}})();`;
        },
        parseExtraction: (data: any) => data
    };
}

// ─── Chaayos ──────────────────────────────────────────────────────────────────
export const ChaayosPacket: ProviderPacket = makeDirectOrderPacket({
    id: 'chaayos',
    name: 'Chaayos',
    category: 'Food',
    subcategory: 'Cafe',
    icon: 'Ch',
    brandColor: '#6d4c41',
    url: 'https://www.chaayos.com',
    loginUrl: 'https://www.chaayos.com/order',
    regions: ['all'],
    description: 'Chaayos official ordering'
}, [
    { dishName: 'Masala Chai (Regular)', brandName: 'Chaayos', basePrice: 80, finalPrice: 80, discount: 0, couponCode: '', offerLabel: 'Public Price', verified: true, lastVerifiedAt: '2025-08-01', category: 'chai tea', deliveryTime: '20-30 mins', rating: '4.4' },
    { dishName: 'Doodh Patti Chai', brandName: 'Chaayos', basePrice: 90, finalPrice: 90, discount: 0, couponCode: '', offerLabel: 'Public Price', verified: true, lastVerifiedAt: '2025-08-01', category: 'chai tea', deliveryTime: '20-30 mins', rating: '4.4' },
    { dishName: 'Meri Wali Chai (customized)', brandName: 'Chaayos', basePrice: 100, finalPrice: 85, discount: 15, couponCode: 'CHAAYOS15', offerLabel: '15% OFF App Order', verified: true, lastVerifiedAt: '2025-08-01', category: 'chai tea', deliveryTime: '20-30 mins', rating: '4.4' },
]);

// ─── Chai Point ────────────────────────────────────────────────────────────────
export const ChaiPointPacket: ProviderPacket = makeDirectOrderPacket({
    id: 'chaipoint',
    name: 'Chai Point',
    category: 'Food',
    subcategory: 'Cafe',
    icon: 'CP',
    brandColor: '#f4a101',
    url: 'https://www.chaipoint.com',
    loginUrl: 'https://order.chaipoint.com',
    regions: ['all'],
    description: 'Chai Point official ordering'
}, [
    { dishName: 'Classic Masala Chai', brandName: 'Chai Point', basePrice: 70, finalPrice: 70, discount: 0, couponCode: '', offerLabel: 'Public Price', verified: true, lastVerifiedAt: '2025-08-01', category: 'chai tea', deliveryTime: '20-30 mins', rating: '4.2' },
    { dishName: 'Adrak Chai', brandName: 'Chai Point', basePrice: 75, finalPrice: 75, discount: 0, couponCode: '', offerLabel: 'Public Price', verified: true, lastVerifiedAt: '2025-08-01', category: 'chai tea', deliveryTime: '20-30 mins', rating: '4.2' },
]);

// ─── Barista ──────────────────────────────────────────────────────────────────
export const BaristaPacket: ProviderPacket = makeDirectOrderPacket({
    id: 'barista',
    name: 'Barista',
    category: 'Food',
    subcategory: 'Cafe',
    icon: 'Ba',
    brandColor: '#5c3317',
    url: 'https://www.barista.co.in',
    loginUrl: 'https://www.barista.co.in/order',
    regions: ['all'],
    description: 'Barista Coffee official ordering'
}, [
    { dishName: 'Café Americano', brandName: 'Barista', basePrice: 175, finalPrice: 175, discount: 0, couponCode: '', offerLabel: 'Public Price', verified: true, lastVerifiedAt: '2025-08-01', category: 'coffee cafe', deliveryTime: '25-40 mins', rating: '4.1' },
    { dishName: 'Classic Cappuccino', brandName: 'Barista', basePrice: 215, finalPrice: 215, discount: 0, couponCode: '', offerLabel: 'Public Price', verified: true, lastVerifiedAt: '2025-08-01', category: 'coffee cafe', deliveryTime: '25-40 mins', rating: '4.1' },
]);
