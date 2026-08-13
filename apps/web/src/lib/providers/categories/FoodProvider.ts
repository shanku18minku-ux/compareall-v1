import { BaseCategoryProvider } from './BaseCategoryProvider';
import { SearchQuery, NormalizedResult } from '@compareall/shared-types';

export abstract class FoodProvider extends BaseCategoryProvider {
  constructor(id: string, name: string) {
    super({
      id,
      name,
      supportedCategories: ['food'],
      requiresAuth: true
    });
  }

  // Enforce specific location rules for food
  async search(query: SearchQuery): Promise<NormalizedResult[]> {
    if (!query.location || (!query.location.lat && !query.location.pincode)) {
      throw new Error(`Location (Lat/Lng or Pincode) is strictly required for Food delivery searches on ${this.config.name}.`);
    }
    return this.fetchFoodOptions(query);
  }

  protected abstract fetchFoodOptions(query: SearchQuery): Promise<NormalizedResult[]>;
}

