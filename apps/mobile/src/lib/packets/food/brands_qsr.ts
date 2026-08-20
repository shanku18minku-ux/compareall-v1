// @ts-nocheck
import { makeWebViewBrandPacket } from './brand_webview_helper';

// ─── McDonald's ───────────────────────────────────────────────────────────────
// Site: mcdelivery.co.in — React SPA, items in product-card divs
export const McDonaldsPacket = makeWebViewBrandPacket({
    id: 'mcdonalds', name: "McDonald's", category: 'Food', subcategory: 'Fast Food / QSR',
    icon: 'M', brandColor: '#da291c',
    url: 'https://www.mcdelivery.co.in',
    loginUrl: 'https://www.mcdelivery.co.in',
    regions: ['all'], description: "McDonald's India ordering",
}, [
    { dishName: 'McVeggie Burger', brandName: "McDonald's", basePrice: 135, finalPrice: 99, discount: 36, couponCode: '', offerLabel: '₹99 Value Meals', category: 'burger', deliveryTime: '30-40 mins', rating: '4.1' },
    { dishName: 'McSpicy Paneer', brandName: "McDonald's", basePrice: 169, finalPrice: 169, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'burger', deliveryTime: '30-40 mins', rating: '4.1' },
    { dishName: 'McAloo Tikki', brandName: "McDonald's", basePrice: 45, finalPrice: 45, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'burger', deliveryTime: '30-40 mins', rating: '4.1' },
    { dishName: 'Chicken McGrill', brandName: "McDonald's", basePrice: 149, finalPrice: 149, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'burger chicken', deliveryTime: '30-40 mins', rating: '4.1' },
    { dishName: 'McSaver Meal', brandName: "McDonald's", basePrice: 249, finalPrice: 199, discount: 50, couponCode: '', offerLabel: 'McSaver Combo', category: 'meal combo', deliveryTime: '30-40 mins', rating: '4.1' },
], {
    searchUrlFn: (q, loc) => `https://www.mcdelivery.co.in/in/?s=${encodeURIComponent(q || '')}`,
    itemSelector: '.product-item, .menu-item, .product-card, [class*="product"], [class*="menu-item"]',
    nameSelector: '.product-title, .item-name, h3, h4, [class*="title"], [class*="name"]',
    priceSelector: '.price, .product-price, [class*="price"]',
    imageSelector: 'img',
    offerSelector: '.badge, .offer, [class*="offer"], [class*="badge"]',
    unavailableSignals: ['not available', 'not serviceable', 'coming soon'],
});

// ─── KFC ──────────────────────────────────────────────────────────────────────
export const KFCPacket = makeWebViewBrandPacket({
    id: 'kfc', name: 'KFC', category: 'Food', subcategory: 'Fast Food / QSR',
    icon: 'K', brandColor: '#e8222c',
    url: 'https://online.kfc.co.in',
    loginUrl: 'https://online.kfc.co.in',
    regions: ['all'], description: 'KFC India official ordering',
}, [
    { dishName: 'Zinger Burger', brandName: 'KFC', basePrice: 229, finalPrice: 229, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'burger chicken', deliveryTime: '35-45 mins', rating: '4.0' },
    { dishName: '5-in-1 Meal Box', brandName: 'KFC', basePrice: 399, finalPrice: 349, discount: 50, couponCode: 'KFC50', offerLabel: '₹50 OFF Meal Box', category: 'meal combo', deliveryTime: '35-45 mins', rating: '4.0' },
    { dishName: 'Popcorn Chicken', brandName: 'KFC', basePrice: 159, finalPrice: 159, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'chicken snack', deliveryTime: '35-45 mins', rating: '4.0' },
    { dishName: 'Hot & Crispy Chicken (2 pc)', brandName: 'KFC', basePrice: 219, finalPrice: 219, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'chicken', deliveryTime: '35-45 mins', rating: '4.0' },
], {
    searchUrlFn: (q, loc) => `https://online.kfc.co.in/menu`,
    itemSelector: '.product-card, .menu-item, .item, [class*="product-card"], [class*="item-card"]',
    nameSelector: '.product-name, .name, h3, [class*="name"], [class*="title"]',
    priceSelector: '.product-price, .price, [class*="price"]',
    imageSelector: 'img',
    offerSelector: '.badge, .offer, .tag, [class*="offer"]',
    unavailableSignals: ['not available', 'no outlet', 'not serviceable'],
});

// ─── Burger King ──────────────────────────────────────────────────────────────
export const BurgerKingPacket = makeWebViewBrandPacket({
    id: 'burgerking', name: 'Burger King', category: 'Food', subcategory: 'Fast Food / QSR',
    icon: 'BK', brandColor: '#f5a623',
    url: 'https://www.burgerking.in',
    loginUrl: 'https://www.burgerking.in/order-now',
    regions: ['all'], description: 'Burger King India ordering',
}, [
    { dishName: 'Whopper Jr.', brandName: 'Burger King', basePrice: 179, finalPrice: 99, discount: 80, couponCode: '', offerLabel: '₹99 Stunner Menu', category: 'burger', deliveryTime: '30-45 mins', rating: '4.0' },
    { dishName: 'Crispy Veg Burger', brandName: 'Burger King', basePrice: 149, finalPrice: 99, discount: 50, couponCode: '', offerLabel: '₹99 Stunner Menu', category: 'burger veg', deliveryTime: '30-45 mins', rating: '4.0' },
    { dishName: 'BK Double Whopper', brandName: 'Burger King', basePrice: 299, finalPrice: 299, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'burger', deliveryTime: '30-45 mins', rating: '4.0' },
], {
    searchUrlFn: (q, loc) => `https://www.burgerking.in/order-now`,
    itemSelector: '.product, .menu-item, .item-card, [class*="item"], [class*="product"]',
    nameSelector: '.name, .title, h3, h4, [class*="name"]',
    priceSelector: '.price, .amount, [class*="price"]',
    imageSelector: 'img',
    offerSelector: '.tag, .label, .badge, [class*="tag"]',
    unavailableSignals: ['not available', 'coming soon', 'not serviceable'],
});

