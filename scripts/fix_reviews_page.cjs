const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

console.log('=== 第一步：为榴莲云、神行加速、闪电鼠及闭环文章建立 /posts/xxx/ 镜像 ===');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// 建立镜像，确保无论访问 /posts/xxx/ 还是 /article-xxx.html 都不 404
const mirrors = [
  {
    src: path.join(ROOT_DIR, 'article-liulianyun-2026-review.html'),
    destSlug: 'liulianyun-review-2026'
  },
  {
    src: path.join(ROOT_DIR, 'article-shenxing-2026-review.html'),
    destSlug: 'shenxing-review-2026'
  },
  {
    src: path.join(ROOT_DIR, 'article-shandianshu-2026-review.html'),
    destSlug: 'shandianshu-review-2026'
  },
  {
    src: path.join(ROOT_DIR, 'article-2026-beginner-clash-guide.html'),
    destSlug: '2026-beginner-clash-guide'
  }
];

mirrors.forEach(m => {
  if (fs.existsSync(m.src)) {
    const content = fs.readFileSync(m.src, 'utf-8');
    const destLocations = [
      path.join(ROOT_DIR, 'posts', m.destSlug, 'index.html'),
      path.join(ROOT_DIR, 'public', 'posts', m.destSlug, 'index.html'),
      path.join(ROOT_DIR, 'static', 'posts', m.destSlug, 'index.html')
    ];
    destLocations.forEach(dest => {
      ensureDir(path.dirname(dest));
      fs.writeFileSync(dest, content, 'utf-8');
      console.log(`✓ 镜像就绪: ${path.relative(ROOT_DIR, dest)}`);
    });
  }
});

console.log('\n=== 第二步：重构单品测评页结构 ===');

// 置顶 Hero Banner（横向通栏卡片，紧跟在黄色提示框正下方，6 宫格卡片正上方）
const HERO_BANNER_HTML = `      <!-- 全宽置顶高亮横幅（Hero Banner） -->
      <section class="w-full bg-slate-800/80 border border-blue-500/30 rounded-xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-blue-500/5">
        <div class="max-w-3xl">
          <div class="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 mb-2">
            <span class="inline-block h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
            【2026 年度闭环横评】
          </div>
          <h2 class="text-xl sm:text-2xl font-black tracking-tight text-white m-0">
            六大主流机场新手小白选购终极指南
          </h2>
          <p class="mt-2 text-sm text-slate-300 leading-relaxed m-0">
            全平台客户端（Clash / Sing-box / 小火箭）一键导入、防断流技巧、客服响应与资费避坑全维度对决。
          </p>
        </div>
        <div class="shrink-0 w-full md:w-auto">
          <a
            href="/article-2026-beginner-clash-guide.html"
            class="inline-flex w-full md:w-auto items-center justify-center rounded-xl bg-primary-600 hover:bg-primary-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary-600/30 transition focus:outline-none">
            阅读完整闭环指南 &rarr;
          </a>
        </div>
      </section>`;

