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
  
  await page.goto('https://www.eatsure.com/v1/api/get_search_results?searchString=pizza');
  const text1 = await page.evaluate(() => document.body.innerText);
  console.log('Search Results API 1:', text1.substring(0, 200));
  
  await page.goto('https://www.eatsure.com/v1/api/search?q=pizza');
  const text2 = await page.evaluate(() => document.body.innerText);
  console.log('Search Results API 2:', text2.substring(0, 200));

  await browser.close();
})();
