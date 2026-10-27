const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

const REDIRECT_MAP = {
  'yunjiexian': { name: '云界线 (Yunjiexian)', url: 'https://9625mofan01.yunjiexianaff.com/#/?code=OOYhSj0L' },
  'dalaoyun': { name: '大佬云 (Dalaoyun)', url: 'https://mofanvip01.dalaoyunaff.com/#/?code=QT2rqp5V' },
  'huanqiuti': { name: '环球梯 (Huanqiuti)', url: 'https://mofanvip01.huanqiutiaff.com/#/?code=l7oLmjVU' },
  'liulianyun': { name: '榴莲云 (Liulianyun)', url: 'https://mofan88.liulianyunaff.com/#/?code=ETsQBSuR' },
  'shenxing': { name: '神行加速 (Shenxing)', url: 'https://vipmofan01.shenxingaff.com/#/?code=nn4ohwnK' },
  'shandianshu': { name: '闪电鼠 (Shandianshu)', url: 'https://mofanvip01.shandianshuaff.com/#/?code=a3GAQAXg' },
  'edgenova': { name: '边缘节点 (EdgeNova)', url: 'https://wep.edgenovaaff.com/#/?code=nr2kdl68' },
  'sujie': { name: '速界 (SpeedWorld)', url: 'https://pygllc.speedworldaff.cc/#/?code=f3fRpBfX' }
};

function generateHtml(key, item) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>正在前往 ${item.name} - 魔法Clash机场知识库</title>
  <meta name="description" content="正在安全前往 ${item.name} 官方通道，魔法Clash机场知识库提供高速加密直达服务。">
  <meta name="robots" content="noindex, nofollow, noarchive, nosnippet">
  <meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet">
  <meta name="bingbot" content="noindex, nofollow, noarchive, nosnippet">
  <meta name="referrer" content="no-referrer">
  <meta http-equiv="refresh" content="0; url=${item.url}">
  <script>window.location.replace("${item.url}");</script>
</head>
<body style="background:#0f172a;color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
  <div style="text-align:center;padding:20px;">
    <p style="font-size:16px;color:#94a3b8;margin-bottom:12px;">正在安全前往 ${item.name} 官方通道...</p>
    <p><a href="${item.url}" rel="nofollow sponsored noopener noreferrer" style="color:#38bdf8;text-decoration:none;font-weight:600;">若未自动跳转，请点击此处 ↗</a></p>
  </div>
</body>
</html>
`;
}

['static', 'public', '.'].forEach(base => {
  for (const [key, item] of Object.entries(REDIRECT_MAP)) {
    const dir = path.join(ROOT_DIR, base, 'go', key);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), generateHtml(key, item), 'utf8');
  }
});

console.log('✓ Successfully regenerated /go/ fallback folders for all 8 airports');
