const normalizeStr = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

const swiggyItem = {
    title: "PIZZA - Domino's Pizza",
    providerName: 'Swiggy',
    dishName: 'PIZZA',
    restaurantName: "Domino's Pizza",
    price: { finalPayablePrice: 150 }
};

const zomatoItem = {
    title: "PIZZA - Domino's Pizza",
    providerName: 'Zomato',
    dishName: 'PIZZA',
    restaurantName: "Domino's Pizza",
    price: { finalPayablePrice: 160 }
};

let updated = [];

function handleItem(offerPayload) {
    const parts = offerPayload.title.split(' - ');
    const dishName = parts[0] || offerPayload.title;
    const restName = offerPayload.restaurantName || (parts[1] ? parts[1] : 'Unknown Restaurant');
    const providerName = offerPayload.providerName;
    
    const restMatchKey = normalizeStr(restName || 'Unknown Restaurant');
    
    let restGroup = updated.find(g => {
        const existingKey = normalizeStr(g.restaurantName);
        return existingKey.includes(restMatchKey) || restMatchKey.includes(existingKey);
    });
    
    if (!restGroup) {
        restGroup = {
            restaurantName: restName,
            platforms: [],
            dishes: []
        };
        updated.push(restGroup);
    }
    
    if (!restGroup.platforms.includes(providerName)) {
        restGroup.platforms.push(providerName);
    }
    
    const dishMatchKey = normalizeStr(dishName || 'Unknown Dish');
    let dishGroup = restGroup.dishes.find(d => {
        const existingDishKey = normalizeStr(d.dishName);
        const isFuzzyMatch = existingDishKey.includes(dishMatchKey) || dishMatchKey.includes(existingDishKey);
        if (!isFuzzyMatch) return false;
        
        const existingOffer = d.offers.find(o => o.providerName === providerName);
        if (existingOffer) {
            const existingPrice = existingOffer.price?.finalPayablePrice || existingOffer.menuPrice;
            const newPrice = offerPayload.price?.finalPayablePrice || offerPayload.menuPrice;
            if (existingPrice === newPrice) return true;
            return false;
        }
        return true;
    });
    
    if (!dishGroup) {
        dishGroup = {
            dishName: dishName,
            offers: []
        };
        restGroup.dishes.push(dishGroup);
    }
    
    const isDuplicate = dishGroup.offers.some(o => {
        const p1 = o.price?.finalPayablePrice || o.menuPrice;
        const p2 = offerPayload.price?.finalPayablePrice || offerPayload.menuPrice;
        return o.providerName === providerName && p1 === p2;
    });
    
    if (!isDuplicate) {
        dishGroup.offers.push(offerPayload);
    }
}

handleItem(swiggyItem);
handleItem(zomatoItem);

console.log(JSON.stringify(updated, null, 2));
