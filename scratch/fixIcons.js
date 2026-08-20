const fs = require("fs");
let app = fs.readFileSync("apps/mobile/App.tsx", "utf8");

// Fix search icon
app = app.replace(/<Text style=\{styles\.searchIcon\}>\?\?<\/Text>/, `<Text style={styles.searchIcon}>??</Text>`);

// Fix bottom nav icons
app = app.replace(/>dY"\?</, `>??<`);
app = app.replace(/>dY"-\?</, `>??<`);
app = app.replace(/>dY"-</, `>??<`);

// Fix connect icon fallback
app = app.replace(/\{p\.icon \|\| '\?\?'\}/, `{p.icon || '??'}`);

fs.writeFileSync("apps/mobile/App.tsx", app, "utf8");
console.log("Fixed App.tsx icons");
