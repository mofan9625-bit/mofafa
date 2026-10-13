const fs = require('fs');
const path = require('path');

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function cleanTitle(raw) {
  if (!raw) return '';
  return raw
    .replace(/<[^>]+>/g, '') // remove HTML tags
    .replace(/&#8599;/g, '') // remove arrow symbols
    .replace(/&#8598;/g, '')
    .replace(/#/g, '')       // remove hash/anchor marks
    .replace(/\s+/g, ' ')   // normalize whitespace
    .trim();
}

function walk(dir, list = []) {
  if (!fs.existsSync(dir)) return list;
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) {
      if (f.name !== '.git' && f.name !== 'node_modules' && f.name !== '.hugo-preview-cache' && f.name !== 'themes') {
        walk(p, list);
      }
    } else if (f.isFile() && f.name.endsWith('.html')) {
      list.push(p);
    }
  }
  return list;
}

const allHtmlFiles = walk('.');
console.log(`Found ${allHtmlFiles.length} HTML files.`);

let totalCardsFixed = 0;
let filesModified = 0;

for (const filePath of allHtmlFiles) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // 1. 针对该文件中的每个相关文章卡片 (article-link--related) 修复图片与 alt
  if (content.includes('article-link--related')) {
    let relatedIndex = 0;
    
    // 正则精确匹配卡片: <article ... class="...article-link--related..." ...> ... </article>
    const cardRegex = /<article\b([^>]*\bclass="[^"]*article-link--related[^"]*"[^>]*)>([\s\S]*?)<\/article>/gi;

    content = content.replace(cardRegex, (fullCard, articleAttrs, cardInner) => {
      relatedIndex++;
      const coverNum = ((relatedIndex - 1) % 18) + 1;
      const expectedSrc = `/images/covers/cover-${coverNum}.jpg`;

      // 从卡片内部提取纯净标题
      const h2Match = cardInner.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
      let title = '';
      if (h2Match) {
        title = cleanTitle(h2Match[1]);
      }
      if (!title) {
        // 尝试从原有 a 标签提取
        const aMatch = cardInner.match(/<a\b[^>]*>([\s\S]*?)<\/a>/i);
        if (aMatch) {
          title = cleanTitle(aMatch[1]);
        }
      }
      if (!title) {
        title = '相关文章推荐';
      }

      totalCardsFixed++;

      // 检查卡片内是否有 thumbnail_card_related
      const thumbRegex = /<div\b([^>]*\bthumbnail_card_related[^>]*)>([\s\S]*?)<\/div>/i;
      const thumbMatch = cardInner.match(thumbRegex);

      if (thumbMatch) {
        // 更新 thumbnail_card_related 内部的 <img>
        const divAttrs = thumbMatch[1];
        const newImgTag = `<img src="${expectedSrc}" alt="${escapeHtml(title)}" loading="lazy" decoding="async" fetchpriority="low" class="nozoom not-prose absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" />`;
        
        const updatedThumbDiv = `<div${divAttrs}>\n      ${newImgTag}\n    </div>`;
        const updatedCardInner = cardInner.replace(thumbRegex, updatedThumbDiv);
        return `<article${articleAttrs}>${updatedCardInner}</article>`;
      } else {
        // 如果没有 thumbnail_card_related，但有 img 标签
        const imgMatch = cardInner.match(/<img\b[^>]*>/i);
        if (imgMatch) {
          const newThumbDiv = `<div class="flex-none relative overflow-hidden thumbnail_card_related" style="--thumbnail-aspect-ratio: 1.5">\n      <img src="${expectedSrc}" alt="${escapeHtml(title)}" loading="lazy" decoding="async" fetchpriority="low" class="nozoom not-prose absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" />\n    </div>`;
          const updatedCardInner = cardInner.replace(/<img\b[^>]*>/i, newThumbDiv);
          return `<article${articleAttrs}>${updatedCardInner}</article>`;
        } else {
          // 在卡片最前插入 thumbnail_card_related
          const newThumbDiv = `\n    <div class="flex-none relative overflow-hidden thumbnail_card_related" style="--thumbnail-aspect-ratio: 1.5">\n      <img src="${expectedSrc}" alt="${escapeHtml(title)}" loading="lazy" decoding="async" fetchpriority="low" class="nozoom not-prose absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" />\n    </div>\n  `;
          return `<article${articleAttrs}>${newThumbDiv}${cardInner}</article>`;
        }
      }
    });
  }

  // 2. 全局修复该文件中所有相对路径的 images/covers/
  // 例如 src="images/covers/cover-1.jpg" => src="/images/covers/cover-1.jpg"
  content = content.replace(/\bsrc="images\/covers\//g, 'src="/images/covers/');
  content = content.replace(/\bsrc='images\/covers\//g, "src='/images/covers/");

  // 3. 检查是否有残余的带 "#" 的 alt 属性（如 alt="... #" 或 正文小标题）
  content = content.replace(/alt="([^"]*#[\s\S]*?)"/g, (match, altVal) => {
    const cleaned = cleanTitle(altVal);
    return `alt="${escapeHtml(cleaned)}"`;
  });

  // 4. 确保页面 <head> 中引入 /css/style.css
  if (content.includes('</head>') && !content.includes('/css/style.css')) {
    const styleLink = '  <link type="text/css" rel="stylesheet" href="/css/style.css">\n';
    if (content.includes('/css/main.bundle.min.css')) {
      content = content.replace(/(<link[^>]*href="\/css\/main\.bundle\.min\.css"[^>]*>)/i, `$1\n${styleLink}`);
    } else {
      content = content.replace('</head>', `${styleLink}</head>`);
    }
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    filesModified++;
  }
}

console.log(`Finished: ${filesModified} files modified, ${totalCardsFixed} related cards processed.`);
