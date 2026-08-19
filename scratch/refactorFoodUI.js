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

const newRestCard = `                  const providersInRest = Array.from(new Set(restGroup.dishes.flatMap((d: any) => d.offers.map((o: any) => o.providerName))));
                  return (
                    <View key={k} style={styles.premiumRestCard}>
                      <View style={styles.restCardHeader}>
                          <Text style={styles.restTitle}>{restGroup.restaurantName}</Text>
                          <Text style={{color: '#64748b', fontSize: 13, marginTop: 4}}>Multiple Cuisines • Fast Food</Text>
                      </View>
                      
                      <View style={{paddingHorizontal: 15, paddingBottom: 15}}>
                          {providersInRest.map((provName: any) => (
                              <View key={provName} style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12}}>
                                  <Text style={{fontWeight: 'bold', color: '#334155'}}>{provName}</Text>
                                  <Text style={{color: '#16a34a', fontSize: 12, fontWeight: '600'}}>Open now</Text>
                              </View>
                          ))}
                      </View>
                      
                      <TouchableOpacity 
                          style={styles.openMenuBtn}
                          onPress={() => setSelectedMenuRest(restGroup)}
                          activeOpacity={0.8}
                      >
                          <Text style={styles.openMenuBtnText}>Open Menu ?</Text>
                      </TouchableOpacity>
                    </View>
                  );`;

content = content.replace(oldRestCard, newRestCard);

const oldDishCardRegex = /<View key=\{dIdx\} style=\{\[styles\.dishCard, \{ padding: 0, overflow: 'hidden' \}\]\}>[\s\S]*?(?=<\/View>\s*\}\)\}\s*<\/View>\s*\)\;)/;

const newDishCard = `<View key={dIdx} style={[styles.dishCard, { padding: 0, overflow: 'hidden' }]}>
                                          <View style={{padding: 15}}>
                                              <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 6}}>
                                                  <View style={{width: 12, height: 12, borderWidth: 1, borderColor: '#16a34a', alignItems: 'center', justifyContent: 'center', marginRight: 6}}>
                                                      <View style={{width: 6, height: 6, backgroundColor: '#16a34a', borderRadius: 3}} />
                                                  </View>
                                                  <Text style={{fontSize: 12, color: '#16a34a', fontWeight: 'bold'}}>Same price on available apps</Text>
                                              </View>

                                              <Text style={[styles.dishTitle, {flex: 1}]} numberOfLines={2}>{dish.dishName && dish.dishName.toLowerCase().includes('triple spice') ? dish.dishName.split(/triple spice/i)[0].trim() || 'American Nashville Pizza' : dish.dishName}</Text>
                                              
                                              <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 4, marginBottom: 8}}>
                                                  <View style={{backgroundColor: '#fef08a', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginRight: 8}}>
                                                      <Text style={{fontSize: 10, fontWeight: 'bold', color: '#ca8a04'}}>RECOMMENDED</Text>
                                                  </View>
                                              </View>

                                              {dish.offers.map((offer: any, oIdx: number) => {
                                                  const raw = offer.price?.basePrice || offer.price?.menuPrice || offer.price?.finalPayablePrice || 0;
                                                  return (
                                                      <View key={oIdx} style={{flexDirection: 'row', alignItems: 'center', marginTop: 6}}>
                                                          <View style={{width: 6, height: 6, borderRadius: 3, backgroundColor: '#cbd5e1', marginRight: 6}} />
                                                          <Text style={{fontSize: 14, color: '#334155'}}>{offer.providerName} Rs {raw}</Text>
                                                      </View>
                                                  );
                                              })}
                                          </View>

                                          <View style={{padding: 15, borderTopWidth: 1, borderTopColor: '#f1f5f9', alignItems: 'center'}}>
                                              {(() => {
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
                                                              <Text style={{color: '#16a34a', fontWeight: 'bold', fontSize: 16}}>Add</Text>
                                                          </TouchableOpacity>
                                                      );
                                                  }
                                              })()}
                                          </View>
                                      </View>`;

content = content.replace(oldDishCardRegex, newDishCard);

fs.writeFileSync('apps/mobile/App.tsx', content);
console.log('Done refactoring!');
