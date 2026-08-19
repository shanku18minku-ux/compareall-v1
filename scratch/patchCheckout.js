const fs = require('fs');
let app = fs.readFileSync('apps/mobile/App.tsx', 'utf8');

const checkoutLogic = `onCheckout={(provName) => {
                 const packet = PROVIDERS.find(p => p.name === provName);
                 if (packet) {
                     const url = packet.checkoutUrl || packet.url || packet.loginUrl;
                     if (url) {
                         import('react-native').then(({ Linking, Alert }) => {
                             Linking.openURL(url).catch(err => {
                                 console.error("Failed to open URL", err);
                                 Alert.alert("Error", "Could not open " + provName + " app.");
                             });
                         });
                     }
                 }
             }}`;

app = app.replace(/onCheckout=\{\(prov\) \=\> console\.log\('Checkout', prov\)\}/g, checkoutLogic);

fs.writeFileSync('apps/mobile/App.tsx', app);
console.log('App.tsx checkout logic updated');
