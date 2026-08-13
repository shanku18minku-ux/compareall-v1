"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const provider_manager_1 = require("../../providers/provider-manager");
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    const providers = provider_manager_1.providerManager.getAllProviders().map(p => ({
        id: p.config.id,
        name: p.config.name,
        category: p.config.supportedCategories,
        dataSource: "demo",
        enabled: true
    }));
    res.json({ success: true, providers });
});
exports.default = router;
