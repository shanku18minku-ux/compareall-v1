const fs = require("fs");
let zomato = fs.readFileSync("apps/mobile/src/lib/packets/food/zomato.ts", "utf8");

zomato = zomato.replace(
    /var offerText = '';\s*var couponCode = '';\s*var autoCouponSavings = 0;\s*var effectiveFinalPrice = finalPrice;/g,
    `var offerText = '';
                              var couponCode = '';
                              var autoCouponSavings = 0;
                              
                              var offerElem = card.querySelector('div[class*="offer"], div[color="#256fef"], p[color="#256fef"]');
                              if (offerElem) {
                                  var txt = offerElem.textContent.toUpperCase();
                                  var flatMatch = txt.match(/(?:?|RS\.?|INR)\\s*(\\d+)\\s*(?:OFF)?/i) || txt.match(/(\\d+)\\s*(?:?|RS\.?|INR)\\s*OFF/i);
                                  var percMatch = txt.match(/(\\d+)\\s*%/);
                                  var uptoMatch = txt.match(/UP\\s*TO\\s*(?:?|RS\.?)?(\\d+)/i);
                                  
                                  var pFlat = flatMatch ? parseInt(flatMatch[1], 10) : 0;
                                  var pPerc = percMatch ? parseInt(percMatch[1], 10) : 0;
                                  var pUpto = uptoMatch ? parseInt(uptoMatch[1], 10) : 100;
                                  
                                  if (pFlat > 0) {
                                      autoCouponSavings = pFlat;
                                      couponCode = 'ZOMATO' + pFlat;
                                  } else if (pPerc > 0) {
                                      var rawDisc = Math.round((finalPrice * pPerc) / 100);
                                      autoCouponSavings = Math.min(rawDisc, pUpto);
                                      couponCode = 'ZOMATO' + pPerc;
                                  }
                                  if (autoCouponSavings > 0) {
                                      offerText = txt;
                                  }
                              }
                              var effectiveFinalPrice = Math.max(20, finalPrice - autoCouponSavings);`
);

fs.writeFileSync("apps/mobile/src/lib/packets/food/zomato.ts", zomato, "utf8");
console.log("Zomato DOM fallback coupons added");
