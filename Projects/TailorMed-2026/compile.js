const pug = require('pug');
const stylus = require('stylus');
const fs = require('fs');
const path = require('path');

console.log('🚀 開始編譯 TailorMed 線框圖...\n');

// 編譯 Pug 模板
try {
  console.log('📝 編譯 Pug 模板...');
  
  // 定義所有需要編譯的頁面
  const pages = [
    { input: 'index.pug', output: 'index.html' },
    { input: 'about.pug', output: 'about.html' },
    { input: 'services.pug', output: 'services.html' },
    { input: 'news.pug', output: 'news.html' },
    { input: 'faq.pug', output: 'faq.html' },
    { input: 'contact.pug', output: 'contact.html' }
  ];
  
  // 編譯每個頁面
  pages.forEach(page => {
    const template = fs.readFileSync(`src/templates/${page.input}`, 'utf8');
    const html = pug.render(template);
    fs.writeFileSync(`dist/${page.output}`, html);
    console.log(`✅ 已編譯 ${page.input} -> ${page.output}`);
  });
  
  console.log('✅ 所有 Pug 模板編譯完成\n');
} catch (error) {
  console.error('❌ Pug 編譯錯誤:', error.message);
  process.exit(1);
}

// 編譯 Stylus 樣式
try {
  console.log('🎨 編譯 Stylus 樣式...');
  const stylusCode = fs.readFileSync('src/styles/main.styl', 'utf8');
  stylus.render(stylusCode, {filename: 'src/styles/main.styl'}, (err, css) => {
    if (err) {
      console.error('❌ Stylus 編譯錯誤:', err.message);
      process.exit(1);
    }
    fs.writeFileSync('dist/css/main.css', css);
    console.log('✅ Stylus 樣式編譯完成\n');
    console.log('🎉 編譯完成！可以在 dist/ 目錄中查看結果');
    console.log('📁 開啟 dist/index.html 來預覽線框圖');
  });
} catch (error) {
  console.error('❌ Stylus 編譯錯誤:', error.message);
  process.exit(1);
}
