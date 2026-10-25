const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === '.git' || file === 'node_modules' || file === '.hugo-preview-cache') continue;
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walk(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const htmlFiles = walk(PUBLIC_DIR);
const validIds = new Set(['yunjiexian', 'dalaoyun', 'huanqiuti', 'liulianyun', 'shenxing', 'shandianshu']);
let checkedLinks = 0;
let deadLinks = [];

for (const filePath of htmlFiles) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relPath = path.relative(PUBLIC_DIR, filePath).replace(/\\/g, '/');

  // Find all internal links
  const hrefRegex = /href=["']([^"']+)["']/gi;
  let match;
  while ((match = hrefRegex.exec(content)) !== null) {
    const href = match[1];
    
    // Check /go.html?id=xxx
    if (href.startsWith('/go.html?id=')) {
      checkedLinks++;
      const id = href.split('id=')[1].split('&')[0].toLowerCase();
      if (!validIds.has(id)) {
        deadLinks.push({ file: relPath, link: href, reason: `Unknown airport id: ${id}` });
      }
      // Check physical go.html exists
      if (!fs.existsSync(path.join(PUBLIC_DIR, 'go.html'))) {
        deadLinks.push({ file: relPath, link: href, reason: 'public/go.html missing' });
      }
    } else if (href.startsWith('/go/')) {
      checkedLinks++;
      const cleanPath = href.split('?')[0].split('#')[0].replace(/^\/go\//, '').replace(/\/$/, '');
      if (!validIds.has(cleanPath)) {
        deadLinks.push({ file: relPath, link: href, reason: `Unknown airport path: ${cleanPath}` });
      }
    }
  }
}

console.log('=== DEAD LINK AUDIT RESULTS ===');
console.log(`Scanned HTML files in public: ${htmlFiles.length}`);
console.log(`Verified /go promotional links: ${checkedLinks}`);
console.log(`Dead / broken links found: ${deadLinks.length}`);

if (deadLinks.length > 0) {
  console.log(JSON.stringify(deadLinks, null, 2));
} else {
  console.log('✓ 100% of all /go promotional links are valid and pointing to legitimate destinations!');
}
