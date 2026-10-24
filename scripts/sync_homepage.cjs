const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// =========================================================================
// 1. 读取站内所有文章并提取元数据
// =========================================================================
console.log('>>> [Step 1] 读取站内所有测评与教程文章最新日期...');

// 单品测评专栏 6 篇卡片标准元数据定义（与 reviews.html 严格一致）
const reviewsData = [
  {
    id: 'liulianyun',
    title: '2026 榴莲云机场使用评测：全节点 1x IPLC 专线实测与长周期套餐横评',
    alt: '2026 榴莲云机场评测',
    cover: '/images/covers/cover-4.jpg',
    url: '/article-liulianyun-2026-review.html',
    affUrl: 'https://mofan88.liulianyunaff.com/#/?code=ETsQBSuR',
    date: '2026-10-12T10:00:00+08:00',
    words: '2960 字',
    readingTime: '7 分钟',
    viewId: 'views_articles_liulianyun.md',
    tags: ['#机场测评', '#IPLC专线', '#榴莲云', '#2026机场推荐'],
    category: '单品测评'
  },
  {
    id: 'shenxing',
    title: '2026 神行加速测评：BGP 中转专线 + FullCone NAT 电竞级与追剧实测',
    alt: '2026 神行加速评测',
    cover: '/images/covers/cover-5.jpg',
    url: '/article-shenxing-2026-review.html',
    affUrl: 'https://vipmofan01.shenxingaff.com/#/?code=nn4ohwnK',
    date: '2026-10-12T11:00:00+08:00',
    words: '2910 字',
    readingTime: '7 分钟',
    viewId: 'views_articles_shenxing.md',
    tags: ['#机场测评', '#游戏加速', '#神行加速', '#FullCone'],
    category: '单品测评'
  },
  {
    id: 'shandianshu',
    title: '2026 闪电鼠怎么样？全节点 1x IEPL 专线体验与年付避坑指南',
    alt: '2026 闪电鼠机场评测',
    cover: '/images/covers/cover-6.jpg',
    url: '/article-shandianshu-2026-review.html',
    affUrl: 'https://mofanvip01.shandianshuaff.com/#/?code=a3GAQAXg',
    date: '2026-10-12T12:00:00+08:00',
    words: '2980 字',
    readingTime: '7 分钟',
    viewId: 'views_articles_shandianshu.md',
    tags: ['#机场测评', '#IEPL专线', '#闪电鼠', '#多设备并发'],
    category: '单品测评'
  },
  {
    id: 'yunjiexian',
    title: '2026 云界线机场新手使用评测：Clash/Sing-box 一键导入与晚高峰开箱实测',
    alt: '2026 云界线机场新手使用评测：Clash/Sing-box 一键导入与晚高峰开箱实测',
    cover: '/images/covers/cover-1.jpg',
    url: '/posts/yunjiexian-review-2026/',
    affUrl: 'https://9625mofan01.yunjiexianaff.com/#/?code=OOYhSj0L',
    date: '2026-10-11T15:00:00+08:00',
    words: '3027 字',
    readingTime: '7 分钟',
    viewId: 'views_posts_yunjiexian.md',
    tags: ['#机场测评', '#使用教程', '#云界线', '#2026机场推荐'],
    category: '单品测评'
  },
  {
    id: 'dalaoyun',
    title: '大佬云 2026 新手配置与使用指南：全平台客户端导入与客服响应实测',
    alt: '大佬云 2026 新手配置与使用指南：全平台客户端导入与客服响应实测',
    cover: '/images/covers/cover-2.jpg',
    url: '/posts/dalaoyun-review-2026/',
    affUrl: 'https://mofanvip01.dalaoyunaff.com/#/?code=QT2rqp5V',
    date: '2026-10-11T15:00:00+08:00',
    words: '2781 字',
    readingTime: '6 分钟',
    viewId: 'views_posts_dalaoyun.md',
    tags: ['#机场测评', '#IPLC专线', '#大佬云', '#2026机场推荐'],
    category: '单品测评'
  },
  {
    id: 'huanqiuti',
    title: '环球梯 2026 怎么样？新手小白 Clash/小火箭配置实测与节点防断流技巧',
    alt: '环球梯 2026 怎么样？新手小白 Clash/小火箭配置实测与节点防断流技巧',
    cover: '/images/covers/cover-3.jpg',
    url: '/posts/huanqiuti-review-2026/',
    affUrl: 'https://mofanvip01.huanqiutiaff.com/#/?code=l7oLmjVU',
    date: '2026-10-11T15:00:00+08:00',
    words: '2735 字',
    readingTime: '6 分钟',
    viewId: 'views_posts_huanqiuti.md',
    tags: ['#机场测评', '#节点防断流', '#环球梯', '#2026机场推荐'],
    category: '单品测评'
  }
];

