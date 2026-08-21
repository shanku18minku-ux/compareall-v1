// @ts-nocheck
import { makeWebViewBrandPacket } from './brand_webview_helper';

function parseP(v: any) { return parseFloat((v||'0').toString().replace(/[^0-9.]/g,'')) || 0; }

// ─── McDonald's ───────────────────────────────────────────────────────────────
// mcdelivery.co.in — location-based, intercepts /api/menu or /GMC/ style calls
export const McDonaldsPacket = makeWebViewBrandPacket({
    id: 'mcdonalds', name: "McDonald's", category: 'Food', subcategory: 'Fast Food / QSR',
    icon: 'M', brandColor: '#da291c',
    url: 'https://www.mcdelivery.co.in',
    loginUrl: 'https://www.mcdelivery.co.in',
    regions: ['delhi', 'mumbai', 'bangalore', 'pune', 'chennai', 'hyderabad', 'kolkata', 'ahmedabad', 'surat', 'jaipur', 'lucknow', 'kanpur', 'nagpur', 'indore', 'bhopal', 'vadodara', 'ludhiana', 'agra', 'nashik', 'faridabad', 'meerut', 'rajkot', 'ranchi', 'guwahati', 'chandigarh', 'gurgaon', 'noida', 'jamshedpur'], description: "McDonald's India ordering",
}, [
    { dishName: 'McVeggie Burger', brandName: "McDonald's", basePrice: 135, finalPrice: 99, discount: 36, couponCode: '', offerLabel: '₹99 Value Meals', category: 'burger veg', deliveryTime: '30-40 mins', rating: '4.1' },
    { dishName: 'McSpicy Paneer', brandName: "McDonald's", basePrice: 169, finalPrice: 169, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'burger paneer', deliveryTime: '30-40 mins', rating: '4.1' },
    { dishName: 'McAloo Tikki', brandName: "McDonald's", basePrice: 45, finalPrice: 45, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'burger veg snack', deliveryTime: '30-40 mins', rating: '4.1' },
    { dishName: 'Chicken McGrill', brandName: "McDonald's", basePrice: 149, finalPrice: 149, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'burger chicken', deliveryTime: '30-40 mins', rating: '4.1' },
    { dishName: 'McSaver Meal', brandName: "McDonald's", basePrice: 249, finalPrice: 199, discount: 50, couponCode: '', offerLabel: 'McSaver Combo', category: 'meal combo', deliveryTime: '30-40 mins', rating: '4.1' },
], {
    searchUrlFn: (q: string) => `https://www.mcdelivery.co.in`,
    menuApiPatterns: ['/api/menu', '/api/products', '/GMC/', '/menu/items', '/catalog', '/products/list', 'getProducts', 'MenuService'],
    parseMenuApi: function(data: any, q: string) {
        var results: any[] = [];
        var qLow = (q||'').toLowerCase();
        function matchQ(s: string) { return !qLow || qLow==='food' || s.toLowerCase().indexOf(qLow)!==-1; }
        // Try various response shapes
        var items = data?.items || data?.data?.items || data?.products || data?.data?.products ||
                    data?.menu?.items || data?.menuItems || [];
        var categories = data?.categories || data?.data?.categories || [];
        if (categories.length > 0) {
            categories.forEach(function(cat: any) {
                (cat.items||cat.products||[]).forEach(function(item: any) {
                    var name = item.name||item.title||item.productName||'';
                    if (!name||!matchQ(name)) return;
                    var base = parseP(item.price||item.basePrice||0);
                    var final = parseP(item.offerPrice||item.discountedPrice||item.price||base);
                    if (base<=0&&final<=0) return;
                    results.push({
                        dishName:name, restaurantName:"McDonald's", dishImage:item.imageUrl||item.image||'',
                        price:{finalPayablePrice:final||base,basePrice:base||final,discount:base>final?base-final:0},
                        deliveryTime:'30-40 mins',rating:'4.1',couponCode:item.couponCode||'',
                        autoCouponSavings:base>final?base-final:0,
                        offerStatus:base>final?'LIVE_OFFER':'PUBLIC',offerLabel:base>final?('₹'+(base-final)+' OFF'):'Public Price'
                    });
                });
            });
        } else {
            items.forEach(function(item: any) {
                var name = item.name||item.title||'';
                if(!name||!matchQ(name)) return;
                var base=parseP(item.price||0), final=parseP(item.offerPrice||item.price||base);
                if(base<=0&&final<=0) return;
                results.push({
                    dishName:name,restaurantName:"McDonald's",dishImage:item.imageUrl||item.image||'',
                    price:{finalPayablePrice:final||base,basePrice:base||final,discount:base>final?base-final:0},
                    deliveryTime:'30-40 mins',rating:'4.1',couponCode:'',autoCouponSavings:base>final?base-final:0,
                    offerStatus:base>final?'LIVE_OFFER':'PUBLIC',offerLabel:base>final?('₹'+(base-final)+' OFF'):'Public Price'
                });
            });
        }
        return results;
    },
    itemSelector: '.product-item,.menu-item,.product-card,[class*="product"],[class*="menu-item"]',
    nameSelector: '.product-title,.item-name,h3,h4,[class*="title"],[class*="name"]',
    priceSelector: '.price,.product-price,[class*="price"]',
    imageSelector: 'img',
    offerSelector: '.badge,.offer,[class*="offer"],[class*="badge"]',
    unavailableSignals: ['not available', 'not serviceable', 'coming soon'],
});

