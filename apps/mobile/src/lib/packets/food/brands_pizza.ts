// @ts-nocheck
import { makeWebViewBrandPacket } from './brand_webview_helper';

// ─── Domino's ─────────────────────────────────────────────────────────────────
// API: POST /orderapi/v1/menu/items {storeId, serviceType}
// XHR interception picks up menu response after store is auto-selected
export const DominosPacket = makeWebViewBrandPacket({
    id: 'dominos', name: "Domino's", category: 'Food', subcategory: 'Pizza',
    icon: 'D', brandColor: '#006491',
    url: 'https://pizzaonline.dominos.co.in',
    loginUrl: 'https://pizzaonline.dominos.co.in',
    regions: ['all'], description: "Domino's India official ordering",
}, [
    { dishName: 'Margherita Pizza (Regular)', brandName: "Domino's", basePrice: 199, finalPrice: 149, discount: 50, couponCode: 'PIZZA50', offerLabel: '₹50 OFF', category: 'pizza margherita', deliveryTime: '30-45 mins', rating: '4.1' },
    { dishName: 'Peppy Paneer Pizza (Regular)', brandName: "Domino's", basePrice: 299, finalPrice: 299, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'pizza paneer', deliveryTime: '30-45 mins', rating: '4.1' },
    { dishName: 'Veg Extravaganza (Large)', brandName: "Domino's", basePrice: 599, finalPrice: 599, discount: 0, couponCode: '', offerLabel: 'Buy 1 Get 1 via app', category: 'pizza veg large', deliveryTime: '30-45 mins', rating: '4.1' },
    { dishName: 'Double Cheese Margherita', brandName: "Domino's", basePrice: 249, finalPrice: 199, discount: 50, couponCode: 'PIZZA50', offerLabel: '₹50 OFF', category: 'pizza cheese', deliveryTime: '30-45 mins', rating: '4.2' },
    { dishName: 'Garlic Breadsticks', brandName: "Domino's", basePrice: 129, finalPrice: 99, discount: 30, couponCode: '', offerLabel: 'Combo Offer', category: 'side garlic bread', deliveryTime: '30-45 mins', rating: '4.3' },
    { dishName: 'Chicken Dominator (Large)', brandName: "Domino's", basePrice: 699, finalPrice: 699, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'pizza chicken large', deliveryTime: '30-45 mins', rating: '4.1' },
], {
    searchUrlFn: (q: string, loc: any) => {
        return 'https://pizzaonline.dominos.co.in';
    },
    // Domino's internal BFF API patterns (intercepted in WebView XHR)
    menuApiPatterns: [
        '/orderapi/v1/menu/items',
        '/orderapi/v1/menu',
        '/menu/items',
        '/api/menu',
        '/items/list',
        'MenuService',
    ],
    parseMenuApi: function(data: any, q: string) {
        var results: any[] = [];
        var qLow = (q || '').toLowerCase();
        function matchQ(s: string) { return !qLow || qLow === 'food' || s.toLowerCase().indexOf(qLow) !== -1; }
        function parseP(v: any) { return parseFloat((v||'0').toString().replace(/[^0-9.]/g,'')) || 0; }

        // Domino's API shape: { data: { categories: [{ categoryName, items: [{ name, price, discountedPrice, imageUrl, isVeg }] }] } }
        var categories = (data && (data.data?.categories || data.categories || data.result?.categories || []));
        (categories || []).forEach(function(cat: any) {
            var items = cat.items || cat.products || cat.menuItems || [];
            items.forEach(function(item: any) {
                var name = item.name || item.title || item.productName || '';
                if (!name || !matchQ(name)) return;
                var base = parseP(item.price || item.basePrice || item.originalPrice || 0);
                var final = parseP(item.discountedPrice || item.offerPrice || item.sellingPrice || item.price || base);
                if (base <= 0 && final <= 0) return;
                var disc = base > final ? (base - final) : 0;
                results.push({
                    dishName: name,
                    restaurantName: "Domino's",
                    dishImage: item.imageUrl || item.image || '',
                    price: { finalPayablePrice: final || base, basePrice: base || final, discount: disc },
                    deliveryTime: '30-45 mins',
                    rating: '4.1',
                    couponCode: item.couponCode || '',
                    autoCouponSavings: disc,
                    offerStatus: disc > 0 ? 'LIVE_OFFER' : 'PUBLIC',
                    offerLabel: disc > 0 ? ('₹' + disc + ' OFF') : 'Public Price',
                });
            });
        });
        return results;
    },
    itemSelector: '.product-card,.product-item,.sc-product-item,[class*="product-card"],[class*="cnt-menu-itms"] li,[class*="product-item"]',
    nameSelector: '.product-name,.name,h3,[class*="product-name"],[class*="title"],[class*="itm-nm"]',
    priceSelector: '.price,.product-price,[class*="price"],span.rupee,[class*="rupee"]',
    imageSelector: 'img',
    offerSelector: '.offer,.badge,.discount,[class*="offer"],[class*="badge"]',
    unavailableSignals: ['not available in your city', 'not serviceable', 'coming soon to your city', 'no stores found'],
});

