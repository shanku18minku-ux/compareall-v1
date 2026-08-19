const fs = require("fs");
let zomato = fs.readFileSync("apps/mobile/src/lib/packets/food/zomato.ts", "utf8");

zomato = zomato.replace(
    /var displayTitle = dishTitle \+ ' \- ' \+ restName;/g,
    `var displayTitle = dishTitle + ' - ' + restName;
                              var imgElem = card.querySelector('img');
                              var extractedImageUrl = imgElem ? imgElem.src : '';`
);

zomato = zomato.replace(
    /imageUrl: '',/g,
    "imageUrl: typeof extractedImageUrl !== 'undefined' ? extractedImageUrl : '',"
);

fs.writeFileSync("apps/mobile/src/lib/packets/food/zomato.ts", zomato, "utf8");
console.log("Zomato DOM Image Extracted");
