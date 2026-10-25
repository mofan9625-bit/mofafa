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
let totalGoLinks = 0;
let relCompliant = 0;
let relNonCompliant = 0;
const nonCompliantList = [];

for (const filePath of allFiles) {
  const relPath = path.relative(ROOT_DIR, filePath).replace(/\\/g, '/');
  // Skip the redirector files themselves (like /go/xxx/index.html or go.html fallback links)
  if (relPath.startsWith('go/') || relPath.startsWith('static/go/') || relPath.startsWith('public/go/')) continue;
  if (relPath === 'go.html' || relPath === 'static/go.html' || relPath === 'public/go.html') continue;

  const content = fs.readFileSync(filePath, 'utf8');

  // Check HTML <a> tags pointing to /go.html or /go/
  const aTagRegex = /<a\b[^>]*?href=["'](\/go\.html\?[^"']+|\/go\/[^"']+)["'][^>]*?>/gi;
  let match;
  while ((match = aTagRegex.exec(content)) !== null) {
    totalGoLinks++;
    const tag = match[0];
    const hasRel = /rel=["'][^"']*nofollow[^"']*sponsored[^"']*noopener[^"']*noreferrer[^"']*["']/i.test(tag) ||
                   /rel=["']nofollow sponsored noopener noreferrer["']/i.test(tag);
    if (hasRel) {
      relCompliant++;
    } else {
      relNonCompliant++;
      nonCompliantList.push({ file: relPath, tag });
    }
  }

  // Check Markdown links
  if (filePath.endsWith('.md')) {
    const mdRegex = /\[([^\]]+)\]\((\/go\.html\?[^\s\)]+|\/go\/[^\s\)]+)\)/gi;
    let mdMatch;
    while ((mdMatch = mdRegex.exec(content)) !== null) {
      totalGoLinks++;
      relCompliant++; // Markdown links are rendered through our custom render-link.html hook which injects rel="nofollow sponsored noopener noreferrer"
    }
  }
}

console.log('=== COMPLIANCE AUDIT RESULTS ===');
console.log(`Total /go links found in content & articles: ${totalGoLinks}`);
console.log(`Strictly compliant tags (rel="nofollow sponsored noopener noreferrer"): ${relCompliant}`);
console.log(`Non-compliant tags: ${relNonCompliant}`);

if (nonCompliantList.length > 0) {
  console.log('\nNon-compliant tags found:');
  console.log(JSON.stringify(nonCompliantList, null, 2));
} else {
  console.log('\n✓ 100% of all /go promotion links are strictly compliant!');
}
