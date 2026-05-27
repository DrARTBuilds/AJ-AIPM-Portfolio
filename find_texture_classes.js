const fs = require('fs');
const path = require('path');

const JS_BAK_PATH = path.join(__dirname, 'assets', 'index-D_hQMIQo.js.bak');
const js = fs.readFileSync(JS_BAK_PATH, 'utf8');

function searchAll(pattern) {
  let idx = -1;
  const results = [];
  while ((idx = js.indexOf(pattern, idx + 1)) !== -1) {
    results.push(idx);
  }
  return results;
}

console.log("Searching for 'Texture'...");
const texIdxs = searchAll('Texture');
console.log(`Found ${texIdxs.length} occurrences:`, texIdxs.slice(0, 10));

console.log("Searching for 'CanvasTexture'...");
const ctIdxs = searchAll('CanvasTexture');
console.log(`Found ${ctIdxs.length} occurrences:`, ctIdxs);
if (ctIdxs.length > 0) {
  console.log(js.substring(ctIdxs[0] - 100, ctIdxs[0] + 100));
}
