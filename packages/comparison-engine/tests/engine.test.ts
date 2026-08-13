import { searchEngine } from "../src/engine";
import { ProviderAdapter } from "@compareall/shared-types";

// Dummy provider
const p: ProviderAdapter = {
  config: { id: "test", name: "test", supportedCategories: ["electronics"], requiresAuth: false },
  search: async () => [{
    id: "1", providerId: "test", providerName: "test", title: "headphones", category: "electronics", status: "LIVE",
    price: { basePrice: 100, finalPayablePrice: 100, currency: "INR" },
    isAvailable: true, deepLinkUrl: "#", rating: 4, reviewCount: 10
  }]
};

async function run() {
  const res = await searchEngine.search("headphones", [p]);
  if (res.length !== 1) throw new Error("Expected 1 group");
  if (res[0].lowestPrice !== 100) throw new Error("Expected lowest price 100");
  if (res[0].savings !== 0) throw new Error("Expected 0 savings");
  console.log("Engine Test: PASS");
}
run();
