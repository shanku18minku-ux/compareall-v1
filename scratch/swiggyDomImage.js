const fs = require("fs");
let swiggy = fs.readFileSync("apps/mobile/src/lib/packets/food/swiggy.ts", "utf8");

// DAPI image injection
swiggy = swiggy.replace(
    /restaurantUrl: 'https:\/\/www\.swiggy\.com\/restaurants\/' \+ rSlug \+ '\-' \+ \(rInfo\.id \|\| ''\),/g,
    `restaurantUrl: 'https://www.swiggy.com/restaurants/' + rSlug + '-' + (rInfo.id || ''),
                                              imageUrl: rInfo.cloudinaryImageId ? ('https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_208,h_208,c_fit/' + rInfo.cloudinaryImageId) : '',`
);

swiggy = swiggy.replace(
    /restaurantUrl: restaurantUrl,\n                                  menuPrice/g,
    `restaurantUrl: restaurantUrl,
                                  imageUrl: info.imageId ? ('https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_208,h_208,c_fit/' + info.imageId) : '',
                                  menuPrice`
);

// DOM image injection
swiggy = swiggy.replace(
    /var priceText = priceEl \? priceEl\.innerText \: '';/g,
    `var priceText = priceEl ? priceEl.innerText : '';
                                          var imgEl = card.querySelector('img');
                                          var extractedImageUrl = imgEl ? imgEl.src : '';`
);

swiggy = swiggy.replace(
    /restaurantName: restText \|\| 'Unknown Restaurant',/g,
    `restaurantName: restText || 'Unknown Restaurant',
                                              imageUrl: typeof extractedImageUrl !== 'undefined' ? extractedImageUrl : '',`
);

fs.writeFileSync("apps/mobile/src/lib/packets/food/swiggy.ts", swiggy, "utf8");
console.log("Swiggy DOM & DAPI Image Extracted");
