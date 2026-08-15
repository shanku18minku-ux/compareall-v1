import React, { useRef, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { WebView } from 'react-native-webview';

// Extractor imports removed. Injections will be provided via props.

export type ExtractionStatus = 'idle' | 'connecting' | 'extracting' | 'completed' | 'error';

interface WebViewExtractorProps {
  url: string;
  providerId: string;
  onDataExtracted: (data: any) => void;
  onError: (err: string) => void;
  isActive: boolean;
  injectionScript?: string; // New prop for dynamic packets
}

/**
 * Hidden WebView component that loads a URL and injects JS to extract pricing data.
 * This acts as our "Browser Extension" on mobile, securely parsing DOM data directly 
 * on the user's device.
 */
export const WebViewExtractor: React.FC<WebViewExtractorProps> = ({ url, providerId, onDataExtracted, onError, isActive, injectionScript }) => {
  const webViewRef = useRef<WebView>(null);
  
  // Script provided dynamically by the packet driver
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
        userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
        injectedJavaScript={injectedJavascript}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.success) {
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
  // Keep the WebView in the render tree but invisible
  hiddenContainer: {
    height: 1,
    width: 1,
    opacity: 0,
    position: 'absolute',
    top: -1000,
    left: -1000,
  }
});
