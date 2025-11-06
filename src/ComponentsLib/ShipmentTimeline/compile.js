const fs = require('fs');
const path = require('path');
const stylus = require('stylus');
const pug = require('pug');

console.log('🚚 開始編譯 ShipmentTimeline 元件...');

// 設定路徑
const srcDir = __dirname;
const distDir = path.join(__dirname, '../../../dist/components/ShipmentTimeline');

// 確保輸出目錄存在
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 1. 編譯 Stylus
console.log('🎨 編譯 Stylus 樣式...');
const stylusFile = path.join(srcDir, 'Styles/timeline.styl');
const stylusContent = fs.readFileSync(stylusFile, 'utf8');

stylus(stylusContent)
  .set('filename', stylusFile)
  .set('paths', [path.join(srcDir, 'Styles')])
  .render((err, css) => {
    if (err) {
      console.error('❌ Stylus 編譯錯誤:', err);
      return;
    }
    
    const cssOutput = path.join(distDir, 'timeline.css');
    fs.writeFileSync(cssOutput, css);
    console.log('  ✅ 已生成 timeline.css');
  });

// 2. 編譯 variables.styl
const variablesFile = path.join(srcDir, 'Styles/variables.styl');
const variablesContent = fs.readFileSync(variablesFile, 'utf8');

stylus(variablesContent)
  .set('filename', variablesFile)
  .render((err, css) => {
    if (err) {
      console.error('❌ Variables 編譯錯誤:', err);
      return;
    }
    
    const cssOutput = path.join(distDir, 'variables.css');
    fs.writeFileSync(cssOutput, css);
    console.log('  ✅ 已生成 variables.css');
  });

// 3. 複製 Pug 模板
console.log('📝 複製模板檔案...');
const pugFile = path.join(srcDir, 'Templates/timeline.pug');
const pugOutput = path.join(distDir, 'timeline.pug');
fs.copyFileSync(pugFile, pugOutput);
console.log('  ✅ 已複製 timeline.pug');

// 4. 複製 JavaScript
console.log('📦 複製 JavaScript...');
const jsFile = path.join(srcDir, 'Javascript/timeline-interaction.js');
const jsOutput = path.join(distDir, 'timeline-interaction.js');
fs.copyFileSync(jsFile, jsOutput);
console.log('  ✅ 已複製 timeline-interaction.js');

// 5. 複製 Assets
console.log('🖼️  複製圖示資源...');
const assetsDir = path.join(srcDir, 'Assets');
const assetsDistDir = path.join(distDir, 'images');

if (!fs.existsSync(assetsDistDir)) {
  fs.mkdirSync(assetsDistDir, { recursive: true });
}

const assets = fs.readdirSync(assetsDir);
assets.forEach(file => {
  const srcFile = path.join(assetsDir, file);
  const distFile = path.join(assetsDistDir, file);
  if (fs.statSync(srcFile).isFile()) {
    fs.copyFileSync(srcFile, distFile);
    console.log(`  ✅ 已複製 ${file}`);
  }
});

// 6. 複製文件
console.log('📖 複製文件檔案...');
const docsDir = path.join(srcDir, 'Docs');
if (fs.existsSync(docsDir)) {
  const docs = fs.readdirSync(docsDir);
  docs.forEach(file => {
    const srcFile = path.join(docsDir, file);
    const distFile = path.join(distDir, file);
    if (fs.statSync(srcFile).isFile()) {
      fs.copyFileSync(srcFile, distFile);
      console.log(`  ✅ 已複製 ${file}`);
    }
  });
}

