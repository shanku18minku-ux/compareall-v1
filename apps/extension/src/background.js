// background.js - Multi-platform scraping with robust tab injection

let creatingOffscreenDocument;

async function setupOffscreenDocument(path) {
  if (await chrome.offscreen.hasDocument()) return;
  if (creatingOffscreenDocument) {
    await creatingOffscreenDocument;
  } else {
    creatingOffscreenDocument = chrome.offscreen.createDocument({
      url: path,
      reasons: [chrome.offscreen.Reason.DOM_PARSER],
      justification: 'Parse HTML from websites'
    });
    await creatingOffscreenDocument;
    creatingOffscreenDocument = null;
  }
}

async function fetchAmazonHTML(query) {
  const url = `https://www.amazon.in/s?k=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'en-IN,en;q=0.9',
    }
  });
  return res.text();
}

function fetchFlipkartViaTab(query) {
  return new Promise((resolve) => {
    const flipkartUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`;
    console.log('[CompareAll BG] Opening Flipkart tab...');

    chrome.tabs.create({ url: flipkartUrl, active: false }, (tab) => {
      const tabId = tab.id;
      const onUpdated = (updatedTabId, changeInfo) => {
        if (updatedTabId !== tabId || changeInfo.status !== 'complete') return;
        chrome.tabs.onUpdated.removeListener(onUpdated);

        setTimeout(() => {
          chrome.scripting.executeScript({
            target: { tabId },
            func: () => {
              const extracted = [];
              const priceEls = document.querySelectorAll('*');
              const priceContainers = [];
              
              priceEls.forEach(el => {
                if (el.children.length === 0 && el.textContent.includes('₹') && 
                    /₹[\d,]+/.test(el.textContent) && el.tagName !== 'SCRIPT') {
                  priceContainers.push(el);
                }
              });

              priceContainers.forEach((priceEl) => {
                try {
                  const priceText = priceEl.textContent.trim();
                  const priceMatch = priceText.match(/₹([\d,]+)/);
                  if (!priceMatch) return;
                  const price = parseInt(priceMatch[1].replace(/,/g, ''), 10);
                  if (isNaN(price) || price < 10) return;

                  let container = priceEl;
                  let titleText = null;
                  let linkHref = null;
                  let imgSrc = null;
                  let origPrice = price;

                  for (let depth = 0; depth < 10; depth++) {
                    container = container.parentElement;
                    if (!container) break;

                    if (!titleText) {
                      const ta = container.querySelector('a[title]');
                      const td = container.querySelector('div[title]');
                      const tl = container.querySelector('a[href*="/p/"]');
                      titleText = ta?.getAttribute('title') || td?.getAttribute('title') || 
                                  tl?.textContent?.trim() || ta?.textContent?.trim();
                    }

                    if (!linkHref) {
                      const la = container.querySelector('a[href*="/p/"]');
                      linkHref = la?.getAttribute('href');
                    }

                    if (!imgSrc) {
                      const img = container.querySelector('img[src*="fkimg"]') || 
                                  container.querySelector('img[src*="flipkart"]') ||
                                  container.querySelector('img');
                      imgSrc = img?.src;
                    }

                    const strikeEls = container.querySelectorAll('*');
                    strikeEls.forEach(s => {
                      if (window.getComputedStyle(s).textDecoration?.includes('line-through')) {
                        const m = s.textContent.match(/[\d,]+/);
                        if (m) origPrice = parseInt(m[0].replace(/,/g, ''), 10);
                      }
                    });

                    if (titleText && linkHref) break;
                  }

                  if (titleText && price > 0) {
                    const productUrl = linkHref
                      ? (linkHref.startsWith('http') ? linkHref : `https://www.flipkart.com${linkHref}`)
                      : 'https://www.flipkart.com';

                    extracted.push({
                      id: 'fk-' + Math.random().toString(36).substr(2, 9),
                      title: titleText.substring(0, 150),
                      price: { basePrice: origPrice, finalPayablePrice: price, currency: 'INR' },
                      originalPrice: origPrice,
                      imageUrl: imgSrc || null,
                      url: productUrl,
                      deepLinkUrl: productUrl,
                      providerId: 'flipkart',
                      providerName: 'Flipkart',
                      category: 'electronics',
                      isAvailable: true,
                      status: 'AVAILABLE'
                    });
                  }
                } catch(e) { }
              });
              return extracted;
            }
          }).then((res) => {
            chrome.tabs.remove(tabId).catch(() => {});
            resolve(res?.[0]?.result || []);
          }).catch(() => {
            chrome.tabs.remove(tabId).catch(() => {});
            resolve([]);
          });
        }, 4000);
      };
      chrome.tabs.onUpdated.addListener(onUpdated);
      setTimeout(() => { chrome.tabs.onUpdated.removeListener(onUpdated); chrome.tabs.remove(tabId).catch(() => {}); resolve([]); }, 25000);
    });
  });
}

