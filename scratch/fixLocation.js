const fs = require("fs");
let extractor = fs.readFileSync("apps/mobile/src/lib/WebViewExtractor.tsx", "utf8");

extractor = extractor.replace(
    /var isEatSure = currentUrl\.includes\('eatsure'\);/g,
    "var isEatSure = currentUrl.includes('eatsure');\n        var isEatClub = currentUrl.includes('eatclub');"
);

extractor = extractor.replace(
    /checkAndSetCookie\('longitude', lng\);\n            \}\n        \} catch\(e\) \{\}/g,
    `checkAndSetCookie('longitude', lng);\n            }\n        } catch(e) {}\n\n        // 5. Inject EatClub LocalStorage\n        try {\n            if (isEatClub) {\n                var ecLoc = localStorage.getItem('user_location') || localStorage.getItem('location');\n                if (!ecLoc || !ecLoc.includes(String(lat))) {\n                    localStorage.setItem('user_location', JSON.stringify({lat: lat, lng: lng, address: locName}));\n                    localStorage.setItem('location', JSON.stringify({lat: lat, lng: lng, address: locName}));\n                    needsReload = true;\n                }\n                checkAndSetCookie('lat', lat);\n                checkAndSetCookie('lng', lng);\n            }\n        } catch(e) {}`
);

fs.writeFileSync("apps/mobile/src/lib/WebViewExtractor.tsx", extractor, "utf8");
console.log("WebViewExtractor EatClub location fixed");
