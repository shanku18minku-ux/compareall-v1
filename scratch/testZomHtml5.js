const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36');
  await page.goto('https://www.zomato.com/search?q=pizza', { waitUntil: 'networkidle2' });
  const html = await page.content();
  
  const cards = html.match(/<div[^>]*class="[^"]*search-snippet-card[^"]*"[^>]*>.*?<\/div>\s*<\/div>/gis) || [];
  if (cards.length > 0) {
    console.log('--- CARD HTML ---');
    console.log(cards[0].substring(0, 3000));
  } else {
    console.log('No search-snippet-card found');
  }
  await browser.close();
})();
