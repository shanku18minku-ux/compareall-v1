const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36');
  await page.goto('https://www.zomato.com/search?q=pizza', { waitUntil: 'networkidle2' });
  const html = await page.content();
  
  const matches = html.match(/class="[^"]*search-snippet-card[^"]*".*?<\/article>/gis) || [];
  if (matches.length > 0) {
    const card = matches[0];
    console.log('--- RAW CARD ---');
    console.log(card);
  } else {
    console.log('No cards match!');
  }
  await browser.close();
})();
