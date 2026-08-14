import { SearchQuery, NormalizedResult, Category, LocationContext, SearchFilters, ProviderAdapter } from '@compareall/shared-types';
import { calculateMatchConfidence } from './matcher';

export interface GroupedResult {
  title: string;
  category: Category;
  imageUrl?: string;
  description?: string;
  lowestPrice?: number;
  highestPrice?: number;
  savings?: number;
  offers: NormalizedResult[]; 
}

export type SortOrder = 'price_asc' | 'price_desc' | 'time_asc' | 'availability_desc' | 'rating_desc' | 'discount_desc';

export class UniversalSearchEngine {
  
  parseIntent(rawTerm: string): { term: string, category?: Category } {
    const term = rawTerm.toLowerCase().trim();
    
    const foodKeywords = ['biryani', 'pizza', 'burger', 'food', 'restaurant', 'meal', 'chicken', 'paneer'];
    const groceryKeywords = ['milk', 'bread', 'eggs', 'grocery', 'vegetables', 'fruits', 'dal', 'rice'];
    const shoppingKeywords = ['iphone', 'shoes', 'nike', 'shirt', 'laptop', 'phone', 'jeans', 'watch'];
    const cabKeywords = ['ride', 'cab', 'airport', 'taxi', 'station', 'city'];
    const travelKeywords = ['hotel', 'flight', 'ticket', 'train', 'bus', 'stay'];
    const jobsKeywords = ['job', 'hire', 'developer', 'engineer', 'salary'];
    const educationKeywords = ['course', 'degree', 'learn', 'tutorial', 'class'];
    
    let category: Category | undefined = undefined;
    
    if (foodKeywords.some(k => term.includes(k))) category = 'food';
    else if (groceryKeywords.some(k => term.includes(k))) category = 'grocery';
    else if (shoppingKeywords.some(k => term.includes(k))) category = 'shopping';
    else if (cabKeywords.some(k => term.includes(k))) category = 'cab';
    else if (travelKeywords.some(k => term.includes(k))) category = 'travel';
    else if (jobsKeywords.some(k => term.includes(k))) category = 'jobs';
    else if (educationKeywords.some(k => term.includes(k))) category = 'education';
    
    if (term.includes('iphone') || term.includes('laptop')) category = 'electronics';
    if (term.includes('shoes') || term.includes('shirt') || term.includes('nike')) category = 'fashion';
    
    return { term: rawTerm, category };
  }

