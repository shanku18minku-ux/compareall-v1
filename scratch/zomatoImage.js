const fs = require("fs");
let zomato = fs.readFileSync("apps/mobile/src/lib/packets/food/zomato.ts", "utf8");

zomato = zomato.replace(
    /restaurantUrl: rOrderUrl,/g,
    "restaurantUrl: rOrderUrl,\n                            imageUrl: (info.image && info.image.url) ? info.image.url.split('?')[0] : '',"
);

zomato = zomato.replace(
    /restaurantUrl: restUrl,/g,
    "restaurantUrl: restUrl,\n                                  imageUrl: '',"
);

fs.writeFileSync("apps/mobile/src/lib/packets/food/zomato.ts", zomato, "utf8");
console.log("Zomato Images Added");
