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
       // Helper to wait for an element as fast as possible
       function waitForElement(selectorFn, callback, maxAttempts = 100) {
           let attempts = 0;
           const int = setInterval(() => {
               attempts++;
               const el = selectorFn();
               if (el) {
                   clearInterval(int);
                   callback(el);
               } else if (attempts >= maxAttempts) {
                   clearInterval(int);
                   window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ERROR', message: 'Element timeout' }));
               }
           }, 100);
       }

       // Setup event listener to receive commands from Native app
       window.addEventListener('NATIVE_ACTION', function(e) {
           const action = e.detail;
           try {
               if (action.type === 'PHONE') {
                   // 1. Click Login Button
                   const loginBtn = Array.from(document.querySelectorAll('a, span, div, button')).find(el => {
                      const text = (el.innerText || '').trim().toLowerCase();
                      return text === 'login' || text === 'sign in' || text === 'log in';
                   });
                   if (loginBtn) loginBtn.click();

                   // 2. Wait for Phone Input
                   waitForElement(
                       () => document.querySelector('input[type="tel"], input[type="number"], input[name="mobile"]'),
                       (phoneInput) => {
                           // Set value
                           const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                           nativeInputValueSetter.call(phoneInput, action.value);
                           phoneInput.dispatchEvent(new Event('input', { bubbles: true }));
                           phoneInput.dispatchEvent(new Event('change', { bubbles: true }));
                           
                           // 3. Wait for Submit Button
                           waitForElement(
                               () => Array.from(document.querySelectorAll('button, span, a')).find(el => {
                                   const t = (el.innerText || '').toLowerCase();
                                   return t.includes('send otp') || t.includes('continue') || t.includes('get otp');
                               }),
                               (submitBtn) => {
                                   submitBtn.click();
                                   window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'OTP_REQUESTED' }));
                               }
                           );
                       }
                   );
               }
               
               if (action.type === 'OTP') {
                   // 1. Wait for OTP Inputs
                   waitForElement(
                       () => {
                           const inputs = document.querySelectorAll('input[type="tel"], input[type="number"], input[autocomplete="one-time-code"]');
                           return inputs.length > 0 ? inputs : null;
                       },
                       (inputs) => {
                           if (inputs.length === 6) {
                               const digits = action.value.split('');
                               inputs.forEach((inp, idx) => {
                                   const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                                   nativeInputValueSetter.call(inp, digits[idx] || '');
                                   inp.dispatchEvent(new Event('input', { bubbles: true }));
                               });
                           } else if (inputs.length > 0) {
                               const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                               nativeInputValueSetter.call(inputs[0], action.value);
                               inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
                           }

                           // 2. Wait for Verify Button
                           waitForElement(
                               () => Array.from(document.querySelectorAll('button, span, a')).find(el => {
                                   const t = (el.innerText || '').toLowerCase();
                                   return t.includes('verify') || t.includes('submit') || t.includes('confirm');
                               }),
                               (verifyBtn) => {
                                   verifyBtn.click();
                               }
                           );
                       }
                   );
               }
           } catch (err) {
               window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ERROR', message: err.message }));
           }
       });

       // Global success checker (checks every 500ms instead of 2000ms for faster detection)
       setInterval(() => {
           const html = document.body.innerText.toLowerCase();
           if (html.includes('logout') || html.includes('sign out') || (window.location.href.includes('zomato') && html.includes('profile'))) {
               window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SUCCESS' }));
           }
       }, 500);
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
