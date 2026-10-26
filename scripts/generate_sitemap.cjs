const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const STATIC_DIR = path.join(ROOT_DIR, 'static');
const BASE_URL = 'https://mofaclashjichang.com';

function decodeHtmlEntities(str) {
  if (!str) return '';
  let prev = '';
  let curr = str;
  let iterations = 0;
  while (curr !== prev && iterations < 5) {
    prev = curr;
    curr = curr
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&#43;/g, '+')
      .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec))
      .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
    iterations++;
  }
  return curr;
}

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

function normalizeUrl(rawUrl) {
  let decoded = decodeHtmlEntities(rawUrl).trim();
  if (!decoded.startsWith('http://') && !decoded.startsWith('https://')) {
    if (decoded.startsWith('/')) {
      decoded = `${BASE_URL}${decoded}`;
    } else {
      decoded = `${BASE_URL}/${decoded}`;
    }
  }

  try {
    const urlObj = new URL(decoded);
    // 强制使用 BASE_URL 协议与域名
    urlObj.protocol = 'https:';
    urlObj.host = 'mofaclashjichang.com';

    // 规范化路径：合并连续斜杠
    let pathname = urlObj.pathname.replace(/\/+/g, '/');
    const segments = pathname.split('/').map(seg => {
      try {
        return encodeURI(decodeURI(seg));
      } catch {
        return seg;
      }
    });
    urlObj.pathname = segments.join('/');
    return urlObj.toString();
  } catch {
    return decoded;
  }
}

function formatDate(date) {
  if (!date) return '2026-10-18';
  if (typeof date === 'string') {
    const match = date.match(/^\d{4}-\d{2}-\d{2}/);
    if (match) return match[0];
  }
  const d = new Date(date);
  if (isNaN(d.getTime())) return '2026-10-18';
  return d.toISOString().split('T')[0];
}

function getPriorityAndFreq(urlPath) {
  if (urlPath === '/' || urlPath === '') {
    return { priority: '1.0', changefreq: 'daily' };
  }
  if (
    urlPath.includes('article-2026-beginner-clash-guide') ||
    urlPath.includes('2026-clash-beginner-airport-selection-guide') ||
    urlPath.includes('2026-beginner-clash-guide')
  ) {
    return { priority: '1.0', changefreq: 'weekly' };
  }
  if (
    urlPath.includes('article-') ||
    urlPath.includes('-review-2026')
  ) {
    return { priority: '0.9', changefreq: 'monthly' };
  }
  if (urlPath === '/reviews.html' || urlPath === '/reviews/') {
    return { priority: '0.9', changefreq: 'weekly' };
  }
  if (urlPath.startsWith('/posts/')) {
    return { priority: '0.8', changefreq: 'weekly' };
  }
  if (urlPath.startsWith('/tools/')) {
    return { priority: '0.7', changefreq: 'monthly' };
  }
  if (urlPath.startsWith('/airports/')) {
    return { priority: '0.7', changefreq: 'monthly' };
  }
  if (urlPath === '/archive.html' || urlPath === '/archives/' || urlPath === '/archive/') {
    return { priority: '0.6', changefreq: 'weekly' };
  }
  if (urlPath.startsWith('/categories/') || urlPath.startsWith('/tags/')) {
    return { priority: '0.5', changefreq: 'weekly' };
  }
  if (urlPath === '/disclaimer/' || urlPath === '/disclaimer.html') {
    return { priority: '0.3', changefreq: 'yearly' };
  }
  return { priority: '0.5', changefreq: 'weekly' };
}

function getAllHtmlFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getAllHtmlFiles(fullPath));
    } else if (item.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

function extractLastmod(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const match =
      content.match(/<meta property=["']article:modified_time["'] content=["']([^"']+)["']/i) ||
      content.match(/<meta property=["']article:published_time["'] content=["']([^"']+)["']/i) ||
      content.match(/<meta name=["']date["'] content=["']([^"']+)["']/i);
    if (match) {
      return formatDate(match[1]);
    }
    const stat = fs.statSync(filePath);
    return formatDate(stat.mtime);
  } catch {
    return '2026-10-18';
  }
}

function buildSitemap() {
  console.log('=== 开始生成并自检全站 sitemap.xml ===');

  const urlMap = new Map();

  // 1. 如果 public/sitemap.xml 已存在（由 Hugo 生成），先提取其现有的标准记录
  const existingSitemapPath = path.join(PUBLIC_DIR, 'sitemap.xml');
  if (fs.existsSync(existingSitemapPath)) {
    try {
      const existingXml = fs.readFileSync(existingSitemapPath, 'utf-8');
      const urlBlocks = [...existingXml.matchAll(/<url>([\s\S]*?)<\/url>/g)];
      for (const block of urlBlocks) {
        const text = block[1];
        const locMatch = text.match(/<loc>([^<]+)<\/loc>/);
        const lastmodMatch = text.match(/<lastmod>([^<]+)<\/lastmod>/);
        const changefreqMatch = text.match(/<changefreq>([^<]+)<\/changefreq>/);
        const priorityMatch = text.match(/<priority>([^<]+)<\/priority>/);

        if (locMatch) {
          const rawLoc = locMatch[1].trim();
          const loc = normalizeUrl(rawLoc);
          const pathOnly = loc.replace(BASE_URL, '');
          // 彻底排除承接页与外部跳转中转路径，严禁进入站点地图
          if (pathOnly === '/go.html' || pathOnly === '/go' || pathOnly.startsWith('/go/')) {
            continue;
          }
          const cleanLastmod = lastmodMatch ? formatDate(lastmodMatch[1].trim()) : '2026-10-18';
          const { priority: defPriority, changefreq: defFreq } = getPriorityAndFreq(
            pathOnly
          );
          urlMap.set(loc, {
            loc,
            lastmod: cleanLastmod,
            changefreq: changefreqMatch ? changefreqMatch[1].trim() : defFreq,
            priority: priorityMatch ? parseFloat(priorityMatch[1].trim()).toFixed(1) : defPriority
          });
        }
      }
      console.log(`[Hugo提取] 从当前 Hugo sitemap 提取到 ${urlMap.size} 条基础记录`);
    } catch (err) {
      console.warn('! 读取现有 sitemap 失败，将直接遍历静态文件:', err.message);
    }
  }

  // 2. 遍历 public 目录所有 HTML 文件，确保无遗漏
  const allHtml = getAllHtmlFiles(PUBLIC_DIR);
  console.log(`[文件扫描] 在 public 目录下扫描到 ${allHtml.length} 个 HTML 文件`);

  for (const filePath of allHtml) {
    const rel = path.relative(PUBLIC_DIR, filePath).split(path.sep).join('/');
    
    // 排除非公开/系统文件与重定向承接页
    if (rel === '404.html') continue;
    if (rel.includes('/page/')) continue; // 排除分页重复页
    if (rel === 'go.html' || rel === 'go' || rel.startsWith('go/')) continue;

    let urlPath = '';
    if (rel === 'index.html') {
      urlPath = '/';
    } else if (rel.endsWith('/index.html')) {
      urlPath = '/' + rel.slice(0, -'index.html'.length);
    } else {
      urlPath = '/' + rel;
    }

    const fullUrl = normalizeUrl(urlPath);

    if (!urlMap.has(fullUrl)) {
      const lastmod = extractLastmod(filePath);
      const { priority, changefreq } = getPriorityAndFreq(urlPath);
      urlMap.set(fullUrl, {
        loc: fullUrl,
        lastmod,
        changefreq,
        priority
      });
    }
  }

  // 3. 补充关键单品与支柱落地页（强制保障存在性）
  const criticalUrls = [
    { path: '/article-2026-beginner-clash-guide.html', priority: '1.0', changefreq: 'weekly' },
    { path: '/article-liulianyun-2026-review.html', priority: '0.9', changefreq: 'monthly' },
    { path: '/article-shandianshu-2026-review.html', priority: '0.9', changefreq: 'monthly' },
    { path: '/article-shenxing-2026-review.html', priority: '0.9', changefreq: 'monthly' },
    { path: '/reviews.html', priority: '0.9', changefreq: 'weekly' },
    { path: '/reviews/', priority: '0.9', changefreq: 'weekly' },
    { path: '/archive.html', priority: '0.6', changefreq: 'weekly' },
    { path: '/posts/2026-beginner-clash-guide/', priority: '0.9', changefreq: 'weekly' },
    { path: '/posts/liulianyun-review-2026/', priority: '0.9', changefreq: 'monthly' },
    { path: '/posts/shandianshu-review-2026/', priority: '0.9', changefreq: 'monthly' },
    { path: '/posts/shenxing-review-2026/', priority: '0.9', changefreq: 'monthly' },
    { path: '/posts/2026-clash-beginner-airport-selection-guide.html', priority: '0.9', changefreq: 'weekly' }
  ];

  for (const item of criticalUrls) {
    const fullUrl = normalizeUrl(item.path);
    if (!urlMap.has(fullUrl)) {
      urlMap.set(fullUrl, {
        loc: fullUrl,
        lastmod: '2026-10-18',
        changefreq: item.changefreq,
        priority: item.priority
      });
    } else {
      // 保证关键页面权重达到预期
      const existing = urlMap.get(fullUrl);
      if (parseFloat(existing.priority) < parseFloat(item.priority)) {
        existing.priority = item.priority;
        existing.changefreq = item.changefreq;
      }
    }
  }

  // 4. 排序：首页优先，按优先级从高到低，同级按 URL 排序
  const sortedEntries = Array.from(urlMap.values()).sort((a, b) => {
    if (a.loc === `${BASE_URL}/`) return -1;
    if (b.loc === `${BASE_URL}/`) return 1;
    const diff = parseFloat(b.priority) - parseFloat(a.priority);
    if (diff !== 0) return diff;
    return a.loc.localeCompare(b.loc);
  });

  console.log(`[汇总去重] 共计收录 ${sortedEntries.length} 个独立有效绝对路径 URL`);

  // 5. 按照标准 XML 规范生成字符串
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const entry of sortedEntries) {
    const safeLoc = escapeXml(entry.loc);
    const safeLastmod = escapeXml(entry.lastmod);
    const safeChangefreq = escapeXml(entry.changefreq);
    const safePriority = escapeXml(entry.priority);

    xml += '  <url>\n';
    xml += `    <loc>${safeLoc}</loc>\n`;
    xml += `    <lastmod>${safeLastmod}</lastmod>\n`;
    xml += `    <changefreq>${safeChangefreq}</changefreq>\n`;
    xml += `    <priority>${safePriority}</priority>\n`;
    xml += '  </url>\n';
  }

  xml += '</urlset>\n';

  // 6. 语法严格自检
  validateXml(xml, sortedEntries.length);

  // 7. 写入发布目录、源码静态目录与根目录
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), xml, 'utf-8');
  console.log(`✓ 成功写入: ${path.relative(ROOT_DIR, path.join(PUBLIC_DIR, 'sitemap.xml'))}`);

  if (fs.existsSync(STATIC_DIR)) {
    fs.writeFileSync(path.join(STATIC_DIR, 'sitemap.xml'), xml, 'utf-8');
    console.log(`✓ 成功同步持久化: ${path.relative(ROOT_DIR, path.join(STATIC_DIR, 'sitemap.xml'))}`);
  }
  fs.writeFileSync(path.join(ROOT_DIR, 'sitemap.xml'), xml, 'utf-8');
  console.log(`✓ 成功同步根目录: sitemap.xml`);

  return { total: sortedEntries.length, xml };
}

function validateXml(xmlString, expectedCount) {
  console.log('\n--- 开始 XML 语法合法性自测 ---');
  
  // 检查第一行
  const lines = xmlString.split('\n');
  if (lines[0].trim() !== '<?xml version="1.0" encoding="UTF-8"?>') {
    throw new Error(`第一行 XML 声明不合规: ${lines[0]}`);
  }

  // 检查根节点
  if (lines[1].trim() !== '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">') {
    throw new Error(`根节点语法不合规: ${lines[1]}`);
  }

  // 检查闭合根节点
  const lastLine = lines.filter(l => l.trim().length > 0).pop();
  if (lastLine.trim() !== '</urlset>') {
    throw new Error(`根节点未正常闭合: ${lastLine}`);
  }

  // 检查标签平衡性
  const tagStack = [];
  const tagRegex = /<\/?([a-zA-Z0-9_:-]+)(?:\s+[^>]*)?>/g;
  let match;
  let urlCount = 0;

  while ((match = tagRegex.exec(xmlString)) !== null) {
    const fullTag = match[0];
    const tagName = match[1];

    if (fullTag.startsWith('<?')) continue;

    if (fullTag.endsWith('/>')) {
      continue;
    } else if (fullTag.startsWith('</')) {
      const top = tagStack.pop();
      if (top !== tagName) {
        throw new Error(`XML 标签闭合不匹配: 期望 </${top}> 但遇到了 </${tagName}>`);
      }
    } else {
      tagStack.push(tagName);
      if (tagName === 'url') urlCount++;
    }
  }

  if (tagStack.length > 0) {
    throw new Error(`XML 存在未闭合的标签: ${tagStack.join(', ')}`);
  }

  if (urlCount !== expectedCount) {
    throw new Error(`URL 数量校验不匹配: 预期 ${expectedCount}, 实测 ${urlCount}`);
  }

  // 检查所有 loc 是否以 BASE_URL 开头
  const locs = [...xmlString.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  for (const loc of locs) {
    if (!loc.startsWith(BASE_URL)) {
      throw new Error(`检测到非绝对路径或跨域 URL: ${loc}`);
    }
    // 检查是否有未转义的特殊字符
    if (/[<>'"]/.test(loc)) {
      throw new Error(`检测到未转义的特殊字符: ${loc}`);
    }
    // 检查是否包含双重转义 &amp;amp;
    if (loc.includes('&amp;amp;')) {
      throw new Error(`检测到双重转义: ${loc}`);
    }
    // 严格检查是否包含 /go/ 或 /go.html
    const pathOnly = loc.replace(BASE_URL, '');
    if (pathOnly === '/go.html' || pathOnly === '/go' || pathOnly.startsWith('/go/')) {
      throw new Error(`站点地图中检测到禁止收录的重定向/承接页路径: ${loc}`);
    }
  }

  console.log(`✓ 自检通过: XML 语法完全合规，成功闭合所有标签，无语法冲突，URL 总数 = ${urlCount}`);
}

if (require.main === module) {
  try {
    buildSitemap();
    console.log('\n=== sitemap.xml 生成并校验完成 ===');
  } catch (err) {
    console.error('✗ 生成失败:', err);
    process.exit(1);
  }
}

module.exports = { buildSitemap };
