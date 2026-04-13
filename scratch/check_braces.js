const fs = require('fs');
const content = fs.readFileSync('apps/web/src/lib/blog-articles.ts', 'utf8');
const lines = content.split('\n');
let depth = 0;
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line === undefined) break;
    const opens = (line.match(/\{/g) || []).length;
    const closes = (line.match(/\}/g) || []).length;
    depth += opens;
    depth -= closes;
    if (i >= 480 && i < 580) {
        console.log(`${i + 1}: depth ${depth} | ${line.trim().substring(0, 100)}`);
    }
}






