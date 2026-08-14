import { SearchQuery, NormalizedResult } from '@compareall/shared-types';
import { FoodProvider } from '../categories/FoodProvider';
import { createMockResult, calculateFinalPrice } from './mockUtils';

export class GenericFoodProvider extends FoodProvider {
  constructor(
    id: string, 
    name: string, 
    private baseDeliveryFee: number,
    private supportedKeywords: string[] = [], // if empty, matches anything
    private restrictedKeywords: string[] = [], // keywords that automatically reject
    private metroOnly: boolean = false
  ) {
    super(id, name);
  }

  async fetchFoodOptions(query: SearchQuery): Promise<NormalizedResult[]> {
    const term = query.term.toLowerCase();
    
    // Strict Location Mocking Logic
    if (query.location?.label) {
      const loc = query.location.label.toLowerCase();
      const isMetro = ['mumbai', 'delhi', 'bangalore', 'bengaluru', 'hyderabad', 'chennai', 'kolkata', 'pune', 'ahmedabad', 'gurugram', 'noida', 'gurgaon'].some(m => loc.includes(m));
      const isTier2 = ['chandigarh', 'jaipur', 'lucknow', 'indore', 'bhopal', 'kochi', 'patna', 'kanpur', 'nagpur', 'surat', 'visakhapatnam'].some(m => loc.includes(m));
      
      // If provider is marked as Metro Only, it ONLY shows in Metros
      if (this.metroOnly && !isMetro) {
        return [];
      }

      // If it's NOT metro only, but it's a small town (Tier 3+ like Daltonganj), 
      // we should ONLY allow Zomato, Swiggy, Dominos, and Train/Airport services.
      if (!isMetro && !isTier2) {
        const allowedAnywhere = ['food-zomato', 'food-swiggy', 'food-dominos', 'food-irctc', 'food-zoop', 'food-railrestro', 'food-travelkhana', 'food-tfs'];
        if (!allowedAnywhere.includes(this.config.id)) {
          return [];
        }
      }
    }

    // Check if query is explicitly restricted
    if (this.restrictedKeywords.length > 0 && this.restrictedKeywords.some(k => term.includes(k))) {
      return [];
    }

    // If provider has specific supported keywords, ensure query matches at least one (unless query is empty)
    if (this.supportedKeywords.length > 0 && term.trim() !== '') {
      const matches = this.supportedKeywords.some(k => term.includes(k));
      if (!matches && !term.includes(this.config.name.toLowerCase())) {
        return [];
      }
    }

    const isConnected = query.connectedProviders?.includes(this.config.id);
    
    // Mock Pricing Logic based on keywords to make results look realistic
    let basePrice = 250;
    if (term.includes('pizza')) basePrice = 350;
    if (term.includes('burger')) basePrice = 150;
    if (term.includes('biryani')) basePrice = 280;
    if (term.includes('cake') || term.includes('dessert')) basePrice = 450;
    if (term.includes('coffee') || term.includes('tea')) basePrice = 180;
    if (term.includes('salad') || term.includes('healthy')) basePrice = 300;
    
    const variation = (this.config.name.length * 17) % (basePrice * 0.2) - (basePrice * 0.1); 
    const finalPrice = Math.max(50, Math.floor(basePrice + variation));
    
    const deliveryFee = isConnected ? 0 : this.baseDeliveryFee;
    const discount = isConnected ? Math.floor(finalPrice * 0.1) : 0;
    
    await new Promise(r => setTimeout(r, 200 + Math.random() * 300));

    return [
      createMockResult(this.config.id, this.config.name, `${this.config.id}-1`, {
        title: `${query.term.charAt(0).toUpperCase() + query.term.slice(1) || 'Delicious Meal'}`,
        description: `Delivered by ${this.config.name}`,
        category: 'food',
        price: calculateFinalPrice(finalPrice, deliveryFee, 20, 0, discount, 0, 0),
        originalPrice: finalPrice,
        estimatedTimeMins: this.baseDeliveryFee < 20 ? 15 : 35, // Low fee = fast (quick commerce)
        rating: 3.5 + ((this.config.name.length % 15) / 10),
        accountBenefits: isConnected ? [`${this.config.name} Pro: Free Delivery`] : [],
        deepLinkUrl: `https://${this.config.name.toLowerCase().replace(/[^a-z]/g, '')}.com/search?q=${encodeURIComponent(term)}`
      })
    ];
  }
}

