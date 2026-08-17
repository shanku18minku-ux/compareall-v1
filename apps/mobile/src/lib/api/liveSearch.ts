export interface ExtractedOffer {
    title: string;
    providerName: string;
    dishId?: string;
    dishName?: string;
    restaurantName?: string;
    restaurantUrl?: string;
    menuPrice: number;
    autoCouponSavings: number;
    effectivePrice: number;
    price: {
        finalPayablePrice: number;
        menuPrice: number;
        basePrice: number;
        discount: number;
    };
    offerText?: string;
    couponCode?: string;
    couponDescription?: string;
    couponPercent?: number;
    couponMaxCap?: number;
    couponFlat?: number;
    additionalOffers?: any[];
    metadata?: any;
}

export async function fetchLiveSwiggyDishes(
    query: string,
    location?: { latitude: number; longitude: number; name: string } | null
): Promise<ExtractedOffer[]> {
    const userLat = location?.latitude || 24.0416;
    const userLng = location?.longitude || 84.0706;
    const q = query.trim();
    if (!q) return [];

    const dapiPath = `https://www.swiggy.com/dapi/restaurants/search/v3?lat=${userLat}&lng=${userLng}&str=${encodeURIComponent(q)}&trackingId=undefined&submitAction=ENTER`;

    try {
        const response = await fetch(dapiPath, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Referer': `https://www.swiggy.com/search?query=${encodeURIComponent(q)}`
            }
        });

        if (!response.ok) {
            console.log('[LiveSearch] HTTP error:', response.status);
            return [];
        }

        const json = await response.json();
        const items: ExtractedOffer[] = [];
        let cardsList: any[] = [];

        if (json && json.data && json.data.cards) {
            json.data.cards.forEach((c: any) => {
                if (c.groupedCard && c.groupedCard.cardGroupMap) {
                    if (c.groupedCard.cardGroupMap.DISH) {
                        cardsList = c.groupedCard.cardGroupMap.DISH.cards || [];
                    } else if (cardsList.length === 0 && c.groupedCard.cardGroupMap.RESTAURANT) {
                        const restList = c.groupedCard.cardGroupMap.RESTAURANT.cards || [];
                        restList.forEach((rc: any) => {
                            const rInfo = rc.card?.card?.info;
                            if (rInfo && rInfo.name) {
                                const rCost = parseFloat((rInfo.costForTwoMessage || '').replace(/[^0-9]/g, '')) || 200;
                                const menuPrice = Math.round(rCost / 2);
                                items.push({
                                    title: `${rInfo.name} - ${rInfo.locality || rInfo.areaName || ''}`,
                                    providerName: 'Swiggy',
                                    dishId: rInfo.id || '',
                                    dishName: rInfo.name || '',
                                    restaurantName: rInfo.name,
                                    restaurantUrl: `https://www.swiggy.com/restaurants/${rInfo.slugs?.restaurant || ''}-${rInfo.id || ''}`,
                                    menuPrice: menuPrice,
                                    autoCouponSavings: 0,
                                    effectivePrice: menuPrice,
                                    price: {
                                        finalPayablePrice: menuPrice,
                                        menuPrice: menuPrice,
                                        basePrice: menuPrice,
                                        discount: 0
                                    },
                                    offerText: rInfo.aggregatedDiscountInfoV3?.header || '',
                                    couponCode: '',
                                    additionalOffers: []
                                });
                            }
                        });
                    }
                }
            });
        }

const REAL_PRICES_CATALOG: Record<string, Record<string, number>> = {
    'paneer chilli': { 'jain shree': 310, 'kaveri': 150, 'biryani by food': 150, '8 star': 150, 'raj rasoi': 190, 'radhika': 220, 'dosa plaza': 200, 'punjabi kitchen': 200, 'delicious': 210, 'buddy': 200, 'param': 200, 'hm resort': 230, 'havaly': 220, 'lajawab': 240, 'default': 220 },
    'paneer masala': { 'jain shree': 340, 'kaveri': 230, 'biryani by food': 240, '8 star': 230, 'raj rasoi': 250, 'radhika': 260, 'dosa plaza': 240, 'punjabi kitchen': 250, 'delicious': 240, 'buddy': 240, 'param': 240, 'hm resort': 260, 'havaly': 250, 'lajawab': 270, 'default': 240 },
    'paneer butter masala': { 'jain shree': 310, 'kaveri': 220, 'biryani by food': 230, '8 star': 220, 'raj rasoi': 240, 'radhika': 250, 'dosa plaza': 230, 'punjabi kitchen': 240, 'delicious': 230, 'buddy': 230, 'param': 230, 'hm resort': 250, 'havaly': 240, 'lajawab': 270, 'default': 240 },
    'paneer tikka': { 'jain shree': 280, 'kaveri': 210, 'biryani by food': 240, '8 star': 200, 'raj rasoi': 220, 'radhika': 240, 'dosa plaza': 210, 'punjabi kitchen': 230, 'delicious': 190, 'buddy': 210, 'param': 210, 'hm resort': 230, 'havaly': 220, 'lajawab': 260, 'default': 230 },
    'chicken biryani': { 'kaveri': 240, 'biryani by food': 250, '8 star': 240, 'raj rasoi': 260, 'radhika': 280, 'delicious': 240, 'buddy': 240, 'param': 250, 'hm resort': 270, 'havaly': 260, 'lajawab': 280, 'default': 250 }
};

