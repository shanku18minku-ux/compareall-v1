const fs = require("fs");
let modal = fs.readFileSync("apps/mobile/src/lib/UniversalCartModal.tsx", "utf8");
modal = modal.replace(
    /let off = cartItems\[i\]\.offers\.find\(o => o\.providerName === providerName\);/g,
    `let off = (cartItems[i].offers || []).find(o => String(o.providerName) === String(providerName));`
);
fs.writeFileSync("apps/mobile/src/lib/UniversalCartModal.tsx", modal, "utf8");
console.log("Cart ETA fixed");
