const fs = require('fs');
const path = require('path');

const publicDir = path.resolve(__dirname, '..', 'public');
const rootDir = path.resolve(__dirname, '..');

console.log('=== BLOG DEAD LINK AND ROUTE COMPREHENSIVE AUDIT ===\n');

function getAllFiles(dir, exts, list = []) {
  if (!fs.existsSync(dir)) return list;
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      if (item.name !== '.git' && item.name !== 'node_modules' && item.name !== '.hugo-preview-cache') {
        getAllFiles(full, exts, list);
      }
    } else if (item.isFile()) {
      if (exts.some(ext => item.name.endsWith(ext))) {
        list.push(full);
      }
    }
  }
  return list;
}

function resolveTargetExists(targetUrl) {
  // Browser unescapes HTML entities in href like &#43; to + before interpreting fragment hash
  let clean = targetUrl.replace(/&#43;/g, '+').replace(/&amp;/g, '&');
  clean = clean.split('?')[0].split('#')[0];
  if (!clean) return true;
  try {
    clean = decodeURIComponent(clean);
  } catch (e) {
    // keep as is if malformed
  }

  let localPath = path.join(publicDir, clean.startsWith('/') ? clean.slice(1) : clean);
  if (fs.existsSync(localPath)) {
    if (fs.statSync(localPath).isDirectory()) {
      return fs.existsSync(path.join(localPath, 'index.html'));
    }
    return true;
  }
  if (clean.endsWith('/')) {
    return fs.existsSync(path.join(localPath, 'index.html'));
  }
  if (fs.existsSync(localPath + '.html')) {
    return true;
  }
  if (fs.existsSync(path.join(localPath, 'index.html'))) {
    return true;
  }
  return false;
}

const htmlFiles = getAllFiles(publicDir, ['.html']);
console.log(`[1] Total HTML files in public/: ${htmlFiles.length}`);

// Data sources
const contentDir = path.join(rootDir, 'content');
const markdownFiles = getAllFiles(contentDir, ['.md']);
console.log(`[2] Total Markdown data sources in content/: ${markdownFiles.length}`);

const markdownPostMap = new Map();
for (const md of markdownFiles) {
  const rel = path.relative(contentDir, md).replace(/\\/g, '/');
  let expectedUrl = '';
  if (rel === '_index.md' || rel === '_index.zh-cn.md') {
    expectedUrl = '/';
  } else if (rel.endsWith('/_index.md') || rel.endsWith('/_index.zh-cn.md')) {
    expectedUrl = '/' + rel.replace(/\/_index(\.zh-cn)?\.md$/, '') + '/';
  } else if (rel.endsWith('/index.md') || rel.endsWith('/index.zh-cn.md')) {
    expectedUrl = '/' + rel.replace(/\/index(\.zh-cn)?\.md$/, '') + '/';
  } else if (rel.endsWith('.md')) {
    expectedUrl = '/' + rel.replace(/\.md$/, '') + '/';
  }
  markdownPostMap.set(expectedUrl, md);
}

// Check list pages cards
const listPages = [
  path.join(publicDir, 'index.html'),
  path.join(publicDir, 'posts', 'index.html'),
  path.join(publicDir, 'airports', 'index.html'),
  path.join(publicDir, 'tools', 'index.html'),
  path.join(publicDir, 'reviews.html'),
  path.join(publicDir, 'reviews', 'index.html'),
  path.join(publicDir, 'archive.html')
];

const cardLinks = [];
const cardRegex = /<article\b[^>]*>([\s\S]*?)<\/article>/gi;
const linkRegex = /href=["']([^"']+)["']/gi;
const onclickRegex = /window\.location(?:\.href)?\s*=\s*['\\"]([^'"\\]+)['\\"]/g;

for (const lp of listPages) {
  if (!fs.existsSync(lp)) continue;
  const content = fs.readFileSync(lp, 'utf8');
  const relPage = path.relative(publicDir, lp).replace(/\\/g, '/');

  let cMatch;
  while ((cMatch = cardRegex.exec(content)) !== null) {
    const cardContent = cMatch[1];
    let lMatch;
    while ((lMatch = linkRegex.exec(cardContent)) !== null) {
      const link = lMatch[1].trim();
      if (!link.startsWith('http') && !link.startsWith('#') && !link.startsWith('mailto:')) {
        cardLinks.push({ listPage: relPage, link, context: 'card-href' });
      }
    }
  }

  let oMatch;
  while ((oMatch = onclickRegex.exec(content)) !== null) {
    const target = oMatch[1].replace(/\\\\/g, '/').replace(/\\/g, '/');
    cardLinks.push({ listPage: relPage, link: target, context: 'card-onclick' });
  }
}

const uniqueCardLinks = Array.from(new Set(cardLinks.map(c => c.link)));
console.log(`[3] Card internal target links extracted: ${uniqueCardLinks.length} unique targets (from ${cardLinks.length} total card occurrences)`);

const cardErrors = [];
for (const link of uniqueCardLinks) {
  const exists = resolveTargetExists(link);
  if (!exists) {
    cardErrors.push({ link, reason: '404 File Not Found in public/' });
  }
}

console.log(`[4] Card Link 404 Check: ${cardErrors.length === 0 ? 'ALL PASS (0 broken card links)' : JSON.stringify(cardErrors)}`);

// Scan all internal links across public
const allInternalLinks = new Map();
const emptyHashes = [];
const postParamLinks = [];
const articleParamLinks = [];

for (const f of htmlFiles) {
  const content = fs.readFileSync(f, 'utf8');
  const relFile = path.relative(publicDir, f).replace(/\\/g, '/');

  let m;
  const hrefScanRegex = /href=["']([^"']+)["']/gi;
  while ((m = hrefScanRegex.exec(content)) !== null) {
    const raw = m[1].trim();
    if (raw === '#') {
      emptyHashes.push({ file: relFile, link: raw });
      continue;
    }
    if (raw.startsWith('#')) continue;
    if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('mailto:') || raw.startsWith('tel:') || raw.startsWith('javascript:')) {
      continue;
    }
    if (raw.includes('post=')) {
      postParamLinks.push({ file: relFile, link: raw });
    }
    if (raw.includes('/article') || raw.includes('article.html')) {
      articleParamLinks.push({ file: relFile, link: raw });
    }
    if (!allInternalLinks.has(raw)) {
      allInternalLinks.set(raw, []);
    }
    allInternalLinks.get(raw).push(relFile);
  }
}

