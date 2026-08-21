// @ts-nocheck
import { makeWebViewBrandPacket } from './brand_webview_helper';

export const BehrouzPacket = makeWebViewBrandPacket({
    id: 'behrouz', name: 'Behrouz Biryani', category: 'Food', subcategory: 'Biryani',
    icon: 'BB', brandColor: '#8b0000',
    url: 'https://www.behrouzbiryani.com', loginUrl: 'https://www.behrouzbiryani.com',
    regions: ['all'], description: 'Behrouz Biryani official ordering',
}, [
    { dishName: 'Behrouz Special Veg Biryani', brandName: 'Behrouz Biryani', basePrice: 349, finalPrice: 299, discount: 50, couponCode: 'BEHROUZ50', offerLabel: '₹50 OFF First Order', category: 'biryani veg', deliveryTime: '40-55 mins', rating: '4.3' },
    { dishName: 'Dum Biryani (Single)', brandName: 'Behrouz Biryani', basePrice: 299, finalPrice: 299, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'biryani dum', deliveryTime: '40-55 mins', rating: '4.3' },
    { dishName: 'Royal Chicken Biryani', brandName: 'Behrouz Biryani', basePrice: 399, finalPrice: 349, discount: 50, couponCode: 'BEHROUZ50', offerLabel: '₹50 OFF', category: 'biryani chicken royal', deliveryTime: '40-55 mins', rating: '4.3' },
], {
    searchUrlFn: (q, loc) => `https://www.behrouzbiryani.com`,
    itemSelector: '.product-card, .item, .product, [class*="product"], [class*="item"]',
    nameSelector: '.name, .title, h3, [class*="name"]',
    priceSelector: '.price, [class*="price"]',
    imageSelector: 'img',
    offerSelector: '[class*="offer"], [class*="badge"]',
    unavailableSignals: ['not available', 'not serviceable', 'not delivering'],
});

export const BarbequeNationPacket = makeWebViewBrandPacket({
    id: 'barbeque', name: 'Barbeque Nation', category: 'Food', subcategory: 'Dining',
    icon: 'BN', brandColor: '#b71c1c',
    url: 'https://www.barbequenation.com', loginUrl: 'https://www.barbequenation.com',
    regions: ['all'], description: 'Barbeque Nation table booking & ordering',
}, [
    { dishName: 'Unlimited BBQ Lunch (Weekday)', brandName: 'Barbeque Nation', basePrice: 799, finalPrice: 699, discount: 100, couponCode: 'BBQWEEKDAY', offerLabel: '₹100 OFF Weekday Lunch', category: 'bbq dining lunch unlimited', deliveryTime: 'Dine-in', rating: '4.4' },
    { dishName: 'Unlimited BBQ Dinner', brandName: 'Barbeque Nation', basePrice: 999, finalPrice: 999, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'bbq dining dinner unlimited', deliveryTime: 'Dine-in', rating: '4.4' },
], {
    searchUrlFn: (q, loc) => `https://www.barbequenation.com`,
    itemSelector: '.menu-item, .product, .item, [class*="menu-item"]',
    nameSelector: '.name, h3, [class*="name"]',
    priceSelector: '.price, [class*="price"]',
    imageSelector: 'img',
    offerSelector: '[class*="offer"], [class*="badge"]',
    unavailableSignals: ['not available', 'not serviceable'],
});

export const AbsoluteBarbecuesPacket = makeWebViewBrandPacket({
    id: 'absolutebbq', name: 'Absolute Barbecues', category: 'Food', subcategory: 'Dining',
    icon: 'AB', brandColor: '#212121',
    url: 'https://www.absolutebbq.com', loginUrl: 'https://www.absolutebbq.com/book-a-table',
    regions: ['all'], description: 'Absolute Barbecues official table booking',
}, [
    { dishName: 'Unlimited BBQ Lunch', brandName: 'Absolute Barbecues', basePrice: 849, finalPrice: 749, discount: 100, couponCode: 'ABSBBQ', offerLabel: '₹100 OFF on booking', category: 'bbq dining lunch unlimited', deliveryTime: 'Dine-in', rating: '4.4' },
    { dishName: 'Unlimited BBQ Dinner', brandName: 'Absolute Barbecues', basePrice: 999, finalPrice: 999, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'bbq dining dinner', deliveryTime: 'Dine-in', rating: '4.4' },
], {
    searchUrlFn: (q, loc) => `https://www.absolutebbq.com/menu`,
    itemSelector: '.item, .product, [class*="item"]',
    nameSelector: '.name, h3, [class*="name"]',
    priceSelector: '.price, [class*="price"]',
    imageSelector: 'img',
    offerSelector: '[class*="offer"]',
    unavailableSignals: ['not available'],
});
