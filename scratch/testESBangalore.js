const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  await page.goto('https://www.eatsure.com/');
  await page.evaluate(() => {
    localStorage.setItem('es_location', JSON.stringify({ lat: 12.9715987, lng: 77.5945627, address: "Bangalore" }));
    document.cookie = 'lat=12.9715987; path=/; max-age=86400';
    document.cookie = 'lng=77.5945627; path=/; max-age=86400';
  });
  
  await page.goto('https://www.eatsure.com/bangalore');
  await new Promise(r => setTimeout(r, 2000));
  
  const searchHtml = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input'));
      return inputs.map(i => i.placeholder).join(', ');
  });
  console.log('Placeholders on Bangalore:', searchHtml);
  await browser.close();
})();
