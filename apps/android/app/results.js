import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, ActivityIndicator, Linking, Modal, Animated, Dimensions
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { PLATFORMS } from '../constants/platforms';
import { StorageService } from '../services/storage';
import { ApiService } from '../services/api';

const { width } = Dimensions.get('window');

export default function ResultsScreen() {
  const { query, category, connectedPlatforms: connectedStr } = useLocalSearchParams();
  const router = useRouter();

  const connectedPlatforms = JSON.parse(connectedStr || '[]');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(true);
  const [searchStatus, setSearchStatus] = useState('Starting search...');
  const [compareItems, setCompareItems] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [sortBy, setSortBy] = useState('price_asc');

  // WebViews for each connected platform
  const webviewRefs = useRef({});
  const [webviewQueue, setWebviewQueue] = useState([]);
  const [currentWebview, setCurrentWebview] = useState(null);
  const allResults = useRef([]);
  const progressAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    startSearch();
  }, []);

  const startSearch = async () => {
    setIsSearching(true);
    allResults.current = [];

    // Get platforms to search based on category and connected accounts
    let platformsToSearch = PLATFORMS;
    if (category && category !== 'all') {
      platformsToSearch = PLATFORMS.filter(p => p.category === category);
    }
    
    // Only use connected platforms (or all if none connected - demo mode)
    const activePlatforms = connectedPlatforms.length > 0
      ? platformsToSearch.filter(p => connectedPlatforms.includes(p.id))
      : platformsToSearch.slice(0, 2); // demo: first 2

    if (activePlatforms.length === 0) {
      // No connected platforms - show message
      setSearchStatus('No connected accounts. Connect accounts for live data.');
      setIsSearching(false);
      return;
    }

    setWebviewQueue(activePlatforms);
    setCurrentWebview(activePlatforms[0]);
    setSearchStatus(`Searching ${activePlatforms[0].name}...`);

    // Animate progress
    Animated.timing(progressAnim, {
      toValue: 1 / activePlatforms.length,
      duration: 500, useNativeDriver: false
    }).start();
  };

  const handleWebViewMessage = async (platformId, event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'RESULTS') {
        allResults.current = [...allResults.current, ...(data.results || [])];
        
        // Move to next platform
        const currentIdx = webviewQueue.findIndex(p => p.id === platformId);
        const next = webviewQueue[currentIdx + 1];
        
        const progress = (currentIdx + 1) / webviewQueue.length;
        Animated.timing(progressAnim, {
          toValue: progress, duration: 400, useNativeDriver: false
        }).start();

        if (next) {
          setCurrentWebview(next);
          setSearchStatus(`Searching ${next.name}...`);
        } else {
          // All done!
          finishSearch();
        }
      }
    } catch(e) {}
  };

  const finishSearch = async () => {
    setSearchStatus('Comparing prices...');
    const grouped = await ApiService.compareResults(query, allResults.current);
    
    Animated.timing(progressAnim, { toValue: 1, duration: 300, useNativeDriver: false }).start();
    
    setResults(grouped);
    setIsSearching(false);
    setCurrentWebview(null);
  };

  const handleWebViewLoad = (platform) => {
    // After page loads, wait 3s then inject extraction script
    setTimeout(() => {
      const ref = webviewRefs.current[platform.id];
      if (ref) {
        ref.injectJavaScript(`
          (async function() {
            try {
              await new Promise(r => setTimeout(r, 2000));
              const rawResult = ${platform.extractData};
              const results = typeof rawResult === 'string' ? JSON.parse(rawResult) : rawResult;
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'RESULTS', results: results || [] }));
            } catch(e) {
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'RESULTS', results: [] }));
            }
          })();
          true;
        `);
      }
    }, 3000);
  };

  const toggleCompare = (offer) => {
    if (compareItems.find(o => o.id === offer.id)) {
      setCompareItems(compareItems.filter(o => o.id !== offer.id));
    } else {
      if (compareItems.length >= 3) {
        return;
      }
      setCompareItems([...compareItems, offer]);
    }
  };

  const sortedResults = results.map(group => ({
    ...group,
    offers: [...group.offers].sort((a, b) => {
      if (sortBy === 'price_asc') return a.price.finalPayablePrice - b.price.finalPayablePrice;
      if (sortBy === 'price_desc') return b.price.finalPayablePrice - a.price.finalPayablePrice;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
    })
  }));

  return (
    <SafeAreaView style={styles.container}>
      {/* Hidden WebViews for scraping */}
      {currentWebview && (
        <View style={styles.hiddenWebViews}>
          <WebView
            ref={ref => webviewRefs.current[currentWebview.id] = ref}
            source={{ uri: currentWebview.searchUrl(query) }}
            style={{ width: 1, height: 1 }}
            onLoadEnd={() => handleWebViewLoad(currentWebview)}
            onMessage={(e) => handleWebViewMessage(currentWebview.id, e)}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            sharedCookiesEnabled={true}
            thirdPartyCookiesEnabled={true}
            userAgent="Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36"
          />
        </View>
      )}

      {/* Loading State */}
      {isSearching && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingQuery}>"{query}"</Text>
          <Text style={styles.loadingStatus}>{searchStatus}</Text>
          
          {/* Progress bar */}
          <View style={styles.progressBar}>
            <Animated.View style={[styles.progressFill, {
              width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] })
            }]} />
          </View>

          {/* Platform progress */}
          <View style={styles.platformProgress}>
            {webviewQueue.map((p, idx) => {
              const currentIdx = webviewQueue.findIndex(wp => wp.id === currentWebview?.id);
              const isDone = idx < currentIdx;
              const isCurrent = idx === currentIdx;
              return (
                <View key={p.id} style={styles.platformProgressItem}>
                  <Text style={[styles.platformProgressEmoji, isDone && styles.done, isCurrent && styles.current]}>
                    {isDone ? '✓' : p.icon}
                  </Text>
                  <Text style={[styles.platformProgressName, isDone && styles.done, isCurrent && styles.current]}>
                    {p.name}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Results */}
      {!isSearching && (
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Header */}
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>Results for "{query}"</Text>
            <Text style={styles.resultsCount}>
              {results.reduce((acc, g) => acc + g.offers.length, 0)} offers found
            </Text>
          </View>

          {/* Sort buttons */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortRow}>
            {[
              { id: 'price_asc', label: '💰 Lowest Price' },
              { id: 'price_desc', label: '💎 Highest Price' },
              { id: 'rating', label: '⭐ Best Rating' },
            ].map(s => (
              <TouchableOpacity
                key={s.id}
                style={[styles.sortChip, sortBy === s.id && styles.sortChipActive]}
                onPress={() => setSortBy(s.id)}
              >
                <Text style={[styles.sortChipText, sortBy === s.id && styles.sortChipTextActive]}>
                  {s.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* No results */}
          {results.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyTitle}>No results found</Text>
              <Text style={styles.emptyDesc}>
                {connectedPlatforms.length === 0
                  ? 'Connect your accounts to get live prices!'
                  : 'Try a different search term'}
              </Text>
              {connectedPlatforms.length === 0 && (
                <TouchableOpacity style={styles.connectBtn} onPress={() => router.push('/connect')}>
                  <Text style={styles.connectBtnText}>Connect Accounts →</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Grouped Results */}
          {sortedResults.map((group, gIdx) => (
            <View key={gIdx} style={styles.groupCard}>
              {/* Group header */}
              <View style={styles.groupHeader}>
                <Text style={styles.groupTitle}>{group.title}</Text>
                <View style={styles.groupStats}>
                  {group.lowestPrice > 0 && (
                    <View style={styles.stat}>
                      <Text style={styles.statLabel}>Best Price</Text>
                      <Text style={styles.statValue}>₹{group.lowestPrice}</Text>
                    </View>
                  )}
                  {group.savings > 0 && (
                    <View style={[styles.stat, styles.savingsStat]}>
                      <Text style={styles.statLabel}>You Save</Text>
                      <Text style={[styles.statValue, styles.savingsValue]}>₹{group.savings}</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Offers */}
              {group.offers.map((offer, oIdx) => {
                const isBest = oIdx === 0 && sortBy === 'price_asc';
                const isExpanded = expandedId === offer.id;
                const inCompare = compareItems.some(o => o.id === offer.id);
                const platform = PLATFORMS.find(p => p.id === offer.providerId);

                return (
                  <TouchableOpacity
                    key={offer.id}
                    style={[styles.offerCard, isBest && styles.bestOfferCard]}
                    onPress={() => setExpandedId(isExpanded ? null : offer.id)}
                    activeOpacity={0.8}
                  >
                    {isBest && <View style={styles.bestBadge}><Text style={styles.bestBadgeText}>BEST DEAL</Text></View>}

                    <View style={styles.offerRow}>
                      {/* Platform badge */}
                      <View style={[styles.offerPlatform, { backgroundColor: (platform?.color || '#3B82F6') + '20' }]}>
                        <Text style={styles.offerPlatformEmoji}>{platform?.icon || '🛍️'}</Text>
                      </View>

                      {/* Info */}
                      <View style={styles.offerInfo}>
                        <Text style={styles.offerPlatformName}>{offer.providerName}</Text>
                        <Text style={styles.offerTitle} numberOfLines={2}>{offer.title}</Text>
                        {offer.rating && <Text style={styles.offerRating}>⭐ {offer.rating}</Text>}
                        {offer.estimatedTimeMins && <Text style={styles.offerEta}>🕐 {offer.estimatedTimeMins} min</Text>}
                      </View>

                      {/* Price */}
                      <View style={styles.offerPriceCol}>
                        {offer.originalPrice > offer.price.finalPayablePrice && (
                          <Text style={styles.offerOriginalPrice}>₹{offer.originalPrice}</Text>
                        )}
                        <Text style={[styles.offerPrice, { color: platform?.color || '#3B82F6' }]}>
                          ₹{offer.price.finalPayablePrice}
                        </Text>
                      </View>
                    </View>

                    {/* Expanded actions */}
                    {isExpanded && (
                      <View style={styles.expandedActions}>
                        <TouchableOpacity
                          style={[styles.bookBtn, { backgroundColor: platform?.color || '#3B82F6' }]}
                          onPress={() => Linking.openURL(offer.deepLinkUrl)}
                        >
                          <Text style={styles.bookBtnText}>Open in App →</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.compareToggleBtn, inCompare && styles.compareToggleBtnActive]}
                          onPress={() => toggleCompare(offer)}
                        >
                          <Text style={[styles.compareToggleText, inCompare && styles.compareToggleTextActive]}>
                            {inCompare ? '✓ Added' : '+ Compare'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </ScrollView>
      )}

      {/* Compare Tray */}
      {compareItems.length > 0 && !isSearching && (
        <View style={styles.compareTray}>
          <Text style={styles.compareTrayText}>{compareItems.length} items selected</Text>
          <TouchableOpacity style={styles.compareTrayBtn} onPress={() => setShowCompare(true)}>
            <Text style={styles.compareTrayBtnText}>Compare Side-by-Side</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Compare Modal */}
      <Modal visible={showCompare} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Side-by-Side Comparison</Text>
            <TouchableOpacity onPress={() => setShowCompare(false)}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal contentContainerStyle={styles.compareGrid}>
            {compareItems.map(offer => {
              const platform = PLATFORMS.find(p => p.id === offer.providerId);
              return (
                <View key={offer.id} style={[styles.compareCard, { borderColor: platform?.color || '#3B82F6' }]}>
                  <Text style={styles.comparePlatform}>{platform?.icon} {offer.providerName}</Text>
                  <Text style={styles.compareItemTitle} numberOfLines={3}>{offer.title}</Text>
                  <Text style={[styles.comparePrice, { color: platform?.color || '#3B82F6' }]}>
                    ₹{offer.price.finalPayablePrice}
                  </Text>
                  {offer.rating && <Text style={styles.compareRating}>⭐ {offer.rating}</Text>}
                  {offer.estimatedTimeMins && <Text style={styles.compareEta}>🕐 {offer.estimatedTimeMins} min</Text>}
                  <TouchableOpacity
                    style={[styles.compareBookBtn, { backgroundColor: platform?.color || '#3B82F6' }]}
                    onPress={() => Linking.openURL(offer.deepLinkUrl)}
                  >
                    <Text style={styles.compareBookText}>Order Now</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  hiddenWebViews: { position: 'absolute', top: -100, left: -100, width: 1, height: 1, opacity: 0 },

  // Loading
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, gap: 16 },
  loadingQuery: { color: '#FFFFFF', fontSize: 20, fontWeight: '700', textAlign: 'center' },
  loadingStatus: { color: '#6B7280', fontSize: 15 },
  progressBar: { width: '100%', height: 4, backgroundColor: '#1A1A1A', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#3B82F6', borderRadius: 2 },
  platformProgress: { flexDirection: 'row', gap: 16, flexWrap: 'wrap', justifyContent: 'center' },
  platformProgressItem: { alignItems: 'center', gap: 4 },
  platformProgressEmoji: { fontSize: 20, color: '#6B7280' },
  platformProgressName: { color: '#6B7280', fontSize: 11 },
  done: { color: '#22C55E' },
  current: { color: '#3B82F6' },

  // Results
  scroll: { padding: 16, paddingBottom: 100 },
  resultsHeader: { marginBottom: 16 },
  resultsTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  resultsCount: { color: '#6B7280', fontSize: 13, marginTop: 2 },

  sortRow: { marginBottom: 20 },
  sortChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#1A1A1A', marginRight: 8, borderWidth: 1, borderColor: '#2A2A2A'
  },
  sortChipActive: { backgroundColor: '#1E3A5F', borderColor: '#3B82F6' },
  sortChipText: { color: '#9CA3AF', fontSize: 13, fontWeight: '600' },
  sortChipTextActive: { color: '#3B82F6' },

  // Empty state
  emptyState: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  emptyDesc: { color: '#6B7280', fontSize: 14, textAlign: 'center' },
  connectBtn: { backgroundColor: '#3B82F6', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, marginTop: 8 },
  connectBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },

  // Group
  groupCard: { backgroundColor: '#111111', borderRadius: 20, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#1E1E1E' },
  groupHeader: { marginBottom: 14 },
  groupTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '700', marginBottom: 10 },
  groupStats: { flexDirection: 'row', gap: 10 },
  stat: { backgroundColor: '#1A1A1A', borderRadius: 10, padding: 10, flex: 1 },
  savingsStat: { backgroundColor: '#0F2A1A' },
  statLabel: { color: '#6B7280', fontSize: 11, fontWeight: '600', textTransform: 'uppercase' },
  statValue: { color: '#FFFFFF', fontSize: 18, fontWeight: '800', marginTop: 2 },
  savingsValue: { color: '#22C55E' },

  // Offer Card
  offerCard: {
    backgroundColor: '#1A1A1A', borderRadius: 16, padding: 14,
    marginBottom: 10, borderWidth: 1, borderColor: '#2A2A2A'
  },
  bestOfferCard: { borderColor: '#3B82F6', backgroundColor: '#0D1B2E' },
  bestBadge: {
    backgroundColor: '#3B82F6', alignSelf: 'flex-start',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginBottom: 10
  },
  bestBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  offerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  offerPlatform: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  offerPlatformEmoji: { fontSize: 22 },
  offerInfo: { flex: 1 },
  offerPlatformName: { color: '#9CA3AF', fontSize: 12, fontWeight: '600', marginBottom: 2 },
  offerTitle: { color: '#E5E7EB', fontSize: 14, fontWeight: '600', lineHeight: 20 },
  offerRating: { color: '#FBBF24', fontSize: 12, marginTop: 4 },
  offerEta: { color: '#9CA3AF', fontSize: 12, marginTop: 2 },
  offerPriceCol: { alignItems: 'flex-end' },
  offerOriginalPrice: { color: '#6B7280', fontSize: 12, textDecorationLine: 'line-through' },
  offerPrice: { fontSize: 20, fontWeight: '800' },
  expandedActions: { flexDirection: 'row', gap: 10, marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#2A2A2A' },
  bookBtn: { flex: 2, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  bookBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  compareToggleBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center', backgroundColor: '#1E1E1E', borderWidth: 1, borderColor: '#3A3A3A' },
  compareToggleBtnActive: { backgroundColor: '#0F2A1A', borderColor: '#22C55E' },
  compareToggleText: { color: '#9CA3AF', fontWeight: '600', fontSize: 13 },
  compareToggleTextActive: { color: '#22C55E' },

  // Compare Tray
  compareTray: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#1A1A2E', padding: 16, paddingBottom: 24,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderTopWidth: 1, borderTopColor: '#2A2A3E'
  },
  compareTrayText: { color: '#9CA3AF', fontSize: 14, flex: 1 },
  compareTrayBtn: { backgroundColor: '#3B82F6', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 12 },
  compareTrayBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },

  // Modal
  modalContainer: { flex: 1, backgroundColor: '#0A0A0A' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  modalTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  modalClose: { color: '#6B7280', fontSize: 22 },
  compareGrid: { padding: 20, gap: 14 },
  compareCard: {
    width: 200, backgroundColor: '#1A1A1A', borderRadius: 20,
    padding: 18, borderWidth: 2, gap: 10
  },
  comparePlatform: { color: '#9CA3AF', fontSize: 14, fontWeight: '700' },
  compareItemTitle: { color: '#FFFFFF', fontSize: 14, lineHeight: 20 },
  comparePrice: { fontSize: 26, fontWeight: '800' },
  compareRating: { color: '#FBBF24', fontSize: 13 },
  compareEta: { color: '#9CA3AF', fontSize: 13 },
  compareBookBtn: { paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginTop: 6 },
  compareBookText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
});
