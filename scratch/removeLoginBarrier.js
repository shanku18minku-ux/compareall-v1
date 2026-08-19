const fs = require("fs");
let app = fs.readFileSync("apps/mobile/App.tsx", "utf8");

// 1. Remove the blocking view
app = app.replace(
    /\{\s*activeTab === 'Search' && activeCategory === 'Food' && !isAllConnected && \([\s\S]*?<\/View>\s*\)\s*\}/,
    ``
);

// 2. Remove `&& isAllConnected` from search blocks
app = app.replace(/&& isAllConnected /g, "");
app = app.replace(/&& !isAllConnected /g, "");

fs.writeFileSync("apps/mobile/App.tsx", app, "utf8");
console.log("Login requirement removed for Search");