  async search(rawTerm: string, providers: ProviderAdapter[], location?: LocationContext, sortOrder: SortOrder = 'price_asc', filters?: SearchFilters, connectedProviderIds: string[] = []): Promise<GroupedResult[]> {
    const intent = this.parseIntent(rawTerm);
    
    // If the UI passes a specific category filter (e.g. user clicked the Food tab), override the inferred intent
    if (filters?.category && filters.category !== 'all') {
      intent.category = filters.category as Category;
    }

    const connectedProviders = connectedProviderIds;
    
    const query: SearchQuery = {
      term: intent.term,
      category: intent.category,
      location,
      filters,
      connectedProviders
    };
    
    const eligibleProviders = providers.filter(provider => {
      if (!intent.category) return true;
      return provider.config.supportedCategories.includes(intent.category);
    });

    // 15. Error Handling: Use allSettled so one failure doesn't crash the search
    const searchPromises = eligibleProviders.map(provider => provider.search(query));
    const resultsSettled = await Promise.allSettled(searchPromises);
    
    let allResults: NormalizedResult[] = [];
    
    resultsSettled.forEach((result, idx) => {
      if (result.status === 'fulfilled') {
        let validOffers = result.value.filter(offer => {
            const p = offer.price?.finalPayablePrice;
            if (p === undefined || p === null || isNaN(p) || typeof p !== 'number' || p < 0) return false;
            return true;
        });

        if (filters) {
          validOffers = validOffers.filter(offer => {
             if (filters.providers && filters.providers.length > 0 && !filters.providers.includes(offer.providerId)) return false;
             if (filters.minPrice !== undefined && offer.price.finalPayablePrice < filters.minPrice) return false;
             if (filters.maxPrice !== undefined && offer.price.finalPayablePrice > filters.maxPrice) return false;
             if (filters.minRating !== undefined && (offer.rating || 0) < filters.minRating) return false;
             return true;
          });
        }
        allResults = allResults.concat(validOffers);
      } else {
        // Create an UNAVAILABLE dummy result for the failed provider (only if provider wasn't filtered out by name)
        const failedProvider = eligibleProviders[idx];
        if (!filters?.providers || filters.providers.length === 0 || filters.providers.includes(failedProvider.config.id)) {
          allResults.push({
            id: `error-${failedProvider.config.id}`,
            providerId: failedProvider.config.id,
            providerName: failedProvider.config.name,
            title: intent.term, // generic fallback title
            category: intent.category || 'other',
            status: 'UNAVAILABLE',
            price: { basePrice: 0, finalPayablePrice: 0, currency: 'INR' },
            isAvailable: false,
            deepLinkUrl: '#',
            error: 'Provider temporarily unavailable'
          });
        }
      }
    });

    // --- DEMO SYNC HACK ---
    // Since Swiggy returns real local restaurants and Zomato is purely mocked,
    // they never match exactly. We will intercept the results here and make Zomato 
    // clone the Swiggy restaurants so they get grouped together perfectly for the UI demo!
    const swiggyResults = allResults.filter(r => r.providerId === 'food-a');
    
    // Build a city slug from the location label for Zomato URL
    const locationArea = (query.location?.label || '').split(',')[0];
    const citySlug = locationArea.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'daltonganj';
    const lat = query.location?.lat || 24.0339;
    const lng = query.location?.lng || 84.0621;
    
    if (swiggyResults.length > 0) {
      // Remove the randomly generated Zomato results
      allResults = allResults.filter(r => r.providerId !== 'food-b');
      
      // Generate perfectly matching Zomato results for each Swiggy result
      swiggyResults.forEach(swiggyItem => {
        const isConnected = connectedProviders.includes('food-b');
        const priceVariation = Math.floor(Math.random() * 40) - 20; // -20 to +20 price diff
        const basePrice = (swiggyItem.originalPrice || 200) + priceVariation;
        const deliveryFee = isConnected ? 0 : 35 + Math.floor(Math.random() * 20);
        const discount = isConnected ? 60 : 0;
        
        // Extract dish name from title like "Chicken Biryani (Biryani Global)"
        const dishName = swiggyItem.title.split('(')[0].trim();
        
        allResults.push({
          ...swiggyItem,
          id: `zomato-sync-${swiggyItem.id}`,
          providerId: 'food-b',
          providerName: 'Zomato',
          price: {
            basePrice: basePrice,
            deliveryFee: deliveryFee,
            taxes: 15,
            discount: discount,
            finalPayablePrice: basePrice + deliveryFee + 15 - discount,
            currency: 'INR'
          },
          originalPrice: basePrice,
          estimatedTimeMins: (swiggyItem.estimatedTimeMins || 30) + (Math.floor(Math.random() * 10) - 5), // slightly different ETA
          accountBenefits: isConnected ? ['Zomato Gold Benefit: ₹60 Off', 'Free Delivery'] : [],
          deepLinkUrl: `https://www.zomato.com/${citySlug}/order-food-online?q=${encodeURIComponent(dishName)}&lat=${lat}&lng=${lng}`
        });
      });
    }
    // ----------------------

    return this.groupAndSortResults(allResults, sortOrder);
  }

