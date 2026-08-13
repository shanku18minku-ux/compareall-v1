import { ProviderAdapter, ProviderConfig, SearchQuery, NormalizedResult } from '@compareall/shared-types';

const config: ProviderConfig = {
  id: 'mock-cab-b',
  name: 'Cab Provider B (O-Clone)',
  supportedCategories: ['cab'],
  requiresAuth: false
};

export class CabProviderB implements ProviderAdapter {
  config = config;

  async search(query: SearchQuery): Promise<NormalizedResult[]> {
    if (query.category !== 'cab' && query.category !== undefined) {
      return [];
    }

    await new Promise(resolve => setTimeout(resolve, 700));

    const term = query.term.toLowerCase();
    const results: NormalizedResult[] = [];

    if (term.includes('airport') || term.includes('city') || term.includes('ride')) {
      const basePrice = 480;
      const taxes = basePrice * 0.18; 
      const discount = 30; // Promotional discount
      const finalPrice = basePrice + taxes - discount;

      results.push({
        id: 'cbb-ride-1',
        providerId: this.config.id,
        providerName: this.config.name,
        title: 'Micro Cab',
        description: 'Small cars for city rides.',
        category: 'cab',
        status: 'LIVE',
        price: {
          basePrice,
          taxes,
          discount,
          finalPayablePrice: finalPrice,
          currency: 'INR'
        },
        isAvailable: true,
        estimatedTimeMins: 12, // Further away
        rating: 4.1,
        deepLinkUrl: 'https://example.com/cab-b/book'
      });
    }

    return results;
  }
}

