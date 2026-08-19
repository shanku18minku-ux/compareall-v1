const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36');
  await page.goto('https://www.zomato.com/search?q=pizza', { waitUntil: 'networkidle2' });
  const html = await page.content();
  
  const all = await page.evaluate(() => {
      var all = Array.from(document.querySelectorAll('div, a, article, section, li'));
      var possible = all.filter(function(el) {
          if (el.clientHeight < 50 || el.clientHeight > 600 || el.clientWidth < 100) return false;
          var txt = el.innerText || '';
          if (!txt.includes('?') && !txt.toLowerCase().includes('cost for two') && !txt.toLowerCase().includes('rs')) return false;
          if (el.querySelector('img') === null) return false;
          if (el.querySelectorAll('*').length > 50) return false;
          return true;
      });
      if (possible.length > 0) {
          // Deduplicate parents
          var deduped = possible.filter(function(el) {
              var hasParent = possible.some(function(p) { return p !== el && p.contains(el); });
              return !hasParent;
          });
          return deduped.map(el => {
              var t = el.querySelector('a[class*="title"], h4, h5, [class*="name"]');
              var p = el.querySelector('[class*="cost"], [class*="price"]');
              return {
                  text: el.innerText.substring(0, 50),
                  title: t ? t.innerText : 'NO TITLE',
                  price: p ? p.innerText : 'NO PRICE'
              };
          });
      }
      return [];
  });
  console.log('Cards found by robust fallback:', all);
  await browser.close();
})();
