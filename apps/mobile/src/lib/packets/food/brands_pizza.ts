// @ts-nocheck
import { makeWebViewBrandPacket } from './brand_webview_helper';

// ─── Domino's ─────────────────────────────────────────────────────────────────
// dominos.co.in — SPA with product-card components
export const DominosPacket = makeWebViewBrandPacket({
    id: 'dominos', name: "Domino's", category: 'Food', subcategory: 'Pizza',
    icon: 'D', brandColor: '#006491',
    url: 'https://www.dominos.co.in',
    loginUrl: 'https://www.dominos.co.in/pizza',
    regions: ['all'], description: "Domino's India official ordering",
}, [
    { dishName: 'Margherita Pizza (Regular)', brandName: "Domino's", basePrice: 199, finalPrice: 149, discount: 50, couponCode: 'PIZZA50', offerLabel: '₹50 OFF', category: 'pizza margherita', deliveryTime: '30-45 mins', rating: '4.1' },
    { dishName: 'Peppy Paneer Pizza (Regular)', brandName: "Domino's", basePrice: 299, finalPrice: 299, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'pizza paneer', deliveryTime: '30-45 mins', rating: '4.1' },
    { dishName: 'Veg Extravaganza (Large)', brandName: "Domino's", basePrice: 599, finalPrice: 599, discount: 0, couponCode: '', offerLabel: 'Buy 1 Get 1 via app', category: 'pizza veg large', deliveryTime: '30-45 mins', rating: '4.1' },
    { dishName: 'Double Cheese Margherita', brandName: "Domino's", basePrice: 249, finalPrice: 199, discount: 50, couponCode: 'PIZZA50', offerLabel: '₹50 OFF', category: 'pizza cheese', deliveryTime: '30-45 mins', rating: '4.2' },
    { dishName: 'Garlic Breadsticks', brandName: "Domino's", basePrice: 129, finalPrice: 99, discount: 30, couponCode: '', offerLabel: 'Combo Offer', category: 'side garlic bread', deliveryTime: '30-45 mins', rating: '4.3' },
], {
    searchUrlFn: (q, loc) => {
        // dominos.co.in uses category browsing — navigate to pizza page
        if (q && q.toLowerCase().includes('pizza')) return 'https://www.dominos.co.in/pizza';
        if (q && q.toLowerCase().includes('bread')) return 'https://www.dominos.co.in/sides';
        return `https://www.dominos.co.in/menu`;
    },
    itemSelector: '.product-card, .product-item, .sc-product-item, [class*="product-card"], [class*="product-item"]',
    nameSelector: '.product-name, .name, h3, [class*="product-name"], [class*="title"]',
    priceSelector: '.price, .product-price, [class*="price"], [class*="Price"]',
    imageSelector: 'img',
    offerSelector: '.offer, .badge, .discount, [class*="offer"], [class*="badge"]',
    unavailableSignals: ['not available in your city', 'not serviceable', 'coming soon to your city'],
});

// ─── Pizza Hut ────────────────────────────────────────────────────────────────
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
    searchUrlFn: (q, loc) => `https://www.pizzahut.co.in/menu`,
    itemSelector: '.menu-item, .product-card, .item, [class*="menu-item"], [class*="pizza-item"]',
    nameSelector: '.name, .title, h3, [class*="name"]',
    priceSelector: '.price, [class*="price"]',
    imageSelector: 'img',
    offerSelector: '[class*="offer"], [class*="badge"], [class*="label"]',
    unavailableSignals: ['not serviceable', 'not available', 'delivery unavailable'],
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
    searchUrlFn: (q, loc) => `https://www.ovenstory.in/menu`,
    itemSelector: '.product-card, .menu-item, .item, [class*="product"], [class*="item"]',
    nameSelector: '.name, .title, h3, [class*="name"]',
    priceSelector: '.price, [class*="price"]',
    imageSelector: 'img',
    offerSelector: '[class*="offer"], [class*="badge"]',
    unavailableSignals: ['not available', 'not serviceable', 'coming soon'],
});
