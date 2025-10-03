const fs = require('fs');
const path = require('path');
const pug = require('pug');
const stylus = require('stylus');

const ROOT_DIR = __dirname;
const SRC_DIR = path.join(ROOT_DIR, 'templates');
const STYLE_DIR = path.join(ROOT_DIR, 'styles');
const SCRIPT_DIR = path.join(ROOT_DIR, 'scripts');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const IMAGE_DIR = path.join(ROOT_DIR, '..', '..', 'images');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function copyDir(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;
  ensureDir(destDir);
  fs.readdirSync(srcDir).forEach((item) => {
    const srcPath = path.join(srcDir, item);
    const destPath = path.join(destDir, item);
    const stats = fs.statSync(srcPath);

    if (stats.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  });
}

console.log('🚚 開始編譯 TailorMed 貨件追蹤 MVP...');

// 1. 編譯 Pug -> HTML
try {
  console.log('📝 編譯 Pug 模板...');
  const templatePath = path.join(SRC_DIR, 'index.pug');
  const template = fs.readFileSync(templatePath, 'utf8');
  const html = pug.render(template, {
    filename: templatePath,
    basedir: SRC_DIR,
    pretty: true,
  });
  ensureDir(DIST_DIR);
  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), html);
  console.log('✅ 已生成 dist/index.html');
} catch (error) {
  console.error('❌ Pug 編譯失敗:', error.message);
  process.exit(1);
}

// 2. 編譯 Stylus -> CSS
try {
  console.log('🎨 編譯 Stylus 樣式...');
  const stylusPath = path.join(STYLE_DIR, 'main.styl');
  const stylusCode = fs.readFileSync(stylusPath, 'utf8');
  stylus.render(stylusCode, { filename: stylusPath }, (err, css) => {
    if (err) {
      console.error('❌ Stylus 編譯失敗:', err.message);
      process.exit(1);
    }
    ensureDir(path.join(DIST_DIR, 'css'));
    fs.writeFileSync(path.join(DIST_DIR, 'css/main.css'), css);
    console.log('✅ 已生成 dist/css/main.css');
  });
} catch (error) {
  console.error('❌ Stylus 編譯失敗:', error.message);
  process.exit(1);
}

// 3. 複製腳本與資料
console.log('📦 複製靜態資源...');
copyDir(SCRIPT_DIR, path.join(DIST_DIR, 'js'));
copyDir(DATA_DIR, path.join(DIST_DIR, 'data'));
copyDir(IMAGE_DIR, path.join(DIST_DIR, 'images'));
console.log('✅ 靜態資源已就緒');

console.log('🎉 編譯完成！可以在 dist/index.html 預覽貨件追蹤 MVP');
