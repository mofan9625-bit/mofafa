const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const NEW_ARTICLE_SLUG = 'article-2026-beginner-clash-guide';
const NEW_ARTICLE_FILENAME = `${NEW_ARTICLE_SLUG}.html`;
const NEW_ARTICLE_URL = `/${NEW_ARTICLE_FILENAME}`;
const FULL_SITE_URL = `https://mofaclashjichang.com${NEW_ARTICLE_URL}`;

const PILLAR_TITLE = '2026 新手小白选购指南：六大主流机场 Clash / Sing-box / 小火箭一键导入与防断流避坑横评 - 魔法Clash机场';
const PILLAR_DESC = '专门针对科学上网新手小白与多设备用户，对云界线、大佬云、环球梯、榴莲云、神行加速、闪电鼠六大主流机场展开开箱横评。涵盖全平台客户端一键订阅导入、节点防断流技巧、客服响应速度与新手防坑算账实测。';

console.log('=== 第一步：规范命名并同步文件 ===');

// 读取之前生成的 HTML 内容并更新 canonical 和 og:url
const prevHtmlPath = path.join(ROOT_DIR, 'posts', '2026-clash-beginner-airport-selection-guide.html');
let htmlContent = fs.readFileSync(prevHtmlPath, 'utf-8');

// 更新规范链接
htmlContent = htmlContent.replace(/https:\/\/mofaclashjichang\.com\/posts\/2026-clash-beginner-airport-selection-guide\.html/g, FULL_SITE_URL);
htmlContent = htmlContent.replace(/"url":\s*"[^"]+"/g, `"url": "${FULL_SITE_URL}"`);

// 目标文件位置：
// 1. article-2026-beginner-clash-guide.html 在根目录、public、static
// 2. 同时保留 posts/2026-clash-beginner-airport-selection-guide.html 以免之前链接失效
const articleFiles = [
  path.join(ROOT_DIR, NEW_ARTICLE_FILENAME),
  path.join(ROOT_DIR, 'public', NEW_ARTICLE_FILENAME),
  path.join(ROOT_DIR, 'static', NEW_ARTICLE_FILENAME),
  path.join(ROOT_DIR, 'posts', '2026-clash-beginner-airport-selection-guide.html'),
  path.join(ROOT_DIR, 'public', 'posts', '2026-clash-beginner-airport-selection-guide.html'),
  path.join(ROOT_DIR, 'public', 'posts', '2026-clash-beginner-airport-selection-guide', 'index.html'),
  path.join(ROOT_DIR, 'static', 'posts', '2026-clash-beginner-airport-selection-guide.html')
];

articleFiles.forEach(file => {
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, htmlContent, 'utf-8');
  console.log(`✓ 写入: ${path.relative(ROOT_DIR, file)}`);
});

// 更新 sitemap.xml
const sitemapPath = path.join(ROOT_DIR, 'public', 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  let sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
  if (!sitemapContent.includes(FULL_SITE_URL)) {
    const newEntry = `  <url>
    <loc>${FULL_SITE_URL}</loc>
    <lastmod>2026-10-18T15:20:00+08:00</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>\n`;
    sitemapContent = sitemapContent.replace('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n' + newEntry);
    fs.writeFileSync(sitemapPath, sitemapContent, 'utf-8');
    console.log(`✓ 成功将规范URL添加至 sitemap.xml: ${FULL_SITE_URL}`);
  }
}

console.log('\n=== 第二步：在单品测评页挂载置顶横评卡片 ===');

