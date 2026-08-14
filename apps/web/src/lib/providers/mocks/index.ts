import { ProviderAdapter } from '@compareall/shared-types';
import { extendedFoodProviders } from './mockFoodProviders';
import { extendedShoppingProviders } from './mockShoppingProviders';
import { extendedTravelProviders } from './mockTravelProviders';
import { extendedGroceryProviders } from './mockGroceryProviders';
import { extendedMedicineProviders } from './mockMedicineProviders';
import { extendedServiceProviders } from './mockServiceProviders';

export const MOCK_PROVIDERS: ProviderAdapter[] = [
  ...extendedFoodProviders,
  ...extendedShoppingProviders,
  ...extendedTravelProviders,
  ...extendedGroceryProviders,
  ...extendedMedicineProviders,
  ...extendedServiceProviders
];

