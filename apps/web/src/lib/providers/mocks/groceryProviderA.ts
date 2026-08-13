import { ProviderAdapter, ProviderConfig, SearchQuery, NormalizedResult } from '@compareall/shared-types';

const config: ProviderConfig = {
  id: 'mock-grocery-a',
  name: 'Grocery Provider A (B-Clone)',
  supportedCategories: ['grocery'],
  requiresAuth: false
};

export class GroceryProviderA implements ProviderAdapter {
  config = config;

  async search(query: SearchQuery): Promise<NormalizedResult[]> {
    if (query.category !== 'grocery' && query.category !== undefined) {
      return [];
    }
    await new Promise(resolve => setTimeout(resolve, 500));

    const results: NormalizedResult[] = [];
    if (query.term.toLowerCase().includes('milk') || query.term.toLowerCase().includes('grocery')) {
      results.push({
        id: 'gra-milk-1',
        providerId: this.config.id,
        providerName: this.config.name,
        title: 'Full Cream Milk 1L',
        category: 'grocery',
        status: 'LIVE',
        price: { basePrice: 66, deliveryFee: 15, finalPayablePrice: 81, currency: 'INR' },
        isAvailable: true, estimatedTimeMins: 10, deepLinkUrl: 'https://example.com/grocery-a/milk'
      });
    }
    return results;
  }
}

