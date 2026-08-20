// @ts-nocheck
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  SafeAreaView, View, Text, TextInput, TouchableOpacity, ScrollView, 
  Image, StyleSheet, ActivityIndicator, Vibration, Keyboard, StatusBar
} from 'react-native';
import { PROVIDERS, getPacket } from './src/lib/packets/registry';
import { WebViewExtractor } from './src/lib/WebViewExtractor';
import { UniversalCartModal } from './src/lib/UniversalCartModal';
import { LoginWebViewModal } from './src/lib/LoginWebViewModal';
import * as Location from 'expo-location';

const CATEGORIES = ['Food', 'Commute', 'Groceries', 'Shopping', 'Medicine', 'Services', 'Travel'];

const normalizeText = (s: string) => s ? s.normalize('NFC').replace(/[\u200B-\u200D\uFEFF\u00AD]/g, '') : s;

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

  // Default fetch on load
  useEffect(() => {
    const timer = setTimeout(async () => {
        try {
            try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setLocation({ latitude: 24.0322, longitude: 84.0722, name: 'Daltonganj, Jharkhand' });
        } else {
            let loc = await Location.getCurrentPositionAsync({ accuracy: 5 }).catch(() => null);
            if (!loc) {
                setLocation({ latitude: 24.0322, longitude: 84.0722, name: 'Daltonganj, Jharkhand (Fallback)' });
            } else {
                let geo = await Location.reverseGeocodeAsync({ latitude: loc.coords.latitude, longitude: loc.coords.longitude }).catch(() => []);
                let name = geo && geo.length > 0 ? (geo[0].city || geo[0].name || '') + ', ' + (geo[0].region || '') : 'Current Location';
                setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude, name });
            }
        }
    } catch(e) {
        setLocation({ latitude: 24.0322, longitude: 84.0722, name: 'Daltonganj, Jharkhand' });
    }
        } catch(e) {
            setLocation({ latitude: 24.0322, longitude: 84.0722, name: 'Daltonganj, Jharkhand' });
        }
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch default data silently if Food is active and no search query
  useEffect(() => {
      if (activeTab === 'Search' && activeCategory === 'Food' && !searchQuery && results.length === 0 && !isSearching && location !== null) {
          setIsSearching(true);
          completedProvidersRef.current = new Set();
          if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
          searchTimerRef.current = setTimeout(() => setIsSearching(false), 15000);
      }
  }, [activeTab, activeCategory, location]);

  const handleSearch = (q: string) => {
      Keyboard.dismiss();
      const val = q.trim();
      if (!val) return;
      setSearchQuery(val);
      setSelectedRest(null); // Close restaurant details if open
      setResults([]);
      setIsSearching(true);
      completedProvidersRef.current.clear();
      
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
      searchTimerRef.current = setTimeout(() => setIsSearching(false), 15000);
  };

  const handleDataExtracted = (data: any, providerId: string) => {
      completedProvidersRef.current.add(providerId);
      const items = data.data || data.items || [];
      if (!items.length) return;
      const provider = PROVIDERS.find(p => p.id === providerId);
      if (!provider) return;

      setResults(prev => {
          let updated = [...prev];
          items.forEach((item: any) => {
             const dishNameRaw = item.dishName || item.name;
             const restNameRaw = item.restaurantName || item.restaurant;
             if (!dishNameRaw && !restNameRaw) return;

             const dishName = normalizeText(dishNameRaw);
             const restName = normalizeText(restNameRaw);

             const norm = (s: string) => (s||'').toLowerCase().replace(/[^a-z0-9]/g, '');
             const restKey = norm(restName);
             
             let group = updated.find(g => {
                   const gName = norm(g.restaurantName);
                   if (!restKey || !gName) return false;
                   if (gName === restKey) return true;
                   
                   const rWords = restName.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/);
                   const gWords = g.restaurantName.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/);
                   
                   if (rWords.length === 0 || gWords.length === 0) return false;
                   
                   if (rWords.length === 1 && gWords.length === 1) return rWords[0] === gWords[0];
                   
                   const n1 = rWords.join('');
                   const n2 = gWords.join('');
                   
                   if (rWords[0] === gWords[0] && (n1.includes(n2) || n2.includes(n1))) {
                       return true;
                   }
                   
                   return false;
               });
             if (!group) {
                 group = { id: `rest_${Date.now()}_${Math.random()}`, restaurantName: restName || 'Unknown', imageUrl: item.restaurantImage || item.imageUrl || '', dishes: [] };
                 updated.push(group);
               } else if (!group.imageUrl && (item.restaurantImage || item.imageUrl)) {
                   group.imageUrl = item.restaurantImage || item.imageUrl;
               }

             const dishKey = norm(dishName);
             let dishEntry = group.dishes.find((d: any) => norm(d.dishName) === dishKey);
             if (!dishEntry) {
                 dishEntry = { dishName, imageUrl: item.dishImage || item.imageUrl || '', offers: [] };
                 group.dishes.push(dishEntry);
               } else if (!dishEntry.imageUrl && (item.dishImage || item.imageUrl)) {
                   dishEntry.imageUrl = item.dishImage || item.imageUrl;
               }

             // DEDUP: Only add offer if this provider hasn't already added one for this dish
             const alreadyHasOffer = dishEntry.offers.some((o: any) => o.providerName === provider.name);
             if (!alreadyHasOffer) {
                 dishEntry.offers.push({
                     providerName: provider.name,
                     price: item.price,
                     deliveryTime: item.deliveryTime,
                     rating: item.rating,
                     couponCode: item.couponCode,
                     potentialSavings: item.couponSavings || item.autoCouponSavings || 0,
                     isPersonalized: connectedProviders.includes(providerId), // flag for connected accounts
                 });
             }
          });
          return updated;
      });
  };

  const activeProviders = (PROVIDERS || []).filter(p => p && p.category === activeCategory);
  
  const connectedCount = activeProviders.filter(p => connectedProviders.includes(p.id)).length;
  const isAllConnected = activeProviders.length > 0 && connectedCount === activeProviders.length;

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
      switch (name.toUpperCase()) {
          case 'ZOMATO': return '#cb202d';
          case 'SWIGGY': return '#ff5200';
          case 'EATSURE': return '#4945be';
          case 'EATCLUB': return '#305bea';
          default: return '#000000';
      }
  };

  const getProviderInitial = (name: string) => {
      switch (name.toUpperCase()) {
          case 'ZOMATO': return 'Z';
          case 'SWIGGY': return 'S';
          case 'EATSURE': return 'E';
          case 'EATCLUB': return 'C';
          default: return name.charAt(0);
      }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.headerLogo}>CompareAll</Text>
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
                 
                 {isSearching && results.length === 0 ? (
                     <View style={styles.centerMsg}>
                         <ActivityIndicator size="large" color="#000" />
                         <Text style={styles.msgText}>Searching for best prices...</Text>
                     </View>
                 ) : results.length === 0 && !isSearching ? (
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
                 <ScrollView contentContainerStyle={{padding: 16, paddingBottom: 100}}>
                     <Text style={styles.menuTitle}>{selectedRest.restaurantName}</Text>
                     
                     {selectedRest.dishes.map((dish: any, dIdx: number) => {
                       const sortedOffers = [...dish.offers].sort((a:any, b:any) => 
                         (a.price?.finalPayablePrice||a.price?.basePrice||999) - (b.price?.finalPayablePrice||b.price?.basePrice||999)
                       );
                       const bestOffer = sortedOffers[0];
                       const worstPrice = sortedOffers[sortedOffers.length-1];
                       const savings = sortedOffers.length > 1 
                         ? (worstPrice?.price?.finalPayablePrice||worstPrice?.price?.basePrice||0) - (bestOffer?.price?.finalPayablePrice||bestOffer?.price?.basePrice||0)
                         : 0;
                     
                       return (
                         <View key={dIdx} style={styles.dishCard}>
                           {/* Dish Header */}
                           <View style={{flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12}}>
                             <View style={{flex: 1}}>
                               <Text style={styles.dishName}>{dish.dishName}</Text>
                               {savings > 0 && (
                                 <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 4}}>
                                   <View style={{backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4}}>
                                     <Text style={{color: '#16a34a', fontSize: 11, fontWeight: '700'}}>Save up to ₹{savings}</Text>
                                   </View>
                                 </View>
                               )}
                             </View>
                             {dish.imageUrl 
                               ? <Image source={{uri: dish.imageUrl}} style={styles.dishImage} resizeMode="cover" />
                               : <View style={[styles.dishImage, {backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e2e8f0'}]}>
                                   <Text style={{fontSize: 22}}>🍽</Text>
                                 </View>
                             }
                           </View>
                     
                           {/* Platform Comparison Rows */}
                           <View style={{backgroundColor: '#f8fafc', borderRadius: 10, overflow: 'hidden', marginBottom: 12}}>
                             {/* Header row */}
                             <View style={{flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#f1f5f9'}}>
                               <Text style={{flex: 1, fontSize: 11, fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5}}>Platform</Text>
                               <Text style={{fontSize: 11, fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginRight: 40}}>Delivery</Text>
                               <Text style={{fontSize: 11, fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5}}>Price</Text>
                             </View>
                             {sortedOffers.map((offer: any, oIdx: number) => {
                               const isBest = oIdx === 0;
                               const provColor = getProviderColor(offer.providerName);
                               const provInit = getProviderInitial(offer.providerName);
                               const price = offer.price?.finalPayablePrice || offer.price?.basePrice || 0;
                               const eta = offer.deliveryTime ? String(offer.deliveryTime).replace(/[?]/g,'').trim() : '~30 min';
                               return (
                                 <View key={oIdx} style={[{
                                   flexDirection: 'row', alignItems: 'center',
                                   paddingHorizontal: 12, paddingVertical: 10,
                                   borderBottomWidth: oIdx < sortedOffers.length-1 ? 1 : 0,
                                   borderBottomColor: '#e2e8f0',
                                 }, isBest && {backgroundColor: '#f0fdf4'}]}>
                                   {/* Provider info */}
                                   <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
                                     <View style={{width: 28, height: 28, borderRadius: 14, backgroundColor: provColor, alignItems: 'center', justifyContent: 'center', marginRight: 8}}>
                                       <Text style={{color: '#fff', fontSize: 12, fontWeight: '900'}}>{provInit}</Text>
                                     </View>
                                     <View>
                                       <Text style={{fontSize: 14, fontWeight: '700', color: '#1e293b'}}>{offer.providerName}</Text>
                                       {isBest && <Text style={{fontSize: 10, color: '#16a34a', fontWeight: '600'}}>Best Price</Text>}
                                     </View>
                                   </View>
                                   {/* ETA */}
                                   <Text style={{fontSize: 12, color: '#64748b', width: 70, textAlign: 'center'}}>{eta || '~30 min'}</Text>
                                   {/* Price */}
                                   <View style={{alignItems: 'flex-end', minWidth: 60}}>
                                     {isBest && <View style={{backgroundColor: '#16a34a', paddingHorizontal: 5, paddingVertical: 1, borderRadius: 3, marginBottom: 2}}>
                                       <Text style={{color: '#fff', fontSize: 9, fontWeight: '800'}}>BEST</Text>
                                     </View>}
                                     <Text style={{fontSize: 16, fontWeight: '800', color: isBest ? '#16a34a' : '#1e293b'}}>₹{price}</Text>
                                     {offer.couponCode && <Text style={{fontSize: 9, color: '#f97316'}}>Use: {offer.couponCode}</Text>}
                                   </View>
                                 </View>
                               );
                             })}
                           </View>
                     
                           {/* ADD TO CART Button */}
                           <TouchableOpacity 
                             style={styles.addBtn}
                             onPress={() => {
                               Vibration.vibrate(20);
                               setCartItems(prev => {
                                 const exist = prev.find(i => i.id === dish.dishName);
                                 if (exist) return prev.map(i => i.id === dish.dishName ? {...i, quantity: i.quantity + 1} : i);
                                 return [...prev, { id: dish.dishName, title: dish.dishName, quantity: 1, offers: dish.offers, bestOffer }];
                               });
                               // DO NOT call setIsCartVisible(true) here - floating cart will show
                             }}
                           >
                             <Text style={styles.addBtnText}>+ ADD TO CART</Text>
                           </TouchableOpacity>
                         </View>
                       );
                     })}
                 </ScrollView>
             </View>
          )}

          {activeTab === 'Connections' && (
              <ScrollView contentContainerStyle={{padding: 16}}>
                  <Text style={styles.connTitle}>Link Accounts</Text>
                  <Text style={{fontSize: 13, color: '#64748b', marginBottom: 16, lineHeight: 18}}>
                    Connect your delivery accounts to unlock personalized best deals & exclusive discounts.
                  </Text>
                  
                  <Text style={styles.connCategory}>Food Delivery</Text>
                  <View style={styles.connGrid}>
                      {activeProviders.map(p => {
                          const isConn = connectedProviders.includes(p.id);
                          return (
                              <View key={p.id} style={styles.connCard}>
                                  {/* Provider circle icon */}
                                  <View style={[styles.providerCircleLg, {backgroundColor: getProviderColor(p.name)}]}>
                                      <Text style={styles.providerCircleTextLg}>{getProviderInitial(p.name)}</Text>
                                  </View>
                                  <Text style={styles.connName}>{p.name}</Text>
                                  
                                  {isConn ? (
                                      <View style={{width: '100%', alignItems: 'center'}}>
                                          {/* Connected badge */}
                                          <View style={{backgroundColor: '#dcfce7', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, marginBottom: 8, width: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
                                              <Text style={{color: '#16a34a', fontSize: 12, fontWeight: '800'}}>✓ CONNECTED</Text>
                                          </View>
                                          {/* Disconnect button */}
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
