const fs = require("fs");
let app = fs.readFileSync("apps/mobile/App.tsx", "utf8");
app = app.replace(
    /useEffect\(\(\) => \{\s*\(\s*async\s*\(\)\s*=>\s*\{/,
    `useEffect(() => {
    const timer = setTimeout(async () => {`
);
app = app.replace(
    /\}\)\(\);\s*\}, \[\]\);/,
    `}, 1000);
    return () => clearTimeout(timer);
  }, []);`
);
fs.writeFileSync("apps/mobile/App.tsx", app, "utf8");
console.log("Added 1000ms delay to Location request");
