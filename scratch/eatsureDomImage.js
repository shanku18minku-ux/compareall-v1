const fs = require("fs");
let eatsure = fs.readFileSync("apps/mobile/src/lib/packets/food/eatsure.ts", "utf8");

eatsure = eatsure.replace(
    /var brandEl = card\.querySelector\('div\[class\*="brand"\], span\[class\*="brand"\]'\);\s*if \(brandEl\) brand = brandEl\.innerText\.trim\(\);/g,
    `var brandEl = card.querySelector('div[class*="brand"], span[class*="brand"]');
                    if (brandEl) brand = brandEl.innerText.trim();
                    var imgEl = card.querySelector('img');
                    var extractedImageUrl = imgEl ? imgEl.src : '';`
);

eatsure = eatsure.replace(
    /imageUrl: '', \/\/ EatSure images can be complex to extract consistently from DOM without API, so we leave it empty to fallback gracefully/g,
    `imageUrl: typeof extractedImageUrl !== 'undefined' ? extractedImageUrl : '',`
);

fs.writeFileSync("apps/mobile/src/lib/packets/food/eatsure.ts", eatsure, "utf8");
console.log("EatSure DOM Image Extracted");
