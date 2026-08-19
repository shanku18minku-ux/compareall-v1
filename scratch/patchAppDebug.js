const fs = require('fs');
const file = 'apps/mobile/App.tsx';
let content = fs.readFileSync(file, 'utf8');

// Find handleDataExtracted
content = content.replace(
    'const handleDataExtracted = useCallback((data: any, providerId: string) => {',
    'const handleDataExtracted = useCallback((data: any, providerId: string) => {\n      console.log([DATA EXTRACTED] \: success=\, count=\);'
);

fs.writeFileSync(file, content);
console.log('Patched App.tsx for debugging');
