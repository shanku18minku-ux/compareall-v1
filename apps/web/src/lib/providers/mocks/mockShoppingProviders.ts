import { SearchQuery, NormalizedResult } from '@compareall/shared-types';
import { ShoppingProvider } from '../categories/ShoppingProvider';
import { createMockResult, calculateFinalPrice } from './mockUtils';

export class GenericShoppingProvider extends ShoppingProvider {
  constructor(
    id: string, 
    name: string, 
    private baseDeliveryFee: number,
    private supportedKeywords: string[] = [] // if empty, matches anything (used for Amazon, Flipkart)
  ) {
    super(id, name);
  }

  async fetchShoppingOptions(query: SearchQuery): Promise<NormalizedResult[]> {
    const term = query.term.toLowerCase();
    
    // Keyword Matching
    if (this.supportedKeywords.length > 0 && term.trim() !== '') {
      const matches = this.supportedKeywords.some(k => term.includes(k));
      if (!matches && !term.includes(this.config.name.toLowerCase())) {
        return [];
      }
    }

    const isConnected = query.connectedProviders?.includes(this.config.id);
    
    // Mock Pricing Logic based on keywords
    let basePrice = 999;
    if (term.includes('phone') || term.includes('laptop') || term.includes('tv')) basePrice = 45000;
    if (term.includes('shirt') || term.includes('jeans') || term.includes('dress') || term.includes('shoe')) basePrice = 1499;
    if (term.includes('makeup') || term.includes('lipstick') || term.includes('cream')) basePrice = 899;
    if (term.includes('bed') || term.includes('sofa') || term.includes('table')) basePrice = 15000;
    if (term.includes('toy') || term.includes('baby')) basePrice = 1200;
    if (term.includes('jewel') || term.includes('gold')) basePrice = 35000;
    if (term.includes('book')) basePrice = 499;
    if (term.includes('game')) basePrice = 2999;
    
    const variation = (this.config.name.length * 73) % (basePrice * 0.2) - (basePrice * 0.1); 
    const finalPrice = Math.max(99, Math.floor(basePrice + variation));
    
    const deliveryFee = isConnected ? 0 : this.baseDeliveryFee;
    const discount = isConnected ? Math.floor(finalPrice * 0.1) : 0;
    
    await new Promise(r => setTimeout(r, 200 + Math.random() * 300));

    return [
      createMockResult(this.config.id, this.config.name, `${this.config.id}-1`, {
        title: `${query.term.charAt(0).toUpperCase() + query.term.slice(1) || 'Amazing Product'}`,
        description: `Sold by ${this.config.name}`,
        category: 'shopping',
        price: calculateFinalPrice(finalPrice, deliveryFee, 0, 0, discount, 0, 0),
        originalPrice: finalPrice,
        estimatedTimeMins: this.baseDeliveryFee < 30 ? 15 : (this.baseDeliveryFee === 40 ? 4320 : 2880), // 3 days vs 2 days
        rating: 3.5 + ((this.config.name.length % 15) / 10),
        accountBenefits: isConnected ? [`${this.config.name} Member: Free Delivery`] : [],
        deepLinkUrl: `https://${this.config.name.toLowerCase().replace(/[^a-z]/g, '')}.com/search?q=${encodeURIComponent(term)}`
      })
    ];
  }
}

