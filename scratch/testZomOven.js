const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36');
  
  await page.setCookie({
    name: 'z_loc',
    value: encodeURIComponent('{"lat":23.7957,"lon":86.4304}'),
    domain: '.zomato.com'
  });
  
  await page.goto('https://www.zomato.com/search?q=oven+story', { waitUntil: 'networkidle2' });
  const html = await page.content();
  
  const matches = html.match(/class="[^"]*search-snippet-card[^"]*".*?<\/article>/gis) || [];
  let found = false;
  for (let card of matches) {
    if (card.toLowerCase().includes('oven')) {
        found = true;
        console.log('Found Oven Story on Zomato!');
    }
  }
  if (!found) {
    console.log('Oven Story NOT FOUND on Zomato in Bokaro!');
  }
  
  await browser.close();
})();