// ─── KFC ──────────────────────────────────────────────────────────────────────
// API: GET /api/v1/menu?storeId=...&channel=DELIVERY
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
    searchUrlFn: (q: string) => 'https://online.kfc.co.in/menu',
    // KFC API: GET /api/v1/menu?storeId=...&channel=DELIVERY
    menuApiPatterns: ['/api/v1/menu', '/api/products/catalog', '/api/v1/categories', '/api/v1/deals', '/menu?storeId', '/catalog'],
    parseMenuApi: function(data: any, q: string) {
        var results: any[] = [];
        var qLow = (q||'').toLowerCase();
        function matchQ(s: string) { return !qLow || qLow==='food' || s.toLowerCase().indexOf(qLow)!==-1; }
        // KFC shape: { statusCode:200, data:{ categories:[{ id, name, products:[{ id, name, price, offerPrice, imageUrl }] }] } }
        var categories = data?.data?.categories || data?.categories || data?.result?.categories || [];
        categories.forEach(function(cat: any) {
            (cat.products||cat.items||[]).forEach(function(item: any) {
                var name = item.name||item.title||'';
                if(!name||!matchQ(name)) return;
                var base=parseP(item.price||0);
                var final=parseP(item.offerPrice||item.price||base);
                if(base<=0&&final<=0) return;
                var disc = base>final?base-final:0;
                results.push({
                    dishName:name,restaurantName:'KFC',dishImage:item.imageUrl||item.image||'',
                    price:{finalPayablePrice:final||base,basePrice:base||final,discount:disc},
                    deliveryTime:'35-45 mins',rating:'4.0',couponCode:'',autoCouponSavings:disc,
                    offerStatus:disc>0?'LIVE_OFFER':'PUBLIC',offerLabel:disc>0?('₹'+disc+' OFF'):'Public Price'
                });
            });
        });
        return results;
    },
    itemSelector: '.product-card,.menu-item,.item,[class*="product-card"],[class*="item-card"]',
    nameSelector: '.product-name,.name,h3,[class*="name"],[class*="title"]',
    priceSelector: '.product-price,.price,[class*="price"]',
    imageSelector: 'img',
    offerSelector: '.badge,.offer,.tag,[class*="offer"],.offer-pill',
    unavailableSignals: ['not available', 'no outlet', 'not serviceable'],
});

// ─── Burger King ──────────────────────────────────────────────────────────────
// API: GET /api/v1/menu/catalog?store_id=...&order_type=delivery
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
    searchUrlFn: (q: string) => 'https://www.burgerking.in/order-now',
    // BK: GET /api/v1/menu/catalog?store_id=...&order_type=delivery
    menuApiPatterns: ['/api/v1/menu/catalog', '/api/v1/promos', '/api/products/list', '/api/v1/menu', '/catalog?store', 'order_type=delivery'],
    parseMenuApi: function(data: any, q: string) {
        var results: any[] = [];
        var qLow = (q||'').toLowerCase();
        function matchQ(s: string) { return !qLow || qLow==='food' || s.toLowerCase().indexOf(qLow)!==-1; }
        // BK shape: { success:true, result:{ categories:[{ id, title, items:[{ item_id, name, base_price, selling_price, image }] }] } }
        var categories = data?.result?.categories || data?.categories || data?.data?.categories || [];
        categories.forEach(function(cat: any) {
            (cat.items||cat.products||[]).forEach(function(item: any) {
                var name = item.name||item.title||'';
                if(!name||!matchQ(name)) return;
                var base=parseP(item.base_price||item.basePrice||item.price||0);
                var final=parseP(item.selling_price||item.offerPrice||item.price||base);
                if(base<=0&&final<=0) return;
                var disc=base>final?base-final:0;
                results.push({
                    dishName:name,restaurantName:'Burger King',dishImage:item.image||item.imageUrl||'',
                    price:{finalPayablePrice:final||base,basePrice:base||final,discount:disc},
                    deliveryTime:'30-45 mins',rating:'4.0',couponCode:'',autoCouponSavings:disc,
                    offerStatus:disc>0?'LIVE_OFFER':'PUBLIC',offerLabel:disc>0?('₹'+disc+' OFF'):'Public Price'
                });
            });
        });
        return results;
    },
    itemSelector: '.product,.menu-item,.item-card,[class*="item"],[class*="product"]',
    nameSelector: '.name,.title,h3,h4,[class*="name"]',
    priceSelector: '.price,.amount,[class*="price"]',
    imageSelector: 'img',
    offerSelector: '.tag,.label,.badge,[class*="tag"],[class*="badge"]',
    unavailableSignals: ['not available', 'coming soon', 'not serviceable'],
});

