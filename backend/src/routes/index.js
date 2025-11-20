const express = require('express');
const router = express.Router();

// =====================================================
// 路由匯總
// =====================================================

const teachersRouter = require('./teachers');
const coursesRouter = require('./courses');
const schedulesRouter = require('./schedules');

// 掛載路由
router.use('/teachers', teachersRouter);
router.use('/courses', coursesRouter);
router.use('/schedules', schedulesRouter);

// API 首頁
router.get('/', (req, res) => {
  res.json({
    message: '教師排班系統 API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      teachers: '/api/teachers',
      courses: '/api/courses',
      schedules: '/api/schedules'
    }
  });
});

module.exports = router;