// 生成单品测评卡片 HTML 函数
function generateReviewCardHtml(r) {
  const tagsHtml = r.tags.map(t => `                  <span class="relative mt-[0.5rem] me-2 z-10">
                    <span class="flex"><span class="rounded-md border border-primary-400 px-1 py-[1px] text-xs font-normal text-primary-700 dark:border-primary-600 dark:text-primary-400">${t}</span></span>
                  </span>`).join('\n');

  return `        <!-- 测评文章：${r.id} -->
        <article class="article-link--card group relative min-h-full min-w-full overflow-hidden rounded-lg border border-neutral-300/80 bg-white/85 dark:border-neutral-600/80 dark:bg-neutral-900/80 flex flex-col justify-between">
          <div>
            <div class="flex-none relative overflow-hidden thumbnail_card" style="--thumbnail-aspect-ratio: 1.5">
              <img src="${r.cover}" alt="${r.alt}" loading="lazy" decoding="async" fetchpriority="low" class="post-cover nozoom not-prose absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" />
            </div>
            
            <div class="p-4">
              <header>
                <a
                  href="${r.url}"
                  class="not-prose before:absolute before:inset-0 decoration-primary-500 dark:text-neutral text-xl font-bold text-neutral-800 hover:underline hover:underline-offset-2">
                  <h2>${r.title}</h2>
                </a>
              </header>
              <div class="text-sm text-neutral-500 dark:text-neutral-400">
                <div class="flex flex-row flex-wrap items-center mt-2">
                  <span>${r.words}</span><span class="px-2 text-primary-500">&middot;</span><span title="预计阅读">${r.readingTime}</span><span class="px-2 text-primary-500">&middot;</span><span>
                    <span id="${r.viewId}" class="animate-pulse inline-block text-transparent max-h-3 rounded-full -mt-[2px] align-middle bg-neutral-300 dark:bg-neutral-400" title="views">1</span>
                    <span class="inline-block align-text-bottom"><span class="relative block icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4 142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM432 256c0 79.5-64.5 144-144 144s-144-64.5-144-144 64.5-144 144-144s144 64.5 144 144zM288 192c0 35.3-28.7 64-64 64c-11.5 0-22.3-3-31.6-8.4c-.2 2.8-.4 5.5-.4 8.4c0 53 43 96 96 96s96-43 96-96-43-96-96-96c-2.8 0-5.6 .1-8.4 .4c5.3 9.3 8.4 20.1 8.4 31.6z"/></svg></span></span>
                  </span>
                </div>

                <div class="flex flex-row flex-wrap items-center mt-3">
${tagsHtml}
                </div>
              </div>
            </div>
          </div>
          
          <div class="px-4 pb-4 pt-2 border-t border-neutral-200/60 dark:border-neutral-700/60 flex items-center justify-between text-xs z-10">
            <a href="${r.url}" class="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              阅读完整评测 &rarr;
            </a>
            <a href="${r.affUrl}" target="_blank" rel="nofollow sponsored noopener noreferrer" class="text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200">
              官网直达 ↗
            </a>
          </div>
        </article>`;
}