// ─── Pizza Hut ────────────────────────────────────────────────────────────────
// API: GET /api/v2/menu?storeId=...&type=delivery
export const PizzaHutPacket = makeWebViewBrandPacket({
    id: 'pizzahut', name: 'Pizza Hut', category: 'Food', subcategory: 'Pizza',
    icon: 'PH', brandColor: '#cc0000',
    url: 'https://www.pizzahut.co.in',
    loginUrl: 'https://www.pizzahut.co.in/menu',
    regions: ['all'], description: 'Pizza Hut India official ordering',
}, [
    { dishName: 'Veggie Supreme Pizza (Medium)', brandName: 'Pizza Hut', basePrice: 399, finalPrice: 349, discount: 50, couponCode: 'PHFIRST', offerLabel: '₹50 OFF', category: 'pizza veg medium', deliveryTime: '35-50 mins', rating: '4.0' },
    { dishName: 'Paneer Makhani Pizza (Medium)', brandName: 'Pizza Hut', basePrice: 449, finalPrice: 449, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'pizza paneer medium', deliveryTime: '35-50 mins', rating: '4.0' },
    { dishName: 'Margherita (Personal)', brandName: 'Pizza Hut', basePrice: 199, finalPrice: 199, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'pizza margherita personal', deliveryTime: '35-50 mins', rating: '4.0' },
    { dishName: 'Stuffed Crust Veg Pizza', brandName: 'Pizza Hut', basePrice: 549, finalPrice: 499, discount: 50, couponCode: '', offerLabel: 'App Exclusive', category: 'pizza stuffed crust', deliveryTime: '35-50 mins', rating: '4.0' },
], {
    searchUrlFn: (q: string) => 'https://www.pizzahut.co.in/menu',
    menuApiPatterns: [
        '/api/v2/menu',
        '/bff/menu-catalog',
        '/api/menu-catalog',
        '/api/v2/products',
        'menu?storeId',
        'menu-catalog',
    ],
    parseMenuApi: function(data: any, q: string) {
        var results: any[] = [];
        var qLow = (q || '').toLowerCase();
        function matchQ(s: string) { return !qLow || qLow === 'food' || s.toLowerCase().indexOf(qLow) !== -1; }
        function parseP(v: any) { return parseFloat((v||'0').toString().replace(/[^0-9.]/g,'')) || 0; }

        // Pizza Hut shape: { data: { sections: [{ name, products: [{ name, price, sizes, imageUrl }] }] } }
        var sections = data?.data?.sections || data?.sections || data?.data?.categories || data?.categories || [];
        sections.forEach(function(sec: any) {
            var prods = sec.products || sec.items || sec.menuItems || [];
            prods.forEach(function(item: any) {
                var name = item.name || item.title || '';
                if (!name || !matchQ(name)) return;
                // Use smallest size price as entry price
                var base = parseP(item.price || (item.sizes && item.sizes[0] && item.sizes[0].price) || 0);
                var disc = 0;
                var final = base;
                results.push({
                    dishName: name,
                    restaurantName: 'Pizza Hut',
                    dishImage: item.imageUrl || item.image || '',
                    price: { finalPayablePrice: final, basePrice: base, discount: disc },
                    deliveryTime: '35-50 mins',
                    rating: '4.0',
                    couponCode: '',
                    autoCouponSavings: 0,
                    offerStatus: 'PUBLIC',
                    offerLabel: 'Public Price',
                });
            });
        });
        return results;
    },
    itemSelector: '.menu-item,.product-card,.item,[class*="menu-item"],[class*="pizza-item"],[data-synth="menu-item"]',
    nameSelector: '.name,.title,h3,[class*="name"],[data-synth="product-name"]',
    priceSelector: '.price,[class*="price"],[data-synth="product-price"]',
    imageSelector: 'img',
    offerSelector: '[class*="offer"],[class*="badge"],[class*="label"],[data-synth="offer-label"]',
    unavailableSignals: ['not serviceable', 'delivery unavailable', 'no stores near', 'coming soon'],
});

