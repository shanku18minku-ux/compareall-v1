import { BaseCategoryProvider } from './BaseCategoryProvider';
import { SearchQuery, NormalizedResult } from '@compareall/shared-types';

export abstract class TravelProvider extends BaseCategoryProvider {
  constructor(id: string, name: string) {
    super({
      id,
      name,
      supportedCategories: ['travel'],
      requiresAuth: false
    });
  }

  async search(query: SearchQuery): Promise<NormalizedResult[]> {
    return this.fetchTravelOptions(query);
  }

  protected abstract fetchTravelOptions(query: SearchQuery): Promise<NormalizedResult[]>;
}

