const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  await page.goto('https://www.eatsure.com/');
  await page.evaluate(() => {
    localStorage.setItem('es_location', JSON.stringify({ lat: 23.7957, lng: 86.4304, address: "Bokaro" }));
    document.cookie = 'lat=23.7957; path=/; max-age=86400';
    document.cookie = 'lng=86.4304; path=/; max-age=86400';
  });
  
  await page.goto('https://www.eatsure.com/faasos', { waitUntil: 'networkidle2' });
  const html = await page.content();
  
  const dishCards = html.match(/class="[^"]*product-card[^"]*"/gis) || [];
  console.log('Dish Cards found:', dishCards.length);
  if (dishCards.length === 0) {
      const allDivs = await page.evaluate(() => Array.from(document.querySelectorAll('div')).map(d => d.className).filter(c => c && c.includes('product')));
      console.log('Classes with product:', Array.from(new Set(allDivs)));
  }
  
  await browser.close();
})();
