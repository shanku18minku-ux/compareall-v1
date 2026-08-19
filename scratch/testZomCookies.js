const fetch = require('node-fetch');
fetch('https://www.zomato.com/', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36'
  }
}).then(r => {
  console.log('Set-Cookie:', r.headers.raw()['set-cookie']);
}).catch(console.error);
