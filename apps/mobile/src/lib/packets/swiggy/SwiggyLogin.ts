export const getSwiggyLoginScript = () => `
(function() {
    // 150ms parallel fast-polling engine
    // NO LOGGING OF SECRETS. NO STORING OF OTPS.
    var __ca_active = false;
    var __ca_observer = null;

    function safePost(msg) {
        try { window.ReactNativeWebView.postMessage(JSON.stringify(msg)); } catch(e) {}
    }

    function fastPoll(selector, callback) {
        var el = document.querySelector(selector);
        if (el) { callback(el); return; }
        
        var interval = setInterval(function() {
            var found = document.querySelector(selector);
            if (found) {
                clearInterval(interval);
                callback(found);
            }
        }, 150);
    }

    function simulateType(element, text) {
        element.focus();
        element.value = text;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new Event('blur', { bubbles: true }));
    }

    function startSwiggyFlow(phone) {
        if (__ca_active) return;
        __ca_active = true;

        var loginBtnSelector = "div[class*='user'] span:contains('Sign In'), div[class*='user'] span:contains('Login'), header div:contains('Sign In'), .global-nav div:contains('Sign In')";
        var foundBtn = null;
        
        // Find login button using text content as Swiggy classes change
        var spans = document.querySelectorAll('span, div');
        for (var i=0; i<spans.length; i++) {
            if (spans[i].textContent.trim() === 'Sign In' || spans[i].textContent.trim() === 'Login') {
                foundBtn = spans[i];
                break;
            }
        }

        if (foundBtn) {
            foundBtn.click();
        } else {
            // Fallback: try clicking header auth icon
            var authIcon = document.querySelector('header svg[viewBox="0 0 14 16"], header svg[class*="icon"]');
            if (authIcon) authIcon.parentElement.click();
        }

        // Fast poll for the phone input modal (Swiggy uses inputmode="numeric")
        fastPoll('input[inputmode="numeric"], input[type="tel"]', function(inputEl) {
            simulateType(inputEl, phone);
            
            // Wait a tiny bit for React to enable the continue button
            setTimeout(function() {
                var loginBtn = document.querySelector('.a-ayg'); // Generic login button class
                if (!loginBtn) {
                    var btns = document.querySelectorAll('a, button');
                    for (var i=0; i<btns.length; i++) {
                        if (btns[i].textContent.toUpperCase() === 'LOGIN' || btns[i].textContent.toUpperCase() === 'CONTINUE') {
                            loginBtn = btns[i]; break;
                        }
                    }
                }
                if (loginBtn) {
                    loginBtn.click();
                    safePost({ type: 'OTP_REQUESTED' });
                }
            }, 150);
        });
    }

    function submitSwiggyOtp(otp) {
        fastPoll('input[type="text"][maxlength="1"], input[id="otp"]', function(firstInput) {
            var inputs = document.querySelectorAll('input[type="text"][maxlength="1"]');
            if (inputs.length > 0) {
                // Swiggy React Native / Web OTP boxes (usually 6)
                for (var i = 0; i < inputs.length && i < otp.length; i++) {
                    simulateType(inputs[i], otp[i]);
                }
            } else {
                // Fallback single input
                simulateType(firstInput, otp);
            }
            
            setTimeout(function() {
                var verifyBtn = document.querySelector('a.a-ayg, button:contains("VERIFY")');
                if (!verifyBtn) {
                    var btns = document.querySelectorAll('a, button');
                    for(var j=0; j<btns.length; j++){
                        if(btns[j].textContent.toUpperCase().indexOf('VERIFY') !== -1) { verifyBtn = btns[j]; break; }
                    }
                }
                if (verifyBtn) verifyBtn.click();
            }, 150);
            
            // Clear OTP from memory immediately
            otp = null;
        });
    }

    // Monitor for success (URL changes or user menu appears)
    __ca_observer = new MutationObserver(function() {
        var userSpan = document.querySelector('span.global-nav__name');
        if (userSpan && userSpan.textContent.trim() !== 'Sign In') {
            safePost({ type: 'SUCCESS' });
            __ca_observer.disconnect();
        }
    });
    __ca_observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('NATIVE_ACTION', function(e) {
        try {
            var action = e.detail;
            if (action.type === 'PHONE') {
                startSwiggyFlow(action.value);
            } else if (action.type === 'OTP') {
                submitSwiggyOtp(action.value);
            } else if (action.type === 'CHECK_SESSION') {
                var userSpan = document.querySelector('span.global-nav__name');
                if (userSpan && userSpan.textContent.trim() !== 'Sign In') {
                    safePost({ type: 'SESSION_ACTIVE' });
                } else {
                    safePost({ type: 'SESSION_INACTIVE' });
                }
            }
        } catch (err) {
            safePost({ type: 'ERROR', message: err.message });
        }
    });
})();
true;
`;