// 单品测评专栏卡片 HTML
const REVIEW_PILLAR_CARD = `        <!-- 置顶支柱横评卡片：2026六大主流机场新手选购与客户端一键导入指南 -->
        <article class="article-link--card group relative min-h-full min-w-full overflow-hidden rounded-lg border-2 border-primary-500/80 bg-white/95 shadow-md shadow-primary-500/10 dark:border-primary-500/80 dark:bg-neutral-900/90 flex flex-col justify-between sm:col-span-2 md:col-span-3 lg:col-span-3">
          <div class="flex flex-col md:flex-row md:items-center">
            <div class="flex-none relative overflow-hidden thumbnail_card w-full md:w-2/5" style="--thumbnail-aspect-ratio: 1.6">
              <span class="absolute top-3 left-3 z-20 rounded-md bg-primary-600 px-2.5 py-1 text-xs font-bold text-white shadow-md">
                🔥 2026 新手必读总榜
              </span>
              <img src="/images/covers/cover-1.jpg" alt="2026 新手小白选购指南：六大主流机场 Clash / Sing-box / 小火箭一键导入与防断流避坑横评" loading="lazy" decoding="async" fetchpriority="high" class="post-cover nozoom not-prose absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" />
            </div>
            
            <div class="p-5 md:p-6 flex-1">
              <header>
                <a
                  href="${NEW_ARTICLE_URL}"
                  class="not-prose before:absolute before:inset-0 decoration-primary-500 dark:text-neutral text-xl sm:text-2xl font-extrabold text-neutral-900 hover:underline hover:underline-offset-2">
                  <h2>2026 新手小白选购指南：六大主流机场 Clash / Sing-box / 小火箭一键导入与防断流避坑横评</h2>
                </a>
              </header>
              <p class="mt-2 text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2 leading-relaxed">
                专门针对科学上网零基础新手与多设备用户，对云界线、大佬云、环球梯、榴莲云、神行加速、闪电鼠六大主流机场展开开箱横评。涵盖全平台客户端一键订阅导入、节点防断流技巧、客服响应速度与新手防坑算账实测。
              </p>
              <div class="text-sm text-neutral-500 dark:text-neutral-400">
                <div class="flex flex-row flex-wrap items-center mt-3">
                  <span>4280 字</span><span class="px-2 text-primary-500">&middot;</span><span title="预计阅读">11 分钟</span><span class="px-2 text-primary-500">&middot;</span><span class="text-primary-600 dark:text-primary-400 font-semibold">支柱总榜</span>
                </div>

                <div class="flex flex-row flex-wrap items-center mt-3">
                  <span class="relative mt-[0.5rem] me-2 z-10">
                    <span class="flex"><span class="rounded-md border border-primary-500 bg-primary-100/60 px-2 py-[2px] text-xs font-medium text-primary-800 dark:bg-primary-950/60 dark:border-primary-600 dark:text-primary-300">#支柱横评</span></span>
                  </span>
                  <span class="relative mt-[0.5rem] me-2 z-10">
                    <span class="flex"><span class="rounded-md border border-primary-400 px-1 py-[1px] text-xs font-normal text-primary-700 dark:border-primary-600 dark:text-primary-400">#新手教程</span></span>
                  </span>
                  <span class="relative mt-[0.5rem] me-2 z-10">
                    <span class="flex"><span class="rounded-md border border-primary-400 px-1 py-[1px] text-xs font-normal text-primary-700 dark:border-primary-600 dark:text-primary-400">#Clash配置</span></span>
                  </span>
                  <span class="relative mt-[0.5rem] me-2 z-10">
                    <span class="flex"><span class="rounded-md border border-primary-400 px-1 py-[1px] text-xs font-normal text-primary-700 dark:border-primary-600 dark:text-primary-400">#小火箭导入</span></span>
                  </span>
                  <span class="relative mt-[0.5rem] me-2 z-10">
                    <span class="flex"><span class="rounded-md border border-primary-400 px-1 py-[1px] text-xs font-normal text-primary-700 dark:border-primary-600 dark:text-primary-400">#防断流避坑</span></span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="px-5 py-3 border-t border-neutral-200/60 bg-neutral-50/50 dark:border-neutral-700/60 dark:bg-neutral-800/40 flex items-center justify-between text-xs sm:text-sm z-10">
            <a href="${NEW_ARTICLE_URL}" class="font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center gap-1">
              查看 2026 六大品牌选购横评总榜 &rarr;
            </a>
            <span class="text-neutral-500 dark:text-neutral-400">
              包含全平台一键导入 &middot; 自动切线防断流 &middot; 客服工单实测
            </span>
          </div>
        </article>\n`;

const reviewFiles = [
  path.join(ROOT_DIR, 'reviews.html'),
  path.join(ROOT_DIR, 'public', 'reviews.html'),
  path.join(ROOT_DIR, 'static', 'reviews.html'),
  path.join(ROOT_DIR, 'reviews', 'index.html'),
  path.join(ROOT_DIR, 'public', 'reviews', 'index.html'),
  path.join(ROOT_DIR, 'static', 'reviews', 'index.html')
];

reviewFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf-8');
    if (!content.includes(NEW_ARTICLE_SLUG)) {
      // 插入到 <section class="w-full grid ..."> 的最开始
      const gridRegex = /(<section\s+class="[^"]*grid[^"]*"[^>]*>)/i;
      if (gridRegex.test(content)) {
        content = content.replace(gridRegex, `$1\n${REVIEW_PILLAR_CARD}`);
        fs.writeFileSync(file, content, 'utf-8');
        console.log(`✓ 成功挂载置顶卡片到: ${path.relative(ROOT_DIR, file)}`);
      } else {
        console.log(`⚠️ 未找到网格位置: ${path.relative(ROOT_DIR, file)}`);
      }
    } else {
      console.log(`- 已存在卡片: ${path.relative(ROOT_DIR, file)}`);
    }
  }
});

console.log('\n=== 第三步：在首页挂载置顶横幅（Banner）卡片 ===');