// Keyword groups
const fashionKeywords = ['shirt', 'tshirt', 'jeans', 'dress', 'pant', 'wear', 'cloth', 'jacket', 'fashion'];
const shoeKeywords = ['shoe', 'sneaker', 'sandal', 'boot', 'footwear', 'heel'];
const beautyKeywords = ['makeup', 'lipstick', 'cream', 'lotion', 'skin', 'beauty', 'hair', 'perfume', 'cosmetic'];
const electronicKeywords = ['phone', 'mobile', 'laptop', 'tablet', 'tv', 'earphone', 'headphone', 'watch', 'electronic', 'charger'];
const computerKeywords = ['laptop', 'pc', 'mouse', 'keyboard', 'monitor', 'drive', 'computer'];
const applianceKeywords = ['tv', 'fridge', 'ac', 'washing machine', 'cooler', 'appliance'];
const furnitureKeywords = ['bed', 'sofa', 'chair', 'table', 'furniture', 'mattress', 'desk'];
const decorKeywords = ['decor', 'lamp', 'cushion', 'curtain', 'vase'];
const kitchenKeywords = ['cookware', 'pan', 'pot', 'bottle', 'kitchen', 'utensil', 'mixer'];
const mattressKeywords = ['mattress', 'pillow', 'bedding'];
const kidsKeywords = ['toy', 'baby', 'diaper', 'kid', 'children', 'game'];
const jewelKeywords = ['jewel', 'ring', 'necklace', 'gold', 'silver', 'diamond', 'earring'];
const eyewearKeywords = ['glass', 'spectacle', 'sunglass', 'lens', 'eye'];
const bagsKeywords = ['bag', 'luggage', 'backpack', 'suitcase', 'wallet', 'purse'];
const sportsKeywords = ['sport', 'bat', 'ball', 'fitness', 'gym', 'dumbell', 'shoe'];
const autoKeywords = ['car accessory', 'helmet', 'tyre', 'bike accessory'];
const toolKeywords = ['tool', 'drill', 'hardware', 'industrial', 'safety'];
const bookKeywords = ['book', 'novel', 'stationery', 'pen', 'notebook'];
const gameKeywords = ['game', 'console', 'playstation', 'xbox', 'controller'];
const petKeywords = ['pet', 'dog', 'cat', 'food', 'collar'];
const plantKeywords = ['plant', 'seed', 'pot', 'garden'];

// 1. General (No keywords = matches all)
const AmazonProvider = new GenericShoppingProvider('shop-amazon', 'Amazon', 40);
const FlipkartProvider = new GenericShoppingProvider('shop-flipkart', 'Flipkart', 40);
const MeeshoProvider = new GenericShoppingProvider('shop-meesho', 'Meesho', 0);
const SnapdealProvider = new GenericShoppingProvider('shop-snapdeal', 'Snapdeal', 0);
const ShopcluesProvider = new GenericShoppingProvider('shop-shopclues', 'ShopClues', 30);
const JioMartProvider = new GenericShoppingProvider('shop-jiomart', 'JioMart', 0);
const TataNeuProvider = new GenericShoppingProvider('shop-tataneu', 'Tata Neu', 0);
const TataCliqProvider = new GenericShoppingProvider('shop-tatacliq', 'Tata CLiQ', 50);
const ShopsyProvider = new GenericShoppingProvider('shop-shopsy', 'Shopsy', 0);

// 2. Fashion
const MyntraProvider = new GenericShoppingProvider('shop-myntra', 'Myntra', 50, [...fashionKeywords, ...shoeKeywords]);
const AjioProvider = new GenericShoppingProvider('shop-ajio', 'AJIO', 50, [...fashionKeywords, ...shoeKeywords]);
const NykaaFashionProvider = new GenericShoppingProvider('shop-nykaafashion', 'Nykaa Fashion', 50, fashionKeywords);
const UrbanicProvider = new GenericShoppingProvider('shop-urbanic', 'Urbanic', 50, fashionKeywords);
const HMProvider = new GenericShoppingProvider('shop-hm', 'H&M', 100, fashionKeywords);
const ZaraProvider = new GenericShoppingProvider('shop-zara', 'Zara', 150, fashionKeywords);
const WestsideProvider = new GenericShoppingProvider('shop-westside', 'Westside', 50, fashionKeywords);
const PantaloonsProvider = new GenericShoppingProvider('shop-pantaloons', 'Pantaloons', 50, fashionKeywords);
const ShoppersStopProvider = new GenericShoppingProvider('shop-shoppersstop', 'Shoppers Stop', 50, fashionKeywords);
const MaxFashionProvider = new GenericShoppingProvider('shop-max', 'Max Fashion', 50, fashionKeywords);

// 3. Shoes
const BataProvider = new GenericShoppingProvider('shop-bata', 'Bata', 50, shoeKeywords);
const MetroShoesProvider = new GenericShoppingProvider('shop-metro', 'Metro Shoes', 50, shoeKeywords);
const WoodlandProvider = new GenericShoppingProvider('shop-woodland', 'Woodland', 50, shoeKeywords);
const RedTapeProvider = new GenericShoppingProvider('shop-redtape', 'Red Tape', 50, shoeKeywords);
const CampusProvider = new GenericShoppingProvider('shop-campus', 'Campus', 50, shoeKeywords);
const PumaProvider = new GenericShoppingProvider('shop-puma', 'Puma', 0, shoeKeywords);
const AdidasProvider = new GenericShoppingProvider('shop-adidas', 'Adidas', 0, shoeKeywords);
const NikeProvider = new GenericShoppingProvider('shop-nike', 'Nike', 0, shoeKeywords);

