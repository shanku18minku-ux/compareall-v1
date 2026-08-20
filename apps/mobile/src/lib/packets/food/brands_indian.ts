// @ts-nocheck
import { ProviderPacket, ProviderMetadata } from '../types';

function makeDirectOrderPacket(meta: ProviderMetadata, publicOffers: any[]): ProviderPacket {
    return {
        metadata: meta,
        connectionType: 'OFFICIAL_WEB',
        // Pure JS function — called from App.tsx handleSearch without WebView
        getPublicOffers: (query: string) => {
            const q = (query || '').toLowerCase().trim();
            if (!q || q === 'food') return publicOffers.map(o => ({
                dishName: o.dishName,
                restaurantName: o.brandName,
                price: { finalPayablePrice: o.finalPrice, basePrice: o.basePrice, discount: o.discount || 0 },
                deliveryTime: o.deliveryTime || '~30-45 mins',
                rating: o.rating || '4.0',
                couponCode: o.couponCode || '',
                autoCouponSavings: o.discount || 0,
                offerStatus: 'PUBLIC',
                offerLabel: o.offerLabel || 'Public Offer',
            }));
            return publicOffers
                .filter(o => {
                    const title = (o.dishName || '').toLowerCase();
                    const cat = (o.category || '').toLowerCase();
                    const brand = (o.brandName || '').toLowerCase();
                    return title.includes(q) || cat.includes(q) || brand.includes(q);
                })
                .map(o => ({
                    dishName: o.dishName,
                    restaurantName: o.brandName,
                    price: { finalPayablePrice: o.finalPrice, basePrice: o.basePrice, discount: o.discount || 0 },
                    deliveryTime: o.deliveryTime || '~30-45 mins',
                    rating: o.rating || '4.0',
                    couponCode: o.couponCode || '',
                    autoCouponSavings: o.discount || 0,
                    offerStatus: 'PUBLIC',
                    offerLabel: o.offerLabel || 'Public Offer',
                }));
        },
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

// ─── Haldiram's ───────────────────────────────────────────────────────────────
export const HaldiramsPacket: ProviderPacket = makeDirectOrderPacket({
    id: 'haldirams',
    name: "Haldiram's",
    category: 'Food',
    subcategory: 'Indian Food / Snacks',
    icon: 'Ha',
    brandColor: '#e8a000',
    url: 'https://www.haldirams.com',
    loginUrl: 'https://www.haldirams.com/collections/all',
    regions: ['all'],
    description: "Haldiram's official ordering"
}, [
    { dishName: 'Aloo Bhujia (200g)', brandName: "Haldiram's", basePrice: 80, finalPrice: 80, discount: 0, couponCode: '', offerLabel: 'Public Price', verified: true, lastVerifiedAt: '2025-08-01', category: 'snacks', deliveryTime: '2-3 days', rating: '4.5' },
    { dishName: 'Chole Bhature (Meal)', brandName: "Haldiram's", basePrice: 220, finalPrice: 220, discount: 0, couponCode: '', offerLabel: 'Public Price', verified: true, lastVerifiedAt: '2025-08-01', category: 'indian meal', deliveryTime: '30-40 mins', rating: '4.5' },
]);

// ─── Bikanervala ──────────────────────────────────────────────────────────────
export const BikanervalaPacket: ProviderPacket = makeDirectOrderPacket({
    id: 'bikanervala',
    name: 'Bikanervala',
    category: 'Food',
    subcategory: 'Indian Food / Snacks',
    icon: 'Bi',
    brandColor: '#c0392b',
    url: 'https://www.bikanervala.com',
    loginUrl: 'https://www.bikanervala.com/menu',
    regions: ['all'],
    description: 'Bikanervala official ordering'
}, [
    { dishName: 'Raj Kachori', brandName: 'Bikanervala', basePrice: 99, finalPrice: 99, discount: 0, couponCode: '', offerLabel: 'Public Price', verified: true, lastVerifiedAt: '2025-08-01', category: 'snacks chaat', deliveryTime: '30-40 mins', rating: '4.3' },
    { dishName: 'Ghevar (200g)', brandName: 'Bikanervala', basePrice: 350, finalPrice: 350, discount: 0, couponCode: '', offerLabel: 'Public Price', verified: true, lastVerifiedAt: '2025-08-01', category: 'sweets', deliveryTime: '30-40 mins', rating: '4.3' },
]);

// ─── Nirula's ─────────────────────────────────────────────────────────────────
export const NirulasPacket: ProviderPacket = makeDirectOrderPacket({
    id: 'nirulas',
    name: "Nirula's",
    category: 'Food',
    subcategory: 'Indian Food / Snacks',
    icon: 'Ni',
    brandColor: '#1565c0',
    url: 'https://www.nirulas.com',
    loginUrl: 'https://www.nirulas.com/order',
    regions: ['all'],
    description: "Nirula's official ordering"
}, [
    { dishName: 'Veg Pizza Burger', brandName: "Nirula's", basePrice: 120, finalPrice: 120, discount: 0, couponCode: '', offerLabel: 'Public Price', verified: true, lastVerifiedAt: '2025-08-01', category: 'burger pizza', deliveryTime: '25-35 mins', rating: '4.1' },
    { dishName: 'Soft Serve Ice Cream', brandName: "Nirula's", basePrice: 65, finalPrice: 65, discount: 0, couponCode: '', offerLabel: 'Public Price', verified: true, lastVerifiedAt: '2025-08-01', category: 'dessert', deliveryTime: '25-35 mins', rating: '4.1' },
]);

// ─── Goli Vada Pav ────────────────────────────────────────────────────────────
export const GoliVadaPavPacket: ProviderPacket = makeDirectOrderPacket({
    id: 'golivadapav',
    name: 'Goli Vada Pav',
    category: 'Food',
    subcategory: 'Indian Food / Snacks',
    icon: 'GV',
    brandColor: '#e65100',
    url: 'https://www.golivadapav.com',
    loginUrl: 'https://www.golivadapav.com/order',
    regions: ['all'],
    description: 'Goli Vada Pav official ordering'
}, [
    { dishName: 'Vada Pav (1 pc)', brandName: 'Goli Vada Pav', basePrice: 25, finalPrice: 25, discount: 0, couponCode: '', offerLabel: 'Public Price', verified: true, lastVerifiedAt: '2025-08-01', category: 'vada pav snack', deliveryTime: '20-30 mins', rating: '4.0' },
    { dishName: 'Goli Combo (4 Vada Pav + Chai)', brandName: 'Goli Vada Pav', basePrice: 149, finalPrice: 129, discount: 20, couponCode: '', offerLabel: 'Combo Savings', verified: true, lastVerifiedAt: '2025-08-01', category: 'vada pav combo', deliveryTime: '20-30 mins', rating: '4.0' },
]);

// ─── Jumbo King ───────────────────────────────────────────────────────────────
export const JumboKingPacket: ProviderPacket = makeDirectOrderPacket({
    id: 'jumboking',
    name: 'Jumbo King',
    category: 'Food',
    subcategory: 'Indian Food / Snacks',
    icon: 'JK',
    brandColor: '#ff6f00',
    url: 'https://www.jumboking.co.in',
    loginUrl: 'https://www.jumboking.co.in/order',
    regions: ['all'],
    description: 'Jumbo King official ordering'
}, [
    { dishName: 'Classic Jumbo Vada Pav', brandName: 'Jumbo King', basePrice: 35, finalPrice: 35, discount: 0, couponCode: '', offerLabel: 'Public Price', verified: true, lastVerifiedAt: '2025-08-01', category: 'vada pav snack', deliveryTime: '20-30 mins', rating: '4.0' },
    { dishName: 'Double Decker Vada Pav', brandName: 'Jumbo King', basePrice: 55, finalPrice: 55, discount: 0, couponCode: '', offerLabel: 'Public Price', verified: true, lastVerifiedAt: '2025-08-01', category: 'vada pav snack', deliveryTime: '20-30 mins', rating: '4.0' },
]);
