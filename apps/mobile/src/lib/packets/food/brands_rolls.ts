// @ts-nocheck
import { makeWebViewBrandPacket } from './brand_webview_helper';

export const FaasosPacket = makeWebViewBrandPacket({
    id: 'faasos', name: 'Faasos', category: 'Food', subcategory: 'Rolls / Meals',
    icon: 'Fa', brandColor: '#e74c3c',
    url: 'https://www.faasos.com', loginUrl: 'https://www.faasos.com/order',
    regions: ['all'], description: 'Faasos official ordering',
}, [
    { dishName: 'Chicken Tikka Roll', brandName: 'Faasos', basePrice: 219, finalPrice: 219, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'rolls chicken', deliveryTime: '25-40 mins', rating: '4.1' },
    { dishName: 'Paneer Kathi Roll', brandName: 'Faasos', basePrice: 189, finalPrice: 159, discount: 30, couponCode: 'ROLL30', offerLabel: '₹30 OFF on Rolls', category: 'rolls paneer kathi', deliveryTime: '25-40 mins', rating: '4.1' },
    { dishName: 'Egg Roll', brandName: 'Faasos', basePrice: 149, finalPrice: 149, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'rolls egg', deliveryTime: '25-40 mins', rating: '4.1' },
], {
    searchUrlFn: (q, loc) => `https://www.faasos.com/menu`,
    itemSelector: '.product-card, .item, [class*="product"], [class*="item"]',
    nameSelector: '.name, h3, [class*="name"]',
    priceSelector: '.price, [class*="price"]',
    imageSelector: 'img',
    offerSelector: '[class*="offer"], [class*="badge"]',
    unavailableSignals: ['not available', 'not serviceable'],
});

export const RollsKingPacket = makeWebViewBrandPacket({
    id: 'rollsking', name: 'RollsKing', category: 'Food', subcategory: 'Rolls / Meals',
    icon: 'RK', brandColor: '#27ae60',
    url: 'https://www.rollsking.com', loginUrl: 'https://www.rollsking.com/order',
    regions: ['all'], description: 'RollsKing official ordering',
}, [
    { dishName: 'Egg Roll', brandName: 'RollsKing', basePrice: 80, finalPrice: 80, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'rolls egg', deliveryTime: '20-30 mins', rating: '4.0' },
    { dishName: 'Paneer Roll', brandName: 'RollsKing', basePrice: 95, finalPrice: 95, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'rolls paneer', deliveryTime: '20-30 mins', rating: '4.0' },
], {
    searchUrlFn: (q, loc) => `https://www.rollsking.com/menu`,
    itemSelector: '.product, .item, [class*="product"]',
    nameSelector: '.name, h3, [class*="name"]',
    priceSelector: '.price, [class*="price"]',
    imageSelector: 'img',
    offerSelector: '[class*="offer"]',
    unavailableSignals: ['not available'],
});

export const LunchBoxPacket = makeWebViewBrandPacket({
    id: 'lunchbox', name: 'LunchBox', category: 'Food', subcategory: 'Rolls / Meals',
    icon: 'LB', brandColor: '#2980b9',
    url: 'https://www.lunchbox.in', loginUrl: 'https://www.lunchbox.in/order',
    regions: ['all'], description: 'LunchBox official ordering',
}, [
    { dishName: 'Dal Makhani + Rice Combo', brandName: 'LunchBox', basePrice: 149, finalPrice: 129, discount: 20, couponCode: '', offerLabel: 'Combo Price', category: 'meal combo dal rice', deliveryTime: '25-35 mins', rating: '4.2' },
    { dishName: 'Rajma Chawal', brandName: 'LunchBox', basePrice: 139, finalPrice: 139, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'meal rajma rice', deliveryTime: '25-35 mins', rating: '4.2' },
    { dishName: 'Chole Chawal', brandName: 'LunchBox', basePrice: 135, finalPrice: 119, discount: 16, couponCode: '', offerLabel: 'Lunch Deal', category: 'meal chole rice', deliveryTime: '25-35 mins', rating: '4.2' },
], {
    searchUrlFn: (q, loc) => `https://www.lunchbox.in/menu`,
    itemSelector: '.product, .item, [class*="product"], [class*="item"]',
    nameSelector: '.name, h3, [class*="name"]',
    priceSelector: '.price, [class*="price"]',
    imageSelector: 'img',
    offerSelector: '[class*="offer"], [class*="badge"]',
    unavailableSignals: ['not available', 'not serviceable'],
});

export const TheGoodBowlPacket = makeWebViewBrandPacket({
    id: 'thegoodbowl', name: 'The Good Bowl', category: 'Food', subcategory: 'Rolls / Meals',
    icon: 'GB', brandColor: '#16a085',
    url: 'https://www.thegoodbowl.com', loginUrl: 'https://www.thegoodbowl.com/order',
    regions: ['all'], description: 'The Good Bowl official ordering',
}, [
    { dishName: 'Butter Chicken Bowl', brandName: 'The Good Bowl', basePrice: 249, finalPrice: 249, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'bowl meal chicken', deliveryTime: '25-40 mins', rating: '4.2' },
    { dishName: 'Paneer Tikka Bowl', brandName: 'The Good Bowl', basePrice: 229, finalPrice: 199, discount: 30, couponCode: 'BOWL30', offerLabel: '₹30 OFF Bowl Orders', category: 'bowl paneer tikka', deliveryTime: '25-40 mins', rating: '4.2' },
], {
    searchUrlFn: (q, loc) => `https://www.thegoodbowl.com/menu`,
    itemSelector: '.product, .item, [class*="product"]',
    nameSelector: '.name, h3, [class*="name"]',
    priceSelector: '.price, [class*="price"]',
    imageSelector: 'img',
    offerSelector: '[class*="offer"]',
    unavailableSignals: ['not available', 'not serviceable'],
});

export const FreshMenuPacket = makeWebViewBrandPacket({
    id: 'freshmenu', name: 'FreshMenu', category: 'Food', subcategory: 'Rolls / Meals',
    icon: 'FM', brandColor: '#8e44ad',
    url: 'https://www.freshmenu.com', loginUrl: 'https://www.freshmenu.com/order',
    regions: ['all'], description: 'FreshMenu official ordering',
}, [
    { dishName: 'Chef Special Meal Box', brandName: 'FreshMenu', basePrice: 199, finalPrice: 169, discount: 30, couponCode: '', offerLabel: 'App Exclusive', category: 'meal box', deliveryTime: '30-45 mins', rating: '4.1' },
    { dishName: 'Pasta Arrabiata', brandName: 'FreshMenu', basePrice: 229, finalPrice: 229, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'pasta meal', deliveryTime: '30-45 mins', rating: '4.1' },
], {
    searchUrlFn: (q, loc) => `https://www.freshmenu.com/menu`,
    itemSelector: '.product, .item, [class*="product"]',
    nameSelector: '.name, h3, [class*="name"]',
    priceSelector: '.price, [class*="price"]',
    imageSelector: 'img',
    offerSelector: '[class*="offer"]',
    unavailableSignals: ['not available', 'not serviceable'],
});
