chrome.runtime.onMessage.addListener(handleMessages);

function handleMessages(message, sender, sendResponse) {
  if (message.target !== 'offscreen') {
    return false;
  }
  
  // ─── Amazon Parser ────────────────────────────────────────────────────────
  if (message.type === 'PARSE_AMAZON_HTML') {
    const doc = new DOMParser().parseFromString(message.html, "text/html");
    const results = [];
    
    const items = doc.querySelectorAll('div[data-component-type="s-search-result"], .s-result-item[data-asin]:not([data-asin=""])');
    
    items.forEach((item) => {
      try {
        const titleEl        = item.querySelector('h2 a span') || item.querySelector('h2 span');
        const priceWholeEl   = item.querySelector('.a-price-whole');
        const origPriceEl    = item.querySelector('.a-text-price span[aria-hidden="true"]');
        const imageEl        = item.querySelector('.s-image') || item.querySelector('img.s-image');
        const linkEl         = item.querySelector('h2 a');
        
        if (titleEl && priceWholeEl) {
          const title         = titleEl.textContent.trim();
          const priceRaw      = priceWholeEl.textContent.replace(/[,.\s]/g, '');
          const price         = parseInt(priceRaw, 10);
          const image         = imageEl ? imageEl.src : null;
          const linkHref      = linkEl ? linkEl.getAttribute('href') : null;
          const productUrl    = linkHref ? `https://www.amazon.in${linkHref}` : 'https://www.amazon.in';
          
          let originalPrice = price;
          if (origPriceEl) {
            const rawOrig = origPriceEl.textContent.replace(/[^\d]/g, '');
            if (rawOrig) originalPrice = parseInt(rawOrig, 10);
          }
          
          if (!isNaN(price) && price > 0) {
            results.push({
              id:           'amz-' + Math.random().toString(36).substr(2, 9),
              title:        title,
              price:        { basePrice: originalPrice, finalPayablePrice: price, currency: "INR" },
              originalPrice: originalPrice,
              imageUrl:     image,
              url:          productUrl,
              deepLinkUrl:  productUrl,
              providerId:   'amazon',
              providerName: 'Amazon',
              category:     'electronics',
              isAvailable:  true,
              status:       'AVAILABLE'
            });
          }
        }
      } catch(e) {
        console.error("Amazon parse item error:", e);
      }
    });
    
    sendResponse({ results });
    return true;
  }

  // ─── Flipkart Parser ──────────────────────────────────────────────────────
  if (message.type === 'PARSE_FLIPKART_HTML') {
    const doc = new DOMParser().parseFromString(message.html, "text/html");
    const results = [];
    
    // Flipkart uses different layouts for different categories
    // Try multiple container selectors
    const containers = doc.querySelectorAll(
      'div._1AtVbE, div._13oc-S, div._2kHMtA, div.CXW8mj, div.tUxRFH'
    );
    
    containers.forEach((item) => {
      try {
        // Title selectors (different for mobiles vs other products)
        const titleEl = 
          item.querySelector('div._4rR01T') ||
          item.querySelector('a.s1Q9rs') ||
          item.querySelector('a.IRpwTa') ||
          item.querySelector('div.KzDlHZ') ||
          item.querySelector('a.WKTcLC');
        
        // Current price
        const priceEl =
          item.querySelector('div._30jeq3') ||
          item.querySelector('div.Nx9bqj') ||
          item.querySelector('._1_WHN1');
        
        // Original/strikethrough price
        const origPriceEl =
          item.querySelector('div._3I9_wc') ||
          item.querySelector('div.yRaY8j') ||
          item.querySelector('._3auQ3N');
        
        // Image
        const imageEl = item.querySelector('img._396cs4') || item.querySelector('img.DByuf4');
        
        // Product link
        const linkEl = item.querySelector('a[href*="/p/"]') || item.querySelector('a._1fQZEK') || item.querySelector('a.CGtC98');
        
        if (titleEl && priceEl) {
          const title    = titleEl.textContent.trim();
          const priceRaw = priceEl.textContent.replace(/[₹,\s]/g, '');
          const price    = parseInt(priceRaw, 10);
          const image    = imageEl ? imageEl.src : null;
          const linkHref = linkEl ? linkEl.getAttribute('href') : null;
          const productUrl = linkHref
            ? (linkHref.startsWith('http') ? linkHref : `https://www.flipkart.com${linkHref}`)
            : 'https://www.flipkart.com';
          
          let originalPrice = price;
          if (origPriceEl) {
            const rawOrig = origPriceEl.textContent.replace(/[^\d]/g, '');
            if (rawOrig) originalPrice = parseInt(rawOrig, 10);
          }
          
          if (!isNaN(price) && price > 0 && title.length > 3) {
            results.push({
              id:           'fk-' + Math.random().toString(36).substr(2, 9),
              title:        title,
              price:        { basePrice: originalPrice, finalPayablePrice: price, currency: "INR" },
              originalPrice: originalPrice,
              imageUrl:     image,
              url:          productUrl,
              deepLinkUrl:  productUrl,
              providerId:   'flipkart',
              providerName: 'Flipkart',
              category:     'electronics',
              isAvailable:  true,
              status:       'AVAILABLE'
            });
          }
        }
      } catch(e) {
        console.error("Flipkart parse item error:", e);
      }
    });
    
    sendResponse({ results });
    return true;
  }

  return false;
}
