const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  page.on('response', async response => {
    if (response.url().includes('api') && !response.url().includes('google') && !response.url().includes('amplitude') && !response.url().includes('singular')) {
      console.log('API Response:', response.url());
      try {
        const text = await response.text();
        console.log('Response body:', text.substring(0, 150));
      } catch(e) {}
    }
  });
  
  await page.goto('https://www.eatsure.com/');
  await new Promise(r => setTimeout(r, 4000));
  await browser.close();
})();
