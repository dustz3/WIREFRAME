const pug = require('pug');
const stylus = require('stylus');
const fs = require('fs');
const path = require('path');

console.log('🚀 開始編譯 Website Wireframe Dashboard...\n');

// 編譯 Pug 模板
try {
  console.log('📝 編譯 Pug 模板...');
  const template = fs.readFileSync('src/templates/index.pug', 'utf8');
  const html = pug.render(template);
  
  // 確保 dist 目錄存在
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
  }
  
  fs.writeFileSync('dist/index.html', html);
  console.log('✅ Pug 模板編譯完成\n');
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
    
    // 確保 css 目錄存在
    if (!fs.existsSync('dist/css')) {
      fs.mkdirSync('dist/css', { recursive: true });
    }
    
    fs.writeFileSync('dist/css/main.css', css);
    console.log('✅ Stylus 樣式編譯完成\n');
    console.log('🎉 編譯完成！可以在 dist/ 目錄中查看結果');
    console.log('📁 開啟 dist/index.html 來預覽 Dashboard');
  });
} catch (error) {
  console.error('❌ Stylus 編譯錯誤:', error.message);
  process.exit(1);
}