// 教程文章列表与元数据（来自原 index.html，更新 cover-7 ~ cover-18 避免重复）
const tutorialCards = [
  {
    title: '连上后国内网站打不开？微信转圈？Clash & Sing-box 节点分组与分流规则“白话自救”手册',
    url: '/posts/2026-rules-and-node-groups-explained/',
    cover: '/images/covers/cover-15.jpg',
    date: '2026-10-23T10:00:00+08:00',
    words: '3100 字',
    readingTime: '7 分钟',
    viewId: 'views_posts\\2026-rules-and-node-groups-explained.md',
    categories: [
      { name: '使用教程', url: '/categories/%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B/' }
    ],
    tags: [
      { name: '分流规则', url: '/tags/%E5%88%86%E6%B5%81%E8%A7%84%E5%88%99/' },
      { name: '节点分组', url: '/tags/%E8%8A%82%E7%82%B9%E5%88%86%E7%BB%84/' },
      { name: '新手教程', url: '/tags/%E6%96%B0%E6%89%8B%E6%95%99%E7%A8%8B/' },
      { name: '网络排错', url: '/tags/%E7%BD%91%E7%BB%9C%E6%8E%92%E9%44%90/' }
    ]
  },
  {
    title: '2026 新手跨平台客户端保姆级选型与一键导入指南：Win / Mac / iOS / 安卓少走弯路实操手册',
    url: '/posts/2026-cross-platform-client-setup-guide/',
    cover: '/images/covers/cover-14.jpg',
    date: '2026-10-22T10:00:00+08:00',
    words: '3200 字',
    readingTime: '8 分钟',
    viewId: 'views_posts\\2026-cross-platform-client-setup-guide.md',
    categories: [
      { name: '使用教程', url: '/categories/%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B/' }
    ],
    tags: [
      { name: '客户端配置', url: '/tags/%E5%AE%A2%E6%88%B7%E7%AB%AF%E9%85%8D%E7%BD%AE/' },
      { name: '新手入门', url: '/tags/%E6%96%B0%E6%89%8B%E5%85%A5%E9%97%A8/' },
      { name: 'Clash Verge', url: '/tags/clash-verge/' },
      { name: '小火箭', url: '/tags/%E5%B0%8F%E7%81%AB%E7%AE%AD/' }
    ]
  },
  {
    title: '一元机场为什么不能用？低价套餐背后的超售、限速与失联成本',
    url: '/posts/2026-why-one-yuan-airports-are-unreliable/',
    cover: '/images/covers/cover-7.jpg',
    date: '2026-10-03T10:30:00+08:00',
    words: '2783 字',
    readingTime: '6 分钟',
    viewId: 'views_posts\\2026-why-one-yuan-airports-are-unreliable.md',
    categories: [
      { name: '机场知识', url: '/categories/%E6%9C%BA%E5%9C%BA%E7%9F%A5%E8%AF%86/' },
      { name: '安全指南', url: '/categories/%E5%AE%89%E5%85%A8%E6%8C%87%E5%8D%97/' }
    ],
    tags: [
      { name: '一元机场', url: '/tags/%E4%B8%80%E5%85%83%E6%9C%BA%E5%9C%BA/' },
      { name: '低价机场', url: '/tags/%E4%BD%8E%E4%BB%B7%E6%9C%BA%E5%9C%BA/' },
      { name: '机场避坑', url: '/tags/%E6%9C%BA%E5%9C%BA%E9%81%BF%E5%9D%91/' },
      { name: '超售', url: '/tags/%E8%B6%85%E5%94%AE/' },
      { name: '套餐选择', url: '/tags/%E5%A5%97%E9%A4%90%E9%80%89%E6%8B%A9/' },
      { name: '节点稳定性', url: '/tags/%E8%8A%82%E7%82%B9%E7%A8%B3%E5%AE%9A%E6%80%A7/' }
    ]
  },
  {
    title: '免费机场为什么不能用？从失联、限速到隐私风险一次讲清',
    url: '/posts/2026-why-free-airports-are-unreliable/',
    cover: '/images/covers/cover-8.jpg',
    date: '2026-10-03T10:00:00+08:00',
    words: '2730 字',
    readingTime: '6 分钟',
    viewId: 'views_posts\\2026-why-free-airports-are-unreliable.md',
    categories: [
      { name: '机场知识', url: '/categories/%E6%9C%BA%E5%9C%BA%E7%9F%A5%E8%AF%86/' },
      { name: '安全指南', url: '/categories/%E5%AE%89%E5%85%A8%E6%8C%87%E5%8D%97/' }
    ],
    tags: [
      { name: '免费机场', url: '/tags/%E5%85%8D%E8%B4%B9%E6%9C%BA%E5%9C%BA/' },
      { name: '免费节点', url: '/tags/%E5%85%8D%E8%B4%B9%E8%8A%82%E7%82%B9/' },
      { name: '机场避坑', url: '/tags/%E6%9C%BA%E5%9C%BA%E9%81%BF%E5%9D%91/' },
      { name: '节点稳定性', url: '/tags/%E8%8A%82%E7%82%B9%E7%A8%B3%E5%AE%9A%E6%80%A7/' },
      { name: '隐私安全', url: '/tags/%E9%9A%90%E7%A7%81%E5%AE%89%E5%85%A8/' },
      { name: '机场选择', url: '/tags/%E6%9C%BA%E5%9C%BA%E9%80%89%E6%8B%A9/' }
    ]
  },
  {
    title: '2026 Clash Verge Rev 使用说明教程：下载安装、导入订阅与节点选择',
    url: '/posts/2026-clash-verge-rev-guide/',
    cover: '/images/posts/clash-verge-rev-2026/clash-verge-rev-logo_hu_175678c473d5c4e7.png',
    date: '2026-09-30T16:20:00+08:00',
    words: '4455 字',
    readingTime: '9 分钟',
    viewId: 'views_posts\\2026-clash-verge-rev-guide.md',
    categories: [
      { name: '使用教程', url: '/categories/%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B/' }
    ],
    tags: [
      { name: 'Clash', url: '/tags/clash/' },
      { name: 'Clash Verge Rev', url: '/tags/clash-verge-rev/' },
      { name: 'Mihomo', url: '/tags/mihomo/' },
      { name: '代理客户端', url: '/tags/%E4%BB%A3%E7%90%86%E5%AE%A2%E6%88%B7%E7%AB%AF/' },
      { name: '新手教程', url: '/tags/%E6%96%B0%E6%89%8B%E6%95%99%E7%A8%8B/' }
    ]
  },
  {
    title: '按量付费/不限时轻量机场推荐：适合备用与低频翻墙的性价比之选',
    url: '/posts/2026-pay-as-you-go-no-expiry-airport-guide/',
    cover: '/images/covers/cover-10.jpg',
    date: '2026-09-30T13:00:00+08:00',
    words: '4423 字',
    readingTime: '9 分钟',
    viewId: 'views_posts\\2026-pay-as-you-go-no-expiry-airport-guide.md',
    categories: [
      { name: '机场测评', url: '/categories/%E6%9C%BA%E5%9C%BA%E6%B5%8B%E8%AF%84/' },
      { name: '使用教程', url: '/categories/%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B/' }
    ],
    tags: [
      { name: '按量付费机场', url: '/tags/%E6%8C%89%E9%87%8F%E4%BB%98%E8%B4%B9%E6%9C%BA%E5%9C%BA/' },
      { name: '不限时机场推荐', url: '/tags/%E4%B8%8D%E9%99%90%E6%97%B6%E6%9C%BA%E5%9C%BA%E6%8E%A8%E8%8D%90/' },
      { name: '备用机场节点', url: '/tags/%E5%A4%87%E7%94%A8%E6%9C%BA%E5%9C%BA%E8%8A%82%E7%82%B9/' },
      { name: '一次性流量包', url: '/tags/%E4%B8%80%E6%AC%A1%E6%80%A7%E6%B5%81%E9%87%8F%E5%8C%85/' },
      { name: '轻量机场', url: '/tags/%E8%BD%BB%E9%87%8F%E6%9C%BA%E5%9C%BA/' },
      { name: '机场推荐', url: '/tags/%E6%9C%BA%E5%9C%BA%E6%8E%A8%E8%8D%90/' }
    ]
  },
  {
    title: '2026 Netflix / Disney+ / YouTube 4K 解锁机场推荐：流媒体秒开与防跳验证避坑',
    url: '/posts/2026-netflix-disney-youtube-4k-airport-guide/',
    cover: '/images/covers/cover-11.jpg',
    date: '2026-09-30T12:45:00+08:00',
    words: '5078 字',
    readingTime: '11 分钟',
    viewId: 'views_posts\\2026-netflix-disney-youtube-4k-airport-guide.md',
    categories: [
      { name: '机场测评', url: '/categories/%E6%9C%BA%E5%9C%BA%E6%B5%8B%E8%AF%84/' },
      { name: '使用教程', url: '/categories/%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B/' }
    ],
    tags: [
      { name: 'Netflix奈飞解锁机场', url: '/tags/netflix%E5%A5%88%E9%A3%9E%E8%A7%A3%E9%94%81%E6%9C%BA%E5%9C%BA/' },
      { name: 'Disney+报错怎么办', url: '/tags/disney+%E6%8A%A5%E9%94%99%E6%80%8E%E4%B9%88%E5%8A%9E/' },
      { name: '4K 8K油管测速跑分', url: '/tags/4k-8k%E6%B2%B9%E7%AE%A1%E6%B5%8B%E9%80%9F%E8%B7%91%E5%88%86/' },
      { name: '流媒体解锁', url: '/tags/%E6%B5%81%E5%AA%92%E4%BD%93%E8%A7%A3%E9%94%81/' },
      { name: 'Apple TV', url: '/tags/apple-tv/' },
      { name: '机场推荐', url: '/tags/%E6%9C%BA%E5%9C%BA%E6%8E%A8%E8%8D%90/' }
    ]
  },
  {
    title: '机场突然跑路或失联？2026 科学上网避坑指南与主备双持防断网策略',
    url: '/posts/2026-airport-exit-scam-warning-backup-strategy/',
    cover: '/images/covers/cover-12.jpg',
    date: '2026-09-30T12:30:00+08:00',
    words: '5188 字',
    readingTime: '11 分钟',
    viewId: 'views_posts\\2026-airport-exit-scam-warning-backup-strategy.md',
    categories: [
      { name: '机场测评', url: '/categories/%E6%9C%BA%E5%9C%BA%E6%B5%8B%E8%AF%84/' },
      { name: '使用教程', url: '/categories/%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B/' }
    ],
    tags: [
      { name: '机场跑路前兆', url: '/tags/%E6%9C%BA%E5%9C%BA%E8%B7%91%E8%B7%AF%E5%89%8D%E5%85%86/' },
      { name: '备用防失联节点', url: '/tags/%E5%A4%87%E7%94%A8%E9%98%B2%E5%A4%B1%E8%81%94%E8%8A%82%E7%82%B9/' },
      { name: '机场挑选避坑', url: '/tags/%E6%9C%BA%E5%9C%BA%E6%8C%91%E9%80%89%E9%81%BF%E5%9D%91/' },
      { name: '主备双持', url: '/tags/%E4%B8%BB%E5%A4%87%E5%8F%8C%E6%8C%81/' },
      { name: '机场推荐', url: '/tags/%E6%9C%BA%E5%9C%BA%E6%8E%A8%E8%8D%90/' },
      { name: '风险管理', url: '/tags/%E9%A3%8E%E9%99%A9%E7%AE%A1%E7%90%86/' }
    ]
  },
  {
    title: '解决 ChatGPT / Claude 1020 报错与 IP 拦截：2026 原生住宅 IP 专线机场实测',
    url: '/posts/2026-chatgpt-claude-1020-native-residential-ip-guide/',
    cover: '/images/covers/cover-13.jpg',
    date: '2026-09-30T12:00:00+08:00',
    words: '4175 字',
    readingTime: '9 分钟',
    viewId: 'views_posts\\2026-chatgpt-claude-1020-native-residential-ip-guide.md',
    categories: [
      { name: '机场测评', url: '/categories/%E6%9C%BA%E5%9C%BA%E6%B5%8B%E8%AF%84/' },
      { name: '使用教程', url: '/categories/%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B/' }
    ],
    tags: [
      { name: 'ChatGPT 1020报错', url: '/tags/chatgpt-1020%E6%8A%A5%E9%94%99/' },
      { name: 'Claude账号被封', url: '/tags/claude%E8%B4%A6%E5%8F%B7%E8%A2%AB%E5%B0%81/' },
      { name: '原生住宅IP机场', url: '/tags/%E5%8E%9F%E7%94%9F%E4%BD%8F%E5%AE%85ip%E6%9C%BA%E5%9C%BA/' },
      { name: 'IP风控', url: '/tags/ip%E9%A3%8E%E6%8E%A7/' },
      { name: '专线机场', url: '/tags/%E4%B8%93%E7%BA%BF%E6%9C%BA%E5%9C%BA/' },
      { name: 'Cloudflare', url: '/tags/cloudflare/' }
    ]
  },
  {
    title: '机场订阅地址泄露怎么办？账号安全、重置链接与多设备管理指南',
    url: '/posts/2026-subscription-security-account-protection/',
    cover: '/images/covers/cover-14.jpg',
    date: '2026-09-29T10:00:00+08:00',
    words: '1083 字',
    readingTime: '3 分钟',
    viewId: 'views_posts\\2026-subscription-security-account-protection.md',
    categories: [
      { name: '安全指南', url: '/categories/%E5%AE%89%E5%85%A8%E6%8C%87%E5%8D%97/' }
    ],
    tags: [
      { name: '订阅泄露', url: '/tags/%E8%AE%A2%E9%98%85%E6%B3%84%E9%9C%B2/' },
      { name: '账号安全', url: '/tags/%E8%B4%A6%E5%8F%B7%E5%AE%89%E5%85%A8/' },
      { name: '重置订阅', url: '/tags/%E9%87%8D%E7%BD%AE%E8%AE%A2%E9%98%85/' },
      { name: '异常流量', url: '/tags/%E5%BC%82%E5%B8%B8%E6%B5%81%E9%87%8F/' },
      { name: '多设备管理', url: '/tags/%E5%A4%9A%E8%AE%BE%E5%A4%87%E7%AE%A1%E7%90%86/' }
    ]
  },
  {
    title: '路由器代理还是每台设备装客户端？电视、Apple TV与家庭网络方案对比',
    url: '/posts/2026-router-proxy-vs-device-client-guide/',
    cover: '/images/covers/cover-15.jpg',
    date: '2026-09-28T10:00:00+08:00',
    words: '1098 字',
    readingTime: '3 分钟',
    viewId: 'views_posts\\2026-router-proxy-vs-device-client-guide.md',
    categories: [
      { name: '使用教程', url: '/categories/%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B/' }
    ],
    tags: [
      { name: '路由器代理', url: '/tags/%E8%B7%AF%E7%94%B1%E5%99%A8%E4%BB%A3%E7%90%86/' },
      { name: '旁路由', url: '/tags/%E6%97%81%E8%B7%AF%E7%94%B1/' },
      { name: 'Apple TV', url: '/tags/apple-tv/' },
      { name: '智能电视', url: '/tags/%E6%99%BA%E8%83%BD%E7%94%B5%E8%A7%86/' },
      { name: '家庭网络', url: '/tags/%E5%AE%B6%E5%BA%AD%E7%BD%91%E7%BB%9C/' }
    ]
  },
  {
    title: '代理已连接为什么网站仍识别本地地区？DNS、WebRTC与IPv6泄漏排查',
    url: '/posts/2026-dns-webrtc-ipv6-leak-guide/',
    cover: '/images/covers/cover-16.jpg',
    date: '2026-09-27T10:00:00+08:00',
    words: '1121 字',
    readingTime: '3 分钟',
    viewId: 'views_posts\\2026-dns-webrtc-ipv6-leak-guide.md',
    categories: [
      { name: '使用教程', url: '/categories/%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B/' }
    ],
    tags: [
      { name: 'DNS泄漏', url: '/tags/dns%E6%B3%84%E6%BC%8F/' },
      { name: 'WebRTC', url: '/tags/webrtc/' },
      { name: 'IPv6', url: '/tags/ipv6/' },
      { name: 'IP泄漏', url: '/tags/ip%E6%B3%84%E6%BC%8F/' },
      { name: '地区识别', url: '/tags/%E5%9C%B0%E5%8C%BA%E8%AF%86%E5%88%AB/' }
    ]
  },
  {
    title: 'Windows、macOS、iPhone、Android代理客户端怎么选？2026工具选择指南',
    url: '/posts/2026-proxy-client-selection-guide/',
    cover: '/images/covers/cover-17.jpg',
    date: '2026-09-26T10:00:00+08:00',
    words: '1198 字',
    readingTime: '3 分钟',
    viewId: 'views_posts\\2026-proxy-client-selection-guide.md',
    categories: [
      { name: '使用教程', url: '/categories/%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B/' }
    ],
    tags: [
      { name: '代理客户端', url: '/tags/%E4%BB%A3%E7%90%86%E5%AE%A2%E6%88%B7%E7%AB%AF/' },
      { name: 'Clash Verge Rev', url: '/tags/clash-verge-rev/' },
      { name: 'Shadowrocket', url: '/tags/shadowrocket/' },
      { name: 'V2rayN', url: '/tags/v2rayn/' },
      { name: 'Karing', url: '/tags/karing/' },
      { name: 'V2rayNG', url: '/tags/v2rayng/' }
    ]
  },
  {
    title: '同一个机场手机能用、宽带不能用？移动数据与Wi-Fi连接差异排查',
    url: '/posts/2026-mobile-data-wifi-airport-difference/',
    cover: '/images/covers/cover-18.jpg',
    date: '2026-09-25T10:00:00+08:00',
    words: '1146 字',
    readingTime: '3 分钟',
    viewId: 'views_posts\\2026-mobile-data-wifi-airport-difference.md',
    categories: [
      { name: '使用教程', url: '/categories/%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B/' }
    ],
    tags: [
      { name: '手机流量', url: '/tags/%E6%89%8B%E6%9C%BA%E6%B5%81%E9%87%8F/' },
      { name: 'Wi-Fi', url: '/tags/wi-fi/' },
      { name: '宽带', url: '/tags/%E5%AE%BD%E5%B8%A6/' },
      { name: '节点无法连接', url: '/tags/%E8%8A%82%E7%82%B9%E6%97%A0%E6%B3%95%E8%BF%9E%E6%8E%A5/' },
      { name: '网络排查', url: '/tags/%E7%BD%91%E7%BB%9C%E6%8E%92%E6%9F%A5/' }
    ]
  }
];