// ─── Oven Story Pizza ─────────────────────────────────────────────────────────
export const OvenStoryPacket = makeWebViewBrandPacket({
    id: 'ovenstory', name: 'Oven Story Pizza', category: 'Food', subcategory: 'Pizza',
    icon: 'OS', brandColor: '#e8401c',
    url: 'https://www.ovenstory.in',
    loginUrl: 'https://www.ovenstory.in/menu',
    regions: ['all'], description: 'Oven Story Pizza official ordering',
}, [
    { dishName: 'Classic Margherita (Regular)', brandName: 'Oven Story Pizza', basePrice: 249, finalPrice: 249, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'pizza margherita', deliveryTime: '30-45 mins', rating: '4.3' },
    { dishName: 'Pesto Italiano (Medium)', brandName: 'Oven Story Pizza', basePrice: 449, finalPrice: 379, discount: 70, couponCode: 'OSFIRST', offerLabel: '₹70 OFF First Order', category: 'pizza pesto', deliveryTime: '30-45 mins', rating: '4.3' },
    { dishName: '4-Cheese Pizza (Regular)', brandName: 'Oven Story Pizza', basePrice: 349, finalPrice: 299, discount: 50, couponCode: '', offerLabel: 'App Offer', category: 'pizza cheese', deliveryTime: '30-45 mins', rating: '4.3' },
], {
    searchUrlFn: (q: string) => 'https://www.ovenstory.in/menu',
    menuApiPatterns: ['/api/menu', '/menu/items', '/products', '/catalog'],
    parseMenuApi: function(data: any, q: string) {
        var results: any[] = [];
        var qLow = (q || '').toLowerCase();
        var items = data?.items || data?.data?.items || data?.products || data?.data?.products || [];
        items.forEach(function(item: any) {
            var name = item.name || item.title || '';
            if (!name) return;
            if (qLow && qLow !== 'food' && name.toLowerCase().indexOf(qLow) === -1) return;
            var base = parseFloat((item.price||'0').toString().replace(/[^0-9.]/g,'')) || 0;
            var final = parseFloat((item.offerPrice||item.discountedPrice||item.price||'0').toString().replace(/[^0-9.]/g,'')) || base;
            var disc = base > final ? base - final : 0;
            results.push({
                dishName: name,
                restaurantName: 'Oven Story Pizza',
                dishImage: item.imageUrl || item.image || '',
                price: { finalPayablePrice: final, basePrice: base, discount: disc },
                deliveryTime: '30-45 mins', rating: '4.3',
                couponCode: '', autoCouponSavings: disc,
                offerStatus: disc > 0 ? 'LIVE_OFFER' : 'PUBLIC',
                offerLabel: disc > 0 ? ('₹' + disc + ' OFF') : 'Public Price',
            });
        });
        return results;
    },
    itemSelector: '.product-card,.menu-item,.item,[class*="product"],[class*="item"]',
    nameSelector: '.name,.title,h3,[class*="name"]',
    priceSelector: '.price,[class*="price"]',
    imageSelector: 'img',
    offerSelector: '[class*="offer"],[class*="badge"]',
    unavailableSignals: ['not available', 'not serviceable', 'coming soon'],
});
