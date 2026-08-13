import { ProviderAdapter, ProviderConfig, SearchQuery, NormalizedResult } from '@compareall/shared-types';

const config: ProviderConfig = {
  id: 'mock-cab-a',
  name: 'Cab Provider A (U-Clone)',
  supportedCategories: ['cab'],
  requiresAuth: false
};

export class CabProviderA implements ProviderAdapter {
  config = config;

  async search(query: SearchQuery): Promise<NormalizedResult[]> {
    if (query.category !== 'cab' && query.category !== undefined) {
      return [];
    }

    await new Promise(resolve => setTimeout(resolve, 900));

    const term = query.term.toLowerCase();
    const results: NormalizedResult[] = [];

    if (term.includes('airport') || term.includes('city') || term.includes('ride')) {
      const basePrice = 500;
      const taxes = basePrice * 0.18; // 18% GST for cabs in India typically
      const finalPrice = basePrice + taxes;

      results.push({
        id: 'cba-ride-1',
        providerId: this.config.id,
        providerName: this.config.name,
        title: 'Mini Cab',
        description: 'Affordable compact rides.',
        category: 'cab',
        status: 'LIVE',
        price: {
          basePrice,
          taxes,
          finalPayablePrice: finalPrice,
          currency: 'INR'
        },
        isAvailable: true,
        estimatedTimeMins: 5, // 5 mins away
        rating: 4.6,
        deepLinkUrl: 'https://example.com/cab-a/book'
      });
      
      const basePrice2 = 700;
      const taxes2 = basePrice2 * 0.18;
      
      results.push({
        id: 'cba-ride-2',
        providerId: this.config.id,
        providerName: this.config.name,
        title: 'Sedan Cab',
        description: 'Comfortable sedans for longer rides.',
        category: 'cab',
        status: 'LIVE',
        price: {
          basePrice: basePrice2,
          taxes: taxes2,
          finalPayablePrice: basePrice2 + taxes2,
          currency: 'INR'
        },
        isAvailable: true,
        estimatedTimeMins: 8,
        rating: 4.8,
        deepLinkUrl: 'https://example.com/cab-a/book-sedan'
      });
    }

    return results;
  }
}

