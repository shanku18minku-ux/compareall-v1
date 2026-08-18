const fs = require('fs');

const path = 'C:\\\\Users\\\\HP\\\\.gemini\\\\antigravity\\\\worktrees\\\\app\\\\integrate_account_data_comparison\\\\apps\\\\mobile\\\\App.tsx';
let lines = fs.readFileSync(path, 'utf8').split('\n');

const newLogic = `  const handleDataExtracted = (data: any, providerId?: string) => {
    // Always mark provider as done
    if (providerId) {
      completedProvidersRef.current.add(providerId);
    }
    const items = data.data || data.items || (Array.isArray(data) ? data : []);
    const provider = PROVIDERS.find(p => p.id === providerId);
    if (!provider) return;
    const providerName = provider.name;

    if (items && items.length > 0) {
       setResults(prev => {
          const updated = [...prev];
          
          const normalizeStr = (s: string) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '').trim();
          
          items.forEach((item: any) => {
             const dishName = item.name || item.title || item.dishName;
             const restName = item.restaurant || item.restaurantName;
             if (!dishName && !restName) return;
             
             // Base payload
             const offerPayload = {
               providerName,
               restaurantName: restName || 'Unknown Restaurant',
               restaurantUrl: item.restaurantUrl || provider.url,
               price: item.price,
               menuPrice: item.menuPrice,
               isRestaurantSearchResult: !!item.isRestaurantSearchResult,
               isAccountConnected: connectedProviders.includes(providerId!),
               autoCouponSavings: connectedProviders.includes(providerId!) ? (item.autoCouponSavings || item.couponSavings || 0) : 0,
               potentialSavings: item.couponSavings || item.autoCouponSavings || 100,
               couponCode: item.couponCode,
               additionalOffers: item.additionalOffers || [],
               deliveryTime: item.deliveryTime,
               rating: item.rating
             };
             
             const effectiveFinalPrice = item.price?.finalPayablePrice || 9999;
             const restMatchKey = normalizeStr(restName || 'Unknown Restaurant');
             
             let restGroup = updated.find(g => normalizeStr(g.restaurantName) === restMatchKey);
             if (!restGroup) {
                 restGroup = {
                     restaurantName: restName || 'Unknown Restaurant',
                     matchKey: restMatchKey,
                     platforms: [],
                     dishes: []
                 };
                 updated.push(restGroup);
             }
             
             if (!restGroup.platforms.includes(providerName)) {
                 restGroup.platforms.push(providerName);
             }
             
             const dishMatchKey = normalizeStr(dishName || 'Unknown Dish');
             let dishGroup = restGroup.dishes.find((d: any) => normalizeStr(d.dishName) === dishMatchKey);
             
             if (!dishGroup) {
                 dishGroup = {
                     dishName: dishName || 'Unknown Dish',
                     matchKey: dishMatchKey,
                     offers: [],
                     lowestPrice: 99999,
                     bestProvider: '',
                     isRestaurantSearchResult: !!item.isRestaurantSearchResult
                 };
                 restGroup.dishes.push(dishGroup);
             }
             
             const existingProviderIdx = dishGroup.offers.findIndex((o: any) => o.providerName === providerName);
             if (existingProviderIdx >= 0) {
                 dishGroup.offers[existingProviderIdx] = offerPayload;
             } else {
                 dishGroup.offers.push(offerPayload);
             }
          });
          
          updated.forEach(rest => {
              rest.dishes.forEach((dish: any) => {
                  dish.offers.sort((a: any, b: any) => (a.price?.finalPayablePrice || 9999) - (b.price?.finalPayablePrice || 9999));
                  dish.lowestPrice = dish.offers[0]?.price?.finalPayablePrice || 0;
                  dish.bestProvider = dish.offers[0]?.providerName;
                  
                  const maxMenuPrices = dish.offers.map((o: any) => o.price?.basePrice || o.price?.menuPrice || o.price?.finalPayablePrice || 0);
                  dish.savings = Math.max(0, Math.max(...maxMenuPrices) - dish.lowestPrice);
              });
              rest.dishes.sort((a: any, b: any) => a.lowestPrice - b.lowestPrice);
          });
          
          return updated;
       });
    }

    const activeCategoryProviders = getFilteredProviders().filter(p => p.category.toLowerCase() === searchCategory.toLowerCase());
    const allDone = activeCategoryProviders.length > 0 && activeCategoryProviders.every(p => completedProvidersRef.current.has(p.id));
    if (allDone) {
      setIsSearching(false);
    }
  };`;

// Find start and end indices
let startIndex = -1;
let endIndex = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('const handleDataExtracted = (data: any, providerId?: string) => {')) {
        startIndex = i;
    }
    if (startIndex !== -1 && lines[i].includes('const activeCategoryProviders = getFilteredProviders()')) {
        endIndex = i;
    }
    if (startIndex !== -1 && endIndex !== -1 && lines[i].includes('  };')) {
        if (i > endIndex) {
            endIndex = i;
            break;
        }
    }
}

if (startIndex !== -1 && endIndex !== -1) {
    const before = lines.slice(0, startIndex);
    const after = lines.slice(endIndex + 1);
    const newCode = before.join('\n') + '\n' + newLogic + '\n' + after.join('\n');
    fs.writeFileSync(path, newCode);
    console.log('Successfully patched App.tsx');
} else {
    console.log('Could not find start or end index:', startIndex, endIndex);
}
