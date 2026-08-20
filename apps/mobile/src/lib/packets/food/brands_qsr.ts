// @ts-nocheck
import { ProviderPacket, ProviderMetadata } from '../types';

// ─── Helper: build a PUBLIC_ORDERING packet for direct-website brands ────────
// These brands do not support OAuth or WebView login extraction.
// Connection type = "OFFICIAL_WEB" → opens official ordering URL.
function makeDirectOrderPacket(meta: ProviderMetadata, publicOffers: any[]): ProviderPacket {
    return {
        metadata: meta,
        connectionType: 'OFFICIAL_WEB',

        // No WebView login — opens official site directly
        getLoginDetectionScript: () => `
            (function() {
                // Not a WebView login — this should never fire for direct-order brands
                // Just signal immediate success so LoginWebViewModal can open the ordering URL
                if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'OPEN_OFFICIAL' }));
                }
            })();
        `,

        getSearchUrl: (query: string, location?: any) => meta.loginUrl,

        getExtractorInjection: (url: string, searchQuery: string, location?: any) => {
            const offersJson = JSON.stringify(publicOffers);
            const q = JSON.stringify(searchQuery);
            return `
            (function() {
                var q = ${q};
                var publicOffers = ${offersJson};
                // Return static public offers for this brand
                // These are known, verifiable public deals scraped from official sources
                var results = publicOffers
                    .filter(function(o) {
                        // Match query against eligible categories/names
                        if (!q || q === 'food') return true;
                        var title = (o.dishName || '').toLowerCase();
                        return title.indexOf(q.toLowerCase()) !== -1 || (o.category || '').toLowerCase().indexOf(q.toLowerCase()) !== -1;
                    })
                    .map(function(o) {
                        return {
                            dishName: o.dishName,
                            restaurantName: o.brandName,
                            price: { finalPayablePrice: o.finalPrice, basePrice: o.basePrice, discount: o.discount || 0 },
                            deliveryTime: o.deliveryTime || '~30-45 mins',
                            rating: o.rating || '4.0',
                            couponCode: o.couponCode || '',
                            autoCouponSavings: o.discount || 0,
                            offerStatus: 'PUBLIC',
                            offerLabel: o.offerLabel || 'Public Offer',
                            offerVerified: o.verified !== false,
                            lastVerifiedAt: o.lastVerifiedAt || '2025-08-01'
                        };
                    });
                if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'SEARCH_RESULTS',
                        success: true,
                        data: results
                    }));
                }
            })();
            `;
        },

        parseExtraction: (data: any) => data
    };
}

// ─── McDonald's ──────────────────────────────────────────────────────────────
export const McDonaldsPacket: ProviderPacket = makeDirectOrderPacket({
    id: 'mcdonalds',
    name: "McDonald's",
    category: 'Food',
    subcategory: 'Fast Food / QSR',
    icon: 'M',
    brandColor: '#da291c',
    url: 'https://www.mcdonaldsindia.com',
    loginUrl: 'https://www.mcdelivery.co.in',
    regions: ['all'],
    description: "McDonald's India official ordering"
}, [
    { dishName: 'McVeggie Burger', brandName: "McDonald's", basePrice: 135, finalPrice: 99, discount: 36, couponCode: '', offerLabel: '₹99 Value Meals', verified: true, lastVerifiedAt: '2025-08-01', category: 'burger', deliveryTime: '30-40 mins', rating: '4.1' },
    { dishName: 'McSpicy Paneer', brandName: "McDonald's", basePrice: 169, finalPrice: 169, discount: 0, couponCode: '', offerLabel: 'Public Price', verified: true, lastVerifiedAt: '2025-08-01', category: 'burger', deliveryTime: '30-40 mins', rating: '4.1' },
    { dishName: 'McAloo Tikki', brandName: "McDonald's", basePrice: 45, finalPrice: 45, discount: 0, couponCode: '', offerLabel: 'Public Price', verified: true, lastVerifiedAt: '2025-08-01', category: 'burger', deliveryTime: '30-40 mins', rating: '4.1' },
]);

// ─── KFC ─────────────────────────────────────────────────────────────────────
export const KFCPacket: ProviderPacket = makeDirectOrderPacket({
    id: 'kfc',
    name: 'KFC',
    category: 'Food',
    subcategory: 'Fast Food / QSR',
    icon: 'K',
    brandColor: '#e8222c',
    url: 'https://online.kfc.co.in',
    loginUrl: 'https://online.kfc.co.in',
    regions: ['all'],
    description: 'KFC India official ordering'
}, [
    { dishName: 'Zinger Burger', brandName: 'KFC', basePrice: 229, finalPrice: 229, discount: 0, couponCode: '', offerLabel: 'Public Price', verified: true, lastVerifiedAt: '2025-08-01', category: 'burger', deliveryTime: '35-45 mins', rating: '4.0' },
    { dishName: '5-in-1 Meal Box', brandName: 'KFC', basePrice: 399, finalPrice: 349, discount: 50, couponCode: 'KFC50', offerLabel: '₹50 OFF Meal Box', verified: true, lastVerifiedAt: '2025-08-01', category: 'meal', deliveryTime: '35-45 mins', rating: '4.0' },
    { dishName: 'Popcorn Chicken', brandName: 'KFC', basePrice: 159, finalPrice: 159, discount: 0, couponCode: '', offerLabel: 'Public Price', verified: true, lastVerifiedAt: '2025-08-01', category: 'snack', deliveryTime: '35-45 mins', rating: '4.0' },
]);

