import { BaseCategoryProvider } from './BaseCategoryProvider';
import { SearchQuery, NormalizedResult } from '@compareall/shared-types';

export abstract class EducationProvider extends BaseCategoryProvider {
  constructor(id: string, name: string) {
    super({
      id,
      name,
      supportedCategories: ['education'],
      requiresAuth: false
    });
  }

  async search(query: SearchQuery): Promise<NormalizedResult[]> {
    return this.fetchEducationOptions(query);
  }

  protected abstract fetchEducationOptions(query: SearchQuery): Promise<NormalizedResult[]>;
}

