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
  await new Promise(r => setTimeout(r, 5000));
  await browser.close();
})();
