const fs = require("fs");
const checkFile = (file) => {
    const app = fs.readFileSync(file, "utf8");
    let hasCorrupt = false;
    for (let i = 0; i < app.length; i++) {
        const code = app.charCodeAt(i);
        if (code >= 0xD800 && code <= 0xDFFF) {
            hasCorrupt = true;
        }
        if (code > 0xFFFF) {
           console.log("High code point in " + file);
        }
    }
    if (app.includes("\uFFFD")) {
        console.log("Found REPLACEMENT CHARACTER (broken UTF-8) in " + file);
        hasCorrupt = true;
    }
    if (hasCorrupt) console.log("Corrupt chars in " + file);
};
checkFile("apps/mobile/src/lib/packets/food/toing.ts");
checkFile("apps/mobile/src/lib/packets/food/ownly.ts");
