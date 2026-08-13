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
        groupedResults.push({
          title: result.category === 'cab' ? 'Available Cabs' : result.title,
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



