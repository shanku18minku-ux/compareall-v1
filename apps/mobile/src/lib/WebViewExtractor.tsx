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
  
  const userLat = location?.latitude || 24.0416;
  const userLng = location?.longitude || 84.0706;

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
