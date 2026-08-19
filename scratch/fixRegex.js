const fs = require("fs");
const files = [
    "apps/mobile/src/lib/packets/food/swiggy.ts",
    "apps/mobile/src/lib/packets/food/zomato.ts",
    "apps/mobile/src/lib/packets/food/eatsure.ts",
    "apps/mobile/src/lib/packets/food/eatclub.ts"
];

for (let file of files) {
    let content = fs.readFileSync(file, "utf8");
    
    // Replace regex corruptions where `?` was meant to be `?` or `\u20B9`
    // Examples: 
    // /(?:?|rs\.?)/i  -> /(?:\u20B9|rs\.?)/i
    // /OFF|?|RS/ -> /OFF|\u20B9|RS/
    // /?|RS.?/ -> /\u20B9|RS.?/
    
    // We'll replace all literal `?|` in regexes with `\\u20B9|`
    // But safely. We know where the `?` are:
    
    content = content.replace(/\(\?\:\?\|/g, "(?:\\u20B9|"); // (?:?|
    content = content.replace(/OFF\|\?\|RS/g, "OFF|\\u20B9|RS"); // OFF|?|RS
    content = content.replace(/\?\|RS/g, "\\u20B9|RS"); // ?|RS
    content = content.replace(/\|\| \?\)/g, "|| '\\u20B9')"); // || ?) in string logic if any
    content = content.replace(/rs\\.\?\s*\)\(\\\\d\+/g, "rs\\.?\\s*)(\\\\d+"); // Just in case
    
    // Let's do a blanket replace for `\?\|` if it's literally `?|` inside the regexes
    content = content.replace(/(?<!\\)\?\|/g, "\\u20B9|");
    content = content.replace(/\|\?/g, "|\\u20B9");
    content = content.replace(/\(\?\:\?/g, "(?:\\u20B9");

    // Fix specific syntax errors from the grep:
    content = content.replace(/\(\?\:\\u20B9/g, "(?:\\u20B9");
    
    fs.writeFileSync(file, content, "utf8");
}
console.log("Regexes fixed");
