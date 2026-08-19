import React, { useState, useRef, useEffect } from 'react';
import { Image,  StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Modal, Vibration  } from 'react-native';
import * as Location from 'expo-location';
import { WebViewExtractor } from './src/lib/WebViewExtractor';
import { LoginWebViewModal } from './src/lib/LoginWebViewModal';
import { PlatformBrowserModal } from './src/lib/PlatformBrowserModal';
import { UniversalCartModal } from './src/lib/UniversalCartModal';
import { DynamicSearchBar } from './src/lib/search/DynamicSearchBar';
import { CartItem } from './src/lib/CartTypes';
import { getPacket, getAllProvidersMetadata } from './src/lib/packets/registry';

// Load platform metadata dynamically from registered packets
const PROVIDERS = getAllProvidersMetadata();

const CATEGORIES = ['Food', 'Commute', 'Groceries', 'Shopping', 'Medicine', 'Services', 'Travel'];

export default function App() {
  const [activeTab, setActiveTab] = useState<'Search' | 'Connections' | 'Cart'>('Connections');
  const [activeCategory, setActiveCategory] = useState('Food');

  // Dynamic Search State
  const [searchCategory, setSearchCategory] = useState('Food');
  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>({});

  // Connections state
  const [connectedProviders, setConnectedProviders] = useState<string[]>([]);
  const connectedProvidersRef = useRef<string[]>([]);
  useEffect(() => {
    connectedProvidersRef.current = connectedProviders;
  }, [connectedProviders]);

  // Login modal state — which provider's website is shown right now for linking
  const [loginModal, setLoginModal] = useState<{ id: string; name: string; icon: string; loginUrl: string } | null>(null);

  // Platform checkout browser modal — opens platform website directly for order placement
  const [checkoutModal, setCheckoutModal] = useState<{
    providerName: string;
    providerIcon: string;
    providerCategory?: string;
    brandColor?: string;
    targetUrl: string;
    checkoutUrl?: string;
    restaurantUrl?: string;
    couponCode?: string;
    cartItems?: CartItem[];
  } | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [apiSearchQuery, setApiSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isVegMode, setIsVegMode] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Refs to avoid stale closure in async callbacks (fetchCurrentLocation, handleManualLocation)
  const searchQueryRef = useRef('');
  const apiSearchQueryRef = useRef('');
  useEffect(() => { searchQueryRef.current = searchQuery; }, [searchQuery]);
  useEffect(() => { apiSearchQueryRef.current = apiSearchQuery; }, [apiSearchQuery]);
  const activeFiltersRef = useRef<{ restaurantKeyword?: string, maxPrice?: number }>({});
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  // Universal Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartModalVisible, setIsCartModalVisible] = useState(false);
  const [selectedMenuRest, setSelectedMenuRest] = useState<any>(null);
  const [expandedDishIndex, setExpandedDishIndex] = useState<number | null>(null);
  const [detailAnalysisModal, setDetailAnalysisModal] = useState<{
    dishTitle: string;
    offer: any;
    group: any;
  } | null>(null);

  // Location State
  const [location, setLocation] = useState<{ latitude: number; longitude: number; name: string } | null>(null);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [manualLocationInput, setManualLocationInput] = useState('');
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [searchNonce, setSearchNonce] = useState(Date.now());
  const completedProvidersRef = useRef<Set<string>>(new Set());

  // ── Cart Handlers ──────────────────────────────────────────────────────────
  const handleAddToCart = (offer: any, groupTitle: string) => {
    Vibration.vibrate(25);
    setIsCartModalVisible(true);
    const providerId = PROVIDERS.find(p => p.name.toLowerCase() === offer.providerName.toLowerCase())?.id || PROVIDERS[0]?.id;
    const itemId = `${providerId}__${groupTitle}`;
    
    // Extract dish name and restaurant name
    const parts = groupTitle.split(' - ');
    const dishName = parts[0] || groupTitle;
    const restaurantName = parts[1] || offer.restaurantName || offer.metadata?.restaurantName || offer.providerName;
    const restaurantUrl = offer.restaurantUrl || offer.metadata?.restaurantUrl;

    const menuPrice = offer.menuPrice || offer.price?.menuPrice || offer.price?.finalPayablePrice || 0;
    const effectivePrice = offer.effectivePrice || offer.price?.finalPayablePrice || menuPrice;

    setCartItems(prev => {
      const existing = prev.find(i => i.id === itemId);
      if (existing) {
        return prev.map(i => i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [
        ...prev,
        {
          id: itemId,
          title: groupTitle,
          dishName: dishName,
          dishId: offer.dishId || offer.metadata?.dishId,
          restaurantName: restaurantName,
          restaurantUrl: restaurantUrl,
          providerId: providerId,
          providerName: offer.providerName,
          price: menuPrice,
          effectivePrice: effectivePrice,
          basePrice: offer.price?.basePrice || menuPrice,
          discount: offer.price?.discount || 0,
          offerText: offer.offerText,
          couponCode: offer.couponCode || offer.metadata?.couponCode,
          couponDescription: offer.couponDescription || offer.metadata?.couponDescription,
          couponPercent: offer.couponPercent,
          couponMaxCap: offer.couponMaxCap,
          couponFlat: offer.couponFlat,
          additionalOffers: offer.additionalOffers || offer.metadata?.additionalOffers || [],
          quantity: 1,
        }
      ];
    });
  };

  const handleUpdateCartQty = (itemId: string, newQty: number) => {
    Vibration.vibrate(20);
    if (newQty <= 0) {
      handleRemoveFromCart(itemId);
      return;
    }
    setCartItems(prev => prev.map(item => item.id === itemId ? { ...item, quantity: newQty } : item));
  };

  const handleRemoveFromCart = (itemId: string) => {
    Vibration.vibrate(30);
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleClearCart = () => {
    Vibration.vibrate(40);
    setCartItems([]);
    setIsCartModalVisible(false);
  };

  const handleCartCheckout = (providerId: string, restaurantName: string, couponCode?: string, restaurantUrl?: string, items?: CartItem[]) => {
    setIsCartModalVisible(false);
    const provider = PROVIDERS.find(p => p.id === providerId);
    if (provider) {
      // Open the restaurant menu page first so platform has active store & menu context
      let initialUrl = restaurantUrl;
      if (!initialUrl) {
        if (restaurantName && restaurantName !== 'General' && restaurantName !== 'Restaurant Order') {
          if (provider.id === 'food-b') {
            initialUrl = `https://www.zomato.com/search?q=${encodeURIComponent(restaurantName)}`;
          } else if (provider.id === 'food-a') {
            initialUrl = `https://www.swiggy.com/search?query=${encodeURIComponent(restaurantName)}`;
          } else {
            initialUrl = `${provider.url}/search?q=${encodeURIComponent(restaurantName)}`;
          }
        } else {
          initialUrl = provider.id === 'food-b' ? 'https://www.zomato.com/delivery' : provider.url;
        }
      }

      const checkoutUrl = provider.checkoutUrl || `${provider.url}/checkout`;

      setCheckoutModal({
        providerName: provider.name,
        providerIcon: provider.icon,
        providerCategory: provider.category,
        brandColor: provider.brandColor,
        targetUrl: initialUrl,
        checkoutUrl: checkoutUrl,
        restaurantUrl: initialUrl,
        couponCode: couponCode,
        cartItems: items || [],
      });
    }
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const fetchCurrentLocation = async () => {
    setIsFetchingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setIsFetchingLocation(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const geocode = await Location.reverseGeocodeAsync({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      
      let name = 'Current Location';
      if (geocode && geocode.length > 0) {
        const place = geocode[0];
        name = [place.name, place.street, place.city, place.region].filter(Boolean).join(', ');
      }

      setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude, name });
      setResults([]);
      completedProvidersRef.current.clear(); // Reset so new location fetches fresh data
      // Only re-trigger WebViews if user already had an active search query
      if (searchQueryRef.current || apiSearchQueryRef.current) {
        setIsSearching(true);
        setSearchNonce(Date.now());
      }
      setIsLocationModalVisible(false);
    } catch (error) {
      console.log('Error fetching location:', error);
    }
    setIsFetchingLocation(false);
  };

  // Auto-fetch location on app launch
  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  const handleManualLocationSubmit = async () => {
    if (!manualLocationInput.trim()) return;
    setIsFetchingLocation(true);
    try {
      let latitude: number | undefined;
      let longitude: number | undefined;
      let name = manualLocationInput;

      try {
        const results = await Location.geocodeAsync(manualLocationInput);
        if (results && results.length > 0) {
          latitude = results[0].latitude;
          longitude = results[0].longitude;
          const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
          if (geocode && geocode.length > 0) {
            const place = geocode[0];
            name = [place.name, place.street, place.city, place.region].filter(Boolean).join(', ');
          }
        } else {
            // Throw error to trigger fallback block
            throw new Error("Location geocoding returned empty results");
        }
      } catch (expoErr) {
        // Fallback to OpenStreetMap Nominatim if Expo geocoding fails (e.g. due to denied location permissions)
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(manualLocationInput)}&format=json&limit=1`, {
                headers: { 'User-Agent': 'CompareAllApp/1.0' }
            });
            const data = await res.json();
            if (data && data.length > 0) {
                latitude = parseFloat(data[0].lat);
                longitude = parseFloat(data[0].lon);
                name = data[0].name || data[0].display_name.split(',')[0] || manualLocationInput.charAt(0).toUpperCase() + manualLocationInput.slice(1);
            } else {
                throw new Error("Not found via fallback");
            }
        } catch (fallbackErr) {
            throw expoErr; // throw original error if fallback also fails
        }
      }

      if (latitude !== undefined && longitude !== undefined) {
        setLocation({ latitude, longitude, name });
        setResults([]); // Clear stale results from previous location
        completedProvidersRef.current.clear(); // Reset tracking for new WebViews
        // Only re-trigger search if user already had an active query
        if (searchQueryRef.current || apiSearchQueryRef.current) {
          setIsSearching(true);
          setSearchNonce(Date.now());
        }
        setIsLocationModalVisible(false);
        setManualLocationInput('');
      } else {
        alert('Location not found');
      }
    } catch (error) {
      alert('Error searching location: ' + String(error));
    }
    setIsFetchingLocation(false);
  };

  const getFilteredProviders = () => {
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
       'hyderabad': ['secunderabad', 'cyberabad'],
       'chennai':   ['madras'],
       'pune':      ['pimpri', 'chinchwad', 'pcmc'],
     };

     // Expand locName so all aliases are included in a single searchable string
     let expandedLoc = locName;
     for (const [canonical, aliases] of Object.entries(aliasMap)) {
       if (aliases.some(a => locName.includes(a)) || locName.includes(canonical)) {
         expandedLoc += ' ' + canonical + ' ' + aliases.join(' ');
       }
     }

     const isRailwayStation = locName.includes('station') || locName.includes('railway') || locName.includes('junction') || locName.includes('cantt') || locName.includes('terminal');

     // Strict Word Matcher to avoid "medininagar" matching "nagar"
     const matchWord = (str: string, word: string) => {
         const regex = new RegExp(`\\b${word}\\b`, 'i');
         return regex.test(str);
     };

     return PROVIDERS.filter(p => {
         // Train food delivery apps ONLY appear if the user is at a railway station
         if (p.subcategory === 'Train Food Delivery' || p.regions.includes('station')) {
             return isRailwayStation;
         }
         if (p.regions.includes('all')) return true;
         
         // Use exact word match to prevent partial matching bugs
         return p.regions.some(region => matchWord(expandedLoc, region));
     });
  };


  // Disconnect logic
  const handleDisconnect = (id: string) => {
      setConnectedProviders(prev => prev.filter(p => p !== id));
      Vibration.vibrate(50);
  };

  const handleSearch = (queryOverride?: string) => {
    const q = (queryOverride !== undefined ? queryOverride : (searchValues.query || searchQuery)).trim();
    if (!q) return;
    setSearchQuery(q);
    setSearchValues(prev => ({ ...prev, query: q }));
    
    // Natural Language Parsing for Intent & Filters
    const lQuery = q.toLowerCase();
    let apiQ = q;
    let filters: { restaurantKeyword?: string, maxPrice?: number } = {};
    
    // Pattern 1: "[dish] from|in|at [restaurant]" - Requires restaurant-sounding keyword to avoid overmatching "Pasta in white sauce"
    const fromMatch = lQuery.match(/^(.*?)\s+(?:from|in|at)\s+(.*(?:restaurant|hotel|dhaba|cafe|sweets|bakers|kitchen|plaza|diner|food|foods|corner|point|dominos|pizza|burger|mcdonalds|kfc|subway|behrouz).*)$/i);
    // Pattern 2: "[dish] karo [restaurant] se" OR "[dish] [restaurant] se"
    const hindiSeMatch1 = lQuery.match(/^(.*?)\s+(?:karo\s+)?(.+?)\s+se$/i);
    // Pattern 3: "[restaurant] se [dish]"
    const hindiSeMatch2 = lQuery.match(/^(.+?)\s+se\s+(.+)$/i);

    if (fromMatch) {
       apiQ = fromMatch[1].trim();
       let rawRest = fromMatch[2].trim();
       rawRest = rawRest.replace(/\b(restaurant|hotel|dhaba|cafe|sweets|bakers|kitchen|plaza|diner|food|foods|corner|point|dominos|pizza|burger|mcdonalds|kfc|subway|behrouz)\b/ig, '').trim();
       filters.restaurantKeyword = rawRest || fromMatch[2].trim();
    } else if (hindiSeMatch1) {
       apiQ = hindiSeMatch1[1].trim();
       let rawRest = hindiSeMatch1[2].trim();
       rawRest = rawRest.replace(/\b(restaurant|hotel|dhaba|cafe|sweets|bakers|kitchen|plaza|diner|food|foods|corner|point|dominos|pizza|burger|mcdonalds|kfc|subway|behrouz)\b/ig, '').trim();
       filters.restaurantKeyword = rawRest || hindiSeMatch1[2].trim();
    } else if (hindiSeMatch2) {
       apiQ = hindiSeMatch2[2].trim();
       let rawRest = hindiSeMatch2[1].trim();
       rawRest = rawRest.replace(/\b(restaurant|hotel|dhaba|cafe|sweets|bakers|kitchen|plaza|diner|food|foods|corner|point|dominos|pizza|burger|mcdonalds|kfc|subway|behrouz)\b/ig, '').trim();
       filters.restaurantKeyword = rawRest || hindiSeMatch2[1].trim();
    } else {
       // Pattern 2: "[dish] under [price]" or "[dish] [price] se kam"
       const underMatch = lQuery.match(/^(.*?)\s+(?:under|below|<)\s+(\d+)/i);
       const kamMatch = lQuery.match(/^(.*?)\s+(\d+)\s+se\s+kam/i);
       if (underMatch) {
          apiQ = underMatch[1].trim();
          filters.maxPrice = parseInt(underMatch[2], 10);
       } else if (kamMatch) {
          apiQ = kamMatch[1].trim();
          filters.maxPrice = parseInt(kamMatch[2], 10);
       }
    }
    
    setApiSearchQuery(apiQ);
    activeFiltersRef.current = filters;

    setSearchNonce(Date.now());
    completedProvidersRef.current.clear();
    setIsSearching(true);
    setResults([]);

    // Keep extraction active for 18 seconds — EatSure polls every 1s for up to 15s
    // Store timer handle and clear previous to prevent race conditions
    if ((window as any).searchTimeoutTimer) clearTimeout((window as any).searchTimeoutTimer);
    (window as any).searchTimeoutTimer = setTimeout(() => {
      setIsSearching(false);
    }, 18000);
  };
  const handleDataExtracted = (data: any, providerId?: string) => {
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
          
          const normalizeStr = (s: string) => (s || '').toLowerCase().replace(/\\(eatsure\\)/g, '').replace(/eatsure/g, '').replace(/[^a-z0-9]/g, '').trim();
          
          items.forEach((item: any) => {
             const dishName = item.dishName || item.name || item.title;
             const restName = item.restaurantName || item.restaurant;
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
             
             let restGroup = updated.find(g => {
                 const existingKey = normalizeStr(g.restaurantName);
                 return existingKey.includes(restMatchKey) || restMatchKey.includes(existingKey);
             });
             
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
             let dishGroup = restGroup.dishes.find((d: any) => {
                 const existingDishKey = normalizeStr(d.dishName);
                 const isFuzzyMatch = existingDishKey.includes(dishMatchKey) || dishMatchKey.includes(existingDishKey);
                 if (!isFuzzyMatch) return false;
                 
                 const existingOffer = d.offers.find((o: any) => o.providerName === providerName);
                 if (existingOffer) {
                     const existingPrice = existingOffer.price?.finalPayablePrice || existingOffer.menuPrice;
                     const newPrice = offerPayload.price?.finalPayablePrice || offerPayload.menuPrice;
                     if (existingPrice === newPrice) return true; // It's an exact duplicate, match it so we can skip pushing
                     return false; // It's a variant (Half vs Full), separate it
                 }
                 return true; // Different provider, merge it!
             });
             
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
             
             const isDuplicate = dishGroup.offers.some((o: any) => {
                 const p1 = o.price?.finalPayablePrice || o.menuPrice;
                 const p2 = offerPayload.price?.finalPayablePrice || offerPayload.menuPrice;
                 return o.providerName === providerName && p1 === p2;
             });
             
             if (!isDuplicate) {
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
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* Login WebView Modal — opens real platform website for linking */}
      {loginModal && (
        <LoginWebViewModal
          visible={true}
          providerId={loginModal.id}
          providerName={loginModal.name}
          providerIcon={loginModal.icon}
          loginUrl={loginModal.loginUrl}
          location={location}
          onSuccess={() => {
            const provider = PROVIDERS.find(p => p.id === loginModal.id);
            if (provider) {
              setSearchCategory(provider.category);
            }
            setConnectedProviders(prev => {
              if (prev.includes(loginModal.id)) return prev;
              return [...prev, loginModal.id];
            });
            setLoginModal(null);
            setActiveTab('Search');
            handleSearch(searchQuery || searchValues.query || 'Paneer Tikka');
          }}
          onClose={() => setLoginModal(null)}
        />
      )}

      {/* Platform Checkout Browser Modal — opens platform website directly for order placement */}
      {checkoutModal && (
        <PlatformBrowserModal
          key={checkoutModal.targetUrl}
          visible={true}
          providerName={checkoutModal.providerName}
          providerIcon={checkoutModal.providerIcon}
          providerCategory={checkoutModal.providerCategory}
          brandColor={checkoutModal.brandColor}
          targetUrl={checkoutModal.targetUrl}
          checkoutUrl={checkoutModal.checkoutUrl}
          restaurantUrl={checkoutModal.restaurantUrl}
          cartItems={checkoutModal.cartItems}
          couponCode={checkoutModal.couponCode}
          location={location}
          onClose={() => setCheckoutModal(null)}
        />
      )}

      <View style={styles.header}>
        <Text style={styles.headerTitle}>CompareAll</Text>
        <TouchableOpacity style={styles.locationBar} onPress={() => setIsLocationModalVisible(true)}>
           <Text style={styles.locationIcon}>📍</Text>
           <Text style={styles.locationText} numberOfLines={1}>
              {location ? location.name : 'Select your location...'}
           </Text>
           <Text style={styles.locationChevron}>▼</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {activeTab === 'Search' ? (
          <View style={styles.tabContent}>
            <Text style={styles.title}>Universal Search</Text>
            
            {/* Dynamic Contextual Search Bar */}
            <DynamicSearchBar
              category={searchCategory}
              onSelectCategory={(cat) => {
                setSearchCategory(cat);
                setResults([]);
                setApiSearchQuery('');
                setSearchQuery('');
                setSearchValues({});
              }}
              categoriesList={['Food', 'Commute', 'Groceries', 'Travel', 'Medicine', 'Shopping', 'Services']}
              location={location}
              searchValues={searchValues}
              onChangeValue={(key, val) => setSearchValues(prev => ({ ...prev, [key]: val }))}
              onSubmit={(effectiveQuery) => handleSearch(effectiveQuery)}
              isSearching={isSearching}
            />
            
            {isSearching && (
              <View style={styles.loadingBox}>
                <Text style={{ fontSize: 13, color: '#475569', marginBottom: 8, textAlign: 'center' }}>Getting best options for you available in {location?.name || 'your area'}...</Text>
                {(() => {
                   const categoryProviders = getFilteredProviders().filter(p => p.category.toLowerCase() === searchCategory.toLowerCase());
                   // Only use providers that match current location — never fall back to wrong-location provider
                   const activeProviders = categoryProviders;

                   const activeQuery = apiSearchQuery || searchQuery || searchValues.query || '';
                   if (!activeQuery) return null; // No query — don't fire WebViews

                   return activeProviders.map(provider => {
                      if (!provider) return null;
                      const id = provider.id;
                      const packet = getPacket(id);
                      const searchUrl = packet ? packet.getSearchUrl(activeQuery, location) : provider.url;
                      const injectionScript = packet ? packet.getExtractorInjection(searchUrl, activeQuery, location) : undefined;
                      
                      return (
                        <WebViewExtractor 
                           key={id + '__' + activeQuery + '__' + searchNonce} 
                           url={searchUrl}
                           providerId={id}
                           location={location}
                           isActive={true}
                           onDataExtracted={(data) => handleDataExtracted(data, id)}
                           onError={(err) => {
                             console.log('[CompareAll Extractor] Notice for provider:', id, err);
                             completedProvidersRef.current.add(id);
                           }}
                           injectionScript={injectionScript}
                        />
                      );
                   });
                })()}
              </View>
            )}

            <ScrollView style={styles.resultsContainer} contentContainerStyle={{ paddingBottom: totalCartCount > 0 ? 100 : 20 }}>
              {results.map((restGroup, index) => {
                const k = restGroup.matchKey || index.toString();
                // Filter dishes based on search query
                const activeQuery = (apiSearchQuery || searchQuery || searchValues.query || '').toLowerCase().trim();
                let displayDishes = restGroup.dishes;
                
                if (activeQuery) {
                    const exactMatches = restGroup.dishes.filter((d: any) => d.dishName.toLowerCase().includes(activeQuery));
                    if (exactMatches.length > 0) {
                        displayDishes = exactMatches;
                    }
                }

                                  const providersInRest = Array.from(new Set(restGroup.dishes.flatMap((d: any) => d.offers.map((o: any) => o.providerName))));
                  return (
                    <View key={k} style={styles.premiumRestCard}>
                      <View style={styles.restCardHeader}>
                          <Text style={styles.restTitle}>{restGroup.restaurantName}</Text>
                          <Text style={{color: '#64748b', fontSize: 13, marginTop: 4}}>Multiple Cuisines � Fast Food</Text>
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
            </ScrollView>
          </View>
        ) : (
          <View style={{flex: 1}}>
            <View style={styles.categoryBar}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                 {CATEGORIES.map(cat => (
                    <TouchableOpacity 
                       key={cat} 
                       style={[styles.categoryTab, activeCategory === cat && styles.categoryTabActive]} 
                       onPress={() => setActiveCategory(cat)}
                    >
                       <Text style={[styles.categoryTabText, activeCategory === cat && styles.categoryTabTextActive]}>{cat}</Text>
                    </TouchableOpacity>
                 ))}
              </ScrollView>
            </View>

            <ScrollView style={styles.tabContent} contentContainerStyle={{ paddingBottom: totalCartCount > 0 ? 100 : 20 }}>
              <View style={styles.connectionsHeaderBox}>
                <Text style={styles.pageTitle}>Link Accounts</Text>
                <TouchableOpacity style={styles.locBadge} onPress={() => setIsLocationModalVisible(true)}>
                  <Text style={styles.locBadgeText}>📍 {location ? location.name : 'Select Location'} ✏️</Text>
                </TouchableOpacity>
              </View>

              {getFilteredProviders().filter(p => p.category === activeCategory).length === 0 ? (
                <View style={styles.noPlatformBox}>
                  <Text style={styles.noPlatformIcon}>📍</Text>
                  <Text style={styles.noPlatformTitle}>No {activeCategory} Platforms in {location?.name || 'this area'}</Text>
                  <Text style={styles.noPlatformSub}>
                    None of the integrated {activeCategory.toLowerCase()} apps currently operate in your selected location.
                  </Text>
                  <TouchableOpacity style={styles.changeLocBtn} onPress={() => setIsLocationModalVisible(true)}>
                    <Text style={styles.changeLocBtnText}>Change Location</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                Array.from(new Set(getFilteredProviders().filter(p => p.category === activeCategory).map(p => p.subcategory))).map(subcat => {
                  const subcatProviders = getFilteredProviders().filter(p => p.category === activeCategory && p.subcategory === subcat);
                  if (subcatProviders.length === 0) return null;
                  
                  return (
                    <View key={subcat} style={styles.subcatSection}>
                      <Text style={styles.subcatTitle}>{subcat}</Text>
                      <View style={styles.gridContainer}>
                        {subcatProviders.map(provider => {
                          const isConnected = connectedProviders.includes(provider.id);
                          return (
                            <View key={provider.id} style={styles.gridCard}>
                              <View style={styles.gridCardTop}>
                                <View style={styles.gridIconBox}>
                                  <Text style={styles.gridIconText}>{provider.icon}</Text>
                                </View>
                                <Text style={styles.gridProviderName}>{provider.name}</Text>
                              </View>

                              {isConnected ? (
                                <View style={{ width: '100%', alignItems: 'center', marginTop: 8 }}>
                                  <View style={styles.connectedBadgeBox}>
                                    <Text style={styles.connectedBadgeText}>✓ Connected</Text>
                                  </View>
                                  <TouchableOpacity 
                                    style={styles.disconnectLinkBtn} 
                                    onPress={() => handleDisconnect(provider.id)}
                                    activeOpacity={0.7}
                                  >
                                    <Text style={styles.disconnectLinkText}>Disconnect</Text>
                                  </TouchableOpacity>
                                </View>
                              ) : (
                                <TouchableOpacity
                                  style={styles.linkNowBtn}
                                  onPress={() => {
                                    setLoginModal({
                                      id: provider.id,
                                      name: provider.name,
                                      icon: provider.icon,
                                      loginUrl: provider.loginUrl || provider.url,
                                    });
                                  }}
                                >
                                  <Text style={styles.linkNowText}>LINK NOW</Text>
                                </TouchableOpacity>
                              )}
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  );
                })
              )}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Floating Sticky Cart Bar */}
      {totalCartCount > 0 && (
        <TouchableOpacity
          style={styles.floatingCartBar}
          activeOpacity={0.9}
          onPress={() => setIsCartModalVisible(true)}
        >
          <View style={styles.floatingCartLeft}>
            <View style={styles.floatingCartBadge}>
              <Text style={styles.floatingCartBadgeText}>{totalCartCount}</Text>
            </View>
            <View>
              <Text style={styles.floatingCartPrice}>₹{totalCartAmount}</Text>
              <Text style={styles.floatingCartSub}>Universal Basket</Text>
            </View>
          </View>
          <View style={styles.floatingCartRight}>
            <Text style={styles.floatingCartActionText}>VIEW CART →</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Search')}>
          <Text style={styles.navIcon}>🔍</Text>
          <Text style={[styles.navText, activeTab === 'Search' && styles.navTextActive]}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Connections')}>
          <Text style={styles.navIcon}>🔗</Text>
          <Text style={[styles.navText, activeTab === 'Connections' && styles.navTextActive]}>Connections</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setIsCartModalVisible(true)}>
          <View style={styles.navCartIconBox}>
            <Text style={styles.navIcon}>🛒</Text>
            {totalCartCount > 0 && (
              <View style={styles.navBadge}>
                <Text style={styles.navBadgeText}>{totalCartCount}</Text>
              </View>
            )}
          </View>
          <Text style={[styles.navText, activeTab === 'Cart' && styles.navTextActive]}>Cart</Text>
        </TouchableOpacity>
      </View>

      {/* Universal Cart Modal */}
      <UniversalCartModal
        visible={isCartModalVisible}
        cartItems={cartItems}
        connectedProviders={connectedProviders}
        onUpdateQuantity={handleUpdateCartQty}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onCheckout={handleCartCheckout}
        onClose={() => setIsCartModalVisible(false)}
      />


      {/* Restaurant Menu Modal */}
      <Modal visible={!!selectedMenuRest} animationType="slide" transparent={true} onRequestClose={() => { setSelectedMenuRest(null); setExpandedDishIndex(null); }}>
          <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end'}}>
              <View style={{flex: 0.9, backgroundColor: '#f8fafc', borderTopLeftRadius: 24, borderTopRightRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 10}}>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, borderBottomWidth: 1, borderBottomColor: '#e2e8f0'}}>
                      <Text style={{fontSize: 20, fontWeight: 'bold', color: '#1e293b'}}>{selectedMenuRest?.restaurantName}</Text>
                      <TouchableOpacity onPress={() => { setSelectedMenuRest(null); setExpandedDishIndex(null); }} style={{padding: 8, backgroundColor: '#f1f5f9', borderRadius: 20}}>
                          <Text style={{fontSize: 16, fontWeight: 'bold', color: '#64748b'}}>✕</Text>
                      </TouchableOpacity>
                  </View>
                  <ScrollView style={{flex: 1, padding: 16}}>
                      {selectedMenuRest && (() => {
                          let displayDishes = selectedMenuRest.dishes;
                          const activeQuery = (apiSearchQuery || searchQuery || searchValues.query || '').toLowerCase().trim();
                          if (activeQuery) {
                              const exactMatches = selectedMenuRest.dishes.filter((d: any) => d.dishName.toLowerCase().includes(activeQuery));
                              if (exactMatches.length > 0) {
                                  displayDishes = exactMatches;
                              }
                          }

                          // Calculate Available Coupons
                          const uniqueCoupons: any[] = [];
                          const seenCodes = new Set();
                          selectedMenuRest.dishes.forEach((dish: any) => {
                              dish.offers.forEach((offer: any) => {
                                  if (offer.couponCode && !seenCodes.has(offer.couponCode)) {
                                      const providerData = PROVIDERS.find(p => p.name.toLowerCase() === offer.providerName.toLowerCase());
                                      if (providerData && connectedProviders.includes(providerData.id)) {
                                          seenCodes.add(offer.couponCode);
                                          uniqueCoupons.push({
                                              code: offer.couponCode,
                                              desc: offer.couponDescription || `Save with ${offer.couponCode}`,
                                              providerName: offer.providerName,
                                              providerIcon: providerData.icon || '🍽️'
                                          });
                                      }
                                  }
                              });
                          });

                          return (
                             <View style={styles.dishesContainer}>
                                {uniqueCoupons.length > 0 && (
                                    <View style={{ marginBottom: 20 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#111' }}>Available coupons</Text>
                                            <Text style={{ fontSize: 13, color: '#64748b' }}>{uniqueCoupons.length} found</Text>
                                        </View>
                                        <Text style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>Best coupon auto-applies in cart</Text>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ overflow: 'visible' }}>
                                            {uniqueCoupons.map((coupon, idx) => (
                                                <View key={idx} style={{ 
                                                    width: 220, 
                                                    marginRight: 12, 
                                                    backgroundColor: '#fff', 
                                                    borderRadius: 12, 
                                                    padding: 12, 
                                                    borderWidth: 1, 
                                                    borderColor: '#e2e8f0',
                                                    shadowColor: '#000',
                                                    shadowOffset: { width: 0, height: 1 },
                                                    shadowOpacity: 0.05,
                                                    shadowRadius: 2,
                                                    elevation: 2
                                                }}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                                        <Text style={{ fontSize: 14, marginRight: 6 }}>{coupon.providerIcon}</Text>
                                                        <Text style={{ fontSize: 13, fontWeight: '600', color: '#334155' }}>{coupon.providerName} • Coupon</Text>
                                                    </View>
                                                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1e293b', marginBottom: 4 }}>{coupon.code}</Text>
                                                    <Text style={{ fontSize: 12, color: '#64748b' }} numberOfLines={2}>{coupon.desc}</Text>
                                                </View>
                                            ))}
                                        </ScrollView>
                                    </View>
                                )}
                             {displayDishes.map((dish: any, dIdx: number) => {
                                return (
                                    <View key={dIdx} style={[styles.dishCard, { padding: 0, overflow: 'hidden' }]}>
                                          <View style={{padding: 15}}>
                                              <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 6}}>
                                                  <View style={{width: 12, height: 12, borderWidth: 1, borderColor: '#16a34a', alignItems: 'center', justifyContent: 'center', marginRight: 6}}>
                                                      <View style={{width: 6, height: 6, backgroundColor: '#16a34a', borderRadius: 3}} />
                                                  </View>
                                                  <Text style={{fontSize: 12, color: '#16a34a', fontWeight: 'bold'}}>Same price on available apps</Text>
                                              </View>

                                              <Text style={[styles.dishTitle, {flex: 1}]} numberOfLines={2}>{dish.dishName}</Text>
                                              
                                              <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 4, marginBottom: 8}}>
                                                  <View style={{backgroundColor: '#fef08a', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginRight: 8}}>
                                                      <Text style={{fontSize: 10, fontWeight: 'bold', color: '#ca8a04'}}>RECOMMENDED</Text>
                                                  </View>
                                              </View>

                                              {dish.offers.map((offer: any, oIdx: number) => {
                                                  const raw = offer.price?.basePrice || offer.price?.menuPrice || offer.price?.finalPayablePrice || 0;
                                                  return (
                                                      <View key={oIdx} style={{flexDirection: 'row', alignItems: 'center', marginTop: 6}}>
                                                          <View style={{width: 6, height: 6, borderRadius: 3, backgroundColor: '#cbd5e1', marginRight: 6}} />
                                                          <Text style={{fontSize: 14, color: '#334155', width: 80}}>{offer.providerName}</Text>
                                                          <Text style={{fontSize: 14, fontWeight: 'bold', color: '#1e293b'}}>Rs {raw}</Text>
                                                      </View>
                                                  );
                                              })}
                                          </View>

                                          <View style={{padding: 15, borderTopWidth: 1, borderTopColor: '#f1f5f9', alignItems: 'center'}}>
                                              {(() => {
                                                  const inCartItem = cartItems.find(i => i.id === dish.dishName);
                                                  const qty = inCartItem ? inCartItem.quantity : 0;
                                                  
                                                  if (qty > 0) {
                                                      return (
                                                          <View style={styles.stepperContainer}>
                                                              <TouchableOpacity onPress={() => handleUpdateCartQuantity(dish.dishName, qty - 1)} style={styles.stepperBtn}><Text style={styles.stepperBtnText}>-</Text></TouchableOpacity>
                                                              <Text style={styles.stepperVal}>{qty}</Text>
                                                              <TouchableOpacity onPress={() => handleUpdateCartQuantity(dish.dishName, qty + 1)} style={styles.stepperBtn}><Text style={styles.stepperBtnText}>+</Text></TouchableOpacity>
                                                          </View>
                                                      );
                                                  } else {
                                                      return (
                                                          <TouchableOpacity 
                                                              style={{backgroundColor: '#fff', borderWidth: 1, borderColor: '#16a34a', paddingHorizontal: 32, paddingVertical: 8, borderRadius: 8}}
                                                              onPress={() => {
                                                                  const bestOffer = dish.offers.sort((a: any, b: any) => (a.price?.finalPayablePrice||0) - (b.price?.finalPayablePrice||0))[0];
                                                                  if (bestOffer) handleAddToCart(bestOffer, dish.dishName);
                                                              }}
                                                          >
                                                              <Text style={{color: '#16a34a', fontWeight: 'bold', fontSize: 16}}>ADD</Text>
                                                          </TouchableOpacity>
                                                      );
                                                  }
                                              })()}
                                          </View>
                                      </View>
                              })}
                                            </View>
                                        )}
                                    </View>
                                );
                            })}
                        </View>
                          );
                      })()}
                  </ScrollView>
              </View>
          </View>
      </Modal>

      {/* Location Modal */}
      <Modal visible={isLocationModalVisible} animationType="slide" transparent={true} onRequestClose={() => setIsLocationModalVisible(false)}>
        <View style={styles.locModalOverlay}>
          <View style={styles.locationModal}>
            <View style={styles.locModalHeader}>
              <Text style={styles.locModalTitle}>Select Location</Text>
              <TouchableOpacity onPress={() => setIsLocationModalVisible(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.autoDetectBtn} onPress={fetchCurrentLocation} disabled={isFetchingLocation}>
              <Text style={styles.autoDetectText}>{isFetchingLocation ? 'Detecting...' : '📍 Use Current GPS Location'}</Text>
            </TouchableOpacity>
            
            <Text style={styles.locOrText}>— OR —</Text>
            
            <View style={styles.manualLocationBox}>
              <TextInput 
                style={styles.manualInput} 
                placeholder="Enter city or area name..." 
                placeholderTextColor="#999"
                value={manualLocationInput}
                onChangeText={setManualLocationInput}
                onSubmitEditing={handleManualLocationSubmit}
              />
              <TouchableOpacity style={styles.manualSubmitBtn} onPress={handleManualLocationSubmit} disabled={isFetchingLocation}>
                <Text style={styles.manualSubmitText}>Go</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Detailed Platform Breakdown Modal */}
      {detailAnalysisModal && (
        <Modal
          visible={true}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setDetailAnalysisModal(null)}
        >
          <View style={styles.detailModalBackdrop}>
            <View style={styles.detailModalSheet}>
              {/* Modal Header */}
              <View style={styles.detailModalHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.detailModalProvider}>
                    {detailAnalysisModal.offer.providerName} Full Price Breakdown
                  </Text>
                  <Text style={styles.detailModalDish} numberOfLines={2}>
                    {detailAnalysisModal.dishTitle}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setDetailAnalysisModal(null)} style={styles.detailCloseBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Text style={styles.detailCloseText}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Price Breakdown Table */}
              <View style={styles.breakdownCard}>
                <Text style={styles.breakdownHeading}>💵 Transparent Price Calculation</Text>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Base Menu Price</Text>
                  <Text style={styles.breakdownVal}>₹{detailAnalysisModal.offer.price?.basePrice || detailAnalysisModal.offer.menuPrice}</Text>
                </View>
                {detailAnalysisModal.offer.autoCouponSavings > 0 && (
                  <View style={styles.breakdownRow}>
                    <Text style={[styles.breakdownLabel, { color: '#16a34a', fontWeight: '600' }]}>
                      🏷️ Coupon Discount ({detailAnalysisModal.offer.couponCode})
                    </Text>
                    <Text style={[styles.breakdownVal, { color: '#16a34a', fontWeight: 'bold' }]}>
                      -₹{detailAnalysisModal.offer.autoCouponSavings}
                    </Text>
                  </View>
                )}
                <View style={styles.breakdownDivider} />
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownFinalLabel}>Final Net Payable</Text>
                  <Text style={styles.breakdownFinalVal}>₹{detailAnalysisModal.offer.price?.finalPayablePrice}</Text>
                </View>
                {!detailAnalysisModal.offer.isAccountConnected && detailAnalysisModal.offer.potentialSavings > 0 && (
                  <View style={{ backgroundColor: '#eff6ff', borderRadius: 8, padding: 10, marginTop: 10, borderWidth: 1, borderColor: '#bfdbfe' }}>
                    <Text style={{ fontSize: 12, color: '#1e40af', lineHeight: 16 }}>
                      💡 Link your <Text style={{ fontWeight: 'bold' }}>{detailAnalysisModal.offer.providerName}</Text> account to automatically unlock <Text style={{ fontWeight: 'bold' }}>₹{detailAnalysisModal.offer.potentialSavings} coupon discount</Text> with {detailAnalysisModal.offer.couponCode}!
                    </Text>
                  </View>
                )}
              </View>

              {/* Available Extra Offers & Perks */}
              {detailAnalysisModal.offer.additionalOffers && detailAnalysisModal.offer.additionalOffers.length > 0 && (
                <View style={styles.extraPerksBox}>
                  <Text style={styles.extraPerksHeading}>🎁 Available Platform Perks & Bank Offers</Text>
                  <ScrollView style={{ maxHeight: 150 }} showsVerticalScrollIndicator={false}>
                    {detailAnalysisModal.offer.additionalOffers.map((ao: any, idx: number) => (
                      <View key={idx} style={styles.perkRow}>
                        <Text style={styles.perkIcon}>{ao.icon}</Text>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.perkTitle}>{ao.title}</Text>
                          <Text style={styles.perkDesc}>{ao.description}</Text>
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.detailModalActions}>
                <TouchableOpacity
                  style={styles.detailAddToCartBtn}
                  onPress={() => {
                    handleAddToCart(detailAnalysisModal.offer, detailAnalysisModal.dishTitle);
                    setDetailAnalysisModal(null);
                  }}
                >
                  <Text style={styles.detailAddToCartText}>+ Add to Basket</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.detailOrderDirectBtn}
                  onPress={() => {
                    const of = detailAnalysisModal.offer;
                    const providerId = PROVIDERS.find(p => p.name.toLowerCase() === of.providerName.toLowerCase())?.id || PROVIDERS[0]?.id;
                    handleCartCheckout(providerId, of.restaurantName, of.couponCode, of.restaurantUrl);
                    setDetailAnalysisModal(null);
                  }}
                >
                  <Text style={styles.detailOrderDirectText}>Order on {detailAnalysisModal.offer.providerName} →</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#111',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 15,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  locationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
    maxWidth: '90%',
  },
  locationIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  locationText: {
    color: '#ccc',
    fontSize: 13,
    flexShrink: 1,
  },
  locationChevron: {
    color: '#888',
    fontSize: 10,
    marginLeft: 6,
  },
  content: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    padding: 20,
  },
  providerList: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333'
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  searchBox: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  searchBtn: {
    backgroundColor: '#007AFF',
    padding: 15,
    justifyContent: 'center',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  searchBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingBox: {
    padding: 20,
    backgroundColor: '#e6f2ff',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  resultsContainer: {
    flex: 1,
  },
  
  premiumRestCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    overflow: 'hidden',
  },
  restCardHeader: {
    padding: 20,
    backgroundColor: '#111',
  },
  restTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 10,
  },
  platformsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  platformBadge: {
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#444',
  },
  platformBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  openMenuBtn: {
    backgroundColor: '#f8fafc',
    padding: 15,
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
  },
  openMenuBtnText: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '700',
  },
  dishesContainer: {
    padding: 15,
    backgroundColor: '#f8fafc',
  },
  dishCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  dishTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  dishBestPriceBox: {
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  dishBestPrice: {
    fontSize: 13,
    color: '#15803d',
    fontWeight: 'bold',
  },

  resultCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  resultBestPriceBox: {
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  resultBestPrice: {
    fontSize: 13,
    color: '#15803d',
    fontWeight: 'bold',
  },
  offerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
  },
  offerItemWinner: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#86efac',
    marginVertical: 4,
  },
  winnerBadge: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  winnerBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '900',
  },
  offerMainInfo: {
    flex: 1,
    paddingRight: 10,
  },
  offerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  autoAppliedPill: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#86efac',
  },
  autoAppliedPillText: {
    color: '#15803d',
    fontSize: 10,
    fontWeight: 'bold',
  },
  priceRowBig: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 2,
    gap: 8,
  },
  effectivePriceBig: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  strikeMenuPrice: {
    fontSize: 13,
    color: '#94a3b8',
    textDecorationLine: 'line-through',
  },
  couponSavingsHighlight: {
    fontSize: 12,
    color: '#16a34a',
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 4,
  },
  connectToUnlockBox: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  connectToUnlockText: {
    fontSize: 11,
    color: '#1d4ed8',
    fontWeight: '600',
  },
  offerProvider: {
    fontWeight: '700',
    fontSize: 15,
    color: '#111',
  },
  offerPrice: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 2,
  },
  basePrice: {
    color: '#888',
    textDecorationLine: 'line-through',
    fontWeight: 'normal',
  },
  discount: {
    color: 'green',
    fontSize: 13,
    marginTop: 2,
    fontWeight: '500',
  },
  detailInfoIcon: {
    fontSize: 11,
    color: '#0284c7',
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: '600',
  },
  platformDropdownToggle: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 8,
    alignItems: 'center',
  },
  platformDropdownToggleText: {
    fontSize: 12,
    color: '#0284c7',
    fontWeight: 'bold',
  },
  secondaryOfferItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderColor: '#f1f5f9',
    backgroundColor: '#fafafa',
    borderRadius: 8,
    marginTop: 6,
  },
  detailModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  detailModalSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  detailModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#f1f5f9',
  },
  detailModalProvider: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  detailModalDish: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  detailCloseBtn: {
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailCloseText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: 'bold',
  },
  breakdownCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
  },
  breakdownHeading: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 10,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  breakdownLabel: {
    fontSize: 13,
    color: '#475569',
  },
  breakdownVal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e293b',
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: '#cbd5e1',
    marginVertical: 8,
  },
  breakdownFinalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  breakdownFinalVal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  extraPerksBox: {
    backgroundColor: '#fefce8',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#fef08a',
    marginBottom: 16,
  },
  extraPerksHeading: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#854d0e',
    marginBottom: 8,
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 4,
    gap: 8,
  },
  perkIcon: {
    fontSize: 16,
  },
  perkTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#713f12',
  },
  perkDesc: {
    fontSize: 11,
    color: '#a16207',
  },
  detailModalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  detailAddToCartBtn: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#16a34a',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  detailAddToCartText: {
    color: '#16a34a',
    fontSize: 14,
    fontWeight: 'bold',
  },
  detailOrderDirectBtn: {
    flex: 1.2,
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  detailOrderDirectText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  benefit: {
    color: '#d97706',
    fontSize: 12,
    marginTop: 3,
    fontWeight: '600',
  },
  additionalOfferBadge: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginRight: 4,
    marginBottom: 4,
  },
  additionalOfferBadgeText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '500',
  },
  cartActionContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  addToCartBtn: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#16a34a',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    shadowColor: '#16a34a',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  addToCartBtnText: {
    color: '#16a34a',
    fontWeight: 'bold',
    fontSize: 13,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#86efac',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  stepperBtn: {
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  stepperQtyText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#16a34a',
    paddingHorizontal: 8,
  },
  categoryBar: {
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingHorizontal: 10,
  },
  categoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: '#f5f5f5',
  },
  categoryTabActive: {
    backgroundColor: '#000',
  },
  categoryTabText: {
    color: '#666',
    fontWeight: '600',
  },
  categoryTabTextActive: {
    color: '#fff',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333'
  },
  subcatSection: {
    marginBottom: 30,
  },
  subcatTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
    color: '#111',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  gridCardExpanded: {
    width: '100%',
  },
  gridCardTop: {
    alignItems: 'center',
    marginBottom: 15,
  },
  gridIconBox: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  gridIconText: {
    fontSize: 26,
  },
  gridProviderName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  linkNowBtn: {
    backgroundColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  linkNowText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  connectedBadgeBox: {
    backgroundColor: '#dcfce7',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#86efac',
    width: '100%',
    alignItems: 'center',
  },
  connectedBadgeText: {
    color: '#15803d',
    fontWeight: 'bold',
    fontSize: 12,
  },
  disconnectLinkBtn: {
    marginTop: 6,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  disconnectLinkText: {
    color: '#94a3b8',
    fontSize: 11,
    textDecorationLine: 'underline',
  },
  authContainer: {
    width: '100%',
    marginTop: 10,
  },
  inputCol: {
    width: '100%',
  },
  nativeInputSmall: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  actionBtnSmall: {
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  actionBtnLoading: {
    backgroundColor: '#e0e0e0',
  },
  actionBtnTextSmall: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cancelBtnSmall: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#888',
    fontWeight: '600',
    fontSize: 13,
  },
  orText: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#888',
    fontSize: 12,
    fontWeight: '600'
  },
  googleBtn: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  googleBtnText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  modalCloseBtn: {
    padding: 5
  },
  modalCloseText: {
    color: '#ff3b30',
    fontWeight: '600'
  },
  floatingCartBar: {
    position: 'absolute',
    bottom: 85,
    left: 16,
    right: 16,
    backgroundColor: '#16a34a',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#16a34a',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  floatingCartLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  floatingCartBadge: {
    backgroundColor: '#fff',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  floatingCartBadgeText: {
    color: '#16a34a',
    fontWeight: 'bold',
    fontSize: 14,
  },
  floatingCartPrice: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  floatingCartSub: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    fontWeight: '500',
  },
  floatingCartRight: {
    backgroundColor: 'rgba(0,0,0,0.15)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  floatingCartActionText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  navCartIconBox: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBadge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: '#ef4444',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  navBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingBottom: 25,
    paddingTop: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  navText: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
  },
  navTextActive: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  locModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  locationModal: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 300,
  },
  locModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  locModalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeBtn: {
    color: '#888',
    fontSize: 24,
  },
  autoDetectBtn: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  autoDetectText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  locOrText: {
    color: '#666',
    textAlign: 'center',
    marginVertical: 10,
  },
  manualLocationBox: {
    flexDirection: 'row',
    marginTop: 10,
  },
  manualInput: {
    flex: 1,
    backgroundColor: '#333',
    color: '#fff',
    padding: 15,
    borderRadius: 12,
    marginRight: 10,
  },
  manualSubmitBtn: {
    backgroundColor: '#4caf50',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  manualSubmitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  connectionsHeaderBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  locBadge: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  locBadgeText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  noPlatformBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    marginTop: 20,
    backgroundColor: '#18181b',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  noPlatformIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  noPlatformTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 6,
  },
  noPlatformSub: {
    fontSize: 13,
    color: '#a1a1aa',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  changeLocBtn: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  changeLocBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },

  proModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  proBackBtn: {
    marginRight: 16,
  },
  proModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111',
    flex: 1,
  },
  proSearchSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 8,
    borderBottomColor: '#f1f1f1',
  },
  proSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 16,
  },
  proMenuBtn: {
    borderLeftWidth: 1,
    borderLeftColor: '#ddd',
    paddingLeft: 12,
    marginLeft: 8,
  },
  proFilterChips: {
    flexDirection: 'row',
  },
  proChipActive: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 20,
    marginRight: 10,
  },
  proChipTextActive: {
    color: '#2563eb',
    fontWeight: '600',
    fontSize: 13,
  },
  proChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 20,
    marginRight: 10,
  },
  proChipText: {
    color: '#4b5563',
    fontWeight: '500',
    fontSize: 13,
  },
  proSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 18,
    backgroundColor: '#fff',
  },
  proSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
  },
  proSectionExpand: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
  },
  proDishRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  proDishInfo: {
    flex: 1,
    paddingRight: 16,
  },
  proBestPriceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  proVegIcon: {
    width: 12,
    height: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  proVegDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  proBestPriceText: {
    color: '#16a34a',
    fontSize: 11,
    fontWeight: 'bold',
  },
  proDishName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 6,
  },
  proDishTags: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 6,
    gap: 6,
  },
  proTagStars: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  proTagReorder: {
    backgroundColor: '#ffe4e6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  proTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
  },
  proRecommendedText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#6b7280',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  proPriceCompareList: {
    marginBottom: 10,
    backgroundColor: '#fafafa',
    padding: 8,
    borderRadius: 8,
  },
  proPriceCompareItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  proDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  proPriceProvName: {
    fontSize: 12,
    color: '#444',
    width: 60,
  },
  proPriceStrike: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 4,
  },
  proPriceFinal: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#111',
  },
  proCouponApplied: {
    color: '#16a34a',
    fontSize: 12,
    fontWeight: 'bold',
  },
  proDishDesc: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 18,
  },
  proDishImageWrapper: {
    width: 130,
    alignItems: 'center',
  },
  proDishImgPlaceholder: {
    width: 130,
    height: 130,
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  proDishImgText: {
    fontSize: 40,
    color: '#cbd5e1',
    fontWeight: 'bold',
  },
  proAddBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 32,
    marginTop: -16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  proAddBtnText: {
    color: '#ef4444',
    fontWeight: '900',
    fontSize: 16,
  },
});
