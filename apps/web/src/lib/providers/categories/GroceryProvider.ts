import { BaseCategoryProvider } from './BaseCategoryProvider';
import { SearchQuery, NormalizedResult } from '@compareall/shared-types';

export abstract class GroceryProvider extends BaseCategoryProvider {
  constructor(id: string, name: string) {
    super({
      id,
      name,
      supportedCategories: ['grocery'],
      requiresAuth: true
    });
  }

  async search(query: SearchQuery): Promise<NormalizedResult[]> {
    if (!query.location || (!query.location.lat && !query.location.pincode)) {
      throw new Error(`Location (Lat/Lng or Pincode) is strictly required for Grocery delivery searches on ${this.config.name}.`);
    }
    return this.fetchGroceryOptions(query);
  }

  protected abstract fetchGroceryOptions(query: SearchQuery): Promise<NormalizedResult[]>;
}

