const fs = require('fs');
let content = fs.readFileSync('apps/mobile/App.tsx', 'utf8');

// Target the WebViewExtractor key
// We need to match key={id + '__' + fetchQuery + '__' + searchNonce} 
const target = `key={id + '__' + fetchQuery + '__' + searchNonce}`;
const replacement = `key={id}`;

content = content.replace(target, replacement);

fs.writeFileSync('apps/mobile/App.tsx', content);
console.log('Fixed WebViewExtractor key to prevent crashes!');