// ─── Subway ───────────────────────────────────────────────────────────────────
export const SubwayPacket = makeWebViewBrandPacket({
    id: 'subway', name: 'Subway', category: 'Food', subcategory: 'Fast Food / QSR',
    icon: 'SB', brandColor: '#008c15',
    url: 'https://www.subway.in',
    loginUrl: 'https://www.subway.in',
    regions: ['all'], description: 'Subway India official ordering',
}, [
    { dishName: 'Veggie Delite Sub (6")', brandName: 'Subway', basePrice: 229, finalPrice: 229, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'sub sandwich', deliveryTime: '25-35 mins', rating: '4.1' },
    { dishName: 'Paneer Tikka Sub (6")', brandName: 'Subway', basePrice: 299, finalPrice: 299, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'sub paneer', deliveryTime: '25-35 mins', rating: '4.1' },
], {
    searchUrlFn: (q: string) => 'https://www.subway.in',
    menuApiPatterns: ['/menu', '/api/products', '/catalog', '/menu-items', '/items'],
    parseMenuApi: function(data: any, q: string) {
        var results: any[] = [];
        var items = data?.items || data?.data?.items || data?.products || [];
        var qLow=(q||'').toLowerCase();
        items.forEach(function(item: any) {
            var name=item.name||item.title||'';
            if(!name||qLow&&qLow!=='food'&&name.toLowerCase().indexOf(qLow)===-1) return;
            var base=parseP(item.price||0), final=parseP(item.offerPrice||item.price||base);
            results.push({
                dishName:name,restaurantName:'Subway',dishImage:item.imageUrl||'',
                price:{finalPayablePrice:final||base,basePrice:base||final,discount:base>final?base-final:0},
                deliveryTime:'25-35 mins',rating:'4.1',couponCode:'',autoCouponSavings:0,
                offerStatus:'PUBLIC',offerLabel:'Public Price'
            });
        });
        return results;
    },
    itemSelector: '.menu-item,.product-card,[data-testid*="product"],[class*="menu-item"]',
    nameSelector: '.name,.title,h3,[class*="name"]',
    priceSelector: '.price,[class*="price"]',
    imageSelector: 'img',
    offerSelector: '[class*="offer"],[class*="badge"],[class*="discount"]',
    unavailableSignals: ['not available', 'select a restaurant', 'delivery not available'],
});

// ─── Taco Bell ────────────────────────────────────────────────────────────────
export const TacoBellPacket = makeWebViewBrandPacket({
    id: 'tacobell', name: 'Taco Bell', category: 'Food', subcategory: 'Fast Food / QSR',
    icon: 'TB', brandColor: '#702082',
    url: 'https://www.tacobell.co.in',
    loginUrl: 'https://www.tacobell.co.in',
    regions: ['delhi', 'mumbai', 'bangalore', 'pune', 'chennai', 'hyderabad', 'kolkata', 'ahmedabad', 'chandigarh', 'gurgaon', 'noida', 'kochi', 'coimbatore', 'ludhiana'], description: 'Taco Bell India ordering',
}, [
    { dishName: 'Crunchy Taco', brandName: 'Taco Bell', basePrice: 179, finalPrice: 179, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'taco', deliveryTime: '30-45 mins', rating: '4.0' },
    { dishName: 'Mexican Pizza', brandName: 'Taco Bell', basePrice: 249, finalPrice: 249, discount: 0, couponCode: '', offerLabel: 'Public Price', category: 'pizza taco', deliveryTime: '30-45 mins', rating: '4.0' },
], {
    searchUrlFn: (q: string) => 'https://www.tacobell.co.in',
    menuApiPatterns: ['/api/menu', '/api/products', '/items', '/catalog'],
    parseMenuApi: function(data: any, q: string) { return []; },
    itemSelector: '.item,.product,[class*="item"],[class*="product"]',
    nameSelector: '.name,h3,h4,[class*="name"]',
    priceSelector: '.price,[class*="price"]',
    imageSelector: 'img',
    offerSelector: '[class*="offer"],[class*="badge"]',
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
    searchUrlFn: (q: string) => 'https://www.wowmomo.com/order-now',
    menuApiPatterns: ['/api/menu', '/api/products', '/items', '/catalog'],
    parseMenuApi: function(data: any, q: string) { return []; },
    itemSelector: '.product,.item,[class*="product"],[class*="item"]',
    nameSelector: '.name,.title,h3,[class*="name"]',
    priceSelector: '.price,[class*="price"]',
    imageSelector: 'img',
    offerSelector: '[class*="offer"],[class*="badge"]',
    unavailableSignals: ['not available', 'coming soon'],
});