const HOMEPAGE_BANNER = `      <!-- 2026 新手选购横评置顶横幅 Banner -->
      <section class="my-8">
        <div class="relative overflow-hidden rounded-2xl border-2 border-primary-500/50 bg-gradient-to-r from-primary-900/30 via-neutral-900/60 to-primary-950/40 p-6 sm:p-8 backdrop-blur-xl shadow-xl shadow-primary-950/20">
          <div class="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-primary-500/10 blur-3xl pointer-events-none"></div>
          <div class="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div class="max-w-3xl">
              <div class="inline-flex items-center gap-2 rounded-full border border-primary-400/30 bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-600 dark:text-primary-400 mb-3">
                <span class="inline-block h-2 w-2 rounded-full bg-primary-500 animate-pulse"></span>
                2026 支柱指南 · 新手必读
              </div>
              <h2 class="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 dark:text-white leading-tight">
                2026 新手小白选购指南：六大主流机场 Clash / Sing-box / 小火箭一键导入与防断流避坑横评
              </h2>
              <p class="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
                对云界线、大佬云、环球梯、榴莲云、神行加速、闪电鼠展开真实开箱横测！涵盖全平台一键导入、自动防断流切线、工单时效与新手防坑算账实测。
              </p>
            </div>
            <div class="shrink-0 flex flex-col sm:flex-row md:flex-col gap-3">
              <a
                href="${NEW_ARTICLE_URL}"
                class="inline-flex items-center justify-center rounded-xl bg-primary-600 px-6 py-3 text-base font-bold text-white shadow-lg shadow-primary-600/30 transition hover:bg-primary-700 hover:shadow-primary-600/50 focus:outline-none">
                直达总览横评 &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>\n`;

const homepageFiles = [
  path.join(ROOT_DIR, 'index.html'),
  path.join(ROOT_DIR, 'public', 'index.html')
];

homepageFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf-8');
    if (!content.includes(NEW_ARTICLE_SLUG)) {
      // 在 <section><h2 class="mt-8 text-2xl font-extrabold mb-10">最近的文章</h2> 之前插入 Banner
      const headingRegex = /(<section>\s*<h2\s+class="[^"]*font-extrabold[^"]*">\s*最近的文章\s*<\/h2>)/i;
      if (headingRegex.test(content)) {
        content = content.replace(headingRegex, `${HOMEPAGE_BANNER}\n$1`);
        fs.writeFileSync(file, content, 'utf-8');
        console.log(`✓ 成功挂载置顶横幅到首页: ${path.relative(ROOT_DIR, file)}`);
      } else {
        console.log(`⚠️ 未找到最近文章标题: ${path.relative(ROOT_DIR, file)}`);
      }
    } else {
      console.log(`- 首页已存在该横幅: ${path.relative(ROOT_DIR, file)}`);
    }
  }
});

console.log('\n=== 第四步：同步更新 6 篇测评反向回链至规范URL ===');

const targetReviews = [
  path.join(ROOT_DIR, 'content', 'posts', 'yunjiexian-review-2026.md'),
  path.join(ROOT_DIR, 'public', 'posts', 'yunjiexian-review-2026', 'index.html'),
  path.join(ROOT_DIR, 'content', 'posts', 'dalaoyun-review-2026.md'),
  path.join(ROOT_DIR, 'public', 'posts', 'dalaoyun-review-2026', 'index.html'),
  path.join(ROOT_DIR, 'content', 'posts', 'huanqiuti-review-2026.md'),
  path.join(ROOT_DIR, 'public', 'posts', 'huanqiuti-review-2026', 'index.html'),
  path.join(ROOT_DIR, 'article-liulianyun-2026-review.html'),
  path.join(ROOT_DIR, 'public', 'article-liulianyun-2026-review.html'),
  path.join(ROOT_DIR, 'static', 'article-liulianyun-2026-review.html'),
  path.join(ROOT_DIR, 'article-shenxing-2026-review.html'),
  path.join(ROOT_DIR, 'public', 'article-shenxing-2026-review.html'),
  path.join(ROOT_DIR, 'static', 'article-shenxing-2026-review.html'),
  path.join(ROOT_DIR, 'article-shandianshu-2026-review.html'),
  path.join(ROOT_DIR, 'public', 'article-shandianshu-2026-review.html'),
  path.join(ROOT_DIR, 'static', 'article-shandianshu-2026-review.html')
];

targetReviews.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf-8');
    if (content.includes('/posts/2026-clash-beginner-airport-selection-guide.html')) {
      content = content.replace(/\/posts\/2026-clash-beginner-airport-selection-guide\.html/g, NEW_ARTICLE_URL);
      fs.writeFileSync(file, content, 'utf-8');
      console.log(`✓ 更新回链URL至规范路径: ${path.relative(ROOT_DIR, file)}`);
    }
  }
});

console.log('\n=== 完成前端入口挂载 ===');
console.log('规范在线直达 URL: ' + NEW_ARTICLE_URL);
