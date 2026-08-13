"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.providerManager = exports.ProviderManager = void 0;
class ProviderManager {
    providers = new Map();
    register(provider) {
        this.providers.set(provider.config.id, provider);
    }
    getAllProviders() {
        return Array.from(this.providers.values());
    }
    getProvidersByCategory(category) {
        return this.getAllProviders().filter(p => p.config.supportedCategories.includes(category));
    }
}
exports.ProviderManager = ProviderManager;
exports.providerManager = new ProviderManager();
