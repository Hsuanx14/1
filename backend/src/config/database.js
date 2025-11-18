const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// =====================================================
// 資料庫連線配置
// =====================================================

const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

// Azure SSL 連線設定
if (process.env.DB_SSL_MODE === 'REQUIRED' && process.env.DB_SSL_CA) {
  const sslCaPath = process.env.DB_SSL_CA;

  // 檢查 SSL 憑證是否存在
  if (fs.existsSync(sslCaPath)) {
    dbConfig.ssl = {
      ca: fs.readFileSync(sslCaPath),
      rejectUnauthorized: true
    };
    console.log('✅ SSL 憑證已載入，將使用加密連線');
  } else {
    console.warn(`⚠️  警告: SSL 憑證檔案不存在: ${sslCaPath}`);
    console.warn('⚠️  將使用非加密連線');
  }
}

// 建立連線池
const pool = mysql.createPool(dbConfig);

// =====================================================
// 測試連線
// =====================================================

async function testConnection() {
  try {
    const connection = await pool.getConnection();

    // 獲取資料庫版本
    const [rows] = await connection.query('SELECT VERSION() as version');
    const version = rows[0].version;

    // 獲取主機資訊
    const [hostInfo] = await connection.query('SELECT @@hostname as hostname');
    const hostname = hostInfo[0].hostname;

    // 檢查 SSL 狀態
    const [sslInfo] = await connection.query("SHOW STATUS LIKE 'Ssl_cipher'");
    const sslEnabled = sslInfo[0]?.Value ? '已啟用' : '未啟用';

    console.log('✅ 資料庫連線成功', {
      host: dbConfig.host,
      database: dbConfig.database,
      version: version,
      hostname: hostname,
      ssl: sslEnabled
    });

    connection.release();
    return true;
  } catch (error) {
    console.error('❌ 資料庫連線失敗:', error.message);
    throw error;
  }
}

// =====================================================
// 查詢輔助函數
// =====================================================

async function query(sql, params) {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('資料庫查詢錯誤:', error.message);
    throw error;
  }
}

async function transaction(callback) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// =====================================================
// 導出
// =====================================================

module.exports = {
  pool,
  query,
  transaction,
  testConnection
};
