const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  await page.goto('https://www.eatsure.com/faasos', { waitUntil: 'networkidle2' });
  const html = await page.content();
  console.log('Script IDs:', await page.evaluate(() => Array.from(document.querySelectorAll('script[id]')).map(s => s.id)));
  console.log('Any JSON in body:', await page.evaluate(() => {
    return Array.from(document.querySelectorAll('script[type="application/json"]')).map(s => s.textContent.substring(0, 100));
  }));
  await browser.close();
})();
