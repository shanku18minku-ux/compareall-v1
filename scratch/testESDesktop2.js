const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36');
  await page.goto('https://www.eatsure.com/');
  const html = await page.content();
  console.log('Inputs:', (html.match(/<input[^>]*>/gis) || []).length);
  await browser.close();
})();
