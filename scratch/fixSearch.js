const fs = require("fs");
let app = fs.readFileSync("apps/mobile/App.tsx", "utf8");

// We have this block currently:
// <View style={styles.searchContainer}>
//     <Text style={styles.searchIcon}>dY"?</Text>
//     <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 12}}>
//         <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12, elevation: 2}}>
//             <Text style={{marginRight: 8}}>??</Text>
//             <TextInput style={[styles.searchInput, {flex: 1, marginBottom: 0, elevation: 0}]} ... />
//         </View>
//         <TouchableOpacity ...>Pure Veg</TouchableOpacity>
//     </View>
//     <TextInput style={styles.searchInput} ... />

// Let's replace the whole search container to be clean.
app = app.replace(
    /<View style=\{styles\.searchContainer\}>[\s\S]*?returnKeyType="search"\s*\/>\s*<\/View>/,
    `<View style={[styles.searchContainer, {flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent', elevation: 0, padding: 0}]}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 16, elevation: 2}}>
              <Text style={styles.searchIcon}>??</Text>
              <TextInput 
                  style={[styles.searchInput, {flex: 1, marginBottom: 0, elevation: 0, backgroundColor: 'transparent'}]}
                  placeholder="Search restaurants or dishes..."
                  defaultValue={searchQuery}
                  onSubmitEditing={(e) => { setSearchQuery(e.nativeEvent.text); handleSearch(e.nativeEvent.text); }}
                  returnKeyType="search"
              />
          </View>
          <TouchableOpacity 
              style={{marginLeft: 12, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, backgroundColor: isVegOnly ? '#16a34a' : '#fff', elevation: 2, borderWidth: 1, borderColor: isVegOnly ? '#16a34a' : '#e2e8f0'}}
              onPress={() => setIsVegOnly(!isVegOnly)}
          >
              <Text style={{color: isVegOnly ? '#fff' : '#16a34a', fontWeight: '900', fontSize: 14}}>VEG</Text>
          </TouchableOpacity>
      </View>`
);

fs.writeFileSync("apps/mobile/App.tsx", app, "utf8");
console.log("Search container fixed");
