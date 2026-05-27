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

console.log("Searching for '_W'...");
const wIdxs = searchAll('_W');
console.log(`Found ${wIdxs.length} occurrences:`, wIdxs);
wIdxs.forEach((idx, i) => {
  console.log(`\n--- _W #${i} (index ${idx}) ---`);
  console.log(js.substring(idx - 100, idx + 100));
});
