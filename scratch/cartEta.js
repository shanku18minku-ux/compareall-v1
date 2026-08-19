const fs = require("fs");
let modal = fs.readFileSync("apps/mobile/src/lib/UniversalCartModal.tsx", "utf8");

modal = modal.replace(
    /const data = providerTotals\[String\(providerName\)\];\s*if \(\!data\) return null;\s*const finalToPay = data\.total \+ data\.deliveryFee \+ data\.taxes;/g,
    `const data = providerTotals[String(providerName)];
                          if (!data) return null;
                          const finalToPay = data.total + data.deliveryFee + data.taxes;
                          let providerEta = "30 mins";
                          for (let i=0; i<cartItems.length; i++) {
                              let off = cartItems[i].offers.find(o => o.providerName === providerName);
                              if (off && off.deliveryTime) { providerEta = off.deliveryTime; break; }
                          }`
);

modal = modal.replace(
    /<Text style=\{styles\.timeTag\}>.*?<\/Text>/g,
    `<Text style={styles.timeTag}>?? {providerEta}</Text>`
);

fs.writeFileSync("apps/mobile/src/lib/UniversalCartModal.tsx", modal, "utf8");
console.log("Cart ETA injected");
