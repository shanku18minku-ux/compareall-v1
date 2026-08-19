const fs = require("fs");
let eatsure = fs.readFileSync("apps/mobile/src/lib/packets/food/eatsure.ts", "utf8");

eatsure = eatsure.replace(
    /return \`https:\/\/www\.eatsure\.com\/\`;/g,
    "return `https://www.eatsure.com/search?q=${encodeURIComponent(query)}`;"
);

eatsure = eatsure.replace(
    /var brand = "EatSure Brand";\s*if \(window\.location\.href\.includes\('ovenstory'\)\) brand = "Oven Story Pizza";\s*if \(window\.location\.href\.includes\('behrouz'\)\) brand = "Behrouz Biryani";\s*if \(window\.location\.href\.includes\('faasos'\)\) brand = "Faasos";\s*if \(window\.location\.href\.includes\('wendys'\)\) brand = "Wendy's";/g,
    `var brand = "EatSure";
                    var brandEl = card.querySelector('div[class*="brand"], span[class*="brand"]');
                    if (brandEl) brand = brandEl.innerText.trim();`
);

eatsure = eatsure.replace(
    /restaurantName: brand,/g,
    "restaurantName: brand,\n                            imageUrl: '', // EatSure images can be complex to extract consistently from DOM without API, so we leave it empty to fallback gracefully"
);

fs.writeFileSync("apps/mobile/src/lib/packets/food/eatsure.ts", eatsure, "utf8");
console.log("EatSure Search URL fixed");
