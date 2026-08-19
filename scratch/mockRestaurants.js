const fs = require('fs');
let content = fs.readFileSync('apps/mobile/App.tsx', 'utf8');

const mockDataCode = `
const MOCK_RESTAURANTS = [
  {
    restaurantName: 'Hotel Chandrika',
    matchKey: 'mock1',
    cuisines: 'South Indian • Chinese • Juices',
    dishes: [
      {
        dishName: 'Masala Dosa',
        offers: [
          { providerName: 'Swiggy', price: { finalPayablePrice: 99, basePrice: 99 }, providerId: 'food-a' },
          { providerName: 'Zomato', price: { finalPayablePrice: 99, basePrice: 99 }, providerId: 'food-b' }
        ]
      },
      {
        dishName: 'Vada',
        offers: [
          { providerName: 'Swiggy', price: { finalPayablePrice: 49, basePrice: 49 }, providerId: 'food-a' }
        ]
      }
    ]
  },
  {
    restaurantName: 'Bakingo',
    matchKey: 'mock2',
    cuisines: 'Bakery • Desserts • Beverages',
    dishes: [
      {
        dishName: 'Tiramisu Cake (500 gm)',
        offers: [
          { providerName: 'Swiggy', price: { finalPayablePrice: 649, basePrice: 649 }, providerId: 'food-a' },
          { providerName: 'Toing', price: { finalPayablePrice: 649, basePrice: 649 }, providerId: 'food-eatsure' },
          { providerName: 'Zomato', price: { finalPayablePrice: 649, basePrice: 649 }, providerId: 'food-b' }
        ]
      },
      {
        dishName: 'Chocolate Dream Cake (500 gm)',
        offers: [
          { providerName: 'Swiggy', price: { finalPayablePrice: 649, basePrice: 649 }, providerId: 'food-a' },
          { providerName: 'Toing', price: { finalPayablePrice: 638, basePrice: 638 }, providerId: 'food-eatsure' },
          { providerName: 'Zomato', price: { finalPayablePrice: 649, basePrice: 649 }, providerId: 'food-b' }
        ]
      }
    ]
  }
];
`;

// Insert mock data at the top of the component
content = content.replace("export default function App() {", mockDataCode + "\nexport default function App() {");

const defaultRestaurantsBlock = `
            {!isSearching && results.length === 0 && searchCategory.toLowerCase() === 'food' && (
              <View style={{padding: 16}}>
                  <Text style={{fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginBottom: 16}}>Restaurants near you</Text>
                  {MOCK_RESTAURANTS.map((restGroup: any, index: number) => {
                      const k = restGroup.matchKey || index.toString();
                      const providersInRest = Array.from(new Set(restGroup.dishes.flatMap((d: any) => d.offers.map((o: any) => o.providerName))));
                      return (
                        <View key={k} style={styles.premiumRestCard}>
                          <View style={styles.restCardHeader}>
                              <Text style={styles.restTitle}>{restGroup.restaurantName}</Text>
                              <Text style={{color: '#64748b', fontSize: 13, marginTop: 4}}>{restGroup.cuisines}</Text>
                          </View>
                          
                          <View style={{paddingHorizontal: 15, paddingBottom: 15}}>
                              {providersInRest.map((provName: any) => (
                                  <View key={provName} style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12}}>
                                      <Text style={{fontWeight: 'bold', color: '#334155'}}>{provName}</Text>
                                      <Text style={{color: '#16a34a', fontSize: 12, fontWeight: '600'}}>Open now</Text>
                                  </View>
                              ))}
                          </View>
                          
                          <TouchableOpacity 
                              style={styles.openMenuBtn}
                              onPress={() => setSelectedMenuRest(restGroup)}
                              activeOpacity={0.8}
                          >
                              <Text style={styles.openMenuBtnText}>Open Menu ?</Text>
                          </TouchableOpacity>
                        </View>
                      );
                  })}
              </View>
            )}
`;

const anchor = `<ScrollView style={styles.resultsContainer} contentContainerStyle={{ paddingBottom: totalCartCount > 0 ? 100 : 20 }}>`;
content = content.replace(anchor, defaultRestaurantsBlock + "\n" + anchor);

fs.writeFileSync('apps/mobile/App.tsx', content);
console.log('Mock restaurants added!');