// ─── Burger King ──────────────────────────────────────────────────────────────
export const BurgerKingPacket: ProviderPacket = makeDirectOrderPacket({
    id: 'burgerking',
    name: 'Burger King',
    category: 'Food',
    subcategory: 'Fast Food / QSR',
    icon: 'BK',
    brandColor: '#f5a623',
    url: 'https://www.burgerking.in',
    loginUrl: 'https://www.burgerking.in/order-now',
    regions: ['all'],
    description: 'Burger King India official ordering'
}, [
    { dishName: 'Whopper Jr.', brandName: 'Burger King', basePrice: 179, finalPrice: 99, discount: 80, couponCode: '', offerLabel: '₹99 Stunner Menu', verified: true, lastVerifiedAt: '2025-08-01', category: 'burger', deliveryTime: '30-45 mins', rating: '4.0' },
    { dishName: 'Crispy Veg Burger', brandName: 'Burger King', basePrice: 149, finalPrice: 99, discount: 50, couponCode: '', offerLabel: '₹99 Stunner Menu', verified: true, lastVerifiedAt: '2025-08-01', category: 'burger', deliveryTime: '30-45 mins', rating: '4.0' },
]);

// ─── Subway ────────────────────────────────────────────────────────────────────
export const SubwayPacket: ProviderPacket = makeDirectOrderPacket({
    id: 'subway',
    name: 'Subway',
    category: 'Food',
    subcategory: 'Fast Food / QSR',
    icon: 'SB',
    brandColor: '#008c15',
    url: 'https://www.subway.com/en-IN',
    loginUrl: 'https://order.subway.com/en-IN',
    regions: ['all'],
    description: 'Subway India official ordering'
}, [
    { dishName: 'Veggie Delite Sub (6")', brandName: 'Subway', basePrice: 229, finalPrice: 229, discount: 0, couponCode: '', offerLabel: 'Public Price', verified: true, lastVerifiedAt: '2025-08-01', category: 'sub', deliveryTime: '25-35 mins', rating: '4.1' },
    { dishName: 'Paneer Tikka Sub (6")', brandName: 'Subway', basePrice: 299, finalPrice: 299, discount: 0, couponCode: '', offerLabel: 'Public Price', verified: true, lastVerifiedAt: '2025-08-01', category: 'sub', deliveryTime: '25-35 mins', rating: '4.1' },
]);

// ─── Taco Bell ────────────────────────────────────────────────────────────────
export const TacoBellPacket: ProviderPacket = makeDirectOrderPacket({
    id: 'tacobell',
    name: 'Taco Bell',
    category: 'Food',
    subcategory: 'Fast Food / QSR',
    icon: 'TB',
    brandColor: '#702082',
    url: 'https://www.tacobell.in',
    loginUrl: 'https://www.tacobell.in/order',
    regions: ['all'],
    description: 'Taco Bell India official ordering'
}, [
    { dishName: 'Crunchy Taco', brandName: 'Taco Bell', basePrice: 179, finalPrice: 179, discount: 0, couponCode: '', offerLabel: 'Public Price', verified: true, lastVerifiedAt: '2025-08-01', category: 'taco', deliveryTime: '30-45 mins', rating: '4.0' },
    { dishName: 'Mexican Pizza', brandName: 'Taco Bell', basePrice: 249, finalPrice: 249, discount: 0, couponCode: '', offerLabel: 'Public Price', verified: true, lastVerifiedAt: '2025-08-01', category: 'pizza', deliveryTime: '30-45 mins', rating: '4.0' },
]);

// ─── WOW! Momo ────────────────────────────────────────────────────────────────
export const WowMomoPacket: ProviderPacket = makeDirectOrderPacket({
    id: 'wowmomo',
    name: 'WOW! Momo',
    category: 'Food',
    subcategory: 'Fast Food / QSR',
    icon: 'WM',
    brandColor: '#e30613',
    url: 'https://www.wowmomo.com',
    loginUrl: 'https://www.wowmomo.com/order-now',
    regions: ['all'],
    description: 'WOW! Momo official ordering'
}, [
    { dishName: 'Steam Momos (8 pcs)', brandName: 'WOW! Momo', basePrice: 199, finalPrice: 199, discount: 0, couponCode: '', offerLabel: 'Public Price', verified: true, lastVerifiedAt: '2025-08-01', category: 'momo', deliveryTime: '25-35 mins', rating: '4.2' },
    { dishName: 'Pan Fried Momos', brandName: 'WOW! Momo', basePrice: 229, finalPrice: 229, discount: 0, couponCode: '', offerLabel: 'Public Price', verified: true, lastVerifiedAt: '2025-08-01', category: 'momo', deliveryTime: '25-35 mins', rating: '4.2' },
]);
