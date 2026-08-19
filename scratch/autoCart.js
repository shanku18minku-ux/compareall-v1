const fs = require('fs');
let content = fs.readFileSync('apps/mobile/App.tsx', 'utf8');

content = content.replace(/const handleAddToCart = \(offer: any, groupTitle: string\) => \{\s*Vibration\.vibrate\(25\)\;/, "const handleAddToCart = (offer: any, groupTitle: string) => {\n    Vibration.vibrate(25);\n    setIsCartModalVisible(true);");

fs.writeFileSync('apps/mobile/App.tsx', content);
