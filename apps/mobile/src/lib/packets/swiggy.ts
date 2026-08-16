import { ProviderPacket, ProviderMetadata } from './types';

export const swiggyMetadata: ProviderMetadata = {
    id: 'food-a',
    category: 'Food',
    subcategory: 'Food Delivery',
    name: 'Swiggy',
    icon: '🍔',
    authType: 'otp',
    url: 'https://www.swiggy.com',
    loginUrl: 'https://www.swiggy.com',
    desc: 'Account-specific menu and cart pricing is available.',
    regions: ['all']
};

export const SwiggyPacket: ProviderPacket = {
    metadata: swiggyMetadata,
    
    getLoginInjection: () => `
        (function() {
            var phoneReady = false;   // true when phone input is already visible
            var pendingPhone = null;  // phone number queued before form was ready
            var pendingOtp = null;    // otp queued before otp inputs appeared

            // ── Helpers ─────────────────────────────────────────────────────
            function simulateType(el, text) {
                try {
                    var setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                    setter.call(el, text);
                } catch(e) { el.value = text; }
                el.dispatchEvent(new Event('input',  { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
                el.dispatchEvent(new Event('blur',   { bubbles: true }));
            }

            function poll(fn, cb, ms, max) {
                var n = 0;
                var t = setInterval(function() {
                    var el = fn();
                    if (el) { clearInterval(t); cb(el); }
                    else if (++n >= max) clearInterval(t);
                }, ms);
            }

            function findLoginBtn() {
                return Array.from(document.querySelectorAll('span,button,a'))
                    .find(function(el) {
                        var txt = el.textContent.trim();
                        return (txt === 'Login' || txt === 'Sign in' || txt === 'Sign In') && el.offsetParent !== null;
                    });
            }

            function findPhoneInput() {
                return document.querySelector('input[type="tel"], input[inputmode="numeric"]');
            }

            function findContinueBtn() {
                return Array.from(document.querySelectorAll('button,span,a'))
                    .find(function(el) {
                        return el.textContent.match(/Continue|Get OTP|Next/i)
                            && !el.disabled
                            && el.offsetParent !== null;
                    });
            }

            // ── STEP 1: PRE-WARM ─────────────────────────────────────────────
            // On page load, immediately click Login so phone input appears BEFORE
            // the user has even typed anything. This eliminates ~2s of cold delay.
            function preWarm() {
                poll(findLoginBtn, function(btn) {
                    btn.click();
                    poll(findPhoneInput, function() {
                        phoneReady = true;
                        // If user already typed their number, fire it now
                        if (pendingPhone) {
                            doPhoneSubmit(pendingPhone);
                            pendingPhone = null;
                        }
                    }, 80, 60);
                }, 80, 80);
            }

            // ── STEP 2: PHONE SUBMIT ─────────────────────────────────────────
            function doPhoneSubmit(phone) {
                poll(findPhoneInput, function(input) {
                    simulateType(input, phone);
                    setTimeout(function() {
                        poll(findContinueBtn, function(btn) {
                            btn.click();
                            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'OTP_REQUESTED' }));
                        }, 80, 40);
                    }, 120); // Small delay for React to enable the button
                }, 80, 40);
            }

            // ── STEP 3: OTP SUBMIT ───────────────────────────────────────────
            function doOtpSubmit(otp) {
                poll(function() {
                    var inputs = document.querySelectorAll('input[type="tel"],input[inputmode="numeric"],input[type="text"]');
                    // Swiggy can have a single 4-digit field OR 4 separate 1-digit boxes
                    if (inputs.length >= 4) return inputs;
                    if (inputs.length === 1 && inputs[0] !== findPhoneInput()) return inputs;
                    return null;
                }, function(inputs) {
                    if (inputs.length === 1) {
                        // Single field (e.g. type="tel" accepting "1234")
                        simulateType(inputs[0], otp);
                    } else {
                        // Separate boxes
                        otp.split('').forEach(function(ch, i) {
                            if (inputs[i]) simulateType(inputs[i], ch);
                        });
                    }
                    setTimeout(function() {
                        poll(function() {
                            return Array.from(document.querySelectorAll('button,span'))
                                .find(function(el) {
                                    return el.textContent.match(/Verify|Submit|Confirm/i)
                                        && !el.disabled && el.offsetParent !== null;
                                });
                        }, function(btn) {
                            btn.click();
                            setTimeout(function() {
                                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SUCCESS' }));
                            }, 800);
                        }, 80, 40);
                    }, 100);
                }, 80, 60);
            }

            // ── Event Listener ───────────────────────────────────────────────
            window.addEventListener('NATIVE_ACTION', function(e) {
                try {
                    var action = e.detail;
                    if (action.type === 'PHONE') {
                        if (phoneReady) {
                            doPhoneSubmit(action.value);
                        } else {
                            pendingPhone = action.value; // queue until form is warm
                        }
                    } else if (action.type === 'OTP') {
                        doOtpSubmit(action.value);
                    }
                } catch(err) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ERROR', message: err.message }));
                }
            });

            // Kick off pre-warm immediately
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', preWarm);
            } else {
                preWarm();
            }
        })();
        true;
    `,

    getExtractorInjection: (searchUrl: string) => `

        // Basic extractor for Swiggy
        (function() {
            try {
                if (window.location.href !== "${searchUrl}") {
                    window.location.href = "${searchUrl}";
                    return;
                }

                setTimeout(() => {
                    const data = {
                        providerId: 'food-a',
                        status: 'success',
                        items: []
                    };
                    
                    const itemCards = document.querySelectorAll('[data-testid="normal-dish-item"]');
                    
                    itemCards.forEach((card, index) => {
                        if (index >= 10) return;
                        
                        const nameEl = card.querySelector('h3');
                        const priceEl = card.querySelector('.rupee');
                        
                        if (nameEl && priceEl) {
                            const name = nameEl.textContent;
                            const priceText = priceEl.textContent.replace(/[^0-9.]/g, '');
                            const price = parseFloat(priceText);
                            
                            data.items.push({
                                id: 'swiggy-' + index,
                                title: name,
                                price: price,
                                originalPrice: price,
                                category: 'food'
                            });
                        }
                    });

                    if (data.items.length > 0) {
                        window.ReactNativeWebView.postMessage(JSON.stringify({ success: true, data }));
                    } else {
                        // Retry logic or send empty
                        window.ReactNativeWebView.postMessage(JSON.stringify({ success: true, data }));
                    }
                }, 3000); // Wait for React to render

            } catch (err) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ success: false, error: err.message }));
            }
        })();
        true;
    `,

    getSearchUrl: (query: string) => `https://www.swiggy.com/search?resmenu=${encodeURIComponent(query)}`
};
