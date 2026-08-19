const fs = require("fs");
let appJson = JSON.parse(fs.readFileSync("apps/mobile/app.json", "utf8"));

if (!appJson.expo.plugins) appJson.expo.plugins = [];
if (!appJson.expo.plugins.includes("expo-location")) {
    appJson.expo.plugins.push([
        "expo-location",
        {
            "locationAlwaysAndWhenInUsePermission": "Allow CompareAll to use your location to find the best restaurant prices near you."
        }
    ]);
}

if (!appJson.expo.android.permissions) appJson.expo.android.permissions = [];
const perms = ["ACCESS_COARSE_LOCATION", "ACCESS_FINE_LOCATION"];
perms.forEach(p => {
    if (!appJson.expo.android.permissions.includes(p)) {
        appJson.expo.android.permissions.push(p);
    }
});

fs.writeFileSync("apps/mobile/app.json", JSON.stringify(appJson, null, 2), "utf8");
console.log("app.json permissions updated");
