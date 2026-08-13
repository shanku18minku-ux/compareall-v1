// flipkart-extractor.js
// This content script runs INSIDE Flipkart's search results page.
// It reads the already-rendered DOM and sends results back to our background script.

(function() {
  console.log('[CompareAll] Flipkart extractor content script running...');

  function extractFlipkartResults() {
    const results = [];

    // Flipkart's current search result grid items — try multiple selectors
    const containers = document.querySelectorAll(
      'div[data-id], div._1AtVbE, div.cPHDOP, div._2B099V'
    );

    containers.forEach((item) => {
      try {
        const titleEl =
          item.querySelector('div._4rR01T') ||
          item.querySelector('a.s1Q9rs') ||
          item.querySelector('a.IRpwTa') ||
          item.querySelector('div.KzDlHZ') ||
          item.querySelector('a.WKTcLC') ||
          item.querySelector('.col.col-7-12 a') ||
          item.querySelector('a[title]');

        const priceEl =
          item.querySelector('div._30jeq3') ||
          item.querySelector('div.Nx9bqj._4b5DiR') ||
          item.querySelector('div.Nx9bqj') ||
          item.querySelector('._1_WHN1');

        const origPriceEl =
          item.querySelector('div._3I9_wc') ||
          item.querySelector('div.yRaY8j') ||
          item.querySelector('._3auQ3N');

        const imageEl =
          item.querySelector('img._396cs4') ||
          item.querySelector('img.DByuf4') ||
          item.querySelector('img._2r_T1I');

        const linkEl =
          item.querySelector('a[href*="/p/itm"]') ||
          item.querySelector('a[href*="/p/"]') ||
          item.querySelector('a._1fQZEK') ||
          item.querySelector('a.CGtC98');

        if (titleEl && priceEl) {
          const title = titleEl.textContent.trim() || titleEl.getAttribute('title');
          const priceRaw = priceEl.textContent.replace(/[₹,\s]/g, '');
          const price = parseInt(priceRaw, 10);

          if (!title || isNaN(price) || price <= 0 || title.length < 3) return;

          let originalPrice = price;
          if (origPriceEl) {
            const rawOrig = origPriceEl.textContent.replace(/[^\d]/g, '');
            if (rawOrig) originalPrice = parseInt(rawOrig, 10);
          }

          const linkHref = linkEl ? linkEl.getAttribute('href') : null;
          const productUrl = linkHref
            ? (linkHref.startsWith('http') ? linkHref : `https://www.flipkart.com${linkHref}`)
            : window.location.href;

          results.push({
            id:           'fk-' + Math.random().toString(36).substr(2, 9),
            title:        title,
            price:        { basePrice: originalPrice, finalPayablePrice: price, currency: "INR" },
            originalPrice: originalPrice,
            imageUrl:     imageEl ? imageEl.src : null,
            url:          productUrl,
            deepLinkUrl:  productUrl,
            providerId:   'flipkart',
            providerName: 'Flipkart',
            category:     'electronics',
            isAvailable:  true,
            status:       'AVAILABLE'
          });
        }
      } catch (e) {
        // Skip bad items silently
      }
    });

    return results;
  }

  // Listen for search trigger from our background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'EXTRACT_FLIPKART_RESULTS') {
      console.log('[CompareAll] Extracting Flipkart results from page DOM...');
      
      // Wait a bit for dynamic content to load if needed
      setTimeout(() => {
        const results = extractFlipkartResults();
        console.log(`[CompareAll] Flipkart extracted: ${results.length} items`);
        sendResponse({ results });
      }, 1500);

      return true; // Keep channel open
    }
  });

  // Also auto-trigger if URL has our marker
  if (window.location.href.includes('compareall_trigger=1')) {
    setTimeout(() => {
      const results = extractFlipkartResults();
      console.log(`[CompareAll] Auto-triggered Flipkart extraction: ${results.length} items`);
      chrome.runtime.sendMessage({
        action: 'FLIPKART_RESULTS_READY',
        results: results
      });
    }, 2500);
  }
})();
