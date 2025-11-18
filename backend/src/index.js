require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { testConnection } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3001;

// =====================================================
// 中間件設定
// =====================================================

// 安全性標頭
app.use(helmet());

// CORS 設定
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// JSON 解析
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 請求日誌
app.use(morgan('combined'));

// 速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分鐘
  max: 100 // 最多 100 個請求
});
app.use('/api/', limiter);

// =====================================================
// 路由
// =====================================================

// 健康檢查
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: 'connected'
  });
});

// API 路由（將在後續添加）
app.get('/api', (req, res) => {
  res.json({
    message: '教師排班系統 API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api'
    }
  });
});

// 404 處理
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: '請求的資源不存在'
  });
});

// 錯誤處理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// =====================================================
// 啟動伺服器
// =====================================================

async function startServer() {
  try {
    // 測試資料庫連線
    console.log('🔌 正在連線到資料庫...');
    await testConnection();
    console.log('✅ 資料庫連線成功');

    // 啟動伺服器
    app.listen(PORT, () => {
      console.log('='.repeat(60));
      console.log(`🚀 伺服器已啟動`);
      console.log(`📍 環境: ${process.env.NODE_ENV}`);
      console.log(`🌐 端口: ${PORT}`);
      console.log(`🔗 URL: http://localhost:${PORT}`);
      console.log(`💚 健康檢查: http://localhost:${PORT}/health`);
      console.log('='.repeat(60));
    });
  } catch (error) {
    console.error('❌ 啟動失敗:', error.message);
    process.exit(1);
  }
}

startServer();
