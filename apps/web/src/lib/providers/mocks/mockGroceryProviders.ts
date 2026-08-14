import { SearchQuery, NormalizedResult } from '@compareall/shared-types';
import { GroceryProvider } from '../categories/GroceryProvider';
import { createMockResult, calculateFinalPrice } from './mockUtils';

export class GenericGroceryProvider extends GroceryProvider {
  constructor(
    id: string, 
    name: string, 
    private baseDeliveryFee: number, 
    private supportedKeywords: string[] = [],
    private restrictedKeywords: string[] = [], // Keywords to reject (e.g. meat apps reject veg)
    private isB2B: boolean = false
  ) {
    super(id, name);
  }

  async fetchGroceryOptions(query: SearchQuery): Promise<NormalizedResult[]> {
    const term = query.term.toLowerCase();
    
    // Quick filtering
    if (this.restrictedKeywords.length > 0 && this.restrictedKeywords.some(k => term.includes(k))) {
       return [];
    }
    
    if (this.supportedKeywords.length > 0) {
       const matches = this.supportedKeywords.some(k => term.includes(k));
       if (!matches && !term.includes(this.config.name.toLowerCase())) {
         return [];
       }
    }

    const isConnected = query.connectedProviders?.includes(this.config.id);
    
    // Mock Pricing Logic
    let basePrice = 60;
    if (term.includes('milk')) basePrice = 30;
    if (term.includes('chicken') || term.includes('meat')) basePrice = 250;
    if (term.includes('apple') || term.includes('fruit')) basePrice = 150;
    if (term.includes('atta') || term.includes('rice')) basePrice = 400;
    
    // B2B platforms sell in bulk
    let quantityText = '1 unit';
    if (this.isB2B) {
      basePrice = basePrice * 10;
      quantityText = '10 Kg / Bulk';
    } else if (term.includes('milk')) {
      quantityText = '500 ml';
    } else if (term.includes('chicken')) {
      quantityText = '500 g';
    } else if (term.includes('apple')) {
      quantityText = '1 Kg';
    } else if (term.includes('atta')) {
      quantityText = '5 Kg';
    }
    
    const variation = (this.config.name.length * 13) % (basePrice * 0.2) - (basePrice * 0.1); 
    const finalPrice = Math.max(10, Math.floor(basePrice + variation));
    
    const deliveryFee = isConnected ? 0 : this.baseDeliveryFee;
    const discount = isConnected ? Math.floor(finalPrice * 0.1) : 0;
    
    await new Promise(r => setTimeout(r, 150 + Math.random() * 300));

    return [
      createMockResult(this.config.id, this.config.name, `${this.config.id}-1`, {
        title: `${query.term.charAt(0).toUpperCase() + query.term.slice(1)}`,
        description: this.isB2B ? 'Wholesale Price' : 'Fresh Delivery',
        category: 'grocery',
        price: calculateFinalPrice(finalPrice, deliveryFee, 5, 0, discount, 0, 0),
        originalPrice: Math.floor(finalPrice * 1.1),
        estimatedTimeMins: this.baseDeliveryFee > 20 ? 120 : 15, // High fee = scheduled, low fee = quick
        rating: 4.0 + ((this.config.name.length % 10) / 10),
        brand: 'Generic',
        quantity: this.isB2B ? 10 : 1,
        size: quantityText,
        accountBenefits: isConnected ? [`${this.config.name} Saved: Free Delivery & Member Price`] : [],
        deepLinkUrl: `https://${this.config.name.toLowerCase().replace(/[^a-z]/g, '')}.com/search?q=${encodeURIComponent(term)}`
      })
    ];
  }
}

// 1. Major National Platforms
export const BlinkitProvider = new GenericGroceryProvider('groc-blinkit', 'Blinkit', 15);
export const ZeptoProvider = new GenericGroceryProvider('groc-zepto', 'Zepto', 15);
export const SwiggyInstamartProvider = new GenericGroceryProvider('groc-instamart', 'Swiggy Instamart', 20);
export const BigBasketProvider = new GenericGroceryProvider('groc-bigbasket', 'BigBasket', 50);
export const BBNowProvider = new GenericGroceryProvider('groc-bbnow', 'BB Now', 15);
export const JioMartProvider = new GenericGroceryProvider('groc-jiomart', 'JioMart', 0);
export const AmazonFreshProvider = new GenericGroceryProvider('groc-amazon-fresh', 'Amazon Fresh', 40);
export const FlipkartGroceryProvider = new GenericGroceryProvider('groc-flipkart-groc', 'Flipkart Grocery', 50);
export const FlipkartMinutesProvider = new GenericGroceryProvider('groc-flipkart-min', 'Flipkart Minutes', 25);
export const DMartReadyProvider = new GenericGroceryProvider('groc-dmart', 'DMart Ready', 50);
export const TataNeuProvider = new GenericGroceryProvider('groc-tataneu', 'Tata Neu', 40);

