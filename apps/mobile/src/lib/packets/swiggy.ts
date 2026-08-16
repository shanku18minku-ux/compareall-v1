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
        let isAuthenticating = false;

        function simulateType(element, text) {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            nativeInputValueSetter.call(element, text);
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
            element.dispatchEvent(new Event('blur', { bubbles: true })); // Trigger React validation
        }

        function pollUntil(conditionFn, actionFn, interval = 100, maxAttempts = 50) {
            let attempts = 0;
            const timer = setInterval(() => {
                const el = conditionFn();
                if (el) {
                    clearInterval(timer);
                    actionFn(el);
                } else if (++attempts >= maxAttempts) {
                    clearInterval(timer);
                }
            }, interval);
        }

        function handlePhoneInput(phone) {
            // Find Login Button
            const loginBtn = Array.from(document.querySelectorAll('span, button, a'))
                .find(el => el.textContent.includes('Login') || el.textContent.includes('Sign In') || el.textContent.includes('Sign in'));
            
            if (loginBtn) {
                loginBtn.click();
            }

            // Wait for phone input
            pollUntil(
                () => document.querySelector('input[type="tel"], input[inputmode="numeric"]'),
                (phoneInput) => {
                    simulateType(phoneInput, phone);
                    
                    // Click continue
                    pollUntil(
                        () => Array.from(document.querySelectorAll('button, a, span'))
                            .find(el => el.textContent.match(/Continue|Get OTP|Login|Next/i) && !el.disabled && el.offsetParent !== null),
                        (btn) => {
                            btn.click();
                            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'OTP_REQUESTED' }));
                        }
                    );
                }
            );
        }

        function handleOtpInput(otp) {
            pollUntil(
                () => {
                    const inputs = document.querySelectorAll('input[type="tel"], input[inputmode="numeric"], input[type="text"]');
                    return inputs.length > 1 ? inputs : null; // Multiple inputs usually means OTP
                },
                (inputs) => {
                    const otpChars = otp.split('');
                    for (let i = 0; i < Math.min(inputs.length, otpChars.length); i++) {
                        simulateType(inputs[i], otpChars[i]);
                    }
                    
                    pollUntil(
                        () => Array.from(document.querySelectorAll('button, span'))
                            .find(el => el.textContent.match(/Verify|Submit|Confirm/i) && !el.disabled && el.offsetParent !== null),
                        (btn) => {
                            btn.click();
                            setTimeout(() => {
                                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SUCCESS' }));
                            }, 1000);
                        }
                    );
                }
            );
        }

        window.addEventListener('NATIVE_ACTION', function(e) {
            try {
                var action = e.detail;
                console.log('Action received:', action);
                
                if (action.type === 'PHONE') {
                    isAuthenticating = true;
                    handlePhoneInput(action.value);
                } else if (action.type === 'OTP') {
                    handleOtpInput(action.value);
                }
            } catch (err) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ERROR', message: err.message }));
            }
        });
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
