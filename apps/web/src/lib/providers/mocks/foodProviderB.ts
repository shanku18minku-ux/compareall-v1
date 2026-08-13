import { ProviderAdapter, ProviderConfig, SearchQuery, NormalizedResult } from '@compareall/shared-types';

const config: ProviderConfig = {
  id: 'mock-food-b',
  name: 'Food Provider B (S-Clone)',
  supportedCategories: ['food'],
  requiresAuth: false
};

export class FoodProviderB implements ProviderAdapter {
  config = config;

  async search(query: SearchQuery): Promise<NormalizedResult[]> {
    if (query.category !== 'food' && query.category !== undefined) {
      return [];
    }

    await new Promise(resolve => setTimeout(resolve, 600));

    const term = query.term.toLowerCase();
    const results: NormalizedResult[] = [];

    if (term.includes('biryani') || term.includes('chicken')) {
      const basePrice = 310;
      const deliveryFee = 20; // Cheaper delivery
      const platformFee = 20;
      const taxes = basePrice * 0.05;
      const discount = 0; // No discount
      const finalPrice = basePrice + deliveryFee + platformFee + taxes - discount;

      results.push({
        id: 'fpb-biryani-1',
        providerId: this.config.id,
        providerName: this.config.name,
        title: 'Chicken Biryani Special',
        description: 'Special biryani with extra spices.',
        imageUrl: 'https://via.placeholder.com/150?text=Biryani+Special',
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
        estimatedTimeMins: 45, // Takes longer
        rating: 4.5,
        reviewCount: 300,
        deepLinkUrl: 'https://example.com/food-b/biryani'
      });
    }

    if (term.includes('pizza') || term.includes('margherita')) {
      const basePrice = 240;
      const deliveryFee = 25;
      const platformFee = 15;
      const taxes = basePrice * 0.05;
      const discount = 40;
      const finalPrice = basePrice + deliveryFee + platformFee + taxes - discount;

      results.push({
        id: 'fpb-pizza-1',
        providerId: this.config.id,
        providerName: this.config.name,
        title: 'Classic Margherita',
        description: 'Cheesy classic margherita pizza.',
        imageUrl: 'https://via.placeholder.com/150?text=Margherita',
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
        estimatedTimeMins: 30,
        rating: 3.8,
        reviewCount: 450,
        deepLinkUrl: 'https://example.com/food-b/pizza'
      });
    }

    return results;
  }
}

