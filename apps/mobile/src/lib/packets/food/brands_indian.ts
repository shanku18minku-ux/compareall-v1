// @ts-nocheck
import { makeWebViewBrandPacket } from './brand_webview_helper';

export const HaldiramsPacket = makeWebViewBrandPacket({
    id: 'haldirams', name: "Haldiram's", category: 'Food', subcategory: 'Indian Food / Snacks',
    icon: 'Ha', brandColor: '#e8a000',
    url: 'https://www.haldirams.com', loginUrl: 'https://www.haldirams.com/collections/all',
    regions: ['all'], description: "Haldiram's official ordering",
}, [
    { dishName: 'Aloo Bhujia (200g)', brandName: "Haldiram's", basePrice: 80, finalPrice: 80, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'snacks bhujia', deliveryTime: '2-3 days', rating: '4.5' },
    { dishName: 'Chole Bhature (Meal)', brandName: "Haldiram's", basePrice: 220, finalPrice: 220, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'indian meal chole', deliveryTime: '30-40 mins', rating: '4.5' },
    { dishName: 'Raj Kachori', brandName: "Haldiram's", basePrice: 110, finalPrice: 110, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'chaat snack', deliveryTime: '30-40 mins', rating: '4.4' },
], {
    searchUrlFn: (q, loc) => `https://www.haldirams.com/collections/all`,
    itemSelector: '.product-item, .product-card, [class*="product"]',
    nameSelector: '.product-title, .title, h3, [class*="title"]',
    priceSelector: '.price, [class*="price"]',
    imageSelector: 'img',
    offerSelector: '[class*="badge"], [class*="offer"]',
    unavailableSignals: ['not available', 'out of stock'],
});

export const BikanervalaPacket = makeWebViewBrandPacket({
    id: 'bikanervala', name: 'Bikanervala', category: 'Food', subcategory: 'Indian Food / Snacks',
    icon: 'Bi', brandColor: '#c0392b',
    url: 'https://www.bikanervala.com', loginUrl: 'https://www.bikanervala.com/menu',
    regions: ['all'], description: 'Bikanervala official ordering',
}, [
    { dishName: 'Raj Kachori', brandName: 'Bikanervala', basePrice: 99, finalPrice: 99, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'chaat snack kachori', deliveryTime: '30-40 mins', rating: '4.3' },
    { dishName: 'Ghevar (200g)', brandName: 'Bikanervala', basePrice: 350, finalPrice: 350, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'sweet ghevar', deliveryTime: '30-40 mins', rating: '4.3' },
    { dishName: 'Pav Bhaji', brandName: 'Bikanervala', basePrice: 149, finalPrice: 149, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'indian meal pav bhaji', deliveryTime: '30-40 mins', rating: '4.3' },
], {
    searchUrlFn: (q, loc) => `https://www.bikanervala.com/menu`,
    itemSelector: '.menu-item, .product, [class*="item"], [class*="product"]',
    nameSelector: '.name, h3, [class*="name"]',
    priceSelector: '.price, [class*="price"]',
    imageSelector: 'img',
    offerSelector: '[class*="offer"], [class*="badge"]',
    unavailableSignals: ['not available', 'not serviceable'],
});

export const NirulasPacket = makeWebViewBrandPacket({
    id: 'nirulas', name: "Nirula's", category: 'Food', subcategory: 'Indian Food / Snacks',
    icon: 'Ni', brandColor: '#1565c0',
    url: 'https://www.nirulas.com', loginUrl: 'https://www.nirulas.com/order',
    regions: ['all'], description: "Nirula's official ordering",
}, [
    { dishName: 'Veg Pizza Burger', brandName: "Nirula's", basePrice: 120, finalPrice: 120, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'burger pizza veg', deliveryTime: '25-35 mins', rating: '4.1' },
    { dishName: 'Soft Serve Ice Cream', brandName: "Nirula's", basePrice: 65, finalPrice: 65, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'dessert ice cream', deliveryTime: '25-35 mins', rating: '4.1' },
], {
    searchUrlFn: (q, loc) => `https://www.nirulas.com/menu`,
    itemSelector: '.item, .product, [class*="item"]',
    nameSelector: '.name, h3, [class*="name"]',
    priceSelector: '.price, [class*="price"]',
    imageSelector: 'img',
    offerSelector: '[class*="offer"]',
    unavailableSignals: ['not available'],
});

export const GoliVadaPavPacket = makeWebViewBrandPacket({
    id: 'golivadapav', name: 'Goli Vada Pav', category: 'Food', subcategory: 'Indian Food / Snacks',
    icon: 'GV', brandColor: '#e65100',
    url: 'https://www.golivadapav.com', loginUrl: 'https://www.golivadapav.com/order',
    regions: ['all'], description: 'Goli Vada Pav official ordering',
}, [
    { dishName: 'Vada Pav (1 pc)', brandName: 'Goli Vada Pav', basePrice: 25, finalPrice: 25, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'vada pav snack', deliveryTime: '20-30 mins', rating: '4.0' },
    { dishName: 'Goli Combo (4 Vada Pav + Chai)', brandName: 'Goli Vada Pav', basePrice: 149, finalPrice: 129, discount: 20, couponCode: '', offerLabel: 'Combo Saving', category: 'vada pav combo chai', deliveryTime: '20-30 mins', rating: '4.0' },
], {
    searchUrlFn: (q, loc) => `https://www.golivadapav.com/menu`,
    itemSelector: '.product, .item, [class*="product"]',
    nameSelector: '.name, h3, [class*="name"]',
    priceSelector: '.price, [class*="price"]',
    imageSelector: 'img',
    offerSelector: '[class*="offer"]',
    unavailableSignals: ['not available'],
});

export const JumboKingPacket = makeWebViewBrandPacket({
    id: 'jumboking', name: 'Jumbo King', category: 'Food', subcategory: 'Indian Food / Snacks',
    icon: 'JK', brandColor: '#ff6f00',
    url: 'https://www.jumboking.co.in', loginUrl: 'https://www.jumboking.co.in',
    regions: ['all'], description: 'Jumbo King official ordering',
}, [
    { dishName: 'Classic Jumbo Vada Pav', brandName: 'Jumbo King', basePrice: 35, finalPrice: 35, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'vada pav snack', deliveryTime: '20-30 mins', rating: '4.0' },
    { dishName: 'Double Decker Vada Pav', brandName: 'Jumbo King', basePrice: 55, finalPrice: 55, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'vada pav double', deliveryTime: '20-30 mins', rating: '4.0' },
], {
    searchUrlFn: (q, loc) => `https://www.jumboking.co.in`,
    itemSelector: '.product, .item, [class*="product"]',
    nameSelector: '.name, h3, [class*="name"]',
    priceSelector: '.price, [class*="price"]',
    imageSelector: 'img',
    offerSelector: '[class*="offer"]',
    unavailableSignals: ['not available'],
});
