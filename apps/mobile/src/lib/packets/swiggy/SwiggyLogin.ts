export const getSwiggyLoginScript = () => `
(function() {
    var __ca_active = false;
    var __ca_observer = null;

    function safePost(msg) {
        try { window.ReactNativeWebView.postMessage(JSON.stringify(msg)); } catch(e) {}
    }

    // Find element by multiple selector strategies - picks first that works
    function findEl(selectors) {
        for (var i = 0; i < selectors.length; i++) {
            try {
                var el = document.querySelector(selectors[i]);
                if (el) return el;
            } catch(e) {}
        }
        return null;
    }

    // Find element by text content scan
    function findByText(tags, texts) {
        var allEls = document.querySelectorAll(tags.join(','));
        for (var i = 0; i < allEls.length; i++) {
            var txt = allEls[i].textContent.trim().toUpperCase();
            for (var j = 0; j < texts.length; j++) {
                if (txt === texts[j].toUpperCase()) return allEls[i];
            }
        }
        return null;
    }

    // Fast poll with timeout
    function fastPoll(findFn, callback, timeoutMs) {
        var result = findFn();
        if (result) { callback(result); return; }

        var elapsed = 0;
        var interval = setInterval(function() {
            elapsed += 150;
            var found = findFn();
            if (found) {
                clearInterval(interval);
                callback(found);
            } else if (elapsed > (timeoutMs || 10000)) {
                clearInterval(interval);
                safePost({ type: 'ERROR', message: 'Element not found after timeout' });
            }
        }, 150);
    }

    // Simulate typing - handles both React synthetic and native events
    function simulateType(element, text) {
        element.focus();

        // Set value via native input value setter (works with React)
        var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        if (nativeInputValueSetter) {
            nativeInputValueSetter.call(element, text);
        } else {
            element.value = text;
        }

        // Fire all necessary events for React to pick up the change
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: text.slice(-1) }));
        element.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: text.slice(-1) }));
    }

    // ─── STEP 1: Open Swiggy Login Modal ─────────────────────────────────────
    function openLoginModal() {
        // Strategy 1: Look for Sign In / Login button in header
        var btn = findByText(['span', 'div', 'button', 'a'], ['Sign In', 'Login', 'Sign in', 'LOG IN']);
        if (btn) {
            btn.click();
            return true;
        }

        // Strategy 2: Look for user icon in header
        var headerIcon = findEl([
            'header [class*="user"]',
            'header [class*="login"]',
            'header [class*="signin"]',
            'nav [class*="user"]',
            '[data-testid="login-btn"]',
            '[aria-label="Login"]',
            '[aria-label="Sign In"]'
        ]);
        if (headerIcon) {
            headerIcon.click();
            return true;
        }

        return false;
    }

    // ─── STEP 2: Fill Phone Number ────────────────────────────────────────────
    function fillPhone(phone) {
        function findPhoneInput() {
            return findEl([
                'input[type="tel"]',
                'input[inputmode="numeric"][placeholder*="mobile"]',
                'input[inputmode="numeric"][placeholder*="Mobile"]',
                'input[inputmode="numeric"][placeholder*="phone"]',
                'input[inputmode="numeric"][placeholder*="number"]',
                'input[placeholder*="mobile" i]',
                'input[placeholder*="phone" i]',
                'input[placeholder*="Enter mobile"]',
                'input[placeholder*="mobile number"]',
                'input[placeholder*="10-digit"]',
                'input[maxlength="10"]',
                'input[inputmode="numeric"]'
            ]);
        }

        fastPoll(findPhoneInput, function(input) {
            simulateType(input, phone);

            // Wait 300ms for React to process then find+click Continue
            setTimeout(function() {
                var continueBtn = findByText(
                    ['button', 'a', 'div[role="button"]', 'span'],
                    ['Continue', 'GET OTP', 'Get OTP', 'SEND OTP', 'Send OTP', 'LOGIN', 'Login', 'NEXT', 'Next']
                );

                if (!continueBtn) {
                    continueBtn = findEl([
                        'button[type="submit"]',
                        '[data-testid="continue-btn"]',
                        '[data-testid="login-submit"]',
                        'button[class*="submit"]',
                        'button[class*="continue"]',
                        'button[class*="login"]',
                        'form button:last-child'
                    ]);
                }

                if (continueBtn) {
                    continueBtn.click();
                    safePost({ type: 'OTP_REQUESTED' });
                } else {
                    // Last resort: simulate Enter key on the input
                    input.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter', keyCode: 13, bubbles: true }));
                    safePost({ type: 'OTP_REQUESTED' });
                }
            }, 300);
        }, 10000);
    }

    // ─── STEP 3: Submit OTP ───────────────────────────────────────────────────
    function submitOtp(otp) {
        // Strategy A: Multiple single-char boxes (most common - 6 digit)
        function findOtpBoxes() {
            var boxes = document.querySelectorAll(
                'input[maxlength="1"], input[type="tel"][maxlength="1"], input[type="number"][maxlength="1"], input[type="text"][maxlength="1"]'
            );
            if (boxes.length >= 4) return boxes;
            return null;
        }

        // Strategy B: Single OTP input
        function findSingleOtpInput() {
            return findEl([
                'input[name="otp"]',
                'input[id="otp"]',
                'input[placeholder*="OTP" i]',
                'input[placeholder*="verification" i]',
                'input[placeholder*="code" i]',
                'input[aria-label*="OTP" i]',
                'input[aria-label*="verification" i]',
                'input[inputmode="numeric"][maxlength="6"]',
                'input[inputmode="numeric"][maxlength="4"]'
            ]);
        }

        fastPoll(function() {
            return findOtpBoxes() || findSingleOtpInput();
        }, function(result) {
            if (result.length >= 4) {
                // Multi-box OTP
                var boxes = result;
                for (var i = 0; i < boxes.length && i < otp.length; i++) {
                    simulateType(boxes[i], otp[i]);
                    // Move focus to next
                    if (i < boxes.length - 1) boxes[i].dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
                }
            } else {
                // Single input
                simulateType(result, otp);
            }

            // Clear OTP from memory immediately
            otp = null;

            // Wait then click Verify
            setTimeout(function() {
                var verifyBtn = findByText(
                    ['button', 'a', 'div[role="button"]', 'span'],
                    ['Verify', 'VERIFY', 'Submit', 'SUBMIT', 'Confirm', 'CONFIRM', 'Done', 'DONE']
                );

                if (!verifyBtn) {
                    verifyBtn = findEl([
                        'button[type="submit"]',
                        '[data-testid="verify-btn"]',
                        '[data-testid="otp-submit"]',
                        'button[class*="verify"]',
                        'button[class*="submit"]',
                        'form button:last-child'
                    ]);
                }

                if (verifyBtn) {
                    verifyBtn.click();
                } else {
                    // Simulate Enter on last OTP box
                    var boxes = document.querySelectorAll('input[maxlength="1"]');
                    if (boxes.length > 0) {
                        boxes[boxes.length - 1].dispatchEvent(
                            new KeyboardEvent('keypress', { key: 'Enter', keyCode: 13, bubbles: true })
                        );
                    }
                }
            }, 300);
        }, 10000);
    }

    // ─── SUCCESS DETECTION (3-layer) ─────────────────────────────────────────
    function checkIfLoggedIn() {
        // Layer 1: User name element visible
        var userEl = findEl([
            'span.global-nav__name',
            '[class*="user-name"]',
            '[class*="username"]',
            '[data-testid="user-name"]',
            'header [class*="profile"]'
        ]);
        if (userEl && userEl.textContent.trim() !== '' && userEl.textContent.trim() !== 'Sign In') {
            return true;
        }

        // Layer 2: Logout/Account nav items present
        var logoutEl = findByText(
            ['a', 'button', 'span', 'div'],
            ['Logout', 'Log out', 'Sign Out', 'My Account', 'My Orders', 'Profile']
        );
        if (logoutEl) return true;

        // Layer 3: Auth cookies set
        if (document.cookie.includes('tid=') ||
            document.cookie.includes('_session_tid') ||
            document.cookie.includes('sid=')) {
            return true;
        }

        return false;
    }

    // MutationObserver for instant detection
    __ca_observer = new MutationObserver(function() {
        if (checkIfLoggedIn()) {
            safePost({ type: 'SUCCESS' });
            __ca_observer.disconnect();
            clearInterval(successPoller);
        }
    });
    __ca_observer.observe(document.body, { childList: true, subtree: true });

    // 1s fallback poller
    var successPoller = setInterval(function() {
        if (checkIfLoggedIn()) {
            safePost({ type: 'SUCCESS' });
            clearInterval(successPoller);
            if (__ca_observer) __ca_observer.disconnect();
        }
    }, 1000);

    // ─── NATIVE ACTION LISTENER ───────────────────────────────────────────────
    window.addEventListener('NATIVE_ACTION', function(e) {
        try {
            var action = e.detail;
            if (action.type === 'PHONE') {
                if (__ca_active) return;
                __ca_active = true;
                // First open modal, then fill phone
                var opened = openLoginModal();
                if (opened) {
                    setTimeout(function() { fillPhone(action.value); }, 600);
                } else {
                    // Maybe modal already open (page reload case)
                    fillPhone(action.value);
                }
            } else if (action.type === 'OTP') {
                submitOtp(action.value);
            } else if (action.type === 'CHECK_SESSION') {
                if (checkIfLoggedIn()) {
                    safePost({ type: 'SESSION_ACTIVE' });
                } else {
                    safePost({ type: 'SESSION_INACTIVE' });
                }
            }
        } catch (err) {
            safePost({ type: 'ERROR', message: err.message });
        }
    });

    // On load, check if already logged in
    if (document.readyState === 'complete') {
        if (checkIfLoggedIn()) safePost({ type: 'SESSION_ACTIVE' });
    } else {
        window.addEventListener('load', function() {
            if (checkIfLoggedIn()) safePost({ type: 'SESSION_ACTIVE' });
        });
    }
})();
true;
`;
