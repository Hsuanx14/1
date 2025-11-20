#!/usr/bin/env node

/**
 * 安全密鑰生成工具
 *
 * 用途：為 .env 檔案生成安全的隨機密鑰
 * 使用：node scripts/generate-secrets.js
 */

const crypto = require('crypto');

console.log('\n=================================================');
console.log('🔐 教師排班管理系統 - 安全密鑰生成器');
console.log('=================================================\n');

// 生成不同長度的隨機密鑰
function generateSecret(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

// 生成隨機密碼（包含大小寫字母、數字、特殊符號）
function generatePassword(length = 16) {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  const all = uppercase + lowercase + numbers + symbols;
  let password = '';

  // 確保至少包含每種類型的字元
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  // 填充剩餘長度
  for (let i = password.length; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }

  // 打亂順序
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

console.log('📋 請複製以下密鑰到你的 .env 檔案：\n');

console.log('# ===================================================');
console.log('# JWT 和 Session 密鑰（用於身份驗證）');
console.log('# ===================================================');
console.log(`JWT_SECRET=${generateSecret(64)}`);
console.log(`SESSION_SECRET=${generateSecret(64)}`);

console.log('\n# ===================================================');
console.log('# 資料庫密碼（用於本地開發）');
console.log('# ===================================================');
console.log(`DB_PASSWORD=${generatePassword(20)}`);
console.log(`DB_ROOT_PASSWORD=${generatePassword(20)}`);

console.log('\n# ===================================================');
console.log('# 正式環境資料庫密碼（Azure MySQL）');
console.log('# ===================================================');
console.log(`# DB_PASSWORD=${generatePassword(24)}`);

console.log('\n=================================================');
console.log('⚠️  安全提醒：');
console.log('=================================================');
console.log('1. ✅ 這些密鑰只會顯示一次，請妥善保存');
console.log('2. ✅ 不要將 .env 檔案提交到 Git');
console.log('3. ✅ 本地開發和正式環境使用不同的密鑰');
console.log('4. ✅ 定期更換正式環境的密鑰（建議每 3-6 個月）');
console.log('5. ✅ 如果密鑰洩漏，立即更換並重新部署');
console.log('=================================================\n');

console.log('💡 使用方式：');
console.log('1. 複製上方的密鑰');
console.log('2. 編輯 .env 檔案');
console.log('3. 替換對應的值');
console.log('4. 重啟 Docker 容器：docker compose restart\n');
