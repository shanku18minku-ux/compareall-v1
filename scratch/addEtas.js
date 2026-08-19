const fs = require("fs");

// Swiggy DOM
let swiggy = fs.readFileSync("apps/mobile/src/lib/packets/food/swiggy.ts", "utf8");
swiggy = swiggy.replace(
    /imageUrl: typeof extractedImageUrl !== 'undefined' \? extractedImageUrl : '',/g,
    `imageUrl: typeof extractedImageUrl !== 'undefined' ? extractedImageUrl : '',
                                              deliveryTime: (() => {
                                                  var slaEl = card.querySelector('[class*="styles_slaText"], [class*="sla"]');
                                                  return slaEl ? slaEl.textContent.trim() : '35 mins';
                                              })(),`
);
fs.writeFileSync("apps/mobile/src/lib/packets/food/swiggy.ts", swiggy, "utf8");

// Zomato DAPI and DOM
let zomato = fs.readFileSync("apps/mobile/src/lib/packets/food/zomato.ts", "utf8");
zomato = zomato.replace(
    /imageUrl: \(info\.image && info\.image\.url\) \? info\.image\.url\.split\('\?'\)\[0\] : '',/g,
    `imageUrl: (info.image && info.image.url) ? info.image.url.split('?')[0] : '',
                              deliveryTime: (info.o2t && info.o2t.time && info.o2t.type) ? (info.o2t.time + ' ' + info.o2t.type) : (info.order && info.order.deliveryTime ? info.order.deliveryTime : '40 min'),`
);
zomato = zomato.replace(
    /imageUrl: typeof extractedImageUrl !== 'undefined' \? extractedImageUrl : '',/g,
    `imageUrl: typeof extractedImageUrl !== 'undefined' ? extractedImageUrl : '',
                                    deliveryTime: (() => {
                                        var timeEl = card.querySelector('div[color="#1C1C1C"], p[color="#1C1C1C"], p[class*="delivery-time"]');
                                        if (timeEl && timeEl.textContent.toLowerCase().includes('min')) return timeEl.textContent.trim();
                                        return '40 min';
                                    })(),`
);
fs.writeFileSync("apps/mobile/src/lib/packets/food/zomato.ts", zomato, "utf8");
console.log("ETA injected");