// 生成教程卡片 HTML 函数
function generateTutorialCardHtml(t) {
  const catsHtml = t.categories.map(c => `<a class="relative mt-[0.5rem] me-2" href="${c.url}"><span class="flex cursor-pointer"><span class="rounded-md border border-primary-400 px-1 py-[1px] text-xs font-normal text-primary-700 dark:border-primary-600 dark:text-primary-400">${c.name}</span></span></a>`).join('');
  const tagsHtml = t.tags.map(tag => `<a class="relative mt-[0.5rem] me-2" href="${tag.url}"><span class="flex cursor-pointer"><span class="rounded-md border border-primary-400 px-1 py-[1px] text-xs font-normal text-primary-700 dark:border-primary-600 dark:text-primary-400">${tag.name}</span></span></a>`).join('');

  return `        <article class="article-link--card group relative min-h-full min-w-full overflow-hidden rounded-lg border border-neutral-300/80 bg-white/85 dark:border-neutral-600/80 dark:bg-neutral-900/80 flex flex-col justify-between">
          <div>
            <div class="flex-none relative overflow-hidden thumbnail_card" style="--thumbnail-aspect-ratio: 1.5">
              <img src="${t.cover}" alt="${t.title}" loading="lazy" decoding="async" fetchpriority="low" class="post-cover nozoom not-prose absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" />
            </div>
            <div class="p-4">
              <header>
                <a href="${t.url}" class="not-prose before:absolute before:inset-0 decoration-primary-500 dark:text-neutral text-xl font-bold text-neutral-800 hover:underline hover:underline-offset-2">
                  <h2>${t.title}</h2>
                </a>
              </header>
              <div class="text-sm text-neutral-500 dark:text-neutral-400">
                <div class="flex flex-row flex-wrap items-center">
                  <span>${t.words}</span><span class="px-2 text-primary-500">&#183;</span><span title="预计阅读">${t.readingTime}</span><span class="px-2 text-primary-500">&#183;</span><span>
                    <span id="${t.viewId}" class="animate-pulse inline-block text-transparent max-h-3 rounded-full -mt-[2px] align-middle bg-neutral-300 dark:bg-neutral-400" title="views">loading</span>
                    <span class="inline-block align-text-bottom"><span class="relative block icon"><svg viewBox="0 0 576 512"><path fill="currentColor" d="M288 32c-80.8.0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7.0 24.6C17.3 304 48.6 356 95.4 399.4 142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7.0-24.6-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM432 256c0 79.5-64.5 144-144 144s-144-64.5-144-144 64.5-144 144-144s144 64.5 144 144zM288 192c0 35.3-28.7 64-64 64-11.5.0-22.3-3-31.6-8.4-.2 2.8-.4 5.5-.4 8.4.0 53 43 96 96 96s96-43 96-96-43-96-96-96c-2.8.0-5.6.1-8.4.4 5.3 9.3 8.4 20.1 8.4 31.6z"/></svg></span></span>
                  </span>
                </div>
                <div class="flex flex-row flex-wrap items-center mt-3">
                  ${catsHtml}${tagsHtml}
                </div>
              </div>
            </div>
          </div>
          <div class="px-6 pt-4 pb-2"></div>
        </article>`;
}

