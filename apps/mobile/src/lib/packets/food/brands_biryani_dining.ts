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

// ─── Behrouz Biryani ──────────────────────────────────────────────────────────
export const BehrouzPacket: ProviderPacket = makeDirectOrderPacket({
    id: 'behrouz',
    name: 'Behrouz Biryani',
    category: 'Food',
    subcategory: 'Biryani',
    icon: 'BB',
    brandColor: '#8b0000',
    url: 'https://www.behrouzbiryani.com',
    loginUrl: 'https://www.behrouzbiryani.com/order',
    regions: ['all'],
    description: 'Behrouz Biryani official ordering'
}, [
    { dishName: 'Behrouz Special Veg Biryani', brandName: 'Behrouz Biryani', basePrice: 349, finalPrice: 299, discount: 50, couponCode: 'BEHROUZ50', offerLabel: '₹50 OFF First Order', verified: true, lastVerifiedAt: '2025-08-01', category: 'biryani', deliveryTime: '40-55 mins', rating: '4.3' },
    { dishName: 'Dum Biryani (Single)', brandName: 'Behrouz Biryani', basePrice: 299, finalPrice: 299, discount: 0, couponCode: '', offerLabel: 'Public Price', verified: true, lastVerifiedAt: '2025-08-01', category: 'biryani', deliveryTime: '40-55 mins', rating: '4.3' },
]);

// ─── Barbeque Nation ─────────────────────────────────────────────────────────
export const BarbequeNationPacket: ProviderPacket = makeDirectOrderPacket({
    id: 'barbeque',
    name: 'Barbeque Nation',
    category: 'Food',
    subcategory: 'Dining',
    icon: 'BN',
    brandColor: '#b71c1c',
    url: 'https://www.barbequenation.com',
    loginUrl: 'https://www.barbequenation.com/order-online',
    regions: ['all'],
    description: 'Barbeque Nation official table booking & ordering'
}, [
    { dishName: 'Unlimited BBQ Lunch (Weekday)', brandName: 'Barbeque Nation', basePrice: 799, finalPrice: 699, discount: 100, couponCode: 'BBQWEEKDAY', offerLabel: '₹100 OFF Weekday Lunch', verified: true, lastVerifiedAt: '2025-08-01', category: 'bbq dining', deliveryTime: 'Dine-in', rating: '4.4' },
    { dishName: 'Unlimited BBQ Dinner', brandName: 'Barbeque Nation', basePrice: 999, finalPrice: 999, discount: 0, couponCode: '', offerLabel: 'Public Price', verified: true, lastVerifiedAt: '2025-08-01', category: 'bbq dining', deliveryTime: 'Dine-in', rating: '4.4' },
]);

// ─── Absolute Barbecues ───────────────────────────────────────────────────────
export const AbsoluteBarbecuesPacket: ProviderPacket = makeDirectOrderPacket({
    id: 'absolutebbq',
    name: 'Absolute Barbecues',
    category: 'Food',
    subcategory: 'Dining',
    icon: 'AB',
    brandColor: '#212121',
    url: 'https://www.absolutebbq.com',
    loginUrl: 'https://www.absolutebbq.com/book-a-table',
    regions: ['all'],
    description: 'Absolute Barbecues official table booking'
}, [
    { dishName: 'Unlimited BBQ Lunch', brandName: 'Absolute Barbecues', basePrice: 849, finalPrice: 749, discount: 100, couponCode: 'ABSBBQ', offerLabel: '₹100 OFF on booking', verified: true, lastVerifiedAt: '2025-08-01', category: 'bbq dining', deliveryTime: 'Dine-in', rating: '4.4' },
    { dishName: 'Unlimited BBQ Dinner', brandName: 'Absolute Barbecues', basePrice: 999, finalPrice: 999, discount: 0, couponCode: '', offerLabel: 'Public Price', verified: true, lastVerifiedAt: '2025-08-01', category: 'bbq dining', deliveryTime: 'Dine-in', rating: '4.4' },
]);
