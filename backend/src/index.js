require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { testConnection, pool } = require('./config/database');
const logger = require('./config/logger');

const app = express();
const PORT = process.env.PORT || 3001;

// =====================================================
// 中間件設定
// =====================================================

// 安全性標頭
app.use(helmet());

// CORS 設定（安全配置）
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use(cors({
  origin: corsOrigin.split(',').map(o => o.trim()),
  credentials: true,
  optionsSuccessStatus: 200
}));

// JSON 解析
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 請求日誌（使用 Winston）
app.use(morgan('combined', { stream: logger.stream }));

// 速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分鐘
  max: 100 // 最多 100 個請求
});
app.use('/api/', limiter);

// =====================================================
// 路由
// =====================================================

// 健康檢查（實際測試資料庫連線）
app.get('/health', async (req, res) => {
  try {
    // 測試資料庫連線
    const connection = await pool.getConnection();
    await connection.query('SELECT 1');
    connection.release();

    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: 'connected'
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: 'disconnected',
      error: error.message
    });
  }
});

// API 路由
const apiRouter = require('./routes');
app.use('/api', apiRouter);

// 404 處理
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: '請求的資源不存在'
  });
});

// 錯誤處理
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });

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
    logger.info('正在連線到資料庫...');
    await testConnection();
    logger.info('資料庫連線成功');

    // 啟動伺服器
    const server = app.listen(PORT, () => {
      logger.info('伺服器已啟動', {
        environment: process.env.NODE_ENV,
        port: PORT,
        url: `http://localhost:${PORT}`,
        healthCheck: `http://localhost:${PORT}/health`
      });
    });

    // Graceful Shutdown
    const gracefulShutdown = async (signal) => {
      logger.info(`收到 ${signal} 信號，正在優雅關閉...`);

      server.close(async () => {
        logger.info('HTTP 伺服器已關閉');

        try {
          // 關閉資料庫連線池
          await pool.end();
          logger.info('資料庫連線池已關閉');
          process.exit(0);
        } catch (error) {
          logger.error('關閉資料庫連線池時發生錯誤:', error);
          process.exit(1);
        }
      });

      // 如果 10 秒後還沒關閉，強制退出
      setTimeout(() => {
        logger.error('無法在 10 秒內優雅關閉，強制退出');
        process.exit(1);
      }, 10000);
    };

    // 監聽關閉信號
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error('伺服器啟動失敗:', error);
    process.exit(1);
  }
}

startServer();