// 2. Supermarket / Scheduled
export const SpencersProvider = new GenericGroceryProvider('groc-spencers', 'Spencer\'s', 50);
export const StarQuikProvider = new GenericGroceryProvider('groc-starquik', 'StarQuik', 40);
export const NaturesBasketProvider = new GenericGroceryProvider('groc-naturesbasket', 'Nature\'s Basket', 100);
export const RelianceSmartProvider = new GenericGroceryProvider('groc-reliancesmart', 'Reliance Smart', 30);
export const MoreRetailProvider = new GenericGroceryProvider('groc-more', 'More Retail', 40);

// 3. Milk & Daily Essentials
const milkKeywords = ['milk', 'curd', 'bread', 'butter', 'paneer', 'egg', 'coconut'];
export const MilkbasketProvider = new GenericGroceryProvider('groc-milkbasket', 'Milkbasket', 0, milkKeywords);
export const CountryDelightProvider = new GenericGroceryProvider('groc-countrydelight', 'Country Delight', 0, milkKeywords);
export const BBDailyProvider = new GenericGroceryProvider('groc-bbdaily', 'BB Daily', 0, milkKeywords);
export const SuprDailyProvider = new GenericGroceryProvider('groc-suprdaily', 'Supr Daily', 0, milkKeywords);
export const AkshayakalpaProvider = new GenericGroceryProvider('groc-akshayakalpa', 'Akshayakalpa', 0, milkKeywords);

// 4. Fresh, Meat & Organic
const meatKeywords = ['chicken', 'mutton', 'fish', 'prawn', 'meat'];
const freshKeywords = ['apple', 'banana', 'tomato', 'onion', 'potato', 'veg', 'fruit'];
export const OtipyProvider = new GenericGroceryProvider('groc-otipy', 'Otipy', 20, freshKeywords);
export const FreshToHomeProvider = new GenericGroceryProvider('groc-freshtohome', 'FreshToHome', 30, [...meatKeywords, ...freshKeywords]);
export const LiciousProvider = new GenericGroceryProvider('groc-licious', 'Licious', 40, meatKeywords);
export const MeatigoProvider = new GenericGroceryProvider('groc-meatigo', 'Meatigo', 50, meatKeywords);
export const TenderCutsProvider = new GenericGroceryProvider('groc-tendercuts', 'TenderCuts', 35, meatKeywords);

export const OrganicTattvaProvider = new GenericGroceryProvider('groc-organictattva', 'Organic Tattva', 50, ['organic', 'atta', 'dal', 'rice']);
export const Mantra24Provider = new GenericGroceryProvider('groc-24mantra', '24 Mantra Organic', 50, ['organic', 'atta', 'dal', 'rice']);

// 5. ONDC Ecosystem
export const PincodeProvider = new GenericGroceryProvider('groc-pincode', 'Pincode (ONDC)', 10);
export const PaytmONDCProvider = new GenericGroceryProvider('groc-paytmondc', 'Paytm (ONDC)', 20);
export const MystoreProvider = new GenericGroceryProvider('groc-mystore', 'Mystore (ONDC)', 30);

// 6. B2B / Wholesale
export const UdaanProvider = new GenericGroceryProvider('groc-udaan', 'Udaan (B2B)', 100, [], [], true);
export const JumbotailProvider = new GenericGroceryProvider('groc-jumbotail', 'Jumbotail (B2B)', 100, [], [], true);
export const NinjacartProvider = new GenericGroceryProvider('groc-ninjacart', 'Ninjacart (B2B)', 100, freshKeywords, [], true);

// Export all
export const extendedGroceryProviders = [
  BlinkitProvider, ZeptoProvider, SwiggyInstamartProvider, BigBasketProvider, BBNowProvider,
  JioMartProvider, AmazonFreshProvider, FlipkartGroceryProvider, FlipkartMinutesProvider,
  DMartReadyProvider, TataNeuProvider, SpencersProvider, StarQuikProvider, NaturesBasketProvider,
  RelianceSmartProvider, MoreRetailProvider, MilkbasketProvider, CountryDelightProvider,
  BBDailyProvider, SuprDailyProvider, AkshayakalpaProvider, OtipyProvider, FreshToHomeProvider,
  LiciousProvider, MeatigoProvider, TenderCutsProvider, OrganicTattvaProvider, Mantra24Provider,
  PincodeProvider, PaytmONDCProvider, MystoreProvider, UdaanProvider, JumbotailProvider, NinjacartProvider
];
