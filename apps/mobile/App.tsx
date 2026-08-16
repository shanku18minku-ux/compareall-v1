import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Modal, Vibration } from 'react-native';
import * as Location from 'expo-location';
import { WebViewExtractor } from './src/lib/WebViewExtractor';
import { LoginWebViewModal } from './src/lib/LoginWebViewModal';
import { getPacket, getAllProvidersMetadata } from './src/lib/packets/registry';

// Load platform metadata dynamically from registered packets
const PROVIDERS = getAllProvidersMetadata();

const CATEGORIES = ['Food', 'Groceries', 'Shopping', 'Medicine', 'Services', 'Travel'];

export default function App() {
  const [activeTab, setActiveTab] = useState<'Search' | 'Connections'>('Connections');
  const [activeCategory, setActiveCategory] = useState('Food');

  // Connections state
  const [connectedProviders, setConnectedProviders] = useState<string[]>([]);

  // Login modal state — which provider's website is shown right now
  const [loginModal, setLoginModal] = useState<{ id: string; name: string; icon: string; loginUrl: string } | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  // Location State
  const [location, setLocation] = useState<{ latitude: number; longitude: number; name: string } | null>(null);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [manualLocationInput, setManualLocationInput] = useState('');
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

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
     return PROVIDERS.filter(p => {
         if (p.regions.includes('all')) return true;
         return p.regions.some(region => locName.includes(region));
     });
  };

  // Disconnect logic
  const handleDisconnect = (id: string) => {
      setConnectedProviders(prev => prev.filter(p => p !== id));
      Vibration.vibrate(50);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setResults([]);
    setTimeout(() => setIsSearching(false), 15000);
  };

  const handleDataExtracted = (data: any) => {
    const items = data.data || data.items || (Array.isArray(data) ? data : []);
    if (items && items.length > 0) {
       setResults(prev => {
          const updated = [...prev];
          items.forEach((offer: any) => {
             const title = offer.title || offer.name || 'Dish Item';
             const finalPrice = typeof offer.price === 'object' ? offer.price.finalPayablePrice : (Number(offer.price) || 0);
             const basePrice = typeof offer.price === 'object' ? offer.price.basePrice : (Number(offer.originalPrice || offer.price) || finalPrice);
             const discount = typeof offer.price === 'object' ? offer.price.discount : (basePrice - finalPrice);
             const providerName = offer.providerName || 'Swiggy';
             
             const existingGroup = updated.find(g => g.title.toLowerCase() === title.toLowerCase());
             if (existingGroup) {
                 existingGroup.offers.push({ providerName, price: { finalPayablePrice: finalPrice, basePrice, discount }, accountBenefits: [] });
                 existingGroup.lowestPrice = Math.min(existingGroup.lowestPrice, finalPrice);
             } else {
                 updated.push({ 
                   title, 
                   lowestPrice: finalPrice, 
                   savings: Math.max(0, discount), 
                   offers: [{ providerName, price: { finalPayablePrice: finalPrice, basePrice, discount }, accountBenefits: [] }] 
                 });
             }
          });
          updated.forEach(g => {
              const prices = g.offers.map((o: any) => o.price.finalPayablePrice);
              g.savings = Math.max(...prices) - Math.min(...prices);
          });
          return updated;
       });
       setIsSearching(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* Login WebView Modal — opens real platform website */}
      {loginModal && (
        <LoginWebViewModal
          visible={true}
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
            
            <View style={styles.searchBox}>
              <TextInput 
                style={styles.input} 
                placeholder="Search food, groceries, flights..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
              />
              <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
                <Text style={styles.searchBtnText}>Search</Text>
              </TouchableOpacity>
            </View>
            
            {isSearching && (
              <View style={styles.loadingBox}>
                <Text>Extracting private data in background...</Text>
                {connectedProviders.map(id => {
                   const provider = getFilteredProviders().find(p => p.id === id);
                   if (!provider) return null;
                   
                   const packet = getPacket(id);
                   const searchUrl = packet ? packet.getSearchUrl(searchQuery) : provider.url;
                   const injectionScript = packet ? packet.getExtractorInjection(searchUrl) : undefined;
                   
                   return (
                     <WebViewExtractor 
                        key={id} 
                        url={searchUrl}
                        providerId={id}
                        location={location}
                        isActive={true}
                        onDataExtracted={handleDataExtracted}
                        onError={(err) => console.log('Err:', err)}
                        injectionScript={injectionScript}
                     />
                   );
                })}
              </View>
            )}

            <ScrollView style={styles.resultsContainer}>
              {results.map((group, index) => (
                <View key={index} style={styles.resultCard}>
                  <Text style={styles.resultTitle}>{group.title}</Text>
                  <Text style={styles.resultBestPrice}>Best Price: ₹{group.lowestPrice} (Save ₹{group.savings})</Text>
                  
                  {group.offers.map((offer: any, i: number) => (
                    <View key={i} style={styles.offerItem}>
                      <Text style={styles.offerProvider}>{offer.providerName}</Text>
                      <Text style={styles.offerPrice}>₹{offer.price.finalPayablePrice} <Text style={styles.basePrice}>(Base: ₹{offer.price.basePrice})</Text></Text>
                      {offer.price.discount > 0 && <Text style={styles.discount}>Discount: -₹{offer.price.discount}</Text>}
                    </View>
                  ))}
                </View>
              ))}
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

            <ScrollView style={styles.tabContent}>
              <Text style={styles.pageTitle}>Link Accounts</Text>
              
              {!location && <Text style={{color: '#e91e63', marginBottom: 15, fontSize: 13, fontWeight: '600', paddingHorizontal: 15}}>📍 Note: Train delivery apps will only appear if your location is a railway station.</Text>}
              
              {Array.from(new Set(getFilteredProviders().filter(p => p.category === activeCategory).map(p => p.subcategory))).map(subcat => {
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
              })}
            </ScrollView>
          </View>
        )}
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Search')}>
          <Text style={styles.navIcon}>🔍</Text>
          <Text style={[styles.navText, activeTab === 'Search' && styles.navTextActive]}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Connections')}>
          <Text style={styles.navIcon}>🔗</Text>
          <Text style={[styles.navText, activeTab === 'Connections' && styles.navTextActive]}>Connections</Text>
        </TouchableOpacity>
      </View>


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
  resultBestPrice: {
    fontSize: 14,
    color: 'green',
    fontWeight: '600',
    marginBottom: 15,
  },
  offerItem: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  offerProvider: {
    fontWeight: '600',
    fontSize: 16,
  },
  offerPrice: {
    fontSize: 15,
    marginTop: 2,
  },
  basePrice: {
    color: '#888',
    textDecorationLine: 'line-through',
  },
  discount: {
    color: 'green',
    fontSize: 13,
    marginTop: 2,
  },
  benefit: {
    color: '#ff9500',
    fontSize: 13,
    marginTop: 2,
    fontWeight: '500',
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
  }
});