// Zomato Extraction via Tab
function fetchZomatoViaTab(query) {
  return new Promise((resolve) => {
    // We use the search page. Zomato auto-uses location if available
    const zomatoUrl = `https://www.zomato.com/search?q=${encodeURIComponent(query)}`;
    console.log('[CompareAll BG] Opening Zomato tab...');

    chrome.tabs.create({ url: zomatoUrl, active: false }, (tab) => {
      const tabId = tab.id;
      const onUpdated = (updatedTabId, changeInfo) => {
        if (updatedTabId !== tabId || changeInfo.status !== 'complete') return;
        chrome.tabs.onUpdated.removeListener(onUpdated);

        console.log('[CompareAll BG] Zomato tab loaded, waiting 4s for JS render...');

        setTimeout(() => {
          chrome.scripting.executeScript({
            target: { tabId },
            func: () => {
              const extracted = [];
              const allLinks = document.querySelectorAll('a');
              
              allLinks.forEach(a => {
                try {
                  const text = a.textContent.trim();
                  if (text.length < 5) return;
                  
                  // Look for price indicators
                  const priceMatch = text.match(/₹\s*(\d+)|Rs\.?\s*(\d+)|(\d+)\s*for two/i);
                  if (!priceMatch) return;

                  let price = parseInt(priceMatch[1] || priceMatch[2] || priceMatch[3], 10);
                  if (isNaN(price)) return;
                  
                  // ETA
                  let eta = null;
                  const etaMatch = text.match(/(\d+[-]?\d*)\s*mins?/i);
                  if (etaMatch) eta = etaMatch[0];
                  
                  // Rating
                  let rating = null;
                  const ratingMatch = text.match(/([1-4]\.[0-9]|5\.0)/);
                  if (ratingMatch) rating = parseFloat(ratingMatch[1]);
                  
                  // Title is likely the first distinct line or just the text before price
                  let title = text.split('\n')[0].trim();
                  if (title.length > 60 || title.includes('₹')) {
                    // fallback: just grab first 30 chars
                    title = text.substring(0, 30).trim() + "...";
                  }

                  // Find image
                  const img = a.querySelector('img');
                  const imgSrc = img && !img.src.includes('data:image') ? img.src : null;
                  
                  // Basic verification
                  if (title && a.href && a.href.includes('zomato.com')) {
                    extracted.push({
                      id: 'zmt-' + Math.random().toString(36).substr(2, 9),
                      title: title,
                      price: { basePrice: price, finalPayablePrice: price, currency: 'INR' },
                      originalPrice: price,
                      imageUrl: imgSrc,
                      url: a.href,
                      deepLinkUrl: a.href,
                      providerId: 'zomato',
                      providerName: 'Zomato',
                      category: 'food',
                      rating: rating,
                      estimatedTimeMins: eta,
                      isAvailable: true,
                      status: 'LIVE'
                    });
                  }
                } catch(e) {}
              });


              // Deduplicate Zomato results based on title
              const unique = [];
              const seen = new Set();
              extracted.forEach(item => {
                if(!seen.has(item.title)) {
                  seen.add(item.title);
                  unique.push(item);
                }
              });

              return unique;
            }
          }).then((res) => {
            chrome.tabs.remove(tabId).catch(() => {});
            resolve(res?.[0]?.result || []);
          }).catch(() => {
            chrome.tabs.remove(tabId).catch(() => {});
            resolve([]);
          });
        }, 4000);
      };
      chrome.tabs.onUpdated.addListener(onUpdated);
      setTimeout(() => { chrome.tabs.onUpdated.removeListener(onUpdated); chrome.tabs.remove(tabId).catch(() => {}); resolve([]); }, 25000);
    });
  });
}

