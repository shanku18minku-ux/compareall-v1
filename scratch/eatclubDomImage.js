const fs = require("fs");
let eatclub = fs.readFileSync("apps/mobile/src/lib/packets/food/eatclub.ts", "utf8");

eatclub = eatclub.replace(
    /const price = parseInt\(priceText\.replace\(\/\[\^0-9\]\/g, ''\), 10\);/g,
    `const price = parseInt(priceText.replace(/[^0-9]/g, ''), 10);
                  const imgEl = card.querySelector('img');
                  const extractedImageUrl = imgEl ? imgEl.src : '';`
);

eatclub = eatclub.replace(
    /restaurantName: restaurantName,/g,
    `restaurantName: restaurantName,
                          imageUrl: typeof extractedImageUrl !== 'undefined' ? extractedImageUrl : '',`
);

fs.writeFileSync("apps/mobile/src/lib/packets/food/eatclub.ts", eatclub, "utf8");
console.log("EatClub DOM Image Extracted");
