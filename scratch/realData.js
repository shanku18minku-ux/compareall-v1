const fs = require('fs');
let content = fs.readFileSync('apps/mobile/App.tsx', 'utf8');

const target1 = `const activeQuery = apiSearchQuery || searchQuery || searchValues.query || '';
                   if (!activeQuery) return null; // No query ?" don't fire WebViews`;

const replacement1 = `const activeQuery = apiSearchQuery || searchQuery || searchValues.query || '';
                   const fetchQuery = activeQuery || (searchCategory.toLowerCase() === 'food' ? 'food' : '');
                   if (!fetchQuery) return null; // No query`;

content = content.replace(target1, replacement1);

// Update getSearchUrl / getExtractorInjection calls to use fetchQuery
content = content.replace(`const searchUrl = packet ? packet.getSearchUrl(activeQuery, location) : provider.url;`, `const searchUrl = packet ? packet.getSearchUrl(fetchQuery, location) : provider.url;`);
content = content.replace(`const injectionScript = packet ? packet.getExtractorInjection(searchUrl, activeQuery, location) : undefined;`, `const injectionScript = packet ? packet.getExtractorInjection(searchUrl, fetchQuery, location) : undefined;`);
content = content.replace(`key={id + '__' + activeQuery + '__' + searchNonce}`, `key={id + '__' + fetchQuery + '__' + searchNonce}`);

// Also we need to inject useEffect to trigger background search
const useEffectTarget = `const [results, setResults] = useState<any[]>([]);`;
const useEffectReplacement = `const [results, setResults] = useState<any[]>([]);

    useEffect(() => {
        if (activeTab === 'Search' && searchCategory.toLowerCase() === 'food' && results.length === 0 && !isSearching && !apiSearchQuery && !searchQuery) {
            setIsSearching(true);
            setSearchNonce(Date.now().toString());
            completedProvidersRef.current = new Set();
            if ((window as any).searchTimeoutTimer) clearTimeout((window as any).searchTimeoutTimer);
            (window as any).searchTimeoutTimer = setTimeout(() => {
                setIsSearching(false);
            }, 18000);
        }
    }, [activeTab, searchCategory]);`;

content = content.replace(useEffectTarget, useEffectReplacement);

// We need to replace the Mock restaurants block with the generic title "Restaurants near you"
// BUT wait, if results.length > 0 and NO activeQuery, we should show "Restaurants near you" above the results!
const resultsBlockTarget = `<ScrollView style={styles.resultsContainer} contentContainerStyle={{ paddingBottom: totalCartCount > 0 ? 100 : 20 }}>
              {results.map((restGroup, index) => {`;
const resultsBlockReplacement = `<ScrollView style={styles.resultsContainer} contentContainerStyle={{ paddingBottom: totalCartCount > 0 ? 100 : 20 }}>
              {!apiSearchQuery && !searchQuery && results.length > 0 && searchCategory.toLowerCase() === 'food' && (
                  <View style={{padding: 16, paddingBottom: 0}}>
                      <Text style={{fontSize: 18, fontWeight: 'bold', color: '#1e293b'}}>Restaurants near you</Text>
                  </View>
              )}
              {results.map((restGroup, index) => {`;

content = content.replace(resultsBlockTarget, resultsBlockReplacement);

fs.writeFileSync('apps/mobile/App.tsx', content);
console.log('App.tsx updated for real default fetch!');
