const fs = require('fs');

['zomato.ts', 'swiggy.ts', 'eatsure.ts'].forEach(file => {
    let path = 'apps/mobile/src/lib/packets/food/' + file;
    let content = fs.readFileSync(path, 'utf8');
    content = content.replace(/from '\.\/types'/g, "from '../types'");
    fs.writeFileSync(path, content);
});
console.log('Fixed types imports in food packets!');
