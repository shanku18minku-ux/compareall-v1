const fs = require('fs');
let content = fs.readFileSync('apps/mobile/App.tsx', 'utf8');

const mapStart = "{displayDishes.map((dish: any, dIdx: number) => {";
const mapStartIndex = content.indexOf(mapStart);

if (mapStartIndex !== -1) {
    const scrollEndIndex = content.indexOf("</ScrollView>", mapStartIndex);
    const brokenBlock = content.substring(mapStartIndex, scrollEndIndex + "</ScrollView>".length);
    
    // We want the block from mapStart to the end of the new dishCard!
    // The new dishCard ends with:
    //                                         </View>
    //                                     </View>
    const dishCardEnd = "                                     </View>";
    const lastDishCardEndIndex = brokenBlock.lastIndexOf(dishCardEnd);
    
    if (lastDishCardEndIndex !== -1) {
        // Just rebuild the end from the last dish card!
        const correctEnd = `                                     </View>
                                  );
                               })}
                               </View>
                            );
                        })()}
                    </ScrollView>`;
        
        const cleanBlock = brokenBlock.substring(0, lastDishCardEndIndex + dishCardEnd.length) + "\r\n" + correctEnd;
        
        content = content.replace(brokenBlock, cleanBlock);
        fs.writeFileSync('apps/mobile/App.tsx', content);
        console.log("Replaced perfectly!");
    } else {
        console.log("dishCardEnd not found");
    }
} else {
    console.log("mapStart not found");
}
