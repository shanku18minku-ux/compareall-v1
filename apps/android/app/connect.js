import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, Switch, Alert, ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { PLATFORMS } from '../constants/platforms';
import { StorageService } from '../services/storage';

export default function ConnectScreen() {
  const router = useRouter();
  const [connectedPlatforms, setConnectedPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConnected();
  }, []);

  const loadConnected = async () => {
    const connected = await StorageService.getConnectedPlatforms();
    setConnectedPlatforms(connected);
    setLoading(false);
  };

  const handleConnect = async (platform) => {
    router.push({
      pathname: '/webview-login',
      params: { platformId: platform.id, platformName: platform.name, loginUrl: platform.loginUrl }
    });
  };

  const handleDisconnect = async (platformId) => {
    Alert.alert(
      'Disconnect Account',
      `Remove ${PLATFORMS.find(p => p.id === platformId)?.name} from CompareAll?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect', style: 'destructive',
          onPress: async () => {
            await StorageService.disconnectPlatform(platformId);
            await loadConnected();
          }
        }
      ]
    );
  };

  const categories = ['food', 'electronics', 'cab'];
  const categoryLabels = { food: '🍕 Food Delivery', electronics: '📱 Electronics', cab: '🚖 Cab Booking' };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Text style={styles.infoIcon}>🔐</Text>
          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>Your data stays private</Text>
            <Text style={styles.infoDesc}>
              We never store your passwords. You log in directly on each platform's official page.
            </Text>
          </View>
        </View>

        {/* Platform list by category */}
        {categories.map(cat => (
          <View key={cat} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{categoryLabels[cat]}</Text>
            {PLATFORMS.filter(p => p.category === cat).map(platform => {
              const isConnected = connectedPlatforms.includes(platform.id);
              return (
                <View key={platform.id} style={styles.platformRow}>
                  <View style={[styles.platformIcon, { backgroundColor: platform.color + '20' }]}>
                    <Text style={styles.platformEmoji}>{platform.icon}</Text>
                  </View>
                  <View style={styles.platformInfo}>
                    <Text style={styles.platformName}>{platform.name}</Text>
                    <Text style={[styles.platformStatus, { color: isConnected ? '#22C55E' : '#6B7280' }]}>
                      {isConnected ? '✓ Connected - Live prices enabled' : 'Not connected - Demo data only'}
                    </Text>
                  </View>
                  {isConnected ? (
                    <TouchableOpacity
                      style={styles.disconnectBtn}
                      onPress={() => handleDisconnect(platform.id)}
                    >
                      <Text style={styles.disconnectText}>Remove</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={[styles.connectBtn, { backgroundColor: platform.color }]}
                      onPress={() => handleConnect(platform)}
                    >
                      <Text style={styles.connectText}>Connect</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        ))}

        {/* Disconnect all */}
        {connectedPlatforms.length > 0 && (
          <TouchableOpacity
            style={styles.clearAllBtn}
            onPress={() => Alert.alert('Clear All', 'Disconnect all accounts?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Clear All', style: 'destructive', onPress: async () => {
                await StorageService.clearAll();
                setConnectedPlatforms([]);
              }}
            ])}
          >
            <Text style={styles.clearAllText}>Disconnect All Accounts</Text>
          </TouchableOpacity>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  loadingContainer: { flex: 1, backgroundColor: '#0A0A0A', alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: 20, paddingBottom: 40 },

  infoBanner: {
    flexDirection: 'row', gap: 12, alignItems: 'flex-start',
    backgroundColor: '#0F2A1A', borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: '#1A4A2A', marginBottom: 28
  },
  infoIcon: { fontSize: 24 },
  infoText: { flex: 1 },
  infoTitle: { color: '#22C55E', fontWeight: '700', fontSize: 15, marginBottom: 4 },
  infoDesc: { color: '#6B7280', fontSize: 13, lineHeight: 18 },

  categorySection: { marginBottom: 28 },
  categoryTitle: { color: '#9CA3AF', fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 },

  platformRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#1A1A1A', borderRadius: 16, padding: 16,
    marginBottom: 10, borderWidth: 1, borderColor: '#2A2A2A'
  },
  platformIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  platformEmoji: { fontSize: 24 },
  platformInfo: { flex: 1 },
  platformName: { color: '#FFFFFF', fontWeight: '700', fontSize: 16, marginBottom: 3 },
  platformStatus: { fontSize: 12, fontWeight: '500' },

  connectBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  connectText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  disconnectBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, backgroundColor: '#2A1A1A', borderWidth: 1, borderColor: '#4A2A2A' },
  disconnectText: { color: '#EF4444', fontWeight: '600', fontSize: 13 },

  clearAllBtn: { marginTop: 8, alignItems: 'center', padding: 16 },
  clearAllText: { color: '#EF4444', fontSize: 14, fontWeight: '600' },
});
