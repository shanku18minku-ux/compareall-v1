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
       // Helper to wait for an element as fast as possible (0ms immediate check, then 10ms polling)
       function waitForElement(selectorFn, callback, maxAttempts = 1000) {
           const initial = selectorFn();
           if (initial) {
               callback(initial);
               return;
           }
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
           }, 10);
       }

       // PRE-EMPTIVE OPTIMIZATION: Open the login drawer/modal before the user even submits their phone number!
       function preOpenLoginDrawer() {
           const loginBtn = Array.from(document.querySelectorAll('a, span, div, button')).find(el => {
              const text = (el.textContent || '').trim().toLowerCase();
              return text === 'login' || text === 'sign in' || text === 'log in';
           });
           if (loginBtn) {
               loginBtn.click();
           } else {
               setTimeout(preOpenLoginDrawer, 300);
           }
       }
       preOpenLoginDrawer();

       // Setup event listener to receive commands from Native app
       window.addEventListener('NATIVE_ACTION', function(e) {
           const action = e.detail;
           try {
               if (action.type === 'PHONE') {
                   // 1. Fallback: Click Login Button if pre-open failed
                   const loginBtn = Array.from(document.querySelectorAll('a, span, div, button')).find(el => {
                      const text = (el.textContent || '').trim().toLowerCase();
                      return text === 'login' || text === 'sign in' || text === 'log in';
                   });
                   if (loginBtn) loginBtn.click();

                   // 2. Wait for Phone Input
                   waitForElement(
                       () => {
                           return Array.from(document.querySelectorAll('input[type="tel"], input[type="number"], input[name="mobile"]')).find(el => true);
                       },
                       (phoneInput) => {
                           // Set value
                           const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                           nativeInputValueSetter.call(phoneInput, action.value);
                           phoneInput.dispatchEvent(new Event('input', { bubbles: true }));
                           phoneInput.dispatchEvent(new Event('change', { bubbles: true }));
                           
                           // 3. Wait for Submit Button
                           waitForElement(
                               () => Array.from(document.querySelectorAll('button, a, div[role="button"], span')).reverse().find(el => {
                                   const t = (el.textContent || '').trim().toLowerCase();
                                   return t === 'login' || t === 'continue' || t.includes('send one') || t.includes('send otp') || t.includes('get otp') || t === 'next';
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
                                   const t = (el.textContent || '').trim().toLowerCase();
                                   return t === 'verify' || t === 'submit' || t === 'confirm';
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

       // Network Interceptor for Lightning Speed Success Detection
       // Bypasses DOM rendering delay by listening directly to API responses
       const origFetch = window.fetch;
       window.fetch = async function(...args) {
           const res = await origFetch.apply(this, args);
           const url = String(args[0]).toLowerCase();
           if ((url.includes('verify') || url.includes('otp') || url.includes('login') || url.includes('auth')) && res.ok) {
               try {
                   const clone = res.clone();
                   const text = await clone.text();
                   if (text.includes('"token"') || text.includes('success":true') || text.includes('"userId"') || text.includes('user_id') || text.includes('"account"')) {
                       window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SUCCESS' }));
                   }
               } catch (e) {}
           }
           return res;
       };

       const origXHR = window.XMLHttpRequest.prototype.open;
       window.XMLHttpRequest.prototype.open = function(method, url, ...args) {
           this.addEventListener('load', function() {
               if (this.status >= 200 && this.status < 300) {
                   const u = String(url).toLowerCase();
                   if (u.includes('verify') || u.includes('otp') || u.includes('login') || u.includes('auth')) {
                       try {
                           const text = this.responseText;
                           if (text.includes('"token"') || text.includes('success":true') || text.includes('"userId"') || text.includes('user_id') || text.includes('"account"')) {
                               window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SUCCESS' }));
                           }
                       } catch(e) {}
                   }
               }
           });
           origXHR.call(this, method, url, ...args);
       };

       // Global success checker fallback (checks every 50ms for ultra-fast DOM fallback)
       setInterval(() => {
           if (!document.body) return; // Prevent crash before body is loaded
           const html = document.body.innerText.toLowerCase();
           if (html.includes('logout') || html.includes('sign out') || (window.location.href.includes('zomato') && html.includes('profile'))) {
               window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SUCCESS' }));
           }
       }, 50);
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
        injectedJavaScriptBeforeContentLoaded={baseScript}
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
    height: 10,
    width: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -1,
  }
});
