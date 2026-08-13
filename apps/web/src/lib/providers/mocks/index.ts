import { ProviderAdapter } from '@compareall/shared-types';
import { 
  FoodProviderA, FoodProviderB, FoodProviderC,
  GroceryProviderA, GroceryProviderB,
  ShoppingProviderA, ShoppingProviderB,
  CabProviderA, CabProviderB, CabProviderC,
  TravelProviderA, JobProviderA, EducationProviderA
} from './mockProviders';

export const MOCK_PROVIDERS: ProviderAdapter[] = [
  new FoodProviderA(),
  new FoodProviderB(),
  new FoodProviderC(),
  new GroceryProviderA(),
  new GroceryProviderB(),
  new ShoppingProviderA(),
  new ShoppingProviderB(),
  new CabProviderA(),
  new CabProviderB(),
  new CabProviderC(),
  new TravelProviderA(),
  new JobProviderA(),
  new EducationProviderA()
];

