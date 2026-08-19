const fs = require("fs");
let swiggy = fs.readFileSync("apps/mobile/src/lib/packets/food/swiggy.ts", "utf8");

swiggy = swiggy.replace(
    /restaurantUrl: rOrderUrl,/g,
    "restaurantUrl: rOrderUrl,\n                            imageUrl: info.cloudinaryImageId ? ('https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_208,h_208,c_fit/' + info.cloudinaryImageId) : '',"
);

swiggy = swiggy.replace(
    /restaurantUrl: restUrl,/g,
    "restaurantUrl: restUrl,\n                                  imageUrl: '',"
);

fs.writeFileSync("apps/mobile/src/lib/packets/food/swiggy.ts", swiggy, "utf8");
console.log("Swiggy Images Added");
