const fetch = require('node-fetch');
fetch('https://www.zomato.com/webroutes/getPage?page_type=DELIVERY&q=pizza', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36',
    'Cookie': 'z_loc=' + encodeURIComponent('{"lat":12.9716,"lon":77.5946}') + '; loc=' + encodeURIComponent('{"lat":12.9716,"lon":77.5946}') + ';'
  }
}).then(r => r.json()).then(j => {
  const sections = j?.page_data?.sections?.SECTION_SEARCH_RESULT || [];
  console.log('Results:', sections.length);
  if (sections.length > 0) {
    console.log('First result:', sections[0]?.info?.name);
    console.log('Locality:', sections[0]?.info?.locality?.name);
  }
}).catch(console.error);
