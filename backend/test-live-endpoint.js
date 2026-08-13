const http = require('http');

const payload = JSON.stringify({
  query: "iphone",
  results: [
    {
      id: "amz-123",
      title: "Apple iPhone 15 (128 GB) - Black",
      price: { basePrice: 79900, finalPayablePrice: 71999, currency: "INR" },
      imageUrl: "https://m.media-amazon.com/images/I/71657TiFeHL._AC_UY218_.jpg",
      url: "https://www.amazon.in",
      providerId: "amazon",
      providerName: "Amazon",
      category: "electronics",
      isAvailable: true,
      status: "AVAILABLE"
    },
    {
      id: "amz-124",
      title: "Apple iPhone 15 (256 GB) - Blue",
      price: { basePrice: 89900, finalPayablePrice: 82999, currency: "INR" },
      imageUrl: "https://m.media-amazon.com/images/I/71657TiFeHL._AC_UY218_.jpg",
      url: "https://www.amazon.in",
      providerId: "amazon",
      providerName: "Amazon",
      category: "electronics",
      isAvailable: true,
      status: "AVAILABLE"
    }
  ]
});

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/compare/live',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log("Status Code:", res.statusCode);
    console.log("Response Body:");
    console.log(JSON.stringify(JSON.parse(data), null, 2));
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(payload);
req.end();
