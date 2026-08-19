const fs = require("fs");
let app = fs.readFileSync("apps/mobile/App.tsx", "utf8");

app = app.replace(
    /let matchCount = 0;[\s\S]*?return false;/g,
    `const n1 = rWords.join('');
                   const n2 = gWords.join('');
                   
                   // Perfect merge: If they share the exact same first word, AND one's full name is inside the other's
                   // (e.g. "Jain Shree" in "Jain Shree Sweets" -> MERGES)
                   // (e.g. "Burger King" vs "Burger Singh" -> BLOCKS, because neither contains the other)
                   if (rWords[0] === gWords[0] && (n1.includes(n2) || n2.includes(n1))) {
                       return true;
                   }
                   
                   return false;`
);

fs.writeFileSync("apps/mobile/App.tsx", app, "utf8");
console.log("Grouping logic refined for perfection");
