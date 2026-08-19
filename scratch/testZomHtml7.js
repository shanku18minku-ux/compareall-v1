const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36');
  await page.goto('https://www.zomato.com/search?q=pizza', { waitUntil: 'networkidle2' });
  
  const titles = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a.result-title, [class*="result-title"], h4, h5, div[class*="title"], div[class*="name"]')).map(el => el.textContent.trim()).filter(t => t.toLowerCase().includes('pizza') || t.length > 5);
  });
  console.log('Titles:', titles.slice(0, 10));
  
  await browser.close();
})();
