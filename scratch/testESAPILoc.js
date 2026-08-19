const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36');
  
  await page.goto('https://www.eatsure.com/', { waitUntil: 'networkidle2' });
  
  // Click on location
  await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const locBtn = btns.find(b => b.innerText.toLowerCase().includes('locate'));
      if (locBtn) locBtn.click();
  });
  await new Promise(r => setTimeout(r, 2000));
  
  // Type Bokaro
  await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input'));
      const locInput = inputs.find(i => i.placeholder && i.placeholder.toLowerCase().includes('location'));
      if (locInput) {
          locInput.value = 'Bokaro';
          locInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
  });
  await new Promise(r => setTimeout(r, 3000));
  
  // Click first result
  await page.evaluate(() => {
      const results = Array.from(document.querySelectorAll('li, div[class*="suggestion"]'));
      const bokaro = results.find(r => r.innerText.toLowerCase().includes('bokaro'));
      if (bokaro) bokaro.click();
  });
  await new Promise(r => setTimeout(r, 4000));
  
  // Now fetch faasos API
  const faasosRes = await page.evaluate(async () => {
      try {
          const res = await fetch('https://www.eatsure.com/v1/api/faasos');
          const json = await res.json();
          return Object.keys(json.data.preload_data);
      } catch(e) { return e.toString(); }
  });
  console.log('faasos API:', faasosRes);
  
  // Now fetch search API
  const searchRes = await page.evaluate(async () => {
      try {
          const res = await fetch('https://www.eatsure.com/v1/api/get_search_results?searchString=pizza');
          const json = await res.json();
          if (json.data && json.data.searchResult) {
              return json.data.searchResult.map(r => r.product_name);
          }
          return 'No searchResult';
      } catch(e) { return e.toString(); }
  });
  console.log('Search API:', searchRes);
  
  await browser.close();
})();