// 汇总 18 篇文章并按日期排序与排版
const allArticles = [
  ...reviewsData,
  ...tutorialCards
];

console.log('>>> [Step 2] 汇总站内文章发布时间与排版顺序:');
allArticles.forEach((art, index) => {
  console.log(`[${index + 1}] [${art.date.split('T')[0]}] ${art.title} (${art.url})`);
});

// 构建首页全新的 grid section HTML
const fullGridHtml = `<section class="w-full grid gap-6 sm:grid-cols-2 md:grid-cols-3 mt-8">
${reviewsData.map(r => generateReviewCardHtml(r)).join('\n\n')}

${tutorialCards.map(t => generateTutorialCardHtml(t)).join('\n\n')}
      </section>`;

// =========================================================================
// 2. 更新 index.html 与 public/index.html
// =========================================================================
const targetFiles = [
  path.join(rootDir, 'index.html'),
  path.join(rootDir, 'public', 'index.html')
];

for (const targetPath of targetFiles) {
  if (!fs.existsSync(targetPath)) {
    console.log(`文件不存在，跳过: ${targetPath}`);
    continue;
  }
  let content = fs.readFileSync(targetPath, 'utf8');

  // 1. 确保引入 /css/style.css
  if (!content.includes('/css/style.css')) {
    content = content.replace('</head>', '  <link type="text/css" rel="stylesheet" href="/css/style.css">\n</head>');
  }

  // 2. 匹配替换最近的文章卡片 section
  // 查找包含 <section class="w-full grid ..."> ... </section> 的区域
  const gridSectionRegex = /<section\b[^>]*\bgrid\b[^>]*>[\s\S]*?<\/section>/i;
  if (gridSectionRegex.test(content)) {
    content = content.replace(gridSectionRegex, fullGridHtml);
    fs.writeFileSync(targetPath, content, 'utf8');
    console.log(`✅ 成功更新首页文章网格: ${path.relative(rootDir, targetPath)}`);
  } else {
    console.warn(`⚠️ 未能在 ${path.relative(rootDir, targetPath)} 中找到 grid section`);
  }
}

console.log('>>> [Step 3] 首页数据同步更新全部完成！');
