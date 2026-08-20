const fs = require("fs");
let file = fs.readFileSync("apps/mobile/android/gradle.properties", "utf8");
file = file.replace(/^reactNativeArchitectures=arm64-v8a/m, "# reactNativeArchitectures=armeabi-v7a,arm64-v8a,x86,x86_64");
fs.writeFileSync("apps/mobile/android/gradle.properties", file, "utf8");
console.log("Commented out reactNativeArchitectures to support Emulators");
