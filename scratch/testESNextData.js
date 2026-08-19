const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  await page.goto('https://www.eatsure.com/faasos', { waitUntil: 'networkidle2' });
  
  const nextData = await page.evaluate(() => {
    var el = document.getElementById('__NEXT_DATA__');
    if (!el) return 'No NEXT_DATA';
    try {
        var data = JSON.parse(el.textContent);
        var products = [];
        if (data.props && data.props.pageProps && data.props.pageProps.initialState) {
            return Object.keys(data.props.pageProps.initialState);
        }
        return 'Has NEXT_DATA but format unknown';
    } catch(e) {
        return 'Error parsing';
    }
  });
  console.log('Next Data keys:', nextData);
  await browser.close();
})();
