const fs = require("fs");
let app = fs.readFileSync("apps/mobile/App.tsx", "utf8");
app = app.replace(
    /if \(activeTab === 'Search' && activeCategory === 'Food' && !searchQuery && results\.length === 0 && !isSearching\) \{/,
    `if (activeTab === 'Search' && activeCategory === 'Food' && !searchQuery && results.length === 0 && !isSearching && location !== null) {`
);
fs.writeFileSync("apps/mobile/App.tsx", app, "utf8");
console.log("Updated auto-search to wait for location");
