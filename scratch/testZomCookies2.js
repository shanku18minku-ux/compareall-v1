const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36');
  
  await page.setCookie({
    name: 'z_loc',
    value: encodeURIComponent('{"lat":23.7957,"lon":86.4304}'),
    domain: '.zomato.com'
  });
  
  await page.goto('https://www.zomato.com/search?q=pizza', { waitUntil: 'networkidle2' });
  const html = await page.content();
  console.log('Cards:', (html.match(/class="[^"]*search-snippet-card[^"]*"/g) || []).length);
  console.log('Location text:', html.includes('Select Location') || html.includes('Location'));
  
  await browser.close();
})();
