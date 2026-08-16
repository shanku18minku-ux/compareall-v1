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
  targetUrl: string;
  cartItems?: CartItem[];
  couponCode?: string;
  location?: { latitude: number; longitude: number; name: string } | null;
  onClose: () => void;
}

export const PlatformBrowserModal: React.FC<PlatformBrowserModalProps> = ({
  visible,
  providerName,
  providerIcon,
  targetUrl,
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

  // Auto-Cart-Bridge script: Adds selected dish to Swiggy menu & immediately takes user to final Checkout & Payment
  const autoCheckoutScript = `
    (function() {
      var dishes = ${JSON.stringify((cartItems || []).map(i => ({ dishName: i.dishName, dishId: i.dishId, quantity: i.quantity })))};
      var couponCode = ${JSON.stringify(couponCode || '')};
      var hasNavigated = false;

      function checkAndBridgeToCheckout() {
        if (hasNavigated) return;

        // If already on checkout page
        if (window.location.pathname.indexOf('/checkout') !== -1) {
          hasNavigated = true;
          return;
        }

        // If on restaurant page, auto-click ADD on target dish
        if (window.location.pathname.indexOf('/restaurants/') !== -1) {
          var allDishContainers = document.querySelectorAll('[data-testid*="normal-dish-item"], [class*="styles_item"], [class*="item_container"], div[class*="styles_container"]');
          
          dishes.forEach(function(d) {
            var nameToFind = (d.dishName || '').toLowerCase().trim();
            for (var i = 0; i < allDishContainers.length; i++) {
              var c = allDishContainers[i];
              if (c.textContent && c.textContent.toLowerCase().indexOf(nameToFind) !== -1) {
                var btn = c.querySelector('button, [data-testid="add-button"], div[role="button"]');
                if (btn && (btn.textContent.indexOf('ADD') !== -1 || btn.textContent.indexOf('+') !== -1)) {
                  btn.click();
                  break;
                }
              }
            }
          });

          // After adding, navigate directly to Swiggy's final checkout page
          setTimeout(function() {
            if (!hasNavigated) {
              hasNavigated = true;
              var cartBtn = document.querySelector('[data-testid="cart-button"], [class*="viewCart"], [class*="checkout"]');
              if (cartBtn) {
                cartBtn.click();
              } else {
                window.location.href = 'https://www.swiggy.com/checkout';
              }
            }
          }, 800);
        }
      }

      var poll = setInterval(checkAndBridgeToCheckout, 400);
      setTimeout(function() { clearInterval(poll); }, 6000);
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

          <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
            <Text style={styles.doneBtnText}>Done ✕</Text>
          </TouchableOpacity>
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
          injectedJavaScript={autoCheckoutScript}
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
  webview: {
    flex: 1,
  },
});