// 4. Beauty
const NykaaProvider = new GenericShoppingProvider('shop-nykaa', 'Nykaa', 50, beautyKeywords);
const PurplleProvider = new GenericShoppingProvider('shop-purplle', 'Purplle', 40, beautyKeywords);
const TiraProvider = new GenericShoppingProvider('shop-tira', 'Tira', 50, beautyKeywords);
const SephoraProvider = new GenericShoppingProvider('shop-sephora', 'Sephora', 100, beautyKeywords);
const SugarProvider = new GenericShoppingProvider('shop-sugar', 'Sugar Cosmetics', 50, beautyKeywords);
const MamaearthProvider = new GenericShoppingProvider('shop-mamaearth', 'Mamaearth', 40, beautyKeywords);
const PlumProvider = new GenericShoppingProvider('shop-plum', 'Plum', 40, beautyKeywords);

// 5. Electronics & Computers
const CromaProvider = new GenericShoppingProvider('shop-croma', 'Croma', 0, [...electronicKeywords, ...computerKeywords, ...applianceKeywords]);
const RelianceDigitalProvider = new GenericShoppingProvider('shop-reliancedigital', 'Reliance Digital', 0, [...electronicKeywords, ...computerKeywords, ...applianceKeywords]);
const VijaySalesProvider = new GenericShoppingProvider('shop-vijaysales', 'Vijay Sales', 0, [...electronicKeywords, ...applianceKeywords]);
const AppleProvider = new GenericShoppingProvider('shop-apple', 'Apple', 0, electronicKeywords);
const SamsungProvider = new GenericShoppingProvider('shop-samsung', 'Samsung', 0, [...electronicKeywords, ...applianceKeywords]);
const DellProvider = new GenericShoppingProvider('shop-dell', 'Dell', 0, computerKeywords);
const LenovoProvider = new GenericShoppingProvider('shop-lenovo', 'Lenovo', 0, computerKeywords);
const AsusProvider = new GenericShoppingProvider('shop-asus', 'ASUS', 0, computerKeywords);
const LgProvider = new GenericShoppingProvider('shop-lg', 'LG', 0, applianceKeywords);

// 8. Furniture & Home
const PepperfryProvider = new GenericShoppingProvider('shop-pepperfry', 'Pepperfry', 500, [...furnitureKeywords, ...decorKeywords]);
const UrbanLadderProvider = new GenericShoppingProvider('shop-urbanladder', 'Urban Ladder', 500, [...furnitureKeywords, ...decorKeywords]);
const IkeaProvider = new GenericShoppingProvider('shop-ikea', 'IKEA', 300, [...furnitureKeywords, ...decorKeywords, ...kitchenKeywords]);
const HomeCentreProvider = new GenericShoppingProvider('shop-homecentre', 'Home Centre', 200, [...furnitureKeywords, ...decorKeywords]);
const WakefitProvider = new GenericShoppingProvider('shop-wakefit', 'Wakefit', 0, [...furnitureKeywords, ...mattressKeywords]);
const WoodenStreetProvider = new GenericShoppingProvider('shop-woodenstreet', 'WoodenStreet', 0, furnitureKeywords);
const SleepyCatProvider = new GenericShoppingProvider('shop-sleepycat', 'SleepyCat', 0, mattressKeywords);

// 12. Kids
const FirstCryProvider = new GenericShoppingProvider('shop-firstcry', 'FirstCry', 50, kidsKeywords);
const HopscotchProvider = new GenericShoppingProvider('shop-hopscotch', 'Hopscotch', 50, kidsKeywords);
const MothercareProvider = new GenericShoppingProvider('shop-mothercare', 'Mothercare', 100, kidsKeywords);

// 13. Jewellery
const TanishqProvider = new GenericShoppingProvider('shop-tanishq', 'Tanishq', 0, jewelKeywords);
const CaratLaneProvider = new GenericShoppingProvider('shop-caratlane', 'CaratLane', 0, jewelKeywords);
const BluestoneProvider = new GenericShoppingProvider('shop-bluestone', 'Bluestone', 0, jewelKeywords);
const KalyanProvider = new GenericShoppingProvider('shop-kalyan', 'Kalyan Jewellers', 0, jewelKeywords);

