const fs = require('fs');
let app = fs.readFileSync('apps/mobile/App.tsx', 'utf8');

app = app.replace('const completedProvidersRef = useRef<Set<string>>(new Set());', 'const completedProvidersRef = useRef<Set<string>>(new Set());\n  const searchTimerRef = useRef<any>(null);');

app = app.replace(/if \(\(window as any\)\.searchTimer\) clearTimeout\(\(window as any\)\.searchTimer\);/g, 'if (searchTimerRef.current) clearTimeout(searchTimerRef.current);');
app = app.replace(/\(window as any\)\.searchTimer = setTimeout\(/g, 'searchTimerRef.current = setTimeout(');

fs.writeFileSync('apps/mobile/App.tsx', app);
console.log('App.tsx searchTimerRef fixed');
