import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Modal } from 'react-native';
import { WebView } from 'react-native-webview';
import { WebViewExtractor } from './src/lib/WebViewExtractor';
import { LoginDriver } from './src/lib/LoginDriver';

// Mock Providers list for Mobile
const PROVIDERS = [
  { id: 'food-a', category: 'Food', subcategory: 'Food Delivery', name: 'Swiggy', icon: '🍔', authType: 'otp', url: 'https://www.swiggy.com', desc: 'Account-specific menu and cart pricing is available.' },
  { id: 'food-b', category: 'Food', subcategory: 'Food Delivery', name: 'Zomato', icon: '🍕', authType: 'both', url: 'https://www.zomato.com', desc: 'Connect to see live menu and cart pricing.' },
  { id: 'train-a', category: 'Food', subcategory: 'Train Food', name: 'IRCTC eCatering', icon: '🚂', authType: 'google', url: 'https://www.ecatering.irctc.co.in', desc: '' },
  { id: 'train-b', category: 'Food', subcategory: 'Train Food', name: 'Zoop', icon: '🍱', authType: 'otp', url: 'https://www.zoopindia.com', desc: '' },
  { id: 'train-c', category: 'Food', subcategory: 'Train Food', name: 'RailRestro', icon: '🍛', authType: 'both', url: 'https://www.railrestro.com', desc: '' },
  { id: 'train-d', category: 'Food', subcategory: 'Train Food', name: 'Travelkhana', icon: '🚂', authType: 'google', url: 'https://www.travelkhana.com', desc: '' }
];

const CATEGORIES = ['Food', 'Groceries', 'Shopping', 'Medicine', 'Services', 'Travel'];

