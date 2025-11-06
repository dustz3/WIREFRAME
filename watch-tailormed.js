const fs = require('fs');
const path = require('path');
const pug = require('pug');
const stylus = require('stylus');
const chokidar = require('chokidar');

const ROOT_DIR = __dirname;
const SRC_DIR = path.join(ROOT_DIR, 'src/Projects/TailorMed');
const DIST_DIR = path.join(ROOT_DIR, 'dist/Projects/TailorMed');

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

function compilePug() {
  try {
    console.log('📝 編譯 Pug 模板...');
    const templateDir = path.join(SRC_DIR, 'Templates');
    if (!fs.existsSync(templateDir)) {
      console.warn('⚠️ Templates 目錄不存在');
      return;
    }

    const pugFiles = fs
      .readdirSync(templateDir)
      .filter((file) => file.endsWith('.pug'));

    if (pugFiles.length === 0) {
      console.warn('⚠️ 未找到任何 Pug 檔案');
      return;
    }

    ensureDir(DIST_DIR);

    pugFiles.forEach((file) => {
      const templatePath = path.join(templateDir, file);
      const html = pug.renderFile(templatePath, {
        pretty: true,
      });

      const outputName = file.replace(/\.pug$/, '.html');
      fs.writeFileSync(path.join(DIST_DIR, outputName), html);
      console.log(`  ✅ 已生成 ${outputName}`);
    });
  } catch (error) {
    console.error('❌ Pug 編譯失敗:', error.message);
  }
}

function compileStylus() {
  return new Promise((resolve, reject) => {
    try {
      console.log('🎨 編譯 Stylus 樣式...');
      const styleDir = path.join(SRC_DIR, 'Styles');
      if (!fs.existsSync(styleDir)) {
        console.warn('⚠️ Styles 目錄不存在');
        resolve();
        return;
      }

      const stylusFiles = fs
        .readdirSync(styleDir)
        .filter((file) => file.endsWith('.styl'));

      if (stylusFiles.length === 0) {
        console.warn('⚠️ 未找到任何 Stylus 檔案');
        resolve();
        return;
      }

      const cssDir = path.join(DIST_DIR, 'css');
      ensureDir(cssDir);

      const promises = stylusFiles.map((file) => {
        return new Promise((fileResolve, fileReject) => {
          const stylusPath = path.join(styleDir, file);
          const stylusCode = fs.readFileSync(stylusPath, 'utf8');

          stylus(stylusCode)
            .set('filename', stylusPath)
            .set('paths', [styleDir])
            .render((err, css) => {
              if (err) {
                console.error(`❌ Stylus 編譯失敗 (${file}):`, err.message);
                fileReject(err);
                return;
              }

              const outputName = file.replace(/\.styl$/, '.css');
              fs.writeFileSync(path.join(cssDir, outputName), css);
              console.log(`  ✅ 已生成 css/${outputName}`);
              fileResolve();
            });
        });
      });

      Promise.all(promises)
        .then(() => resolve())
        .catch((err) => reject(err));
    } catch (error) {
      console.error('❌ Stylus 編譯失敗:', error.message);
      reject(error);
    }
  });
}

function copyAssets() {
  console.log('📦 複製靜態資源...');
  copyDir(path.join(SRC_DIR, 'Javascript'), path.join(DIST_DIR, 'js'));
  copyDir(path.join(SRC_DIR, 'Assets'), path.join(DIST_DIR, 'images'));
  console.log('✅ 靜態資源已就緒');
}

async function compileAll() {
  console.log('\n🔄 偵測到檔案變更，開始重新編譯...');
  compilePug();
  await compileStylus();
  copyAssets();
  console.log('✅ 編譯完成！\n');
}

// 初始編譯
console.log('🏥 開始監控 TailorMed 主專案...');
compileAll();

// 監控檔案變更
const watchOptions = {
  ignored: /(^|[\/\\])\../, // 忽略隱藏檔案
  persistent: true,
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 500,
    pollInterval: 100,
  },
  usePolling: false,
  interval: 100,
};

// 使用目錄監控並過濾檔案類型
const pugWatcher = chokidar.watch(path.join(SRC_DIR, 'Templates'), {
  ...watchOptions,
  ignored: /(^|[\/\\])\../,
});

const stylusWatcher = chokidar.watch(path.join(SRC_DIR, 'Styles'), {
  ...watchOptions,
  ignored: /(^|[\/\\])\../,
});

const jsWatcher = chokidar.watch(path.join(SRC_DIR, 'Javascript'), {
  ...watchOptions,
  ignored: /(^|[\/\\])\../,
});

const assetsWatcher = chokidar.watch(path.join(SRC_DIR, 'Assets'), {
  ...watchOptions,
  ignored: /(^|[\/\\])\../,
});

// 添加錯誤處理
pugWatcher.on('error', (error) => {
  console.error('❌ Pug 監控錯誤:', error);
});

stylusWatcher.on('error', (error) => {
  console.error('❌ Stylus 監控錯誤:', error);
});

jsWatcher.on('error', (error) => {
  console.error('❌ JavaScript 監控錯誤:', error);
});

assetsWatcher.on('error', (error) => {
  console.error('❌ Assets 監控錯誤:', error);
});

// 確認監控已啟動
pugWatcher.on('ready', () => {
  console.log('✅ Pug 檔案監控已啟動');
});

stylusWatcher.on('ready', () => {
  console.log('✅ Stylus 檔案監控已啟動');
});

jsWatcher.on('ready', () => {
  console.log('✅ JavaScript 檔案監控已啟動');
});

assetsWatcher.on('ready', () => {
  console.log('✅ Assets 檔案監控已啟動');
});

// 監控 Pug 檔案
pugWatcher.on('change', (filePath) => {
  if (filePath.endsWith('.pug')) {
    console.log(`\n📝 偵測到變更: ${path.relative(ROOT_DIR, filePath)}`);
    compilePug();
    console.log('✅ Pug 編譯完成\n');
  }
});

// 監控 Stylus 檔案
stylusWatcher.on('change', (filePath) => {
  if (filePath.endsWith('.styl')) {
    console.log(`\n🎨 偵測到變更: ${path.relative(ROOT_DIR, filePath)}`);
    compileStylus()
      .then(() => {
        console.log('✅ Stylus 編譯完成\n');
      })
      .catch((err) => {
        console.error('❌ Stylus 編譯失敗:', err.message, '\n');
      });
  }
});

// 監控 JavaScript 和資源檔案
jsWatcher.on('change', (filePath) => {
  if (filePath.endsWith('.js')) {
    console.log(`\n📦 偵測到變更: ${path.relative(ROOT_DIR, filePath)}`);
    copyAssets();
  }
});

assetsWatcher.on('change', (filePath) => {
  console.log(`\n📦 偵測到變更: ${path.relative(ROOT_DIR, filePath)}`);
  copyAssets();
});

console.log('👀 監控模式已啟動，等待檔案變更...');
console.log('   監控目錄:');
console.log(`   - ${path.join(SRC_DIR, 'Templates')}`);
console.log(`   - ${path.join(SRC_DIR, 'Styles')}`);
console.log(`   - ${path.join(SRC_DIR, 'Javascript')}`);
console.log(`   - ${path.join(SRC_DIR, 'Assets')}`);
console.log('\n按 Ctrl+C 停止監控\n');
