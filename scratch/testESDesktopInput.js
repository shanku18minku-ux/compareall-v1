const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.goto('https://www.eatsure.com/');
  const html = await page.content();
  
  const inputs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('input')).map(el => {
      return {
        type: el.type,
        placeholder: el.placeholder,
        id: el.id,
        class: el.className
      };
    });
  });
  console.log('Inputs found:', inputs);
  await browser.close();
})();
