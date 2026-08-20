const fs = require("fs");
let appJson = JSON.parse(fs.readFileSync("apps/mobile/app.json", "utf8"));
if (appJson.expo.android.permissions) {
    delete appJson.expo.android.permissions;
    fs.writeFileSync("apps/mobile/app.json", JSON.stringify(appJson, null, 2), "utf8");
    console.log("Removed hardcoded permissions array to restore default INTERNET and other permissions");
} else {
    console.log("No permissions array found");
}
