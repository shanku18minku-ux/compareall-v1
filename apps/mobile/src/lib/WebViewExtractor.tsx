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
  
  const userLat = location?.latitude || 28.6139;
  const userLng = location?.longitude || 77.2090;

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
        onLoadEnd={() => {
          if (injectedJavascript && webViewRef.current) {
            webViewRef.current.injectJavaScript(injectedJavascript);
          }
        }}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'SEARCH_RESULTS' || data.success) {
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
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // Keep WebView rendering active on Android (not suspended) while completely hidden from user view
  hiddenContainer: {
    height: 1,
    width: 1,
    opacity: 0.01,
    position: 'absolute',
    bottom: 0,
    right: 0,
    overflow: 'hidden',
  }
});
