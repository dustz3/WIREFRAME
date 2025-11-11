const fs = require('fs');
const path = require('path');
const pug = require('pug');
const stylus = require('stylus');

const ROOT_DIR = __dirname;
const ASSETS_DIR = path.join(ROOT_DIR, 'Assets');
const JS_DIR = path.join(ROOT_DIR, 'Javascript');
const STYLES_DIR = path.join(ROOT_DIR, 'Styles');
const TEMPLATES_DIR = path.join(ROOT_DIR, 'Templates');
const PROJECT_DIST = path.join(
  path.resolve(ROOT_DIR, '../../..'),
  'dist',
  'Projects',
  'knowledgeBase'
);

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const cleanProjectDist = () => {
  ensureDir(PROJECT_DIST);
  const entries = fs.readdirSync(PROJECT_DIST, { withFileTypes: true });

  entries.forEach((entry) => {
    if (entry.name === 'track') {
      return;
    }

    const targetPath = path.join(PROJECT_DIST, entry.name);
    fs.rmSync(targetPath, { recursive: true, force: true });
  });
};

const copyDir = (source, destination) => {
  if (!fs.existsSync(source)) return;

  ensureDir(destination);
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const srcPath = path.join(source, entry.name);
    const destPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      ensureDir(path.dirname(destPath));
      fs.copyFileSync(srcPath, destPath);
    }
  }
};

const renderStylus = (filePath) => {
  const stylusCode = fs.readFileSync(filePath, 'utf8');

  return new Promise((resolve, reject) => {
    stylus(stylusCode)
      .set('filename', filePath)
      .render((err, css) => {
        if (err) {
          reject(err);
        } else {
          resolve(css);
        }
      });
  });
};

const main = async () => {
  console.log('🧠 開始編譯 knowledgeBase Wireframe...');

  cleanProjectDist();

  try {
    console.log('📝 編譯 Pug 模板...');
    const pugFiles = fs
      .readdirSync(TEMPLATES_DIR, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith('.pug'))
      .map((entry) => entry.name);

    if (pugFiles.length === 0) {
      console.warn('⚠️ knowledgeBase: 找不到 Pug 模板');
    }

    pugFiles.forEach((file) => {
      const templatePath = path.join(TEMPLATES_DIR, file);
      const html = pug.renderFile(templatePath, { pretty: true });
      const outputName = file.replace(/\.pug$/, '.html');
      fs.writeFileSync(path.join(PROJECT_DIST, outputName), html);
      console.log(`  ✅ 生成 dist/Projects/knowledgeBase/${outputName}`);
    });
  } catch (error) {
    console.error('❌ Pug 編譯失敗:', error.message);
    process.exit(1);
  }

  try {
    console.log('🎨 編譯 Stylus 樣式...');
    const stylusFiles = fs
      .readdirSync(STYLES_DIR, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith('.styl'))
      .map((entry) => entry.name);

    if (stylusFiles.length === 0) {
      console.warn('⚠️ knowledgeBase: 找不到 Stylus 檔案');
    }

    const cssDir = path.join(PROJECT_DIST, 'css');
    ensureDir(cssDir);

    for (const file of stylusFiles) {
      const stylusPath = path.join(STYLES_DIR, file);
      const css = await renderStylus(stylusPath);
      const outputName = file.replace(/\.styl$/, '.css');
      fs.writeFileSync(path.join(cssDir, outputName), css);
      console.log(`  ✅ 生成 dist/Projects/knowledgeBase/css/${outputName}`);
    }
  } catch (error) {
    console.error('❌ Stylus 編譯失敗:', error.message);
    process.exit(1);
  }

  console.log('📦 複製靜態資源...');
  copyDir(ASSETS_DIR, path.join(PROJECT_DIST, 'images'));
  copyDir(JS_DIR, path.join(PROJECT_DIST, 'js'));

  console.log('\n🎉 knowledgeBase Wireframe 編譯完成！');
  console.log('📁 預覽路徑：dist/Projects/knowledgeBase/index.html');
};

main();
