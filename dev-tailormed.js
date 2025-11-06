const { spawn } = require('child_process');
const path = require('path');

console.log('🏥 啟動 TailorMed 開發環境...\n');

// 先執行一次編譯
console.log('📦 執行初始編譯...');
const compileProcess = spawn('node', ['compile-tailormed.js'], {
  stdio: 'inherit',
  cwd: __dirname,
});

compileProcess.on('close', (code) => {
  if (code !== 0) {
    console.error('❌ 初始編譯失敗');
    process.exit(1);
  }

  console.log('\n✅ 初始編譯完成\n');
  console.log('🚀 啟動檔案監控和預覽伺服器...\n');

  // 使用 concurrently 同時運行 watch 和伺服器
  const devProcess = spawn(
    'npx',
    [
      'concurrently',
      '-n',
      'watch,server',
      '-c',
      'blue,green',
      'node watch-tailormed.js',
      'http-server dist/Projects/TailorMed -p 8080 -o',
    ],
    {
      stdio: 'inherit',
      cwd: __dirname,
    }
  );

  devProcess.on('close', (code) => {
    console.log(`\n開發環境已停止 (退出碼: ${code})`);
    process.exit(code);
  });

  // 處理 Ctrl+C
  process.on('SIGINT', () => {
    console.log('\n\n正在停止開發環境...');
    devProcess.kill('SIGINT');
    process.exit(0);
  });
});

compileProcess.on('error', (error) => {
  console.error('❌ 無法啟動編譯:', error);
  process.exit(1);
});

