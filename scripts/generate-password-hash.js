#!/usr/bin/env node

/**
 * 生成測試用戶密碼 Hash
 *
 * Admin 密碼: Admin123!@#
 * Teacher 密碼: Teacher123!
 */

const bcrypt = require('bcryptjs');

async function generateHashes() {
  console.log('🔐 正在生成密碼 Hash...\n');

  const adminPassword = 'Admin123!@#';
  const teacherPassword = 'Teacher123!';

  const adminHash = await bcrypt.hash(adminPassword, 10);
  const teacherHash = await bcrypt.hash(teacherPassword, 10);

  console.log('-- =====================================================');
  console.log('-- 更新後的測試用戶資料');
  console.log('-- =====================================================');
  console.log('-- Admin 帳號: admin / Admin123!@#');
  console.log('-- Teacher 帳號: teacher1, teacher2 / Teacher123!');
  console.log('-- =====================================================\n');

  console.log(`INSERT INTO \`users\` (\`username\`, \`password\`, \`email\`, \`role\`) VALUES`);
  console.log(`('admin', '${adminHash}', 'admin@example.com', 'admin'),`);
  console.log(`('teacher1', '${teacherHash}', 'teacher1@example.com', 'teacher'),`);
  console.log(`('teacher2', '${teacherHash}', 'teacher2@example.com', 'teacher');`);

  console.log('\n✅ Hash 生成完成！');
}

generateHashes().catch(console.error);
