import { ProviderAdapter, ProviderConfig, SearchQuery, NormalizedResult } from '@compareall/shared-types';

const config: ProviderConfig = {
  id: 'mock-shopping-b',
  name: 'Shopping Provider B (F-Clone)',
  supportedCategories: ['shopping', 'electronics', 'fashion'],
  requiresAuth: false
};

export class ShoppingProviderB implements ProviderAdapter {
  config = config;

  async search(query: SearchQuery): Promise<NormalizedResult[]> {
    if (query.category && !this.config.supportedCategories.includes(query.category)) {
      return [];
    }
    await new Promise(resolve => setTimeout(resolve, 800));

    const results: NormalizedResult[] = [];
    const term = query.term.toLowerCase();
    
    if (term.includes('iphone') || term.includes('16')) {
      const isConnected = query.connectedProviders?.includes(this.config.id);
      const discount = isConnected ? 1500 : 0;
      
      results.push({
        id: 'shb-iphone-1',
        providerId: this.config.id,
        providerName: this.config.name,
        title: 'Apple iPhone 16 128GB Black',
        category: 'electronics',
        status: 'LIVE',
        price: { 
          basePrice: 79900, 
          deliveryFee: 50, 
          discount: discount,
          finalPayablePrice: 79900 + 50 - discount, 
          currency: 'INR' 
        },
        isAvailable: true, 
        estimatedTimeMins: 4320, // 3 days
        deepLinkUrl: 'https://example.com/shopping-b/iphone16',
        accountBenefits: isConnected ? ['[DEMO] ₹1500 Member Discount Applied'] : undefined
      });
    } else if (term.includes('nike') || term.includes('shoes')) {
      results.push({
        id: 'shb-shoes-1',
        providerId: this.config.id,
        providerName: this.config.name,
        title: 'Nike Air Zoom Pegasus 40 Men',
        category: 'fashion',
        status: 'LIVE',
        price: { 
          basePrice: 10495, 
          deliveryFee: 100, 
          finalPayablePrice: 10595, 
          currency: 'INR' 
        },
        isAvailable: true, 
        estimatedTimeMins: 1440, // 24 hours
        deepLinkUrl: 'https://example.com/shopping-b/nike-shoes'
      });
    }
    return results;
  }
}
