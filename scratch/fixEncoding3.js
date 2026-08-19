const fs = require('fs');
let cart = fs.readFileSync('apps/mobile/src/lib/UniversalCartModal.tsx', 'utf8');
cart = cart.replace(/\?\{/g, '?{');
fs.writeFileSync('apps/mobile/src/lib/UniversalCartModal.tsx', cart, 'utf8');
console.log("Cart ? fixed");
