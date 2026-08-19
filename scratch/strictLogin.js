const fs = require("fs");
let app = fs.readFileSync("apps/mobile/App.tsx", "utf8");

app = app.replace(
    /const activeProviders = \(PROVIDERS \|\| \[\]\)\.filter\(p => p && p\.category === activeCategory\);/g,
    `const activeProviders = (PROVIDERS || []).filter(p => p && p.category === activeCategory);
  
  const connectedCount = activeProviders.filter(p => connectedProviders.includes(p.id)).length;
  const isAllConnected = activeProviders.length > 0 && connectedCount === activeProviders.length;`
);

app = app.replace(
    /const renderExtractors = \(\) => \{/g,
    `const renderExtractors = () => {
      if (!isAllConnected) return null;`
);

// We need to inject the "Connect All Providers" screen into the Search Tab
app = app.replace(
    /\{activeTab === 'Search' && activeCategory === 'Food' && !selectedRest && \(/g,
    `{activeTab === 'Search' && activeCategory === 'Food' && !isAllConnected && (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20}}>
            <Text style={{fontSize: 50, marginBottom: 20}}>??</Text>
            <Text style={{fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, color: '#0f172a'}}>Connect All Apps</Text>
            <Text style={{fontSize: 16, textAlign: 'center', color: '#64748b', marginBottom: 30}}>
                To compare the lowest prices, you must login to all {activeProviders.length} food platforms first.
            </Text>
            <TouchableOpacity 
                style={{backgroundColor: '#ea580c', paddingVertical: 14, paddingHorizontal: 30, borderRadius: 12, elevation: 3}}
                onPress={() => setActiveTab('Connections')}
            >
                <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}>Go to Connections</Text>
            </TouchableOpacity>
        </View>
    )}
    
    {activeTab === 'Search' && activeCategory === 'Food' && isAllConnected && !selectedRest && (`
);

app = app.replace(
    /\{activeTab === 'Search' && activeCategory === 'Food' && selectedRest && \(/g,
    `{activeTab === 'Search' && activeCategory === 'Food' && isAllConnected && selectedRest && (`
);

// Also prevent the auto-search on mount if not connected
app = app.replace(
    /if \(activeTab === 'Search' && activeCategory === 'Food' && !searchQuery && results\.length === 0 && !isSearching\)/g,
    `if (activeTab === 'Search' && activeCategory === 'Food' && isAllConnected && !searchQuery && results.length === 0 && !isSearching)`
);

fs.writeFileSync("apps/mobile/App.tsx", app, "utf8");
console.log("Strict login enforcement added");
