const fs = require('fs');

let app = fs.readFileSync('apps/mobile/App.tsx', 'utf8');

app = app.replace(/<Text style=\{styles.locationIcon\}>\?\?<\/Text>/g, '<Text style={styles.locationIcon}>??</Text>');
app = app.replace(/<Text style=\{styles.searchIcon\}>\?\?<\/Text>/g, '<Text style={styles.searchIcon}>??</Text>');
app = app.replace(/Open Menu \?<\/Text>/g, 'Open Menu ?</Text>');
app = app.replace(/\? Back to/g, '? Back to');
app = app.replace(/\?\{offer\.price/g, '?{offer.price');

// Nav tabs
app = app.replace(/<Text style=\{([^}]+)\}>\?\?<\/Text>\s*<Text style=\{([^}]+)\}>Search/g, '<Text style={$1}>??</Text>\n                <Text style={$2}>Search');
app = app.replace(/<Text style=\{([^}]+)\}>\?\?<\/Text>\s*<Text style=\{([^}]+)\}>Connections/g, '<Text style={$1}>??</Text>\n                <Text style={$2}>Connections');

app = app.replace(/View Cart \?\?/g, 'View Cart ?');

fs.writeFileSync('apps/mobile/App.tsx', app, 'utf8');
console.log("App.tsx fixed");

let cart = fs.readFileSync('apps/mobile/src/lib/UniversalCartModal.tsx', 'utf8');
cart = cart.replace(/\?\{total/g, '?{total');
cart = cart.replace(/\?\{data/g, '?{data');
cart = cart.replace(/\?30/g, '?30');
cart = cart.replace(/\?15/g, '?15');
cart = cart.replace(/\? 30-40 MINS/g, '?? 30-40 MINS');
cart = cart.replace(/\?>\?<\/Text>/g, '>?</Text>');
fs.writeFileSync('apps/mobile/src/lib/UniversalCartModal.tsx', cart, 'utf8');
console.log("Cart fixed");
