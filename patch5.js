const fs = require('fs');

const path = 'C:\\\\Users\\\\HP\\\\.gemini\\\\antigravity\\\\worktrees\\\\app\\\\integrate_account_data_comparison\\\\apps\\\\mobile\\\\App.tsx';
let content = fs.readFileSync(path, 'utf8');

const isExpandedStart = '{isExpanded && (\\n                        <View style={styles.dishesContainer}>';
// It might be indented differently or have no newline.
const blockStartIdx = content.indexOf('{isExpanded && (');
if (blockStartIdx === -1) {
    console.error("Could not find {isExpanded && (");
    process.exit(1);
}

const endStr = '                        </View>\\n                    )}';
const blockEndIdx = content.indexOf(endStr, blockStartIdx);
if (blockEndIdx === -1) {
    console.error("Could not find block end string");
    process.exit(1);
}

// Extract block
const beforeBlock = content.substring(0, blockStartIdx);
const blockContent = content.substring(blockStartIdx, blockEndIdx + endStr.length);
const afterBlock = content.substring(blockEndIdx + endStr.length);

let modalInner = blockContent.replace('{isExpanded && (', '').trim();
if (modalInner.endsWith(')}')) {
    modalInner = modalInner.substring(0, modalInner.length - 2);
}

// Remove it from current place
content = beforeBlock + afterBlock;

// Now add the modal code
const modalCode = `
      {/* Restaurant Menu Modal */}
      <Modal visible={!!selectedMenuRest} animationType="slide" transparent={true} onRequestClose={() => setSelectedMenuRest(null)}>
          <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end'}}>
              <View style={{flex: 0.9, backgroundColor: '#f8fafc', borderTopLeftRadius: 24, borderTopRightRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 10}}>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, borderBottomWidth: 1, borderBottomColor: '#e2e8f0'}}>
                      <Text style={{fontSize: 20, fontWeight: 'bold', color: '#1e293b'}}>{selectedMenuRest?.restaurantName}</Text>
                      <TouchableOpacity onPress={() => setSelectedMenuRest(null)} style={{padding: 8, backgroundColor: '#f1f5f9', borderRadius: 20}}>
                          <Text style={{fontSize: 16, fontWeight: 'bold', color: '#64748b'}}>✕</Text>
                      </TouchableOpacity>
                  </View>
                  <ScrollView style={{flex: 1, padding: 16}}>
                      {selectedMenuRest && (() => {
                          let displayDishes = selectedMenuRest.dishes;
                          const activeQuery = (apiSearchQuery || searchQuery || searchValues.query || '').toLowerCase().trim();
                          if (activeQuery) {
                              const exactMatches = selectedMenuRest.dishes.filter((d: any) => d.dishName.toLowerCase().includes(activeQuery));
                              if (exactMatches.length > 0) {
                                  displayDishes = exactMatches;
                              }
                          }
                          return (
                              ${modalInner}
                          );
                      })()}
                  </ScrollView>
              </View>
          </View>
      </Modal>
`;

const locModalIdx = content.indexOf('{/* Location Picker Modal */}');
if (locModalIdx !== -1) {
    content = content.substring(0, locModalIdx) + modalCode + '\\n      ' + content.substring(locModalIdx);
    fs.writeFileSync(path, content);
    console.log("Modal moved successfully.");
} else {
    console.error("Could not find {/* Location Picker Modal */} to insert.");
}
