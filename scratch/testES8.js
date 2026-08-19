const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36');
  await page.goto('https://www.eatsure.com/');
  await new Promise(r => setTimeout(r, 3000));
  const html = await page.content();
  console.log('Words:', (html.match(/pizza|search|explore/gi) || []));
  await browser.close();
})();
