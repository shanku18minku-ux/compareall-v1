const fs = require('fs');

const path = 'C:\\\\Users\\\\HP\\\\.gemini\\\\antigravity\\\\worktrees\\\\app\\\\integrate_account_data_comparison\\\\apps\\\\mobile\\\\App.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Patch getFilteredProviders
const getFilteredProvidersOld = `  const getFilteredProviders = () => {
     if (!location || !location.name) {
       // No location set - only show providers that work everywhere, not city-specific ones
       return PROVIDERS.filter(p => p.regions.includes('all'));
     }

     // Normalize location name: lowercase + map known aliases so region matching works reliably
     let locName = location.name.toLowerCase();

     // Alias normalization - Nominatim/Expo geocoder may return different spellings
     const aliasMap: Record<string, string[]> = {
       'bangalore': ['bengaluru', 'bangaluru', 'banglore', 'bangalore'],
       'delhi':     ['new delhi', 'ndmc', 'south delhi', 'north delhi', 'east delhi', 'west delhi', 'central delhi'],
       'ncr':       ['noida', 'gurgaon', 'gurugram', 'faridabad', 'ghaziabad'],
       'mumbai':    ['bombay', 'navi mumbai', 'thane', 'kalyan'],
       'kolkata':   ['calcutta', 'howrah'],
     };
     
     for (const [canonical, aliases] of Object.entries(aliasMap)) {
       if (aliases.some(alias => locName.includes(alias))) {
         locName = canonical;
         break;
       }
     }

     // Only include a provider if they either support "all" regions OR one of their specific regions is matched in the location string
     return PROVIDERS.filter(p => p.regions.includes('all') || p.regions.some(r => locName.includes(r)));
  };`;

const getFilteredProvidersNew = `  const getFilteredProviders = () => {
     if (!location || !location.name) {
       // No location set - only show providers that work everywhere, not city-specific ones
       return PROVIDERS.filter(p => p.regions.includes('all'));
     }

     // Normalize location name: lowercase + map known aliases so region matching works reliably
     let locName = location.name.toLowerCase();

     // Alias normalization - Nominatim/Expo geocoder may return different spellings
     const aliasMap: Record<string, string[]> = {
       'bangalore': ['bengaluru', 'bangaluru', 'banglore', 'bangalore'],
       'delhi':     ['new delhi', 'ndmc', 'south delhi', 'north delhi', 'east delhi', 'west delhi', 'central delhi'],
       'ncr':       ['noida', 'gurgaon', 'gurugram', 'faridabad', 'ghaziabad'],
       'mumbai':    ['bombay', 'navi mumbai', 'thane', 'kalyan'],
       'kolkata':   ['calcutta', 'howrah'],
     };
     
     for (const [canonical, aliases] of Object.entries(aliasMap)) {
       if (aliases.some(alias => locName.includes(alias))) {
         locName = canonical;
         break;
       }
     }

     // Strict Word Matcher to avoid "medininagar" matching "nagar"
     const matchWord = (str: string, word: string) => {
         const regex = new RegExp(\`\\\\b\${word}\\\\b\`, 'i');
         return regex.test(str);
     };

     return PROVIDERS.filter(p => 
        p.regions.includes('all') || 
        p.regions.some(r => matchWord(locName, r))
     );
  };`;

content = content.replace(getFilteredProvidersOld, getFilteredProvidersNew);

// 2. Patch handleDataExtracted
const newHandleDataExtracted = `  const handleDataExtracted = (data: any, providerId?: string) => {
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
          const isRestMatch = (n1: string, n2: string) => {
              const str1 = normalizeStr(n1);
              const str2 = normalizeStr(n2);
              if (str1 === str2) return true;
              if (str1.length > 5 && str2.length > 5) {
                  return str1.startsWith(str2) || str2.startsWith(str1);
              }
              return false;
          };

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
             
             let restGroup = updated.find(g => isRestMatch(g.restaurantName, restName || 'Unknown Restaurant'));
             if (!restGroup) {
                 restGroup = {
                     restaurantName: restName || 'Unknown Restaurant',
                     matchKey: normalizeStr(restName || 'Unknown Restaurant'),
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

// Use regex to replace the whole handleDataExtracted block reliably
let inExtracted = false;
let extractionStart = -1;
let extractionEnd = -1;
let lines = content.split('\\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('const handleDataExtracted = (data: any, providerId?: string) => {')) {
        extractionStart = i;
    }
    if (extractionStart !== -1 && lines[i].includes('const activeCategoryProviders = getFilteredProviders()')) {
        extractionEnd = i;
    }
    if (extractionStart !== -1 && extractionEnd !== -1 && lines[i].includes('  };')) {
        if (i > extractionEnd) {
            extractionEnd = i;
            break;
        }
    }
}

if (extractionStart !== -1 && extractionEnd !== -1) {
    const before = lines.slice(0, extractionStart);
    const after = lines.slice(extractionEnd + 1);
    content = before.join('\\n') + '\\n' + newHandleDataExtracted + '\\n' + after.join('\\n');
}

fs.writeFileSync(path, content);
console.log('App.tsx patched successfully');
