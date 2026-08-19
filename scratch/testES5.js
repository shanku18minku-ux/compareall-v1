const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36');
  
  await page.goto('https://www.eatsure.com/');
  await page.evaluate(() => {
    localStorage.setItem('es_location', JSON.stringify({ lat: 23.7957, lng: 86.4304, address: "Bokaro" }));
  });
  
  await page.goto('https://www.eatsure.com/');
  await page.waitForTimeout(3000);
  
  console.log('URL after wait:', page.url());
  const html = await page.content();
  console.log('Input fields:', (html.match(/<input[^>]*>/gis) || []).length);
  
  await browser.close();
})();
