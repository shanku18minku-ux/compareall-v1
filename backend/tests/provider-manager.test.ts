import { providerManager } from "../src/providers/provider-manager";
import { demoProviders } from "../src/providers/demo";

describe('Provider Manager', () => {
  it('should register and retrieve demo providers', () => {
    // Clear and re-register
    demoProviders.forEach(p => providerManager.register(p));
    
    expect(providerManager.getAllProviders().length).toBeGreaterThanOrEqual(5);
    
    const electronics = providerManager.getProvidersByCategory("electronics");
    expect(electronics.length).toBe(3);
  });
});