// 纯净标准的 6 个单品卡片 HTML（网格采用 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6）
const CLEAN_GRID_HTML = `<section class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <!-- 文章一：云界线 -->
        <article class="article-link--card group relative min-h-full min-w-full overflow-hidden rounded-lg border border-neutral-300/80 bg-white/85 dark:border-neutral-600/80 dark:bg-neutral-900/80 flex flex-col justify-between">
          <div>
            <div class="flex-none relative overflow-hidden thumbnail_card" style="--thumbnail-aspect-ratio: 1.5">
              <img src="/images/covers/cover-1.jpg" alt="2026 云界线机场新手使用评测：Clash/Sing-box 一键导入与晚高峰开箱实测" loading="lazy" decoding="async" fetchpriority="low" class="post-cover nozoom not-prose absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" />
            </div>
            
            <div class="p-4">
              <header>
                <a
                  href="/posts/yunjiexian-review-2026/"
                  class="not-prose before:absolute before:inset-0 decoration-primary-500 dark:text-neutral text-xl font-bold text-neutral-800 hover:underline hover:underline-offset-2">
                  <h2>2026 云界线机场新手使用评测：Clash/Sing-box 一键导入与晚高峰开箱实测</h2>
                </a>
              </header>
              <div class="text-sm text-neutral-500 dark:text-neutral-400">
                <div class="flex flex-row flex-wrap items-center mt-2">
                  <span>3027 字</span><span class="px-2 text-primary-500">&middot;</span><span title="预计阅读">7 分钟</span><span class="px-2 text-primary-500">&middot;</span><span>
                    <span id="views_posts_yunjiexian.md" class="animate-pulse inline-block text-transparent max-h-3 rounded-full -mt-[2px] align-middle bg-neutral-300 dark:bg-neutral-400" title="views">1</span>
                    <span class="inline-block align-text-bottom"><span class="relative block icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4 142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM432 256c0 79.5-64.5 144-144 144s-144-64.5-144-144 64.5-144 144-144s144 64.5 144 144zM288 192c0 35.3-28.7 64-64 64c-11.5 0-22.3-3-31.6-8.4c-.2 2.8-.4 5.5-.4 8.4c0 53 43 96 96 96s96-43 96-96-43-96-96-96c-2.8 0-5.6 .1-8.4 .4c5.3 9.3 8.4 20.1 8.4 31.6z"/></svg></span></span>
                  </span>
                </div>

                <div class="flex flex-row flex-wrap items-center mt-3">
                  <span class="relative mt-[0.5rem] me-2 z-10">
                    <span class="flex"><span class="rounded-md border border-primary-400 px-1 py-[1px] text-xs font-normal text-primary-700 dark:border-primary-600 dark:text-primary-400">#机场测评</span></span>
                  </span>
                  <span class="relative mt-[0.5rem] me-2 z-10">
                    <span class="flex"><span class="rounded-md border border-primary-400 px-1 py-[1px] text-xs font-normal text-primary-700 dark:border-primary-600 dark:text-primary-400">#使用教程</span></span>
                  </span>
                  <span class="relative mt-[0.5rem] me-2 z-10">
                    <span class="flex"><span class="rounded-md border border-primary-400 px-1 py-[1px] text-xs font-normal text-primary-700 dark:border-primary-600 dark:text-primary-400">#云界线</span></span>
                  </span>
                  <span class="relative mt-[0.5rem] me-2 z-10">
                    <span class="flex"><span class="rounded-md border border-primary-400 px-1 py-[1px] text-xs font-normal text-primary-700 dark:border-primary-600 dark:text-primary-400">#2026机场推荐</span></span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="px-4 pb-4 pt-2 border-t border-neutral-200/60 dark:border-neutral-700/60 flex items-center justify-between text-xs z-10">
            <a href="/posts/yunjiexian-review-2026/" class="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              阅读完整评测 &rarr;
            </a>
            <a href="https://9625mofan01.yunjiexianaff.com/#/?code=OOYhSj0L" target="_blank" rel="nofollow sponsored noopener noreferrer" class="text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200">
              官网直达 ↗
            </a>
          </div>
        </article>

        <!-- 文章二：大佬云 -->
        <article class="article-link--card group relative min-h-full min-w-full overflow-hidden rounded-lg border border-neutral-300/80 bg-white/85 dark:border-neutral-600/80 dark:bg-neutral-900/80 flex flex-col justify-between">
          <div>
            <div class="flex-none relative overflow-hidden thumbnail_card" style="--thumbnail-aspect-ratio: 1.5">
              <img src="/images/covers/cover-2.jpg" alt="大佬云 2026 新手配置与使用指南：全平台客户端导入与客服响应实测" loading="lazy" decoding="async" fetchpriority="low" class="post-cover nozoom not-prose absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" />
            </div>
            
            <div class="p-4">
              <header>
                <a
                  href="/posts/dalaoyun-review-2026/"
                  class="not-prose before:absolute before:inset-0 decoration-primary-500 dark:text-neutral text-xl font-bold text-neutral-800 hover:underline hover:underline-offset-2">
                  <h2>大佬云 2026 新手配置与使用指南：全平台客户端导入与客服响应实测</h2>
                </a>
              </header>
              <div class="text-sm text-neutral-500 dark:text-neutral-400">
                <div class="flex flex-row flex-wrap items-center mt-2">
                  <span>2781 字</span><span class="px-2 text-primary-500">&middot;</span><span title="预计阅读">6 分钟</span><span class="px-2 text-primary-500">&middot;</span><span>
                    <span id="views_posts_dalaoyun.md" class="animate-pulse inline-block text-transparent max-h-3 rounded-full -mt-[2px] align-middle bg-neutral-300 dark:bg-neutral-400" title="views">1</span>
                    <span class="inline-block align-text-bottom"><span class="relative block icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4 142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM432 256c0 79.5-64.5 144-144 144s-144-64.5-144-144 64.5-144 144-144s144 64.5 144 144zM288 192c0 35.3-28.7 64-64 64c-11.5 0-22.3-3-31.6-8.4c-.2 2.8-.4 5.5-.4 8.4c0 53 43 96 96 96s96-43 96-96-43-96-96-96c-2.8 0-5.6 .1-8.4 .4c5.3 9.3 8.4 20.1 8.4 31.6z"/></svg></span></span>
                  </span>
                </div>

                <div class="flex flex-row flex-wrap items-center mt-3">
                  <span class="relative mt-[0.5rem] me-2 z-10">
                    <span class="flex"><span class="rounded-md border border-primary-400 px-1 py-[1px] text-xs font-normal text-primary-700 dark:border-primary-600 dark:text-primary-400">#机场测评</span></span>
                  </span>
                  <span class="relative mt-[0.5rem] me-2 z-10">
                    <span class="flex"><span class="rounded-md border border-primary-400 px-1 py-[1px] text-xs font-normal text-primary-700 dark:border-primary-600 dark:text-primary-400">#IPLC专线</span></span>
                  </span>
                  <span class="relative mt-[0.5rem] me-2 z-10">
                    <span class="flex"><span class="rounded-md border border-primary-400 px-1 py-[1px] text-xs font-normal text-primary-700 dark:border-primary-600 dark:text-primary-400">#大佬云</span></span>
                  </span>
                  <span class="relative mt-[0.5rem] me-2 z-10">
                    <span class="flex"><span class="rounded-md border border-primary-400 px-1 py-[1px] text-xs font-normal text-primary-700 dark:border-primary-600 dark:text-primary-400">#2026机场推荐</span></span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="px-4 pb-4 pt-2 border-t border-neutral-200/60 dark:border-neutral-700/60 flex items-center justify-between text-xs z-10">
            <a href="/posts/dalaoyun-review-2026/" class="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              阅读完整评测 &rarr;
            </a>
            <a href="https://mofanvip01.dalaoyunaff.com/#/?code=QT2rqp5V" target="_blank" rel="nofollow sponsored noopener noreferrer" class="text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200">
              官网直达 ↗
            </a>
          </div>
        </article>

        <!-- 文章三：环球梯 -->
        <article class="article-link--card group relative min-h-full min-w-full overflow-hidden rounded-lg border border-neutral-300/80 bg-white/85 dark:border-neutral-600/80 dark:bg-neutral-900/80 flex flex-col justify-between">
          <div>
            <div class="flex-none relative overflow-hidden thumbnail_card" style="--thumbnail-aspect-ratio: 1.5">
              <img src="/images/covers/cover-3.jpg" alt="环球梯 2026 怎么样？新手小白 Clash/小火箭配置实测与节点防断流技巧" loading="lazy" decoding="async" fetchpriority="low" class="post-cover nozoom not-prose absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" />
            </div>
            
            <div class="p-4">
              <header>
                <a
                  href="/posts/huanqiuti-review-2026/"
                  class="not-prose before:absolute before:inset-0 decoration-primary-500 dark:text-neutral text-xl font-bold text-neutral-800 hover:underline hover:underline-offset-2">
                  <h2>环球梯 2026 怎么样？新手小白 Clash/小火箭配置实测与节点防断流技巧</h2>
                </a>
              </header>
              <div class="text-sm text-neutral-500 dark:text-neutral-400">
                <div class="flex flex-row flex-wrap items-center mt-2">
                  <span>2735 字</span><span class="px-2 text-primary-500">&middot;</span><span title="预计阅读">6 分钟</span><span class="px-2 text-primary-500">&middot;</span><span>
                    <span id="views_posts_huanqiuti.md" class="animate-pulse inline-block text-transparent max-h-3 rounded-full -mt-[2px] align-middle bg-neutral-300 dark:bg-neutral-400" title="views">1</span>
                    <span class="inline-block align-text-bottom"><span class="relative block icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4 142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM432 256c0 79.5-64.5 144-144 144s-144-64.5-144-144 64.5-144 144-144s144 64.5 144 144zM288 192c0 35.3-28.7 64-64 64c-11.5 0-22.3-3-31.6-8.4c-.2 2.8-.4 5.5-.4 8.4c0 53 43 96 96 96s96-43 96-96-43-96-96-96c-2.8 0-5.6 .1-8.4 .4c5.3 9.3 8.4 20.1 8.4 31.6z"/></svg></span></span>
                  </span>
                </div>

                <div class="flex flex-row flex-wrap items-center mt-3">
                  <span class="relative mt-[0.5rem] me-2 z-10">
                    <span class="flex"><span class="rounded-md border border-primary-400 px-1 py-[1px] text-xs font-normal text-primary-700 dark:border-primary-600 dark:text-primary-400">#机场测评</span></span>
                  </span>
                  <span class="relative mt-[0.5rem] me-2 z-10">
                    <span class="flex"><span class="rounded-md border border-primary-400 px-1 py-[1px] text-xs font-normal text-primary-700 dark:border-primary-600 dark:text-primary-400">#节点防断流</span></span>
                  </span>
                  <span class="relative mt-[0.5rem] me-2 z-10">
                    <span class="flex"><span class="rounded-md border border-primary-400 px-1 py-[1px] text-xs font-normal text-primary-700 dark:border-primary-600 dark:text-primary-400">#环球梯</span></span>
                  </span>
                  <span class="relative mt-[0.5rem] me-2 z-10">
                    <span class="flex"><span class="rounded-md border border-primary-400 px-1 py-[1px] text-xs font-normal text-primary-700 dark:border-primary-600 dark:text-primary-400">#2026机场推荐</span></span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="px-4 pb-4 pt-2 border-t border-neutral-200/60 dark:border-neutral-700/60 flex items-center justify-between text-xs z-10">
            <a href="/posts/huanqiuti-review-2026/" class="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              阅读完整评测 &rarr;
            </a>
            <a href="https://mofanvip01.huanqiutiaff.com/#/?code=l7oLmjVU" target="_blank" rel="nofollow sponsored noopener noreferrer" class="text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200">
              官网直达 ↗
            </a>
          </div>
        </article>

        <!-- 文章四：榴莲云 -->
        <article class="article-link--card group relative min-h-full min-w-full overflow-hidden rounded-lg border border-neutral-300/80 bg-white/85 dark:border-neutral-600/80 dark:bg-neutral-900/80 flex flex-col justify-between">
          <div>
            <div class="flex-none relative overflow-hidden thumbnail_card" style="--thumbnail-aspect-ratio: 1.5">
              <img src="/images/covers/cover-4.jpg" alt="2026 榴莲云机场评测" loading="lazy" decoding="async" fetchpriority="low" class="post-cover nozoom not-prose absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" />
            </div>
            
            <div class="p-4">
              <header>
                <a
                  href="/posts/liulianyun-review-2026/"
                  class="not-prose before:absolute before:inset-0 decoration-primary-500 dark:text-neutral text-xl font-bold text-neutral-800 hover:underline hover:underline-offset-2">
                  <h2>2026 榴莲云机场使用评测：全节点 1x IPLC 专线实测与长周期套餐横评</h2>
                </a>
              </header>
              <div class="text-sm text-neutral-500 dark:text-neutral-400">
                <div class="flex flex-row flex-wrap items-center mt-2">
                  <span>2960 字</span><span class="px-2 text-primary-500">&middot;</span><span title="预计阅读">7 分钟</span><span class="px-2 text-primary-500">&middot;</span><span>
                    <span id="views_articles_liulianyun.md" class="animate-pulse inline-block text-transparent max-h-3 rounded-full -mt-[2px] align-middle bg-neutral-300 dark:bg-neutral-400" title="views">1</span>
                    <span class="inline-block align-text-bottom"><span class="relative block icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4 142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM432 256c0 79.5-64.5 144-144 144s-144-64.5-144-144 64.5-144 144-144s144 64.5 144 144zM288 192c0 35.3-28.7 64-64 64c-11.5 0-22.3-3-31.6-8.4c-.2 2.8-.4 5.5-.4 8.4c0 53 43 96 96 96s96-43 96-96-43-96-96-96c-2.8 0-5.6 .1-8.4 .4c5.3 9.3 8.4 20.1 8.4 31.6z"/></svg></span></span>
                  </span>
                </div>

                <div class="flex flex-row flex-wrap items-center mt-3">
                  <span class="relative mt-[0.5rem] me-2 z-10">
                    <span class="flex"><span class="rounded-md border border-primary-400 px-1 py-[1px] text-xs font-normal text-primary-700 dark:border-primary-600 dark:text-primary-400">#机场测评</span></span>
                  </span>
                  <span class="relative mt-[0.5rem] me-2 z-10">
                    <span class="flex"><span class="rounded-md border border-primary-400 px-1 py-[1px] text-xs font-normal text-primary-700 dark:border-primary-600 dark:text-primary-400">#IPLC专线</span></span>
                  </span>
                  <span class="relative mt-[0.5rem] me-2 z-10">
                    <span class="flex"><span class="rounded-md border border-primary-400 px-1 py-[1px] text-xs font-normal text-primary-700 dark:border-primary-600 dark:text-primary-400">#榴莲云</span></span>
                  </span>
                  <span class="relative mt-[0.5rem] me-2 z-10">
                    <span class="flex"><span class="rounded-md border border-primary-400 px-1 py-[1px] text-xs font-normal text-primary-700 dark:border-primary-600 dark:text-primary-400">#2026机场推荐</span></span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="px-4 pb-4 pt-2 border-t border-neutral-200/60 dark:border-neutral-700/60 flex items-center justify-between text-xs z-10">
            <a href="/posts/liulianyun-review-2026/" class="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              阅读完整评测 &rarr;
            </a>
            <a href="https://mofan88.liulianyunaff.com/#/?code=ETsQBSuR" target="_blank" rel="nofollow sponsored noopener noreferrer" class="text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200">
              官网直达 ↗
            </a>
          </div>
        </article>

        <!-- 文章五：神行加速 -->
        <article class="article-link--card group relative min-h-full min-w-full overflow-hidden rounded-lg border border-neutral-300/80 bg-white/85 dark:border-neutral-600/80 dark:bg-neutral-900/80 flex flex-col justify-between">
          <div>
            <div class="flex-none relative overflow-hidden thumbnail_card" style="--thumbnail-aspect-ratio: 1.5">
              <img src="/images/covers/cover-5.jpg" alt="2026 神行加速评测" loading="lazy" decoding="async" fetchpriority="low" class="post-cover nozoom not-prose absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" />
            </div>
            
            <div class="p-4">
              <header>
                <a
                  href="/posts/shenxing-review-2026/"
                  class="not-prose before:absolute before:inset-0 decoration-primary-500 dark:text-neutral text-xl font-bold text-neutral-800 hover:underline hover:underline-offset-2">
                  <h2>2026 神行加速测评：BGP 中转专线 + FullCone NAT 电竞级与追剧实测</h2>
                </a>
              </header>
              <div class="text-sm text-neutral-500 dark:text-neutral-400">
                <div class="flex flex-row flex-wrap items-center mt-2">
                  <span>2910 字</span><span class="px-2 text-primary-500">&middot;</span><span title="预计阅读">7 分钟</span><span class="px-2 text-primary-500">&middot;</span><span>
                    <span id="views_articles_shenxing.md" class="animate-pulse inline-block text-transparent max-h-3 rounded-full -mt-[2px] align-middle bg-neutral-300 dark:bg-neutral-400" title="views">1</span>
                    <span class="inline-block align-text-bottom"><span class="relative block icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4 142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM432 256c0 79.5-64.5 144-144 144s-144-64.5-144-144 64.5-144 144-144s144 64.5 144 144zM288 192c0 35.3-28.7 64-64 64c-11.5 0-22.3-3-31.6-8.4c-.2 2.8-.4 5.5-.4 8.4c0 53 43 96 96 96s96-43 96-96-43-96-96-96c-2.8 0-5.6 .1-8.4 .4c5.3 9.3 8.4 20.1 8.4 31.6z"/></svg></span></span>
                  </span>
                </div>

                <div class="flex flex-row flex-wrap items-center mt-3">
                  <span class="relative mt-[0.5rem] me-2 z-10">
                    <span class="flex"><span class="rounded-md border border-primary-400 px-1 py-[1px] text-xs font-normal text-primary-700 dark:border-primary-600 dark:text-primary-400">#机场测评</span></span>
                  </span>
                  <span class="relative mt-[0.5rem] me-2 z-10">
                    <span class="flex"><span class="rounded-md border border-primary-400 px-1 py-[1px] text-xs font-normal text-primary-700 dark:border-primary-600 dark:text-primary-400">#游戏加速</span></span>
                  </span>
                  <span class="relative mt-[0.5rem] me-2 z-10">
                    <span class="flex"><span class="rounded-md border border-primary-400 px-1 py-[1px] text-xs font-normal text-primary-700 dark:border-primary-600 dark:text-primary-400">#神行加速</span></span>
                  </span>
                  <span class="relative mt-[0.5rem] me-2 z-10">
                    <span class="flex"><span class="rounded-md border border-primary-400 px-1 py-[1px] text-xs font-normal text-primary-700 dark:border-primary-600 dark:text-primary-400">#FullCone</span></span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="px-4 pb-4 pt-2 border-t border-neutral-200/60 dark:border-neutral-700/60 flex items-center justify-between text-xs z-10">
            <a href="/posts/shenxing-review-2026/" class="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              阅读完整评测 &rarr;
            </a>
            <a href="https://vipmofan01.shenxingaff.com/#/?code=nn4ohwnK" target="_blank" rel="nofollow sponsored noopener noreferrer" class="text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200">
              官网直达 ↗
            </a>
          </div>
        </article>

        <!-- 文章六：闪电鼠 -->
        <article class="article-link--card group relative min-h-full min-w-full overflow-hidden rounded-lg border border-neutral-300/80 bg-white/85 dark:border-neutral-600/80 dark:bg-neutral-900/80 flex flex-col justify-between">
          <div>
            <div class="flex-none relative overflow-hidden thumbnail_card" style="--thumbnail-aspect-ratio: 1.5">
              <img src="/images/covers/cover-6.jpg" alt="2026 闪电鼠机场评测" loading="lazy" decoding="async" fetchpriority="low" class="post-cover nozoom not-prose absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" />
            </div>
            
            <div class="p-4">
              <header>
                <a
                  href="/posts/shandianshu-review-2026/"
                  class="not-prose before:absolute before:inset-0 decoration-primary-500 dark:text-neutral text-xl font-bold text-neutral-800 hover:underline hover:underline-offset-2">
                  <h2>2026 闪电鼠怎么样？全节点 1x IEPL 专线体验与年付避坑指南</h2>
                </a>
              </header>
              <div class="text-sm text-neutral-500 dark:text-neutral-400">
                <div class="flex flex-row flex-wrap items-center mt-2">
                  <span>2980 字</span><span class="px-2 text-primary-500">&middot;</span><span title="预计阅读">7 分钟</span><span class="px-2 text-primary-500">&middot;</span><span>
                    <span id="views_articles_shandianshu.md" class="animate-pulse inline-block text-transparent max-h-3 rounded-full -mt-[2px] align-middle bg-neutral-300 dark:bg-neutral-400" title="views">1</span>
                    <span class="inline-block align-text-bottom"><span class="relative block icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4 142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM432 256c0 79.5-64.5 144-144 144s-144-64.5-144-144 64.5-144 144-144s144 64.5 144 144zM288 192c0 35.3-28.7 64-64 64c-11.5 0-22.3-3-31.6-8.4c-.2 2.8-.4 5.5-.4 8.4c0 53 43 96 96 96s96-43 96-96-43-96-96-96c-2.8 0-5.6 .1-8.4 .4c5.3 9.3 8.4 20.1 8.4 31.6z"/></svg></span></span>
                  </span>
                </div>

                <div class="flex flex-row flex-wrap items-center mt-3">
                  <span class="relative mt-[0.5rem] me-2 z-10">
                    <span class="flex"><span class="rounded-md border border-primary-400 px-1 py-[1px] text-xs font-normal text-primary-700 dark:border-primary-600 dark:text-primary-400">#机场测评</span></span>
                  </span>
                  <span class="relative mt-[0.5rem] me-2 z-10">
                    <span class="flex"><span class="rounded-md border border-primary-400 px-1 py-[1px] text-xs font-normal text-primary-700 dark:border-primary-600 dark:text-primary-400">#IEPL专线</span></span>
                  </span>
                  <span class="relative mt-[0.5rem] me-2 z-10">
                    <span class="flex"><span class="rounded-md border border-primary-400 px-1 py-[1px] text-xs font-normal text-primary-700 dark:border-primary-600 dark:text-primary-400">#闪电鼠</span></span>
                  </span>
                  <span class="relative mt-[0.5rem] me-2 z-10">
                    <span class="flex"><span class="rounded-md border border-primary-400 px-1 py-[1px] text-xs font-normal text-primary-700 dark:border-primary-600 dark:text-primary-400">#多设备并发</span></span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="px-4 pb-4 pt-2 border-t border-neutral-200/60 dark:border-neutral-700/60 flex items-center justify-between text-xs z-10">
            <a href="/posts/shandianshu-review-2026/" class="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              阅读完整评测 &rarr;
            </a>
            <a href="https://mofanvip01.shandianshuaff.com/#/?code=a3GAQAXg" target="_blank" rel="nofollow sponsored noopener noreferrer" class="text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200">
              官网直达 ↗
            </a>
          </div>
        </article>
      </section>`;

