const fs = require('fs');

const path = 'C:\\\\Users\\\\HP\\\\.gemini\\\\antigravity\\\\worktrees\\\\app\\\\integrate_account_data_comparison\\\\apps\\\\mobile\\\\App.tsx';
let content = fs.readFileSync(path, 'utf8');

const dishesOld = `                            {displayDishes.map((dish: any, dIdx: number) => {
                                const primaryOffer = dish.offers[0];
                                const providerId = PROVIDERS.find(p => p.name.toLowerCase() === primaryOffer?.providerName.toLowerCase())?.id || PROVIDERS[0]?.id;
                                const itemId = \`\${providerId}__\${dish.dishName}\`;
                                const cartItem = cartItems.find(item => item.id === itemId);
                                const qty = cartItem ? cartItem.quantity : 0;
                                
                                return (
                                    <View key={dIdx} style={styles.dishCard}>
                                        <Text style={styles.dishTitle}>{dish.dishName}</Text>
                                        <View style={styles.dishBestPriceBox}>
                                            <Text style={styles.dishBestPrice}>
                                                🔥 Lowest on {dish.bestProvider}: ₹{dish.lowestPrice}
                                            </Text>
                                        </View>
                                        
                                        {dish.offers.map((offer: any, oIdx: number) => {
                                            const offProvId = PROVIDERS.find(p => p.name.toLowerCase() === offer.providerName.toLowerCase())?.id || PROVIDERS[0]?.id;
                                            const offItemId = \`\${offProvId}__\${dish.dishName}\`;
                                            const offCartItem = cartItems.find(item => item.id === offItemId);
                                            const offQty = offCartItem ? offCartItem.quantity : 0;
                                            
                                            return (
                                                <View key={oIdx} style={[styles.offerItem, oIdx === 0 && styles.offerItemWinner]}>
                                                    <View style={styles.offerMainInfo}>
                                                        <Text style={styles.offerProvider}>{offer.providerName}</Text>
                                                        <Text style={styles.offerPrice}>₹{offer.price?.finalPayablePrice || offer.menuPrice}</Text>
                                                    </View>
                                                    <View style={styles.cartActionContainer}>
                                                        {oIdx === 0 && dish.offers.length > 1 && dish.offers[1].price?.finalPayablePrice && (
                                                            <Text style={styles.offerSavingsText}>
                                                                Save ₹{(dish.offers[1].price?.finalPayablePrice || 0) - (offer.price?.finalPayablePrice || 0)}
                                                            </Text>
                                                        )}
                                                        {oIdx !== 0 ? (
                                                            <TouchableOpacity
                                                                style={styles.addToCartBtn}
                                                                onPress={() => {
                                                                    setCheckoutModal({
                                                                        providerName: offer.providerName,
                                                                        providerIcon: PROVIDERS.find(p => p.name.toLowerCase() === offer.providerName.toLowerCase())?.icon || '🛒',
                                                                        targetUrl: offer.restaurantUrl || 'https://google.com'
                                                                    });
                                                                }}
                                                            >
                                                                <Text style={styles.addToCartBtnText}>VISIT</Text>
                                                            </TouchableOpacity>
                                                        ) : offQty === 0 ? (
                                                            <TouchableOpacity
                                                                style={styles.addToCartBtn}
                                                                onPress={() => handleAddToCart(offer, dish.dishName)}
                                                            >
                                                                <Text style={styles.addToCartBtnText}>+ ADD</Text>
                                                            </TouchableOpacity>
                                                        ) : (
                                                            <View style={styles.stepperContainer}>
                                                                <TouchableOpacity style={styles.stepperBtn} onPress={() => handleUpdateCartQty(offItemId, offQty - 1)}>
                                                                    <Text style={styles.stepperBtnText}>-</Text>
                                                                </TouchableOpacity>
                                                                <Text style={styles.stepperQtyText}>{offQty}</Text>
                                                                <TouchableOpacity style={styles.stepperBtn} onPress={() => handleUpdateCartQty(offItemId, offQty + 1)}>
                                                                    <Text style={styles.stepperBtnText}>+</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                        )}
                                                    </View>
                                                </View>
                                            );
                                        })}
                                    </View>
                                );
                            })}`;

