const fs = require('fs');

const path = 'C:\\\\Users\\\\HP\\\\.gemini\\\\antigravity\\\\worktrees\\\\app\\\\integrate_account_data_comparison\\\\apps\\\\mobile\\\\App.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Replace expandedPlatformGroups with selectedMenuRest
content = content.replace(
    'const [expandedPlatformGroups, setExpandedPlatformGroups] = useState<{ [key: string]: boolean }>({});',
    'const [selectedMenuRest, setSelectedMenuRest] = useState<any>(null);'
);

// 2. Remove isExpanded logic from the render loop
// Let's find where the loop starts
let loopStart = content.indexOf('{results.map((restGroup, index) => {');
let isExpandedIndex = content.indexOf('const isExpanded =', loopStart);

if (isExpandedIndex !== -1) {
    let before = content.substring(0, isExpandedIndex);
    let after = content.substring(isExpandedIndex);
    
    // The isExpanded line is roughly:
    // const isExpanded = expandedPlatformGroups[k] || false;
    after = after.replace(/const isExpanded = .*?;\\s*/, '');
    content = before + after;
}

// 3. Find the exact button and replace the onPress and text
const oldBtn = `<TouchableOpacity 
                        style={styles.openMenuBtn}
                        onPress={() => setExpandedPlatformGroups(prev => ({ ...prev, [k]: !prev[k] }))}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.openMenuBtnText}>{isExpanded ? 'Hide Menu ▲' : 'Open Menu ▼'}</Text>
                    </TouchableOpacity>`;
                    
const newBtn = `<TouchableOpacity 
                        style={styles.openMenuBtn}
                        onPress={() => setSelectedMenuRest(restGroup)}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.openMenuBtnText}>View Menu / Prices</Text>
                    </TouchableOpacity>`;
                    
content = content.replace(oldBtn, newBtn);

// 4. Extract the dishesContainer block to move it to a Modal at the bottom
const extractStartStr = '{isExpanded && (\\n                        <View style={styles.dishesContainer}>';
// Wait, in my previous edit, there is no \n before {isExpanded, let's just find "{isExpanded && ("
const extractStart = content.indexOf('{isExpanded && (');

if (extractStart !== -1) {
    // Find matching bracket for {isExpanded && ( ... )}
    let count = 0;
    let extractEnd = -1;
    for(let i = extractStart; i < content.length; i++) {
        if(content[i] === '{') count++;
        if(content[i] === '}') {
            count--;
            // the block ends with } )} but let's be careful
            if(count === 0 && content[i-1] === ')') {
                extractEnd = i;
                break;
            }
        }
    }
    
    // Let's use string manipulation if bracket matching is tricky
    // I know the block ends with:
    /*
                                        })}
                                    </View>
                                );
                            })}
                        </View>
                    )}
    */
    const endStr = '                        </View>\\n                    )}';
    let extractEndStrPos = content.indexOf(endStr, extractStart);
    if (extractEndStrPos !== -1) {
        let beforeDishes = content.substring(0, extractStart);
        let dishesBlock = content.substring(extractStart, extractEndStrPos + endStr.length);
        let afterDishes = content.substring(extractEndStrPos + endStr.length);
        
        // Remove the block from its current location
        content = beforeDishes + afterDishes;
        
        // Clean up the dishesBlock to be used in our Modal
        // Remove {isExpanded && (
        let modalInner = dishesBlock.replace('{isExpanded && (', '').replace(/\\)$/, '').trim();
        // The modalInner ends with )} which needs to be cleaned up
        if (modalInner.endsWith('}')) {
             modalInner = modalInner.substring(0, modalInner.lastIndexOf('}'));
        }
        if (modalInner.endsWith(')')) {
             modalInner = modalInner.substring(0, modalInner.lastIndexOf(')'));
        }

        // We need to inject `displayDishes` logic inside the Modal, because `displayDishes` was calculated inside the `results.map`.
        // Inside the modal, `restGroup` is `selectedMenuRest`.
        const modalCode = `
      {/* Restaurant Menu Modal */}
      <Modal visible={!!selectedMenuRest} animationType="slide" transparent={true} onRequestClose={() => setSelectedMenuRest(null)}>
          <View style={{flex: 1, backgroundColor: '#f1f5f9', marginTop: 60, borderTopLeftRadius: 20, borderTopRightRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 10}}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, borderBottomWidth: 1, borderBottomColor: '#e2e8f0'}}>
                  <Text style={{fontSize: 20, fontWeight: 'bold', color: '#1e293b'}}>{selectedMenuRest?.restaurantName}</Text>
                  <TouchableOpacity onPress={() => setSelectedMenuRest(null)} style={{padding: 8, backgroundColor: '#f1f5f9', borderRadius: 20}}>
                      <Text style={{fontSize: 16, fontWeight: 'bold', color: '#64748b'}}>✕</Text>
                  </TouchableOpacity>
              </View>
              <ScrollView style={{flex: 1, padding: 16}}>
                  {selectedMenuRest && (() => {
                      let displayDishes = selectedMenuRest.dishes;
                      if (activeQuery) {
                          const exactMatches = selectedMenuRest.dishes.filter((d: any) => d.dishName.toLowerCase().includes(activeQuery));
                          if (exactMatches.length > 0) {
                              displayDishes = exactMatches;
                          }
                      }
                      return (
                          <View style={styles.dishesContainer}>
                              ${modalInner}
                          </View>
                      );
                  })()}
              </ScrollView>
          </View>
      </Modal>
`;
        
        // Insert it right before {/* Location Picker Modal */}
        const locModalIdx = content.indexOf('{/* Location Picker Modal */}');
        if (locModalIdx !== -1) {
            content = content.substring(0, locModalIdx) + modalCode + '\\n      ' + content.substring(locModalIdx);
        } else {
            // fallback, insert at end before final </View>
            const lastViewIdx = content.lastIndexOf('</View>');
            content = content.substring(0, lastViewIdx) + modalCode + '\\n' + content.substring(lastViewIdx);
        }
        
        fs.writeFileSync(path, content);
        console.log('App.tsx modal refactor successful');
    } else {
        console.log('Could not find endStr');
    }
} else {
    console.log('Could not find extractStart');
}
