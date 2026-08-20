const fs = require("fs");
let app = fs.readFileSync("apps/mobile/App.tsx", "utf8");

app = app.replace(
    /let \{ status \} = await Location\.requestForegroundPermissionsAsync\(\);[\s\S]*?setLocation\(\{ latitude: loc\.coords\.latitude, longitude: loc\.coords\.longitude, name \}\);\s*\}/,
    `try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setLocation({ latitude: 24.0322, longitude: 84.0722, name: 'Daltonganj, Jharkhand' });
        } else {
            let loc = await Location.getCurrentPositionAsync({ accuracy: 5 }).catch(() => null);
            if (!loc) {
                setLocation({ latitude: 24.0322, longitude: 84.0722, name: 'Daltonganj, Jharkhand (Fallback)' });
            } else {
                let geo = await Location.reverseGeocodeAsync({ latitude: loc.coords.latitude, longitude: loc.coords.longitude }).catch(() => []);
                let name = geo && geo.length > 0 ? (geo[0].city || geo[0].name || '') + ', ' + (geo[0].region || '') : 'Current Location';
                setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude, name });
            }
        }
    } catch(e) {
        setLocation({ latitude: 24.0322, longitude: 84.0722, name: 'Daltonganj, Jharkhand' });
    }`
);

fs.writeFileSync("apps/mobile/App.tsx", app, "utf8");
console.log("Wrapped Location requests in try...catch");