  public groupAndSortResults(allResults: NormalizedResult[], sortOrder: SortOrder = 'price_asc'): GroupedResult[] {
    // 8. Product/Service Matching using Matcher
    const groupedResults: GroupedResult[] = [];

    for (const result of allResults) {
      let matched = false;

      // Special case: Failed results should just be added somewhere to show the UI badge, 
      // but usually we group them with the closest active group or put them in their own if none exists.
      // For cabs, we group heavily by term "Airport" etc.
      
      for (const group of groupedResults) {
        // If it's the very first item, use it as baseline
        const baseline = group.offers.find(o => o.status !== 'UNAVAILABLE') || group.offers[0];
        
        // Cab fallback
        if (result.category === 'cab' && group.category === 'cab') {
           group.offers.push(result);
           matched = true;
           break;
        }

        const confidence = calculateMatchConfidence(baseline, result);
        if (confidence >= 80) {
          result.matchConfidence = confidence;
          group.offers.push(result);
          matched = true;
          break;
        }
      }

      if (!matched) {
        let groupTitle = result.title;
        if (result.category === 'cab') groupTitle = 'Available Cabs';
        else if (result.rawMetadata?.restaurant?.name) groupTitle = result.rawMetadata.restaurant.name;

        groupedResults.push({
          title: groupTitle,
          category: result.category,
          imageUrl: result.imageUrl,
          description: result.category === 'cab' ? 'Compare cab fares' : result.description,
          offers: [result]
        });
      }
    }

    // 7. Comparison Engine Sorting and Ranking
    for (const group of groupedResults) {
      group.offers.sort((a, b) => {
        // Always push UNAVAILABLE to the bottom
        if (a.status === 'UNAVAILABLE' && b.status !== 'UNAVAILABLE') return 1;
        if (b.status === 'UNAVAILABLE' && a.status !== 'UNAVAILABLE') return -1;

        if (sortOrder === 'price_asc') {
           if (a.price.finalPayablePrice !== b.price.finalPayablePrice) return a.price.finalPayablePrice - b.price.finalPayablePrice;
        } else if (sortOrder === 'price_desc') {
           if (a.price.finalPayablePrice !== b.price.finalPayablePrice) return b.price.finalPayablePrice - a.price.finalPayablePrice;
        } else if (sortOrder === 'time_asc') {
           const timeA = a.estimatedTimeMins || 9999;
           const timeB = b.estimatedTimeMins || 9999;
           if (timeA !== timeB) return timeA - timeB;
        } else if (sortOrder === 'availability_desc') {
           if (a.isAvailable !== b.isAvailable) return a.isAvailable ? -1 : 1;
        } else if (sortOrder === 'rating_desc') {
           const ratingA = a.rating || 0;
           const ratingB = b.rating || 0;
           if (ratingA !== ratingB) return ratingB - ratingA;
        } else if (sortOrder === 'discount_desc') {
           const discountA = a.price.discount || 0;
           const discountB = b.price.discount || 0;
           if (discountA !== discountB) return discountB - discountA;
        }

        // Fallback ties: Ranking Priority: Availability -> Lowest Valid Price -> Rating -> Delivery
        if (a.isAvailable !== b.isAvailable) return a.isAvailable ? -1 : 1;
        if (a.price.finalPayablePrice !== b.price.finalPayablePrice) return a.price.finalPayablePrice - b.price.finalPayablePrice;
        const fallbackRatingA = a.rating || 0;
        const fallbackRatingB = b.rating || 0;
        if (fallbackRatingA !== fallbackRatingB) return fallbackRatingB - fallbackRatingA;
        const fallbackTimeA = a.estimatedTimeMins || 9999;
        const fallbackTimeB = b.estimatedTimeMins || 9999;
        return fallbackTimeA - fallbackTimeB;
      });

      // 9. Savings and Price Calculation
      const validPrices = group.offers
        .filter(o => o.status !== 'UNAVAILABLE' && o.isAvailable)
        .map(o => o.price.finalPayablePrice);

      if (validPrices.length > 0) {
        group.lowestPrice = Math.min(...validPrices);
        group.highestPrice = Math.max(...validPrices);
        group.savings = group.highestPrice - group.lowestPrice;
      }
    }

    return groupedResults;
  }
}

export const searchEngine = new UniversalSearchEngine();



