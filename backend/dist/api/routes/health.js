"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    res.json({
        success: true,
        service: "compareall-backend",
        status: "healthy",
        timestamp: new Date().toISOString()
    });
});
exports.default = router;
