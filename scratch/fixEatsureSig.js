const fs = require('fs');
let content = fs.readFileSync('apps/mobile/src/lib/packets/eatsure.ts', 'utf8');

content = content.replace('getExtractorInjection: (query: string, location?: any) => {', 'getExtractorInjection: (searchUrl: string, query?: string, location?: any) => {\n        query = query || "";');

fs.writeFileSync('apps/mobile/src/lib/packets/eatsure.ts', content);
console.log('Fixed eatsure.ts signature!');
