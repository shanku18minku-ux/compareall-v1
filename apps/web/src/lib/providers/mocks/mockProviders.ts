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
    super('food-a', 'Swiggy');
  }

  async fetchFoodOptions(query: SearchQuery): Promise<NormalizedResult[]> {
    const isConnected = query.connectedProviders?.includes(this.config.id);
    
    // We only trigger this if query term is somewhat food related, or always if it's broad
    const lat = query.location?.lat || 12.9715987;
    const lng = query.location?.lng || 77.5945627;
    
    try {
      const swiggyUrl = `https://www.swiggy.com/dapi/restaurants/search/v3?lat=${lat}&lng=${lng}&str=${encodeURIComponent(query.term)}&trackingId=undefined&submitAction=ENTER&queryUniqueId=74e14f6b-73b8-500b-3b32-94f4c9c80d46`;
      
      const response = await fetch(swiggyUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'application/json',
          'Referer': 'https://www.swiggy.com/'
        },
        next: { revalidate: 60 }
      });

      if (!response.ok) return [];

      const data = await response.json();
      const results: NormalizedResult[] = [];
      
      // Basic recursive extractor
      const seenIds = new Set();
      const restaurantDishCount: Record<string, number> = {};
      
      function search(obj: any, currentRestaurant?: any) {
        if (!obj || typeof obj !== 'object' || results.length >= 10) return;
        
        let restaurant = currentRestaurant;
        if (obj.restaurant && obj.restaurant.info) {
          restaurant = obj.restaurant.info;
        }
        
        if (Array.isArray(obj.dishes)) {
          obj.dishes.forEach((dishObj: any) => {
            if (dishObj.info && dishObj.info.name && dishObj.info.price && !seenIds.has(dishObj.info.id)) {
              seenIds.add(dishObj.info.id);
              
              const restId = restaurant?.id || 'unknown';
              if (!restaurantDishCount[restId]) restaurantDishCount[restId] = 0;
              
              // Only allow max 2 dishes per restaurant to ensure variety
              if (restaurantDishCount[restId] < 2 && results.length < 10) {
                restaurantDishCount[restId]++;
                const price = dishObj.info.price / 100;
                const deliveryFee = isConnected ? 0 : 40;
                const discount = isConnected ? 50 : 0;
                
                results.push(createMockResult('food-a', 'Swiggy', `s-${dishObj.info.id}`, {
                  title: `${dishObj.info.name} (${restaurant?.name || 'Unknown'})`,
                  category: 'food',
                  price: calculateFinalPrice(price, deliveryFee, 0, 0, discount, 0, 0),
                  originalPrice: price,
                  estimatedTimeMins: restaurant?.sla?.deliveryTime || 35,
                  rating: parseFloat(dishObj.info.ratings?.aggregatedRating?.rating || restaurant?.avgRating || '4.0'),
                  accountBenefits: isConnected ? ['Swiggy One Benefit: Free Delivery'] : [],
                  deepLinkUrl: restaurant?.slugs?.restaurant 
                    ? `https://www.swiggy.com/restaurants/${restaurant.slugs.restaurant}-${restaurant.id}`
                    : `https://www.swiggy.com/restaurants/${restaurant?.id}`
                }));
              }
            }
          });
        }
        
        for (const key in obj) {
          if (typeof obj[key] === 'object') {
            search(obj[key], restaurant);
          }
        }
      }
      
      search(data);
      return results;
    } catch (e) {
      console.error("Swiggy API Error:", e);
      return [];
    }
  }
}

export class FoodProviderB extends FoodProvider {
  constructor() {
    super('food-b', 'Zomato');
  }

  private generateRealisticZomatoData(term: string, lat: string, lng: string, locationLabel?: string) {
    const basePrice = term.toLowerCase().includes('biryani') ? 250 : 
                      term.toLowerCase().includes('pizza') ? 400 :
                      term.toLowerCase().includes('burger') ? 150 : 300;
                      
    const area = locationLabel ? locationLabel.split(',')[0] : 'Your Area';
    const restaurants = [
      { name: `The Local Biryani House (${area})`, rating: '4.4' },
      { name: `Royal Restaurant (${area})`, rating: '4.1' },
      { name: `Food Court (${area})`, rating: '4.5' },
      { name: `Spice Kitchen (${area})`, rating: '4.2' },
      { name: `KFC (${area})`, rating: '4.0' }
    ];

    const results = [];
    const count = 3 + Math.floor(Math.random() * 3); // 3-5 results

    for (let i = 0; i < count; i++) {
      const restaurant = restaurants[i % restaurants.length];
      const priceVariation = Math.floor(Math.random() * 60) - 10;
      const finalPrice = basePrice + priceVariation;
      const eta = 25 + Math.floor(Math.random() * 20);
      const deliveryFee = 35 + Math.floor(Math.random() * 15);
      
      // Build a location-aware Zomato search URL with lat/lng to override browser-saved city
      const citySlug = area.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'daltonganj';
      const zomatoUrl = `https://www.zomato.com/${citySlug}/order-food-online?q=${encodeURIComponent(term)}&lat=${lat}&lng=${lng}`;

      results.push({
        providerId: this.config.id,
        providerName: 'Zomato',
        id: `zomato-mock-${Date.now()}-${i}`,
        title: `${term.charAt(0).toUpperCase() + term.slice(1)} (${restaurant.name})`,
        category: 'food',
        price: {
           basePrice: finalPrice,
           deliveryFee,
           taxes: 15,
           finalPayablePrice: finalPrice + deliveryFee + 15,
           currency: 'INR'
        },
        originalPrice: finalPrice,
        estimatedTimeMins: eta,
        rating: parseFloat(restaurant.rating),
        rawMetadata: {
          restaurant: {
            name: restaurant.name
          }
        },
        isAvailable: true,
        status: 'LIVE',
        deepLinkUrl: zomatoUrl
      });
    }
    return results;
  }

  async fetchFoodOptions(query: SearchQuery): Promise<NormalizedResult[]> {
    if (!query.term) return [];
    
    try {
      const { term, location } = query;
      const lat = location?.lat?.toString() || '12.9715987';
      const lng = location?.lng?.toString() || '77.5945627';
      
      // Artificial delay to simulate network latency for Zomato
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));
      
      const results = this.generateRealisticZomatoData(term, lat, lng, location?.label);
      
      // Apply connected discount
      const isConnected = query.connectedProviders?.includes(this.config.id);
      
      return results.map((result: any) => {
        if (isConnected) {
          result.price.discount = 60; // Mock Zomato Gold discount
          result.price.finalPayablePrice = result.price.finalPayablePrice - 60; 
          result.accountBenefits = ['Zomato Gold Benefit: ₹60 Off'];
        }
        return result;
      });
      
    } catch (e) {
      console.error('Zomato generation failed', e);
      return [];
    }
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

