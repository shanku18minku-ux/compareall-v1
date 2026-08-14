import { SearchQuery, NormalizedResult } from '@compareall/shared-types';
import { ProviderAdapter } from '@compareall/shared-types';
import { createMockResult, calculateFinalPrice } from './mockUtils';

export class GenericServiceProvider implements ProviderAdapter {
  config = {
    id: '',
    name: '',
    supportedCategories: ['services' as any],
    requiresAuth: true
  };

  constructor(
    id: string, 
    name: string, 
    private baseVisitingFee: number
  ) {
    this.config.id = id;
    this.config.name = name;
  }

  async search(query: SearchQuery): Promise<NormalizedResult[]> {
    if (query.category && query.category !== 'services') return [];
    
    const term = query.term.toLowerCase();
    
    const isConnected = query.connectedProviders?.includes(this.config.id);
    
    // Mock Pricing Logic based on keywords
    let basePrice = 299;
    if (term.includes('ac') || term.includes('repair') || term.includes('mechanic')) basePrice = 499;
    if (term.includes('clean') || term.includes('home') || term.includes('sofa')) basePrice = 899;
    if (term.includes('massage') || term.includes('salon') || term.includes('spa')) basePrice = 999;
    if (term.includes('plumber') || term.includes('electrician') || term.includes('carpenter')) basePrice = 249;
    if (term.includes('paint') || term.includes('pest')) basePrice = 2500;
    
    const variation = (this.config.name.length * 73) % (basePrice * 0.2) - (basePrice * 0.1); 
    const finalPrice = Math.max(99, Math.floor(basePrice + variation));
    
    const visitingFee = isConnected ? 0 : this.baseVisitingFee;
    const discount = isConnected ? Math.floor(finalPrice * 0.1) : 0;
    
    await new Promise(r => setTimeout(r, 200 + Math.random() * 300));

    return [
      createMockResult(this.config.id, this.config.name, `${this.config.id}-1`, {
        title: `${query.term.charAt(0).toUpperCase() + query.term.slice(1) || 'Home Service'}`,
        description: `Professional provided by ${this.config.name}`,
        category: 'services' as any,
        price: calculateFinalPrice(finalPrice, visitingFee, 0, 0, discount, 0, 0),
        originalPrice: finalPrice,
        estimatedTimeMins: 60, // 1 hour ETA for services
        rating: 4.2 + ((this.config.name.length % 8) / 10),
        accountBenefits: isConnected ? [`${this.config.name} Member: Waived Visiting Fee`] : [],
        deepLinkUrl: `https://${this.config.name.toLowerCase().replace(/[^a-z]/g, '')}.com/search?q=${encodeURIComponent(term)}`
      })
    ];
  }
}

const UrbanCompanyProvider = new GenericServiceProvider('service-uc', 'Urban Company', 49);
const JustdialProvider = new GenericServiceProvider('service-jd', 'Justdial', 0);
const NoBrokerProvider = new GenericServiceProvider('service-nobroker', 'NoBroker Services', 99);
const YesMadamProvider = new GenericServiceProvider('service-yesmadam', 'Yes Madam', 49);
const HelprProvider = new GenericServiceProvider('service-helpr', 'Helpr', 50);
const DigitalLaborChowkProvider = new GenericServiceProvider('service-digitallaborchowk', 'Digital Labor Chowk', 0);

export const extendedServiceProviders = [
  UrbanCompanyProvider, JustdialProvider, NoBrokerProvider, YesMadamProvider, HelprProvider, DigitalLaborChowkProvider
];
