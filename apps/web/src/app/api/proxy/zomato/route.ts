import { NextResponse } from 'next/server';

// Simulated realistic Zomato responses based on user query
function generateRealisticZomatoData(term: string, lat: string, lng: string) {
  const basePrice = term.toLowerCase().includes('biryani') ? 250 : 
                    term.toLowerCase().includes('pizza') ? 400 :
                    term.toLowerCase().includes('burger') ? 150 : 300;
                    
  const restaurants = [
    { name: 'Meghana Foods (Zomato Partner)', rating: '4.4' },
    { name: 'Empire Restaurant (Zomato Partner)', rating: '4.1' },
    { name: 'Truffles (Zomato Exclusive)', rating: '4.5' },
    { name: 'Leon Grill (Zomato Partner)', rating: '4.2' },
    { name: 'KFC (Zomato Partner)', rating: '4.0' }
  ];

  const results = [];
  const count = 3 + Math.floor(Math.random() * 3); // 3-5 results

  for (let i = 0; i < count; i++) {
    const restaurant = restaurants[i % restaurants.length];
    
    // Vary the price slightly so it's not identical to Swiggy
    const priceVariation = Math.floor(Math.random() * 60) - 10; // -10 to +50
    const finalPrice = basePrice + priceVariation;
    
    // Vary ETA
    const eta = 25 + Math.floor(Math.random() * 20); // 25-45 mins
    
    // Zomato might have a slightly different delivery fee algorithm
    const deliveryFee = 35 + Math.floor(Math.random() * 15);

    results.push({
      providerId: 'food-b',
      providerName: 'Zomato',
      id: `zomato-mock-${Date.now()}-${i}`,
      title: `${term.charAt(0).toUpperCase() + term.slice(1)} (${restaurant.name})`,
      category: 'food',
      price: finalPrice + deliveryFee,
      originalPrice: finalPrice,
      estimatedTimeMins: eta,
      rating: parseFloat(restaurant.rating),
      rawMetadata: {
        restaurant: {
          name: restaurant.name
        },
        deliveryFee
      }
    });
  }

  return results;
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
    // Artificial delay to simulate network latency for Zomato
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

    // For the MVP, since Zomato blocks basic API fetching, we generate highly realistic 
    // structured data that matches the exact shape of our Swiggy response.
    // In production with a Zomato partnership, this will just call Zomato API.
    const mockZomatoResults = generateRealisticZomatoData(term, lat, lng);

    return NextResponse.json(mockZomatoResults);
  } catch (error: any) {
    console.error('Zomato Proxy Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
