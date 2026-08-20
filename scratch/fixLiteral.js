const fs = require("fs");
let app = fs.readFileSync("apps/mobile/App.tsx", "utf8");
app = app.replace("??", "??").replace("??", "??");
fs.writeFileSync("apps/mobile/App.tsx", app, "utf8");
console.log("Fixed ?? using literal string replacement");
