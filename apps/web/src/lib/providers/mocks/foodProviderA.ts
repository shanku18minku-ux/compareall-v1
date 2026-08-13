import { ProviderAdapter, ProviderConfig, SearchQuery, NormalizedResult } from '@compareall/shared-types';

const config: ProviderConfig = {
  id: 'mock-food-a',
  name: 'Food Provider A (Z-Clone)',
  supportedCategories: ['food'],
  requiresAuth: false
};

export class FoodProviderA implements ProviderAdapter {
  config = config;

  async search(query: SearchQuery): Promise<NormalizedResult[]> {
    if (query.category !== 'food' && query.category !== undefined) {
      return [];
    }

    // Mocking network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Simple keyword matching for mock
    const term = query.term.toLowerCase();
    const results: NormalizedResult[] = [];

    if (term.includes('biryani') || term.includes('chicken')) {
      const basePrice = 300;
      const deliveryFee = 40;
      const platformFee = 15;
      const taxes = basePrice * 0.05; // 5% tax
      const discount = 50; // Flat discount
      const finalPrice = basePrice + deliveryFee + platformFee + taxes - discount;

      results.push({
        id: 'fpa-biryani-1',
        providerId: this.config.id,
        providerName: this.config.name,
        title: 'Chicken Dum Biryani',
        description: 'Authentic Hyderabadi chicken dum biryani, served with raita and salan.',
        imageUrl: 'https://via.placeholder.com/150?text=Biryani',
        category: 'food',
        status: 'LIVE',
        price: {
          basePrice,
          deliveryFee,
          platformFee,
          taxes,
          discount,
          finalPayablePrice: finalPrice,
          currency: 'INR'
        },
        isAvailable: true,
        estimatedTimeMins: 35,
        rating: 4.2,
        reviewCount: 1205,
        deepLinkUrl: 'https://example.com/food-a/biryani'
      });
    }

    if (term.includes('pizza') || term.includes('margherita')) {
      const basePrice = 250;
      const deliveryFee = 30;
      const platformFee = 10;
      const taxes = basePrice * 0.05;
      const discount = 0;
      const finalPrice = basePrice + deliveryFee + platformFee + taxes - discount;

      results.push({
        id: 'fpa-pizza-1',
        providerId: this.config.id,
        providerName: this.config.name,
        title: 'Margherita Pizza (Medium)',
        description: 'Classic delight with 100% real mozzarella cheese.',
        imageUrl: 'https://via.placeholder.com/150?text=Pizza',
        category: 'food',
        status: 'LIVE',
        price: {
          basePrice,
          deliveryFee,
          platformFee,
          taxes,
          discount,
          finalPayablePrice: finalPrice,
          currency: 'INR'
        },
        isAvailable: true,
        estimatedTimeMins: 25,
        rating: 4.0,
        reviewCount: 890,
        deepLinkUrl: 'https://example.com/food-a/pizza'
      });
    }

    return results;
  }
}

