const fs = require('fs');

function replaceFile(path, replacements) {
    if (!fs.existsSync(path)) return;
    let content = fs.readFileSync(path, 'utf8');
    replacements.forEach(([oldStr, newStr]) => {
        content = content.split(oldStr).join(newStr);
    });
    fs.writeFileSync(path, content, 'utf8');
}

// App.tsx
replaceFile('apps/mobile/App.tsx', [
    ['<Text style={styles.locationIcon}>??</Text>', '<Text style={styles.locationIcon}>??</Text>'],
    ['<Text style={styles.searchIcon}>??</Text>', '<Text style={styles.searchIcon}>??</Text>'],
    ['Open Menu ?</Text>', 'Open Menu ?</Text>'],
    ['? Back to', '? Back to'],
    ['?{offer.price', '?{offer.price'],
    ['<Text>??</Text><Text style={styles.tabText}>Search', '<Text>??</Text><Text style={styles.tabText}>Search'],
    ['<Text>??</Text><Text style={styles.tabText}>Connections', '<Text>??</Text><Text style={styles.tabText}>Connections'],
    ['?? Items | View Cart ??', '?? Items | View Cart ?'],
    ['?{', '?{'] // just in case for prices
]);

// UniversalCartModal.tsx
replaceFile('apps/mobile/src/lib/UniversalCartModal.tsx', [
    ['?{total}', '?{total}'],
    ['?{data', '?{data'],
    ['?30', '?30'],
    ['?15', '?15'],
    ['? 30-40 MINS', '?? 30-40 MINS'],
    ['>?</Text>', '>?</Text>'],
    ['?{', '?{']
]);

// Packets
replaceFile('apps/mobile/src/lib/packets/food/eatclub.ts', [['icon: \'?\?\'', 'icon: \'??\''], ['icon: \'?\'', 'icon: \'??\'']]);
replaceFile('apps/mobile/src/lib/packets/food/eatsure.ts', [['icon: \'?\?\'', 'icon: \'???\''], ['icon: \'?\'', 'icon: \'???\'']]);
replaceFile('apps/mobile/src/lib/packets/food/toing.ts', [['icon: \'?\?\'', 'icon: \'??\''], ['icon: \'?\'', 'icon: \'??\'']]);
replaceFile('apps/mobile/src/lib/packets/food/ownly.ts', [['icon: \'?\?\'', 'icon: \'??\''], ['icon: \'?\'', 'icon: \'??\'']]);
replaceFile('apps/mobile/src/lib/packets/registry.ts', [
    ['icon: \'?\?\'', 'icon: \'???\''], 
    ['icon: \'?\'', 'icon: \'???\'']
]);

console.log("Encoding fixes applied!");