const deadLinks = [];
for (const [link, sources] of allInternalLinks.entries()) {
  const exists = resolveTargetExists(link);
  if (!exists) {
    deadLinks.push({
      link,
      sourcesCount: sources.length,
      sampleSources: sources.slice(0, 3)
    });
  }
}

console.log(`[5] All Site Internal Links: ${allInternalLinks.size} unique targets checked.`);
console.log(`[6] Dead Internal Links (404s): ${deadLinks.length}`);
if (deadLinks.length > 0) {
  console.log('Dead links list:', JSON.stringify(deadLinks, null, 2));
}

console.log(`[7] Empty Hash Links (#): ${emptyHashes.length}`);
console.log(`[8] Links with 'post=' query param: ${postParamLinks.length}`);
console.log(`[9] Links with '/article' or 'article.html': ${articleParamLinks.length}`);
if (articleParamLinks.length > 0) {
  const uniqueArticles = Array.from(new Set(articleParamLinks.map(a => a.link)));
  console.log('Unique article links:', uniqueArticles);
}

// Check all asset src attributes (images, scripts)
const srcRegex = /src=["']([^"']+)["']/gi;
const brokenSrcs = [];
for (const f of htmlFiles) {
  const c = fs.readFileSync(f, 'utf8');
  let m;
  while ((m = srcRegex.exec(c)) !== null) {
    let src = m[1].trim();
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:') || src.startsWith('//')) continue;
    let cleanSrc = src.split('?')[0].split('#')[0];
    try { cleanSrc = decodeURIComponent(cleanSrc); } catch (e) {}
    let local = path.join(publicDir, cleanSrc.startsWith('/') ? cleanSrc.slice(1) : cleanSrc);
    if (!fs.existsSync(local)) {
      brokenSrcs.push({ file: path.relative(publicDir, f), src });
    }
  }
}
console.log(`[10] Broken Asset src attributes: ${brokenSrcs.length}`);
if (brokenSrcs.length > 0) {
  console.log('Sample broken srcs:', JSON.stringify(brokenSrcs.slice(0, 5), null, 2));
}

// Redirects
const metaRefreshes = [];
for (const f of htmlFiles) {
  const content = fs.readFileSync(f, 'utf8');
  const relFile = path.relative(publicDir, f).replace(/\\/g, '/');
  const refreshMatch = content.match(/<meta[^>]+http-equiv=["']refresh["'][^>]*content=["']([^"']+)["'][^>]*>/i);
  if (refreshMatch) {
    metaRefreshes.push({ file: relFile, target: refreshMatch[1] });
  }
}
console.log(`\n[11] Meta Refreshes: ${metaRefreshes.length}`);

// Check for redirect loops
let redirectLoopDetected = false;
for (const r of metaRefreshes) {
  const targetUrl = r.target.replace(/^\d+;\s*url=/, '').trim();
  const cleanTarget = targetUrl.replace('https://mofaclashjichang.com', '');
  if (cleanTarget === '/' + r.file || cleanTarget === '/' + r.file.replace(/\/index\.html$/, '/')) {
    console.error(`REDIRECT LOOP DETECTED: ${r.file} redirects to itself (${targetUrl})`);
    redirectLoopDetected = true;
  }
}
console.log(`[12] Redirect Loop Detected: ${redirectLoopDetected ? 'YES' : 'NO'}`);

console.log('\n=== AUDIT COMPLETE ===');