// Keyword groups
const trainKeywords = ['train', 'irctc', 'station', 'pnr'];
const airportKeywords = ['airport', 'flight', 'terminal'];
const pizzaKeywords = ['pizza', 'garlic bread'];
const burgerKeywords = ['burger', 'fries'];
const biryaniKeywords = ['biryani', 'kebab', 'thali', 'meal'];
const bakeryKeywords = ['cake', 'pastry', 'dessert', 'sweet', 'ice cream'];
const coffeeKeywords = ['coffee', 'tea', 'beverage', 'snack'];
const healthyKeywords = ['salad', 'healthy', 'diet', 'protein'];

const ZomatoProvider = new GenericFoodProvider('food-zomato', 'Zomato', 40, [], [...trainKeywords, ...airportKeywords]);
const SwiggyProvider = new GenericFoodProvider('food-swiggy', 'Swiggy', 40, [], [...trainKeywords, ...airportKeywords]);
const MagicpinProvider = new GenericFoodProvider('food-magicpin', 'Magicpin', 30, [], [], true);
const EatSureProvider = new GenericFoodProvider('food-eatsure', 'EatSure', 0, [], [], true);
// Hiding ONDC providers as requested
// const PincodeProvider = new GenericFoodProvider('food-pincode', 'Pincode (ONDC)', 20, [], [], true);
// const MystoreProvider = new GenericFoodProvider('food-mystore', 'Mystore (ONDC)', 25, [], [], true);
// const PaytmONDCProvider = new GenericFoodProvider('food-paytm-ondc', 'Paytm ONDC', 20, [], [], true);
// const OlaONDCProvider = new GenericFoodProvider('food-ola-ondc', 'Ola ONDC Food', 30, [], [], true);
// const SpiceMoneyProvider = new GenericFoodProvider('food-spicemoney', 'Spice Money', 25, [], [], true);

// 2. Direct Restaurant (Pizza & Burger)
const DominosProvider = new GenericFoodProvider('food-dominos', 'Domino\'s', 0, pizzaKeywords);
const PizzaHutProvider = new GenericFoodProvider('food-pizzahut', 'Pizza Hut', 30, pizzaKeywords);
const LaPinozProvider = new GenericFoodProvider('food-lapinoz', 'La Pino\'z Pizza', 20, pizzaKeywords);
const OvenStoryProvider = new GenericFoodProvider('food-ovenstory', 'OvenStory Pizza', 0, pizzaKeywords, [], true);
const MojoPizzaProvider = new GenericFoodProvider('food-mojopizza', 'MojoPizza', 25, pizzaKeywords, [], true);
const ChicagoPizzaProvider = new GenericFoodProvider('food-chicagopizza', 'Chicago Pizza', 40, pizzaKeywords, [], true);

const McDonaldsProvider = new GenericFoodProvider('food-mcdonalds', 'McDonald\'s', 40, burgerKeywords);
const BurgerKingProvider = new GenericFoodProvider('food-burgerking', 'Burger King', 35, burgerKeywords);
const KFCProvider = new GenericFoodProvider('food-kfc', 'KFC', 40, [...burgerKeywords, 'chicken']);
const SubwayProvider = new GenericFoodProvider('food-subway', 'Subway', 30, ['sub', 'sandwich', 'salad']);
const WendysProvider = new GenericFoodProvider('food-wendys', 'Wendy\'s', 40, burgerKeywords, [], true);

// 3. Indian / Biryani
const FaasosProvider = new GenericFoodProvider('food-faasos', 'Faasos', 0, ['wrap', 'roll', 'meal'], [], true);
const BehrouzProvider = new GenericFoodProvider('food-behrouz', 'Behrouz Biryani', 0, biryaniKeywords, [], true);
const BiryaniBluesProvider = new GenericFoodProvider('food-biryaniblues', 'Biryani Blues', 40, biryaniKeywords, [], true);
const BiryaniByKiloProvider = new GenericFoodProvider('food-bbk', 'Biryani By Kilo', 50, biryaniKeywords, [], true);
const Box8Provider = new GenericFoodProvider('food-box8', 'BOX8', 0, biryaniKeywords, [], true);
const HaldiramsProvider = new GenericFoodProvider('food-haldirams', 'Haldiram\'s', 30, ['thali', 'snack', 'sweet', 'chole']);

// 4. Bakery / Sweets
const MioAmoreProvider = new GenericFoodProvider('food-mioamore', 'Mio Amore', 20, bakeryKeywords);
const MonginisProvider = new GenericFoodProvider('food-monginis', 'Monginis', 30, bakeryKeywords);
const TheobromaProvider = new GenericFoodProvider('food-theobroma', 'Theobroma', 50, bakeryKeywords, [], true);
const BakingoProvider = new GenericFoodProvider('food-bakingo', 'Bakingo', 0, bakeryKeywords);
const BaskinRobbinsProvider = new GenericFoodProvider('food-baskin', 'Baskin-Robbins', 40, ['ice cream', 'dessert']);
const FNPProvider = new GenericFoodProvider('food-fnp', 'Ferns N Petals', 60, bakeryKeywords);

