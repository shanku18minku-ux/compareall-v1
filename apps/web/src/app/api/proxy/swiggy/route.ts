import { NextResponse } from 'next/server';

function extractDishes(json: any): any[] {
  let results: any[] = [];
  
  function search(obj: any, currentRestaurant?: any) {
    if (!obj || typeof obj !== 'object') return;
    
    // Check if this object is a restaurant
    let restaurant = currentRestaurant;
    if (obj.restaurant && obj.restaurant.info) {
      restaurant = obj.restaurant.info;
    }
    
    // Check if this object contains dishes
    if (Array.isArray(obj.dishes)) {
      obj.dishes.forEach((dishObj: any) => {
        if (dishObj.info && dishObj.info.name) {
          results.push({
            dish: dishObj.info,
            restaurant: restaurant || { name: 'Unknown Restaurant', id: 'unknown' }
          });
        }
      });
    } else if (obj.info && obj.info.name && obj.info.price) {
      // Sometimes it's a direct dish item without the dishes array wrapper
      results.push({
        dish: obj.info,
        restaurant: restaurant || { name: 'Unknown Restaurant', id: 'unknown' }
      });
    }
    
    // Recurse down
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        search(obj[key], restaurant);
      }
    }
  }
  
  search(json);
  
  // Deduplicate by dish ID
  const uniqueResults = [];
  const seenIds = new Set();
  for (const item of results) {
    if (!seenIds.has(item.dish.id)) {
      seenIds.add(item.dish.id);
      uniqueResults.push(item);
    }
  }
  
  return uniqueResults;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get('term');
  const lat = searchParams.get('lat') || '12.9715987';
  const lng = searchParams.get('lng') || '77.5945627';
  
  if (!term) {
    return NextResponse.json({ error: 'Search term is required' }, { status: 400 });
  }

  try {
    const swiggyUrl = `https://www.swiggy.com/dapi/restaurants/search/v3?lat=${lat}&lng=${lng}&str=${encodeURIComponent(term)}&trackingId=undefined&submitAction=ENTER&queryUniqueId=74e14f6b-73b8-500b-3b32-94f4c9c80d46`;
    
    const response = await fetch(swiggyUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json',
        'Referer': 'https://www.swiggy.com/'
      },
      next: { revalidate: 60 } // Cache for 60 seconds
    });

    if (!response.ok) {
      throw new Error(`Swiggy API responded with ${response.status}`);
    }

    const data = await response.json();
    const extractedDishes = extractDishes(data);
    
    // Convert to our NormalizedResult format
    const normalizedResults = extractedDishes.slice(0, 5).map(item => {
      const price = (item.dish.price || item.dish.defaultPrice || 0) / 100; // Swiggy returns price in paise (e.g., 29500 = Rs 295)
      const isConnected = false; // Ephemeral proxy doesn't have connection state, client will apply discounts
      
      // Calculate a rough estimated time based on SLA if available
      const eta = item.restaurant.sla?.deliveryTime || 30;
      
      return {
        providerId: 'food-a',
        providerName: 'Swiggy', // Real name now!
        id: `swiggy-${item.dish.id}`,
        title: `${item.dish.name} (${item.restaurant.name})`,
        category: 'food',
        price: price + 40, // Add standard 40rs delivery fee for guest mode
        originalPrice: price,
        estimatedTimeMins: eta,
        rating: parseFloat(item.dish.ratings?.aggregatedRating?.rating || item.restaurant.avgRating || '4.0'),
        rawMetadata: {
          restaurant: {
            name: item.restaurant.name
          }
        }
      };
    });

    return NextResponse.json(normalizedResults);
  } catch (error: any) {
    console.error('Swiggy Proxy Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
