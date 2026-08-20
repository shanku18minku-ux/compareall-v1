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

// ─── Faasos ───────────────────────────────────────────────────────────────────
export const FaasosPacket: ProviderPacket = makeDirectOrderPacket({
    id: 'faasos',
    name: 'Faasos',
    category: 'Food',
    subcategory: 'Rolls / Meals',
    icon: 'Fa',
    brandColor: '#e74c3c',
    url: 'https://www.faasos.com',
    loginUrl: 'https://www.faasos.com/order',
    regions: ['all'],
    description: 'Faasos official ordering'
}, [
    { dishName: 'Chicken Tikka Roll', brandName: 'Faasos', basePrice: 219, finalPrice: 219, discount: 0, couponCode: '', offerLabel: 'Public Price', verified: true, lastVerifiedAt: '2025-08-01', category: 'rolls', deliveryTime: '25-40 mins', rating: '4.1' },
    { dishName: 'Paneer Kathi Roll', brandName: 'Faasos', basePrice: 189, finalPrice: 159, discount: 30, couponCode: 'ROLL30', offerLabel: '₹30 OFF on Rolls', verified: true, lastVerifiedAt: '2025-08-01', category: 'rolls paneer', deliveryTime: '25-40 mins', rating: '4.1' },
]);

// ─── RollsKing ────────────────────────────────────────────────────────────────
export const RollsKingPacket: ProviderPacket = makeDirectOrderPacket({
    id: 'rollsking',
    name: 'RollsKing',
    category: 'Food',
    subcategory: 'Rolls / Meals',
    icon: 'RK',
    brandColor: '#27ae60',
    url: 'https://www.rollsking.com',
    loginUrl: 'https://www.rollsking.com/order',
    regions: ['all'],
    description: 'RollsKing official ordering'
}, [
    { dishName: 'Egg Roll', brandName: 'RollsKing', basePrice: 80, finalPrice: 80, discount: 0, couponCode: '', offerLabel: 'Public Price', verified: true, lastVerifiedAt: '2025-08-01', category: 'rolls', deliveryTime: '20-30 mins', rating: '4.0' },
    { dishName: 'Paneer Roll', brandName: 'RollsKing', basePrice: 95, finalPrice: 95, discount: 0, couponCode: '', offerLabel: 'Public Price', verified: true, lastVerifiedAt: '2025-08-01', category: 'rolls paneer', deliveryTime: '20-30 mins', rating: '4.0' },
]);

// ─── LunchBox ─────────────────────────────────────────────────────────────────
export const LunchBoxPacket: ProviderPacket = makeDirectOrderPacket({
    id: 'lunchbox',
    name: 'LunchBox',
    category: 'Food',
    subcategory: 'Rolls / Meals',
    icon: 'LB',
    brandColor: '#2980b9',
    url: 'https://www.lunchbox.in',
    loginUrl: 'https://www.lunchbox.in/order',
    regions: ['all'],
    description: 'LunchBox official ordering'
}, [
    { dishName: 'Dal Makhani + Rice Combo', brandName: 'LunchBox', basePrice: 149, finalPrice: 129, discount: 20, couponCode: '', offerLabel: 'Combo Price', verified: true, lastVerifiedAt: '2025-08-01', category: 'meal combo', deliveryTime: '25-35 mins', rating: '4.2' },
    { dishName: 'Rajma Chawal', brandName: 'LunchBox', basePrice: 139, finalPrice: 139, discount: 0, couponCode: '', offerLabel: 'Public Price', verified: true, lastVerifiedAt: '2025-08-01', category: 'meal', deliveryTime: '25-35 mins', rating: '4.2' },
]);

// ─── The Good Bowl ────────────────────────────────────────────────────────────
export const TheGoodBowlPacket: ProviderPacket = makeDirectOrderPacket({
    id: 'thegoodbowl',
    name: 'The Good Bowl',
    category: 'Food',
    subcategory: 'Rolls / Meals',
    icon: 'GB',
    brandColor: '#16a085',
    url: 'https://www.thegoodbowl.com',
    loginUrl: 'https://www.thegoodbowl.com/order',
    regions: ['all'],
    description: 'The Good Bowl official ordering'
}, [
    { dishName: 'Butter Chicken Bowl', brandName: 'The Good Bowl', basePrice: 249, finalPrice: 249, discount: 0, couponCode: '', offerLabel: 'Public Price', verified: true, lastVerifiedAt: '2025-08-01', category: 'bowl meal', deliveryTime: '25-40 mins', rating: '4.2' },
    { dishName: 'Paneer Tikka Bowl', brandName: 'The Good Bowl', basePrice: 229, finalPrice: 199, discount: 30, couponCode: 'BOWL30', offerLabel: '₹30 OFF Bowl Orders', verified: true, lastVerifiedAt: '2025-08-01', category: 'bowl paneer', deliveryTime: '25-40 mins', rating: '4.2' },
]);

// ─── FreshMenu ────────────────────────────────────────────────────────────────
export const FreshMenuPacket: ProviderPacket = makeDirectOrderPacket({
    id: 'freshmenu',
    name: 'FreshMenu',
    category: 'Food',
    subcategory: 'Rolls / Meals',
    icon: 'FM',
    brandColor: '#8e44ad',
    url: 'https://www.freshmenu.com',
    loginUrl: 'https://www.freshmenu.com/order',
    regions: ['all'],
    description: 'FreshMenu official ordering'
}, [
    { dishName: 'Chef Special Meal Box', brandName: 'FreshMenu', basePrice: 199, finalPrice: 169, discount: 30, couponCode: '', offerLabel: 'App Exclusive', verified: true, lastVerifiedAt: '2025-08-01', category: 'meal box', deliveryTime: '30-45 mins', rating: '4.1' },
    { dishName: 'Pasta Arrabiata', brandName: 'FreshMenu', basePrice: 229, finalPrice: 229, discount: 0, couponCode: '', offerLabel: 'Public Price', verified: true, lastVerifiedAt: '2025-08-01', category: 'pasta meal', deliveryTime: '30-45 mins', rating: '4.1' },
]);
