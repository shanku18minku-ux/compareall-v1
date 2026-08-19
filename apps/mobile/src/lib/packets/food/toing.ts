export const ToingPacket = {
    id: 'toing',
    name: 'Toing',
    category: 'Food',
    subcategory: 'Food Delivery',
    url: 'https://www.toing.com/',
    regions: ['all'],
    getSearchUrl: (query: string) => `https://www.toing.com/search?q=${encodeURIComponent(query)}`,
    getExtractorInjection: () => ``,
    parseExtraction: () => []
};
