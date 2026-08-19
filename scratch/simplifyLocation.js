const fs = require("fs");
let app = fs.readFileSync("apps/mobile/App.tsx", "utf8");
app = app.replace(
    /accuracy: Location\.Accuracy\.Highest, maximumAge: 0/g,
    `accuracy: 5`
);
fs.writeFileSync("apps/mobile/App.tsx", app, "utf8");
console.log("Location accuracy simplified");
