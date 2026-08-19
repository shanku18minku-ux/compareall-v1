const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36');
  
  await page.goto('https://www.swiggy.com/city/bokaro/search?query=pizza', { waitUntil: 'networkidle2' });
  const html = await page.content();
  
  const titles = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.RestaurantNameTitle_name__1H_wX')).map(el => el.textContent.trim());
  });
  console.log('Swiggy Titles:', titles);
  
  await browser.close();
})();
