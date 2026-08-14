import React, { useRef, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { WebView } from 'react-native-webview';

export type ExtractionStatus = 'idle' | 'connecting' | 'extracting' | 'completed' | 'error';

interface WebViewExtractorProps {
  url: string;
  onDataExtracted: (data: any) => void;
  onError: (err: string) => void;
  isActive: boolean;
}

/**
 * Hidden WebView component that loads a URL and injects JS to extract pricing data.
 * This acts as our "Browser Extension" on mobile, securely parsing DOM data directly 
 * on the user's device.
 */
export const WebViewExtractor: React.FC<WebViewExtractorProps> = ({ url, onDataExtracted, onError, isActive }) => {
  const webViewRef = useRef<WebView>(null);
  
  // The JavaScript we inject into the provider's page after it loads.
  const injectedJavascript = `
    (function() {
      try {
        // Example mock extraction logic based on the provider
        // In reality, this would have complex DOM traversal (e.g. document.querySelector('.price-class'))
        
        const pageContent = document.body.innerText.toLowerCase();
        
        const extractedData = {
          success: true,
          timestamp: Date.now(),
          url: window.location.href,
          // Simulated extraction
          priceData: {
             basePrice: 0,
             discount: 0,
             finalPayablePrice: 0
          }
        };

        // If it's a known provider, run specific extractors
        if (window.location.href.includes('amazon')) {
           extractedData.priceData = { basePrice: 79900, discount: 5000, finalPayablePrice: 74900 };
           extractedData.benefits = ['Prime Member'];
        }

        window.ReactNativeWebView.postMessage(JSON.stringify(extractedData));
      } catch (e) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ success: false, error: e.message }));
      }
    })();
    true;
  `;

  if (!isActive) return null;

  return (
    <View style={styles.hiddenContainer}>
      <WebView
        ref={webViewRef}
        source={{ uri: url }}
        javaScriptEnabled={true}
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
