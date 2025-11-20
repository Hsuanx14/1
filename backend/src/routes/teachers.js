const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const logger = require('../config/logger');

// =====================================================
// 教師管理路由
// =====================================================

// 獲取所有教師
router.get('/', async (req, res) => {
  try {
    const teachers = await query('SELECT * FROM teachers WHERE is_active = TRUE ORDER BY created_at DESC');
    res.json({ success: true, data: teachers });
  } catch (error) {
    logger.error('獲取教師列表失敗:', error);
    res.status(500).json({ success: false, error: '獲取教師列表失敗' });
  }
});

// 獲取單一教師
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const teachers = await query('SELECT * FROM teachers WHERE id = ?', [id]);

    if (teachers.length === 0) {
      return res.status(404).json({ success: false, error: '教師不存在' });
    }

    res.json({ success: true, data: teachers[0] });
  } catch (error) {
    logger.error('獲取教師資料失敗:', error);
    res.status(500).json({ success: false, error: '獲取教師資料失敗' });
  }
});

// 新增教師（TODO: 需要認證中間件）
router.post('/', async (req, res) => {
  try {
    const { name, employee_id, department, phone, email } = req.body;

    const result = await query(
      'INSERT INTO teachers (name, employee_id, department, phone, email) VALUES (?, ?, ?, ?, ?)',
      [name, employee_id, department, phone, email]
    );

    res.status(201).json({
      success: true,
      data: { id: result.insertId, name, employee_id, department, phone, email }
    });
  } catch (error) {
    logger.error('新增教師失敗:', error);
    res.status(500).json({ success: false, error: '新增教師失敗' });
  }
});

// 更新教師（TODO: 需要認證中間件）
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, employee_id, department, phone, email } = req.body;

    await query(
      'UPDATE teachers SET name = ?, employee_id = ?, department = ?, phone = ?, email = ? WHERE id = ?',
      [name, employee_id, department, phone, email, id]
    );

    res.json({ success: true, message: '教師資料已更新' });
  } catch (error) {
    logger.error('更新教師失敗:', error);
    res.status(500).json({ success: false, error: '更新教師失敗' });
  }
});

// 刪除教師（軟刪除 - TODO: 需要認證中間件）
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await query('UPDATE teachers SET is_active = FALSE WHERE id = ?', [id]);

    res.json({ success: true, message: '教師已停用' });
  } catch (error) {
    logger.error('刪除教師失敗:', error);
    res.status(500).json({ success: false, error: '刪除教師失敗' });
  }
});

module.exports = router;
