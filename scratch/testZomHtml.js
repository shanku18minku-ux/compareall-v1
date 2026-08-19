const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36');
  await page.goto('https://www.zomato.com/search?q=pizza', { waitUntil: 'networkidle2' });
  const html = await page.content();
  const cardMatch = html.match(/<div[^>]*class="[^"]*card[^"]*"[^>]*>.*?<\/div>/is);
  if (cardMatch) {
    console.log('Card HTML:', cardMatch[0].substring(0, 800));
  } else {
    console.log('No cards found');
  }
  await browser.close();
})();
