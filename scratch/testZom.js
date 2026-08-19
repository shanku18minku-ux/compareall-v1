const fetch = require('node-fetch');
fetch('https://www.zomato.com/bangalore/delivery?search_text=pizza', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36',
    'Cookie': 'z_loc=%7B%22lat%22%3A12.9716%2C%22lon%22%3A77.5946%7D; loc=%7B%22lat%22%3A12.9716%2C%22lon%22%3A77.5946%7D;'
  }
}).then(r => r.text()).then(t => {
  console.log('Match:', t.includes('search-snippet-card') || t.includes('search-result'));
  console.log('Cards:', (t.match(/class="[^"]*card[^"]*"/g) || []).length);
}).catch(console.error);