// 需要应用此修复的所有单品测评页面模板与静态生成文件
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

    // 匹配从 <section class="w-full grid ..."> 开始到 </section> 结束的文章网格
    // 并在黄色提示框下方插入 HERO_BANNER_HTML
    const yellowBoxMarker = '</div>\n      </div>';
    
    // 替换网格区域：先清除所有已存在的置顶横幅和网格
    // 匹配 <section class="w-full bg-slate-800 ...</section>（如果已存在）
    content = content.replace(/<section class="w-full bg-slate-800[\s\S]*?<\/section>\s*/gi, '');
    
    // 匹配并替换从 <section class="w-full grid ..."> 到 </section>
    const gridRegex = /<section\s+class="w-full\s+grid[^"]*"[^>]*>[\s\S]*?<\/section>/i;
    if (gridRegex.test(content)) {
      content = content.replace(gridRegex, `${HERO_BANNER_HTML}\n\n      ${CLEAN_GRID_HTML}`);
      fs.writeFileSync(file, content, 'utf-8');
      console.log(`✅ 成功修复单品测评页面结构: ${path.relative(ROOT_DIR, file)}`);
    } else {
      console.warn(`⚠️ 未找到网格位置: ${path.relative(ROOT_DIR, file)}`);
    }
  }
});

console.log('\n=== 完成单品测评页结构与样式修复 ===');
