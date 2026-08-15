import { searchEngine } from './packages/comparison-engine/src/engine';
import { ShoppingProviderA, ShoppingProviderB } from './apps/web/src/lib/providers/mocks/mockProviders';
import { extendedShoppingProviders } from './apps/web/src/lib/providers/mocks/mockShoppingProviders';

const providers = [
  new ShoppingProviderA(),
  new ShoppingProviderB(),
  ...extendedShoppingProviders
];

async function run() {
  console.log("Searching for lipstick...");
  const results = await searchEngine.search("lipstick", providers, undefined, "price_asc", { category: "shopping" }, []);
  console.log("RESULTS LENGTH:", results.length);
  if (results.length > 0) {
    console.log("FIRST RESULT:", JSON.stringify(results[0], null, 2));
  }
}

run().catch(console.error);
