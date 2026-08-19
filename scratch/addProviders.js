const fs = require('fs');
let content = fs.readFileSync('apps/mobile/src/lib/packets/registry.ts', 'utf8');

const newProviders = `
    {
        id: 'food-eatclub',
        name: 'EatClub',
        category: 'Food',
        subcategory: 'Food Delivery',
        icon: '??',
        brandColor: '#ff0000',
        authType: 'otp',
        url: 'https://eatclub.in',
        loginUrl: 'https://eatclub.in',
        checkoutUrl: 'https://eatclub.in/cart',
        actionTitle: 'Order on EatClub',
        desc: 'Save 30% every time',
        regions: ['all']
    },
    {
        id: 'food-toing',
        name: 'Toing',
        category: 'Food',
        subcategory: 'Food Delivery',
        icon: '??',
        brandColor: '#00cc00',
        authType: 'otp',
        url: 'https://toing.in',
        loginUrl: 'https://toing.in',
        checkoutUrl: 'https://toing.in/cart',
        actionTitle: 'Order on Toing',
        desc: 'Local food',
        regions: ['all']
    },
    {
        id: 'food-ownly',
        name: 'Ownly',
        category: 'Food',
        subcategory: 'Food Delivery',
        icon: '??',
        brandColor: '#ff9900',
        authType: 'otp',
        url: 'https://ownly.in',
        loginUrl: 'https://ownly.in',
        checkoutUrl: 'https://ownly.in/cart',
        actionTitle: 'Order on Ownly',
        desc: 'Best delivery',
        regions: ['all']
    },
`;

content = content.replace("export const ALL_INTEGRATED_PROVIDERS: ProviderMetadata[] = [", "export const ALL_INTEGRATED_PROVIDERS: ProviderMetadata[] = [" + newProviders);

content = content.replace("[EatSurePacket.metadata.id]: EatSurePacket,", "[EatSurePacket.metadata.id]: EatSurePacket,\n    [EatClubPacket.id]: EatClubPacket,\n    [ToingPacket.id]: ToingPacket,\n    [OwnlyPacket.id]: OwnlyPacket,");

fs.writeFileSync('apps/mobile/src/lib/packets/registry.ts', content);
console.log('Registry added new providers!');
