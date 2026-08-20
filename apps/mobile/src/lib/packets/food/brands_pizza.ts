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
            return `(function(){var q=${q};var publicOffers=${offersJson};var results=publicOffers.filter(function(o){if(!q||q==='food')return true;var t=(o.dishName||'').toLowerCase();return t.indexOf(q.toLowerCase())!==-1||(o.category||'').toLowerCase().indexOf(q.toLowerCase())!==-1;}).map(function(o){return{dishName:o.dishName,restaurantName:o.brandName,price:{finalPayablePrice:o.finalPrice,basePrice:o.basePrice,discount:o.discount||0},deliveryTime:o.deliveryTime||'~35-45 mins',rating:o.rating||'4.0',couponCode:o.couponCode||'',autoCouponSavings:o.discount||0,offerStatus:'PUBLIC',offerLabel:o.offerLabel||'Public Offer',offerVerified:o.verified!==false,lastVerifiedAt:o.lastVerifiedAt||'2025-08-01'};});if(window.ReactNativeWebView){window.ReactNativeWebView.postMessage(JSON.stringify({type:'SEARCH_RESULTS',success:true,data:results}));}})();`;
        },
        parseExtraction: (data: any) => data
    };
}

// ─── Domino's ─────────────────────────────────────────────────────────────────
export const DominosPacket: ProviderPacket = makeDirectOrderPacket({
    id: 'dominos',
    name: "Domino's",
    category: 'Food',
    subcategory: 'Pizza',
    icon: 'D',
    brandColor: '#006491',
    url: 'https://www.dominos.co.in',
    loginUrl: 'https://www.dominos.co.in/pizza',
    regions: ['all'],
    description: "Domino's India official ordering"
}, [
    { dishName: 'Margherita Pizza (Regular)', brandName: "Domino's", basePrice: 199, finalPrice: 149, discount: 50, couponCode: 'PIZZA50', offerLabel: '₹50 OFF on first order', verified: true, lastVerifiedAt: '2025-08-01', category: 'pizza', deliveryTime: '30-45 mins', rating: '4.1' },
    { dishName: 'Peppy Paneer Pizza (Regular)', brandName: "Domino's", basePrice: 299, finalPrice: 299, discount: 0, couponCode: '', offerLabel: 'Public Price', verified: true, lastVerifiedAt: '2025-08-01', category: 'pizza', deliveryTime: '30-45 mins', rating: '4.1' },
    { dishName: 'Veg Extravaganza (Large)', brandName: "Domino's", basePrice: 599, finalPrice: 599, discount: 0, couponCode: '', offerLabel: 'Buy 1 Get 1 via app', verified: true, lastVerifiedAt: '2025-08-01', category: 'pizza', deliveryTime: '30-45 mins', rating: '4.1' },
]);

// ─── Pizza Hut ────────────────────────────────────────────────────────────────
export const PizzaHutPacket: ProviderPacket = makeDirectOrderPacket({
    id: 'pizzahut',
    name: 'Pizza Hut',
    category: 'Food',
    subcategory: 'Pizza',
    icon: 'PH',
    brandColor: '#cc0000',
    url: 'https://www.pizzahut.co.in',
    loginUrl: 'https://www.pizzahut.co.in/order',
    regions: ['all'],
    description: 'Pizza Hut India official ordering'
}, [
    { dishName: 'Veggie Supreme Pizza (Medium)', brandName: 'Pizza Hut', basePrice: 399, finalPrice: 349, discount: 50, couponCode: 'PHFIRST', offerLabel: '₹50 OFF First Order', verified: true, lastVerifiedAt: '2025-08-01', category: 'pizza', deliveryTime: '35-50 mins', rating: '4.0' },
    { dishName: 'Paneer Makhani Pizza (Medium)', brandName: 'Pizza Hut', basePrice: 449, finalPrice: 449, discount: 0, couponCode: '', offerLabel: 'Public Price', verified: true, lastVerifiedAt: '2025-08-01', category: 'pizza', deliveryTime: '35-50 mins', rating: '4.0' },
]);

// ─── Oven Story Pizza ─────────────────────────────────────────────────────────
export const OvenStoryPacket: ProviderPacket = makeDirectOrderPacket({
    id: 'ovenstory',
    name: 'Oven Story Pizza',
    category: 'Food',
    subcategory: 'Pizza',
    icon: 'OS',
    brandColor: '#e8401c',
    url: 'https://www.ovenstory.in',
    loginUrl: 'https://www.ovenstory.in/order',
    regions: ['all'],
    description: 'Oven Story Pizza official ordering'
}, [
    { dishName: 'Classic Margherita (Regular)', brandName: 'Oven Story Pizza', basePrice: 249, finalPrice: 249, discount: 0, couponCode: '', offerLabel: 'Public Price', verified: true, lastVerifiedAt: '2025-08-01', category: 'pizza', deliveryTime: '30-45 mins', rating: '4.3' },
    { dishName: 'Pesto Italiano (Medium)', brandName: 'Oven Story Pizza', basePrice: 449, finalPrice: 379, discount: 70, couponCode: 'OSFIRST', offerLabel: '₹70 OFF First Order', verified: true, lastVerifiedAt: '2025-08-01', category: 'pizza', deliveryTime: '30-45 mins', rating: '4.3' },
]);
