'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, SafeAreaView, StatusBar, FlatList, ActivityIndicator,
  Dimensions, Animated
} from 'react-native';
import { useRouter } from 'expo-router';
import { StorageService } from '../services/storage';
import { PLATFORMS, CATEGORIES } from '../constants/platforms';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [connectedPlatforms, setConnectedPlatforms] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    loadData();
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
  }, []);

  const loadData = async () => {
    const [connected, history] = await Promise.all([
      StorageService.getConnectedPlatforms(),
      StorageService.getSearchHistory()
    ]);
    setConnectedPlatforms(connected);
    setSearchHistory(history);
  };

  const handleSearch = useCallback(async (query) => {
    const q = (query || searchQuery).trim();
    if (!q) return;
    await StorageService.addSearchHistory(q);
    router.push({
      pathname: '/results',
      params: { query: q, category: selectedCategory, connectedPlatforms: JSON.stringify(connectedPlatforms) }
    });
  }, [searchQuery, selectedCategory, connectedPlatforms]);

  const connectedCount = connectedPlatforms.length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <View style={styles.logoRow}>
            <Text style={styles.logoEmoji}>⚡</Text>
            <View>
              <Text style={styles.logoText}>CompareAll</Text>
              <Text style={styles.logoTagline}>Search once. Compare everywhere.</Text>
            </View>
          </View>

          {/* Connect Status */}
          <TouchableOpacity style={styles.connectBadge} onPress={() => { router.push('/connect'); loadData(); }}>
            <View style={[styles.connectDot, { backgroundColor: connectedCount > 0 ? '#22C55E' : '#6B7280' }]} />
            <Text style={styles.connectText}>
              {connectedCount > 0 ? `${connectedCount} accounts connected` : 'Connect accounts for live data'}
            </Text>
            <Text style={styles.connectArrow}>›</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Search Box */}
        <Animated.View style={[styles.searchContainer, { opacity: fadeAnim }]}>
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Biryani, iPhone 15, Cab to airport..."
              placeholderTextColor="#6B7280"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => handleSearch()}
              returnKeyType="search"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={styles.clearBtn}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={[styles.searchButton, !searchQuery.trim() && styles.searchButtonDisabled]}
            onPress={() => handleSearch()}
            disabled={!searchQuery.trim()}
          >
            <Text style={styles.searchButtonText}>Compare</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesRow}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryChip, selectedCategory === cat.id && styles.categoryChipActive]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Text style={styles.categoryIcon}>{cat.icon}</Text>
              <Text style={[styles.categoryLabel, selectedCategory === cat.id && styles.categoryLabelActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Connected Platforms */}
        {connectedCount > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Connected Platforms</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {PLATFORMS.filter(p => connectedPlatforms.includes(p.id)).map(p => (
                <View key={p.id} style={[styles.platformChip, { borderColor: p.color }]}>
                  <Text style={styles.platformChipIcon}>{p.icon}</Text>
                  <Text style={[styles.platformChipName, { color: p.color }]}>{p.name}</Text>
                  <Text style={styles.platformChipStatus}>✓</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Quick Searches */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Compare</Text>
          <View style={styles.quickGrid}>
            {[
              { q: 'Chicken Biryani', icon: '🍗', cat: 'food' },
              { q: 'iPhone 15', icon: '📱', cat: 'electronics' },
              { q: 'Paneer Butter Masala', icon: '🍛', cat: 'food' },
              { q: 'Samsung Galaxy S24', icon: '📲', cat: 'electronics' },
              { q: 'Margherita Pizza', icon: '🍕', cat: 'food' },
              { q: 'OnePlus 12', icon: '⚡', cat: 'electronics' },
            ].map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.quickCard}
                onPress={() => { setSelectedCategory(item.cat); handleSearch(item.q); }}
              >
                <Text style={styles.quickCardIcon}>{item.icon}</Text>
                <Text style={styles.quickCardText}>{item.q}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Search History */}
        {searchHistory.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            {searchHistory.slice(0, 5).map((h, idx) => (
              <TouchableOpacity key={idx} style={styles.historyItem} onPress={() => handleSearch(h)}>
                <Text style={styles.historyIcon}>🕐</Text>
                <Text style={styles.historyText}>{h}</Text>
                <Text style={styles.historyArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  scroll: { padding: 20, paddingBottom: 40 },

  // Header
  header: { marginBottom: 28, marginTop: 8 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  logoEmoji: { fontSize: 36 },
  logoText: { fontSize: 28, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.5 },
  logoTagline: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  connectBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#1A1A1A', borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: '#2A2A2A'
  },
  connectDot: { width: 8, height: 8, borderRadius: 4 },
  connectText: { flex: 1, color: '#9CA3AF', fontSize: 13 },
  connectArrow: { color: '#6B7280', fontSize: 18 },

  // Search
  searchContainer: { marginBottom: 20 },
  searchBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1A1A1A', borderRadius: 16,
    borderWidth: 1, borderColor: '#2A2A2A',
    paddingHorizontal: 16, marginBottom: 10, height: 56
  },
  searchIcon: { fontSize: 18, marginRight: 10 },
  searchInput: { flex: 1, color: '#FFFFFF', fontSize: 16 },
  clearBtn: { color: '#6B7280', fontSize: 16, padding: 4 },
  searchButton: {
    backgroundColor: '#3B82F6', borderRadius: 16,
    paddingVertical: 16, alignItems: 'center'
  },
  searchButtonDisabled: { backgroundColor: '#1E3A5F', opacity: 0.6 },
  searchButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },

  // Categories
  categoriesRow: { marginBottom: 24 },
  categoryChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#1A1A1A', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8,
    marginRight: 8, borderWidth: 1, borderColor: '#2A2A2A'
  },
  categoryChipActive: { backgroundColor: '#1E3A5F', borderColor: '#3B82F6' },
  categoryIcon: { fontSize: 14 },
  categoryLabel: { color: '#9CA3AF', fontSize: 13, fontWeight: '600' },
  categoryLabelActive: { color: '#3B82F6' },

  // Platforms connected
  platformChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#1A1A1A', borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 8,
    marginRight: 8, borderWidth: 1
  },
  platformChipIcon: { fontSize: 16 },
  platformChipName: { fontSize: 13, fontWeight: '700' },
  platformChipStatus: { fontSize: 12, color: '#22C55E' },

  // Section
  section: { marginBottom: 28 },
  sectionTitle: { color: '#9CA3AF', fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 },

  // Quick Grid
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  quickCard: {
    backgroundColor: '#1A1A1A', borderRadius: 14,
    padding: 14, width: (width - 50) / 2,
    borderWidth: 1, borderColor: '#2A2A2A',
    flexDirection: 'row', alignItems: 'center', gap: 10
  },
  quickCardIcon: { fontSize: 22 },
  quickCardText: { color: '#E5E7EB', fontSize: 13, fontWeight: '500', flex: 1 },

  // History
  historyItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1A1A1A'
  },
  historyIcon: { fontSize: 16 },
  historyText: { flex: 1, color: '#D1D5DB', fontSize: 15 },
  historyArrow: { color: '#4B5563', fontSize: 18 },
});
