import React, { useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';

import { CartItem } from './CartTypes';

interface PlatformBrowserModalProps {
  visible: boolean;
  providerName: string;
  providerIcon: string;
  providerCategory?: string;
  brandColor?: string;
  targetUrl: string;
  checkoutUrl?: string;
  restaurantUrl?: string;
  cartItems?: CartItem[];
  couponCode?: string;
  location?: { latitude: number; longitude: number; name: string } | null;
  onClose: () => void;
}

export const PlatformBrowserModal: React.FC<PlatformBrowserModalProps> = ({
  visible,
  providerName,
  providerIcon,
  providerCategory = 'Food',
  brandColor = '#ff5200',
  targetUrl,
  checkoutUrl = 'https://www.swiggy.com/checkout',
  restaurantUrl,
  cartItems,
  couponCode,
  location,
  onClose,
}) => {
  const webViewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState(targetUrl);
  const [canGoBack, setCanGoBack] = useState(false);
  const [copied, setCopied] = useState(Boolean(couponCode));

  const userLat = location?.latitude || 28.6139;
  const userLng = location?.longitude || 77.2090;

  const goToCheckout = () => {
    const finalCheckout = checkoutUrl || targetUrl;
    setCurrentUrl(finalCheckout);
    webViewRef.current?.injectJavaScript(`window.location.href = '${finalCheckout}'; true;`);
  };

  const goToSecondary = () => {
    if (restaurantUrl) {
      setCurrentUrl(restaurantUrl);
      webViewRef.current?.injectJavaScript(`window.location.href = '${restaurantUrl}'; true;`);
    }
  };

  // Determine dynamic tab titles based on category
  const isCommute = providerCategory === 'Commute';
  const isGroceries = providerCategory === 'Groceries';
  const isFood = providerCategory === 'Food';

  const checkoutTabTitle = isCommute ? '🚗 Book Ride' : (isGroceries ? '🛍️ Cart & Checkout' : '🛒 Checkout & Pay');
  const secondaryTabTitle = isCommute ? '📍 Route Details' : (isGroceries ? '📦 Store Catalog' : '🍽️ Restaurant Menu');
  const bottomActionText = isCommute 
    ? `🚗 CONFIRM RIDE ON ${providerName.toUpperCase()}`
    : `🛒 OPEN ${providerName.toUpperCase()} CHECKOUT & PAY →`;

  // Inject user's detected GPS coordinates into the checkout webview
  const beforeContentScript = `
    (function() {
      var lat = ${userLat};
      var lng = ${userLng};
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition = function(success, error, options) {
          if (success) {
            success({
              coords: {
                latitude: lat,
                longitude: lng,
                accuracy: 10,
                altitude: null,
                altitudeAccuracy: null,
                heading: null,
                speed: null
              },
              timestamp: Date.now()
            });
          }
        };
        navigator.geolocation.watchPosition = function(success, error, options) {
          if (navigator.geolocation.getCurrentPosition) {
            navigator.geolocation.getCurrentPosition(success, error, options);
          }
          return 1;
        };
      }
    })();
    true;
  `;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Browser Top Navigation Bar */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {canGoBack && (
              <TouchableOpacity
                style={styles.navBtn}
                onPress={() => webViewRef.current?.goBack()}
              >
                <Text style={styles.navBtnText}>‹ Back</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.headerIcon}>{providerIcon}</Text>
            <View>
              <Text style={styles.headerTitle}>Order on {providerName}</Text>
              <Text style={styles.headerSubtitle} numberOfLines={1}>
                {currentUrl.replace(/^https?:\/\/(www\.)?/, '')}
              </Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
              <Text style={styles.doneBtnText}>Done ✕</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Dynamic Category Mode Switcher */}
        <View style={styles.tabSwitcher}>
          <TouchableOpacity
            style={[styles.tabBtn, currentUrl.includes('/checkout') && styles.tabBtnActive]}
            onPress={goToCheckout}
          >
            <Text style={[styles.tabBtnText, currentUrl.includes('/checkout') && styles.tabBtnTextActive]}>
              {checkoutTabTitle}
            </Text>
          </TouchableOpacity>

          {Boolean(restaurantUrl) && (
            <TouchableOpacity
              style={[styles.tabBtn, !currentUrl.includes('/checkout') && styles.tabBtnActive]}
              onPress={goToSecondary}
            >
              <Text style={[styles.tabBtnText, !currentUrl.includes('/checkout') && styles.tabBtnTextActive]}>
                {secondaryTabTitle}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Top Floating Coupon Bar if coupon exists */}
        {Boolean(couponCode) && (
          <View style={styles.couponBanner}>
            <View style={styles.couponBannerLeft}>
              <Text style={styles.couponBannerIcon}>🏷️</Text>
              <View>
                <Text style={styles.couponBannerTitle}>
                  Best Coupon: <Text style={{ fontWeight: 'bold', color: '#16a34a' }}>{couponCode}</Text>
                </Text>
                <Text style={styles.couponBannerSub}>
                  {copied ? '✓ Copied to clipboard! Paste at checkout' : 'Tap copy to use coupon'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.couponCopyBtn}
              onPress={() => {
                setCopied(true);
              }}
            >
              <Text style={styles.couponCopyBtnText}>{copied ? 'COPIED ✓' : 'COPY CODE'}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Loading Bar */}
        {loading && (
          <View style={styles.loadingBar}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.loadingText}>Loading {providerName}...</Text>
          </View>
        )}

        {/* Real Platform Webview */}
        <WebView
          ref={webViewRef}
          source={{ uri: targetUrl }}
          userAgent="Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
          injectedJavaScriptBeforeContentLoaded={beforeContentScript}
          onNavigationStateChange={(navState: WebViewNavigation) => {
            setCurrentUrl(navState.url);
            setCanGoBack(navState.canGoBack);
          }}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          domStorageEnabled={true}
          javaScriptEnabled={true}
          thirdPartyCookiesEnabled={true}
          sharedCookiesEnabled={true}
          style={styles.webview}
        />

        {/* Floating Quick Action if not on checkout */}
        {!currentUrl.includes('/checkout') && (
          <TouchableOpacity
            style={[styles.floatingCheckoutBtn, { backgroundColor: brandColor }]}
            onPress={goToCheckout}
          >
            <Text style={styles.floatingCheckoutBtnText}>{bottomActionText}</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  navBtn: {
    marginRight: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
  },
  navBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  headerIcon: {
    fontSize: 22,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748b',
    maxWidth: 180,
  },
  doneBtn: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  doneBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  loadingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  loadingText: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 8,
    fontWeight: '500',
  },
  couponBanner: {
    backgroundColor: '#f0fdf4',
    borderBottomWidth: 1,
    borderBottomColor: '#bbf7d0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  couponBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  couponBannerIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  couponBannerTitle: {
    fontSize: 13,
    color: '#0f172a',
    fontWeight: '600',
  },
  couponBannerSub: {
    fontSize: 11,
    color: '#16a34a',
    marginTop: 1,
  },
  couponCopyBtn: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  couponCopyBtnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    padding: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  tabBtnActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  tabBtnTextActive: {
    color: '#0f172a',
    fontWeight: 'bold',
  },
  floatingCheckoutBtn: {
    backgroundColor: '#ff5200',
    paddingVertical: 14,
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#ff5200',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  floatingCheckoutBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
  webview: {
    flex: 1,
  },
});
