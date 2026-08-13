import { BaseCategoryProvider } from './BaseCategoryProvider';
import { SearchQuery, NormalizedResult } from '@compareall/shared-types';

export abstract class JobProvider extends BaseCategoryProvider {
  constructor(id: string, name: string) {
    super({
      id,
      name,
      supportedCategories: ['jobs'],
      requiresAuth: false
    });
  }

  async search(query: SearchQuery): Promise<NormalizedResult[]> {
    return this.fetchJobOptions(query);
  }

  protected abstract fetchJobOptions(query: SearchQuery): Promise<NormalizedResult[]>;
}

