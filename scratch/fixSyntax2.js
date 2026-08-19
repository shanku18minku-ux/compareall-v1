const fs = require('fs');
let content = fs.readFileSync('apps/mobile/App.tsx', 'utf8');

const regex = /<\/View>\s*\}\)\}\s*<\/View>\s*\)\;\s*\}\)\}\s*<\/View>\s*\)\;\s*\}\)\}\s*<\/View>\s*\)\;\s*\}\)\(\)\}\s*<\/ScrollView>/;

const matches = content.match(/<\/View>\s*\}\)\}\s*<\/View>\s*\)\;\s*\}\)\}\s*<\/View>\s*\)\;\s*\}\)\}\s*<\/View>\s*\)\;\s*\}\)\(\)\}\s*<\/ScrollView>/);
console.log(matches ? "Matched!" : "No match!");

// Let's just find the start of displayDishes.map
const mapStart = "{displayDishes.map((dish: any, dIdx: number) => {";
const mapStartIndex = content.indexOf(mapStart);
if (mapStartIndex !== -1) {
    // find the end of ScrollView
    const scrollEndIndex = content.indexOf("</ScrollView>", mapStartIndex);
    const brokenBlock = content.substring(mapStartIndex, scrollEndIndex + "</ScrollView>".length);
    console.log("Broken block length:", brokenBlock.length);
    
    // We have to preserve everything from mapStart to the end of the new dishCard!
    // The new dishCard ends with:
    //                                         </View>
    //                                     </View>
    const dishCardEnd = "                                     </View>\r\n";
    const lastDishCardEndIndex = brokenBlock.lastIndexOf(dishCardEnd);
    
    if (lastDishCardEndIndex !== -1) {
        const cleanBlock = brokenBlock.substring(0, lastDishCardEndIndex + dishCardEnd.length) + `                              );
                            })}
                        </View>
                          );
                      })()}
                  </ScrollView>`;
                  
        content = content.replace(brokenBlock, cleanBlock);
        fs.writeFileSync('apps/mobile/App.tsx', content);
        console.log("Replaced using substring logic!");
    } else {
        console.log("dishCardEnd not found");
    }
} else {
    console.log("mapStart not found");
}

