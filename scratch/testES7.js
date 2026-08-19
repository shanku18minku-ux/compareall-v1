const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36');
  
  await page.goto('https://www.eatsure.com/');
  await page.evaluate(() => {
    localStorage.setItem('es_location', JSON.stringify({ lat: 23.7957, lng: 86.4304, address: "Bokaro" }));
  });
  
  await page.goto('https://www.eatsure.com/search');
  await new Promise(r => setTimeout(r, 3000));
  
  const html = await page.content();
  console.log('Input fields:', (html.match(/<input[^>]*>/gis) || []).length);
  
  const buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button, a, div, span')).filter(el => {
        const html = el.innerHTML.toLowerCase();
        const cls = (el.className || '').toLowerCase();
        return el.clientHeight > 15 && el.clientHeight < 80 && (html.indexOf('search') !== -1 || cls.indexOf('search') !== -1 || html.indexOf('magnifying-glass') !== -1);
    }).map(el => '<' + el.tagName.toLowerCase() + ' class="' + el.className + '">...');
  });
  console.log('Found search buttons:', buttons);
  
  await browser.close();
})();
