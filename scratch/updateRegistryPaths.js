const fs = require('fs');
let content = fs.readFileSync('apps/mobile/src/lib/packets/registry.ts', 'utf8');

// Replace imports
content = content.replace(/import \{ ZomatoPacket \} from '\.\/zomato';/g, "import { ZomatoPacket } from './food/zomato';");
content = content.replace(/import \{ SwiggyPacket \} from '\.\/swiggy';/g, "import { SwiggyPacket } from './food/swiggy';");
content = content.replace(/import \{ EatSurePacket \} from '\.\/eatsure';/g, "import { EatSurePacket } from './food/eatsure';");

// Add stubs imports
const imports = `import { EatClubPacket } from './food/eatclub';\nimport { ToingPacket } from './food/toing';\nimport { OwnlyPacket } from './food/ownly';\n`;
content = content.replace("export interface ProviderMetadata", imports + "export interface ProviderMetadata");

fs.writeFileSync('apps/mobile/src/lib/packets/registry.ts', content);
console.log('Registry paths updated!');
