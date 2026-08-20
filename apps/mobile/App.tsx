// @ts-nocheck
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  SafeAreaView, View, Text, TextInput, TouchableOpacity, ScrollView, 
  Image, StyleSheet, ActivityIndicator, Vibration, Keyboard, StatusBar
} from 'react-native';
import { PROVIDERS, getPacket, FOOD_SUBCATEGORY_ORDER } from './src/lib/packets/registry';
import { WebViewExtractor } from './src/lib/WebViewExtractor';
import { UniversalCartModal } from './src/lib/UniversalCartModal';
import { LoginWebViewModal } from './src/lib/LoginWebViewModal';
import * as Location from 'expo-location';

const CATEGORIES = ['Food', 'Commute', 'Groceries', 'Shopping', 'Medicine', 'Services', 'Travel'];

const normalizeText = (s: string) => s ? s.normalize('NFC').replace(/[\u200B-\u200D\uFEFF\u00AD]/g, '') : s;

// ── DishCard: Comparify-style with collapsible platform dropdown ────────────
const DishCard = ({ dish, sortedOffers, bestOffer, bestPrice, savings, platformCount, isPersonalizedAvailable, getProviderColor, getProviderInitial, connectedProviders, PROVIDERS, onAddToCart }) => {
  const [expanded, setExpanded] = React.useState(false);
  const fmtEta = (offer: any) => offer.deliveryTime ? String(offer.deliveryTime).replace(/[?]/g,'').trim() : '~30 min';

  // Platforms not yet connected that have coupons — show "connect for best deals"
  const unconnectedWithDeals = sortedOffers.filter((offer: any) => {
    const providerId = (PROVIDERS || []).find((pr: any) => pr.name === offer.providerName)?.id;
    const isConn = connectedProviders.includes(providerId || '');
    return !isConn && offer.couponCode;
  });

  return (
    <View style={{ backgroundColor: '#fff', marginBottom: 2, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}>
      {/* Top section: name + image + from price */}
      <View style={{ flexDirection: 'row', padding: 16, alignItems: 'flex-start' }}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={{ fontSize: 17, fontWeight: '800', color: '#1e293b', marginBottom: 6, lineHeight: 22 }}>{dish.dishName}</Text>
          {savings > 0 && (
            <View style={{ backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 6 }}>
              <Text style={{ color: '#16a34a', fontSize: 11, fontWeight: '800' }}>Save up to Rs.{savings}</Text>
            </View>
          )}
          {isPersonalizedAvailable && (
            <View style={{ backgroundColor: '#eff6ff', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 6 }}>
              <Text style={{ color: '#2563eb', fontSize: 11, fontWeight: '700' }}>✓ Your deal active</Text>
            </View>
          )}
          {/* "Connect for best deals" hint for unconnected platforms */}
          {unconnectedWithDeals.length > 0 && (
            <View style={{ backgroundColor: '#fff7ed', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 6, borderWidth: 1, borderColor: '#fed7aa' }}>
              <Text style={{ color: '#c2410c', fontSize: 10, fontWeight: '700' }}>
                🔗 Connect {unconnectedWithDeals.map((o: any) => o.providerName).join(' & ')} for best deals
              </Text>
            </View>
          )}
          <Text style={{ fontSize: 12, color: '#94a3b8', marginBottom: 2 }}>From</Text>
          <Text style={{ fontSize: 24, fontWeight: '900', color: '#16a34a' }}>Rs.{bestPrice}</Text>
        </View>
        <View>
          {/* Dish image — uses Swiggy's CDN or Zomato thumb */}
          {dish.imageUrl
            ? <Image source={{ uri: dish.imageUrl }} style={{ width: 95, height: 95, borderRadius: 12 }} resizeMode="cover"
                onError={() => {}} />
            : <View style={{ width: 95, height: 95, borderRadius: 12, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e2e8f0' }}>
                <Text style={{ fontSize: 32 }}>🍽️</Text>
              </View>
          }
          {/* Platform count badge */}
          <View style={{ position: 'absolute', bottom: -8, left: -4, backgroundColor: '#1e293b', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 }}>
            <Text style={{ color: '#fff', fontSize: 10, fontWeight: '800' }}>{platformCount} platform{platformCount > 1 ? 's' : ''}</Text>
          </View>
        </View>
      </View>

      {/* Dropdown toggle row */}
      <TouchableOpacity
        onPress={() => setExpanded(e => !e)}
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#f8fafc', borderTopWidth: 1, borderTopColor: '#f1f5f9' }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {bestOffer && (
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: getProviderColor(bestOffer.providerName), paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, marginRight: 10 }}>
              <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', marginRight: 5 }}>
                <Text style={{ color: '#fff', fontSize: 10, fontWeight: '900' }}>{getProviderInitial(bestOffer.providerName)}</Text>
              </View>
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>Best on {bestOffer.providerName}</Text>
            </View>
          )}
          <Text style={{ fontSize: 12, color: '#64748b' }}>{expanded ? 'Hide' : 'See all'} platforms</Text>
        </View>
        <Text style={{ fontSize: 20, color: '#94a3b8', lineHeight: 24 }}>{expanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {/* Expanded comparison table */}
      {expanded && (
        <View style={{ borderTopWidth: 1, borderTopColor: '#f1f5f9' }}>
          <View style={{ flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#f8fafc' }}>
            <Text style={{ flex: 1, fontSize: 10, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 }}>Platform</Text>
            <Text style={{ fontSize: 10, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, width: 72, textAlign: 'center' }}>Delivery</Text>
            <Text style={{ fontSize: 10, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, width: 80, textAlign: 'right' }}>Price</Text>
          </View>
          {sortedOffers.map((offer: any, oIdx: number) => {
            const isBest = oIdx === 0;
            const provColor = getProviderColor(offer.providerName);
            const provInit = getProviderInitial(offer.providerName);
            const price = offer.price?.finalPayablePrice || offer.price?.basePrice || 0;
            const origPrice = offer.price?.basePrice || 0;
            const hasDiscount = origPrice > price && origPrice > 0;
            const providerId = (PROVIDERS || []).find((pr: any) => pr.name === offer.providerName)?.id;
            const isConnected = connectedProviders.includes(providerId || '');
            // Show coupon ONLY when connected; otherwise show connect prompt
            const showCoupon = isConnected && offer.couponCode;
            const showConnectHint = !isConnected && offer.couponCode;
            return (
              <View key={oIdx} style={[{
                flexDirection: 'row', alignItems: 'center',
                paddingHorizontal: 16, paddingVertical: 13,
                borderBottomWidth: 1, borderBottomColor: '#f8fafc',
              }, isBest && { backgroundColor: '#f0fdf4' }]}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: provColor, alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                    <Text style={{ color: '#fff', fontSize: 14, fontWeight: '900' }}>{provInit}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={{ fontSize: 14, fontWeight: '700', color: '#1e293b' }}>{offer.providerName}</Text>
                      {isConnected && (
                        <View style={{ backgroundColor: '#dbeafe', paddingHorizontal: 5, paddingVertical: 1, borderRadius: 4, marginLeft: 6 }}>
                          <Text style={{ color: '#1d4ed8', fontSize: 9, fontWeight: '800' }}>YOUR DEAL</Text>
                        </View>
                      )}
                    </View>
                    {isBest && <Text style={{ fontSize: 10, color: '#16a34a', fontWeight: '700' }}>Best Price</Text>}
                    {/* Coupon: ONLY when connected */}
                    {showCoupon && (
                      <Text style={{ fontSize: 10, color: '#f97316', fontWeight: '700' }}>✓ Use: {offer.couponCode}</Text>
                    )}
                    {/* Connect prompt: when NOT connected but coupon exists */}
                    {showConnectHint && (
                      <Text style={{ fontSize: 9, color: '#b45309', fontWeight: '600' }}>
                        🔗 Connect for best deals
                      </Text>
                    )}
                  </View>
                </View>
                <Text style={{ fontSize: 12, color: '#64748b', width: 72, textAlign: 'center' }}>{fmtEta(offer)}</Text>
                <View style={{ width: 80, alignItems: 'flex-end' }}>
                  {isBest && <View style={{ backgroundColor: '#16a34a', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginBottom: 2 }}>
                    <Text style={{ color: '#fff', fontSize: 9, fontWeight: '900' }}>BEST</Text>
                  </View>}
                  <Text style={{ fontSize: 16, fontWeight: '800', color: isBest ? '#16a34a' : '#1e293b' }}>Rs.{price}</Text>
                  {hasDiscount && <Text style={{ fontSize: 10, color: '#94a3b8', textDecorationLine: 'line-through' }}>Rs.{origPrice}</Text>}
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Add to Cart */}
      <TouchableOpacity
        onPress={onAddToCart}
        style={{ margin: 16, marginTop: 12, backgroundColor: '#16a34a', borderRadius: 14, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}
      >
        <Text style={{ color: '#fff', fontWeight: '900', fontSize: 15, letterSpacing: 0.3 }}>+ Add to Cart</Text>
        {bestPrice > 0 && <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, marginLeft: 10 }}>Rs.{bestPrice}</Text>}
      </TouchableOpacity>
    </View>
  );
};

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'Search' | 'Connections'>('Search');
  const [activeCategory, setActiveCategory] = useState('Food');

  // Location State
  const [location, setLocation] = useState<any>(null);
  
  // Connections State
  const [connectedProviders, setConnectedProviders] = useState<string[]>([]);
  const [loginModal, setLoginModal] = useState<any>(null);

  // Search & Extraction State
  const [searchQuery, setSearchQuery] = useState('');
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const completedProvidersRef = useRef<Set<string>>(new Set());
  const searchTimerRef = useRef<any>(null);

  // Cart State
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isCartVisible, setIsCartVisible] = useState(false);

  // Restaurant details mode
  const [selectedRest, setSelectedRest] = useState<any>(null);

  // Maximum GPS accuracy location fetch
  useEffect(() => {
    let watchSub: any = null;

    const startLocationTracking = async () => {
      try {
        // Request foreground permission
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          // Permission denied — use fallback coordinates for Daltonganj
          setLocation({ latitude: 24.0322, longitude: 84.0722, name: 'Daltonganj, Jharkhand' });
          return;
        }

        // STEP 1: Quick coarse fix (immediate — uses cell tower / WiFi)
        // So user sees a location instantly without waiting for GPS satellite lock
        try {
          const coarse = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced, // fast, ~100m accuracy
          });
          if (coarse?.coords) {
            const geo = await Location.reverseGeocodeAsync({
              latitude: coarse.coords.latitude,
              longitude: coarse.coords.longitude
            }).catch(() => []);
            const g0 = geo?.[0] || {};
            const nameParts = [
              g0.name && !g0.name.match(/^\d/) ? g0.name : '',  // locality/area name (skip if just a number)
              g0.sublocality || g0.subregion || '',
              g0.city || g0.district || '',
              g0.region || ''
            ].filter((v, i, a) => v && a.indexOf(v) === i); // unique non-empty parts
            const name = nameParts.length > 0 ? nameParts.slice(0, 3).join(', ') : 'Current Location';
            setLocation({ latitude: coarse.coords.latitude, longitude: coarse.coords.longitude, name });
          }
        } catch (_) {}

        // STEP 2: High-precision GPS fix (uses satellite, takes 5-15s)
        // BestForNavigation = highest accuracy mode on Android/iOS
        const precise = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
          mayShowUserSettingsDialog: true, // ask user to turn on GPS if off
        }).catch(() => null);

        if (precise?.coords) {
          const geo = await Location.reverseGeocodeAsync({
            latitude: precise.coords.latitude,
            longitude: precise.coords.longitude
          }).catch(() => []);
          const g0 = geo?.[0] || {};
          const nameParts = [
            g0.name && !g0.name.match(/^\d/) ? g0.name : '',
            g0.sublocality || g0.subregion || '',
            g0.city || g0.district || '',
            g0.region || ''
          ].filter((v, i, a) => v && a.indexOf(v) === i);
          const name = nameParts.length > 0 ? nameParts.slice(0, 3).join(', ') : 'Current Location';
          setLocation({
            latitude: precise.coords.latitude,
            longitude: precise.coords.longitude,
            name,
            accuracy: precise.coords.accuracy, // meters accuracy
          });
        }

        // STEP 3: Live position watch — updates if user moves 20+ meters
        // This ensures location stays fresh throughout the session
        watchSub = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 20,      // update every 20 meters moved
            timeInterval: 60000,       // or every 60 seconds
          },
          async (pos) => {
            if (!pos?.coords) return;
            const geo = await Location.reverseGeocodeAsync({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude
            }).catch(() => []);
            const gw = geo?.[0] || {};
            const wParts = [
              gw.name && !gw.name.match(/^\d/) ? gw.name : '',
              gw.sublocality || gw.subregion || '',
              gw.city || gw.district || '',
              gw.region || ''
            ].filter((v, i, a) => v && a.indexOf(v) === i);
            const name = wParts.length > 0 ? wParts.slice(0, 3).join(', ') : 'Current Location';
            setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude, name });
          }
        );
      } catch (e) {
        // Any error → fallback to Daltonganj
        setLocation({ latitude: 24.0322, longitude: 84.0722, name: 'Daltonganj, Jharkhand' });
      }
    };

    // Small delay so app UI renders first, then GPS starts
    const timer = setTimeout(startLocationTracking, 500);
    return () => {
      clearTimeout(timer);
      if (watchSub) watchSub.remove(); // cleanup watcher on unmount
    };
  }, []);



  // Fetch default data silently if Food is active and no search query
  useEffect(() => {
      if (activeTab === 'Search' && activeCategory === 'Food' && !searchQuery && results.length === 0 && !isSearching && location !== null) {
          setIsSearching(true);
          completedProvidersRef.current = new Set();
          if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
          searchTimerRef.current = setTimeout(() => setIsSearching(false), 12000);
      }
  }, [activeTab, activeCategory, location]);

  const handleSearch = (q: string) => {
      Keyboard.dismiss();
      const val = q.trim();
      if (!val) return;
      setSearchQuery(val);
      setSelectedRest(null);
      setResults([]);
      setIsSearching(true);
      completedProvidersRef.current.clear();

      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
      searchTimerRef.current = setTimeout(() => setIsSearching(false), 12000);

      // ── Inject public offers from OFFICIAL_WEB brands immediately ──────────
      // These brands don't use WebView — call getPublicOffers() directly (pure JS)
      const directBrands = (PROVIDERS || []).filter(
          p => p && p.category === activeCategory && p.connectionType === 'OFFICIAL_WEB'
      );

      directBrands.forEach(provider => {
          const packet = getPacket(provider.id);
          if (!packet?.getPublicOffers) return;
          try {
              const offers = packet.getPublicOffers(val);
              if (offers && offers.length > 0) {
                  const taggedOffers = offers.map((o: any) => ({ ...o, isStaticFallback: true }));
                  setTimeout(() => handleDataExtracted({ data: taggedOffers, isStaticFallback: true }, provider.id), 50);
              }
          } catch (_) {}
      });
  };

  const handleDataExtracted = (data: any, providerId: string) => {
      const provider = PROVIDERS.find(p => p.id === providerId);
      if (!provider) return;

      const isStatic = data.isStaticFallback === true;
      if (!isStatic) {
          completedProvidersRef.current.add(providerId);
          
          // Count ONLY WebView-based extractors (not OFFICIAL_WEB which fire instantly)
          const totalExtractors = PROVIDERS.filter(p => 
              p && p.category === activeCategory && p.connectionType !== 'OFFICIAL_WEB'
          ).length;
          if (completedProvidersRef.current.size >= totalExtractors) {
              setIsSearching(false);
              if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
          }

          // Remove stale static fallback ONLY for this specific provider
          // IMPORTANT: Do NOT remove static offers from other providers (e.g., Domino's static)
          // when Swiggy live data arrives. Each provider cleans only its own stale data.
          setResults(prev => {
              let nextState = prev.map(group => {
                  return {
                      ...group,
                      dishes: group.dishes.map((dish: any) => ({
                          ...dish,
                          offers: dish.offers.filter(
                              (o: any) => !(o.providerName === provider.name && o.isStaticFallback)
                          )
                      })).filter((dish: any) => dish.offers.length > 0)
                  };
              }).filter(group => group.dishes.length > 0);
              return nextState;
          });
      }

      const items = data.data || data.items || [];
      if (!items.length) return;

      setResults(prev => {
          let updated = [...prev];
          items.forEach((item: any) => {
             const dishNameRaw = item.dishName || item.name;
             const restNameRaw = item.restaurantName || item.restaurant;
             if (!dishNameRaw && !restNameRaw) return;

             const dishName = normalizeText(dishNameRaw);
             const restName = normalizeText(restNameRaw);

             // ── Known chain brands — merge all outlets into one group ──────────
             const CHAIN_BRANDS = [
                 'dominos', "domino's", 'pizza hut', 'pizzahut',
                 'mcdonalds', "mcdonald's", 'kfc', 'burger king', 'burgerking',
                 'subway', 'tacobell', 'taco bell', 'wowmomo', 'wow momo',
                 'chaayos', 'chai point', 'chaipoint', 'barista',
                 'faasos', 'behrouz', 'barbeque nation', 'absolute barbecues',
                 'haldirams', "haldiram's", 'bikanervala', "nirula's", 'goli vada pav',
                 'jumbo king', 'jumboking', 'ovenstory', 'oven story',
                 'lunchbox', 'the good bowl', 'freshmenu',
             ];

             const norm = (s: string) => (s||'').toLowerCase().replace(/[^a-z0-9]/g, '');
             const restKey = norm(restName);

             // Check if this is a known chain brand
             const matchedChain = CHAIN_BRANDS.find(chain => {
                 const chainKey = norm(chain);
                 return restKey.startsWith(chainKey) || restKey.includes(chainKey);
             });

             let group = updated.find(g => {
                 const gName = norm(g.restaurantName);
                 if (!restKey || !gName) return false;
                 if (gName === restKey) return true;

                 // Chain brand matching: "Domino's - Koramangala" matches group "Domino's"
                 if (matchedChain) {
                     const chainKey = norm(matchedChain);
                     return norm(g.restaurantName).startsWith(chainKey) ||
                            norm(g.restaurantName).includes(chainKey);
                 }

                 // Robust Fuzzy Name Matching (Word Overlap)
                 const filterWords = (name: string) => name.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/).filter(w => w.length > 2 && !['restaurant', 'the', 'and', 'veg', 'nonveg'].includes(w));
                 const rWords = filterWords(restName);
                 const gWords = filterWords(g.restaurantName);

                 if (rWords.length === 0 || gWords.length === 0) {
                     return norm(restName) === norm(g.restaurantName);
                 }

                 let overlap = 0;
                 rWords.forEach(rw => {
                     if (gWords.some(gw => gw === rw || (gw.length > 3 && rw.length > 3 && (gw.includes(rw) || rw.includes(gw))))) overlap++;
                 });
                 
                 const matchRatio = overlap / Math.max(rWords.length, gWords.length);
                 
                 // If 50% or more words match, we consider it the same restaurant!
                 if (matchRatio >= 0.5) {
                     // Keep the shorter, cleaner name (e.g. 'Jain Shree' instead of 'Jain Shree Veg Restaurant')
                     if (restName.length < g.restaurantName.length) {
                         g.restaurantName = restName;
                     }
                     return true;
                 }
             });

             if (!group) {
                 // Canonical name map — ensures consistent display names across all providers
                 const CANONICAL_NAMES: Record<string, string> = {
                     'dominos': "Domino's", "domino's": "Domino's",
                     'pizzahut': 'Pizza Hut', 'pizza hut': 'Pizza Hut',
                     'mcdonalds': "McDonald's", "mcdonald's": "McDonald's",
                     'kfc': 'KFC',
                     'burgerking': 'Burger King', 'burger king': 'Burger King',
                     'subway': 'Subway',
                     'tacobell': 'Taco Bell', 'taco bell': 'Taco Bell',
                     'wowmomo': 'Wow Momo', 'wow momo': 'Wow Momo',
                     'chaayos': 'Chaayos',
                     'chaipoint': 'Chai Point', 'chai point': 'Chai Point',
                     'barista': 'Barista',
                     'faasos': 'Faasos',
                     'behrouz': 'Behrouz Biryani',
                     'haldirams': "Haldiram's", "haldiram's": "Haldiram's",
                     'bikanervala': 'Bikanervala',
                     'ovenstory': 'Oven Story', 'oven story': 'Oven Story',
                 };
                 const displayName = matchedChain
                     ? (CANONICAL_NAMES[matchedChain] || CANONICAL_NAMES[norm(matchedChain)] || (matchedChain.charAt(0).toUpperCase() + matchedChain.slice(1)))
                     : (restName || 'Unknown');
                 group = {
                     id: `rest_${Date.now()}_${Math.random()}`,
                     restaurantName: displayName,
                     imageUrl: item.restaurantImage || item.imageUrl || '',
                     isChainBrand: !!matchedChain,
                     dishes: [],
                 };
                 updated.push(group);
             } else if (!group.imageUrl && (item.restaurantImage || item.imageUrl)) {
                 group.imageUrl = item.restaurantImage || item.imageUrl;
             }

             const dishKey = norm(dishName);
             let dishEntry = group.dishes.find((d: any) => {
                 const existingKey = norm(d.dishName);
                 if (existingKey === dishKey) return true;
                 if (existingKey.includes(dishKey) || dishKey.includes(existingKey)) {
                     // Keep the more descriptive name (e.g., 'Cheese Pizza (8 Inches)' > 'Pizza')
                     if (dishName.length > d.dishName.length) {
                         d.dishName = dishName;
                     }
                     return true;
                 }
                 return false;
             });

             if (!dishEntry) {
                 dishEntry = { dishName, imageUrl: item.dishImage || item.imageUrl || '', offers: [] };
                 group.dishes.push(dishEntry);
             } else if (!dishEntry.imageUrl && (item.dishImage || item.imageUrl)) {
                 dishEntry.imageUrl = item.dishImage || item.imageUrl;
             }

             // DEDUP: Only add offer if this provider hasn't already added one for this dish
             // For chain brands: keep the BEST price per provider (lowest finalPayablePrice)
             const existingOffer = dishEntry.offers.find((o: any) => o.providerName === provider.name);
             if (!existingOffer) {
                 dishEntry.offers.push({
                     providerName: provider.name,
                     price: item.price,
                     deliveryTime: item.deliveryTime,
                     rating: item.rating,
                     couponCode: item.couponCode,
                     potentialSavings: item.couponSavings || item.autoCouponSavings || 0,
                     isPersonalized: connectedProviders.includes(providerId),
                     offerText: item.offerText || '',
                     isStaticFallback: item.isStaticFallback || false,
                 });
             } else if (matchedChain) {
                 // Chain brand: update if this outlet has better price
                 const newPrice = item.price?.finalPayablePrice || item.price?.menuPrice || 9999;
                 const oldPrice = existingOffer.price?.finalPayablePrice || existingOffer.price?.menuPrice || 9999;
                 if (newPrice < oldPrice) {
                     existingOffer.price = item.price;
                     existingOffer.potentialSavings = item.couponSavings || item.autoCouponSavings || 0;
                     existingOffer.couponCode = item.couponCode;
                     existingOffer.offerText = item.offerText || '';
                 }
             }
          });
          return updated;
      });
  };

  // Providers used for live WebView extraction (have real login + extractor)
  // Providers that run WebView extraction (WEBVIEW_LOGIN + WEBVIEW_EXTRACT types)
  const activeProviders = (PROVIDERS || []).filter(p =>
    p && p.category === activeCategory && p.connectionType !== 'OFFICIAL_WEB'
  );
  // All food providers for Connections page (includes direct-order brands)
  const allFoodProviders = (PROVIDERS || []).filter(p => p && p.category === activeCategory);

  const connectedCount = allFoodProviders.filter(p => connectedProviders.includes(p.id)).length;
  const isAllConnected = allFoodProviders.length > 0 && connectedCount === allFoodProviders.length;

  const vegKeywords = ['veg', 'paneer', 'aloo', 'mushroom', 'dal', 'sabzi', 'gobi', 'matar', 'tofu', 'idli', 'dosa', 'uttapam', 'puri', 'chole', 'rajma', 'kadhai', 'palak', 'corn', 'baby corn', 'mixed veg', 'veg fried', 'veg biryani', 'garden', 'salad'];

  const displayedResults = isVegOnly
    ? results.filter(group =>
        group.dishes && group.dishes.some((d: any) =>
          d.isVeg === true || (d.dishName && vegKeywords.some(keyword => d.dishName.toLowerCase().includes(keyword)))
        )
      )
    : results;
  
  const renderExtractors = () => {
      if (!isSearching || activeCategory !== 'Food') return null;
      
      const fetchQuery = searchQuery || 'food';
      return (
          <View style={{height: 0, opacity: 0}}>
              {activeProviders.map(provider => {
                  const packet = getPacket(provider.id);
                  if (!packet || !packet.getSearchUrl) return null;
                  const searchUrl = packet.getSearchUrl(fetchQuery, location);
                  return (
                      <WebViewExtractor
                          key={provider.id}
                          providerId={provider.id}
                          url={searchUrl}
                          isActive={true}
                          location={location}
                          onDataExtracted={(d) => handleDataExtracted(d, provider.id)}
                          onError={(e) => console.log('Extractor err', e)}
                          injectionScript={packet.getExtractorInjection ? packet.getExtractorInjection(searchUrl, fetchQuery, location) : undefined}
                      />
                  );
              })}
          </View>
      );
  };

  const getProviderColor = (name: string) => {
      // Check registry for brandColor first
      const prov = (PROVIDERS || []).find(p => p.name === name);
      if (prov?.brandColor) return prov.brandColor;
      switch ((name || '').toUpperCase()) {
          case 'ZOMATO': return '#cb202d';
          case 'SWIGGY': return '#ff5200';
          case 'EATSURE': return '#4945be';
          case 'EATCLUB': return '#305bea';
          default: return '#334155'; // slate-700
      }
  };

  const getProviderInitial = (name: string) => {
      const prov = (PROVIDERS || []).find(p => p.name === name);
      if (prov?.icon) return prov.icon;
      switch ((name || '').toUpperCase()) {
          case 'ZOMATO': return 'Z';
          case 'SWIGGY': return 'S';
          case 'EATSURE': return 'E';
          case 'EATCLUB': return 'C';
          default: return (name || '?').charAt(0).toUpperCase();
      }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.locationPill}>
           <Text style={styles.locationIcon}>📍</Text>
           <Text style={styles.locationText} numberOfLines={1}>{location?.name || 'Locating...'}</Text>
        </TouchableOpacity>
      </View>

      {/* Category Slab */}
      <View style={styles.slabContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.slabScroll}>
              {CATEGORIES.map(cat => (
                  <TouchableOpacity 
                      key={cat} 
                      style={[styles.slabTab, activeCategory === cat && styles.slabTabActive]}
                      onPress={() => { setActiveCategory(cat); setSearchQuery(''); setSelectedRest(null); }}
                  >
                      <Text style={[styles.slabTabText, activeCategory === cat && styles.slabTabTextActive]}>{cat}</Text>
                  </TouchableOpacity>
              ))}
          </ScrollView>
      </View>

      {/* Main Content Area */}
      <View style={styles.content}>
          
    {activeTab === 'Search' && activeCategory === 'Food' && !selectedRest && (
             <View style={{flex: 1}}>
                 <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
              <View style={styles.searchIconContainer}><Text style={styles.searchIconText}>🔍</Text></View>
              <TextInput 
                  style={styles.searchInput}
                  placeholder="Search restaurants or dishes..."
                  placeholderTextColor="#94a3b8"
                  defaultValue={searchQuery}
                  onSubmitEditing={(e) => { setSearchQuery(e.nativeEvent.text); handleSearch(e.nativeEvent.text); }}
                  returnKeyType="search"
              />
          </View>
          <TouchableOpacity 
              style={[styles.vegToggle, isVegOnly && styles.vegToggleActive]}
              onPress={() => setIsVegOnly(!isVegOnly)}
          >
              <Text style={[styles.vegToggleText, isVegOnly && styles.vegToggleTextActive]}>VEG</Text>
          </TouchableOpacity>
      </View>
                 
                 {isSearching ? (
                     <View style={[styles.centerMsg, {marginTop: 60}]}>
                         <ActivityIndicator size="large" color="#16a34a" />
                         <Text style={[styles.msgText, {marginTop: 20, color: '#16a34a', fontWeight: '800'}]}>Comparing live prices...</Text>
                         <Text style={{fontSize: 12, color: '#64748b', textAlign: 'center', marginTop: 10, paddingHorizontal: 40}}>Please wait while we check Swiggy, Zomato, and Direct Apps to find you the best deals.</Text>
                     </View>
                 ) : results.length === 0 && !isSearching && searchQuery ? (
                     <View style={styles.centerMsg}>
                         <Text style={styles.msgText}>No restaurants found for "{searchQuery}"</Text>
                     </View>
                 ) : results.length === 0 && !isSearching && !searchQuery ? (
                     <View style={styles.centerMsg}>
                         <Text style={styles.msgText}>Search for restaurants or dishes above</Text>
                     </View>
                 ) : displayedResults.length === 0 && isVegOnly && results.length > 0 ? (
                     <View style={styles.centerMsg}>
                         <Text style={styles.msgText}>No vegetarian options found in search results</Text>
                     </View>
                 ) : (
                     <ScrollView contentContainerStyle={{padding: 16}}>
                         <Text style={styles.sectionTitle}>{searchQuery ? `Results for "${searchQuery}"` : 'Restaurants near you'}</Text>
                         {displayedResults.map((group, idx) => (
                             <TouchableOpacity key={idx} style={styles.restCard} onPress={() => setSelectedRest(group)}>
                                 <View style={styles.restCardInner}>
                                       {group.imageUrl ? <Image source={{uri: group.imageUrl}} style={styles.restImage} /> : <View style={[styles.restImage, {backgroundColor: '#e2e8f0'}]} />}
                                       <View style={styles.restDetails}>
                                           <Text style={styles.restName}>{group.restaurantName}</Text>
                                           <View style={styles.platformChipsContainer}>
                                               {Array.from(new Set(group.dishes.flatMap((d:any) => d.offers.map((o:any)=>o.providerName)))).map((p:any) => (
                                                   <View key={p} style={[styles.platformChip, {backgroundColor: getProviderColor(p), flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8}]}>
                                                     <View style={{width: 16, height: 16, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center', marginRight: 4}}>
                                                       <Text style={{color: '#fff', fontSize: 9, fontWeight: '900'}}>{getProviderInitial(p)}</Text>
                                                     </View>
                                                     <Text style={{fontSize: 11, color: '#fff', fontWeight: '700'}}>{p}</Text>
                                                   </View>
                                               ))}
                                           </View>
                                           <View style={styles.compareBtn}>
                                               <Text style={styles.compareBtnText}>Compare Prices</Text>
                                           </View>
                                       </View>
                                   </View>
                             </TouchableOpacity>
                         ))}
                     </ScrollView>
                 )}
             </View>
          )}

          {activeTab === 'Search' && activeCategory === 'Food' && selectedRest && (
             <View style={{flex: 1}}>
                 <TouchableOpacity style={styles.backBtn} onPress={() => setSelectedRest(null)}>
                     <Text style={styles.backBtnText}>← Back to {searchQuery ? 'search' : 'restaurants'}</Text>
                 </TouchableOpacity>
                 <ScrollView contentContainerStyle={{paddingBottom: 120}}>
                     {/* Restaurant header */}
                     <View style={{backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f1f5f9'}}>
                         <Text style={styles.menuTitle}>{selectedRest.restaurantName}</Text>
                         <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                             {Array.from(new Set(selectedRest.dishes.flatMap((d:any) => d.offers.map((o:any) => o.providerName)))).map((p:any) => (
                                 <View key={p} style={{flexDirection:'row', alignItems:'center', backgroundColor: getProviderColor(p), paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12, marginRight: 6, marginBottom: 4}}>
                                     <Text style={{color:'#fff', fontSize: 11, fontWeight: '700'}}>{p}</Text>
                                     {connectedProviders.includes(PROVIDERS.find(pr => pr.name === p)?.id || '') && (
                                         <View style={{backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 6, paddingHorizontal: 4, paddingVertical: 1, marginLeft: 4}}>
                                             <Text style={{color: '#fff', fontSize: 9, fontWeight: '900'}}>✓ ME</Text>
                                         </View>
                                     )}
                                 </View>
                             ))}
                         </View>
                     </View>

                     {/* Dish cards */}
                     {selectedRest.dishes.map((dish: any, dIdx: number) => {
                       const sortedOffers = [...dish.offers].sort((a:any, b:any) =>
                         (a.price?.finalPayablePrice||a.price?.basePrice||9999) - (b.price?.finalPayablePrice||b.price?.basePrice||9999)
                       );
                       const bestOffer = sortedOffers[0];
                       const bestPrice = bestOffer?.price?.finalPayablePrice || bestOffer?.price?.basePrice || 0;
                       const worstPrice = sortedOffers[sortedOffers.length-1];
                       const maxPrice = worstPrice?.price?.finalPayablePrice || worstPrice?.price?.basePrice || 0;
                       const savings = sortedOffers.length > 1 ? maxPrice - bestPrice : 0;
                       const platformCount = sortedOffers.length;
                       const isPersonalizedAvailable = sortedOffers.some((o:any) => o.isPersonalized);

                       return (
                         <DishCard
                           key={dIdx}
                           dish={dish}
                           sortedOffers={sortedOffers}
                           bestOffer={bestOffer}
                           bestPrice={bestPrice}
                           savings={savings}
                           platformCount={platformCount}
                           isPersonalizedAvailable={isPersonalizedAvailable}
                           getProviderColor={getProviderColor}
                           getProviderInitial={getProviderInitial}
                           connectedProviders={connectedProviders}
                           PROVIDERS={PROVIDERS}
                           onAddToCart={() => {
                             Vibration.vibrate(20);
                             setCartItems(prev => {
                               const exist = prev.find(i => i.id === dish.dishName);
                               if (exist) return prev.map(i => i.id === dish.dishName ? {...i, quantity: i.quantity + 1} : i);
                               return [...prev, { id: dish.dishName, title: dish.dishName, quantity: 1, offers: dish.offers, bestOffer }];
                             });
                           }}
                         />
                       );
                     })}
                 </ScrollView>
             </View>
          )}

          {activeTab === 'Connections' && (
              <ScrollView contentContainerStyle={{padding: 16, paddingBottom: 32}}>
                  <Text style={styles.connTitle}>Link Accounts</Text>
                  <Text style={{fontSize: 13, color: '#64748b', marginBottom: 20, lineHeight: 18}}>
                    Connect your food delivery accounts to unlock your personalized deals, hidden coupons, and member-only pricing.
                  </Text>

                  {/* Render brands grouped by subcategory (Only Food Delivery for now) */}
                  {FOOD_SUBCATEGORY_ORDER.filter(s => s === 'Food Delivery').map(subcat => {
                      const group = allFoodProviders.filter(p => (p.subcategory || 'Food Delivery') === subcat);
                      if (group.length === 0) return null;
                      return (
                          <View key={subcat} style={{marginBottom: 8}}>
                              {/* Subcategory header */}
                              <Text style={styles.connCategory}>{subcat}</Text>
                              <View style={styles.connGrid}>
                                  {group.map(p => {
                                      const isConn = connectedProviders.includes(p.id);
                                      const isDirectOrder = p.connectionType === 'OFFICIAL_WEB';
                                      const provColor = p.brandColor || getProviderColor(p.name);
                                      return (
                                          <View key={p.id} style={styles.connCard}>
                                              {/* Brand icon circle */}
                                              <View style={[styles.providerCircleLg, {backgroundColor: provColor}]}>
                                                  <Text style={styles.providerCircleTextLg}>{p.icon || getProviderInitial(p.name)}</Text>
                                              </View>
                                              <Text style={styles.connName} numberOfLines={2}>{p.name}</Text>

                                              {p.connectionType === 'OFFICIAL_WEB' ? (
                                                  /* Pure direct-order: open website */
                                                  <TouchableOpacity
                                                      style={[styles.linkBtn, {backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1'}]}
                                                      onPress={() => {
                                                          import('react-native').then(({ Linking }) => {
                                                              Linking.openURL(p.loginUrl).catch(() => {});
                                                          });
                                                      }}
                                                  >
                                                      <Text style={[styles.linkBtnText, {color: '#334155'}]}>🌐 ORDER</Text>
                                                  </TouchableOpacity>
                                              ) : p.connectionType === 'WEBVIEW_EXTRACT' ? (
                                                  /* WebView-scraped brand: no account needed, open menu to compare */
                                                  <TouchableOpacity
                                                      style={[styles.linkBtn, {backgroundColor: '#1e293b'}]}
                                                      onPress={() => {
                                                          import('react-native').then(({ Linking }) => {
                                                              Linking.openURL(p.loginUrl).catch(() => {});
                                                          });
                                                      }}
                                                  >
                                                      <Text style={styles.linkBtnText}>🍽️ MENU</Text>
                                                  </TouchableOpacity>
                                              ) : isConn ? (
                                                  <View style={{width: '100%', alignItems: 'center'}}>
                                                      <View style={{backgroundColor: '#dcfce7', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, marginBottom: 8, width: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
                                                          <Text style={{color: '#16a34a', fontSize: 12, fontWeight: '800'}}>✓ CONNECTED</Text>
                                                      </View>
                                                      <TouchableOpacity
                                                          style={{paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: '#fca5a5', backgroundColor: '#fff5f5'}}
                                                          onPress={() => {
                                                              setConnectedProviders(prev => prev.filter(id => id !== p.id));
                                                              setResults([]);
                                                          }}
                                                      >
                                                          <Text style={{color: '#ef4444', fontSize: 11, fontWeight: '700'}}>Disconnect</Text>
                                                      </TouchableOpacity>
                                                  </View>
                                              ) : (
                                                  <TouchableOpacity
                                                      style={styles.linkBtn}
                                                      onPress={() => setLoginModal(p)}
                                                  >
                                                      <Text style={styles.linkBtnText}>LINK NOW</Text>
                                                  </TouchableOpacity>
                                              )}
                                          </View>
                                      );
                                  })}
                              </View>
                          </View>
                      );
                  })}
              </ScrollView>
          )}
          
          {/* Hide unsupported categories */}
          {activeTab === 'Search' && activeCategory !== 'Food' && (
              <View style={styles.centerMsg}>
                  <Text style={styles.msgText}>Coming Soon</Text>
              </View>
          )}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Search')}>
              <Text style={[styles.navIcon, activeTab === 'Search' && styles.navActive]}>🔍</Text>
              <Text style={[styles.navText, activeTab === 'Search' && styles.navActive]}>Search</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Connections')}>
              <Text style={[styles.navIcon, activeTab === 'Connections' && styles.navActive]}>🔗</Text>
              <Text style={[styles.navText, activeTab === 'Connections' && styles.navActive]}>Connections</Text>
          </TouchableOpacity>
      </View>

      {/* Floating Cart Button */}
      {cartItems.length > 0 && activeTab === 'Search' && (
          <TouchableOpacity style={styles.floatingCart} onPress={() => setIsCartVisible(true)}>
              <Text style={styles.floatingCartText}>{cartItems.reduce((acc, i) => acc + i.quantity, 0)} Items</Text>
              <Text style={styles.floatingCartText}>View Cart -{'>'}</Text>
          </TouchableOpacity>
      )}

      {/* Modals */}
      {loginModal && (
          <LoginWebViewModal
             visible={!!loginModal}
             providerId={loginModal.id}
             providerName={loginModal.name}
             providerIcon={loginModal.icon}
             loginUrl={loginModal.loginUrl}
             location={location}
             onSuccess={() => {
                 setConnectedProviders(prev => [...prev, loginModal.id]);
                 setLoginModal(null);
                 setActiveTab('Search');
             }}
             onClose={() => setLoginModal(null)}
          />
      )}

      {isCartVisible && (
          <UniversalCartModal
             visible={isCartVisible}
             onClose={() => setIsCartVisible(false)}
             cartItems={cartItems}
             onUpdateQuantity={(id, qty) => {
                 if (qty <= 0) setCartItems(prev => prev.filter(i => i.id !== id));
                 else setCartItems(prev => prev.map(i => i.id === id ? {...i, quantity: qty} : i));
             }}
             onCheckout={(provName) => {
                 const packet = PROVIDERS.find(p => p.name === provName);
                 if (packet) {
                     const url = packet.checkoutUrl || packet.url || packet.loginUrl;
                     if (url) {
                         import('react-native').then(({ Linking, Alert }) => {
                             Linking.openURL(url).catch(err => {
                                 console.error("Failed to open URL", err);
                                 Alert.alert("Error", "Could not open " + provName + " app.");
                             });
                         });
                     }
                 }
             }}
             connectedProviders={connectedProviders}
          />
      )}

      {renderExtractors()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { alignItems: 'center', paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  headerLogo: { fontSize: 24, fontWeight: '900', color: '#000', marginBottom: 8, letterSpacing: -0.5 },
  locationPill: { flexDirection: 'row', backgroundColor: '#1e293b', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignItems: 'center' },
  locationIcon: { marginRight: 4, fontSize: 12 },
  locationText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  
  slabContainer: { backgroundColor: '#fff', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  slabScroll: { paddingHorizontal: 16 },
  slabTab: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f1f5f9', marginRight: 10 },
  slabTabActive: { backgroundColor: '#000' },
  slabTabText: { fontSize: 14, fontWeight: '600', color: '#64748b' },
  slabTabTextActive: { color: '#fff' },
  
  content: { flex: 1 },
  
  searchContainer: { margin: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent' },
  searchInputWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 16, shadowColor: '#000', shadowOffset: {width:0,height:4}, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  searchIconContainer: { marginRight: 8 },
  searchIconText: { fontSize: 18 },
  searchInput: { flex: 1, paddingVertical: 16, fontSize: 16, color: '#0f172a' },
  vegToggle: { marginLeft: 12, paddingVertical: 16, paddingHorizontal: 18, borderRadius: 16, backgroundColor: '#fff', shadowColor: '#000', shadowOffset: {width:0,height:4}, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4, borderWidth: 1, borderColor: '#e2e8f0' },
  vegToggleActive: { backgroundColor: '#16a34a', borderColor: '#16a34a' },
  vegToggleText: { color: '#16a34a', fontWeight: '900', fontSize: 14 },
  vegToggleTextActive: { color: '#fff' },
  
  centerMsg: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  msgText: { marginTop: 12, fontSize: 16, color: '#64748b', textAlign: 'center', lineHeight: 24 },
  
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#0f172a', marginBottom: 16, letterSpacing: -0.5 },
  restCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: {width:0,height:4}, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  restCardInner: { flexDirection: 'row' },
  restImage: { width: 65, height: 65, borderRadius: 10, marginRight: 16 },
  restDetails: { flex: 1, justifyContent: 'center' },
  restName: { fontSize: 17, fontWeight: '700', color: '#1e293b', marginBottom: 6 },
  platformChipsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  platformChip: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginRight: 6, marginBottom: 4 },
  platformChipText: { fontSize: 11, color: '#fff', fontWeight: 'bold' },
  compareBtn: { alignSelf: 'flex-start', paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#f8fafc', borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  compareBtnText: { fontSize: 12, fontWeight: '600', color: '#475569' },
  
  backBtn: { padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  backBtnText: { fontSize: 16, color: '#0f172a', fontWeight: '600' },
  menuTitle: { fontSize: 28, fontWeight: '900', color: '#000', marginBottom: 20, letterSpacing: -0.5 },
  dishCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: {width:0,height:2}, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2, borderWidth: 1, borderColor: '#f1f5f9' },
  dishName: { fontSize: 17, fontWeight: '700', color: '#1e293b', flex: 1, paddingRight: 12 },
  dishImage: { width: 70, height: 70, borderRadius: 10 },
  offerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f8fafc' },
  offerRowBest: { backgroundColor: '#f0fdf4', marginHorizontal: -16, paddingHorizontal: 16 },
  offerProviderInfo: { flexDirection: 'row', alignItems: 'center' },
  providerCircleSm: { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  providerCircleTextSm: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  offerProvider: { fontSize: 14, color: '#475569', fontWeight: '500' },
  offerPriceInfo: { flexDirection: 'row', alignItems: 'center' },
  bestBadge: { backgroundColor: '#16a34a', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginRight: 8 },
  bestBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  offerPrice: { fontSize: 15, fontWeight: '700', color: '#0f172a' },
  addBtn: { marginTop: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: '#16a34a', borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  addBtnText: { color: '#16a34a', fontWeight: '800', fontSize: 14, letterSpacing: 0.5 },
  
  connTitle: { fontSize: 28, fontWeight: '900', marginBottom: 24, letterSpacing: -0.5, color: '#000' },
  connCategory: { fontSize: 16, fontWeight: '700', color: '#64748b', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 },
  connGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  connCard: { width: '48%', backgroundColor: '#fff', borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 16, shadowColor: '#000', shadowOffset: {width:0,height:4}, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3, borderWidth: 1, borderColor: '#f1f5f9' },
  providerCircleLg: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  providerCircleTextLg: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  connName: { fontSize: 17, fontWeight: '700', marginBottom: 16, color: '#1e293b' },
  linkBtn: { backgroundColor: '#000', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, width: '100%', alignItems: 'center' },
  linkBtnText: { color: '#fff', fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  
  bottomNav: { flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingBottom: 24, paddingTop: 12 },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navIcon: { fontSize: 20, color: '#94a3b8', marginBottom: 6 },
  navText: { fontSize: 12, color: '#94a3b8', fontWeight: '700' },
  navActive: { color: '#000' },
  
  floatingCart: { position: 'absolute', bottom: 100, left: 16, right: 16, backgroundColor: '#14532d', borderRadius: 16, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#16a34a', shadowOffset: {width:0,height:8}, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 },
  floatingCartText: { color: '#fff', fontSize: 16, fontWeight: '800' }
});
