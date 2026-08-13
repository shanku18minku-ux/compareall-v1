"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenvPkg = __importStar(require("dotenv"));
const health_1 = __importDefault(require("./api/routes/health"));
const providers_1 = __importDefault(require("./api/routes/providers"));
const compare_1 = __importDefault(require("./api/routes/compare"));
const search_1 = __importDefault(require("./api/routes/search"));
const location_1 = __importDefault(require("./api/routes/location"));
const provider_manager_1 = require("./providers/provider-manager");
const demo_1 = require("./providers/demo");
const config_1 = require("./config");
dotenvPkg.config();
if (config_1.config.apiMode === 'mock') {
    demo_1.demoProviders.forEach(p => provider_manager_1.providerManager.register(p));
    console.log(`[INIT] MOCK Mode Enabled: Registered ${demo_1.demoProviders.length} mock providers.`);
}
else {
    console.log(`[INIT] LIVE Mode Enabled: Awaiting live provider integrations.`);
}
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: "*" })); // In production, restrict this
app.use(express_1.default.json());
// Routes
app.use("/api/health", health_1.default);
app.use("/api/providers", providers_1.default);
app.use("/api/compare", compare_1.default);
app.use("/api/search", search_1.default);
app.use("/api/location", location_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({
        success: false,
        data: null,
        error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "An unexpected error occurred"
        }
    });
});
exports.default = app;
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`CompareAll Backend running on port ${PORT}`);
    });
}
