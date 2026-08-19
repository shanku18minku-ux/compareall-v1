const fs = require("fs");
let swiggy = fs.readFileSync("apps/mobile/src/lib/packets/food/swiggy.ts", "utf8");

swiggy = swiggy.replace(
    /dishName: q\.toUpperCase\(\),/g,
    "dishName: (q && q.toLowerCase() !== 'food') ? (q.charAt(0).toUpperCase() + q.slice(1)) : 'Menu Item',"
);

fs.writeFileSync("apps/mobile/src/lib/packets/food/swiggy.ts", swiggy, "utf8");
console.log("Swiggy FOOD label fixed");
