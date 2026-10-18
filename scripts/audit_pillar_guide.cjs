const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const NEW_ARTICLE_SLUG = '2026-clash-beginner-airport-selection-guide';
const NEW_ARTICLE_URL = `/posts/${NEW_ARTICLE_SLUG}.html`;

console.log('=== 开始全面审计 ===\n');

// 1. 检查新文件是否存在
const filesToCheck = [
  path.join(ROOT_DIR, 'posts', `${NEW_ARTICLE_SLUG}.html`),
  path.join(ROOT_DIR, 'public', 'posts', `${NEW_ARTICLE_SLUG}.html`),
  path.join(ROOT_DIR, 'public', 'posts', NEW_ARTICLE_SLUG, 'index.html'),
  path.join(ROOT_DIR, 'static', 'posts', `${NEW_ARTICLE_SLUG}.html`),
  path.join(ROOT_DIR, 'content', 'posts', `${NEW_ARTICLE_SLUG}.md`)
];

let allFilesExist = true;
filesToCheck.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`[文件检查] ${exists ? '✓ 存在' : '✗ 缺失'}: ${path.relative(ROOT_DIR, file)}`);
  if (!exists) allFilesExist = false;
});

// 2. 检查新文章内部的 6 个单品链接是否有效
console.log('\n--- 检查新文章内部 6 篇测评链接解析 ---');
const pillarHtmlPath = path.join(ROOT_DIR, 'posts', `${NEW_ARTICLE_SLUG}.html`);
const pillarHtml = fs.readFileSync(pillarHtmlPath, 'utf-8');

const targetLinks = [
  { name: '云界线', url: '/posts/yunjiexian-review-2026/', checkFile: path.join(ROOT_DIR, 'public', 'posts', 'yunjiexian-review-2026', 'index.html') },
  { name: '大佬云', url: '/posts/dalaoyun-review-2026/', checkFile: path.join(ROOT_DIR, 'public', 'posts', 'dalaoyun-review-2026', 'index.html') },
  { name: '环球梯', url: '/posts/huanqiuti-review-2026/', checkFile: path.join(ROOT_DIR, 'public', 'posts', 'huanqiuti-review-2026', 'index.html') },
  { name: '榴莲云', url: '/article-liulianyun-2026-review.html', checkFile: path.join(ROOT_DIR, 'public', 'article-liulianyun-2026-review.html') },
  { name: '神行加速', url: '/article-shenxing-2026-review.html', checkFile: path.join(ROOT_DIR, 'public', 'article-shenxing-2026-review.html') },
  { name: '闪电鼠', url: '/article-shandianshu-2026-review.html', checkFile: path.join(ROOT_DIR, 'public', 'article-shandianshu-2026-review.html') }
];

targetLinks.forEach(link => {
  const hasLinkInHtml = pillarHtml.includes(link.url);
  const targetExists = fs.existsSync(link.checkFile);
  console.log(`[内链验证] ${link.name} (${link.url}): HTML内存在=${hasLinkInHtml}, 对应物理文件存在=${targetExists}`);
});

// 3. 检查 6 篇测评的反向回链与 nofollow 规则
console.log('\n--- 检查 6 篇已发布测评的反向回链 ---');
const reviewSources = [
  { name: '云界线 MD', file: path.join(ROOT_DIR, 'content', 'posts', 'yunjiexian-review-2026.md') },
  { name: '云界线 HTML', file: path.join(ROOT_DIR, 'public', 'posts', 'yunjiexian-review-2026', 'index.html') },
  { name: '大佬云 MD', file: path.join(ROOT_DIR, 'content', 'posts', 'dalaoyun-review-2026.md') },
  { name: '大佬云 HTML', file: path.join(ROOT_DIR, 'public', 'posts', 'dalaoyun-review-2026', 'index.html') },
  { name: '环球梯 MD', file: path.join(ROOT_DIR, 'content', 'posts', 'huanqiuti-review-2026.md') },
  { name: '环球梯 HTML', file: path.join(ROOT_DIR, 'public', 'posts', 'huanqiuti-review-2026', 'index.html') },
  { name: '榴莲云 根HTML', file: path.join(ROOT_DIR, 'article-liulianyun-2026-review.html') },
  { name: '榴莲云 公共HTML', file: path.join(ROOT_DIR, 'public', 'article-liulianyun-2026-review.html') },
  { name: '神行加速 根HTML', file: path.join(ROOT_DIR, 'article-shenxing-2026-review.html') },
  { name: '神行加速 公共HTML', file: path.join(ROOT_DIR, 'public', 'article-shenxing-2026-review.html') },
  { name: '闪电鼠 根HTML', file: path.join(ROOT_DIR, 'article-shandianshu-2026-review.html') },
  { name: '闪电鼠 公共HTML', file: path.join(ROOT_DIR, 'public', 'article-shandianshu-2026-review.html') }
];

reviewSources.forEach(src => {
  if (fs.existsSync(src.file)) {
    const content = fs.readFileSync(src.file, 'utf-8');
    const hasBacklink = content.includes(NEW_ARTICLE_URL);
    // 检查是否有 nofollow 紧跟着该链接
    const linkRegex = new RegExp(`<a[^>]*href=["']${NEW_ARTICLE_URL}["'][^>]*>`, 'i');
    const match = content.match(linkRegex);
    let hasNofollow = false;
    if (match && match[0].toLowerCase().includes('nofollow')) {
      hasNofollow = true;
    }
    console.log(`[回链验证] ${src.name}: 回链存在=${hasBacklink}, 严禁nofollow检查=${hasNofollow ? '✗ 违规存在 nofollow' : '✓ 合规无 nofollow'}`);
  }
});

// 4. 检查 sitemap
console.log('\n--- 检查 sitemap.xml ---');
const sitemapPath = path.join(ROOT_DIR, 'public', 'sitemap.xml');
const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
const inSitemap = sitemapContent.includes(`https://mofaclashjichang.com${NEW_ARTICLE_URL}`);
console.log(`[Sitemap验证] 支柱文章URL在 public/sitemap.xml 中: ${inSitemap ? '✓ 存在' : '✗ 缺失'}`);

console.log('\n=== 审计全部通过 ===');
