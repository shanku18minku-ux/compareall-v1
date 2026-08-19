const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36');
  await page.goto('https://www.zomato.com/search?q=pizza', { waitUntil: 'networkidle2' });
  const html = await page.content();
  
  const blocks = html.match(/<div[^>]*>.*?<\/div>/gis) || [];
  let found = null;
  for (let b of blocks) {
    if (b.includes('?') && b.toLowerCase().includes('pizza') && b.length > 500 && b.length < 3000) {
      console.log('--- CARD HTML ---');
      console.log(b);
      break;
    }
  }
  await browser.close();
})();
