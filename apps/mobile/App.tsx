import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { WebViewExtractor } from './src/lib/WebViewExtractor';

// Mock Providers list for Mobile
const PROVIDERS = [
  { id: 'food-a', name: 'Swiggy Clone', url: 'https://swiggy-mock.com' },
  { id: 'food-b', name: 'Zomato Clone', url: 'https://zomato-mock.com' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'Search' | 'Connections'>('Search');
  
  // Connections state
  const [connectedProviders, setConnectedProviders] = useState<string[]>([]);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  // Toggle connection logic
  const toggleConnection = (id: string) => {
    if (connectedProviders.includes(id)) {
      setConnectedProviders(prev => prev.filter(p => p !== id));
    } else {
      setConnectedProviders(prev => [...prev, id]);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setResults([]);
    
    // Simulate engine processing delay
    setTimeout(() => {
      // In a real app, this is where we'd invoke the shared @compareall/engine
      // and wait for WebViewExtractor to fire the 'onDataExtracted' events.
      
      const mockResults = [
        {
          title: `Chicken Biryani (Behrouz Biryani)`,
          lowestPrice: 227,
          savings: 46,
          offers: [
            {
              providerName: 'Swiggy Clone',
              price: { finalPayablePrice: 227, basePrice: 250, discount: 50 },
              accountBenefits: connectedProviders.includes('food-a') ? ['[DEMO] Mock Swiggy One Benefit: Free Delivery'] : []
            },
            {
              providerName: 'Zomato Clone',
              price: { finalPayablePrice: connectedProviders.includes('food-b') ? 253 : 290, basePrice: 240, discount: connectedProviders.includes('food-b') ? 60 : 0 },
              accountBenefits: connectedProviders.includes('food-b') ? ['[DEMO] Mock Zomato Gold Benefit: ₹60 Off'] : []
            }
          ]
        }
      ];
      
      setResults(mockResults);
      setIsSearching(false);
      
      // Auto-disconnect logic (Privacy Feature)
      setConnectedProviders([]);
    }, 2000);
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
                   return (
                     <WebViewExtractor 
                        key={id} 
                        url={provider.url}
                        isActive={true}
                        onDataExtracted={(data) => console.log('Extracted:', data)}
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
  }
});
