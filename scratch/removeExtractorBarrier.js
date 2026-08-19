const fs = require("fs");
let app = fs.readFileSync("apps/mobile/App.tsx", "utf8");

app = app.replace(
    /if \(\!isAllConnected\) return null;/g,
    ``
);

fs.writeFileSync("apps/mobile/App.tsx", app, "utf8");
console.log("Extractors will now run regardless of connection status");
