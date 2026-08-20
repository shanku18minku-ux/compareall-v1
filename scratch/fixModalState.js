const fs = require("fs");
let modal = fs.readFileSync("apps/mobile/src/lib/UniversalCartModal.tsx", "utf8");
modal = modal.replace(
    /const \[detailBreakdown, setDetailBreakdown\] = useState\(null\);/,
    "const [detailBreakdown, setDetailBreakdown] = useState<string | null>(null);"
);
fs.writeFileSync("apps/mobile/src/lib/UniversalCartModal.tsx", modal, "utf8");
console.log("Fixed useState type");
