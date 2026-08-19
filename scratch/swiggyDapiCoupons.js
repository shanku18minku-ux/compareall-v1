const fs = require("fs");
let swiggy = fs.readFileSync("apps/mobile/src/lib/packets/food/swiggy.ts", "utf8");

swiggy = swiggy.replace(
    /autoCouponSavings: 0,\s*effectivePrice: accurateDishPrice,\s*price: \{\s*finalPayablePrice: accurateDishPrice,/g,
    `autoCouponSavings: (() => {
                                                  if (!rInfo.aggregatedDiscountInfoV3) return 0;
                                                  let hdr = rInfo.aggregatedDiscountInfoV3.header || '';
                                                  let pctM = hdr.match(/(\\d+)\\s*%/);
                                                  let flatM = hdr.match(/(?:?|RS\.?)\\s*(\\d+)/i) || hdr.match(/(\\d+)\\s*(?:?|RS\.?)/i);
                                                  let capM = hdr.match(/UPTO\\s*(?:?|RS\.?)\\s*(\\d+)/i);
                                                  
                                                  if (flatM) return parseInt(flatM[1], 10);
                                                  if (pctM) {
                                                      let raw = Math.round((accurateDishPrice * parseInt(pctM[1], 10)) / 100);
                                                      return capM ? Math.min(raw, parseInt(capM[1], 10)) : raw;
                                                  }
                                                  return 0;
                                              })(),
                                              effectivePrice: accurateDishPrice, // We'll recalculate this dynamically in cart
                                              price: {
                                                  finalPayablePrice: accurateDishPrice,`
);

fs.writeFileSync("apps/mobile/src/lib/packets/food/swiggy.ts", swiggy, "utf8");
console.log("Swiggy DAPI Restaurant Coupons added");
