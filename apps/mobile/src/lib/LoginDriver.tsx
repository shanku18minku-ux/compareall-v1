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
              const script = "window.dispatchEvent(new CustomEvent('NATIVE_ACTION', { detail: { type: 'PHONE', value: '" + phoneVal + "' } })); true;";
              webViewRef.current.injectJavaScript(script);
          }
      },
      submitOtp: (otpVal: string) => {
          if (webViewRef.current) {
              const script = "window.dispatchEvent(new CustomEvent('NATIVE_ACTION', { detail: { type: 'OTP', value: '" + otpVal + "' } })); true;";
              webViewRef.current.injectJavaScript(script);
          }
      }
  }));

  useEffect(() => {
     if (triggerPhone && phone && webViewRef.current) {
        const script = "window.dispatchEvent(new CustomEvent('NATIVE_ACTION', { detail: { type: 'PHONE', value: '" + phone + "' } })); true;";
        webViewRef.current.injectJavaScript(script);
     }
  }, [triggerPhone, phone]);

  useEffect(() => {
     if (triggerOtp && otp && webViewRef.current) {
        const script = "window.dispatchEvent(new CustomEvent('NATIVE_ACTION', { detail: { type: 'OTP', value: '" + otp + "' } })); true;";
        webViewRef.current.injectJavaScript(script);
     }
  }, [triggerOtp, otp]);

  const baseScript = `
    (function() {
       'use strict';
       // ================================================================
       // UNIVERSAL OTP ENGINE v3.1 — Parallel Phone Flow (Swiggy Fixed)
       // ================================================================

       window.__OTP_SUBMITTED = false;
       window.__SUCCESS_SENT  = false;
       window.__PHONE_DONE    = false;

       function dbg(msg) {
           window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'DEBUG', message: msg }));
       }

       function sendSuccess() {
           if (!window.__SUCCESS_SENT) {
               window.__SUCCESS_SENT = true;
               dbg('SUCCESS!');
               window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SUCCESS' }));
           }
       }

       // ── Simulate typing into React-controlled input ─────────────────
       function simulateType(input, value) {
           input.focus();
           // Bypass React controlled input
           var nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
           nativeSetter.call(input, value);
           // Fire all events React + vanilla JS listens to
           input.dispatchEvent(new Event('focus',  { bubbles: true }));
           input.dispatchEvent(new Event('input',  { bubbles: true }));
           input.dispatchEvent(new Event('change', { bubbles: true }));
           input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
           input.dispatchEvent(new KeyboardEvent('keyup',   { key: 'Enter', bubbles: true }));
           // CRITICAL for Swiggy: blur triggers form validation which ENABLES the Continue button
           input.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
           // Re-focus after blur so it feels natural
           setTimeout(function() {
               input.dispatchEvent(new Event('input',  { bubbles: true }));
               input.dispatchEvent(new Event('change', { bubbles: true }));
           }, 50);
       }

       // ── Fill split OTP boxes ────────────────────────────────────────
       function fillOtpBoxes(inputs, otpValue) {
           var digits = otpValue.toString().split('');
           inputs.forEach(function(inp, idx) {
               if (digits[idx] !== undefined) simulateType(inp, digits[idx]);
           });
       }

       // ── Click a button with full mouse event chain ──────────────────
       function clickElement(el) {
           if (!el) return;
           var target = el.closest ? (el.closest('button') || el) : el;
           target.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
           target.dispatchEvent(new MouseEvent('mouseup',   { bubbles: true }));
           target.click();
           target.dispatchEvent(new MouseEvent('click',     { bubbles: true }));
       }

       // ── Wait for element with MutationObserver (fires instantly) ────
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

       // ── Poll every 50ms until condition met ─────────────────────────
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

       // ── Platform Detection ──────────────────────────────────────────
       var host = window.location.hostname.toLowerCase();
       var isZomato = host.includes('zomato');
       var isSwiggy = host.includes('swiggy');
       dbg('OTP Engine v3.1 started: ' + (isZomato ? 'Zomato' : isSwiggy ? 'Swiggy' : host));

       // ================================================================
       // SELECTORS
       // ================================================================

        function findLoginHeaderButton() {
            // Try exact text match first (fastest)
            var all = Array.from(document.querySelectorAll('a, button, [role="button"], span, p, li, div'));
            var exact = all.find(function(el) {
                var t = (el.textContent || '').trim().toLowerCase();
                return (t === 'log in' || t === 'login' || t === 'sign in' || t === 'signin') && t.length <= 12;
            });
            if (exact) return exact;

            // Partial text match fallback (for buttons with icon + text)
            var partial = all.find(function(el) {
                var t = (el.textContent || '').trim().toLowerCase();
                // Swiggy sometimes has icon glyphs before text, so use includes
                return (t.includes('sign in') || t.includes('log in') || t.includes('login')) && t.length <= 30;
            });
            return partial || null;
        }

        function findPhoneInput() {
            // Priority order — most specific to most generic
            var candidates = [
                // Swiggy uses inputmode=numeric with type=text (NOT type=tel!)
                'input[inputmode="numeric"]:not([maxlength="1"])',
                'input[inputmode="decimal"]:not([maxlength="1"])',
                // Standard tel type
                'input[type="tel"]:not([maxlength="1"])',
                // Name-based (very reliable)
                'input[name="mobile"]',
                'input[name="phone"]',
                'input[name="mobileNumber"]',
                'input[name="phoneNumber"]',
                'input[name="number"]',
                // Placeholder-based
                'input[placeholder*="mobile" i]',
                'input[placeholder*="phone" i]',
                'input[placeholder*="10 digit" i]',
                'input[placeholder*="enter mobile" i]',
                'input[placeholder*="enter your mobile" i]',
                // maxlength=10 (phone numbers are 10 digits)
                'input[maxlength="10"]',
                'input[maxlength="11"]'
            ];
            for (var i = 0; i < candidates.length; i++) {
                var el = document.querySelector(candidates[i]);
                if (el && el.offsetParent !== null) return el; // must be visible
            }
            return null;
        }

       function findSendOtpButton() {
           var btn = null;
           var allBtns = Array.from(document.querySelectorAll('button'));

           // Text match — works for both Swiggy and Zomato
           btn = allBtns.find(function(el) {
               if (el.disabled) return false;
               var t = (el.textContent || '').trim().toLowerCase();
               return t === 'continue' || t === 'send otp' || t === 'get otp' || t === 'request otp' || t === 'next';
           });

           // Swiggy: orange button fallback
           if (!btn && isSwiggy) {
               allBtns.forEach(function(el) {
                   if (btn || el.disabled) return;
                   var bg = window.getComputedStyle(el).backgroundColor;
                   if (bg === 'rgb(252, 128, 25)' || bg === 'rgb(255, 102, 0)' || bg === 'rgb(252, 116, 8)') btn = el;
               });
           }

           // Zomato: red button fallback
           if (!btn && isZomato) {
               allBtns.forEach(function(el) {
                   if (btn || el.disabled) return;
                   var bg = window.getComputedStyle(el).backgroundColor;
                   if (bg === 'rgb(239, 79, 95)' || bg === 'rgb(226, 55, 68)') btn = el;
               });
           }

           return btn || null;
       }

       function findOtpInputs() {
           // Swiggy: 4 single-digit boxes with maxlength="1"
           var single = Array.from(document.querySelectorAll('input[maxlength="1"]'));
           if (single.length >= 4) return single;

           // Zomato: 6 digit boxes
           var numeric = Array.from(document.querySelectorAll('input[type="number"][maxlength="1"], input[inputmode="numeric"][maxlength="1"]'));
           if (numeric.length >= 4) return numeric;

           // one-time-code attribute
           var otc = Array.from(document.querySelectorAll('input[autocomplete="one-time-code"]'));
           if (otc.length >= 1) return otc;

           // Single OTP field
           var single2 = document.querySelector('input[name*="otp" i], input[name*="code" i], input[placeholder*="otp" i]');
           if (single2) return [single2];

           return null;
       }

       function findVerifyButton() {
           var allBtns = Array.from(document.querySelectorAll('button'));

           var btn = allBtns.find(function(el) {
               if (el.disabled) return false;
               var t = (el.textContent || '').trim().toLowerCase();
               return t === 'verify' || t === 'submit' || t === 'confirm' || t === 'proceed' || t === 'continue';
           });

           if (!btn && isSwiggy) {
               allBtns.forEach(function(el) {
                   if (btn || el.disabled) return;
                   var bg = window.getComputedStyle(el).backgroundColor;
                   if (bg === 'rgb(252, 128, 25)' || bg === 'rgb(255, 102, 0)') btn = el;
               });
           }

           if (!btn && isZomato) {
               allBtns.forEach(function(el) {
                   if (btn || el.disabled) return;
                   var bg = window.getComputedStyle(el).backgroundColor;
                   if (bg === 'rgb(239, 79, 95)' || bg === 'rgb(226, 55, 68)') btn = el;
               });
           }

           return btn || null;
       }

       // ================================================================
       // PHONE FLOW — PARALLEL (login click + phone wait run together)
       // ================================================================
       function handlePhone(phoneValue) {
           dbg('handlePhone: start phone=' + phoneValue);

           // TRACK: stop duplicate execution
           if (window.__PHONE_DONE) { dbg('handlePhone: already done, skip'); return; }

           // ── Step 1: Click login button repeatedly at 150ms ──────────
           // (keeps clicking until phone modal opens, then stops)
           var loginBtnClicked = false;
           var loginPoll = setInterval(function() {
               var btn = findLoginHeaderButton();
               if (btn) {
                   if (!loginBtnClicked) {
                       dbg('handlePhone: login btn found, clicking...');
                       loginBtnClicked = true;
                   }
                   clickElement(btn); // click every 150ms until modal opens
               }
           }, 150);

           // Stop after 8s (page is definitely loaded by then)
           setTimeout(function() {
               clearInterval(loginPoll);
               if (!loginBtnClicked) dbg('handlePhone: WARN - login btn not found in 8s!');
           }, 8000);

           // ── Step 2: Simultaneously watch for phone input ─────────────
           // MutationObserver fires the INSTANT phone input appears in DOM
           waitForElement(
               findPhoneInput,
               function(phoneInput) {
                   clearInterval(loginPoll); // stop clicking login btn
                   dbg('handlePhone: phone input appeared! typing...');
                   simulateType(phoneInput, phoneValue);
                   window.__PHONE_DONE = true;

                   // ── Step 3: Poll for Send OTP button at 50ms ─────────
                   pollUntil(
                       findSendOtpButton,
                       function(sendBtn) {
                           dbg('handlePhone: Send OTP btn found! clicking...');
                           clickElement(sendBtn);
                           window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'OTP_REQUESTED' }));
                           dbg('handlePhone: OTP_REQUESTED sent!');
                       },
                       80, // 80 x 50ms = 4 seconds max
                       function() { dbg('handlePhone: WARN - Send OTP btn not found in 4s!'); }
                   );
               },
               10000 // wait up to 10s for phone modal
           );
       }

       // ================================================================
       // OTP FLOW
       // ================================================================
       function handleOtp(otpValue) {
           dbg('handleOtp: start otp=' + otpValue);
           window.__OTP_SUBMITTED = true;

           waitForElement(
               findOtpInputs,
               function(inputs) {
                   dbg('handleOtp: OTP inputs found (' + inputs.length + ' boxes), filling...');
                   if (inputs.length > 1) {
                       fillOtpBoxes(inputs, otpValue);
                   } else {
                       simulateType(inputs[0], otpValue);
                   }
                   dbg('handleOtp: OTP filled, finding Verify btn...');

                   pollUntil(
                       findVerifyButton,
                       function(verifyBtn) {
                           dbg('handleOtp: Verify btn found, clicking!');
                           setTimeout(function() { clickElement(verifyBtn); }, 30);
                       },
                       80,
                       function() { dbg('handleOtp: WARN - Verify btn not found!'); }
                   );
               },
               12000
           );
       }

       // ── Listen for NATIVE_ACTION commands ───────────────────────────
       window.addEventListener('NATIVE_ACTION', function(e) {
           try {
               var action = e.detail;
               if (action.type === 'PHONE') handlePhone(action.value);
               if (action.type === 'OTP')   handleOtp(action.value);
           } catch (err) {
               window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ERROR', message: err.message }));
           }
       });

       // ── Network interceptor: detect auth success via API ────────────
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

       // ── DOM polling: fallback success detection ─────────────────────
       var prevUrl = window.location.href;
       setInterval(function() {
           if (!document.body) return;
           if (window.location.href !== prevUrl) {
               prevUrl = window.location.href;
               if (window.__OTP_SUBMITTED) { sendSuccess(); return; }
           }
           var hasProfile = document.querySelector('a[href*="profile"], a[href*="account"], a[href*="orders"]');
           var body = (document.body.textContent || '').toLowerCase();
           if ((hasProfile || body.includes('logout') || body.includes('sign out')) && window.__OTP_SUBMITTED) {
               sendSuccess(); return;
           }
           if (window.__OTP_SUBMITTED) {
               var remaining = document.querySelectorAll('input[maxlength="1"], input[autocomplete="one-time-code"]');
               if (remaining.length === 0) { sendSuccess(); }
           }
       }, 200);

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
                   console.log('[' + providerId + '] ' + data.message);
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
