const fs = require("fs");
let registry = fs.readFileSync("apps/mobile/src/lib/packets/registry.ts", "utf8");

registry = registry.replace(/import \{ ToingPacket \} from '\.\/food\/toing';\r?\n?/, "");
registry = registry.replace(/import \{ OwnlyPacket \} from '\.\/food\/ownly';\r?\n?/, "");
registry = registry.replace(/\s*normalize\(ToingPacket\),?\r?\n?/, "");
registry = registry.replace(/\s*normalize\(OwnlyPacket\),?\r?\n?/, "");

fs.writeFileSync("apps/mobile/src/lib/packets/registry.ts", registry, "utf8");
console.log("Removed Toing and Ownly from registry");
