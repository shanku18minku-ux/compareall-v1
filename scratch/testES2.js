const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36');
  await page.goto('https://www.eatsure.com/', { waitUntil: 'networkidle2' });
  const html = await page.content();
  
  // Find any button with an SVG
  const buttons = html.match(/<button[^>]*>.*?<\/button>/gis) || [];
  for (let b of buttons) {
    if (b.includes('<svg')) {
      console.log('Button:', b);
    }
  }
  await browser.close();
})();
