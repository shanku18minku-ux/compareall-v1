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
    (async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setLocation({ latitude: 24.0322, longitude: 84.0722, name: 'Daltonganj, Jharkhand' });
            } else {
                let loc = await Location.getCurrentPositionAsync({ accuracy: 5 });
                let geo = await Location.reverseGeocodeAsync({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
                let name = geo.length > 0 ? `${geo[0].city || geo[0].name}, ${geo[0].region}` : 'Current Location';
                setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude, name });
            }
        } catch(e) {
            setLocation({ latitude: 24.0322, longitude: 84.0722, name: 'Daltonganj, Jharkhand' });
        }
    })();
  }, []);

  // Fetch default data silently if Food is active and no search query
  useEffect(() => {
      if (activeTab === 'Search' && activeCategory === 'Food' && isAllConnected && !searchQuery && results.length === 0 && !isSearching) {
          setIsSearching(true);
          completedProvidersRef.current = new Set();
          if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
          searchTimerRef.current = setTimeout(() => setIsSearching(false), 15000);
      }
  }, [activeTab, activeCategory]);

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
             const dishName = item.dishName || item.name;
             const restName = item.restaurantName || item.restaurant;
             if (!dishName && !restName) return;

             const norm = (s: string) => (s||'').toLowerCase().replace(/[^a-z0-9]/g, '');
             const restKey = norm(restName);
             
             let group = updated.find(g => {
                   const gName = norm(g.restaurantName);
                   if (!restKey || !gName) return false;
                   if (gName === restKey) return true;
                   
                   // Avoid black-hole grouping where "Pizza" swallows "Domino's Pizza"
                   // Use strict word boundary check or high-similarity
                   const rWords = restName.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/);
                   const gWords = g.restaurantName.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/);
                   
                   if (rWords.length === 0 || gWords.length === 0) return false;
                   
                   // Require at least first two words to match if they are multi-word, or exact match if single word
                   if (rWords.length === 1 && gWords.length === 1) return rWords[0] === gWords[0];
                   
                   const n1 = rWords.join('');
                   const n2 = gWords.join('');
                   
                   // Perfect merge: If they share the exact same first word, AND one's full name is inside the other's
                   // (e.g. "Jain Shree" in "Jain Shree Sweets" -> MERGES)
                   // (e.g. "Burger King" vs "Burger Singh" -> BLOCKS, because neither contains the other)
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

             // Auto coupon extraction is handled inside the packet injection
             dishEntry.offers.push({
                 providerName: provider.name,
                 price: item.price,
                 deliveryTime: item.deliveryTime,
                 rating: item.rating,
                 couponCode: item.couponCode,
                 potentialSavings: item.couponSavings || item.autoCouponSavings || 0
             });
          });
          return updated;
      });
  };

  const activeProviders = (PROVIDERS || []).filter(p => p && p.category === activeCategory);
  
  const connectedCount = activeProviders.filter(p => connectedProviders.includes(p.id)).length;
  const isAllConnected = activeProviders.length > 0 && connectedCount === activeProviders.length;
  
  // Render Background Extractors
  const renderExtractors = () => {
      if (!isAllConnected) return null;
      if (!isSearching || activeCategory !== 'Food') return null;
      
      const fetchQuery = searchQuery || 'food'; // Default fallback
      return (
          <View style={{height: 0, opacity: 0}}>
              {activeProviders.map(provider => {
                  const packet = getPacket(provider.id);
                  if (!packet || !packet.getSearchUrl) return null;
                  const searchUrl = packet.getSearchUrl(fetchQuery);
                  // Keep key stable to prevent crashes
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
          {activeTab === 'Search' && activeCategory === 'Food' && !isAllConnected && (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20}}>
            <Text style={{fontSize: 50, marginBottom: 20}}>??</Text>
            <Text style={{fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, color: '#0f172a'}}>Connect All Apps</Text>
            <Text style={{fontSize: 16, textAlign: 'center', color: '#64748b', marginBottom: 30}}>
                To compare the lowest prices, you must login to all {activeProviders.length} food platforms first.
            </Text>
            <TouchableOpacity 
                style={{backgroundColor: '#ea580c', paddingVertical: 14, paddingHorizontal: 30, borderRadius: 12, elevation: 3}}
                onPress={() => setActiveTab('Connections')}
            >
                <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}>Go to Connections</Text>
            </TouchableOpacity>
        </View>
    )}
    
    {activeTab === 'Search' && activeCategory === 'Food' && isAllConnected && !selectedRest && (
             <View style={{flex: 1}}>
                 <View style={[styles.searchContainer, {flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent', elevation: 0, padding: 0}]}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 16, elevation: 2}}>
              <Text style={styles.searchIcon}>??</Text>
              <TextInput 
                  style={[styles.searchInput, {flex: 1, marginBottom: 0, elevation: 0, backgroundColor: 'transparent'}]}
                  placeholder="Search restaurants or dishes..."
                  defaultValue={searchQuery}
                  onSubmitEditing={(e) => { setSearchQuery(e.nativeEvent.text); handleSearch(e.nativeEvent.text); }}
                  returnKeyType="search"
              />
          </View>
          <TouchableOpacity 
              style={{marginLeft: 12, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, backgroundColor: isVegOnly ? '#16a34a' : '#fff', elevation: 2, borderWidth: 1, borderColor: isVegOnly ? '#16a34a' : '#e2e8f0'}}
              onPress={() => setIsVegOnly(!isVegOnly)}
          >
              <Text style={{color: isVegOnly ? '#fff' : '#16a34a', fontWeight: '900', fontSize: 14}}>VEG</Text>
          </TouchableOpacity>
      </View>
                 
                 {isSearching && results.length === 0 ? (
                     <View style={styles.centerMsg}>
                         <ActivityIndicator size="large" color="#000" />
                         <Text style={styles.msgText}>Finding best prices nearby...</Text>
                     </View>
                 ) : (
                     <ScrollView contentContainerStyle={{padding: 16}}>
                         <Text style={styles.sectionTitle}>{searchQuery ? `Results for "${searchQuery}"` : 'Restaurants near you'}</Text>
                         {displayedResults.map((group, idx) => (
                             <TouchableOpacity key={idx} style={styles.restCard} onPress={() => setSelectedRest(group)}>
                                 <View style={styles.restCardHeader}>
                                       {group.imageUrl ? <Image source={{uri: group.imageUrl}} style={{width: 50, height: 50, borderRadius: 8, marginRight: 12}} /> : null}
                                       <View style={{flex: 1}}>
                                           <Text style={styles.restName}>{group.restaurantName}</Text>
                                           <Text style={styles.openText}>Open Now</Text>
                                       </View>
                                   </View>
                                 <View style={styles.restProviders}>
                                     {Array.from(new Set(group.dishes.flatMap((d:any) => d.offers.map((o:any)=>o.providerName)))).map((p:any) => (
                                         <View key={p} style={styles.restProviderChip}>
                                            <Text style={styles.restProviderText}>{p}</Text>
                                         </View>
                                     ))}
                                 </View>
                                 <View style={styles.openMenuBtn}>
                                     <Text style={styles.openMenuText}>Open Menu ➔</Text>
                                 </View>
                             </TouchableOpacity>
                         ))}
                     </ScrollView>
                 )}
             </View>
          )}

          {activeTab === 'Search' && activeCategory === 'Food' && isAllConnected && selectedRest && (
             <View style={{flex: 1}}>
                 <TouchableOpacity style={styles.backBtn} onPress={() => setSelectedRest(null)}>
                     <Text style={{fontSize: 16}}>← Back to {searchQuery ? 'search' : 'restaurants'}</Text>
                 </TouchableOpacity>
                 <ScrollView contentContainerStyle={{padding: 16, paddingBottom: 100}}>
                     <Text style={styles.menuTitle}>{selectedRest.restaurantName}</Text>
                     
                     {selectedRest.dishes.map((dish: any, dIdx: number) => (
                         <View key={dIdx} style={styles.dishCard}>
                               <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                   <Text style={[styles.dishName, {flex: 1}]}>{dish.dishName}</Text>
                                   {dish.imageUrl ? <Image source={{uri: dish.imageUrl}} style={{width: 70, height: 70, borderRadius: 8, marginLeft: 12}} /> : null}
                               </View>
                             {dish.offers.map((offer: any, oIdx: number) => (
                                 <View key={oIdx} style={styles.offerRow}>
                                     <Text style={styles.offerProvider}>{offer.providerName}</Text>
                                     <Text style={styles.offerPrice}>₹{offer.price?.finalPayablePrice || offer.price?.basePrice || 0}</Text>
                                 </View>
                             ))}
                             <TouchableOpacity 
                                style={styles.addBtn}
                                onPress={() => {
                                    Vibration.vibrate(20);
                                    const bestOffer = dish.offers.sort((a:any, b:any) => (a.price?.finalPayablePrice||0) - (b.price?.finalPayablePrice||0))[0];
                                    setCartItems(prev => {
                                        const exist = prev.find(i => i.id === dish.dishName);
                                        if (exist) return prev.map(i => i.id === dish.dishName ? {...i, quantity: i.quantity + 1} : i);
                                        return [...prev, { id: dish.dishName, title: dish.dishName, quantity: 1, offers: dish.offers, bestOffer }];
                                    });
                                    setIsCartVisible(true);
                                }}
                             >
                                 <Text style={styles.addBtnText}>ADD</Text>
                             </TouchableOpacity>
                         </View>
                     ))}
                 </ScrollView>
             </View>
          )}

          {activeTab === 'Connections' && (
              <ScrollView contentContainerStyle={{padding: 16}}>
                  <Text style={styles.connTitle}>Link Accounts</Text>
                  
                  <Text style={styles.connCategory}>Food Delivery</Text>
                  <View style={styles.connGrid}>
                      {activeProviders.map(p => {
                          const isConn = connectedProviders.includes(p.id);
                          return (
                              <View key={p.id} style={styles.connCard}>
                                  <Text style={styles.connIcon}>{p.icon || '??'}</Text>
                                  <Text style={styles.connName}>{p.name}</Text>
                                  {isConn ? (
                                      <View style={[styles.linkBtn, {backgroundColor: '#16a34a'}]}>
                                          <Text style={styles.linkBtnText}>CONNECTED</Text>
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
              <Text style={styles.floatingCartText}>View Cart ?</Text>
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
  header: { alignItems: 'center', paddingVertical: 12, backgroundColor: '#fff' },
  headerLogo: { fontSize: 22, fontWeight: 'bold', color: '#000', marginBottom: 6 },
  locationPill: { flexDirection: 'row', backgroundColor: '#1e293b', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignItems: 'center' },
  locationIcon: { marginRight: 4, fontSize: 12 },
  locationText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  
  slabContainer: { backgroundColor: '#fff', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  slabScroll: { paddingHorizontal: 16 },
  slabTab: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f1f5f9', marginRight: 10 },
  slabTabActive: { backgroundColor: '#000' },
  slabTabText: { fontSize: 14, fontWeight: '600', color: '#64748b' },
  slabTabTextActive: { color: '#fff' },
  
  content: { flex: 1 },
  searchContainer: { margin: 16, flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: {width:0,height:2}, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  searchIcon: { fontSize: 18, marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 14, fontSize: 16 },
  
  centerMsg: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  msgText: { marginTop: 12, fontSize: 16, color: '#64748b' },
  
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', marginBottom: 16 },
  restCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: {width:0,height:1}, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  restCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  restName: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },
  openText: { fontSize: 12, color: '#16a34a', fontWeight: 'bold' },
  restProviders: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  restProviderChip: { backgroundColor: '#f1f5f9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginRight: 6 },
  restProviderText: { fontSize: 12, color: '#475569' },
  openMenuBtn: { backgroundColor: '#f8fafc', paddingVertical: 10, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  openMenuText: { fontSize: 14, fontWeight: '600', color: '#3b82f6' },
  
  backBtn: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  menuTitle: { fontSize: 22, fontWeight: 'bold', color: '#000', marginBottom: 16 },
  dishCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12 },
  dishName: { fontSize: 16, fontWeight: 'bold', color: '#1e293b', marginBottom: 12 },
  offerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' },
  offerProvider: { fontSize: 14, color: '#475569' },
  offerPrice: { fontSize: 14, fontWeight: 'bold', color: '#0f172a' },
  addBtn: { marginTop: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#16a34a', borderRadius: 8, paddingVertical: 8, alignItems: 'center' },
  addBtnText: { color: '#16a34a', fontWeight: 'bold', fontSize: 14 },
  
  connTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  connCategory: { fontSize: 18, fontWeight: 'bold', color: '#334155', marginBottom: 12 },
  connGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  connCard: { width: '48%', backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 16, shadowColor: '#000', shadowOffset: {width:0,height:1}, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  connIcon: { fontSize: 32, marginBottom: 8 },
  connName: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  linkBtn: { backgroundColor: '#000', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, width: '100%', alignItems: 'center' },
  linkBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  
  bottomNav: { flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingBottom: 20, paddingTop: 10 },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navIcon: { fontSize: 20, color: '#94a3b8', marginBottom: 4 },
  navText: { fontSize: 12, color: '#94a3b8', fontWeight: '600' },
  navActive: { color: '#0ea5e9' },
  
  floatingCart: { position: 'absolute', bottom: 90, left: 16, right: 16, backgroundColor: '#16a34a', borderRadius: 12, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOffset: {width:0,height:4}, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5 },
  floatingCartText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
