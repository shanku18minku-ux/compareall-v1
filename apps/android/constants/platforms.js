// Platform configurations for CompareAll
export const PLATFORMS = [
  {
    id: 'zomato',
    name: 'Zomato',
    category: 'food',
    color: '#E23744',
    icon: '🍕',
    loginUrl: 'https://www.zomato.com/login',
    searchUrl: (query) => `https://www.zomato.com/search?q=${encodeURIComponent(query)}`,
    checkLoggedIn: `
      (function() {
        const profileEl = document.querySelector('[class*="user-avatar"]') || 
                          document.querySelector('[class*="profileImage"]') ||
                          document.querySelector('a[href*="/profile"]');
        return !!profileEl;
      })()
    `,
    extractData: `
      (function() {
        const results = [];
        const cards = document.querySelectorAll('[class*="result-list"] a, [class*="search-result"] a');
        cards.forEach((card, idx) => {
          if (idx > 15) return;
          try {
            const text = card.textContent || '';
            const priceMatch = text.match(/₹\\s*(\\d+)|for two.*?₹\\s*(\\d+)/i);
            const ratingMatch = text.match(/([1-5]\\.[0-9])/);
            const etaMatch = text.match(/(\\d+)[-–](\\d+)\\s*min/i);
            const nameEl = card.querySelector('h3, h4, [class*="name"], [class*="title"]');
            const imgEl = card.querySelector('img');
            const name = nameEl ? nameEl.textContent.trim() : text.substring(0, 40).trim();
            if (!priceMatch || !name || name.length < 3) return;
            const price = parseInt(priceMatch[1] || priceMatch[2], 10);
            if (isNaN(price) || price < 20) return;
            results.push({
              id: 'zmt-' + Math.random().toString(36).substr(2, 9),
              title: name.substring(0, 80),
              price: { basePrice: price, finalPayablePrice: price, currency: 'INR' },
              originalPrice: price,
              imageUrl: imgEl ? imgEl.src : null,
              url: card.href || 'https://zomato.com',
              deepLinkUrl: card.href || 'https://zomato.com',
              providerId: 'zomato',
              providerName: 'Zomato',
              category: 'food',
              rating: ratingMatch ? parseFloat(ratingMatch[1]) : null,
              estimatedTimeMins: etaMatch ? etaMatch[1] + '-' + etaMatch[2] : null,
              isAvailable: true,
              status: 'LIVE'
            });
          } catch(e) {}
        });
        return JSON.stringify(results);
      })()
    `
  },
  {
    id: 'swiggy',
    name: 'Swiggy',
    category: 'food',
    color: '#FC8019',
    icon: '🛵',
    loginUrl: 'https://www.swiggy.com',
    searchUrl: (query) => `https://www.swiggy.com/search?query=${encodeURIComponent(query)}`,
    checkLoggedIn: `
      (function() {
        const userEl = document.querySelector('[class*="user"]') ||
                       document.querySelector('[href*="my-account"]');
        return !!userEl;
      })()
    `,
    extractData: `
      (function() {
        const results = [];
        const links = document.querySelectorAll('a[href*="/restaurants/"]');
        links.forEach((a, idx) => {
          if (idx > 15) return;
          try {
            const text = a.textContent || '';
            const priceMatch = text.match(/₹\\s*(\\d+)/);
            const ratingMatch = text.match(/([1-5]\\.[0-9])/);
            const etaMatch = text.match(/(\\d+)[-–](\\d+)\\s*min/i);
            const nameEl = a.querySelector('h3, h4, p');
            const imgEl = a.querySelector('img');
            const name = nameEl ? nameEl.textContent.trim() : text.substring(0,40).trim();
            if (!priceMatch || !name || name.length < 3) return;
            const price = parseInt(priceMatch[1], 10);
            if (isNaN(price) || price < 20) return;
            results.push({
              id: 'swg-' + Math.random().toString(36).substr(2, 9),
              title: name.substring(0, 80),
              price: { basePrice: price, finalPayablePrice: price, currency: 'INR' },
              originalPrice: price,
              imageUrl: imgEl ? imgEl.src : null,
              url: a.href || 'https://swiggy.com',
              deepLinkUrl: a.href || 'https://swiggy.com',
              providerId: 'swiggy',
              providerName: 'Swiggy',
              category: 'food',
              rating: ratingMatch ? parseFloat(ratingMatch[1]) : null,
              estimatedTimeMins: etaMatch ? etaMatch[1] + '-' + etaMatch[2] : null,
              isAvailable: true,
              status: 'LIVE'
            });
          } catch(e) {}
        });
        return JSON.stringify(results);
      })()
    `
  },
  {
    id: 'amazon',
    name: 'Amazon',
    category: 'electronics',
    color: '#FF9900',
    icon: '📦',
    loginUrl: 'https://www.amazon.in/ap/signin',
    searchUrl: (query) => `https://www.amazon.in/s?k=${encodeURIComponent(query)}`,
    checkLoggedIn: `
      (function() {
        const greet = document.querySelector('#nav-link-accountList-nav-line-1');
        return greet ? !greet.textContent.includes('Sign in') : false;
      })()
    `,
    extractData: `
      (function() {
        const results = [];
        const items = document.querySelectorAll('[data-component-type="s-search-result"]');
        items.forEach((item, idx) => {
          if (idx > 10) return;
          try {
            const titleEl = item.querySelector('h2 a span, h2 span');
            const priceWhole = item.querySelector('.a-price-whole');
            const imgEl = item.querySelector('img.s-image');
            const linkEl = item.querySelector('h2 a');
            const ratingEl = item.querySelector('.a-icon-star-small');
            if (!titleEl || !priceWhole) return;
            const title = titleEl.textContent.trim();
            const priceStr = priceWhole.textContent.replace(/[^0-9]/g, '');
            const price = parseInt(priceStr, 10);
            if (isNaN(price) || price < 10) return;
            const ratingMatch = ratingEl ? ratingEl.textContent.match(/([1-5]\\.[0-9])/) : null;
            const href = linkEl ? 'https://www.amazon.in' + linkEl.getAttribute('href') : 'https://amazon.in';
            results.push({
              id: 'amz-' + Math.random().toString(36).substr(2, 9),
              title: title.substring(0, 100),
              price: { basePrice: price, finalPayablePrice: price, currency: 'INR' },
              originalPrice: price,
              imageUrl: imgEl ? imgEl.src : null,
              url: href,
              deepLinkUrl: href,
              providerId: 'amazon',
              providerName: 'Amazon',
              category: 'electronics',
              rating: ratingMatch ? parseFloat(ratingMatch[1]) : null,
              isAvailable: true,
              status: 'LIVE'
            });
          } catch(e) {}
        });
        return JSON.stringify(results);
      })()
    `
  },
  {
    id: 'flipkart',
    name: 'Flipkart',
    category: 'electronics',
    color: '#2874F0',
    icon: '🛒',
    loginUrl: 'https://www.flipkart.com/account/login',
    searchUrl: (query) => `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`,
    checkLoggedIn: `
      (function() {
        const loginBtn = document.querySelector('a[href*="login"]');
        const profileBtn = document.querySelector('a[href*="account"]');
        return !!profileBtn && !loginBtn;
      })()
    `,
    extractData: `
      (function() {
        const results = [];
        const items = document.querySelectorAll('div[data-id]');
        items.forEach((item, idx) => {
          if (idx > 10) return;
          try {
            const titleEl = item.querySelector('a[title], div[class*="KzDlHZ"], span[class*="WKTcLC"]');
            const priceEl = item.querySelector('div[class*="Nx9bqj"], div[class*="lK6BTP"]');
            const imgEl = item.querySelector('img');
            const linkEl = item.querySelector('a[href*="/p/"]');
            if (!titleEl || !priceEl) return;
            const title = titleEl.getAttribute('title') || titleEl.textContent.trim();
            const priceStr = priceEl.textContent.replace(/[^0-9]/g, '');
            const price = parseInt(priceStr, 10);
            if (isNaN(price) || price < 10) return;
            const href = linkEl ? 'https://www.flipkart.com' + linkEl.getAttribute('href') : 'https://flipkart.com';
            results.push({
              id: 'fk-' + Math.random().toString(36).substr(2, 9),
              title: title.substring(0, 100),
              price: { basePrice: price, finalPayablePrice: price, currency: 'INR' },
              originalPrice: price,
              imageUrl: imgEl ? imgEl.src : null,
              url: href,
              deepLinkUrl: href,
              providerId: 'flipkart',
              providerName: 'Flipkart',
              category: 'electronics',
              rating: null,
              isAvailable: true,
              status: 'LIVE'
            });
          } catch(e) {}
        });
        return JSON.stringify(results);
      })()
    `
  },
  {
    id: 'ola',
    name: 'Ola',
    category: 'cab',
    color: '#1EC455',
    icon: '🚖',
    loginUrl: 'https://book.olacabs.com',
    searchUrl: (query) => `https://book.olacabs.com`,
    checkLoggedIn: `(function() { return document.cookie.includes('logged_in') || !!document.querySelector('[class*="profile"]'); })()`,
    extractData: `(function() { return JSON.stringify([]); })()`
  },
  {
    id: 'uber',
    name: 'Uber',
    category: 'cab',
    color: '#000000',
    icon: '🚗',
    loginUrl: 'https://auth.uber.com/v2/',
    searchUrl: (query) => `https://m.uber.com`,
    checkLoggedIn: `(function() { return !!document.querySelector('[data-testid="trip-planner"]'); })()`,
    extractData: `(function() { return JSON.stringify([]); })()`
  }
];

export const CATEGORIES = [
  { id: 'all', label: 'All', icon: '🔍' },
  { id: 'food', label: 'Food', icon: '🍕' },
  { id: 'electronics', label: 'Electronics', icon: '📱' },
  { id: 'cab', label: 'Cab', icon: '🚖' },
];

export const API_URL = 'https://compareall-v1.onrender.com';
