const fs = require('fs');
let content = fs.readFileSync('apps/mobile/App.tsx', 'utf8');

const oldRestCard = `                  return (
                    <View key={k} style={styles.premiumRestCard}>
                      <View style={styles.restCardHeader}>
                          <Text style={styles.restTitle}>{restGroup.restaurantName}</Text>
                          </View>
                      
                      <TouchableOpacity 
                          style={styles.openMenuBtn}
                          onPress={() => setSelectedMenuRest(restGroup)}
                          activeOpacity={0.8}
                      >
                          <Text style={styles.openMenuBtnText}>Open</Text>
                      </TouchableOpacity>
                    </View>
                  );`;

console.log('Contains oldRestCard?', content.includes(oldRestCard));

const regex = /<View key=\{dIdx\} style=\{\[styles\.dishCard, \{ padding: 0, overflow: 'hidden' \}\]\}>[\s\S]*?(?=<\/View>\s*\}\)\}\s*<\/View>\s*\)\;)/;
console.log('Matches regex?', regex.test(content));
