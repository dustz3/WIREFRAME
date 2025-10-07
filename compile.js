const pug = require('pug');
const stylus = require('stylus');
const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const dashboardSrc = path.join(rootDir, 'src', 'Projects', 'Dashboard');
const distRoot = path.join(rootDir, 'dist');
const templatesDir = path.join(dashboardSrc, 'Templates');
const stylesDir = path.join(dashboardSrc, 'Styles');
const jsDir = path.join(dashboardSrc, 'Javascript');
const assetsDir = path.join(dashboardSrc, 'Assets');

const ensureDir = (targetPath) => {
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
  }
};

const copyRecursive = (source, destination) => {
  if (!fs.existsSync(source)) return;
  ensureDir(destination);

  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const srcPath = path.join(source, entry.name);
    const destPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
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
  console.log('🚀 開始編譯 Website Wireframe Dashboard...\n');

  // 清理 dist 目錄
  if (fs.existsSync(distRoot)) {
    fs.rmSync(distRoot, { recursive: true, force: true });
  }
  ensureDir(distRoot);

  // 讀取專案配置
  let projectsConfig = { projects: [] };
  try {
    const configRaw = fs.readFileSync(
      path.join(rootDir, 'projects-config.json'),
      'utf8'
    );
    projectsConfig = JSON.parse(configRaw);
    console.log(`📋 載入 ${projectsConfig.projects.length} 個專案配置`);
  } catch (error) {
    console.error('❌ 專案配置讀取錯誤:', error.message);
    process.exit(1);
  }

  // 編譯 Pug 模板
  try {
    console.log('📝 編譯 Pug 模板...');

    const pugFiles = fs
      .readdirSync(templatesDir)
      .filter((file) => file.endsWith('.pug'));

    if (pugFiles.length === 0) {
      console.warn('⚠️ 未找到任何 Pug 檔案');
    }

    for (const file of pugFiles) {
      const templatePath = path.join(templatesDir, file);
      const html = pug.renderFile(templatePath, {
        projects: projectsConfig.projects,
      });

      const outputName = file.replace(/\.pug$/, '.html');
      fs.writeFileSync(path.join(distRoot, outputName), html);
      console.log(`  ✅ 已產生 ${outputName}`);
    }

    console.log('✅ Pug 模板編譯完成\n');
  } catch (error) {
    console.error('❌ Pug 編譯錯誤:', error.message);
    process.exit(1);
  }

  // 編譯 Stylus 樣式
  try {
    console.log('🎨 編譯 Stylus 樣式...');

    const stylusFiles = fs
      .readdirSync(stylesDir)
      .filter((file) => file.endsWith('.styl'));

    if (stylusFiles.length === 0) {
      console.warn('⚠️ 未找到任何 Stylus 檔案');
    }

    const cssOutputDir = path.join(distRoot, 'css');
    ensureDir(cssOutputDir);

    for (const file of stylusFiles) {
      const stylusPath = path.join(stylesDir, file);
      const css = await renderStylus(stylusPath);
      const outputName = file.replace(/\.styl$/, '.css');
      fs.writeFileSync(path.join(cssOutputDir, outputName), css);
      console.log(`  ✅ 已產生 css/${outputName}`);
    }

    console.log('✅ Stylus 樣式編譯完成\n');
  } catch (error) {
    console.error('❌ Stylus 編譯錯誤:', error.message);
    process.exit(1);
  }

  // 複製 Javascript 檔案
  if (fs.existsSync(jsDir)) {
    console.log('📦 複製 Javascript 檔案...');
    copyRecursive(jsDir, path.join(distRoot, 'js'));
  }

  // 複製資產
  if (fs.existsSync(assetsDir)) {
    console.log('🖼️  複製資產檔案...');
    copyRecursive(assetsDir, path.join(distRoot, 'images'));
  }

  console.log('\n🎉 編譯完成！Dashboard 已生成至 dist/');
};

main();
