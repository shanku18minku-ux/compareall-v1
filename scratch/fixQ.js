const fs = require('fs');
const file = 'apps/mobile/src/lib/packets/eatsure.ts';
let content = fs.readFileSync(file, 'utf8');
content = content.replace('var q = \\${safeQuery}\\;', 'var q = ;');
fs.writeFileSync(file, content);
console.log('Fixed q');
