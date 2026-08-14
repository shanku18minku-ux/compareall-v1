import { SearchQuery, NormalizedResult } from '@compareall/shared-types';
import { FoodProvider } from '../categories/FoodProvider';
import { GroceryProvider } from '../categories/GroceryProvider';
import { ShoppingProvider } from '../categories/ShoppingProvider';
import { CabProvider } from '../categories/CabProvider';
import { TravelProvider } from '../categories/TravelProvider';
import { JobProvider } from '../categories/JobProvider';
import { EducationProvider } from '../categories/EducationProvider';
import { createMockResult, calculateFinalPrice } from './mockUtils';

export class FoodProviderA extends FoodProvider {
  constructor() {
    super('food-a', '[MOCK] Swiggy Clone');
  }

  async fetchFoodOptions(query: SearchQuery): Promise<NormalizedResult[]> {
    const isConnected = query.connectedProviders?.includes(this.config.id);
    
    if (query.term.toLowerCase().includes('biryani')) {
      const deliveryFee = isConnected ? 0 : 30; // Free delivery if connected
      const discount = isConnected ? 50 : 0;
      
      return [
        createMockResult(this.config.id, this.config.name, 'b1', {
          title: 'Chicken Biryani (Behrouz Biryani)',
          category: 'food',
          price: calculateFinalPrice(250, deliveryFee, 5, 12, discount, 10, 0),
          originalPrice: 250,
          estimatedTimeMins: 30,
          rating: 4.2,
          accountBenefits: isConnected ? ['[DEMO] Mock Swiggy One Benefit: Free Delivery'] : []
        }),
        createMockResult(this.config.id, this.config.name, 'b2', {
          title: 'Chicken Dum Biryani (Meghana Foods)',
          category: 'food',
          price: calculateFinalPrice(280, deliveryFee, 5, 14, discount, 15, 0),
          originalPrice: 280,
          estimatedTimeMins: 40,
          rating: 4.6,
          accountBenefits: isConnected ? ['[DEMO] Mock Swiggy One Benefit: Free Delivery'] : []
        })
      ];
    }
    return [];
  }
}

export class FoodProviderB extends FoodProvider {
  constructor() {
    super('food-b', '[MOCK] Zomato Clone');
  }

  async fetchFoodOptions(query: SearchQuery): Promise<NormalizedResult[]> {
    const isConnected = query.connectedProviders?.includes(this.config.id);
    
    if (query.term.toLowerCase().includes('biryani')) {
      const discount = isConnected ? 60 : 0; // Flat ₹60 off if connected
      
      return [
        createMockResult(this.config.id, this.config.name, 'b1', {
          title: 'Chicken Biryani (Behrouz Biryani)',
          category: 'food',
          price: calculateFinalPrice(240, 40, 6, 12, discount, 15, 0),
          originalPrice: 240,
          estimatedTimeMins: 45,
          rating: 4.5,
          accountBenefits: isConnected ? ['[DEMO] Mock Zomato Gold Benefit: ₹60 Off'] : []
        }),
        createMockResult(this.config.id, this.config.name, 'b2', {
          title: 'Chicken Dum Biryani (Meghana Foods)',
          category: 'food',
          price: calculateFinalPrice(290, 40, 6, 14, discount, 15, 0),
          originalPrice: 290,
          estimatedTimeMins: 35,
          rating: 4.7,
          accountBenefits: isConnected ? ['[DEMO] Mock Zomato Gold Benefit: ₹60 Off'] : []
        })
      ];
    }
    return [];
  }
}

export class FoodProviderC extends FoodProvider {
  constructor() {
    super('food-c', '[MOCK] EatSure Clone');
  }

  async fetchFoodOptions(query: SearchQuery): Promise<NormalizedResult[]> {
    if (query.term.toLowerCase().includes('biryani')) {
      return [
        createMockResult(this.config.id, this.config.name, 'b1', {
          title: 'Chicken Biryani (Behrouz Biryani)',
          category: 'food',
          price: calculateFinalPrice(260, 0, 0, 13, 0, 0, 0), // Free delivery
          originalPrice: 260,
          estimatedTimeMins: 25,
          rating: 4.8
        })
      ];
    }
    return [];
  }
}

