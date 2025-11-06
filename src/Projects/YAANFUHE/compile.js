const fs = require('fs');
const path = require('path');
const pug = require('pug');
const stylus = require('stylus');

const ROOT = __dirname;
const DIST = path.join(ROOT, '../../..', 'dist', 'Projects', 'YAANFUHE');
const TEMPLATE_PATH = path.join(ROOT, 'Templates/index.pug');
const STYLUS_PATH = path.join(ROOT, 'Styles/main.styl');
const ASSETS_PATH = path.join(ROOT, 'Assets');

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const copyDir = (source, target) => {
  if (!fs.existsSync(source)) return;

  ensureDir(target);

  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const srcPath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, targetPath);
    } else {
      fs.copyFileSync(srcPath, targetPath);
    }
  }
};

const compile = async () => {
  console.log('🚀 Building YAANFUHE one-page site...');

  ensureDir(DIST);

  // Compile Pug
  const html = pug.renderFile(TEMPLATE_PATH, { pretty: true });
  fs.writeFileSync(path.join(DIST, 'index.html'), html);
  console.log('✅ Pug compiled to dist/Projects/YAANFUHE/index.html');

  // Compile Stylus
  const stylusCode = fs.readFileSync(STYLUS_PATH, 'utf8');
  stylus(stylusCode)
    .set('filename', STYLUS_PATH)
    .render((err, css) => {
      if (err) {
        console.error('❌ Stylus compile failed:', err.message);
        process.exit(1);
      }

      ensureDir(path.join(DIST, 'css'));
      fs.writeFileSync(path.join(DIST, 'css/main.css'), css);
      console.log('✅ Stylus compiled to dist/Projects/YAANFUHE/css/main.css');

      // Copy assets
      copyDir(ASSETS_PATH, path.join(DIST, 'images'));
      console.log('✅ Assets copied to dist/Projects/YAANFUHE/images');
      console.log('🎉 YAANFUHE build complete.');
    });
};

compile();
