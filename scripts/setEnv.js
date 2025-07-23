const fs = require('fs');
const path = require('path');

// 設定ファイルのパス
const configPath = path.resolve(__dirname, '../config/config.json');

if (!fs.existsSync(configPath)) {
  console.error('設定ファイル config/config.json が見つかりません。');
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const gaId = config.GA_ID || '';

if (!gaId) {
  console.error('config/config.json に GA_ID が設定されていません。');
  process.exit(1);
}

// .envファイルのパス
const envPath = path.resolve(__dirname, '../.env');

// 既存の.env内容を取得
let env = '';
if (fs.existsSync(envPath)) {
  env = fs.readFileSync(envPath, 'utf8');
  // 既存のNEXT_PUBLIC_GA_ID行を削除
  env = env.replace(/^NEXT_PUBLIC_GA_ID=.*$/m, '');
}

// NEXT_PUBLIC_GA_IDを書き込み
env += `\nNEXT_PUBLIC_GA_ID=${gaId}\n`;
fs.writeFileSync(envPath, env.trim() + '\n', 'utf8');

console.log(`.envファイルにGA ID（${gaId}）を書き込みました。`);