// 5. Coffee / Beverages
const StarbucksProvider = new GenericFoodProvider('food-starbucks', 'Starbucks', 50, coffeeKeywords, [], true);
const ChaayosProvider = new GenericFoodProvider('food-chaayos', 'Chaayos', 30, coffeeKeywords, [], true);
const ChaiPointProvider = new GenericFoodProvider('food-chaipoint', 'Chai Point', 30, coffeeKeywords, [], true);
const ThirdWaveProvider = new GenericFoodProvider('food-thirdwave', 'Third Wave Coffee', 40, coffeeKeywords, [], true);
const WowMomoProvider = new GenericFoodProvider('food-wowmomo', 'Wow! Momo', 20, ['momo', 'snack']);

// 6. Healthy / Diet
const EatFitProvider = new GenericFoodProvider('food-eatfit', 'EatFit', 0, healthyKeywords, [], true);
const FreshMenuProvider = new GenericFoodProvider('food-freshmenu', 'FreshMenu', 30, healthyKeywords, [], true);
const SaladDaysProvider = new GenericFoodProvider('food-saladdays', 'Salad Days', 40, healthyKeywords, [], true);
const CurefoodsProvider = new GenericFoodProvider('food-curefoods', 'Curefoods', 0, healthyKeywords, [], true);

// 7. Cloud-Kitchen (Aggregated above mostly, adding EatClub/Rebel)
const EatClubProvider = new GenericFoodProvider('food-eatclub', 'EatClub', 0, [], [], true); // Sells everything
const RebelFoodsProvider = new GenericFoodProvider('food-rebelfoods', 'Rebel Foods', 0, [], [], true); // Sells everything

// 8. Quick Food
const ZeptoCafeProvider = new GenericFoodProvider('food-zeptocafe', 'Zepto Cafe', 15, [], [], true);
const SwiggyBoltProvider = new GenericFoodProvider('food-swiggybolt', 'Swiggy Bolt', 15, [], [], true);
const BlinkitBistroProvider = new GenericFoodProvider('food-blinkitbistro', 'Blinkit Bistro', 15, [], [], true);
const SwishProvider = new GenericFoodProvider('food-swish', 'Swish', 10, [], [], true);
const ToingProvider = new GenericFoodProvider('food-toing', 'Toing', 10, [], [], true);

// 9. Train / Railway
const IrctcProvider = new GenericFoodProvider('food-irctc', 'IRCTC eCatering', 0, trainKeywords);
const ZoopProvider = new GenericFoodProvider('food-zoop', 'Zoop', 20, trainKeywords);
const RailRestroProvider = new GenericFoodProvider('food-railrestro', 'RailRestro', 30, trainKeywords);
const TravelkhanaProvider = new GenericFoodProvider('food-travelkhana', 'Travelkhana', 25, trainKeywords);

// 10. Airport Food
const TfsProvider = new GenericFoodProvider('food-tfs', 'Travel Food Services', 50, airportKeywords);

// 11. Regional
const ChowmanProvider = new GenericFoodProvider('food-chowman', 'Chowman', 40, ['chinese', 'noodle', 'rice']);
const YummyCloudProvider = new GenericFoodProvider('food-yummycloud', 'Yummy Cloud', 20);


export const extendedFoodProviders = [
  ZomatoProvider, SwiggyProvider, MagicpinProvider, EatSureProvider,
  
  DominosProvider, PizzaHutProvider, LaPinozProvider, OvenStoryProvider, MojoPizzaProvider, ChicagoPizzaProvider,
  McDonaldsProvider, BurgerKingProvider, KFCProvider, SubwayProvider, WendysProvider,
  
  FaasosProvider, BehrouzProvider, BiryaniBluesProvider, BiryaniByKiloProvider, Box8Provider, HaldiramsProvider,
  
  MioAmoreProvider, MonginisProvider, TheobromaProvider, BakingoProvider, BaskinRobbinsProvider, FNPProvider,
  
  StarbucksProvider, ChaayosProvider, ChaiPointProvider, ThirdWaveProvider, WowMomoProvider,
  
  EatFitProvider, FreshMenuProvider, SaladDaysProvider, CurefoodsProvider,
  
  EatClubProvider, RebelFoodsProvider,
  
  ZeptoCafeProvider, SwiggyBoltProvider, BlinkitBistroProvider, SwishProvider, ToingProvider,
  
  IrctcProvider, ZoopProvider, RailRestroProvider, TravelkhanaProvider,
  TfsProvider,
  
  ChowmanProvider, YummyCloudProvider
];
