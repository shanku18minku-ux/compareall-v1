export const EatClubPacket = {
    id: 'eatclub',
    name: 'EatClub',
    category: 'Food',
    subcategory: 'Food Delivery',
    url: 'https://www.eatclub.com/',
    regions: ['all'],
    getSearchUrl: (query: string) => `https://www.eatclub.com/search?q=${encodeURIComponent(query)}`,
    getExtractorInjection: () => ``,
    parseExtraction: () => []
};