const dishesNew = `                            {displayDishes.map((dish: any, dIdx: number) => {
                                return (
                                    <View key={dIdx} style={styles.dishCard}>
                                        <Text style={styles.dishTitle}>{dish.dishName}</Text>
                                        <View style={styles.dishBestPriceBox}>
                                            <Text style={styles.dishBestPrice}>
                                                🔥 Best Price: ₹{dish.lowestPrice}
                                            </Text>
                                        </View>
                                        
                                        {dish.offers.map((offer: any, oIdx: number) => {
                                            const providerData = PROVIDERS.find(p => p.name.toLowerCase() === offer.providerName.toLowerCase());
                                            const offProvId = providerData?.id || PROVIDERS[0]?.id;
                                            const offProvIcon = providerData?.icon || '🍽️';
                                            const offItemId = \`\${offProvId}__\${dish.dishName}\`;
                                            const offCartItem = cartItems.find(item => item.id === offItemId);
                                            const offQty = offCartItem ? offCartItem.quantity : 0;
                                            const isConnected = connectedProviders.includes(offProvId);
                                            
                                            // The final payable price might be lower if connected.
                                            const rawPrice = offer.menuPrice || offer.price?.basePrice || offer.price?.finalPayablePrice || 0;
                                            const finalPrice = offer.price?.finalPayablePrice || rawPrice;
                                            
                                            return (
                                                <View key={oIdx} style={[styles.offerItem, oIdx === 0 && styles.offerItemWinner]}>
                                                    <View style={styles.offerMainInfo}>
                                                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                                                            <Text style={{fontSize: 16}}>{offProvIcon}</Text>
                                                            <Text style={styles.offerProvider}>{offer.providerName}</Text>
                                                        </View>
                                                        
                                                        {/* Price logic handling based on connections */}
                                                        {isConnected ? (
                                                            <View>
                                                                {rawPrice > finalPrice ? (
                                                                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                                                                        <Text style={{textDecorationLine: 'line-through', color: '#94a3b8', fontSize: 13}}>₹{rawPrice}</Text>
                                                                        <Text style={styles.offerPrice}>₹{finalPrice}</Text>
                                                                    </View>
                                                                ) : (
                                                                    <Text style={styles.offerPrice}>₹{finalPrice}</Text>
                                                                )}
                                                                {offer.couponCode ? (
                                                                    <Text style={{color: '#16a34a', fontSize: 11, fontWeight: 'bold'}}>
                                                                        ✔ {offer.couponCode} Applied
                                                                    </Text>
                                                                ) : null}
                                                            </View>
                                                        ) : (
                                                            <View>
                                                                <Text style={styles.offerPrice}>₹{rawPrice}</Text>
                                                                <Text style={{color: '#eab308', fontSize: 11, fontStyle: 'italic', maxWidth: 160}}>
                                                                    🔗 Connect {offer.providerName} for coupon discounts!
                                                                </Text>
                                                            </View>
                                                        )}
                                                    </View>
                                                    
                                                    <View style={styles.cartActionContainer}>
                                                        {oIdx === 0 && dish.offers.length > 1 && dish.offers[1].price?.finalPayablePrice && (
                                                            <Text style={styles.offerSavingsText}>
                                                                Save ₹{(dish.offers[1].price?.finalPayablePrice || 0) - (offer.price?.finalPayablePrice || 0)}
                                                            </Text>
                                                        )}
                                                        {offQty === 0 ? (
                                                            <TouchableOpacity
                                                                style={styles.addToCartBtn}
                                                                onPress={() => handleAddToCart(offer, dish.dishName)}
                                                            >
                                                                <Text style={styles.addToCartBtnText}>+ ADD</Text>
                                                            </TouchableOpacity>
                                                        ) : (
                                                            <View style={styles.stepperContainer}>
                                                                <TouchableOpacity style={styles.stepperBtn} onPress={() => handleUpdateCartQty(offItemId, offQty - 1)}>
                                                                    <Text style={styles.stepperBtnText}>-</Text>
                                                                </TouchableOpacity>
                                                                <Text style={styles.stepperQtyText}>{offQty}</Text>
                                                                <TouchableOpacity style={styles.stepperBtn} onPress={() => handleUpdateCartQty(offItemId, offQty + 1)}>
                                                                    <Text style={styles.stepperBtnText}>+</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                        )}
                                                    </View>
                                                </View>
                                            );
                                        })}
                                    </View>
                                );
                            })}`;


let extractionStart = content.indexOf('{displayDishes.map((dish: any, dIdx: number) => {');
if (extractionStart !== -1) {
    let before = content.substring(0, extractionStart);
    // Find the end of this mapping block. We'll search for `})}` after the start index.
    let count = 0;
    let endIdx = -1;
    for(let i = extractionStart; i < content.length; i++) {
        if(content[i] === '{') count++;
        else if (content[i] === '}') {
            count--;
            if(count === 0 && content[i+1] === '}') {
                endIdx = i + 1;
                break;
            }
        }
    }
    
    if (endIdx !== -1) {
        // Also we have `})}` so it might be endIdx + 1
        const after = content.substring(endIdx + 2); // after the final }
        content = before + dishesNew + after;
        fs.writeFileSync(path, content);
        console.log('App.tsx UI redesign patched successfully');
    } else {
        console.log('Could not find block end');
    }
} else {
    console.log('Could not find block start');
}
