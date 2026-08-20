const fs = require("fs");
let app = fs.readFileSync("apps/mobile/App.tsx", "utf8");
app = app.replace(
    /let searchUrl = packet\.getSearchUrl\(location, searchQuery\);/,
    "let searchUrl = packet.getSearchUrl(searchQuery, location);"
);
fs.writeFileSync("apps/mobile/App.tsx", app, "utf8");
console.log("Fixed getSearchUrl arguments");
