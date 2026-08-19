const fs = require("fs");
let modal = fs.readFileSync("apps/mobile/src/lib/UniversalCartModal.tsx", "utf8");
modal = modal.replace(
    /<Text style=\{styles\.offerProvider\}>\{offer\.providerName\}<\/Text>/g,
    `<Text style={styles.offerProvider}>{offer.providerName} {offer.deliveryTime ? \`(\${offer.deliveryTime})\` : ''}</Text>`
);
fs.writeFileSync("apps/mobile/src/lib/UniversalCartModal.tsx", modal, "utf8");
console.log("UniversalCartModal ETA added");
