const fs = require("fs");
const app = fs.readFileSync("apps/mobile/App.tsx", "utf8");
let hasCorrupt = false;
for (let i = 0; i < app.length; i++) {
    const code = app.charCodeAt(i);
    // surrogate range 0xD800 - 0xDFFF
    if (code >= 0xD800 && code <= 0xDFFF) {
        console.log("Surrogate at index " + i + ": " + code.toString(16));
        hasCorrupt = true;
    }
}
if (!hasCorrupt) console.log("No broken surrogates found in App.tsx.");
