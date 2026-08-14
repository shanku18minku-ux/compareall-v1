import { MOCK_PROVIDERS } from '../apps/web/src/lib/providers/mocks';
import { searchEngine } from '@compareall/engine';

async function runTest() {
  console.log("==================================================");
  console.log("TEST CASE: Searching for 'Biryani' with Swiggy and Zomato CONNECTED");
  console.log("==================================================");
  
  const location = { address: "Mumbai, India", lat: 19.07, lng: 72.87 };
  const connectedProviders = ['food-a', 'food-b']; // Swiggy Clone and Zomato Clone

  const results = await searchEngine.search("biryani", MOCK_PROVIDERS, location, 'price_asc', {}, connectedProviders);
  
  if (results.length > 0) {
    results.forEach(group => {
      console.log(`\n🍽️  RESTAURANT/DISH: ${group.title}`);
      console.log(`   Best Price: ₹${group.lowestPrice} (You save ₹${group.savings})`);
      console.log(`   ---------------------------------------------`);
      group.offers.forEach(offer => {
        console.log(`    🟢 ${offer.providerName}:`);
        console.log(`       Final Price = ₹${offer.price.finalPayablePrice}, Base Price = ₹${offer.price.basePrice}`);
        if (offer.price.discount) {
           console.log(`       Discount Applied = ₹${offer.price.discount}`);
        }
        if (offer.accountBenefits && offer.accountBenefits.length > 0) {
          console.log(`       Account Benefits: ${offer.accountBenefits.join(', ')}`);
        }
      });
    });
  }
}

runTest().catch(console.error);
