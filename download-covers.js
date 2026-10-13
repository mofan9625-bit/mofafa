/**
 * download-covers.js
 * 一键下载 18 张 Unsplash 暗色科技/赛博网络免版权高清封面图，
 * 并批量替换所有 HTML 页面卡片中的迷宫占位图（循环分配 cover-1.jpg ~ cover-18.jpg）。
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const rootDir = __dirname;
const coversDir = path.join(rootDir, 'images', 'covers');

// 18 张精选暗色科技 / 赛博网络免版权图片直链 (Unsplash)
const imageUrls = [
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1510519138171-cbe6566f1014?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517433456452-f9633a875f6f?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1520869562399-e772f312f722?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534972195531-a756b1126f24?w=800&auto=format&fit=crop&q=80'
];

// Unsplash 备用高质量暗色科技图库（若原图因摄影师下架返回 404 时自动兜底）
const fallbackUrls = {
  'https://images.unsplash.com/photo-1510519138171-cbe6566f1014?w=800&auto=format&fit=crop&q=80':
    'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1520869562399-e772f312f722?w=800&auto=format&fit=crop&q=80':
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534972195531-a756b1126f24?w=800&auto=format&fit=crop&q=80':
    'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?w=800&auto=format&fit=crop&q=80'
};

/**
 * 递归下载图片（支持 301/302 重定向及自动容错降级）
 */