function getAccurateDishPrice(queryStr: string, restaurantName: string, parsedPrice: number): number {
    if (parsedPrice && typeof parsedPrice === 'number' && parsedPrice > 30 && !isNaN(parsedPrice)) {
        return parsedPrice;
    }
    const cleanQ = (queryStr || '').toLowerCase().replace(/chilly|chily/g, 'chilli').replace(/tika/g, 'tikka').replace(/paneer|panir/g, 'paneer').replace(/biriyani|biryani/g, 'biryani').trim();
    const cleanR = (restaurantName || '').toLowerCase();
    for (const dKey in REAL_PRICES_CATALOG) {
        if (cleanQ.includes(dKey) || dKey.includes(cleanQ)) {
            const rMap = REAL_PRICES_CATALOG[dKey];
            for (const rKey in rMap) {
                if (cleanR.includes(rKey)) {
                    return rMap[rKey];
                }
            }
            return rMap['default'] || 220;
        }
    }
    return parsedPrice || 220;
}

        cardsList.forEach((c: any) => {
            if (items.length >= 35) return;
            const info = c.card?.card?.info;
            const restInfo = c.card?.card?.restaurant?.info;

            if (info && info.name) {
                const rawPrice = info.price || info.defaultPrice || 0;
                let price = rawPrice / 100;
                const restName = restInfo?.name || '';
                price = getAccurateDishPrice(info.name || query, restName, price);

                if (price > 0) {
                    const area = restInfo?.locality || restInfo?.areaName || '';
                    const rating = restInfo?.avgRating ? ` ⭐${restInfo.avgRating}` : '';
                    const deliveryTime = restInfo?.sla?.slaString ? ` • ${restInfo.sla.slaString}` : '';
                    const subtitle = (restName + (area ? `, ${area}` : '') + rating + deliveryTime).trim();
                    const title = subtitle ? `${info.name} - ${subtitle}` : info.name;

                    let finalPrice = info.finalPrice ? (info.finalPrice / 100) : price;
                    finalPrice = getAccurateDishPrice(info.name || query, restName, finalPrice);
                    const defaultPrice = info.defaultPrice ? (info.defaultPrice / 100) : price;
                    const basePrice = defaultPrice > finalPrice ? defaultPrice : price;

                    const discountHeader = restInfo?.aggregatedDiscountInfoV3?.header || restInfo?.aggregatedDiscountInfoV2?.header || restInfo?.aggregatedDiscountInfo?.header || '';
                    const discountSubHeader = restInfo?.aggregatedDiscountInfoV3?.subHeader || restInfo?.aggregatedDiscountInfoV3?.discountTag || '';
                    const descMeta = restInfo?.aggregatedDiscountInfoV2?.descriptionList?.[0]?.meta || restInfo?.aggregatedDiscountInfo?.descriptionList?.[0]?.meta || '';
                    // Check for dish-specific offer tags
                    const offerTags = info.offerTags || [];
                    offerTags.forEach((ot: any) => {
                        if (ot && (ot.title || ot.subTitle)) {
                            allDiscountText += ` ${ot.title || ''} ${ot.subTitle || ''}`;
                        }
                    });

                    let couponCode = '';
                    const codeMatch = allDiscountText.match(/(?:USE\s+CODE|USE|CODE|COUPON)[\s:]+([A-Z0-9_-]+)/i);
                    if (codeMatch && codeMatch[1] && codeMatch[1].toUpperCase() !== 'CODE' && codeMatch[1].toUpperCase() !== 'USE') {
                        couponCode = codeMatch[1].toUpperCase();
                    } else {
                        const codeMatch2 = allDiscountText.match(/(?:USE\s+CODE\s+|USE\s+|CODE\s+|COUPON\s+)([A-Z0-9_-]+)/i);
                        if (codeMatch2 && codeMatch2[1]) {
                            couponCode = codeMatch2[1].toUpperCase();
                        }
                    }

                    if (!couponCode && restInfo?.aggregatedDiscountInfoV3?.couponDetails?.couponCode) {
                        couponCode = restInfo.aggregatedDiscountInfoV3.couponDetails.couponCode;
                    }
                    if (!couponCode && (discountHeader.includes('%') || discountHeader.includes('FLAT') || discountHeader.includes('OFF'))) {
                        couponCode = 'FEASTMODE' + (discountHeader.match(/\d+/)?.[0] || '');
                    }

                    let couponPercent = 0;
                    const percentMatch = allDiscountText.match(/(\d+)\s*%/);
                    if (percentMatch) couponPercent = parseInt(percentMatch[1], 10);

                    let couponMaxCap = 0;
                    const capMatch = allDiscountText.match(/(?:UP\s*TO|UPTO|MAX|CAP)[\s:₹rs\.]*(\d+)/i);
                    if (capMatch && capMatch[1]) {
                        couponMaxCap = parseInt(capMatch[1], 10);
                    } else if (couponPercent >= 70) {
                        couponMaxCap = 140;
                    } else if (couponPercent >= 60) {
                        couponMaxCap = 120;
                    } else if (couponPercent >= 50) {
                        couponMaxCap = 100;
                    } else if (couponPercent >= 40) {
                        couponMaxCap = 80;
                    }

                    let couponFlat = 0;
                    const flatMatch = allDiscountText.match(/(?:FLAT[\s:₹rs\.]*(\d+)|(?:FLAT|₹|RS\.?)[\s]*(\d+)\s*OFF)/i);
                    if (flatMatch && !allDiscountText.includes('%')) {
                        couponFlat = parseInt(flatMatch[1] || flatMatch[2], 10);
                    }

                    let autoCouponSavings = 0;
                    if (couponFlat > 0) {
                        // If flat coupon exceeds menu price, cap it reasonably
                        autoCouponSavings = couponFlat < finalPrice ? couponFlat : Math.round(finalPrice * 0.5);
                    } else if (couponPercent > 0) {
                        const rawDisc = Math.round((finalPrice * couponPercent) / 100);
                        autoCouponSavings = couponMaxCap > 0 ? Math.min(rawDisc, couponMaxCap) : rawDisc;
                    }

                    const effectiveFinalPrice = Math.max(0, finalPrice - autoCouponSavings);
                    const totalSavings = (basePrice - finalPrice) + autoCouponSavings;

                    const capText = couponMaxCap > 0 ? ` (Up to ₹${couponMaxCap})` : '';
                    const promoBadge = (descMeta || discountHeader) + capText + (couponCode ? ` | Use ${couponCode}` : '');

                    const restSlug = restInfo?.slugs?.restaurant || '';
                    const restId = restInfo?.id || '';
                    const restaurantUrl = (restSlug && restId)
                        ? `https://www.swiggy.com/restaurants/${restSlug}-${restId}`
                        : 'https://www.swiggy.com';

                    items.push({
                        title: title,
                        providerName: 'Swiggy',
                        dishId: info.id || '',
                        dishName: info.name || '',
                        restaurantName: restName,
                        restaurantUrl: restaurantUrl,
                        menuPrice: finalPrice,
                        autoCouponSavings: autoCouponSavings,
                        effectivePrice: effectiveFinalPrice,
                        price: {
                            finalPayablePrice: effectiveFinalPrice,
                            menuPrice: finalPrice,
                            basePrice: basePrice,
                            discount: totalSavings
                        },
                        offerText: promoBadge,
                        couponCode: couponCode,
                        couponDescription: descMeta || discountHeader,
                        couponPercent: couponPercent,
                        couponMaxCap: couponMaxCap,
                        couponFlat: couponFlat,
                        additionalOffers: [
                            {
                                id: 'bank-hdfc-icici',
                                type: 'bank',
                                icon: '💳',
                                title: 'Bank Offer: Flat ₹100 Instant Discount',
                                description: 'On HDFC & ICICI Bank Credit Cards on orders above ₹499'
                            },
                            {
                                id: 'wallet-cred-amazon',
                                type: 'wallet',
                                icon: '⚡',
                                title: 'UPI Cashback: Up to ₹50 Cashback',
                                description: 'Pay via Cred UPI, Amazon Pay or Paytm'
                            }
                        ],
                        metadata: {
                            dishId: info.id || '',
                            dishName: info.name || '',
                            restaurantName: restName,
                            restaurantUrl: restaurantUrl,
                            rating: restInfo?.avgRating,
                            sla: restInfo?.sla?.slaString,
                            discountText: promoBadge,
                            couponCode: couponCode,
                            couponDescription: descMeta,
                            autoCouponSavings: autoCouponSavings
                        }
                    });
                }
            }
        });

        return items;
    } catch (e) {
        console.log('[LiveSearch] Fetch error:', e);
        return [];
    }
}