export class GroceryProviderA extends GroceryProvider {
  constructor() {
    super('groc-a', '[MOCK] Blinkit Clone');
  }

  async fetchGroceryOptions(query: SearchQuery): Promise<NormalizedResult[]> {
    if (query.term.toLowerCase().includes('milk') || query.term.toLowerCase().includes('grocery')) {
      return [
        createMockResult(this.config.id, this.config.name, 'm1', {
          title: 'Milk 1L',
          brand: 'Amul',
          quantity: 1,
          size: '1L',
          category: 'grocery',
          price: calculateFinalPrice(68, 15, 2, 0, 0, 2, 0),
          originalPrice: 68,
          estimatedTimeMins: 10,
        })
      ];
    }
    return [];
  }
}

export class GroceryProviderB extends GroceryProvider {
  constructor() {
    super('groc-b', '[MOCK] Instamart Clone');
  }

  async fetchGroceryOptions(query: SearchQuery): Promise<NormalizedResult[]> {
    if (query.term.toLowerCase().includes('milk') || query.term.toLowerCase().includes('grocery')) {
      return [
        createMockResult(this.config.id, this.config.name, 'm1', {
          title: 'Milk 1L',
          brand: 'Amul',
          quantity: 1,
          size: '1L',
          category: 'grocery',
          price: calculateFinalPrice(68, 25, 4, 0, 0, 0, 0),
          originalPrice: 68,
          estimatedTimeMins: 15,
        })
      ];
    }
    return [];
  }
}

export class ShoppingProviderA extends ShoppingProvider {
  constructor() {
    super('shop-a', '[MOCK] Amazon Clone');
  }

  async fetchShoppingOptions(query: SearchQuery): Promise<NormalizedResult[]> {
    const isConnected = query.connectedProviders?.includes(this.config.id);
    
    if (query.term.toLowerCase().includes('iphone 16') || query.term.toLowerCase().includes('fashion')) {
      const deliveryFee = isConnected ? 0 : 500;
      const eta = isConnected ? 1440 : 2880; // 1 day vs 2 days
      
      return [
        createMockResult(this.config.id, this.config.name, 'ip1', {
          title: 'Apple iPhone 16 (128GB)',
          brand: 'Apple',
          model: 'iPhone 16',
          size: '128GB',
          category: 'electronics',
          price: calculateFinalPrice(79900, deliveryFee, 0, 14382, 5000, 0, 0),
          originalPrice: 79900,
          estimatedTimeMins: eta,
          accountBenefits: isConnected ? ['[DEMO] Mock Prime Benefit: 1-Day ETA'] : []
        })
      ];
    }
    return [];
  }
}

export class ShoppingProviderB extends ShoppingProvider {
  constructor() {
    super('shop-b', '[MOCK] Flipkart Clone');
  }

  async fetchShoppingOptions(query: SearchQuery): Promise<NormalizedResult[]> {
    if (query.term.toLowerCase().includes('iphone 16') || query.term.toLowerCase().includes('fashion')) {
      return [
        createMockResult(this.config.id, this.config.name, 'ip1', {
          title: 'Apple iPhone 16 (128GB)',
          brand: 'Apple',
          model: 'iPhone 16',
          size: '128GB',
          category: 'electronics',
          price: calculateFinalPrice(79900, 40, 29, 14382, 6500, 99, 0),
          originalPrice: 79900,
          estimatedTimeMins: 4320, // 3 days
        })
      ];
    }
    return [];
  }
}

export class CabProviderA extends CabProvider {
  constructor() {
    super('cab-a', '[MOCK] Uber Clone');
  }

