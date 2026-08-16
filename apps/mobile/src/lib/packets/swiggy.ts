import { ProviderPacket, ProviderMetadata } from './types';

export const swiggyMetadata: ProviderMetadata = {
    id: 'food-a',
    category: 'Food',
    subcategory: 'Food Delivery',
    name: 'Swiggy',
    icon: '🍔',
    authType: 'otp',
    url: 'https://www.swiggy.com',
    loginUrl: 'https://www.swiggy.com/auth',
    desc: 'Account-specific menu and cart pricing is available.',
    regions: ['all']
};

export const SwiggyPacket: ProviderPacket = {
    metadata: swiggyMetadata,

    // When the user logs in on /auth, Swiggy automatically redirects to the home page or /restaurants
    successUrlPattern: /^https?:\/\/(www\.)?swiggy\.com\/(?!auth)/,

    // Backup DOM-based detection: runs on every page load inside the WebView.
    // Checks for UI elements only visible to logged-in users.
    getLoginDetectionScript: () => `
        (function() {
            var checkInterval = setInterval(function() {
                var logoutIndicators = [
                    // Swiggy shows "My Account" or a profile icon when logged in
                    document.querySelector('[class*="userAccount"]'),
                    document.querySelector('[data-testid="profile"]'),
                    document.querySelector('[href*="/account"]'),
                    document.querySelector('[href*="/my-account"]'),
                    Array.from(document.querySelectorAll('a, span, div'))
                        .find(function(el) {
                            var txt = el.textContent.trim().toLowerCase();
                            return txt === 'logout' || txt === 'sign out' || txt === 'my account';
                        })
                ].filter(Boolean);

                if (logoutIndicators.length > 0) {
                    clearInterval(checkInterval);
                    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SUCCESS' }));
                }
            }, 1000); // Check every second
        })();
        true;
    `,

    // ── Extractor (for search results) ─────────────────────────────────────
    getExtractorInjection: (searchUrl: string) => `
        (function() {
            try {
                if (window.location.href.indexOf(${JSON.stringify(searchUrl)}) === -1) {
                    window.location.href = ${JSON.stringify(searchUrl)};
                    return;
                }
                setTimeout(function() {
                    var data = { providerId: 'food-a', status: 'success', items: [] };
                    var cards = document.querySelectorAll('[data-testid="normal-dish-item"]');
                    cards.forEach(function(card, i) {
                        if (i >= 10) return;
                        var nameEl = card.querySelector('h3');
                        var priceEl = card.querySelector('.rupee');
                        if (nameEl && priceEl) {
                            var price = parseFloat(priceEl.textContent.replace(/[^0-9.]/g, ''));
                            data.items.push({ id: 'swiggy-' + i, title: nameEl.textContent, price: price, originalPrice: price, category: 'food' });
                        }
                    });
                    window.ReactNativeWebView.postMessage(JSON.stringify({ success: true, data: data }));
                }, 3000);
            } catch(err) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ success: false, error: err.message }));
            }
        })();
        true;
    `,

    getSearchUrl: (query: string) => `https://www.swiggy.com/search?resmenu=${encodeURIComponent(query)}`
};
