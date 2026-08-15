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

  useEffect(() => {
     if (triggerPhone && phone && webViewRef.current) {
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
       'use strict';
       // ═══════════════════════════════════════════════════════════════
       // UNIVERSAL OTP ENGINE v3.0 — Phase 2 Rewrite
       // Clean separation of Phone Flow vs OTP Flow
       // Swiggy + Zomato + Universal fallback
       // ═══════════════════════════════════════════════════════════════

       window.__OTP_SUBMITTED = false;
       window.__SUCCESS_SENT  = false;
       window.__PHONE_DONE    = false; // tracks if phone step is complete

       // ─── HELPERS ──────────────────────────────────────────────────
       function dbg(msg) {
           window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'DEBUG', message: msg }));
       }

       function sendSuccess() {
           if (!window.__SUCCESS_SENT) {
               window.__SUCCESS_SENT = true;
               dbg('SUCCESS sent!');
               window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SUCCESS' }));
           }
       }

       // ─── Simulate typing into React-controlled input ───────────────
       function simulateType(input, value) {
           input.focus();
           var nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
           nativeSetter.call(input, value);
           input.dispatchEvent(new Event('focus',  { bubbles: true }));
           input.dispatchEvent(new Event('input',  { bubbles: true }));
           input.dispatchEvent(new Event('change', { bubbles: true }));
           input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true }));
           input.dispatchEvent(new KeyboardEvent('keyup',   { bubbles: true }));
       }

       // ─── Fill split OTP boxes (1 digit each) ─────────────────────
       function fillOtpBoxes(inputs, otpValue) {
           var digits = otpValue.toString().split('');
           inputs.forEach(function(inp, idx) {
               if (digits[idx] !== undefined) {
                   simulateType(inp, digits[idx]);
               }
           });
       }

       // ─── Click a button with all necessary events ─────────────────
       function clickElement(el) {
           if (!el) return;
           var target = el.closest ? (el.closest('button') || el) : el;
           target.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
           target.dispatchEvent(new MouseEvent('mouseup',   { bubbles: true }));
           target.click();
           target.dispatchEvent(new MouseEvent('click',     { bubbles: true }));
       }

       // ─── Wait for element with MutationObserver (instant) ─────────
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
           observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true });
           timer = setTimeout(function() { observer.disconnect(); }, timeoutMs || 15000);
       }

       // ─── Poll at 50ms until condition is true ──────────────────────
       function pollUntil(conditionFn, callback, maxAttempts, onTimeout) {
           var attempts = 0;
           var interval = setInterval(function() {
               attempts++;
               if (attempts > (maxAttempts || 80)) {
                   clearInterval(interval);
                   if (onTimeout) onTimeout();
                   return;
               }
               var result = conditionFn();
               if (result) {
                   clearInterval(interval);
                   callback(result);
               }
           }, 50);
           return interval;
       }

       // ─── PLATFORM DETECTION ───────────────────────────────────────
       var host = window.location.hostname.toLowerCase();
       var isZomato = host.includes('zomato');
       var isSwiggy = host.includes('swiggy');
       dbg('Platform detected: ' + (isZomato ? 'Zomato' : isSwiggy ? 'Swiggy' : 'Unknown'));

       // ═══════════════════════════════════════════════════════════════
       // STEP 1: Find & click Login/Sign-In button in header nav
       // ═══════════════════════════════════════════════════════════════
       function findLoginHeaderButton() {
           var all = Array.from(document.querySelectorAll('a, button, [role="button"], span, p'));
           return all.find(function(el) {
               // Must be a leaf or near-leaf element to avoid parent containers
               var t = (el.textContent || '').trim().toLowerCase();
               return (t === 'log in' || t === 'login' || t === 'sign in' || t === 'signin') && t.length < 10;
           }) || null;
       }

       // ═══════════════════════════════════════════════════════════════
       // STEP 2: Find phone number input (NOT OTP)
       // ═══════════════════════════════════════════════════════════════
       function findPhoneInput() {
           // Specific selectors for phone (avoid OTP inputs)
           var input = document.querySelector(
               'input[type="tel"]:not([autocomplete="one-time-code"]),' +
               'input[name="mobile"],' +
               'input[name="phone"],' +
               'input[name="mobileNumber"],' +
               'input[placeholder*="mobile" i],' +
               'input[placeholder*="phone" i],' +
               'input[placeholder*="number" i],' +
               'input[placeholder*="enter mobile" i],' +
               'input[placeholder*="10 digit" i]'
           );
           // Extra check: must allow 10 digit input (maxlength >= 10 or unset)
           if (input) {
               var maxLen = input.getAttribute('maxlength');
               if (maxLen && parseInt(maxLen) < 6) return null; // This is an OTP box
           }
           return input;
       }

       // ═══════════════════════════════════════════════════════════════
       // STEP 3: Find "Send OTP" / "Continue" CTA button
       // ═══════════════════════════════════════════════════════════════
       function findSendOtpButton() {
           var btn = null;

           // Swiggy-specific: orange button (#FC8019) or text match
           if (isSwiggy) {
               var sbtns = Array.from(document.querySelectorAll('button'));
               // Text match first (most reliable)
               btn = sbtns.find(function(el) {
                   if (el.disabled) return false;
                   var t = (el.textContent || '').trim().toLowerCase();
                   return t === 'continue' || t === 'send otp' || t === 'get otp' || t === 'request otp' || t === 'next';
               });
               // Orange color fallback
               if (!btn) {
                   sbtns.forEach(function(el) {
                       if (btn || el.disabled) return;
                       var bg = window.getComputedStyle(el).backgroundColor;
                       if (bg === 'rgb(252, 128, 25)' || bg === 'rgb(255, 102, 0)' || bg === 'rgb(240, 90, 40)' || bg === 'rgb(252, 116, 8)') {
                           btn = el;
                       }
                   });
               }
           }

           // Zomato-specific: red button (#EF4F5F)
           if (isZomato && !btn) {
               var zbtns = Array.from(document.querySelectorAll('button'));
               btn = zbtns.find(function(el) {
                   if (el.disabled) return false;
                   var t = (el.textContent || '').trim().toLowerCase();
                   return t === 'continue' || t === 'request otp' || t === 'send otp' || t === 'get otp' || t === 'login';
               });
               if (!btn) {
                   zbtns.forEach(function(el) {
                       if (btn || el.disabled) return;
                       var bg = window.getComputedStyle(el).backgroundColor;
                       if (bg === 'rgb(239, 79, 95)' || bg === 'rgb(226, 55, 68)') btn = el;
                   });
               }
           }

           // Universal fallback
           if (!btn) {
               var all = Array.from(document.querySelectorAll('button, [role="button"]'));
               btn = all.find(function(el) {
                   if (el.disabled || el.getAttribute('aria-disabled') === 'true') return false;
                   var t = (el.textContent || '').trim().toLowerCase();
                   return t.includes('send otp') || t.includes('get otp') || t === 'continue' || t === 'next' || t === 'request otp';
               });
           }
           return btn || null;
       }

       // ═══════════════════════════════════════════════════════════════
       // STEP 4: Find OTP input boxes (after OTP SMS sent)
       // ═══════════════════════════════════════════════════════════════
       function findOtpInputs() {
           // Swiggy: 4 single-digit boxes with maxlength=1
           var singleBoxes = Array.from(document.querySelectorAll(
               'input[maxlength="1"], input[data-index], input[autocomplete="one-time-code"]'
           ));
           if (singleBoxes.length >= 4) return singleBoxes;

           // Zomato: 6 single-digit boxes
           var numericInputs = Array.from(document.querySelectorAll('input[type="number"][maxlength="1"], input[inputmode="numeric"][maxlength="1"]'));
           if (numericInputs.length >= 4) return numericInputs;

           // Single OTP field (some platforms)
           var singleField = document.querySelector('input[name*="otp" i], input[name*="code" i], input[placeholder*="otp" i], input[placeholder*="enter otp" i]');
           if (singleField) return [singleField];

           return null;
       }

       // ═══════════════════════════════════════════════════════════════
       // STEP 5: Find "Verify OTP" submit button
       // ═══════════════════════════════════════════════════════════════
       function findVerifyButton() {
           var btn = null;

           if (isSwiggy) {
               var sbtns = Array.from(document.querySelectorAll('button'));
               btn = sbtns.find(function(el) {
                   if (el.disabled) return false;
                   var t = (el.textContent || '').trim().toLowerCase();
                   return t === 'verify' || t === 'submit' || t === 'confirm' || t === 'proceed' || t === 'continue';
               });
               if (!btn) {
                   sbtns.forEach(function(el) {
                       if (btn || el.disabled) return;
                       var bg = window.getComputedStyle(el).backgroundColor;
                       if (bg === 'rgb(252, 128, 25)' || bg === 'rgb(255, 102, 0)') btn = el;
                   });
               }
           }

           if (isZomato && !btn) {
               var zbtns = Array.from(document.querySelectorAll('button'));
               btn = zbtns.find(function(el) {
                   if (el.disabled) return false;
                   var t = (el.textContent || '').trim().toLowerCase();
                   return t === 'verify' || t === 'submit' || t === 'confirm' || t === 'proceed';
               });
               if (!btn) {
                   zbtns.forEach(function(el) {
                       if (btn || el.disabled) return;
                       var bg = window.getComputedStyle(el).backgroundColor;
                       if (bg === 'rgb(239, 79, 95)' || bg === 'rgb(226, 55, 68)') btn = el;
                   });
               }
           }

           if (!btn) {
               var all = Array.from(document.querySelectorAll('button, [role="button"]'));
               btn = all.find(function(el) {
                   if (el.disabled || el.getAttribute('aria-disabled') === 'true') return false;
                   var t = (el.textContent || '').trim().toLowerCase();
                   return t === 'verify' || t === 'submit' || t === 'confirm' || t.includes('verify otp');
               });
           }
           return btn || null;
       }

       // ═══════════════════════════════════════════════════════════════
       // PHONE FLOW
       // ═══════════════════════════════════════════════════════════════
       function handlePhone(phoneValue) {
           dbg('handlePhone: started with phone=' + phoneValue);

           // Step 1: Poll for Login/Sign-In header button (50ms, max 3 seconds)
           pollUntil(
               findLoginHeaderButton,
               function(loginBtn) {
                   dbg('handlePhone: Found login btn, clicking...');
                   clickElement(loginBtn);

                   // Step 2: After clicking login, wait for phone input to appear
                   waitForElement(
                       findPhoneInput,
                       function(phoneInput) {
                           dbg('handlePhone: Phone input found, typing...');
                           simulateType(phoneInput, phoneValue);
                           window.__PHONE_DONE = true;

                           // Step 3: Poll for Send OTP CTA button (50ms, max 2 seconds)
                           pollUntil(
                               findSendOtpButton,
                               function(sendBtn) {
                                   dbg('handlePhone: Send OTP btn found, clicking...');
                                   clickElement(sendBtn);
                                   window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'OTP_REQUESTED' }));
                                   dbg('handlePhone: OTP_REQUESTED sent!');
                               },
                               40,
                               function() { dbg('handlePhone: Send OTP btn timeout!'); }
                           );
                       },
                       8000 // wait up to 8s for phone input
                   );
               },
               60, // max 60 * 50ms = 3 seconds
               function() { dbg('handlePhone: Login btn poll timeout!'); }
           );
       }

       // ═══════════════════════════════════════════════════════════════
       // OTP FLOW
       // ═══════════════════════════════════════════════════════════════
       function handleOtp(otpValue) {
           dbg('handleOtp: started with otp=' + otpValue);
           window.__OTP_SUBMITTED = true;

           // Step 1: Wait for OTP boxes to appear
           waitForElement(
               findOtpInputs,
               function(inputs) {
                   dbg('handleOtp: OTP inputs found (' + inputs.length + ' boxes), filling...');

                   if (inputs.length > 1) {
                       // Multi-box (Swiggy 4-box, Zomato 6-box)
                       fillOtpBoxes(inputs, otpValue);
                   } else {
                       // Single field
                       simulateType(inputs[0], otpValue);
                   }

                   dbg('handleOtp: OTP filled, looking for Verify button...');

                   // Step 2: Poll for Verify button (50ms, max 3 seconds)
                   pollUntil(
                       findVerifyButton,
                       function(verifyBtn) {
                           dbg('handleOtp: Verify btn found, clicking...');
                           setTimeout(function() { clickElement(verifyBtn); }, 30);
                       },
                       60,
                       function() { dbg('handleOtp: Verify btn timeout!'); }
                   );
               },
               12000 // wait up to 12s for OTP screen
           );
       }

       // ─── LISTEN FOR NATIVE COMMANDS ──────────────────────────────
       window.addEventListener('NATIVE_ACTION', function(e) {
           try {
               var action = e.detail;
               if (action.type === 'PHONE') handlePhone(action.value);
               if (action.type === 'OTP')   handleOtp(action.value);
           } catch (err) {
               window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ERROR', message: err.message }));
           }
       });

       // ─── NETWORK INTERCEPTOR: Detect login success via API ────────
       var origFetch = window.fetch;
       window.fetch = async function() {
           var res = await origFetch.apply(this, arguments);
           if (!window.__OTP_SUBMITTED) return res;
           var u = String(arguments[0]).toLowerCase();
           var isAuth = u.includes('verify') || u.includes('otp') || u.includes('login') || u.includes('auth') || u.includes('token') || u.includes('session');
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
                   var isAuth = u.includes('verify') || u.includes('otp') || u.includes('login') || u.includes('auth') || u.includes('token') || u.includes('session');
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

       // ─── DOM POLLING: Fallback success detection ──────────────────
       var prevUrl = window.location.href;
       setInterval(function() {
           if (!document.body) return;

           // URL change after OTP submitted = logged in
           if (window.location.href !== prevUrl) {
               prevUrl = window.location.href;
               if (window.__OTP_SUBMITTED) { sendSuccess(); return; }
           }

           // Profile/logout indicators in DOM
           var hasProfileSign = document.querySelector(
               'a[href*="profile"], a[href*="account"], a[href*="orders"], img[alt*="profile" i], img[alt*="user" i]'
           );
           var bodyText = (document.body.textContent || '').toLowerCase();
           if ((hasProfileSign || bodyText.includes('logout') || bodyText.includes('sign out')) && window.__OTP_SUBMITTED) {
               sendSuccess(); return;
           }

           // OTP inputs disappeared after submit = success
           if (window.__OTP_SUBMITTED) {
               var remainingOtpBoxes = document.querySelectorAll('input[maxlength="1"], input[autocomplete="one-time-code"]');
               if (remainingOtpBoxes.length === 0) { sendSuccess(); }
           }
       }, 200);

       dbg('OTP Engine v3.0 initialized!');
     })();
     true;
  `;

  return (
    <View style={styles.hiddenContainer}>
      <WebView
        ref={webViewRef}
        source={{ uri: url }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        userAgent="Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Mobile Safari/537.36"
        injectedJavaScriptBeforeContentLoaded={baseScript}
        onMessage={(event) => {
           try {
               const data = JSON.parse(event.nativeEvent.data);
               if (data.type === 'DEBUG') {
                   console.log(\`[${providerId}] \${data.message}\`);
               }
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
  // Full-screen but invisible — SPAs need real viewport to render properly
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
