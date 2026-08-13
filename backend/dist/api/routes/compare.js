"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const provider_manager_1 = require("../../providers/provider-manager");
const engine_1 = require("@compareall/engine");
const config_1 = require("../../config");
const router = (0, express_1.Router)();
router.post("/", async (req, res) => {
    try {
        const { query, category, location } = req.body;
        if (!query) {
            return res.status(400).json({
                success: false,
                data: null,
                error: { code: "INVALID_REQUEST", message: "Search query is required" }
            });
        }
        const providers = provider_manager_1.providerManager.getAllProviders();
        // Perform search via engine
        // Engine Signature: search(rawTerm, providers, location, sortOrder, filters, connectedProviderIds)
        const results = await engine_1.searchEngine.search(query, providers, location, "price_asc", undefined, // filters
        [] // connected providers logic can be passed by client later
        );
        res.json({
            success: true,
            dataSource: config_1.config.apiMode === 'live' ? "official" : "demo",
            isLive: config_1.config.apiMode === 'live',
            query,
            results,
            comparison: results.length > 0 ? {
                lowestPrice: results[0].lowestPrice ?? null,
                highestPrice: results[0].highestPrice ?? null,
                savings: results[0].savings ?? null,
                recommended: results[0].offers[0]?.providerId ?? null
            } : {
                lowestPrice: null,
                highestPrice: null,
                savings: null,
                recommended: null
            }
        });
    }
    catch (err) {
        console.error("Compare error:", err);
        res.status(500).json({
            success: false,
            data: null,
            error: { code: "INTERNAL_ERROR", message: "Failed to compare" }
        });
    }
});
exports.default = router;
