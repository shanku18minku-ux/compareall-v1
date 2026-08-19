const fs = require('fs');
let zomato = fs.readFileSync('apps/mobile/src/lib/packets/food/zomato.ts', 'utf8');

zomato = zomato.replace(
    /var restName = titleElem \? titleElem\.textContent\.replace\(\/\\s\+\/g, ' '\)\.trim\(\) : '';/g,
    `var restName = titleElem ? titleElem.textContent.replace(/\\s+/g, ' ').trim() : '';
                          if (!restName) {
                              var altElem = card.querySelector('p[class*="title"], p[class*="name"], .sc-1hp8d8a-0');
                              if (altElem) restName = altElem.textContent.trim();
                          }
                          if (!restName) return;`
);

zomato = zomato.replace(
    /var dishTitle = q\.toUpperCase\(\);/g,
    `var dishTitle = (q && q.toLowerCase() !== 'food') ? (q.charAt(0).toUpperCase() + q.slice(1)) : 'Menu Item';`
);

fs.writeFileSync('apps/mobile/src/lib/packets/food/zomato.ts', zomato, 'utf8');
console.log("Zomato fallback logic fixed");
