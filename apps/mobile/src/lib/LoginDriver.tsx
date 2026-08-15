import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export type LoginStep = 'idle' | 'sending_phone' | 'awaiting_otp' | 'sending_otp' | 'success' | 'error';

export interface LoginDriverRef {
    submitPhone: (phoneVal: string) => void;
    submitOtp: (otpVal: string) => void;
}

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

export const LoginDriver = forwardRef<LoginDriverRef, LoginDriverProps>(({ 
    providerId, url, phone, otp, triggerPhone, triggerOtp, onOtpRequested, onSuccess, onError 
}, ref) => {
  const webViewRef = useRef<WebView>(null);

  useImperativeHandle(ref, () => ({
      submitPhone: (phoneVal: string) => {
          if (webViewRef.current) {
              const script = `window.dispatchEvent(new CustomEvent('NATIVE_ACTION', { detail: { type: 'PHONE', value: '${phoneVal}' } })); true;`;
              webViewRef.current.injectJavaScript(script);
          }
      },
      submitOtp: (otpVal: string) => {
          if (webViewRef.current) {
              const script = `window.dispatchEvent(new CustomEvent('NATIVE_ACTION', { detail: { type: 'OTP', value: '${otpVal}' } })); true;`;
              webViewRef.current.injectJavaScript(script);
          }
      }
  }));

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
       // ═══════════════════════════════════════════════════════════════
       // UNIVERSAL BULLETPROOF OTP ENGINE v2.0
       // Works on any SPA: Zomato, Swiggy, and future platforms
       // ═══════════════════════════════════════════════════════════════
       
       window.__OTP_SUBMITTED = false;
       window.__SUCCESS_SENT = false;

       // ─── UTILITY: Send message once (deduplication) ────────────────
       function sendSuccess() {
           if (!window.__SUCCESS_SENT) {
               window.__SUCCESS_SENT = true;
               window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SUCCESS' }));
           }
       }

       // ─── UTILITY: Simulate REAL typing into an input ───────────────
       // Properly triggers React's synthetic event system
       function simulateType(input, value) {
           input.focus();
           // Native value setter bypasses React's controlled input
           var nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
           nativeSetter.call(input, value);
           // Fire all events React listens to
           input.dispatchEvent(new Event('focus', { bubbles: true }));
           input.dispatchEvent(new Event('input', { bubbles: true }));
           input.dispatchEvent(new Event('change', { bubbles: true }));
           // Fire keyboard events for platforms that rely on key codes
           [value].forEach(function(ch) {
               input.dispatchEvent(new KeyboardEvent('keydown', { key: ch, bubbles: true }));
               input.dispatchEvent(new KeyboardEvent('keypress', { key: ch, bubbles: true }));
               input.dispatchEvent(new KeyboardEvent('keyup', { key: ch, bubbles: true }));
           });
           input.blur();
           input.dispatchEvent(new Event('blur', { bubbles: true }));
       }

       // ─── UTILITY: Simulate OTP into split boxes ────────────────────
       function fillOtpBoxes(inputs, otpValue) {
           var digits = otpValue.split('');
           inputs.forEach(function(inp, idx) {
               var digit = digits[idx] || '';
               simulateType(inp, digit);
               // Some SPAs auto-focus next box on input; allow that to happen
           });
       }

       // ─── UTILITY: Click a button properly ─────────────────────────
       function clickElement(el) {
           var target = el.closest ? (el.closest('button') || el) : el;
           target.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
           target.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
           target.click();
           target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
       }

       // ─── UTILITY: Wait for element using MutationObserver ─────────
       // Ultra-fast: fires in microseconds when DOM changes
       function waitForElement(selectorFn, callback, timeoutMs) {
           var result = selectorFn();
           if (result) { callback(result); return; }
           var timer;
           var observer = new MutationObserver(function() {
               var el = selectorFn();
               if (el) {
                   observer.disconnect();
                   clearTimeout(timer);
                   callback(el);
               }
           });
           observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, characterData: true });
           // Auto-cleanup timeout
           timer = setTimeout(function() {
               observer.disconnect();
           }, timeoutMs || 15000);
       }

       // ─── PLATFORM DETECTION ────────────────────────────────────────
       var host = window.location.hostname.toLowerCase();
       var isZomato  = host.includes('zomato');
       var isSwiggy  = host.includes('swiggy');

       // ─── PLATFORM-SPECIFIC: Find OTP Submit button ─────────────────────────────
       function findOtpSubmitButton() {
           var btn = null;
           
           if (isZomato) {
               // Zomato mobile: red CTA button with class 'jRryuq' or 'gsVULG'
               btn = document.querySelector('.jRryuq, .gsVULG');
               // Also try text-based (Zomato mobile says "Verify" or "Submit")
               if (!btn) {
                   var btns = Array.from(document.querySelectorAll('button, [class*="jRryuq"], [class*="gsVULG"]'));
                   btn = btns.find(function(el) {
                       var t = (el.textContent || '').trim().toLowerCase();
                       return t === 'verify' || t === 'submit' || t === 'confirm' || t === 'proceed';
                   });
               }
           }
           
           // Universal fallback
           if (!btn) {
               var allBtns = Array.from(document.querySelectorAll('button, [role="button"], div[class*="btn"]'));
               btn = allBtns.find(function(el) {
                   if (el.disabled || el.getAttribute('aria-disabled') === 'true') return false;
                   var t = (el.textContent || '').trim().toLowerCase();
                   return t === 'verify' || t === 'submit' || t === 'confirm' || t === 'proceed' || t.includes('verify otp') || t.includes('confirm otp');
               });
           }
           return btn;
       }

       // ─── PLATFORM-SPECIFIC: Find Send OTP button ──────────────────
       function findSendOtpButton() {
           var btn = null;
           
           if (isZomato) {
               // Zomato mobile: The red primary CTA (class 'jRryuq' or 'gsVULG' from CSS dump)
               btn = document.querySelector('.jRryuq, .gsVULG');
               if (!btn) {
                   var btns = Array.from(document.querySelectorAll('button'));
                   btn = btns.find(function(el) {
                       if (el.disabled) return false;
                       var t = (el.textContent || '').trim().toLowerCase();
                       return t === 'continue' || t === 'request otp' || t === 'send otp' || t === 'get otp' || t === 'proceed' || t === 'login';
                   });
               }
               // Final fallback: Zomato CTA is always #EF4F5F red
               if (!btn) {
                   Array.from(document.querySelectorAll('button, [role="button"], div')).forEach(function(el) {
                       if (btn || (el.disabled)) return;
                       var style = window.getComputedStyle(el);
                       var bg = style.backgroundColor;
                       if (bg === 'rgb(239, 79, 95)' || bg === 'rgb(226, 55, 68)') {
                           btn = el;
                       }
                   });
               }
           }
           
           if (!btn) {
               // Universal fallback
               var allEl = Array.from(document.querySelectorAll('button, [role="button"], a, div[class*="btn"]'));
               btn = allEl.reverse().find(function(el) {
                   if (el.disabled || el.getAttribute('aria-disabled') === 'true' || el.classList.contains('disabled')) return false;
                   var t = (el.textContent || '').trim().toLowerCase();
                   return t.includes('send otp') || t.includes('get otp') || t === 'continue' || t === 'next' || t.includes('send one') || t === 'request otp';
               });
           }
           return btn;
       }

       // ─── PHONE SUBMISSION FLOW ─────────────────────────────────────
       function handlePhone(phoneValue) {
           // Step 1: For Zomato - aggressively poll for login button
           // Zomato's home page shows a "Log in" link in the top navigation
           if (isZomato) {
               var loginPollAttempts = 0;
               var loginPoll = setInterval(function() {
                   loginPollAttempts++;
                   if (loginPollAttempts > 40) { clearInterval(loginPoll); }
                   // Zomato header login link
                   var allLinks = Array.from(document.querySelectorAll('a, button, [role="button"], span, div'));
                   var zLoginBtn = allLinks.find(function(el) {
                       var t = (el.textContent || '').trim().toLowerCase();
                       return t === 'log in' || t === 'login' || t === 'sign in';
                   });
                   if (zLoginBtn) {
                       clearInterval(loginPoll);
                       clickElement(zLoginBtn);
                   }
               }, 50);
           } else {
               // For other platforms: simple single attempt
               var loginOpeners = Array.from(document.querySelectorAll('a, span, div, button, [role="button"]'));
               var loginBtn = loginOpeners.find(function(el) {
                   var t = (el.textContent || '').trim().toLowerCase();
                   return t === 'login' || t === 'sign in' || t === 'log in' || t === 'signin';
               });
               if (loginBtn) clickElement(loginBtn);
           }

           // Step 2: Wait for phone input
           waitForElement(
               function() {
                   return document.querySelector(
                       'input[type="tel"], input[type="number"], input[name="mobile"], input[name="phone"], input[placeholder*="phone"], input[placeholder*="mobile"], input[placeholder*="number"], input[placeholder*="Enter your"]'
                   );
               },
               function(phoneInput) {
                   simulateType(phoneInput, phoneValue);
                   
                   // Poll every 50ms for maximum speed — no artificial wait
                   var attempts = 0;
                   var findAndClick = setInterval(function() {
                       attempts++;
                       if (attempts > 40) { clearInterval(findAndClick); return; }
                       
                       var btn = findSendOtpButton();
                       if (btn && !btn.disabled && btn.getAttribute('aria-disabled') !== 'true') {
                           clearInterval(findAndClick);
                           clickElement(btn);
                           window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'OTP_REQUESTED' }));
                       }
                   }, 50); // 50ms = ultra-fast
               }
           );
       }

       // ─── OTP SUBMISSION FLOW ───────────────────────────────────────
       function handleOtp(otpValue) {
           window.__OTP_SUBMITTED = true;
           
           // Step 1: Wait for OTP input fields
           waitForElement(
               function() {
                   var inputs = Array.from(document.querySelectorAll(
                       'input[type="tel"], input[type="number"], input[autocomplete="one-time-code"], input[inputmode="numeric"], input[name*="otp"], input[name*="OTP"]'
                   ));
                   return inputs.length > 0 ? inputs : null;
               },
               function(inputs) {
                   // Fill in the OTP
                   if (inputs.length > 1) {
                       // Split boxes (e.g., Zomato 6-box, Swiggy 4-box)
                       fillOtpBoxes(inputs, otpValue);
                   } else {
                       // Single input field
                       simulateType(inputs[0], otpValue);
                   }

                   // Step 2: Find and click Verify button
                   // Wait for button to become enabled after OTP is filled
                   var verifyAttempts = 0;
                   var findVerify = setInterval(function() {
                       verifyAttempts++;
                       if (verifyAttempts > 60) { clearInterval(findVerify); return; }
                       
                       var btn = findOtpSubmitButton();
                       if (btn && !btn.disabled && btn.getAttribute('aria-disabled') !== 'true') {
                           clearInterval(findVerify);
                           setTimeout(function() { clickElement(btn); }, 30);
                       }
                   }, 50); // 50ms polling = instant reaction
               }
           );
       }

       // ─── LISTEN FOR NATIVE COMMANDS ────────────────────────────────
       window.addEventListener('NATIVE_ACTION', function(e) {
           try {
               var action = e.detail;
               if (action.type === 'PHONE') handlePhone(action.value);
               if (action.type === 'OTP')   handleOtp(action.value);
           } catch (err) {
               window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ERROR', message: err.message }));
           }
       });

       // ─── PRE-EMPTIVE LOGIN DRAWER OPEN ─────────────────────────────
       // Try immediately and also after a short wait (no artificial delay)
       (function tryOpenLogin() {
           var loginOpeners = Array.from(document.querySelectorAll('a, span, div, button, [role="button"]'));
           var loginBtn = loginOpeners.find(function(el) {
               var t = (el.textContent || '').trim().toLowerCase();
               return t === 'login' || t === 'sign in' || t === 'log in';
           });
           if (loginBtn) clickElement(loginBtn);
       })();

       // ─── NETWORK INTERCEPTOR: Lightning speed success detection ─────
       var origFetch = window.fetch;
       window.fetch = async function() {
           var res = await origFetch.apply(this, arguments);
           if (!window.__OTP_SUBMITTED) return res;
           
           var url = String(arguments[0]).toLowerCase();
           var isAuth = url.includes('verify') || url.includes('otp') || url.includes('login') || url.includes('auth') || url.includes('graphql') || url.includes('validate') || url.includes('token') || url.includes('session');
           
           if (isAuth && res.ok) {
               try {
                   var text = await res.clone().text();
                   var t = text.toLowerCase();
                   if (!t.includes('"invalid"') && !t.includes('"incorrect"') && !t.includes('"wrong"') && !t.includes('"expired"') && !t.includes('error')) {
                       sendSuccess();
                   }
               } catch(e) {}
           }
           return res;
       };

       var origXHR = window.XMLHttpRequest.prototype.open;
       window.XMLHttpRequest.prototype.open = function(method, url) {
           this.addEventListener('load', function() {
               if (!window.__OTP_SUBMITTED) return;
               if (this.status >= 200 && this.status < 300) {
                   var u = String(url).toLowerCase();
                   var isAuth = u.includes('verify') || u.includes('otp') || u.includes('login') || u.includes('auth') || u.includes('validate') || u.includes('token') || u.includes('session');
                   if (isAuth) {
                       try {
                           var t = (this.responseText || '').toLowerCase();
                           if (!t.includes('"invalid"') && !t.includes('"incorrect"') && !t.includes('"wrong"') && !t.includes('"expired"')) {
                               sendSuccess();
                           }
                       } catch(e) {}
                   }
               }
           });
           origXHR.apply(this, arguments);
       };

       // ─── DOM FALLBACK: Check every 100ms for sign of success ───────
       var prevUrl = window.location.href;
       setInterval(function() {
           if (!document.body) return;
           
           // URL Change = logged in on many SPAs
           if (window.location.href !== prevUrl) {
               prevUrl = window.location.href;
               if (window.__OTP_SUBMITTED) { sendSuccess(); return; }
           }
           
           // Profile/Logout indicators = success
           var hasProfileSign = document.querySelector('a[href*="profile"], a[href*="account"], a[href*="orders"], img[alt*="profile"], img[alt*="user"]');
           var bodyText = (document.body.textContent || '').toLowerCase();
           if (hasProfileSign || bodyText.includes('logout') || bodyText.includes('sign out')) {
               if (window.__OTP_SUBMITTED) { sendSuccess(); return; }
           }
           
           // OTP modal disappeared = success
           if (window.__OTP_SUBMITTED) {
               var otpInputs = document.querySelectorAll('input[type="tel"], input[autocomplete="one-time-code"], input[inputmode="numeric"]');
               if (otpInputs.length === 0) { sendSuccess(); }
           }
       }, 100);
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
        userAgent="Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Mobile Safari/537.36"
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
});

const styles = StyleSheet.create({
  // Full-screen but invisible — SPAs need a real viewport to render properly.
  // A 10x10 box causes React SPAs to not render their login modals at all!
  hiddenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
    pointerEvents: 'none',
    zIndex: -999,
  }
});
