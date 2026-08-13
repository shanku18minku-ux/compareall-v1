import { BaseCategoryProvider } from './BaseCategoryProvider';
import { SearchQuery, NormalizedResult } from '@compareall/shared-types';

export abstract class CabProvider extends BaseCategoryProvider {
  constructor(id: string, name: string) {
    super({
      id,
      name,
      supportedCategories: ['cab'],
      requiresAuth: true
    });
  }

  async search(query: SearchQuery): Promise<NormalizedResult[]> {
    if (!query.location || !query.location.lat) {
      throw new Error(`Precise Location (Lat/Lng) is strictly required for Cab searches on ${this.config.name}.`);
    }
    return this.fetchCabOptions(query);
  }

  protected abstract fetchCabOptions(query: SearchQuery): Promise<NormalizedResult[]>;
}

