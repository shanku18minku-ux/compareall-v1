import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Modal, Vibration } from 'react-native';
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
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  // Universal Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartModalVisible, setIsCartModalVisible] = useState(false);
  const [expandedPlatformGroups, setExpandedPlatformGroups] = useState<{ [key: string]: boolean }>({});
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

  // ── Cart Handlers ──────────────────────────────────────────────────────────
  const handleAddToCart = (offer: any, groupTitle: string) => {
    Vibration.vibrate(25);
    const providerId = PROVIDERS.find(p => p.name.toLowerCase() === offer.providerName.toLowerCase())?.id || 'food-a';
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
      // Open the restaurant menu page first so Swiggy has active store & menu context
      let initialUrl = restaurantUrl;
      if (!initialUrl) {
        if (restaurantName && restaurantName !== 'General' && restaurantName !== 'Restaurant Order') {
          initialUrl = `https://www.swiggy.com/search?query=${encodeURIComponent(restaurantName)}`;
        } else {
          initialUrl = provider.url;
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
      const results = await Location.geocodeAsync(manualLocationInput);
      if (results && results.length > 0) {
        const { latitude, longitude } = results[0];
        const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
        
        let name = manualLocationInput;
        if (geocode && geocode.length > 0) {
          const place = geocode[0];
          name = [place.name, place.street, place.city, place.region].filter(Boolean).join(', ');
        }
        
        setLocation({ latitude, longitude, name });
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
     if (!location || !location.name) return PROVIDERS;
     const locName = location.name.toLowerCase();
     const isRailwayStation = locName.includes('station') || locName.includes('railway') || locName.includes('junction') || locName.includes('cantt') || locName.includes('terminal');

     return PROVIDERS.filter(p => {
         // Train food delivery apps ONLY appear if the user is at a railway station
         if (p.subcategory === 'Train Food Delivery' || p.regions.includes('station')) {
             return isRailwayStation;
         }
         if (p.regions.includes('all')) return true;
         return p.regions.some(region => locName.includes(region.toLowerCase()));
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
    setIsSearching(true);
    setResults([]);

    // Safety timeout in case provider is offline
    setTimeout(() => {
      setIsSearching(prev => {
        return false;
      });
    }, 18000);
  };

  const handleDataExtracted = (data: any) => {
    const items = data.data || data.items || (Array.isArray(data) ? data : []);
    if (items && items.length > 0) {
       setResults(prev => {
          const updated = [...prev];
          items.forEach((offer: any) => {
             const title = offer.title || offer.name || 'Dish Item';
             const menuPrice = offer.menuPrice || (typeof offer.price === 'object' ? Number(offer.price.menuPrice || offer.price.finalPayablePrice) : (Number(offer.price) || 0));
             const basePrice = typeof offer.price === 'object' ? Number(offer.price.basePrice) : (Number(offer.originalPrice || offer.price) || menuPrice);
             const providerName = offer.providerName || 'Swiggy';
             const offerText = offer.offerText || offer.metadata?.discountText || '';
             
             const additionalOffers = offer.additionalOffers || offer.metadata?.additionalOffers || [];
             const couponCode = offer.couponCode || offer.metadata?.couponCode || '';
             const couponDescription = offer.couponDescription || offer.metadata?.couponDescription || '';
             const couponPercent = offer.couponPercent || 0;
             const couponMaxCap = offer.couponMaxCap || 0;
             const couponFlat = offer.couponFlat || 0;

             // Auto-calculate exact coupon savings
             let autoCouponSavings = offer.autoCouponSavings || 0;
             if (!autoCouponSavings) {
               if (couponFlat > 0) {
                 autoCouponSavings = couponFlat;
               } else if (couponPercent > 0) {
                 const raw = Math.round((menuPrice * couponPercent) / 100);
                 autoCouponSavings = couponMaxCap > 0 ? Math.min(raw, couponMaxCap) : raw;
               }
             }

             const effectiveFinalPrice = Math.max(0, menuPrice - autoCouponSavings);
             const totalSavings = Math.max(0, (basePrice - menuPrice) + autoCouponSavings);

             const offerPayload = {
               providerName,
               dishId: offer.dishId || offer.metadata?.dishId,
               dishName: offer.dishName || offer.metadata?.dishName || title,
               restaurantName: offer.restaurantName || offer.metadata?.restaurantName,
               restaurantUrl: offer.restaurantUrl || offer.metadata?.restaurantUrl,
               menuPrice: menuPrice,
               autoCouponSavings: autoCouponSavings,
               effectivePrice: effectiveFinalPrice,
               price: {
                 finalPayablePrice: effectiveFinalPrice,
                 menuPrice: menuPrice,
                 basePrice: basePrice,
                 discount: totalSavings,
               },
               offerText,
               couponCode,
               couponDescription,
               couponPercent,
               couponMaxCap,
               couponFlat,
               additionalOffers,
               accountBenefits: []
             };
             
             const dishName = offer.dishName || offer.metadata?.dishName || title;
             const restName = offer.restaurantName || offer.metadata?.restaurantName || '';
             const displayTitle = restName ? `${dishName} - ${restName}` : dishName;

             // Robust normalization to combine identical dishes from Swiggy & Zomato into 1 card
             const normalizeDish = (n: string) => {
               return (n || '').toLowerCase()
                 .replace(/\b\d+\s*(?:pic|pcs|pc|pieces|slice|slices)\b/g, '')
                 .replace(/\b(?:half|full|quarter|small|medium|large|serves\s*\d+(?:-\d+)?)\b/g, '')
                 .replace(/[^a-z0-9]/g, ' ')
                 .replace(/\s+/g, ' ')
                 .trim();
             };

             const normalizeRest = (n: string) => {
               return (n || '').toLowerCase()
                 .replace(/\bh\s*m\b/g, 'hm')
                 .replace(/\b(?:and|&|restaurant|hotel|resort|sweets|dhaba|cafe|bhojnalaya|kitchen)\b/g, '')
                 .replace(/[^a-z0-9]/g, '')
                 .trim();
             };

             const cleanDish = normalizeDish(dishName);
             const cleanRest = normalizeRest(restName);
             const matchKey = cleanRest ? `${cleanDish}__${cleanRest}` : cleanDish;

             const existingGroup = updated.find(g => {
               if (g.matchKey === matchKey) return true;
               if (cleanRest && g.matchKey) {
                 const parts = g.matchKey.split('__');
                 const gDish = parts[0] || '';
                 const gRest = parts[1] || '';
                 if (gRest && (gRest.includes(cleanRest) || cleanRest.includes(gRest))) {
                   if (gDish && (gDish.includes(cleanDish) || cleanDish.includes(gDish))) {
                     return true;
                   }
                 }
               }
               return false;
             });

             if (existingGroup) {
                 // Check if offer for this provider already exists, update or append
                 const existingProviderIdx = existingGroup.offers.findIndex((o: any) => o.providerName.toLowerCase() === providerName.toLowerCase());
                 if (existingProviderIdx >= 0) {
                   existingGroup.offers[existingProviderIdx] = offerPayload;
                 } else {
                   existingGroup.offers.push(offerPayload);
                 }
             } else {
                 updated.push({ 
                   title: displayTitle,
                   matchKey: matchKey,
                   lowestPrice: effectiveFinalPrice, 
                   savings: autoCouponSavings, 
                   offers: [offerPayload] 
                 });
             }
          });
          updated.forEach(g => {
              // Sort offers inside the group so the cheapest rupee price is ALWAYS #1
              g.offers.sort((a: any, b: any) => a.price.finalPayablePrice - b.price.finalPayablePrice);
              const effectivePrices = g.offers.map((o: any) => o.price.finalPayablePrice);
              const maxMenuPrices = g.offers.map((o: any) => o.price.basePrice || o.price.menuPrice);
              g.lowestPrice = effectivePrices[0];
              g.bestProvider = g.offers[0]?.providerName;
              g.savings = Math.max(0, Math.max(...maxMenuPrices) - g.lowestPrice);
          });
          // Smart Relevance-First + Lowest Rupee Price Dual Ranking
          const currentQuery = (searchQuery || searchValues.query || '').toLowerCase().trim();
          const queryTokens = currentQuery.split(/\s+/).filter((t: string) => t.length > 1);

          const getRelevanceScore = (title: string) => {
            const lowerTitle = title.toLowerCase();
            if (queryTokens.length === 0) return 0;
            if (lowerTitle.includes(currentQuery)) return 100;
            const allWordsMatch = queryTokens.every((token: string) => lowerTitle.includes(token));
            if (allWordsMatch) return 80;
            const matchCount = queryTokens.filter((token: string) => lowerTitle.includes(token)).length;
            if (matchCount > 0) return (matchCount / queryTokens.length) * 50;
            return 0;
          };

          updated.sort((a, b) => {
            const scoreA = getRelevanceScore(a.title);
            const scoreB = getRelevanceScore(b.title);
            
            const isHighMatchA = scoreA >= 80;
            const isHighMatchB = scoreB >= 80;
            
            // Prioritize dishes matching the user's search query words first
            if (isHighMatchA && !isHighMatchB) return -1;
            if (!isHighMatchA && isHighMatchB) return 1;
            
            if (scoreA !== scoreB && Math.abs(scoreA - scoreB) >= 30) {
              return scoreB - scoreA;
            }
            
            // Within the same match category, sort strictly by lowest rupee price!
            return a.lowestPrice - b.lowestPrice;
          });
          return updated;
       });
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
              onSelectCategory={setSearchCategory}
              categoriesList={['Food', 'Commute', 'Groceries', 'Travel', 'Medicine', 'Shopping', 'Services']}
              location={location}
              searchValues={searchValues}
              onChangeValue={(key, val) => setSearchValues(prev => ({ ...prev, [key]: val }))}
              onSubmit={(effectiveQuery) => handleSearch(effectiveQuery)}
              isSearching={isSearching}
            />
            
            {isSearching && (
              <View style={styles.loadingBox}>
                <Text style={{ fontSize: 13, color: '#475569', marginBottom: 8 }}>Extracting live pricing & coupons...</Text>
                {(() => {
                   const categoryProviders = getFilteredProviders().filter(p => p.category.toLowerCase() === searchCategory.toLowerCase());
                   const activeProviders = categoryProviders.length > 0 ? categoryProviders : (PROVIDERS.length > 0 ? [PROVIDERS[0]] : []);

                   const activeQuery = searchQuery || searchValues.query || 'paneer';

                   return activeProviders.map(provider => {
                      if (!provider) return null;
                      const id = provider.id;
                      const packet = getPacket(id);
                      const searchUrl = packet ? packet.getSearchUrl(activeQuery) : provider.url;
                      const injectionScript = packet ? packet.getExtractorInjection(searchUrl, activeQuery, location) : undefined;
                      
                      return (
                        <WebViewExtractor 
                           key={id + '__' + activeQuery} 
                           url={searchUrl}
                           providerId={id}
                           location={location}
                           isActive={true}
                           onDataExtracted={handleDataExtracted}
                           onError={(err) => {
                             console.log('[CompareAll Extractor] Notice for provider:', id, err);
                           }}
                           injectionScript={injectionScript}
                        />
                      );
                   });
                })()}
              </View>
            )}

            <ScrollView style={styles.resultsContainer} contentContainerStyle={{ paddingBottom: totalCartCount > 0 ? 100 : 20 }}>
              {results.map((group, index) => {
                const isExpanded = Boolean(expandedPlatformGroups[group.matchKey || index]);
                const primaryOffer = group.offers[0];
                const secondaryOffers = group.offers.slice(1);
                const providerId = PROVIDERS.find(p => p.name.toLowerCase() === primaryOffer?.providerName.toLowerCase())?.id || 'food-a';
                const itemId = `${providerId}__${group.title}`;
                const cartItem = cartItems.find(item => item.id === itemId);
                const qty = cartItem ? cartItem.quantity : 0;

                return (
                  <View key={index} style={styles.resultCard}>
                    {/* Dish & Restaurant Title */}
                    <Text style={styles.resultTitle}>{group.title}</Text>
                    
                    {/* Best Deal Winner Banner */}
                    <View style={styles.resultBestPriceBox}>
                      <Text style={styles.resultBestPrice}>
                        🏆 Best Deal on {group.bestProvider || 'Swiggy'}: ₹{group.lowestPrice} {group.savings > 0 ? `(Save ₹${group.savings})` : ''}
                      </Text>
                    </View>

                    {/* Primary Winner Platform Row */}
                    {primaryOffer && (
                      <View style={[styles.offerItem, styles.offerItemWinner]}>
                        <View style={styles.offerMainInfo}>
                          <TouchableOpacity 
                            style={styles.offerHeaderRow} 
                            onPress={() => setDetailAnalysisModal({ dishTitle: group.title, offer: primaryOffer, group })}
                            activeOpacity={0.7}
                          >
                            <Text style={styles.offerProvider}>{primaryOffer.providerName}</Text>
                            <Text style={styles.detailInfoIcon}>ℹ️ Details</Text>
                            <View style={styles.winnerBadge}>
                              <Text style={styles.winnerBadgeText}>🌟 LOWEST PRICE</Text>
                            </View>
                            {primaryOffer.autoCouponSavings > 0 && (
                              <View style={styles.autoAppliedPill}>
                                <Text style={styles.autoAppliedPillText}>🏷️ Coupon Applied</Text>
                              </View>
                            )}
                          </TouchableOpacity>

                          <View style={styles.priceRowBig}>
                            <Text style={styles.effectivePriceBig}>₹{primaryOffer.price.finalPayablePrice}</Text>
                            {primaryOffer.autoCouponSavings > 0 ? (
                              <Text style={styles.strikeMenuPrice}>₹{primaryOffer.menuPrice || primaryOffer.price.menuPrice || primaryOffer.price.basePrice}</Text>
                            ) : (
                              primaryOffer.price.discount > 0 && (
                                <Text style={styles.basePrice}> (Base: ₹{primaryOffer.price.basePrice})</Text>
                              )
                            )}
                          </View>

                          {primaryOffer.autoCouponSavings > 0 && (
                            <Text style={styles.couponSavingsHighlight}>
                              Save ₹{primaryOffer.autoCouponSavings} with code <Text style={{ fontWeight: 'bold' }}>{primaryOffer.couponCode}</Text>
                            </Text>
                          )}
                        </View>

                        {/* Add to Cart Stepper */}
                        <View style={styles.cartActionContainer}>
                          {qty === 0 ? (
                            <TouchableOpacity
                              style={styles.addToCartBtn}
                              onPress={() => handleAddToCart(primaryOffer, group.title)}
                            >
                              <Text style={styles.addToCartBtnText}>+ ADD</Text>
                            </TouchableOpacity>
                          ) : (
                            <View style={styles.stepperContainer}>
                              <TouchableOpacity
                                style={styles.stepperBtn}
                                onPress={() => handleUpdateCartQty(itemId, qty - 1)}
                              >
                                <Text style={styles.stepperBtnText}>−</Text>
                              </TouchableOpacity>
                              <Text style={styles.stepperQtyText}>{qty}</Text>
                              <TouchableOpacity
                                style={styles.stepperBtn}
                                onPress={() => handleUpdateCartQty(itemId, qty + 1)}
                              >
                                <Text style={styles.stepperBtnText}>+</Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      </View>
                    )}

                    {/* Dropdown Toggle for other platforms (Zomato, etc.) */}
                    {secondaryOffers.length > 0 && (
                      <TouchableOpacity
                        style={styles.platformDropdownToggle}
                        onPress={() => {
                          const k = group.matchKey || index;
                          Vibration.vibrate(15);
                          setExpandedPlatformGroups(prev => ({ ...prev, [k]: !prev[k] }));
                        }}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.platformDropdownToggleText}>
                          {isExpanded 
                            ? '▴ Hide other platforms' 
                            : `▾ Compare on ${secondaryOffers.map((o: any) => o.providerName).join(', ')} (${secondaryOffers.length} more)`
                          }
                        </Text>
                      </TouchableOpacity>
                    )}

                    {/* Collapsible Secondary Platforms List */}
                    {isExpanded && secondaryOffers.map((secOffer: any, secIdx: number) => {
                      const secProviderId = PROVIDERS.find(p => p.name.toLowerCase() === secOffer.providerName.toLowerCase())?.id || 'food-b';
                      const secItemId = `${secProviderId}__${group.title}`;
                      const secCartItem = cartItems.find(item => item.id === secItemId);
                      const secQty = secCartItem ? secCartItem.quantity : 0;

                      return (
                        <View key={secIdx} style={styles.secondaryOfferItem}>
                          <View style={styles.offerMainInfo}>
                            <TouchableOpacity 
                              style={styles.offerHeaderRow} 
                              onPress={() => setDetailAnalysisModal({ dishTitle: group.title, offer: secOffer, group })}
                              activeOpacity={0.7}
                            >
                              <Text style={styles.offerProvider}>{secOffer.providerName}</Text>
                              <Text style={styles.detailInfoIcon}>ℹ️ Details</Text>
                              {secOffer.autoCouponSavings > 0 && (
                                <View style={styles.autoAppliedPill}>
                                  <Text style={styles.autoAppliedPillText}>🏷️ Coupon Applied</Text>
                                </View>
                              )}
                            </TouchableOpacity>

                            <View style={styles.priceRowBig}>
                              <Text style={styles.effectivePriceBig}>₹{secOffer.price.finalPayablePrice}</Text>
                              {secOffer.autoCouponSavings > 0 ? (
                                <Text style={styles.strikeMenuPrice}>₹{secOffer.menuPrice || secOffer.price.menuPrice || secOffer.price.basePrice}</Text>
                              ) : null}
                            </View>

                            {secOffer.autoCouponSavings > 0 && (
                              <Text style={styles.couponSavingsHighlight}>
                                Save ₹{secOffer.autoCouponSavings} with code <Text style={{ fontWeight: 'bold' }}>{secOffer.couponCode}</Text>
                              </Text>
                            )}
                          </View>

                          {/* Add to Cart Stepper */}
                          <View style={styles.cartActionContainer}>
                            {secQty === 0 ? (
                              <TouchableOpacity
                                style={styles.addToCartBtn}
                                onPress={() => handleAddToCart(secOffer, group.title)}
                              >
                                <Text style={styles.addToCartBtnText}>+ ADD</Text>
                              </TouchableOpacity>
                            ) : (
                              <View style={styles.stepperContainer}>
                                <TouchableOpacity
                                  style={styles.stepperBtn}
                                  onPress={() => handleUpdateCartQty(secItemId, secQty - 1)}
                                >
                                  <Text style={styles.stepperBtnText}>−</Text>
                                </TouchableOpacity>
                                <Text style={styles.stepperQtyText}>{secQty}</Text>
                                <TouchableOpacity
                                  style={styles.stepperBtn}
                                  onPress={() => handleUpdateCartQty(secItemId, secQty + 1)}
                                >
                                  <Text style={styles.stepperBtnText}>+</Text>
                                </TouchableOpacity>
                              </View>
                            )}
                          </View>
                        </View>
                      );
                    })}
                  </View>
                );
              })}

              {results.length === 0 && !isSearching && Boolean(searchQuery) && (
                <View style={{ alignItems: 'center', padding: 30 }}>
                  <Text style={{ fontSize: 36, marginBottom: 10 }}>🔍</Text>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1e293b', textAlign: 'center' }}>
                    No dishes found for "{searchQuery}"
                  </Text>
                  <Text style={{ fontSize: 13, color: '#64748b', textAlign: 'center', marginTop: 6, lineHeight: 18 }}>
                    Try searching for popular items like Paneer, Chicken Biryani, Pizza, or Thali in {location?.name || 'Medininagar'}.
                  </Text>
                </View>
              )}
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
                                <TouchableOpacity style={styles.disconnectBtnSmall} onPress={() => handleDisconnect(provider.id)}>
                                  <Text style={styles.disconnectBtnTextSmall}>✓ Connected</Text>
                                </TouchableOpacity>
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
        onUpdateQuantity={handleUpdateCartQty}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onCheckout={handleCartCheckout}
        onClose={() => setIsCartModalVisible(false)}
      />


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
                    const providerId = PROVIDERS.find(p => p.name.toLowerCase() === of.providerName.toLowerCase())?.id || 'food-a';
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
  disconnectBtnSmall: {
    backgroundColor: '#f8f8f8',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  disconnectBtnTextSmall: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 12,
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
});
