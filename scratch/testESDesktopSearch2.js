const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  page.on('request', request => {
    if (request.url().includes('search')) {
      console.log('Search Request:', request.method(), request.url());
    }
  });
  
  await page.goto('https://www.eatsure.com/');
  await page.evaluate(() => {
    localStorage.setItem('es_location', JSON.stringify({ lat: 23.7957, lng: 86.4304, address: "Bokaro" }));
    document.cookie = 'lat=23.7957; path=/; max-age=86400';
    document.cookie = 'lng=86.4304; path=/; max-age=86400';
  });
  
  await page.goto('https://www.eatsure.com/bokaro');
  await new Promise(r => setTimeout(r, 2000));
  
  const searchHtml = await page.evaluate(() => {
      // Find search input by placeholder
      const inputs = Array.from(document.querySelectorAll('input'));
      const searchInput = inputs.find(i => i.placeholder && i.placeholder.toLowerCase().includes('search'));
      if (searchInput) {
          searchInput.value = 'pizza';
          searchInput.dispatchEvent(new Event('input', { bubbles: true }));
          return 'Typed pizza';
      }
      return 'No search input found! Placeholders: ' + inputs.map(i => i.placeholder).join(', ');
  });
  console.log('Search Input Status:', searchHtml);
  
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
})();