function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    function get(currentUrl, redirectCount = 0) {
      if (redirectCount > 5) {
        return reject(new Error(`重定向次数过多: ${url}`));
      }
      const client = currentUrl.startsWith('https:') ? https : http;
      const req = client.get(currentUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        timeout: 30000
      }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return get(res.headers.location, redirectCount + 1);
        }
        if (res.statusCode === 404 && fallbackUrls[currentUrl]) {
          console.log(`(触发备用镜像图源)`);
          return get(fallbackUrls[currentUrl], 0);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode} 获取失败: ${currentUrl}`));
        }
        const fileStream = fs.createWriteStream(destPath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close(resolve);
        });
        fileStream.on('error', (err) => {
          fs.unlink(destPath, () => reject(err));
        });
      });
      req.on('timeout', () => {
        req.destroy();
        reject(new Error(`下载超时: ${url}`));
      });
      req.on('error', reject);
    }
    get(url);
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * 更新单个 HTML 页面中的卡片封面图片
 */
function updateHtmlFile(filePath) {
  if (!fs.existsSync(filePath)) return { updated: false, count: 0 };
  let content = fs.readFileSync(filePath, 'utf-8');

  // 如果页面既无迷宫占位图，也无旧封面，则跳过
  if (!content.includes('featured.svg') && !content.includes('images/covers/cover-')) {
    return { updated: false, count: 0 };
  }

  let cardIndex = 0;
  // 精确匹配卡片文章，避免匹配外层大文章容器
  const articleRegex = /<article\b([^>]*\bclass="[^"]*article-link[^"]*"[^>]*)>([\s\S]*?)<\/article>/gi;

  let newContent = content.replace(articleRegex, (match, articleAttrs, cardInner) => {
    // 匹配卡片内的迷宫图或已有的 cover 图
    const hasPlaceholder = /featured\.svg|images\/covers\/cover-\d+\.jpg/i.test(cardInner);
    if (!hasPlaceholder) {
      return match;
    }

    // 提取卡片标题
    const h2Match = cardInner.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
    let title = '';
    if (h2Match) {
      title = h2Match[1].replace(/<[^>]+>/g, '').replace(/#/g, '').replace(/\s+/g, ' ').trim();
    }

    // 循环分配 /images/covers/cover-1.jpg 到 cover-18.jpg
    const coverNum = (cardIndex % 18) + 1;
    cardIndex++;
    const newSrc = `/images/covers/cover-${coverNum}.jpg`;

    // 替换 <img> 标签
    const imgRegex = /<img\b([^>]*(?:featured\.svg|images\/covers\/cover-\d+\.jpg)[^>]*)>/i;
    const updatedCardInner = cardInner.replace(imgRegex, (imgTag, attrs) => {
      // 提取原有 class 属性
      const classMatch = attrs.match(/\bclass=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
      const classes = classMatch
        ? (classMatch[1] || classMatch[2] || classMatch[3])
        : 'nozoom not-prose absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]';

      // 若未从 h2 获取到标题，则尝试从原有 alt 获取
      if (!title) {
        const altMatch = attrs.match(/\balt=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
        if (altMatch) {
          title = (altMatch[1] || altMatch[2] || altMatch[3] || '').replace(/#/g, '').replace(/\s+/g, ' ').trim();
        }
      }

      return `<img src="${newSrc}" alt="${escapeHtml(title)}" loading="lazy" decoding="async" fetchpriority="low" class="${classes}" />`;
    });

    return `<article${articleAttrs}>${updatedCardInner}</article>`;
  });

  // 处理可能存在于 article 外部的孤立 featured.svg
  if (newContent.includes('featured.svg')) {
    const standaloneImgRegex = /<img\b([^>]*featured\.svg[^>]*)>/gi;
    newContent = newContent.replace(standaloneImgRegex, (imgTag, attrs) => {
      const coverNum = (cardIndex % 18) + 1;
      cardIndex++;
      const newSrc = `/images/covers/cover-${coverNum}.jpg`;
      const classMatch = attrs.match(/\bclass=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
      const classes = classMatch
        ? (classMatch[1] || classMatch[2] || classMatch[3])
        : 'nozoom not-prose absolute inset-0 h-full w-full object-cover';
      const altMatch = attrs.match(/\balt=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
      let altText = altMatch ? (altMatch[1] || altMatch[2] || altMatch[3]) : '文章封面';
      altText = altText.replace(/#/g, '').replace(/\s+/g, ' ').trim();
      return `<img src="${newSrc}" alt="${escapeHtml(altText)}" loading="lazy" decoding="async" fetchpriority="low" class="${classes}" />`;
    });
  }

  // 修复全局相对路径
  newContent = newContent.replace(/\bsrc="images\/covers\//g, 'src="/images/covers/');
  newContent = newContent.replace(/\bsrc='images\/covers\//g, "src='/images/covers/");

  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf-8');
    return { updated: true, count: cardIndex };
  }
  return { updated: false, count: cardIndex };
}

/**
 * 递归遍历获取所有 HTML 文件
 */
function getAllHtmlFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== '.git' && entry.name !== 'node_modules') {
        getAllHtmlFiles(fullPath, fileList);
      }
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

async function main() {
  console.log('====================================================');
  console.log('🚀 开始执行一键下载并配置本地文章封面图任务...');
  console.log('====================================================\n');

  // --- Step 1: 创建 images/covers/ 文件夹并下载 18 张图片 ---
  console.log(`📁 1. 检查并创建封面图目录: images/covers/`);
  fs.mkdirSync(coversDir, { recursive: true });

  console.log(`📥 2. 开始依次下载 18 张来自 Unsplash 的暗色科技高清免版权图片:`);
  for (let i = 0; i < imageUrls.length; i++) {
    const num = i + 1;
    const fileName = `cover-${num}.jpg`;
    const dest = path.join(coversDir, fileName);
    const url = imageUrls[i];

    process.stdout.write(`   [${num}/${imageUrls.length}] 正在下载 ${fileName} ... `);
    try {
      await downloadImage(url, dest);
      const stats = fs.statSync(dest);
      const kb = (stats.size / 1024).toFixed(1);
      console.log(`✅ 成功 (${kb} KB)`);
    } catch (err) {
      console.error(`❌ 失败: ${err.message}`);
    }
  }

  // 同步分发到 static/images/covers 与 public/images/covers，保障本地预览及 Hugo 构建均正常
  const mirrorDirs = [
    path.join(rootDir, 'static', 'images', 'covers'),
    path.join(rootDir, 'public', 'images', 'covers'),
    path.join(rootDir, 'public', 'posts', 'images', 'covers'),
    path.join(rootDir, 'public', 'reviews', 'images', 'covers'),
    path.join(rootDir, 'reviews', 'images', 'covers')
  ];

  for (const dir of mirrorDirs) {
    fs.mkdirSync(dir, { recursive: true });
    for (let i = 1; i <= imageUrls.length; i++) {
      const srcFile = path.join(coversDir, `cover-${i}.jpg`);
      const targetFile = path.join(dir, `cover-${i}.jpg`);
      if (fs.existsSync(srcFile)) {
        fs.copyFileSync(srcFile, targetFile);
      }
    }
  }
  console.log(`\n📦 已完成封面图镜像同步到 static 与 public 资源目录。`);

  // --- Step 2: 确保根目录 archive.html 存在 ---
  const rootArchiveHtml = path.join(rootDir, 'archive.html');
  const publicPostsHtml = path.join(rootDir, 'public', 'posts', 'index.html');
  if (!fs.existsSync(rootArchiveHtml) && fs.existsSync(publicPostsHtml)) {
    fs.copyFileSync(publicPostsHtml, rootArchiveHtml);
    console.log(`📄 自动生成根目录归档入口: archive.html`);
  }

  // --- Step 3: 批量更新 HTML 页面卡片图片路径 ---
  console.log(`\n🎨 3. 开始扫描并替换全站 HTML 页面的卡片迷宫占位图...`);
  const targetHtmlFiles = new Set([
    path.join(rootDir, 'index.html'),
    path.join(rootDir, 'reviews.html'),
    path.join(rootDir, 'archive.html'),
    path.join(rootDir, 'reviews', 'index.html'),
    path.join(rootDir, 'static', 'reviews.html'),
    path.join(rootDir, 'static', 'reviews', 'index.html'),
    ...getAllHtmlFiles(path.join(rootDir, 'public'))
  ]);

  let updatedFileCount = 0;
  let totalReplacedCards = 0;

  for (const filePath of targetHtmlFiles) {
    const relPath = path.relative(rootDir, filePath);
    const { updated, count } = updateHtmlFile(filePath);
    if (updated) {
      updatedFileCount++;
      totalReplacedCards += count;
      console.log(`   ✨ 已更新: ${relPath} (替换 ${count} 张卡片封面)`);
    }
  }

  console.log(`\n📊 HTML 页面批量替换统计:`);
  console.log(`- 更新页面总数: ${updatedFileCount} 个`);
  console.log(`- 累计替换卡片封面: ${totalReplacedCards} 次`);

  // --- Step 4: 确认 18 张图片均已存在 ---
  console.log(`\n🔍 4. 验证 images/covers/ 目录中的图片文件状态:`);
  let allExist = true;
  for (let i = 1; i <= imageUrls.length; i++) {
    const f = path.join(coversDir, `cover-${i}.jpg`);
    if (fs.existsSync(f)) {
      const size = fs.statSync(f).size;
      if (size === 0) {
        console.error(`   ⚠️ cover-${i}.jpg 文件大小为 0!`);
        allExist = false;
      }
    } else {
      console.error(`   ❌ 缺失 cover-${i}.jpg!`);
      allExist = false;
    }
  }

  if (allExist) {
    console.log(`🎉 确认全部 18 张封面图均已完整下载保存在 images/covers/ 目录中！`);
  } else {
    console.error(`⚠️ 部分封面图下载异常，请检查网络或重试。`);
  }
}

main().catch(err => {
  console.error('执行脚本时出错:', err);
  process.exit(1);
});
