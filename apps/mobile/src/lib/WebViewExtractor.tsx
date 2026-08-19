// @ts-nocheck
import React, { useRef, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { WebView } from 'react-native-webview';

// Extractor imports removed. Injections will be provided via props.

export type ExtractionStatus = 'idle' | 'connecting' | 'extracting' | 'completed' | 'error';

interface WebViewExtractorProps {
  url: string;
  providerId: string;
  location?: { latitude: number; longitude: number; name: string } | null;
  onDataExtracted: (data: any) => void;
  onError: (err: string) => void;
  isActive: boolean;
  injectionScript?: string;
}

/**
 * Hidden WebView component that loads a URL and injects JS to extract pricing data.
 * This acts as our "Browser Extension" on mobile, securely parsing DOM data directly 
 * on the user's device.
 */
export const WebViewExtractor: React.FC<WebViewExtractorProps> = ({ 
  url, 
  providerId, 
  location, 
  onDataExtracted, 
  onError, 
  isActive, 
  injectionScript 
}) => {
  const webViewRef = useRef<WebView>(null);
  
  // Only use real user-selected location — never fall back to hardcoded coordinates
  const hasLocation = Boolean(location && location.latitude && location.longitude);
  const userLat = hasLocation ? location!.latitude : 0;
  const userLng = hasLocation ? location!.longitude : 0;
  const locationName = location?.name || '';
  // Use JSON.stringify for safe string escaping (handles newlines, backslashes, quotes)
  const safeLocName = JSON.stringify(locationName);

  const beforeContentScript = `
    (function() {
        var lat = ${userLat};
        var lng = ${userLng};
        var hasLoc = ${hasLocation ? 'true' : 'false'};
        var locName = ${safeLocName};

        // Determine current platform from URL (hostname may be empty on initial load)
        var currentUrl = window.location.href || document.referrer || '';
        var isSwiggy = currentUrl.includes('swiggy');
        var isZomato = currentUrl.includes('zomato');
        var isEatSure = currentUrl.includes('eatsure');
        var isEatClub = currentUrl.includes('eatclub');


        var needsReload = false;

        // Only override geolocation if we have a real user location
        if (hasLoc && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition = function(success, error, options) {
                if (success) {
                    success({
                        coords: { latitude: lat, longitude: lng, accuracy: 10, altitude: null, altitudeAccuracy: null, heading: null, speed: null },
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

        if (!hasLoc) {
            // No location selected — do NOT inject stale/fake coordinates into any platform
            return;
        }

        function checkAndSetCookie(name, value) {
            var cookieStr = document.cookie;
            var match = cookieStr.match(new RegExp('(^| )' + name + '=([^;]+)'));
            if (!match || decodeURIComponent(match[2]) !== String(value)) {
                document.cookie = name + "=" + encodeURIComponent(value) + "; path=/; max-age=31536000";
                needsReload = true;
            }
        }


        // 2. Inject Swiggy LocalStorage Location & Cookies
        try {
            if (isSwiggy) {
                var lsLoc = localStorage.getItem('userLocation');
                var parsedLs = lsLoc ? JSON.parse(lsLoc) : null;
                if (!parsedLs || parsedLs.lat != lat) {
                    localStorage.setItem('userLocation', JSON.stringify({
                        lat: lat,
                        lng: lng,
                        address: locName,
                        area: locName,
                        id: ""
                    }));
                    needsReload = true;
                }
                checkAndSetCookie('_sw_lat', lat);
                checkAndSetCookie('_sw_lng', lng);
            }
        } catch(e) {}

        // 3. Inject Zomato Cookies
        try {
            if (isZomato) {
                var zlocCookieVal = JSON.stringify({lat: lat, lon: lng});
                checkAndSetCookie('loc', zlocCookieVal);
                checkAndSetCookie('z_loc', zlocCookieVal);
                var lsZloc = localStorage.getItem('zomato_location');
                var parsedZls = lsZloc ? JSON.parse(lsZloc) : null;
                if (!parsedZls || parsedZls.lat != lat) {
                    localStorage.setItem('zomato_location', JSON.stringify({lat: lat, lon: lng}));
                    needsReload = true;
                }
            }
        } catch(e) {}

        // 4. Inject EatSure LocalStorage
        try {
            if (isEatSure) {
                var lsLoc = localStorage.getItem('userLocation');
                var parsedLs = lsLoc ? JSON.parse(lsLoc) : null;
                if (!parsedLs || parsedLs.lat != lat) {
                    localStorage.setItem('userLocation', JSON.stringify({
                        lat: lat,
                        lng: lng,
                        address: locName,
                        tag: 'Other'
                    }));
                    needsReload = true;
                }
                checkAndSetCookie('latitude', lat);
                checkAndSetCookie('longitude', lng);
            }
        } catch(e) {}

        // 5. Inject EatClub LocalStorage
        try {
            if (isEatClub) {
                var ecLoc = localStorage.getItem('user_location') || localStorage.getItem('location');
                if (!ecLoc || !ecLoc.includes(String(lat))) {
                    localStorage.setItem('user_location', JSON.stringify({lat: lat, lng: lng, address: locName}));
                    localStorage.setItem('location', JSON.stringify({lat: lat, lng: lng, address: locName}));
                    needsReload = true;
                }
                checkAndSetCookie('lat', lat);
                checkAndSetCookie('lng', lng);
            }
        } catch(e) {}

        var reloadGuardKey = 'ca_reloaded_' + lat + '_' + lng;
        if (needsReload && !sessionStorage.getItem(reloadGuardKey)) {
            sessionStorage.setItem(reloadGuardKey, 'true');
            window.location.reload();
            return; // Halt execution of original DOM script until reloaded
        }
    })();
    true;
  `;

  let injectedJavascript = injectionScript || `
    window.ReactNativeWebView.postMessage(JSON.stringify({ success: false, error: 'No extractor script provided' }));
    true;
  `;

  // Watchdog timer: ensure extraction script runs promptly
  React.useEffect(() => {
    if (!isActive) return;
    const t1 = setTimeout(() => {
      if (webViewRef.current && injectedJavascript) {
        try {
          webViewRef.current.injectJavaScript(injectedJavascript);
        } catch(e) {}
      }
    }, 600);

    const t2 = setTimeout(() => {
      if (webViewRef.current && injectedJavascript) {
        try {
          webViewRef.current.injectJavaScript(injectedJavascript);
        } catch(e) {}
      }
    }, 1500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isActive, url, injectedJavascript]);

  if (!isActive) return null;

  return (
    <View style={styles.hiddenContainer}>
      <WebView
        ref={webViewRef}
        source={{ uri: url }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        thirdPartyCookiesEnabled={true}
        sharedCookiesEnabled={true}
        geolocationEnabled={true}
        mixedContentMode="always"
        userAgent="Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
        injectedJavaScriptBeforeContentLoaded={beforeContentScript}
        injectedJavaScript={injectedJavascript}
        onLoadProgress={({ nativeEvent }) => {
          if (nativeEvent.progress > 0.6 && injectedJavascript && webViewRef.current) {
            try {
              webViewRef.current.injectJavaScript(injectedJavascript);
            } catch(e) {}
          }
        }}
        onLoadEnd={() => {
          if (injectedJavascript && webViewRef.current) {
            try {
              webViewRef.current.injectJavaScript(injectedJavascript);
            } catch(e) {}
          }
        }}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'SEARCH_RESULTS' || data.success || data.items || data.data) {
              onDataExtracted(data);
            } else {
              onError(data.error || 'Unknown extraction error');
            }
          } catch (e) {
            onError('Failed to parse WebView message');
          }
        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          onError(nativeEvent.description);
          if (injectedJavascript && webViewRef.current) {
            try {
              webViewRef.current.injectJavaScript(injectedJavascript);
            } catch(e) {}
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // Keep WebView rendering at full performance on Android (not suspended or throttled)
  hiddenContainer: {
    height: 600,
    width: 360,
    position: 'absolute',
    top: -9999,
    left: -9999,
    opacity: 0.01,
    zIndex: -999,
  }
});