export default function App() {
  const [activeTab, setActiveTab] = useState<'Search' | 'Connections'>('Connections');
  const [activeCategory, setActiveCategory] = useState('Food');
  
  // Connections state
  const [connectedProviders, setConnectedProviders] = useState<string[]>([]);
  
  // Native UI Login States (OTP)
  const [activeLoginProvider, setActiveLoginProvider] = useState<string | null>(null);
  const [phoneInputs, setPhoneInputs] = useState<Record<string, string>>({});
  const [otpInputs, setOtpInputs] = useState<Record<string, string>>({});
  const [loginSteps, setLoginSteps] = useState<Record<string, 'idle' | 'sending_phone' | 'awaiting_otp' | 'sending_otp'>>({});
  
  // Google Auth State (Modal)
  const [googleAuthProvider, setGoogleAuthProvider] = useState<string | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  // Disconnect logic
  const handleDisconnect = (id: string) => {
      setConnectedProviders(prev => prev.filter(p => p !== id));
      setLoginSteps(prev => ({...prev, [id]: 'idle'}));
      setPhoneInputs(prev => ({...prev, [id]: ''}));
      setOtpInputs(prev => ({...prev, [id]: ''}));
      setActiveLoginProvider(null);
  };

  const handleGetOtp = (id: string) => {
      const phone = phoneInputs[id];
      if (!phone || phone.length < 10) return;
      setLoginSteps(prev => ({...prev, [id]: 'sending_phone'}));
  };

  const handleVerifyOtp = (id: string, overrideOtp?: string) => {
      const otp = overrideOtp || otpInputs[id];
      if (!otp || otp.length < 4) return;
      setLoginSteps(prev => ({...prev, [id]: 'sending_otp'}));
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setResults([]);
    setTimeout(() => setIsSearching(false), 15000); // 15 sec timeout
  };

  const handleDataExtracted = (data: any) => {
    if (data.type === 'SEARCH_RESULTS' && data.data && data.data.length > 0) {
       setResults(prev => {
          const newOffers = data.data;
          const updated = [...prev];
          
          newOffers.forEach((offer: any) => {
             const existingGroup = updated.find(g => g.title.toLowerCase() === offer.title.toLowerCase());
             if (existingGroup) {
                 existingGroup.offers.push({
                     providerName: offer.providerName,
                     price: offer.price,
                     accountBenefits: []
                 });
                 existingGroup.lowestPrice = Math.min(existingGroup.lowestPrice, offer.price.finalPayablePrice);
             } else {
                 updated.push({
                     title: offer.title,
                     lowestPrice: offer.price.finalPayablePrice,
                     savings: 0,
                     offers: [{
                         providerName: offer.providerName,
                         price: offer.price,
                         accountBenefits: []
                     }]
                 });
             }
          });
          
          updated.forEach(g => {
              const prices = g.offers.map((o: any) => o.price.finalPayablePrice);
              const max = Math.max(...prices);
              const min = Math.min(...prices);
              g.savings = max - min;
          });
          
          return updated;
       });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Hidden Preloaded WebViews for 0-Latency OTP */}
      {PROVIDERS.map(p => {
          if (p.authType === 'google') return null;
          if (connectedProviders.includes(p.id)) return null;
          
          const isActive = activeLoginProvider === p.id;
          return (
             <LoginDriver 
                key={p.id}
                providerId={p.id}
                url={p.url}
                phone={phoneInputs[p.id] || ''}
                otp={otpInputs[p.id] || ''}
                triggerPhone={isActive && loginSteps[p.id] === 'sending_phone'}
                triggerOtp={isActive && loginSteps[p.id] === 'sending_otp'}
                onOtpRequested={() => {
                   if (isActive) setLoginSteps(prev => ({...prev, [p.id]: 'awaiting_otp'}));
                }}
                onSuccess={() => {
                   setConnectedProviders(prev => [...prev, p.id]);
                   setLoginSteps(prev => ({...prev, [p.id]: 'idle'}));
                   if (isActive) setActiveLoginProvider(null);
                }}
                onError={(msg) => {
                   console.log('Login error:', msg);
                   if (isActive) setLoginSteps(prev => ({...prev, [p.id]: 'idle'}));
                }}
             />
          );
      })}

      <View style={styles.header}>
        <Text style={styles.headerTitle}>CompareAll</Text>
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
                   const provider = PROVIDERS.find(p => p.id === id);
                   if (!provider) return null;
                   
                   let searchUrl = provider.url;
                   if (id === 'food-a') {
                       searchUrl = `https://www.swiggy.com/search?resmenu=${encodeURIComponent(searchQuery)}`;
                   } else if (id === 'food-b') {
                       searchUrl = `https://www.zomato.com/search?q=${encodeURIComponent(searchQuery)}`;
                   }
                   
                   return (
                     <WebViewExtractor 
                        key={id} 
                        url={searchUrl}
                        providerId={id}
                        isActive={true}
                        onDataExtracted={handleDataExtracted}
                        onError={(err) => console.log('Err:', err)}
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
              
              {Array.from(new Set(PROVIDERS.filter(p => p.category === activeCategory).map(p => p.subcategory))).map(subcat => {
                 const subcatProviders = PROVIDERS.filter(p => p.category === activeCategory && p.subcategory === subcat);
                 if (subcatProviders.length === 0) return null;
                 
                 return (
                    <View key={subcat} style={styles.subcatSection}>
                       <Text style={styles.subcatTitle}>{subcat}</Text>
                       <View style={styles.gridContainer}>
                          {subcatProviders.map(provider => {
                             const isConnected = connectedProviders.includes(provider.id);
                             const isExpanded = activeLoginProvider === provider.id;
                             const currentStep = loginSteps[provider.id] || 'idle';
                             
                             return (
                               <View key={provider.id} style={[styles.gridCard, isExpanded && styles.gridCardExpanded]}>
                                  <View style={styles.gridCardTop}>
                                     <View style={styles.gridIconBox}>
                                        <Text style={styles.gridIconText}>{provider.icon}</Text>
                                     </View>
                                     <Text style={styles.gridProviderName}>{provider.name}</Text>
                                  </View>
                                  
                                  {isConnected ? (
                                     <TouchableOpacity style={styles.disconnectBtnSmall} onPress={() => handleDisconnect(provider.id)}>
                                         <Text style={styles.disconnectBtnTextSmall}>Disconnect</Text>
                                     </TouchableOpacity>
                                  ) : (
                                     !isExpanded ? (
                                        <TouchableOpacity 
                                           style={styles.linkNowBtn} 
                                           onPress={() => {
                                              setActiveLoginProvider(provider.id);
                                              if (provider.authType !== 'google') {
                                                  setLoginSteps(prev => ({...prev, [provider.id]: 'idle'}));
                                              }
                                           }}
                                        >
                                           <Text style={styles.linkNowText}>LINK NOW</Text>
                                        </TouchableOpacity>
                                     ) : (
                                        <View style={styles.authContainer}>
                                            {(provider.authType === 'otp' || provider.authType === 'both') && (
                                                <>
                                                    {currentStep === 'idle' || currentStep === 'sending_phone' ? (
                                                        <View style={styles.inputCol}>
                                                           <TextInput 
                                                              style={styles.nativeInputSmall}
                                                              placeholder="Mobile number"
                                                              keyboardType="phone-pad"
                                                              value={phoneInputs[provider.id] || ''}
                                                              onChangeText={(t) => setPhoneInputs(prev => ({...prev, [provider.id]: t}))}
                                                              editable={currentStep === 'idle'}
                                                           />
                                                           <TouchableOpacity 
                                                              style={[styles.actionBtnSmall, currentStep === 'sending_phone' && styles.actionBtnLoading]}
                                                              onPress={() => handleGetOtp(provider.id)}
                                                              disabled={currentStep === 'sending_phone'}
                                                           >
                                                              {currentStep === 'sending_phone' ? (
                                                                  <ActivityIndicator size="small" color="#555" />
                                                              ) : (
                                                                  <Text style={styles.actionBtnTextSmall}>Get OTP</Text>
                                                              )}
                                                           </TouchableOpacity>
                                                        </View>
                                                    ) : (
                                                        <View style={styles.inputCol}>
                                                           <TextInput 
                                                              style={styles.nativeInputSmall}
                                                              placeholder="Enter OTP"
                                                              keyboardType="number-pad"
                                                              value={otpInputs[provider.id] || ''}
                                                              onChangeText={(t) => {
                                                                  setOtpInputs(prev => ({...prev, [provider.id]: t}));
                                                                  // Auto-verify when 6 digits are typed to save manual click time
                                                                  if (t.length === 6) {
                                                                      handleVerifyOtp(provider.id, t);
                                                                  }
                                                              }}
                                                              editable={currentStep === 'awaiting_otp'}
                                                           />
                                                           <TouchableOpacity 
                                                              style={[styles.actionBtnSmall, currentStep === 'sending_otp' && styles.actionBtnLoading]}
                                                              onPress={() => handleVerifyOtp(provider.id)}
                                                              disabled={currentStep === 'sending_otp'}
                                                           >
                                                              {currentStep === 'sending_otp' ? (
                                                                  <ActivityIndicator size="small" color="#555" />
                                                              ) : (
                                                                  <Text style={styles.actionBtnTextSmall}>Verify</Text>
                                                              )}
                                                           </TouchableOpacity>
                                                        </View>
                                                    )}
                                                </>
                                            )}

                                            {provider.authType === 'both' && (
                                                <Text style={styles.orText}>- OR -</Text>
                                            )}

                                            {(provider.authType === 'google' || provider.authType === 'both') && (
                                                <TouchableOpacity 
                                                   style={styles.googleBtn}
                                                   onPress={() => {
                                                       setGoogleAuthProvider(provider.id);
                                                   }}
                                                >
                                                   <Text style={styles.googleBtnText}>Continue with Google</Text>
                                                </TouchableOpacity>
                                            )}

                                            <TouchableOpacity style={styles.cancelBtnSmall} onPress={() => setActiveLoginProvider(null)}>
                                               <Text style={styles.cancelBtnText}>Cancel</Text>
                                            </TouchableOpacity>
                                        </View>
                                     )
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

      {/* Google Auth Modal */}
      <Modal
         visible={googleAuthProvider !== null}
         animationType="slide"
         onRequestClose={() => setGoogleAuthProvider(null)}
      >
         <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
            <View style={styles.modalHeader}>
               <Text style={styles.modalTitle}>Sign In</Text>
               <TouchableOpacity onPress={() => setGoogleAuthProvider(null)} style={styles.modalCloseBtn}>
                  <Text style={styles.modalCloseText}>Cancel</Text>
               </TouchableOpacity>
            </View>
            {googleAuthProvider && (
               <WebView 
                  source={{ uri: PROVIDERS.find(p => p.id === googleAuthProvider)?.url || 'https://google.com' }}
                  style={{flex: 1}}
                  thirdPartyCookiesEnabled={true}
                  userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
                  injectedJavaScript={`
                      // Basic logic: if we land on the provider's logged-in page, send SUCCESS message
                      window.addEventListener('load', () => {
                          // Very basic check, in production you'd use a better indicator
                          if (document.cookie.includes('session') || document.body.innerText.toLowerCase().includes('logout')) {
                              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'GOOGLE_SUCCESS' }));
                          }
                      });
                      true;
                  `}
                  onMessage={(event) => {
                      try {
                          const data = JSON.parse(event.nativeEvent.data);
                          if (data.type === 'GOOGLE_SUCCESS') {
                              setConnectedProviders(prev => [...prev, googleAuthProvider]);
                              setGoogleAuthProvider(null);
                          }
                      } catch (e) {}
                  }}
               />
            )}
         </SafeAreaView>
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
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
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
  }
});
