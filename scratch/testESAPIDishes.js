const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  let dishApiUrls = [];
  page.on('response', async response => {
    if (response.url().includes('api') && !response.url().includes('google') && !response.url().includes('amplitude') && !response.url().includes('singular')) {
      if (response.url().includes('product') || response.url().includes('menu') || response.url().includes('collection')) {
          dishApiUrls.push(response.url());
      }
    }
  });
  
  await page.goto('https://www.eatsure.com/');
  await page.evaluate(() => {
    localStorage.setItem('es_location', JSON.stringify({ lat: 23.7957, lng: 86.4304, address: "Bokaro" }));
    document.cookie = 'lat=23.7957; path=/; max-age=86400';
    document.cookie = 'lng=86.4304; path=/; max-age=86400';
  });
  
  await page.goto('https://www.eatsure.com/faasos');
  await new Promise(r => setTimeout(r, 4000));
  
  console.log('Dish API URLs:', dishApiUrls);
  await browser.close();
})();