// Swiggy Extraction via Tab
function fetchSwiggyViaTab(query) {
  return new Promise((resolve) => {
    // Swiggy URL structure for search
    const swiggyUrl = `https://www.swiggy.com/search?query=${encodeURIComponent(query)}`;
    console.log('[CompareAll BG] Opening Swiggy tab...');

    chrome.tabs.create({ url: swiggyUrl, active: false }, (tab) => {
      const tabId = tab.id;
      const onUpdated = (updatedTabId, changeInfo) => {
        if (updatedTabId !== tabId || changeInfo.status !== 'complete') return;
        chrome.tabs.onUpdated.removeListener(onUpdated);

        console.log('[CompareAll BG] Swiggy tab loaded, waiting 4s for JS render...');

        setTimeout(() => {
          chrome.scripting.executeScript({
            target: { tabId },
            func: () => {
              const extracted = [];
              const allLinks = document.querySelectorAll('a');
              
              allLinks.forEach(a => {
                try {
                  const text = a.textContent.trim();
                  if (text.length < 5) return;
                  
                  const priceMatch = text.match(/₹\s*(\d+)|Rs\.?\s*(\d+)|(\d+)\s*for two/i);
                  if (!priceMatch) return;

                  let price = parseInt(priceMatch[1] || priceMatch[2] || priceMatch[3], 10);
                  if (isNaN(price)) return;
                  
                  let eta = null;
                  const etaMatch = text.match(/(\d+[-]?\d*)\s*mins?/i);
                  if (etaMatch) eta = etaMatch[0];
                  
                  let rating = null;
                  const ratingMatch = text.match(/([1-4]\.[0-9]|5\.0)/);
                  if (ratingMatch) rating = parseFloat(ratingMatch[1]);
                  
                  let title = text.split('\n')[0].trim();
                  if (title.length > 60 || title.includes('₹')) {
                    title = text.substring(0, 30).trim() + "...";
                  }

                  const img = a.querySelector('img');
                  const imgSrc = img && !img.src.includes('data:image') ? img.src : null;
                  
                  if (title && a.href && a.href.includes('swiggy.com')) {
                    extracted.push({
                      id: 'swg-' + Math.random().toString(36).substr(2, 9),
                      title: title,
                      price: { basePrice: price, finalPayablePrice: price, currency: 'INR' },
                      originalPrice: price,
                      imageUrl: imgSrc,
                      url: a.href,
                      deepLinkUrl: a.href,
                      providerId: 'swiggy',
                      providerName: 'Swiggy',
                      category: 'food',
                      rating: rating,
                      estimatedTimeMins: eta,
                      isAvailable: true,
                      status: 'LIVE'
                    });
                  }
                } catch(e) {}
              });

              // Deduplicate
              const unique = [];
              const seen = new Set();
              extracted.forEach(item => {
                if(!seen.has(item.title)) {
                  seen.add(item.title);
                  unique.push(item);
                }
              });

              return unique;
            }
          }).then((res) => {
            chrome.tabs.remove(tabId).catch(() => {});
            resolve(res?.[0]?.result || []);
          }).catch(() => {
            chrome.tabs.remove(tabId).catch(() => {});
            resolve([]);
          });
        }, 4000);
      };
      chrome.tabs.onUpdated.addListener(onUpdated);
      setTimeout(() => { chrome.tabs.onUpdated.removeListener(onUpdated); chrome.tabs.remove(tabId).catch(() => {}); resolve([]); }, 25000);
    });
  });
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "PERFORM_LIVE_SEARCH") {
    const query = message.payload.query;
    console.log("[CompareAll BG] Starting FULL multi-platform search for:", query);

    (async () => {
      try {
        const resultsSettled = await Promise.allSettled([
          (async () => {
            try {
              const html = await fetchAmazonHTML(query);
              console.log(`[CompareAll BG] Amazon HTML size: ${html.length} bytes`);
              await setupOffscreenDocument('src/offscreen.html');
              const parsed = await chrome.runtime.sendMessage({
                type: 'PARSE_AMAZON_HTML', target: 'offscreen', html
              });
              return parsed?.results || [];
            } catch (e) {
              console.error('[CompareAll BG] Amazon failed:', e);
              return [];
            }
          })(),
          fetchFlipkartViaTab(query),
          fetchZomatoViaTab(query),
          fetchSwiggyViaTab(query)
        ]);

        const amazonResults = resultsSettled[0].status === 'fulfilled' ? resultsSettled[0].value : [];
        const flipkartResults = resultsSettled[1].status === 'fulfilled' ? resultsSettled[1].value : [];
        const zomatoResults = resultsSettled[2].status === 'fulfilled' ? resultsSettled[2].value : [];
        const swiggyResults = resultsSettled[3].status === 'fulfilled' ? resultsSettled[3].value : [];

        const allResults = [...amazonResults, ...flipkartResults, ...zomatoResults, ...swiggyResults];
        console.log(`[CompareAll BG] TOTAL: ${allResults.length} (Amz: ${amazonResults.length}, Fk: ${flipkartResults.length}, Zmt: ${zomatoResults.length}, Swg: ${swiggyResults.length})`);
        sendResponse({ results: allResults, error: null });

      } catch (error) {
        console.error("[CompareAll BG] Fatal:", error);
        sendResponse({ results: [], error: error.message });
      }
    })();

    return true;
  }
});
