import { SearchQuery, NormalizedResult } from '@compareall/shared-types';
import { ProviderAdapter } from '@compareall/shared-types';
import { createMockResult, calculateFinalPrice } from './mockUtils';

export class GenericMedicineProvider implements ProviderAdapter {
  config = {
    id: '',
    name: '',
    supportedCategories: ['medicine' as any],
    requiresAuth: true
  };

  constructor(
    id: string, 
    name: string, 
    private baseDeliveryFee: number
  ) {
    this.config.id = id;
    this.config.name = name;
  }

  async search(query: SearchQuery): Promise<NormalizedResult[]> {
    if (query.category && query.category !== 'medicine') return [];
    
    const term = query.term.toLowerCase();
    
    const isConnected = query.connectedProviders?.includes(this.config.id);
    
    // Mock Pricing Logic based on keywords
    let basePrice = 150;
    if (term.includes('protein') || term.includes('whey')) basePrice = 2500;
    if (term.includes('sugar') || term.includes('machine') || term.includes('bp')) basePrice = 1200;
    if (term.includes('syrup') || term.includes('cough')) basePrice = 120;
    if (term.includes('vitamin') || term.includes('zinc')) basePrice = 350;
    
    const variation = (this.config.name.length * 73) % (basePrice * 0.15) - (basePrice * 0.05); 
    const finalPrice = Math.max(10, Math.floor(basePrice + variation));
    
    const deliveryFee = isConnected ? 0 : this.baseDeliveryFee;
    const discount = isConnected ? Math.floor(finalPrice * 0.15) : 0;
    
    await new Promise(r => setTimeout(r, 200 + Math.random() * 300));

    return [
      createMockResult(this.config.id, this.config.name, `${this.config.id}-1`, {
        title: `${query.term.charAt(0).toUpperCase() + query.term.slice(1) || 'Medicine/Supplement'}`,
        description: `Delivered by ${this.config.name}`,
        category: 'medicine' as any,
        price: calculateFinalPrice(finalPrice, deliveryFee, 0, 0, discount, 0, 0),
        originalPrice: finalPrice,
        estimatedTimeMins: this.baseDeliveryFee < 30 ? 60 : 1440, // 1 hour vs next day
        rating: 4.0 + ((this.config.name.length % 10) / 10),
        accountBenefits: isConnected ? [`${this.config.name} Member: 15% Off + Free Delivery`] : [],
        deepLinkUrl: `https://${this.config.name.toLowerCase().replace(/[^a-z]/g, '')}.com/search?q=${encodeURIComponent(term)}`
      })
    ];
  }
}

// 1. National Pharmacies
const Apollo247Provider = new GenericMedicineProvider('med-apollo', 'Apollo 24|7', 49);
const NetmedsProvider = new GenericMedicineProvider('med-netmeds', 'Netmeds', 50);
const Tata1mgProvider = new GenericMedicineProvider('med-1mg', 'Tata 1mg', 50);
const PharmEasyProvider = new GenericMedicineProvider('med-pharmeasy', 'PharmEasy', 40);
const FlipkartHealthProvider = new GenericMedicineProvider('med-flipkarthealth', 'Flipkart Health+', 40);
const AmazonPharmacyProvider = new GenericMedicineProvider('med-amazonpharmacy', 'Amazon Pharmacy', 0);
const MedPlusProvider = new GenericMedicineProvider('med-medplus', 'MedPlus', 40);

// 2. Generic Medicine Platforms
const TruemedsProvider = new GenericMedicineProvider('med-truemeds', 'Truemeds', 30);
const GenericartProvider = new GenericMedicineProvider('med-genericart', 'Genericart', 30);
const DavaindiaProvider = new GenericMedicineProvider('med-davaindia', 'Davaindia', 30);
const MedkartProvider = new GenericMedicineProvider('med-medkart', 'Medkart', 30);
const GenericAadhaarProvider = new GenericMedicineProvider('med-genericaadhaar', 'Generic Aadhaar', 30);
const ZenericsProvider = new GenericMedicineProvider('med-zenerics', 'Zenerics', 30);
const PharmarackProvider = new GenericMedicineProvider('med-pharmarack', 'Pharmarack', 30);
const PlatinumRxProvider = new GenericMedicineProvider('med-platinumrx', 'PlatinumRx', 30);
const SastaSundarProvider = new GenericMedicineProvider('med-sastasundar', 'SastaSundar', 30);
const HealthmugProvider = new GenericMedicineProvider('med-healthmug', 'Healthmug', 30);
const PharmacyBazarProvider = new GenericMedicineProvider('med-pharmacybazar', 'Pharmacy Bazar', 30);
const PositraRxProvider = new GenericMedicineProvider('med-positrarx', 'Positra Rx', 30);
const PulsePharmacyProvider = new GenericMedicineProvider('med-pulsepharmacy', 'Pulse Pharmacy', 30);
const SchwabeProvider = new GenericMedicineProvider('med-schwabe', 'Schwabe', 30);
const AyushCareProvider = new GenericMedicineProvider('med-ayushcare', 'AyushCare', 30);
const FrankRossProvider = new GenericMedicineProvider('med-frankross', 'Frank Ross', 30);

// 3. Quick / Instant Delivery
const BlinkitProvider = new GenericMedicineProvider('med-blinkit', 'Blinkit', 20);
const ZeptoProvider = new GenericMedicineProvider('med-zepto', 'Zepto', 20);
const SwiggyInstamartProvider = new GenericMedicineProvider('med-instamart', 'Swiggy Instamart', 20);
const MedstownProvider = new GenericMedicineProvider('med-medstown', 'Medstown', 20);

export const extendedMedicineProviders = [
  // National
  Apollo247Provider, NetmedsProvider, Tata1mgProvider, PharmEasyProvider, 
  FlipkartHealthProvider, AmazonPharmacyProvider, MedPlusProvider,
  
  // Generic
  TruemedsProvider, GenericartProvider, DavaindiaProvider, MedkartProvider,
  GenericAadhaarProvider, ZenericsProvider, PharmarackProvider, PlatinumRxProvider,
  SastaSundarProvider, HealthmugProvider, PharmacyBazarProvider, PositraRxProvider,
  PulsePharmacyProvider, SchwabeProvider, AyushCareProvider, FrankRossProvider,

  // Quick
  BlinkitProvider, ZeptoProvider, SwiggyInstamartProvider, MedstownProvider
];
