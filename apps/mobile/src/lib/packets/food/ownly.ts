export const OwnlyPacket = {
    id: 'ownly',
    name: 'Ownly',
    category: 'Food',
    subcategory: 'Food Delivery',
    url: 'https://www.ownly.com/',
    regions: ['all'],
    getSearchUrl: (query: string) => `https://www.ownly.com/search?q=${encodeURIComponent(query)}`,
    getExtractorInjection: () => ``,
    parseExtraction: () => []
};
