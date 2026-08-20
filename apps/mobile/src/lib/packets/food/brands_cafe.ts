// @ts-nocheck
import { makeWebViewBrandPacket } from './brand_webview_helper';

// ─── Chaayos ──────────────────────────────────────────────────────────────────
export const ChaayosPacket = makeWebViewBrandPacket({
    id: 'chaayos', name: 'Chaayos', category: 'Food', subcategory: 'Cafe',
    icon: 'Ch', brandColor: '#6d4c41',
    url: 'https://www.chaayos.com',
    loginUrl: 'https://www.chaayos.com/order',
    regions: ['all'], description: 'Chaayos official ordering',
}, [
    { dishName: 'Masala Chai (Regular)', brandName: 'Chaayos', basePrice: 80, finalPrice: 80, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'chai tea masala', deliveryTime: '20-30 mins', rating: '4.4' },
    { dishName: 'Doodh Patti Chai', brandName: 'Chaayos', basePrice: 90, finalPrice: 90, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'chai tea milk', deliveryTime: '20-30 mins', rating: '4.4' },
    { dishName: 'Meri Wali Chai (customized)', brandName: 'Chaayos', basePrice: 100, finalPrice: 85, discount: 15, couponCode: 'CHAAYOS15', offerLabel: '15% OFF App Order', category: 'chai tea custom', deliveryTime: '20-30 mins', rating: '4.4' },
    { dishName: 'Adrak Chai', brandName: 'Chaayos', basePrice: 85, finalPrice: 85, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'chai tea ginger', deliveryTime: '20-30 mins', rating: '4.4' },
], {
    searchUrlFn: (q, loc) => `https://www.chaayos.com/menu`,
    itemSelector: '.product, .menu-item, .item, [class*="product"], [class*="menu-item"]',
    nameSelector: '.name, .title, h3, h4, [class*="name"]',
    priceSelector: '.price, [class*="price"]',
    imageSelector: 'img',
    offerSelector: '[class*="offer"], [class*="badge"]',
    unavailableSignals: ['not available', 'not serviceable', 'coming soon'],
});

// ─── Chai Point ────────────────────────────────────────────────────────────────
export const ChaiPointPacket = makeWebViewBrandPacket({
    id: 'chaipoint', name: 'Chai Point', category: 'Food', subcategory: 'Cafe',
    icon: 'CP', brandColor: '#f4a101',
    url: 'https://www.chaipoint.com',
    loginUrl: 'https://order.chaipoint.com',
    regions: ['all'], description: 'Chai Point official ordering',
}, [
    { dishName: 'Classic Masala Chai', brandName: 'Chai Point', basePrice: 70, finalPrice: 70, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'chai tea masala', deliveryTime: '20-30 mins', rating: '4.2' },
    { dishName: 'Adrak Chai', brandName: 'Chai Point', basePrice: 75, finalPrice: 75, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'chai tea ginger', deliveryTime: '20-30 mins', rating: '4.2' },
    { dishName: 'Cold Coffee', brandName: 'Chai Point', basePrice: 120, finalPrice: 99, discount: 21, couponCode: '', offerLabel: 'App Price', category: 'coffee cold', deliveryTime: '20-30 mins', rating: '4.2' },
], {
    searchUrlFn: (q, loc) => `https://order.chaipoint.com/menu`,
    itemSelector: '.product, .item, [class*="product"], [class*="item"]',
    nameSelector: '.name, h3, [class*="name"]',
    priceSelector: '.price, [class*="price"]',
    imageSelector: 'img',
    offerSelector: '[class*="offer"], [class*="badge"]',
    unavailableSignals: ['not available', 'coming soon'],
});

// ─── Barista ──────────────────────────────────────────────────────────────────
export const BaristaPacket = makeWebViewBrandPacket({
    id: 'barista', name: 'Barista', category: 'Food', subcategory: 'Cafe',
    icon: 'Ba', brandColor: '#5c3317',
    url: 'https://www.barista.co.in',
    loginUrl: 'https://www.barista.co.in/order',
    regions: ['all'], description: 'Barista Coffee official ordering',
}, [
    { dishName: 'Café Americano', brandName: 'Barista', basePrice: 175, finalPrice: 175, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'coffee cafe americano', deliveryTime: '25-40 mins', rating: '4.1' },
    { dishName: 'Classic Cappuccino', brandName: 'Barista', basePrice: 215, finalPrice: 215, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'coffee cappuccino', deliveryTime: '25-40 mins', rating: '4.1' },
    { dishName: 'Cold Coffee (Blended)', brandName: 'Barista', basePrice: 249, finalPrice: 199, discount: 50, couponCode: '', offerLabel: 'Happy Hours Offer', category: 'coffee cold blended', deliveryTime: '25-40 mins', rating: '4.1' },
], {
    searchUrlFn: (q, loc) => `https://www.barista.co.in/menu`,
    itemSelector: '.product, .menu-item, .item, [class*="product"], [class*="item"]',
    nameSelector: '.name, h3, [class*="name"]',
    priceSelector: '.price, [class*="price"]',
    imageSelector: 'img',
    offerSelector: '[class*="offer"], [class*="badge"]',
    unavailableSignals: ['not available', 'not serviceable'],
});
