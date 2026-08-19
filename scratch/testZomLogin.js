const fetch = require('node-fetch');
fetch('https://www.zomato.com/', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36'
  }
}).then(r => r.text()).then(t => {
  console.log('Login words:', (t.match(/login|sign in|sign up/gi) || []).length);
  console.log('Log out words:', (t.match(/logout|sign out/gi) || []).length);
  
  // Extract all data-testid or class names containing login
  const classes = t.match(/class="([^"]*login[^"]*)"/gi) || [];
  console.log('Classes:', classes.slice(0, 5));
}).catch(console.error);
