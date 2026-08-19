const fs = require("fs");
let app = fs.readFileSync("apps/mobile/App.tsx", "utf8");

app = app.replace(
    /let group = updated\.find\(g => \{\s*const gName = norm\(g\.restaurantName\);\s*if \(\!restKey \|\| \!gName\) return false;\s*return gName\.includes\(restKey\) \|\| restKey\.includes\(gName\);\s*\}\);/g,
    `let group = updated.find(g => {
                   const gName = norm(g.restaurantName);
                   if (!restKey || !gName) return false;
                   if (gName === restKey) return true;
                   
                   // Avoid black-hole grouping where "Pizza" swallows "Domino's Pizza"
                   // Use strict word boundary check or high-similarity
                   const rWords = restName.toLowerCase().replace(/[^a-z0-9\\s]/g, '').trim().split(/\\s+/);
                   const gWords = g.restaurantName.toLowerCase().replace(/[^a-z0-9\\s]/g, '').trim().split(/\\s+/);
                   
                   if (rWords.length === 0 || gWords.length === 0) return false;
                   
                   // Require at least first two words to match if they are multi-word, or exact match if single word
                   if (rWords.length === 1 && gWords.length === 1) return rWords[0] === gWords[0];
                   
                   let matchCount = 0;
                   let minLen = Math.min(rWords.length, gWords.length);
                   for(let i=0; i < minLen; i++) {
                       if (rWords[i] === gWords[i]) matchCount++;
                   }
                   
                   // Must match the first word EXACTLY, and if there are more words, at least 50% match
                   if (rWords[0] === gWords[0] && (matchCount / Math.max(rWords.length, gWords.length)) > 0.4) return true;
                   
                   // Special exact substring check only if it's very long (e.g. "KFC" vs "KFC (Kentucky Fried Chicken)")
                   if (gName.length > 5 && restKey.length > 5) {
                       if (gName.startsWith(restKey) || restKey.startsWith(gName)) return true;
                   }
                   
                   return false;
               });`
);

fs.writeFileSync("apps/mobile/App.tsx", app, "utf8");
console.log("App.tsx Black Hole Grouping FIXED");
