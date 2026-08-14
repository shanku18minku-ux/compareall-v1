import { ProviderAdapter, SearchQuery, NormalizedResult, ProviderConfig } from "@compareall/shared-types";

function createDemoProvider(id: string, name: string, priceOffset: number, category: any): ProviderAdapter {
  return {
    config: {
      id,
      name,
      supportedCategories: [category],
      requiresAuth: false
    },
    async search(query: SearchQuery): Promise<NormalizedResult[]> {
      const term = query.term.toLowerCase();
      
      // Delay to simulate network
      await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 100));

      let basePrice = 2999;
      if (term.includes("iphone")) basePrice = 79999;
      if (term.includes("biryani")) basePrice = 300;
      if (term.includes("pizza")) basePrice = 500;

      const finalPrice = basePrice + priceOffset;

      let restaurantName = "Famous Restaurant";
      if (term.includes("biryani")) restaurantName = "Behrouz Biryani";
      if (term.includes("pizza")) restaurantName = "Domino's Pizza";

      return [
        {
          id: `${id}-${term}-1`,
          providerId: id,
          providerName: name,
          title: query.term,
          category,
          status: "LIVE",
          isAvailable: true,
          price: {
            basePrice: finalPrice,
            finalPayablePrice: finalPrice,
            currency: "INR"
          },
          deepLinkUrl: "#",
          rating: 4.0 + (Math.random() * 1),
          reviewCount: Math.floor(Math.random() * 1000),
          rawMetadata: category === 'food' ? { restaurant: { name: restaurantName } } : undefined
        }
      ];
    }
  };
}

export const demoProviders = [
  createDemoProvider("demo-electronics-a", "Demo Electronics Store A", 0, "electronics"),
  createDemoProvider("demo-electronics-b", "Demo Electronics Store B", -200, "electronics"),
  createDemoProvider("demo-electronics-c", "Demo Electronics Store C", -100, "electronics"),
  createDemoProvider("zomato", "Zomato", 50, "food"),
  createDemoProvider("swiggy", "Swiggy", -20, "food"),
];

