const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === '.git' || file === 'node_modules' || file === '.hugo-preview-cache') continue;
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
const linkStats = {};
const fileStats = {};

const targetKeywords = ['aff', 'code=', 'yunjiexian', 'dalaoyun', 'huanqiuti', 'liulianyun', 'shenxing', 'shandianshu'];

for (const filePath of allFiles) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relPath = path.relative(ROOT_DIR, filePath).replace(/\\/g, '/');

  // Regex for HTML href
  const hrefRegex = /href=["']([^"']+)["']/gi;
  let match;
  while ((match = hrefRegex.exec(content)) !== null) {
    const url = match[1];
    if (url.startsWith('http') && !url.includes('mofaclashjichang.com') && !url.includes('linkedin') && !url.includes('twitter') && !url.includes('facebook') && !url.includes('whatsapp') && !url.includes('reddit') && !url.includes('pinterest') && !url.includes('line.me') && !url.includes('bsky.app')) {
      if (targetKeywords.some(kw => url.toLowerCase().includes(kw))) {
        linkStats[url] = (linkStats[url] || 0) + 1;
        if (!fileStats[relPath]) fileStats[relPath] = [];
        fileStats[relPath].push({ type: 'html', url });
      }
    }
  }

  // Regex for Markdown links [text](url)
  const mdRegex = /\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/gi;
  while ((match = mdRegex.exec(content)) !== null) {
    const url = match[2];
    if (url.startsWith('http') && !url.includes('mofaclashjichang.com') && !url.includes('linkedin') && !url.includes('twitter') && !url.includes('facebook') && !url.includes('whatsapp') && !url.includes('reddit') && !url.includes('pinterest') && !url.includes('line.me') && !url.includes('bsky.app')) {
      if (targetKeywords.some(kw => url.toLowerCase().includes(kw))) {
        linkStats[url] = (linkStats[url] || 0) + 1;
        if (!fileStats[relPath]) fileStats[relPath] = [];
        fileStats[relPath].push({ type: 'md', url });
      }
    }
  }
}

console.log('--- FOUND UNIQUE AFF URLS ---');
console.log(JSON.stringify(linkStats, null, 2));

console.log('\n--- FILES CONTAINING AFF URLS ---');
for (const [f, links] of Object.entries(fileStats)) {
  console.log(`${f}: ${links.length} occurrences`);
}
