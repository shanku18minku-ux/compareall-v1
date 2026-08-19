const fs = require('fs');
const content = fs.readFileSync('apps/mobile/App.tsx', 'utf8');

// I need to locate where results.map is rendered.
const startIndex = content.indexOf('results.map((restGroup, index) => {');
console.log('startIndex:', startIndex);

const selectedMenuRestIndex = content.indexOf('Modal visible={!!selectedMenuRest}');
console.log('selectedMenuRestIndex:', selectedMenuRestIndex);