// 7. 生成 index.html
console.log('📄 生成使用說明...');
const indexHtml = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ShipmentTimeline Component</title>
  <link rel="stylesheet" href="timeline.css">
  <style>
    body {
      font-family: 'Noto Sans', sans-serif;
      max-width: 900px;
      margin: 50px auto;
      padding: 20px;
      line-height: 1.6;
      background: #f5f5f5;
    }
    .header {
      background: linear-gradient(135deg, #143463 0%, #1f2a44 100%);
      color: white;
      padding: 40px;
      border-radius: 12px;
      margin-bottom: 30px;
    }
    .content {
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    h1 { margin: 0; font-size: 2rem; }
    h2 { color: #143463; margin-top: 30px; }
    .file-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin: 20px 0;
    }
    .file-item {
      background: #f8fafc;
      padding: 15px;
      border-radius: 8px;
      border-left: 4px solid #143463;
    }
    .file-name {
      font-weight: 600;
      color: #143463;
    }
    .file-desc {
      font-size: 0.9rem;
      color: #666;
      margin-top: 5px;
    }
    code {
      background: #e2e8f0;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.9em;
    }
    .docs-link {
      display: inline-block;
      margin: 10px 10px 10px 0;
      padding: 10px 20px;
      background: #143463;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      transition: all 0.2s;
    }
    .docs-link:hover {
      background: #0a2642;
      transform: translateY(-2px);
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>📦 ShipmentTimeline Component</h1>
    <p>一個功能完整、響應式的貨件追蹤時間軸元件</p>
    <p style="opacity: 0.9; margin: 0;">版本 1.0.0 | 更新: 2025-10-10</p>
  </div>

  <div class="content">
    <h2>📁 元件檔案</h2>
    <div class="file-grid">
      <div class="file-item">
        <div class="file-name">timeline.css</div>
        <div class="file-desc">編譯後的樣式（可直接使用）</div>
      </div>
      <div class="file-item">
        <div class="file-name">variables.css</div>
        <div class="file-desc">編譯後的變數</div>
      </div>
      <div class="file-item">
        <div class="file-name">timeline-interaction.js</div>
        <div class="file-desc">互動邏輯腳本</div>
      </div>
      <div class="file-item">
        <div class="file-name">timeline.pug</div>
        <div class="file-desc">Pug 模板</div>
      </div>
      <div class="file-item">
        <div class="file-name">images/</div>
        <div class="file-desc">圖示資源（SVG）</div>
      </div>
    </div>

    <h2>🚀 快速開始</h2>
    <p>在你的 HTML 中引入：</p>
    <pre><code>&lt;link rel="stylesheet" href="components/ShipmentTimeline/timeline.css"&gt;
&lt;!-- 複製 HTML 結構 --&gt;
&lt;script src="components/ShipmentTimeline/timeline-interaction.js"&gt;&lt;/script&gt;</code></pre>

    <h2>✨ 功能特色</h2>
    <ul>
      <li>✅ Desktop: 水平時間軸 + 雙列卡片佈局</li>
      <li>✅ Mobile: 垂直時間軸 + 編號壓軌道設計</li>
      <li>✅ 三種狀態：已完成、進行中、待處理</li>
      <li>✅ 特殊事件支援（乾冰補充）</li>
      <li>✅ 互動式 hover 效果（Desktop）</li>
      <li>✅ 響應式設計，斷點 768px</li>
      <li>✅ 無框架依賴，純原生實作</li>
    </ul>

    <h2>📖 完整文件</h2>
    <div>
      <a href="README.md" class="docs-link">📄 README.md</a>
      <a href="USAGE.md" class="docs-link">📖 USAGE.md</a>
      <a href="QUICK-REFERENCE.md" class="docs-link">⚡ Quick Reference</a>
      <a href="example.html" class="docs-link">🌐 範例頁面</a>
    </div>

    <h2>🎨 顏色系統</h2>
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 20px 0;">
      <div style="background: #143463; color: white; padding: 15px; border-radius: 6px; text-align: center;">
        <div style="font-weight: 600;">Primary</div>
        <div style="font-size: 0.9rem; opacity: 0.9;">#143463</div>
      </div>
      <div style="background: #97d3df; color: white; padding: 15px; border-radius: 6px; text-align: center;">
        <div style="font-weight: 600;">Secondary</div>
        <div style="font-size: 0.9rem; opacity: 0.9;">#97d3df</div>
      </div>
      <div style="background: #bb2749; color: white; padding: 15px; border-radius: 6px; text-align: center;">
        <div style="font-weight: 600;">Accent</div>
        <div style="font-size: 0.9rem; opacity: 0.9;">#bb2749</div>
      </div>
    </div>

    <h2>💡 使用提示</h2>
    <ul>
      <li>圖示需放在 <code>images/</code> 資料夾</li>
      <li>支援 Stylus 源碼或編譯後的 CSS</li>
      <li>可透過變數自訂顏色主題</li>
      <li>完整的 TypeScript 類型支援（待添加）</li>
    </ul>

    <p style="text-align: center; margin-top: 40px; color: #666;">
      © 2025 TailorMed. 此元件可在內部專案中自由使用和修改。
    </p>
  </div>
</body>
</html>`;

fs.writeFileSync(path.join(distDir, 'index.html'), indexHtml);
console.log('  ✅ 已生成 index.html');

console.log('\n🎉 編譯完成！元件已輸出到 dist/components/ShipmentTimeline');
console.log('📂 檔案結構：');
console.log('   ├── timeline.css (編譯後的樣式)');
console.log('   ├── variables.css (編譯後的變數)');
console.log('   ├── timeline-interaction.js (互動邏輯)');
console.log('   ├── timeline.pug (模板)');
console.log('   ├── images/ (圖示資源)');
console.log('   └── index.html (使用說明)');
console.log('\n💡 在瀏覽器中開啟 dist/components/ShipmentTimeline/index.html 查看完整說明');
