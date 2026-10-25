const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === '.git' || file === 'node_modules' || file === '.hugo-preview-cache' || file === 'themes') continue;
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walk(filePath, fileList);
    } else if (file.endsWith('.html') || file.endsWith('.md')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const allFiles = walk(ROOT_DIR);
const domains = new Set();
const airportUrls = new Set();

for (const filePath of allFiles) {
  const content = fs.readFileSync(filePath, 'utf8');
  const matches = content.match(/https?:\/\/[^\s"'<>\)]+/g) || [];
  for (const u of matches) {
    try {
      const parsed = new URL(u);
      domains.add(parsed.hostname);
    } catch(e) {}
  }
}

console.log('All domains found in markdown and html files:');
console.log(Array.from(domains).sort());
