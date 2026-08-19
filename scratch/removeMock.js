const fs = require('fs');
let content = fs.readFileSync('apps/mobile/App.tsx', 'utf8');

// The Mock block starts with:
// {!isSearching && results.length === 0 && searchCategory.toLowerCase() === 'food' && (
// And ends right before:
// <ScrollView style={styles.resultsContainer} contentContainerStyle={{ paddingBottom: totalCartCount > 0 ? 100 : 20 }}>

const startStr = `{!isSearching && results.length === 0 && searchCategory.toLowerCase() === 'food' && (`;
const startIndex = content.lastIndexOf(startStr);
const endStr = `<ScrollView style={styles.resultsContainer}`;
const endIndex = content.indexOf(endStr, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
    const blockToRemove = content.substring(startIndex, endIndex);
    content = content.replace(blockToRemove, '');
    console.log('Mock block removed!');
} else {
    console.log('Mock block not found!');
}

// Remove MOCK_RESTAURANTS array definition at the top
const mockArrayStart = `const MOCK_RESTAURANTS = [`;
const mockArrayStartIndex = content.indexOf(mockArrayStart);
if (mockArrayStartIndex !== -1) {
    const mockArrayEnd = `];\nexport default function App() {`;
    const mockArrayEndIndex = content.indexOf(mockArrayEnd, mockArrayStartIndex);
    if (mockArrayEndIndex !== -1) {
        const mockArrayBlock = content.substring(mockArrayStartIndex, mockArrayEndIndex + `];\n`.length);
        content = content.replace(mockArrayBlock, '');
        console.log('Mock array removed!');
    }
}

fs.writeFileSync('apps/mobile/App.tsx', content);
