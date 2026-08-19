const fetch = require('node-fetch');
fetch('https://www.zomato.com/bangalore/search?q=pizza', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36'
  }
}).then(r => r.text()).then(t => {
  console.log('Title:', (t.match(/<title[^>]*>(.*?)<\/title>/) || [])[1]);
  console.log('Cards:', (t.match(/class="[^"]*card[^"]*"/g) || []).length);
}).catch(console.error);