// 14. Eyewear
const LenskartProvider = new GenericShoppingProvider('shop-lenskart', 'Lenskart', 0, eyewearKeywords);
const TitanEyeProvider = new GenericShoppingProvider('shop-titaneye', 'Titan Eye+', 0, eyewearKeywords);

// 15. Bags
const SafariProvider = new GenericShoppingProvider('shop-safari', 'Safari', 0, bagsKeywords);
const AmericanTouristerProvider = new GenericShoppingProvider('shop-americantourister', 'American Tourister', 0, bagsKeywords);
const MokobaraProvider = new GenericShoppingProvider('shop-mokobara', 'Mokobara', 0, bagsKeywords);
const DailyObjectsProvider = new GenericShoppingProvider('shop-dailyobjects', 'DailyObjects', 0, bagsKeywords);

// 16. Sports
const DecathlonProvider = new GenericShoppingProvider('shop-decathlon', 'Decathlon', 50, sportsKeywords);

// 18. Tools / B2B
const IndiaMartProvider = new GenericShoppingProvider('shop-indiamart', 'IndiaMART', 0, toolKeywords);
const MoglixProvider = new GenericShoppingProvider('shop-moglix', 'Moglix', 0, toolKeywords);
const UdaanProvider = new GenericShoppingProvider('shop-udaan', 'Udaan', 0, toolKeywords);

// 19. Books
const CrosswordProvider = new GenericShoppingProvider('shop-crossword', 'Crossword', 50, bookKeywords);

// 20. Gaming
const GamesTheShopProvider = new GenericShoppingProvider('shop-gamestheshop', 'Games The Shop', 50, gameKeywords);
const SteamProvider = new GenericShoppingProvider('shop-steam', 'Steam', 0, gameKeywords);

// 21. Pets
const HuftProvider = new GenericShoppingProvider('shop-huft', 'Heads Up For Tails', 50, petKeywords);
const SupertailsProvider = new GenericShoppingProvider('shop-supertails', 'Supertails', 0, petKeywords);

// 22. Garden
const UgaooProvider = new GenericShoppingProvider('shop-ugaoo', 'Ugaoo', 50, plantKeywords);


export const extendedShoppingProviders = [
  // General
  AmazonProvider, FlipkartProvider, MeeshoProvider, SnapdealProvider, ShopcluesProvider,
  JioMartProvider, TataNeuProvider, TataCliqProvider, ShopsyProvider,
  
  // Fashion
  MyntraProvider, AjioProvider, NykaaFashionProvider, UrbanicProvider, HMProvider, ZaraProvider,
  WestsideProvider, PantaloonsProvider, ShoppersStopProvider, MaxFashionProvider,
  
  // Shoes
  BataProvider, MetroShoesProvider, WoodlandProvider, RedTapeProvider, CampusProvider,
  PumaProvider, AdidasProvider, NikeProvider,
  
  // Beauty
  NykaaProvider, PurplleProvider, TiraProvider, SephoraProvider, SugarProvider, MamaearthProvider, PlumProvider,
  
  // Electronics
  CromaProvider, RelianceDigitalProvider, VijaySalesProvider, AppleProvider, SamsungProvider,
  DellProvider, LenovoProvider, AsusProvider, LgProvider,
  
  // Furniture & Home
  PepperfryProvider, UrbanLadderProvider, IkeaProvider, HomeCentreProvider, WakefitProvider,
  WoodenStreetProvider, SleepyCatProvider,
  
  // Kids
  FirstCryProvider, HopscotchProvider, MothercareProvider,
  
  // Jewel
  TanishqProvider, CaratLaneProvider, BluestoneProvider, KalyanProvider,
  
  // Eye
  LenskartProvider, TitanEyeProvider,
  
  // Bags
  SafariProvider, AmericanTouristerProvider, MokobaraProvider, DailyObjectsProvider,
  
  // Niche
  DecathlonProvider, IndiaMartProvider, MoglixProvider, UdaanProvider,
  CrosswordProvider, GamesTheShopProvider, SteamProvider,
  HuftProvider, SupertailsProvider, UgaooProvider
];
