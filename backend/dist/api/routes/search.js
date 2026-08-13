"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const provider_manager_1 = require("../../providers/provider-manager");
const engine_1 = require("@compareall/engine");
const router = (0, express_1.Router)();
router.post("/", async (req, res) => {
    try {
        const { query, category } = req.body;
        if (!query) {
            return res.status(400).json({
                success: false,
                data: null,
                error: { code: "INVALID_REQUEST", message: "Search query is required" }
            });
        }
        const providers = provider_manager_1.providerManager.getAllProviders();
        const results = await engine_1.searchEngine.search(query, providers, undefined, "price_asc");
        res.json({
            success: true,
            data: results,
            error: null
        });
    }
    catch (err) {
        console.error("Search error:", err);
        res.status(500).json({
            success: false,
            data: null,
            error: { code: "INTERNAL_ERROR", message: "Failed to search" }
        });
    }
});
exports.default = router;
