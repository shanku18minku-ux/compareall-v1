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
  
  await page.goto('https://www.eatsure.com/v1/api/faasos');
  const text = await page.evaluate(() => document.body.innerText);
  try {
      const data = JSON.parse(text);
      console.log('Keys in preload_data:', Object.keys(data.data.preload_data));
      console.log('Are there products?', data.data.preload_data.products ? 'Yes' : 'No');
  } catch(e) { console.log('Error parsing JSON'); }
  await browser.close();
})();
