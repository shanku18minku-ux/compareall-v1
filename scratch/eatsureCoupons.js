const fs = require("fs");
let eatsure = fs.readFileSync("apps/mobile/src/lib/packets/food/eatsure.ts", "utf8");

eatsure = eatsure.replace(
    /var priceText = priceEl\.innerText\.trim\(\);\s*var priceMatch = priceText\.match\(\/\\d\+\/\);\s*if \(\!priceMatch\) return;\s*var price = parseInt\(priceMatch\[0\], 10\);/g,
    `var priceText = priceEl.innerText.trim();
                      var prices = priceText.match(/\\d+/g);
                      if (!prices) return;
                      // Often DOM shows "200 150", so we take the lowest visible price as the discounted price
                      var price = Math.min(...prices.map(p => parseInt(p, 10)));
                      
                      var autoCouponSavings = 0;
                      var couponCode = '';
                      var basePrice = Math.max(...prices.map(p => parseInt(p, 10)));
                      if (basePrice > price) {
                          autoCouponSavings = basePrice - price;
                          couponCode = 'EATSURE_OFFER';
                      }
                      
                      // Also look for explicit coupon tags in the card
                      var offerEl = card.querySelector('div[class*="offer"], span[class*="offer"], div[class*="discount"]');
                      if (offerEl && autoCouponSavings === 0) {
                          var oTxt = offerEl.innerText.trim().toUpperCase();
                          var pMatch = oTxt.match(/(\\d+)\\s*%/);
                          var fMatch = oTxt.match(/(\\d+)\\s*(?:OFF|?|RS)/i) || oTxt.match(/(?:?|RS\.?)\\s*(\\d+)/i);
                          if (pMatch) {
                              var p = parseInt(pMatch[1], 10);
                              autoCouponSavings = Math.round((price * p) / 100);
                              couponCode = 'EATSURE' + p;
                              basePrice = price;
                              price = Math.max(10, price - autoCouponSavings);
                          } else if (fMatch) {
                              var f = parseInt(fMatch[1], 10);
                              autoCouponSavings = f;
                              couponCode = 'EATSURE_FLAT';
                              basePrice = price;
                              price = Math.max(10, price - autoCouponSavings);
                          }
                      }`
);

eatsure = eatsure.replace(
    /price: \{\s*finalPayablePrice: price\s*\},\s*menuPrice: price,/g,
    `price: {
                              finalPayablePrice: price,
                              basePrice: basePrice,
                              discount: autoCouponSavings
                          },
                          menuPrice: price,
                          autoCouponSavings: autoCouponSavings,
                          couponCode: couponCode,`
);

fs.writeFileSync("apps/mobile/src/lib/packets/food/eatsure.ts", eatsure, "utf8");
console.log("EatSure Auto Coupon logic injected!");
