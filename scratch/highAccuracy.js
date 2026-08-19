const fs = require("fs");
let app = fs.readFileSync("apps/mobile/App.tsx", "utf8");

app = app.replace(
    /let loc = await Location\.getCurrentPositionAsync\(\{.*?\}\);/g,
    `let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest, maximumAge: 0 });`
);

fs.writeFileSync("apps/mobile/App.tsx", app, "utf8");
console.log("Location accuracy set to Highest");
