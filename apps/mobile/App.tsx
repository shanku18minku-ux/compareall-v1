import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { WebViewExtractor } from './src/lib/WebViewExtractor';
import { LoginDriver } from './src/lib/LoginDriver';

// Mock Providers list for Mobile
const PROVIDERS = [
  { id: 'food-a', name: 'Swiggy', url: 'https://www.swiggy.com', desc: 'Account-specific menu and cart pricing is available.' },
  { id: 'food-b', name: 'Zomato', url: 'https://www.zomato.com', desc: 'Connect to see live menu and cart pricing.' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'Search' | 'Connections'>('Connections');
  
  // Connections state
  const [connectedProviders, setConnectedProviders] = useState<string[]>([]);
  
  // Native UI Login States
  const [activeLoginProvider, setActiveLoginProvider] = useState<string | null>(null);
  const [phoneInputs, setPhoneInputs] = useState<Record<string, string>>({});
  const [otpInputs, setOtpInputs] = useState<Record<string, string>>({});
  const [loginSteps, setLoginSteps] = useState<Record<string, 'idle' | 'sending_phone' | 'awaiting_otp' | 'sending_otp'>>({});
  
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
      setActiveLoginProvider(id);
      setLoginSteps(prev => ({...prev, [id]: 'sending_phone'}));
  };

  const handleVerifyOtp = (id: string) => {
      const otp = otpInputs[id];
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
      {activeLoginProvider && (
          <LoginDriver 
             providerId={activeLoginProvider}
             url={PROVIDERS.find(p => p.id === activeLoginProvider)?.url || ''}
             phone={phoneInputs[activeLoginProvider] || ''}
             otp={otpInputs[activeLoginProvider] || ''}
             triggerPhone={loginSteps[activeLoginProvider] === 'sending_phone'}
             triggerOtp={loginSteps[activeLoginProvider] === 'sending_otp'}
             onOtpRequested={() => setLoginSteps(prev => ({...prev, [activeLoginProvider]: 'awaiting_otp'}))}
             onSuccess={() => {
                 setConnectedProviders(prev => [...prev, activeLoginProvider]);
                 setLoginSteps(prev => ({...prev, [activeLoginProvider]: 'idle'}));
                 setActiveLoginProvider(null);
             }}
             onError={(msg) => {
                 console.log('Login error:', msg);
                 setLoginSteps(prev => ({...prev, [activeLoginProvider]: 'idle'}));
             }}
          />
      )}

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
          <ScrollView style={styles.tabContent}>
            <Text style={styles.title}>Food Delivery</Text>
            <Text style={styles.subtitle}>Connect Swiggy and Zomato for live menu and cart pricing.</Text>
            
            <View style={styles.providerList}>
              {PROVIDERS.map(provider => {
                const isConnected = connectedProviders.includes(provider.id);
                const currentStep = loginSteps[provider.id] || 'idle';
                
                return (
                  <View key={provider.id} style={styles.premiumCard}>
                    <View style={styles.premiumCardHeader}>
                       <View style={styles.providerBrandBox}>
                          <Text style={styles.providerBrandText}>{provider.name[0]}</Text>
                       </View>
                       <View style={styles.providerInfo}>
                          <Text style={styles.providerName}>{provider.name}</Text>
                          <Text style={styles.providerDesc}>{provider.desc}</Text>
                       </View>
                       {isConnected ? (
                          <View style={styles.badgeConnected}><Text style={styles.badgeTextConnected}>Connected</Text></View>
                       ) : (
                          <View style={styles.badgeNotConnected}><Text style={styles.badgeTextNotConnected}>Not Connected</Text></View>
                       )}
                    </View>

                    {isConnected ? (
                        <TouchableOpacity style={styles.disconnectBtnFull} onPress={() => handleDisconnect(provider.id)}>
                            <Text style={styles.disconnectBtnTextFull}>Disconnect</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.authContainer}>
                            {currentStep === 'idle' || currentStep === 'sending_phone' ? (
                                <View style={styles.inputRow}>
                                   <TextInput 
                                      style={styles.nativeInput}
                                      placeholder="Mobile number"
                                      keyboardType="phone-pad"
                                      value={phoneInputs[provider.id] || ''}
                                      onChangeText={(t) => setPhoneInputs(prev => ({...prev, [provider.id]: t}))}
                                      editable={currentStep === 'idle'}
                                   />
                                   <TouchableOpacity 
                                      style={[styles.actionBtn, currentStep === 'sending_phone' && styles.actionBtnLoading]}
                                      onPress={() => handleGetOtp(provider.id)}
                                      disabled={currentStep === 'sending_phone'}
                                   >
                                      {currentStep === 'sending_phone' ? (
                                          <ActivityIndicator size="small" color="#555" />
                                      ) : (
                                          <Text style={styles.actionBtnText}>Get OTP</Text>
                                      )}
                                   </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={styles.inputRow}>
                                   <TextInput 
                                      style={styles.nativeInput}
                                      placeholder="Enter OTP"
                                      keyboardType="number-pad"
                                      value={otpInputs[provider.id] || ''}
                                      onChangeText={(t) => setOtpInputs(prev => ({...prev, [provider.id]: t}))}
                                      editable={currentStep === 'awaiting_otp'}
                                   />
                                   <TouchableOpacity 
                                      style={[styles.actionBtn, currentStep === 'sending_otp' && styles.actionBtnLoading]}
                                      onPress={() => handleVerifyOtp(provider.id)}
                                      disabled={currentStep === 'sending_otp'}
                                   >
                                      {currentStep === 'sending_otp' ? (
                                          <ActivityIndicator size="small" color="#555" />
                                      ) : (
                                          <Text style={styles.actionBtnText}>Verify</Text>
                                      )}
                                   </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    )}
                  </View>
                );
              })}
            </View>
          </ScrollView>
        )}
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'Search' && styles.navItemActive]}
          onPress={() => setActiveTab('Search')}
        >
          <Text style={[styles.navText, activeTab === 'Search' && styles.navTextActive]}>🔍 Search</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'Connections' && styles.navItemActive]}
          onPress={() => setActiveTab('Connections')}
        >
          <Text style={[styles.navText, activeTab === 'Connections' && styles.navTextActive]}>🔗 Connections</Text>
        </TouchableOpacity>
      </View>
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
  premiumCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  premiumCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  providerBrandBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FF5722',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  providerBrandText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  providerDesc: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  badgeConnected: {
    backgroundColor: '#e6ffe6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  badgeTextConnected: {
    color: '#008000',
    fontSize: 12,
    fontWeight: '600',
  },
  badgeNotConnected: {
    backgroundColor: '#f2f2f7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  badgeTextNotConnected: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
  },
  authContainer: {
    marginTop: 5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nativeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginRight: 10,
  },
  actionBtn: {
    backgroundColor: '#000',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 100,
  },
  actionBtnLoading: {
    backgroundColor: '#e0e0e0',
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  disconnectBtnFull: {
    backgroundColor: '#ff3b30',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  disconnectBtnTextFull: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingBottom: 20,
  },
  navItem: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
  },
  navItemActive: {
    borderTopWidth: 3,
    borderColor: '#007AFF',
  },
  navText: {
    color: '#888',
    fontWeight: '500',
  },
  navTextActive: {
    color: '#007AFF',
    fontWeight: 'bold',
  }
});
