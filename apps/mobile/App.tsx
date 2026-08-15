import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Modal } from 'react-native';
import { WebView } from 'react-native-webview';
import { WebViewExtractor } from './src/lib/WebViewExtractor';

// Mock Providers list for Mobile
const PROVIDERS = [
  { id: 'food-a', name: 'Swiggy', url: 'https://www.swiggy.com' },
  { id: 'food-b', name: 'Zomato', url: 'https://www.zomato.com' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'Search' | 'Connections'>('Search');
  
  // Connections state
  const [connectedProviders, setConnectedProviders] = useState<string[]>([]);
  const [connectingProvider, setConnectingProvider] = useState<any>(null);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  // Toggle connection logic
  const toggleConnection = (id: string) => {
    if (connectedProviders.includes(id)) {
      setConnectedProviders(prev => prev.filter(p => p !== id));
    } else {
      const provider = PROVIDERS.find(p => p.id === id);
      setConnectingProvider(provider);
      setIsLoginModalVisible(true);
    }
  };

  const handleLoginSuccess = () => {
     if (connectingProvider) {
         setConnectedProviders(prev => [...prev, connectingProvider.id]);
     }
     setIsLoginModalVisible(false);
     setConnectingProvider(null);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setResults([]);
    
    // We clear previous results and wait for the WebViews to report back.
    // In a production app, we'd add a timeout to stop searching if they take too long.
    setTimeout(() => {
        setIsSearching(false);
    }, 15000); // 15 sec timeout
  };

  const handleDataExtracted = (data: any) => {
    if (data.type === 'SEARCH_RESULTS' && data.data && data.data.length > 0) {
       // We received extracted data from a WebView!
       setResults(prev => {
          // Group the new results with existing ones
          // For now, we just append. To use the engine's grouping, we can import it later.
          // Let's create a simple grouped structure for the UI
          const newOffers = data.data;
          const updated = [...prev];
          
          newOffers.forEach((offer: any) => {
             // Find an existing group or create a new one
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
          
          // Calculate savings
          updated.forEach(g => {
              const prices = g.offers.map((o: any) => o.price.finalPayablePrice);
              const max = Math.max(...prices);
              const min = Math.min(...prices);
              g.savings = max - min;
          });
          
          return updated;
       });
       
       // If all providers have responded, we can set isSearching(false)
       // (Simplified here: we just let the timeout handle it or stop when we get enough)
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
                {/* 
                  Here is where the WebViews are silently mounted.
                  They are fully invisible but are loading the sites and extracting.
                */}
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
                      {offer.accountBenefits.map((b: string, bi: number) => (
                         <Text key={bi} style={styles.benefit}>✨ {b}</Text>
                      ))}
                    </View>
                  ))}
                </View>
              ))}
            </ScrollView>
          </View>
        ) : (
          <View style={styles.tabContent}>
            <Text style={styles.title}>Connected Services</Text>
            <Text style={styles.subtitle}>Connect your accounts to fetch live, personalized data securely. Data never leaves your device.</Text>
            
            <View style={styles.providerList}>
              {PROVIDERS.map(provider => {
                const isConnected = connectedProviders.includes(provider.id);
                return (
                  <View key={provider.id} style={styles.providerCard}>
                    <Text style={styles.providerName}>{provider.name}</Text>
                    <TouchableOpacity 
                      style={[styles.connectBtn, isConnected && styles.disconnectBtn]}
                      onPress={() => toggleConnection(provider.id)}
                    >
                      <Text style={styles.connectBtnText}>{isConnected ? 'Disconnect' : 'Connect'}</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>
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

      <Modal visible={isLoginModalVisible} animationType="slide" onRequestClose={() => setIsLoginModalVisible(false)}>
         <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
            <View style={styles.modalHeader}>
               <Text style={styles.modalTitle}>Connect to {connectingProvider?.name}</Text>
               <TouchableOpacity onPress={() => setIsLoginModalVisible(false)} style={styles.modalCloseBtn}>
                  <Text style={styles.modalCloseText}>Cancel</Text>
               </TouchableOpacity>
            </View>
            <View style={{padding: 15, backgroundColor: '#fff9e6'}}>
                <Text style={{fontSize: 14, color: '#856404'}}>
                   Please login normally. We do NOT see or store your passwords. Your login stays securely on your device.
                </Text>
            </View>
            {connectingProvider && (
                <WebView 
                   source={{ uri: connectingProvider.url }} 
                   style={{flex: 1}}
                   javaScriptEnabled={true}
                   sharedCookiesEnabled={true}
                   thirdPartyCookiesEnabled={true}
                   setBuiltInZoomControls={true}
                   setDisplayZoomControls={false}
                   scalesPageToFit={true}
                   userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
                   injectedJavaScript={`
                      // Inject a viewport meta tag to force scaling if missing
                      let meta = document.createElement('meta');
                      meta.name = 'viewport';
                      meta.content = 'width=1024, initial-scale=' + (window.innerWidth / 1024);
                      document.head.appendChild(meta);

                      // Try to auto-click the login button to help the user
                      setTimeout(() => {
                         const loginElements = Array.from(document.querySelectorAll('a, span, div, button'));
                         const loginBtn = loginElements.find(el => {
                            const text = (el.innerText || '').trim().toLowerCase();
                            return text === 'login' || text === 'sign in' || text === 'log in';
                         });
                         if (loginBtn) {
                             loginBtn.click();
                         }
                      }, 2000);

                      // Detect when user is logged in
                      setInterval(() => {
                         // Very basic login detection
                         const html = document.body.innerText.toLowerCase();
                         if (html.includes('logout') || html.includes('sign out') || (window.location.href.includes('zomato') && html.includes('profile'))) {
                             window.ReactNativeWebView.postMessage('LOGIN_SUCCESS');
                         }
                      }, 2000);
                      true;
                   `}
                   onMessage={(event) => {
                      if (event.nativeEvent.data === 'LOGIN_SUCCESS') {
                          handleLoginSuccess();
                      }
                   }}
                />
            )}
            <TouchableOpacity style={styles.manualSuccessBtn} onPress={handleLoginSuccess}>
                <Text style={styles.manualSuccessText}>I have logged in successfully</Text>
            </TouchableOpacity>
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
  providerList: {
    flex: 1,
  },
  providerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
  },
  connectBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  disconnectBtn: {
    backgroundColor: '#ff3b30',
  },
  connectBtnText: {
    color: '#fff',
    fontWeight: 'bold',
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
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalCloseBtn: {
    padding: 5,
  },
  modalCloseText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  manualSuccessBtn: {
    backgroundColor: '#34c759',
    padding: 15,
    alignItems: 'center',
    margin: 10,
    borderRadius: 8,
  },
  manualSuccessText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  }
});
