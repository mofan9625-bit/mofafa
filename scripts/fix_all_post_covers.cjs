const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const postsDir = path.join(rootDir, 'content', 'posts');

// 1. 为所有 Markdown 文章补全 featureimage
console.log('>>> [1] 正在检查并补齐 content/posts/ 下所有文章的 featureimage...');
const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md') && f !== '_index.md');

let coverCounter = 1;
for (const file of files) {
  const filePath = path.join(postsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  if (!content.includes('featureimage:')) {
    const coverNum = (coverCounter % 18) + 1;
    coverCounter++;
    const featureimageLine = `featureimage: "images/covers/cover-${coverNum}.jpg"`;
    
    // 在 tags: 行之后插入 featureimage
    if (content.includes('tags:')) {
      content = content.replace(/(tags:[^\n]*\n)/, `$1${featureimageLine}\n`);
    } else {
      content = content.replace(/---\n/, `---\n${featureimageLine}\n`);
    }
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✓ 已为 ${file} 添加封面: cover-${coverNum}.jpg`);
  } else {
    console.log(`  - ${file} 已具备 featureimage 配置`);
  }
}

console.log('>>> [2] content/posts/ 封面补全完成！');
