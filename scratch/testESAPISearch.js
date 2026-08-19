const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  page.on('request', request => {
    if (request.url().includes('search') || request.url().includes('api')) {
      console.log('API Request:', request.method(), request.url());
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
  
  // click search button if exists
  await page.evaluate(() => {
    var searchIcon = document.querySelector('img[alt="search-icon"]');
    if (searchIcon) searchIcon.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  
  // type into input
  await page.evaluate(() => {
    var input = document.querySelector('input');
    if (input) {
      input.value = 'pizza';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  
  await new Promise(r => setTimeout(r, 4000));
  await browser.close();
})();
