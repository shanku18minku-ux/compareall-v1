const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36');
  await page.goto('https://www.zomato.com/search?q=pizza', { waitUntil: 'networkidle2' });
  const html = await page.content();
  
  const matches = html.match(/class="[^"]*search-snippet-card[^"]*"/gis) || [];
  console.log('search-snippet-card matches:', matches.length);
  
  await browser.close();
})();
