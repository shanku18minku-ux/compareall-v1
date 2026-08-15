import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export type LoginStep = 'idle' | 'sending_phone' | 'awaiting_otp' | 'sending_otp' | 'success' | 'error';

interface LoginDriverProps {
  providerId: string;
  url: string;
  phone: string;
  otp: string;
  triggerPhone: boolean;
  triggerOtp: boolean;
  onOtpRequested: () => void;
  onSuccess: () => void;
  onError: (msg: string) => void;
}

export const LoginDriver: React.FC<LoginDriverProps> = ({ 
    providerId, url, phone, otp, triggerPhone, triggerOtp, onOtpRequested, onSuccess, onError 
}) => {
  const webViewRef = useRef<WebView>(null);

  // When triggerPhone becomes true, we tell the WebView to execute the phone injection script
  useEffect(() => {
     if (triggerPhone && phone && webViewRef.current) {
        // Send a message to the injected script to start the phone flow
        const script = `window.dispatchEvent(new CustomEvent('NATIVE_ACTION', { detail: { type: 'PHONE', value: '${phone}' } })); true;`;
        webViewRef.current.injectJavaScript(script);
     }
  }, [triggerPhone, phone]);

  useEffect(() => {
     if (triggerOtp && otp && webViewRef.current) {
        const script = `window.dispatchEvent(new CustomEvent('NATIVE_ACTION', { detail: { type: 'OTP', value: '${otp}' } })); true;`;
        webViewRef.current.injectJavaScript(script);
     }
  }, [triggerOtp, otp]);

  const baseScript = `
    (function() {
       // Setup event listener to receive commands from Native app
       window.addEventListener('NATIVE_ACTION', function(e) {
           const action = e.detail;
           try {
               if (action.type === 'PHONE') {
                   // Generic logic (will be overridden by provider specific later if needed, but we can do a broad search here)
                   // For Zomato Desktop: The login button is usually at the top right
                   const loginBtn = Array.from(document.querySelectorAll('a, span, div, button')).find(el => {
                      const text = (el.innerText || '').trim().toLowerCase();
                      return text === 'login' || text === 'sign in' || text === 'log in';
                   });
                   if (loginBtn) loginBtn.click();

                   // Wait for the input box to appear
                   setTimeout(() => {
                       const phoneInput = document.querySelector('input[type="tel"], input[type="number"]');
                       if (phoneInput) {
                           // Set value
                           const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                           nativeInputValueSetter.call(phoneInput, action.value);
                           phoneInput.dispatchEvent(new Event('input', { bubbles: true }));
                           phoneInput.dispatchEvent(new Event('change', { bubbles: true }));
                           
                           // Find submit button ("Send OTP" or "Continue")
                           setTimeout(() => {
                               const submitBtn = Array.from(document.querySelectorAll('button, span')).find(el => {
                                   const t = (el.innerText || '').toLowerCase();
                                   return t.includes('send otp') || t.includes('continue') || t.includes('get otp');
                               });
                               if (submitBtn) {
                                  submitBtn.click();
                                  window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'OTP_REQUESTED' }));
                               }
                           }, 500);
                       } else {
                           window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ERROR', message: 'Phone input not found' }));
                       }
                   }, 2000);
               }
               
               if (action.type === 'OTP') {
                   // Try to find the 6 boxes or 1 box for OTP
                   const inputs = document.querySelectorAll('input[type="tel"], input[type="number"], input[autocomplete="one-time-code"]');
                   if (inputs.length === 6) {
                       // 6 separate boxes
                       const digits = action.value.split('');
                       inputs.forEach((inp, idx) => {
                           const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                           nativeInputValueSetter.call(inp, digits[idx] || '');
                           inp.dispatchEvent(new Event('input', { bubbles: true }));
                       });
                   } else if (inputs.length > 0) {
                       // 1 single box
                       const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                       nativeInputValueSetter.call(inputs[0], action.value);
                       inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
                   }

                   // Auto submit usually happens on 6th digit, but if there's a verify button:
                   setTimeout(() => {
                       const verifyBtn = Array.from(document.querySelectorAll('button, span')).find(el => {
                           const t = (el.innerText || '').toLowerCase();
                           return t.includes('verify') || t.includes('submit') || t.includes('confirm');
                       });
                       if (verifyBtn) verifyBtn.click();
                   }, 500);
               }
           } catch (err) {
               window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ERROR', message: err.message }));
           }
       });

       // Global success checker
       setInterval(() => {
           const html = document.body.innerText.toLowerCase();
           if (html.includes('logout') || html.includes('sign out') || (window.location.href.includes('zomato') && html.includes('profile'))) {
               window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SUCCESS' }));
           }
       }, 2000);
    })();
    true;
  `;

  return (
    <View style={styles.hiddenContainer}>
      <WebView
        ref={webViewRef}
        source={{ uri: url }}
        javaScriptEnabled={true}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
        injectedJavaScript={baseScript}
        onMessage={(event) => {
           try {
               const data = JSON.parse(event.nativeEvent.data);
               if (data.type === 'OTP_REQUESTED') onOtpRequested();
               if (data.type === 'SUCCESS') onSuccess();
               if (data.type === 'ERROR') onError(data.message);
           } catch (e) {
               // ignore non-json messages
           }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  hiddenContainer: {
    height: 1,
    width: 1,
    opacity: 0,
    position: 'absolute',
    top: -1000,
    left: -1000,
  }
});
