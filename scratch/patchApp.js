const fs = require('fs');

let appContent = fs.readFileSync('apps/mobile/App.tsx', 'utf8');

// Fix unhandled promise rejection in location fetch
appContent = appContent.replace(
`        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setLocation({ latitude: 24.0322, longitude: 84.0722, name: 'Daltonganj, Jharkhand' });
        } else {
            let loc = await Location.getCurrentPositionAsync({});
            let geo = await Location.reverseGeocodeAsync({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
            let name = geo.length > 0 ? \`\${geo[0].city || geo[0].name}, \${geo[0].region}\` : 'Current Location';
            setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude, name });
        }`,
`        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setLocation({ latitude: 24.0322, longitude: 84.0722, name: 'Daltonganj, Jharkhand' });
            } else {
                let loc = await Location.getCurrentPositionAsync({});
                let geo = await Location.reverseGeocodeAsync({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
                let name = geo.length > 0 ? \`\${geo[0].city || geo[0].name}, \${geo[0].region}\` : 'Current Location';
                setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude, name });
            }
        } catch (e) {
            setLocation({ latitude: 24.0322, longitude: 84.0722, name: 'Daltonganj, Jharkhand' });
        }`
);

// Safeguard activeProviders
appContent = appContent.replace(
`  const activeProviders = PROVIDERS.filter(p => p.category === activeCategory);`,
`  const activeProviders = (PROVIDERS || []).filter(p => p && p.category === activeCategory);`
);

fs.writeFileSync('apps/mobile/App.tsx', appContent);
console.log('App.tsx safeguards applied!');
