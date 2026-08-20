const fs = require("fs");
const app = fs.readFileSync("apps/mobile/src/lib/UniversalCartModal.tsx", "utf8");
console.log(app.includes(""));
