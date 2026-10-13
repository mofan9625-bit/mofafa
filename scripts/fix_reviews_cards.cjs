const fs = require('fs');
const path = require('path');

// 1. 更新 CSS 样式
const cssContent = `/* ==========================================================================
   魔法Clash机场 - 单品测评与相关文章卡片全局样式
   ========================================================================== */

/* 单品测评专栏卡片（Reviews Grid）统一布局与图片规范 */
.article-link--card {
  display: flex !important;
  flex-direction: column !important;
  justify-content: space-between !important;
  min-height: 100%;
}

.article-link--card .thumbnail_card,
.thumbnail_card {
  width: 100%;
  height: 200px !important;
  min-height: 200px;
  max-height: 200px;
  overflow: hidden;
  position: relative;
  border-radius: 8px 8px 0 0;
}

.article-link--card img,
.thumbnail_card img,
img.post-cover {
  width: 100% !important;
  height: 200px !important;
  object-fit: cover !important;
  display: block !important;
  border-radius: 8px 8px 0 0 !important;
}

/* 相关文章（Related Posts）卡片图片统一规范与兜底样式 */
.article-link--related .thumbnail_card_related {
  width: 100%;
  height: 160px;
  overflow: hidden;
  position: relative;
  border-radius: 8px 8px 0 0;
}

.article-link--related img,
.thumbnail_card_related img,
article.article-link--related .thumbnail_card_related img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 8px 8px 0 0;
  display: block;
}
`;

fs.writeFileSync('css/style.css', cssContent, 'utf8');
fs.writeFileSync('public/css/style.css', cssContent, 'utf8');
fs.writeFileSync('static/css/style.css', cssContent, 'utf8');

// 追加更新 public/css/main.bundle.min.css
const mainCssPath = 'public/css/main.bundle.min.css';
let mainCss = fs.readFileSync(mainCssPath, 'utf8');
const minCssRule = `.article-link--card{display:flex!important;flex-direction:column!important;justify-content:space-between!important;min-height:100%}.article-link--card .thumbnail_card,.thumbnail_card{width:100%;height:200px!important;min-height:200px;max-height:200px;overflow:hidden;position:relative;border-radius:8px 8px 0 0}.article-link--card img,.thumbnail_card img,img.post-cover{width:100%!important;height:200px!important;object-fit:cover!important;display:block!important;border-radius:8px 8px 0 0!important}`;
if (!mainCss.includes('.article-link--card .thumbnail_card')) {
  mainCss += '\n' + minCssRule + '\n';
  fs.writeFileSync(mainCssPath, mainCss, 'utf8');
}

console.log('CSS updated successfully.');

// 2. 6 张单品测评卡片的标准 HTML
const cardsSectionHtml = `      <section class="w-full grid gap-6 sm:grid-cols-2 md:grid-cols-3 mt-8">
        
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
                  href="/article-liulianyun-2026-review.html"
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
            <a href="/article-liulianyun-2026-review.html" class="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
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
                  href="/article-shenxing-2026-review.html"
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
            <a href="/article-shenxing-2026-review.html" class="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
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
                  href="/article-shandianshu-2026-review.html"
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
            <a href="/article-shandianshu-2026-review.html" class="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              阅读完整评测 &rarr;
            </a>
            <a href="https://mofanvip01.shandianshuaff.com/#/?code=a3GAQAXg" target="_blank" rel="nofollow sponsored noopener noreferrer" class="text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200">
              官网直达 ↗
            </a>
          </div>
        </article>

      </section>`;

// 3. 替换各个 review 页面中的 <section class="...grid...">...</section>
const reviewFiles = [
  'reviews.html',
  'public/reviews.html',
  'static/reviews.html',
  'reviews/index.html',
  'public/reviews/index.html',
  'static/reviews/index.html'
];

for (const relPath of reviewFiles) {
  if (!fs.existsSync(relPath)) {
    console.log('File does not exist, skipping:', relPath);
    continue;
  }
  let content = fs.readFileSync(relPath, 'utf8');

  // 确保引入 /css/style.css
  if (!content.includes('/css/style.css')) {
    content = content.replace('</head>', '  <link type="text/css" rel="stylesheet" href="/css/style.css">\n</head>');
  }

  // 替换卡片 section
  const sectionRegex = /<section\b[^>]*\bgrid\b[^>]*>[\s\S]*?<\/section>/i;
  if (sectionRegex.test(content)) {
    content = content.replace(sectionRegex, cardsSectionHtml.trim());
    fs.writeFileSync(relPath, content, 'utf8');
    console.log('Successfully updated:', relPath);
  } else {
    console.warn('Could not find grid section in:', relPath);
  }
}
