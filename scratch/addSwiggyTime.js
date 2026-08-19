const fs = require("fs");
let swiggy = fs.readFileSync("apps/mobile/src/lib/packets/food/swiggy.ts", "utf8");

swiggy = swiggy.replace(
    /restaurantName: rInfo\.name,\s*restaurantUrl:/g,
    `restaurantName: rInfo.name,
                                              deliveryTime: (rInfo.sla && rInfo.sla.slaString) ? rInfo.sla.slaString : '',
                                              restaurantUrl:`
);

swiggy = swiggy.replace(
    /restaurantName: restName,\s*restaurantUrl:/g,
    `restaurantName: restName,
                                  deliveryTime: (restInfo && restInfo.sla && restInfo.sla.slaString) ? restInfo.sla.slaString : '',
                                  restaurantUrl:`
);

fs.writeFileSync("apps/mobile/src/lib/packets/food/swiggy.ts", swiggy, "utf8");
console.log("Swiggy deliveryTime added");
