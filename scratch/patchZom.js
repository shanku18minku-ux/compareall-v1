const fs = require('fs');
const file = 'apps/mobile/src/lib/packets/zomato.ts';
let content = fs.readFileSync(file, 'utf8');

const oldCards = "var cards = document.querySelectorAll('div[class*=\"search-snippet-card\"], div[class*=\"search-card\"], div[class*=\"js-search-result-li\"], article[class*=\"search-result\"], div[class*=\"RestaurantCard\"], div[class*=\"card\"]');";
const newCards = `var cards = document.querySelectorAll('div[class*="search-snippet-card"], div[class*="search-card"], div[class*="js-search-result-li"], article[class*="search-result"], div[class*="RestaurantCard"], div[class*="card"]');
                  // Robust fallback if classes are obfuscated
                  if (!cards || cards.length === 0) {
                      var all = Array.from(document.querySelectorAll('div, a, article, section, li'));
                      var possible = all.filter(function(el) {
                          if (el.clientHeight < 50 || el.clientHeight > 600 || el.clientWidth < 100) return false;
                          var txt = el.innerText || '';
                          if (!txt.includes('?') && !txt.toLowerCase().includes('cost for two') && !txt.toLowerCase().includes('rs')) return false;
                          if (el.querySelector('img') === null) return false;
                          if (el.querySelectorAll('*').length > 50) return false;
                          return true;
                      });
                      if (possible.length > 0) {
                          // Deduplicate parents
                          var deduped = possible.filter(function(el) {
                              var hasParent = possible.some(function(p) { return p !== el && p.contains(el); });
                              return !hasParent;
                          });
                          cards = deduped;
                      }
                  }`;

content = content.replace(oldCards, newCards);
fs.writeFileSync(file, content);
console.log('Added robust DOM fallback to zomato.ts');
