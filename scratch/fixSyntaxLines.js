const fs = require('fs');
let content = fs.readFileSync('apps/mobile/App.tsx', 'utf8');

// I know exactly what needs to be from line 940 to 990.
// Let's just locate the line numbers and splice the array of lines!
const lines = content.split('\n');

let startIdx = -1;
let endIdx = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('{(() => {') && lines[i+1] && lines[i+1].includes('const inCartItem = cartItems.find(i => i.id === dish.dishName);')) {
        startIdx = i; // This is the IIFE for the Add to Cart stepper
    }
    if (lines[i].includes('</ScrollView>') && lines[i+1] && lines[i+1].includes('</View>') && lines[i+2] && lines[i+2].includes('</View>') && lines[i+3] && lines[i+3].includes('</Modal>')) {
        endIdx = i;
        break; // Found the end of the modal!
    }
}

console.log('startIdx', startIdx);
console.log('endIdx', endIdx);

if (startIdx !== -1 && endIdx !== -1) {
    // The broken code is between startIdx and endIdx!
    // We can reconstruct the correct ending.
    const goodEnding = `                                              {(() => {
                                                  const inCartItem = cartItems.find(i => i.id === dish.dishName);
                                                  const qty = inCartItem ? inCartItem.quantity : 0;
                                                  
                                                  if (qty > 0) {
                                                      return (
                                                          <View style={styles.stepperContainer}>
                                                              <TouchableOpacity onPress={() => handleUpdateCartQuantity(dish.dishName, qty - 1)} style={styles.stepperBtn}><Text style={styles.stepperBtnText}>-</Text></TouchableOpacity>
                                                              <Text style={styles.stepperVal}>{qty}</Text>
                                                              <TouchableOpacity onPress={() => handleUpdateCartQuantity(dish.dishName, qty + 1)} style={styles.stepperBtn}><Text style={styles.stepperBtnText}>+</Text></TouchableOpacity>
                                                          </View>
                                                      );
                                                  } else {
                                                      return (
                                                          <TouchableOpacity 
                                                              style={{backgroundColor: '#fff', borderWidth: 1, borderColor: '#16a34a', paddingHorizontal: 32, paddingVertical: 8, borderRadius: 8}}
                                                              onPress={() => {
                                                                  const bestOffer = dish.offers.sort((a: any, b: any) => (a.price?.finalPayablePrice||0) - (b.price?.finalPayablePrice||0))[0];
                                                                  if (bestOffer) handleAddToCart(bestOffer, dish.dishName);
                                                              }}
                                                          >
                                                              <Text style={{color: '#16a34a', fontWeight: 'bold', fontSize: 16}}>ADD</Text>
                                                          </TouchableOpacity>
                                                      );
                                                  }
                                              })()}
                                          </View>
                                      </View>
                                  );
                               })}
                               </View>
                            );
                        })()}
                    </ScrollView>`;
                    
    const newLines = [...lines.slice(0, startIdx), goodEnding, ...lines.slice(endIdx + 1)];
    fs.writeFileSync('apps/mobile/App.tsx', newLines.join('\n'));
    console.log('Replaced by lines!');
}