  async fetchCabOptions(query: SearchQuery): Promise<NormalizedResult[]> {
    const isConnected = query.connectedProviders?.includes(this.config.id);
    
    if (query.term.toLowerCase().includes('airport') || query.term.toLowerCase().includes('cab')) {
      const discount = isConnected ? 100 : 0; // Flat â‚¹100 off if connected
      
      return [
        createMockResult(this.config.id, this.config.name, 'c1', {
          title: 'Airport Ride (Sedan)',
          category: 'cab',
          price: calculateFinalPrice(850, 0, 0, 42, discount, 0, 0),
          originalPrice: 850,
          estimatedTimeMins: 5,
          distanceKm: 22.4,
          accountBenefits: isConnected ? ['[DEMO] Mock Uber One Benefit: â‚¹100 Off'] : []
        })
      ];
    }
    return [];
  }
}

export class CabProviderB extends CabProvider {
  constructor() {
    super('cab-b', '[MOCK] Ola Clone');
  }

  async fetchCabOptions(query: SearchQuery): Promise<NormalizedResult[]> {
    if (query.term.toLowerCase().includes('airport') || query.term.toLowerCase().includes('cab')) {
      return [
        createMockResult(this.config.id, this.config.name, 'c1', {
          title: 'Airport to City',
          category: 'cab',
          price: calculateFinalPrice(790, 0, 0, 39, 100, 0, 0),
          originalPrice: 790,
          estimatedTimeMins: 12,
          distanceKm: 22.1,
        })
      ];
    }
    return [];
  }
}

export class CabProviderC extends CabProvider {
  constructor() {
    super('cab-c', '[MOCK] BluSmart Clone');
  }

  async fetchCabOptions(query: SearchQuery): Promise<NormalizedResult[]> {
    if (query.term.toLowerCase().includes('airport') || query.term.toLowerCase().includes('cab')) {
      return [
        createMockResult(this.config.id, this.config.name, 'c1', {
          title: 'Airport Premium Ride',
          category: 'cab',
          price: calculateFinalPrice(950, 0, 0, 47, 0, 0, 0),
          originalPrice: 950,
          estimatedTimeMins: 20,
          distanceKm: 22.5,
        })
      ];
    }
    return [];
  }
}

export class TravelProviderA extends TravelProvider {
  constructor() {
    super('travel-a', '[MOCK] MakeMyTrip Clone');
  }
  async fetchTravelOptions(query: SearchQuery): Promise<NormalizedResult[]> {
    if (query.term.toLowerCase().includes('hotel') || query.term.toLowerCase().includes('travel')) {
      return [
        createMockResult(this.config.id, this.config.name, 't1', {
          title: 'Taj Hotel (Deluxe Room)',
          category: 'travel',
          price: calculateFinalPrice(5000, 0, 0, 900, 1000, 0, 0),
          originalPrice: 5000,
          rating: 4.9
        })
      ];
    }
    return [];
  }
}

export class JobProviderA extends JobProvider {
  constructor() {
    super('job-a', '[MOCK] Naukri Clone');
  }
  async fetchJobOptions(query: SearchQuery): Promise<NormalizedResult[]> {
    if (query.term.toLowerCase().includes('job') || query.term.toLowerCase().includes('developer')) {
      return [
        createMockResult(this.config.id, this.config.name, 'j1', {
          title: 'Senior Frontend Developer',
          category: 'jobs',
          price: calculateFinalPrice(0, 0, 0, 0, 0, 0, 0),
          originalPrice: 0,
          description: 'React, Next.js, 5+ years experience. Remote.',
        })
      ];
    }
    return [];
  }
}

export class EducationProviderA extends EducationProvider {
  constructor() {
    super('edu-a', '[MOCK] Udemy Clone');
  }
  async fetchEducationOptions(query: SearchQuery): Promise<NormalizedResult[]> {
    if (query.term.toLowerCase().includes('course') || query.term.toLowerCase().includes('learn')) {
      return [
        createMockResult(this.config.id, this.config.name, 'e1', {
          title: 'Next.js 16 Full Masterclass',
          category: 'education',
          price: calculateFinalPrice(3499, 0, 0, 629, 2900, 0, 0),
          originalPrice: 3499,
          rating: 4.7
        })
      ];
    }
    return [];
  }
}

