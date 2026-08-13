import { ProviderAdapter, Category } from "@compareall/shared-types";

export class ProviderManager {
  private providers: Map<string, ProviderAdapter> = new Map();

  register(provider: ProviderAdapter) {
    this.providers.set(provider.config.id, provider);
  }

  getAllProviders(): ProviderAdapter[] {
    return Array.from(this.providers.values());
  }

  getProvidersByCategory(category: Category): ProviderAdapter[] {
    return this.getAllProviders().filter(p => p.config.supportedCategories.includes(category));
  }
}

export const providerManager = new ProviderManager();

