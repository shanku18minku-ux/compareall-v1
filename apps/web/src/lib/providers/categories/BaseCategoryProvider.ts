import { ProviderAdapter, ProviderConfig, SearchQuery, NormalizedResult } from '@compareall/shared-types';

export abstract class BaseCategoryProvider implements ProviderAdapter {
  constructor(public config: ProviderConfig) {}

  abstract search(query: SearchQuery): Promise<NormalizedResult[]>;

  // Optional: Common methods for API connections that can be overridden
  async connect(credentials: any): Promise<boolean> {
    return true; 
  }
  
  async disconnect(): Promise<void> {}
  
  async isConnected(): Promise<boolean> {
    return true;
  }
}

