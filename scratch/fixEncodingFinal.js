const fs = require("fs");
let app = fs.readFileSync("apps/mobile/App.tsx", "utf8");
app = app.replace(/<Text style=\{styles.locationIcon\}>\?\?<\/Text>/g, "<Text style={styles.locationIcon}>\uD83D\uDCCD</Text>");
app = app.replace(/<Text style=\{styles.searchIcon\}>\?\?<\/Text>/g, "<Text style={styles.searchIcon}>\uD83D\uDD0D</Text>");
app = app.replace(/Open Menu \?<\/Text>/g, "Open Menu \u2794</Text>");
app = app.replace(/\? Back to/g, "\u2190 Back to");
app = app.replace(/\?\{offer\.price/g, "\u20B9{offer.price");
app = app.replace(/<Text style=\{([^}]+)\}>\?\?<\/Text>\s*<Text style=\{([^}]+)\}>Search/g, "<Text style={$1}>\uD83D\uDD0D</Text>\n<Text style={$2}>Search");
app = app.replace(/<Text style=\{([^}]+)\}>\?\?<\/Text>\s*<Text style=\{([^}]+)\}>Connections/g, "<Text style={$1}>\uD83D\uDD17</Text>\n<Text style={$2}>Connections");
app = app.replace(/View Cart \?\?/g, "View Cart \u2794");
fs.writeFileSync("apps/mobile/App.tsx", app, "utf8");

let cart = fs.readFileSync("apps/mobile/src/lib/UniversalCartModal.tsx", "utf8");
cart = cart.replace(/\?\{/g, "\u20B9{");
cart = cart.replace(/\?30/g, "\u20B930");
cart = cart.replace(/\?15/g, "\u20B915");
cart = cart.replace(/\? 30-40 MINS/g, "\uD83D\uDD52 30-40 MINS");
cart = cart.replace(/>\?<\/Text>/g, ">\u2715</Text>");
fs.writeFileSync("apps/mobile/src/lib/UniversalCartModal.tsx", cart, "utf8");

let eatclub = fs.readFileSync("apps/mobile/src/lib/packets/food/eatclub.ts", "utf8");
eatclub = eatclub.replace(/icon: '\?\?'/g, "icon: '\uD83C\uDF54'").replace(/icon: '\?'/g, "icon: '\uD83C\uDF54'");
fs.writeFileSync("apps/mobile/src/lib/packets/food/eatclub.ts", eatclub, "utf8");

let eatsure = fs.readFileSync("apps/mobile/src/lib/packets/food/eatsure.ts", "utf8");
eatsure = eatsure.replace(/icon: '\?\?'/g, "icon: '\uD83C\uDF7D\uFE0F'").replace(/icon: '\?'/g, "icon: '\uD83C\uDF7D\uFE0F'");
fs.writeFileSync("apps/mobile/src/lib/packets/food/eatsure.ts", eatsure, "utf8");

let toing = fs.readFileSync("apps/mobile/src/lib/packets/food/toing.ts", "utf8");
toing = toing.replace(/icon: '\?\?'/g, "icon: '\uD83D\uDEF5'").replace(/icon: '\?'/g, "icon: '\uD83D\uDEF5'");
fs.writeFileSync("apps/mobile/src/lib/packets/food/toing.ts", toing, "utf8");

let ownly = fs.readFileSync("apps/mobile/src/lib/packets/food/ownly.ts", "utf8");
ownly = ownly.replace(/icon: '\?\?'/g, "icon: '\uD83C\uDF55'").replace(/icon: '\?'/g, "icon: '\uD83C\uDF55'");
fs.writeFileSync("apps/mobile/src/lib/packets/food/ownly.ts", ownly, "utf8");

let registry = fs.readFileSync("apps/mobile/src/lib/packets/registry.ts", "utf8");
registry = registry.replace(/icon: '\?\?'/g, "icon: '\uD83C\uDF7D\uFE0F'").replace(/icon: '\?'/g, "icon: '\uD83C\uDF7D\uFE0F'");
fs.writeFileSync("apps/mobile/src/lib/packets/registry.ts", registry, "utf8");

console.log("Done");
