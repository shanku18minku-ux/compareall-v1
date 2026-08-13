import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { PLATFORMS } from '../constants/platforms';
import { StorageService } from '../services/storage';

export default function WebViewLoginScreen() {
  const { platformId, platformName, loginUrl } = useLocalSearchParams();
  const router = useRouter();
  const webviewRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(loginUrl);

  const platform = PLATFORMS.find(p => p.id === platformId);

  const checkLoginStatus = async () => {
    if (!platform || !webviewRef.current) return;
    
    webviewRef.current.injectJavaScript(`
      (async function() {
        try {
          const result = ${platform.checkLoggedIn};
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'LOGIN_CHECK', isLoggedIn: result }));
        } catch(e) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'LOGIN_CHECK', isLoggedIn: false }));
        }
      })();
      true;
    `);
  };

  const handleMessage = async (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.type === 'LOGIN_CHECK' && data.isLoggedIn && !isConnected) {
        setIsConnected(true);
        await StorageService.connectPlatform(platformId);
        Alert.alert(
          '✅ Connected!',
          `Your ${platformName} account is now connected to CompareAll. You'll get real prices when comparing!`,
          [{ text: 'Great!', onPress: () => router.back() }]
        );
      }
    } catch(e) {}
  };

  const handleNavigationChange = (navState) => {
    setCurrentUrl(navState.url);
    // Check login status on every navigation
    setTimeout(checkLoginStatus, 2000);
  };

  return (
    <View style={styles.container}>
      {/* Status Bar */}
      <View style={styles.statusBar}>
        <View style={[styles.platformBadge, { backgroundColor: platform?.color + '30' }]}>
          <Text style={styles.platformEmoji}>{platform?.icon}</Text>
          <Text style={[styles.platformName, { color: platform?.color }]}>{platformName}</Text>
        </View>
        <View style={styles.statusInfo}>
          {isConnected ? (
            <View style={styles.connectedBadge}>
              <Text style={styles.connectedText}>✓ Connected</Text>
            </View>
          ) : (
            <Text style={styles.statusText}>Log in to connect</Text>
          )}
        </View>
      </View>

      {/* Info banner */}
      {!isConnected && (
        <View style={styles.infoBanner}>
          <Text style={styles.infoText}>
            🔐 Log in with your {platformName} account below. We never see your password.
          </Text>
        </View>
      )}

      {/* WebView */}
      <WebView
        ref={webviewRef}
        source={{ uri: loginUrl }}
        style={styles.webview}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => {
          setIsLoading(false);
          setTimeout(checkLoginStatus, 1500);
        }}
        onNavigationStateChange={handleNavigationChange}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        userAgent="Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
      />

      {/* Loading overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={platform?.color || '#3B82F6'} />
          <Text style={styles.loadingText}>Loading {platformName}...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },

  statusBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 14, backgroundColor: '#1A1A1A',
    borderBottomWidth: 1, borderBottomColor: '#2A2A2A'
  },
  platformBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10
  },
  platformEmoji: { fontSize: 16 },
  platformName: { fontWeight: '700', fontSize: 15 },
  statusInfo: { alignItems: 'flex-end' },
  statusText: { color: '#6B7280', fontSize: 13 },
  connectedBadge: { backgroundColor: '#0F2A1A', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  connectedText: { color: '#22C55E', fontWeight: '700', fontSize: 13 },

  infoBanner: {
    backgroundColor: '#1A1A2E', padding: 10,
    borderBottomWidth: 1, borderBottomColor: '#2A2A3E'
  },
  infoText: { color: '#9CA3AF', fontSize: 12, textAlign: 'center' },

  webview: { flex: 1 },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,10,10,0.9)',
    alignItems: 'center', justifyContent: 'center', gap: 16
  },
  loadingText: { color: '#9CA3AF', fontSize: 15 },
});
