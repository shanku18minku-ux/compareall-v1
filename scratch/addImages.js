const fs = require("fs");
let app = fs.readFileSync("apps/mobile/App.tsx", "utf8");

app = app.replace(
    /group = \{\s*id: \`rest_\$\{Date\.now\(\)\}_\$\{Math\.random\(\)\}\`,\s*restaurantName: restName \|\| 'Unknown',\s*dishes: \[\]\s*\};/g,
    "group = { id: `rest_${Date.now()}_${Math.random()}`, restaurantName: restName || 'Unknown', imageUrl: item.restaurantImage || item.imageUrl || '', dishes: [] };"
);
app = app.replace(
    /updated\.push\(group\);\s*\}/g,
    "updated.push(group);\n               } else if (!group.imageUrl && (item.restaurantImage || item.imageUrl)) {\n                   group.imageUrl = item.restaurantImage || item.imageUrl;\n               }"
);
app = app.replace(
    /dishEntry = \{ dishName, offers: \[\] \};/g,
    "dishEntry = { dishName, imageUrl: item.dishImage || item.imageUrl || '', offers: [] };"
);
app = app.replace(
    /group\.dishes\.push\(dishEntry\);\s*\}/g,
    "group.dishes.push(dishEntry);\n               } else if (!dishEntry.imageUrl && (item.dishImage || item.imageUrl)) {\n                   dishEntry.imageUrl = item.dishImage || item.imageUrl;\n               }"
);

app = app.replace(
    /<View style=\{styles\.restCardHeader\}>\s*<Text style=\{styles\.restName\}>\{group\.restaurantName\}<\/Text>\s*<Text style=\{styles\.openText\}>Open Now<\/Text>\s*<\/View>/g,
    "<View style={styles.restCardHeader}>\n                                       {group.imageUrl ? <Image source={{uri: group.imageUrl}} style={{width: 50, height: 50, borderRadius: 8, marginRight: 12}} /> : null}\n                                       <View style={{flex: 1}}>\n                                           <Text style={styles.restName}>{group.restaurantName}</Text>\n                                           <Text style={styles.openText}>Open Now</Text>\n                                       </View>\n                                   </View>"
);

app = app.replace(
    /<View key=\{dIdx\} style=\{styles\.dishCard\}>\s*<Text style=\{styles\.dishName\}>\{dish\.dishName\}<\/Text>/g,
    "<View key={dIdx} style={styles.dishCard}>\n                               <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>\n                                   <Text style={[styles.dishName, {flex: 1}]}>{dish.dishName}</Text>\n                                   {dish.imageUrl ? <Image source={{uri: dish.imageUrl}} style={{width: 70, height: 70, borderRadius: 8, marginLeft: 12}} /> : null}\n                               </View>"
);

fs.writeFileSync("apps/mobile/App.tsx", app, "utf8");
console.log("App.tsx Images Added");
