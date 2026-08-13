import { ProviderAdapter, ProviderConfig, SearchQuery, NormalizedResult } from '@compareall/shared-types';

const config: ProviderConfig = {
  id: 'mock-shopping-a',
  name: 'Shopping Provider A (A-Clone)',
  supportedCategories: ['shopping', 'electronics', 'fashion'],
  requiresAuth: false
};

export class ShoppingProviderA implements ProviderAdapter {
  config = config;

  async search(query: SearchQuery): Promise<NormalizedResult[]> {
    if (query.category && !this.config.supportedCategories.includes(query.category)) {
      return [];
    }
    await new Promise(resolve => setTimeout(resolve, 650));

    const results: NormalizedResult[] = [];
    const term = query.term.toLowerCase();
    
    if (term.includes('iphone') || term.includes('16')) {
      results.push({
        id: 'sha-iphone-1',
        providerId: this.config.id,
        providerName: this.config.name,
        title: 'Apple iPhone 16 (128GB) - Black',
        category: 'electronics',
        status: 'LIVE',
        price: { basePrice: 79900, deliveryFee: 0, finalPayablePrice: 79900, currency: 'INR' },
        isAvailable: true, estimatedTimeMins: 1440, // 24 hours
        deepLinkUrl: 'https://example.com/shopping-a/iphone16'
      });
    } else if (term.includes('nike') || term.includes('shoes')) {
      results.push({
        id: 'sha-shoes-1',
        providerId: this.config.id,
        providerName: this.config.name,
        title: 'Nike Men Air Zoom Pegasus',
        category: 'fashion',
        status: 'LIVE',
        price: { basePrice: 10495, discount: 1000, finalPayablePrice: 9495, currency: 'INR' },
        isAvailable: true, estimatedTimeMins: 2880, // 2 days
        deepLinkUrl: 'https://example.com/shopping-a/nike-shoes'
      });
    }
    return results;
  }
}