// ─── Subway ───────────────────────────────────────────────────────────────────
export const SubwayPacket = makeWebViewBrandPacket({
    id: 'subway', name: 'Subway', category: 'Food', subcategory: 'Fast Food / QSR',
    icon: 'SB', brandColor: '#008c15',
    url: 'https://order.subway.com/en-IN',
    loginUrl: 'https://order.subway.com/en-IN',
    regions: ['all'], description: 'Subway India official ordering',
}, [
    { dishName: 'Veggie Delite Sub (6")', brandName: 'Subway', basePrice: 229, finalPrice: 229, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'sub sandwich', deliveryTime: '25-35 mins', rating: '4.1' },
    { dishName: 'Paneer Tikka Sub (6")', brandName: 'Subway', basePrice: 299, finalPrice: 299, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'sub paneer', deliveryTime: '25-35 mins', rating: '4.1' },
    { dishName: 'Aloo Patty Sub (6")', brandName: 'Subway', basePrice: 199, finalPrice: 199, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'sub veg', deliveryTime: '25-35 mins', rating: '4.1' },
], {
    searchUrlFn: (q, loc) => `https://order.subway.com/en-IN/menu`,
    itemSelector: '.menu-item, .product-card, [data-testid*="product"], [class*="menu-item"]',
    nameSelector: '.name, .title, h3, [class*="name"]',
    priceSelector: '.price, [class*="price"]',
    imageSelector: 'img',
    offerSelector: '[class*="offer"], [class*="badge"], [class*="discount"]',
    unavailableSignals: ['not available', 'select a restaurant', 'delivery not available'],
});

// ─── Taco Bell ────────────────────────────────────────────────────────────────
export const TacoBellPacket = makeWebViewBrandPacket({
    id: 'tacobell', name: 'Taco Bell', category: 'Food', subcategory: 'Fast Food / QSR',
    icon: 'TB', brandColor: '#702082',
    url: 'https://www.tacobell.in',
    loginUrl: 'https://www.tacobell.in/order',
    regions: ['all'], description: 'Taco Bell India ordering',
}, [
    { dishName: 'Crunchy Taco', brandName: 'Taco Bell', basePrice: 179, finalPrice: 179, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'taco', deliveryTime: '30-45 mins', rating: '4.0' },
    { dishName: 'Mexican Pizza', brandName: 'Taco Bell', basePrice: 249, finalPrice: 249, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'pizza taco', deliveryTime: '30-45 mins', rating: '4.0' },
    { dishName: 'Nachos Party Pack', brandName: 'Taco Bell', basePrice: 349, finalPrice: 299, discount: 50, couponCode: '', offerLabel: 'Combo Saving', category: 'nachos snack', deliveryTime: '30-45 mins', rating: '4.0' },
], {
    searchUrlFn: (q, loc) => `https://www.tacobell.in/order`,
    itemSelector: '.item, .product, [class*="item"], [class*="product"]',
    nameSelector: '.name, h3, h4, [class*="name"]',
    priceSelector: '.price, [class*="price"]',
    imageSelector: 'img',
    offerSelector: '[class*="offer"], [class*="badge"]',
    unavailableSignals: ['not available', 'coming soon'],
});

// ─── WOW! Momo ────────────────────────────────────────────────────────────────
export const WowMomoPacket = makeWebViewBrandPacket({
    id: 'wowmomo', name: 'WOW! Momo', category: 'Food', subcategory: 'Fast Food / QSR',
    icon: 'WM', brandColor: '#e30613',
    url: 'https://www.wowmomo.com',
    loginUrl: 'https://www.wowmomo.com/order-now',
    regions: ['all'], description: 'WOW! Momo official ordering',
}, [
    { dishName: 'Steam Momos (8 pcs)', brandName: 'WOW! Momo', basePrice: 199, finalPrice: 199, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'momo steamed', deliveryTime: '25-35 mins', rating: '4.2' },
    { dishName: 'Pan Fried Momos', brandName: 'WOW! Momo', basePrice: 229, finalPrice: 229, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'momo fried', deliveryTime: '25-35 mins', rating: '4.2' },
    { dishName: 'WOW Burger (Momo Burger)', brandName: 'WOW! Momo', basePrice: 179, finalPrice: 149, discount: 30, couponCode: '', offerLabel: 'App Offer', category: 'burger momo', deliveryTime: '25-35 mins', rating: '4.2' },
], {
    searchUrlFn: (q, loc) => `https://www.wowmomo.com/order-now`,
    itemSelector: '.product, .item, [class*="product"], [class*="item"]',
    nameSelector: '.name, .title, h3, [class*="name"]',
    priceSelector: '.price, [class*="price"]',
    imageSelector: 'img',
    offerSelector: '[class*="offer"], [class*="badge"]',
    unavailableSignals: ['not available', 'coming soon'],
});
