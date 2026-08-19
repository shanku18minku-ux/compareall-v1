const fetch = require('node-fetch');
fetch('https://www.eatsure.com/search', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36'
  }
}).then(r => console.log('Status:', r.status)).catch(console.error);
