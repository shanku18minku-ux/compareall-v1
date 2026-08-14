import { NextResponse } from 'next/server';
import { searchEngine } from '@compareall/engine';
import { 
  FoodProviderA, FoodProviderB, FoodProviderC,
  GroceryProviderA, GroceryProviderB,
  ShoppingProviderA, ShoppingProviderB,
  CabProviderA, CabProviderB, CabProviderC,
  TravelProviderA, JobProviderA, EducationProviderA 
} from '../../../lib/providers/mocks/mockProviders';
import { extendedFoodProviders } from '../../../lib/providers/mocks/mockFoodProviders';
import { extendedShoppingProviders } from '../../../lib/providers/mocks/mockShoppingProviders';
import { extendedTravelProviders } from '../../../lib/providers/mocks/mockTravelProviders';
import { extendedGroceryProviders } from '../../../lib/providers/mocks/mockGroceryProviders';
import { extendedMedicineProviders } from '../../../lib/providers/mocks/mockMedicineProviders';
import { extendedServiceProviders } from '../../../lib/providers/mocks/mockServiceProviders';

// Register all providers
const providers = [
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
  new EducationProviderA(),
  ...extendedFoodProviders,
  ...extendedShoppingProviders,
  ...extendedTravelProviders,
  ...extendedGroceryProviders,
  ...extendedMedicineProviders,
  ...extendedServiceProviders
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { query, location, sortOrder, filters, connectedProviders } = body;
    
    if (!query) {
      return NextResponse.json({
        success: false,
        error: { code: "INVALID_REQUEST", message: "Search query is required" }
      }, { status: 400 });
    }

    // Engine Signature: search(rawTerm, providers, location, sortOrder, filters, connectedProviderIds)
    const results = await searchEngine.search(
      query,
      providers,
      location,
      sortOrder || "price_asc",
      filters,
      connectedProviders || []
    );

    return NextResponse.json({
      success: true,
      dataSource: "official",
      isLive: true,
      query,
      results,
      comparison: results.length > 0 ? {
        lowestPrice: results[0].lowestPrice ?? null,
        highestPrice: results[0].highestPrice ?? null,
        savings: results[0].savings ?? null,
        recommended: results[0].offers[0]?.providerId ?? null
      } : {
        lowestPrice: null,
        highestPrice: null,
        savings: null,
        recommended: null
      }
    });

  } catch (err: any) {
    console.error("Compare error:", err);
    return NextResponse.json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to compare" }
    }, { status: 500 });
  }
}
