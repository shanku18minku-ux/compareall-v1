const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Mobile Safari/537.36');
  await page.setExtraHTTPHeaders({
    'Cookie': 'z_loc=' + encodeURIComponent('{"lat":12.9716,"lon":77.5946}')
  });
  await page.goto('https://www.zomato.com/bangalore/delivery?search_text=pizza', { waitUntil: 'networkidle2' });
  const html = await page.content();
  console.log('Cards:', (html.match(/class="[^"]*card[^"]*"/g) || []).length);
  const json = (html.match(/<script id=\"__NEXT_DATA__\"[^>]*>(.*?)<\/script>/) || [])[1];
  console.log('NextData:', !!json);
  
  // print all unique class names containing 'card' or 'search'
  const classes = html.match(/class="([^"]+)"/g) || [];
  const unique = new Set();
  classes.forEach(c => {
    c.replace('class="', '').replace('"', '').split(' ').forEach(cls => {
      if (cls.includes('card') || cls.includes('search') || cls.includes('result')) {
        unique.add(cls);
      }
    });
  });
  console.log('Relevant Classes:', Array.from(unique).join(', '));
  
  await browser.close();
})();
