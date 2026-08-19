const fs = require('fs');

const registryPath = 'apps/mobile/src/lib/packets/registry.ts';
const content = fs.readFileSync(registryPath, 'utf8');
console.log(content);
