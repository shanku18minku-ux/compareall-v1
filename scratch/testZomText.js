const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36');
  await page.goto('https://www.zomato.com/', { waitUntil: 'networkidle2' });
  const html = await page.content();
  console.log('Login text:', html.includes('Log in'));
  console.log('Sign up text:', html.includes('Sign up'));
  await browser.close();
})();
