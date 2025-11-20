const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const logger = require('../config/logger');

// =====================================================
// 課程管理路由
// =====================================================

// 獲取所有課程
router.get('/', async (req, res) => {
  try {
    const courses = await query('SELECT * FROM courses WHERE is_active = TRUE ORDER BY created_at DESC');
    res.json({ success: true, data: courses });
  } catch (error) {
    logger.error('獲取課程列表失敗:', error);
    res.status(500).json({ success: false, error: '獲取課程列表失敗' });
  }
});

// 獲取單一課程
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const courses = await query('SELECT * FROM courses WHERE id = ?', [id]);

    if (courses.length === 0) {
      return res.status(404).json({ success: false, error: '課程不存在' });
    }

    res.json({ success: true, data: courses[0] });
  } catch (error) {
    logger.error('獲取課程資料失敗:', error);
    res.status(500).json({ success: false, error: '獲取課程資料失敗' });
  }
});

// 新增課程（TODO: 需要認證中間件）
router.post('/', async (req, res) => {
  try {
    const { course_code, course_name, description, credits } = req.body;

    const result = await query(
      'INSERT INTO courses (course_code, course_name, description, credits) VALUES (?, ?, ?, ?)',
      [course_code, course_name, description, credits]
    );

    res.status(201).json({
      success: true,
      data: { id: result.insertId, course_code, course_name, description, credits }
    });
  } catch (error) {
    logger.error('新增課程失敗:', error);
    res.status(500).json({ success: false, error: '新增課程失敗' });
  }
});

// 更新課程（TODO: 需要認證中間件）
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { course_code, course_name, description, credits } = req.body;

    await query(
      'UPDATE courses SET course_code = ?, course_name = ?, description = ?, credits = ? WHERE id = ?',
      [course_code, course_name, description, credits, id]
    );

    res.json({ success: true, message: '課程資料已更新' });
  } catch (error) {
    logger.error('更新課程失敗:', error);
    res.status(500).json({ success: false, error: '更新課程失敗' });
  }
});

// 刪除課程（軟刪除 - TODO: 需要認證中間件）
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await query('UPDATE courses SET is_active = FALSE WHERE id = ?', [id]);

    res.json({ success: true, message: '課程已停用' });
  } catch (error) {
    logger.error('刪除課程失敗:', error);
    res.status(500).json({ success: false, error: '刪除課程失敗' });
  }
});

module.exports = router;
