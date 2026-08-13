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
          reviewCount: Math.floor(Math.random() * 1000)
        }
      ];
    }
  };
}

export const demoProviders = [
  createDemoProvider("demo-electronics-a", "Demo Electronics Store A", 0, "electronics"),
  createDemoProvider("demo-electronics-b", "Demo Electronics Store B", -200, "electronics"),
  createDemoProvider("demo-electronics-c", "Demo Electronics Store C", -100, "electronics"),
  createDemoProvider("demo-food-a", "Demo Food Platform A", 50, "food"),
  createDemoProvider("demo-food-b", "Demo Food Platform B", -20, "food"),
];

