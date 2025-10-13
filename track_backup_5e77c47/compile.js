const fs = require('fs');
const path = require('path');
const pug = require('pug');
const stylus = require('stylus');

const ROOT_DIR = __dirname;
const STYLE_DIR = path.join(ROOT_DIR, 'Styles');
const SCRIPT_DIR = path.join(ROOT_DIR, 'Javascript');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const TEMPLATE_DIR = path.join(ROOT_DIR, 'Templates');
const ASSETS_DIR = path.join(ROOT_DIR, 'Assets');
// Create dist in the backup folder itself
const DIST_DIR = path.join(ROOT_DIR, 'dist');

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

console.log('🚀 Starting TailorMed Track compilation...');

// 1. Compile Pug -> HTML
try {
  console.log('📄 Compiling Pug files...');
  const pugFiles = fs
    .readdirSync(TEMPLATE_DIR)
    .filter((file) => file.endsWith('.pug'));

  if (pugFiles.length === 0) {
    console.warn('⚠️  No Pug files found');
  }

  ensureDir(DIST_DIR);

  pugFiles.forEach((file) => {
    const templatePath = path.join(TEMPLATE_DIR, file);
    const html = pug.renderFile(templatePath, {
      pretty: true,
    });

    const outputName = file.replace(/\.pug$/, '.html');
    fs.writeFileSync(path.join(DIST_DIR, outputName), html);
    console.log(`  ✅ Generated ${outputName}`);
  });
} catch (error) {
  console.error('❌ Pug compilation failed:', error.message);
  process.exit(1);
}

// 2. Compile Stylus -> CSS
try {
  console.log('🎨 Compiling Stylus files...');
  const stylusFiles = fs
    .readdirSync(STYLE_DIR)
    .filter((file) => file.endsWith('.styl'));

  if (stylusFiles.length === 0) {
    console.warn('⚠️  No Stylus files found');
  }

  const cssDir = path.join(DIST_DIR, 'css');
  ensureDir(cssDir);

  stylusFiles.forEach((file) => {
    const stylusPath = path.join(STYLE_DIR, file);
    const stylusCode = fs.readFileSync(stylusPath, 'utf8');

    stylus(stylusCode)
      .set('filename', stylusPath)
      .render((err, css) => {
        if (err) {
          console.error('❌ Stylus compilation failed:', err.message);
          process.exit(1);
        }

        const outputName = file.replace(/\.styl$/, '.css');
        fs.writeFileSync(path.join(cssDir, outputName), css);
        console.log(`  ✅ Generated css/${outputName}`);
      });
  });
} catch (error) {
  console.error('❌ Stylus compilation failed:', error.message);
  process.exit(1);
}

// 3. Copy files
console.log('📁 Copying files...');
copyDir(SCRIPT_DIR, path.join(DIST_DIR, 'js'));
copyDir(DATA_DIR, path.join(DIST_DIR, 'data'));
copyDir(ASSETS_DIR, path.join(DIST_DIR, 'images'));
console.log('✅ Files copied successfully');

console.log(
  '✅ Compilation completed! Open dist/index.html in your browser'
);
