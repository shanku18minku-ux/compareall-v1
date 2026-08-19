const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  page.on('response', async response => {
      const u = response.url();
      if (!u.includes('.js') && !u.includes('.css') && !u.includes('.png') && !u.includes('.jpg') && !u.includes('.svg') && !u.includes('google') && !u.includes('singular') && !u.includes('amplitude')) {
          console.log('Response:', u);
      }
  });
  
  await page.goto('https://www.eatsure.com/');
  await page.evaluate(() => {
    localStorage.setItem('es_location', JSON.stringify({ lat: 12.9715987, lng: 77.5945627, address: "Bangalore" }));
    document.cookie = 'lat=12.9715987; path=/; max-age=86400';
    document.cookie = 'lng=77.5945627; path=/; max-age=86400';
  });
  
  await page.goto('https://www.eatsure.com/faasos');
  await new Promise(r => setTimeout(r, 4000));
  await browser.close();
})();
