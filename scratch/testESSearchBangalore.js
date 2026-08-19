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
      const allText = Array.from(document.querySelectorAll('*'))
          .map(el => el.innerText || '')
          .filter(t => t.toLowerCase().includes('search'));
      return allText.slice(0, 5);
  });
  console.log('Elements with text search:', searchHtml);
  
  const searchIcons = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('svg, img')).map(el => el.outerHTML).filter(h => h.toLowerCase().includes('search'));
  });
  console.log('Search icons:', searchIcons);
  await browser.close();
})();
