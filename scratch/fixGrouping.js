const fs = require('fs');
let app = fs.readFileSync('apps/mobile/App.tsx', 'utf8');

app = app.replace(
    /let group = updated\.find\(g => norm\(g\.restaurantName\)\.includes\(restKey\) \|\| restKey\.includes\(norm\(g\.restaurantName\)\)\);/g,
    `let group = updated.find(g => {
        const gName = norm(g.restaurantName);
        if (!restKey || !gName) return false;
        return gName.includes(restKey) || restKey.includes(gName);
    });`
);

fs.writeFileSync('apps/mobile/App.tsx', app, 'utf8');
console.log("App.tsx grouping logic fixed");
