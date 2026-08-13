import { BaseCategoryProvider } from './BaseCategoryProvider';
import { SearchQuery, NormalizedResult } from '@compareall/shared-types';

export abstract class ShoppingProvider extends BaseCategoryProvider {
  constructor(id: string, name: string) {
    super({
      id,
      name,
      supportedCategories: ['shopping', 'electronics', 'fashion'],
      requiresAuth: false
    });
  }

  async search(query: SearchQuery): Promise<NormalizedResult[]> {
    // Shopping can operate nationwide, so location is optional but helpful for ETA
    return this.fetchShoppingOptions(query);
  }

  protected abstract fetchShoppingOptions(query: SearchQuery): Promise<NormalizedResult[]>;
}

