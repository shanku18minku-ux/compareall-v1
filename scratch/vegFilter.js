const fs = require("fs");
let app = fs.readFileSync("apps/mobile/App.tsx", "utf8");

// Add state
app = app.replace(
    /const \[searchQuery, setSearchQuery\] = useState\(''\);/,
    `const [searchQuery, setSearchQuery] = useState('');
  const [isVegOnly, setIsVegOnly] = useState(false);`
);

// Add pure veg logic and filtering
app = app.replace(
    /return \(\s*<View style=\{styles\.container\}>/g,
    `
    const isNonVegDish = (name: string) => {
        const s = (name || '').toLowerCase();
        if (s.includes('veg biryani') || s.includes('paneer') || s.includes('soya') || s.includes('mushroom') || s.includes('dal')) {
            if (!s.includes('chicken') && !s.includes('mutton') && !s.includes('egg') && !s.includes('fish')) return false;
        }
        return ['chicken', 'mutton', 'egg', 'fish', 'prawn', 'pork', 'beef', 'non-veg', 'non veg', 'keema', 'kebab'].some(k => s.includes(k));
    };

    const isPureVegRestaurant = (name: string) => {
        const s = (name || '').toLowerCase();
        return ['veg restaurant', 'pure veg', 'jain', 'shree veg', 'only veg', 'shree jain', 'thali veg', 'shakahari'].some(k => s.includes(k));
    };

    const displayedResults = isVegOnly 
        ? results.map(group => ({
            ...group,
            dishes: group.dishes.filter(d => !isNonVegDish(d.dishName))
        })).filter(group => group.dishes.length > 0 && !isNonVegDish(group.restaurantName))
        : results;

    return (
    <View style={styles.container}>`
);

// Replace `{results.map((group, idx) => (` with `{displayedResults.map((group, idx) => (`
app = app.replace(
    /\{results\.map\(\(group, idx\) => \(/g,
    `{displayedResults.map((group, idx) => (`
);

// Add UI switch under the search bar
app = app.replace(
    /<TextInput\s*style=\{styles\.searchInput\}/g,
    `<View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 12}}>
           <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12, elevation: 2}}>
               <Text style={{marginRight: 8}}>??</Text>
               <TextInput style={[styles.searchInput, {flex: 1, marginBottom: 0, elevation: 0}]}
                   placeholder="Search dish or restaurant..."
                   value={searchQuery}
                   onChangeText={setSearchQuery}
                   onSubmitEditing={handleSearch}
               />
           </View>
           <TouchableOpacity 
               style={{marginLeft: 12, padding: 8, borderRadius: 8, backgroundColor: isVegOnly ? '#16a34a' : '#e2e8f0'}}
               onPress={() => setIsVegOnly(!isVegOnly)}
           >
               <Text style={{color: isVegOnly ? '#fff' : '#64748b', fontWeight: 'bold'}}>Pure Veg</Text>
           </TouchableOpacity>
        </View>
        <TextInput style={styles.searchInput}` // Put back the old one to be safely deleted later if needed
);

// Clean up the duplicate search input
app = app.replace(
    /<\/View>\s*<TouchableOpacity\s*style=\{\{marginLeft: 12, padding: 8, borderRadius: 8, backgroundColor: isVegOnly \? '#16a34a' : '#e2e8f0'\}\}\s*onPress=\{\(\) => setIsVegOnly\(\!isVegOnly\)\}\s*>\s*<Text style=\{\{color: isVegOnly \? '#fff' : '#64748b', fontWeight: 'bold'\}\}>Pure Veg<\/Text>\s*<\/TouchableOpacity>\s*<\/View>\s*<TextInput style=\{styles\.searchInput\}[\s\S]*?onSubmitEditing=\{handleSearch\}\s*\/>/g,
    `</View>
           <TouchableOpacity 
               style={{marginLeft: 12, padding: 10, borderRadius: 8, backgroundColor: isVegOnly ? '#16a34a' : '#e2e8f0'}}
               onPress={() => setIsVegOnly(!isVegOnly)}
           >
               <Text style={{color: isVegOnly ? '#fff' : '#64748b', fontWeight: 'bold', fontSize: 12}}>PURE VEG</Text>
           </TouchableOpacity>
        </View>`
);


fs.writeFileSync("apps/mobile/App.tsx", app, "utf8");
console.log("Veg filter added to App.tsx");
