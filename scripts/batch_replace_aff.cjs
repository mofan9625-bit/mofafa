const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

const AFF_MAP = [
  {
    id: 'yunjiexian',
    url: 'https://9625mofan01.yunjiexianaff.com/#/?code=OOYhSj0L',
    regexUrl: /https:\/\/9625mofan01\.yunjiexianaff\.com\/#\/\?code=OOYhSj0L/g
  },
  {
    id: 'dalaoyun',
    url: 'https://mofanvip01.dalaoyunaff.com/#/?code=QT2rqp5V',
    regexUrl: /https:\/\/mofanvip01\.dalaoyunaff\.com\/#\/\?code=QT2rqp5V/g
  },
  {
    id: 'huanqiuti',
    url: 'https://mofanvip01.huanqiutiaff.com/#/?code=l7oLmjVU',
    regexUrl: /https:\/\/mofanvip01\.huanqiutiaff\.com\/#\/\?code=l7oLmjVU/g
  },
  {
    id: 'liulianyun',
    url: 'https://mofan88.liulianyunaff.com/#/?code=ETsQBSuR',
    regexUrl: /https:\/\/mofan88\.liulianyunaff\.com\/#\/\?code=ETsQBSuR/g
  },
  {
    id: 'shenxing',
    url: 'https://vipmofan01.shenxingaff.com/#/?code=nn4ohwnK',
    regexUrl: /https:\/\/vipmofan01\.shenxingaff\.com\/#\/\?code=nn4ohwnK/g
  },
  {
    id: 'shandianshu',
    url: 'https://mofanvip01.shandianshuaff.com/#/?code=a3GAQAXg',
    regexUrl: /https:\/\/mofanvip01\.shandianshuaff\.com\/#\/\?code=a3GAQAXg/g
  }
];

function transformHtmlTag(tagStr, targetId) {
  // tagStr is e.g. <a href="..." target=_blank rel=noreferrer class="...">
  let newTag = tagStr;

  // Replace href
  newTag = newTag.replace(/href=["'][^"']+["']/i, `href="/go.html?id=${targetId}"`);

  // Normalize or replace rel
  if (/rel=["'][^"']*["']/i.test(newTag)) {
    newTag = newTag.replace(/rel=["'][^"']*["']/i, 'rel="nofollow sponsored noopener noreferrer"');
  } else if (/rel=[^\s>]+/i.test(newTag)) {
    newTag = newTag.replace(/rel=[^\s>]+/i, 'rel="nofollow sponsored noopener noreferrer"');
  } else {
    // Add rel before closing >
    newTag = newTag.replace(/(\/?>)$/, ' rel="nofollow sponsored noopener noreferrer"$1');
  }

  // Normalize or replace target
  if (/target=["'][^"']*["']/i.test(newTag)) {
    newTag = newTag.replace(/target=["'][^"']*["']/i, 'target="_blank"');
  } else if (/target=[^\s>]+/i.test(newTag)) {
    newTag = newTag.replace(/target=[^\s>]+/i, 'target="_blank"');
  } else {
    newTag = newTag.replace(/(\/?>)$/, ' target="_blank"$1');
  }

  return newTag;
}

function processHtmlContent(content) {
  let count = 0;
  let updated = content;

  for (const item of AFF_MAP) {
    // Match <a ... href="URL" ...> or <a ... href='URL' ...>
    // Handles attributes in any order
    const aTagRegex = new RegExp(`<a\\b[^>]*?href=["']${item.url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*?>`, 'gi');
    updated = updated.replace(aTagRegex, (match) => {
      count++;
      return transformHtmlTag(match, item.id);
    });

    // In case there's any bare URL in href that was slightly different (e.g. without quotes or encoded)
    if (updated.includes(item.url)) {
      const remainingCount = (updated.match(item.regexUrl) || []).length;
      if (remainingCount > 0) {
        count += remainingCount;
        updated = updated.replace(item.regexUrl, `/go.html?id=${item.id}`);
      }
    }
  }

  return { updated, count };
}

function processMarkdownContent(content) {
  let count = 0;
  let updated = content;

  for (const item of AFF_MAP) {
    // 1. Markdown link: [text](URL)
    const mdRegex = new RegExp(`\\[([^\\]]+)\\]\\(${item.url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`, 'g');
    updated = updated.replace(mdRegex, (match, text) => {
      count++;
      return `[${text}](/go.html?id=${item.id})`;
    });

    // 2. Raw HTML in Markdown: <a ... href="URL" ...>
    const aTagRegex = new RegExp(`<a\\b[^>]*?href=["']${item.url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*?>`, 'gi');
    updated = updated.replace(aTagRegex, (match) => {
      count++;
      return transformHtmlTag(match, item.id);
    });

    // 3. Any remaining raw URLs
    if (updated.includes(item.url)) {
      const remaining = (updated.match(item.regexUrl) || []).length;
      if (remaining > 0) {
        count += remaining;
        updated = updated.replace(item.regexUrl, `/go.html?id=${item.id}`);
      }
    }
  }

  return { updated, count };
}

function processScriptContent(content) {
  let count = 0;
  let updated = content;

  for (const item of AFF_MAP) {
    // In scripts, affUrl: 'https://...'
    if (updated.includes(item.url)) {
      const c = (updated.match(item.regexUrl) || []).length;
      count += c;
      updated = updated.replace(item.regexUrl, `/go.html?id=${item.id}`);
    }
  }

  return { updated, count };
}

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === '.git' || file === 'node_modules' || file === '.hugo-preview-cache' || file === 'themes') continue;
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walk(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const allFiles = walk(ROOT_DIR);
let totalReplacements = 0;
const report = [];

for (const filePath of allFiles) {
  const relPath = path.relative(ROOT_DIR, filePath).replace(/\\/g, '/');
  // Skip our own scan/backup scripts
  if (relPath.startsWith('scripts/scan_') || relPath.startsWith('scripts/batch_replace')) continue;

  const content = fs.readFileSync(filePath, 'utf8');
  let result = null;

  if (filePath.endsWith('.html')) {
    result = processHtmlContent(content);
  } else if (filePath.endsWith('.md')) {
    result = processMarkdownContent(content);
  } else if (filePath.endsWith('.cjs') || filePath.endsWith('.mjs') || filePath.endsWith('.js')) {
    result = processScriptContent(content);
  }

  if (result && result.count > 0) {
    fs.writeFileSync(filePath, result.updated, 'utf8');
    totalReplacements += result.count;
    report.push({ file: relPath, count: result.count });
    console.log(`✓ [${relPath}]: 成功替换 ${result.count} 处链接`);
  }
}

console.log('\n======================================================');
console.log(`总计替换文件数: ${report.length}`);
console.log(`总计替换 AFF 链接数: ${totalReplacements}`);
console.log('======================================================');
