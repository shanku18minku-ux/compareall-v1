const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  await page.goto('https://www.eatsure.com/');
  await page.evaluate(() => {
    localStorage.setItem('es_location', JSON.stringify({ lat: 23.7957, lng: 86.4304, address: "Bokaro" }));
  });
  
  await page.goto('https://www.eatsure.com/');
  await new Promise(r => setTimeout(r, 3000));
  
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
