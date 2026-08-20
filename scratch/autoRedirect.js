const fs = require("fs");
let app = fs.readFileSync("apps/mobile/App.tsx", "utf8");

app = app.replace(
    /onSuccess=\{\(\) => \{\s*setConnectedProviders\(prev => \[\.\.\.prev, loginModal\.id\]\);\s*setLoginModal\(null\);\s*\}\}/,
    `onSuccess={() => {
                 setConnectedProviders(prev => [...prev, loginModal.id]);
                 setLoginModal(null);
                 setActiveTab('Search');
             }}`
);

fs.writeFileSync("apps/mobile/App.tsx", app, "utf8");
console.log("Auto-redirect to Search implemented");
