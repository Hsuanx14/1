const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const logger = require('../config/logger');

// =====================================================
// 排班管理路由
// =====================================================

// 獲取所有排班（可以按日期範圍篩選）
router.get('/', async (req, res) => {
  try {
    const { start_date, end_date, teacher_id } = req.query;

    let sql = `
      SELECT s.*, t.name as teacher_name, t.employee_id
      FROM schedules s
      LEFT JOIN teachers t ON s.teacher_id = t.id
      WHERE 1=1
    `;
    const params = [];

    if (start_date) {
      sql += ' AND s.date >= ?';
      params.push(start_date);
    }

    if (end_date) {
      sql += ' AND s.date <= ?';
      params.push(end_date);
    }

    if (teacher_id) {
      sql += ' AND s.teacher_id = ?';
      params.push(teacher_id);
    }

    sql += ' ORDER BY s.date DESC, s.shift_type';

    const schedules = await query(sql, params);
    res.json({ success: true, data: schedules });
  } catch (error) {
    logger.error('獲取排班列表失敗:', error);
    res.status(500).json({ success: false, error: '獲取排班列表失敗' });
  }
});

// 獲取單一排班
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const schedules = await query(`
      SELECT s.*, t.name as teacher_name, t.employee_id
      FROM schedules s
      LEFT JOIN teachers t ON s.teacher_id = t.id
      WHERE s.id = ?
    `, [id]);

    if (schedules.length === 0) {
      return res.status(404).json({ success: false, error: '排班不存在' });
    }

    res.json({ success: true, data: schedules[0] });
  } catch (error) {
    logger.error('獲取排班資料失敗:', error);
    res.status(500).json({ success: false, error: '獲取排班資料失敗' });
  }
});

// 新增排班（TODO: 需要認證中間件）
router.post('/', async (req, res) => {
  try {
    const { teacher_id, date, shift_type, status, notes } = req.body;

    const result = await query(
      'INSERT INTO schedules (teacher_id, date, shift_type, status, notes) VALUES (?, ?, ?, ?, ?)',
      [teacher_id, date, shift_type, status || 'scheduled', notes]
    );

    res.status(201).json({
      success: true,
      data: { id: result.insertId, teacher_id, date, shift_type, status, notes }
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        error: '該教師在此日期和時段已有排班'
      });
    }
    logger.error('新增排班失敗:', error);
    res.status(500).json({ success: false, error: '新增排班失敗' });
  }
});

// 更新排班（TODO: 需要認證中間件）
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { teacher_id, date, shift_type, status, notes } = req.body;

    await query(
      'UPDATE schedules SET teacher_id = ?, date = ?, shift_type = ?, status = ?, notes = ? WHERE id = ?',
      [teacher_id, date, shift_type, status, notes, id]
    );

    res.json({ success: true, message: '排班資料已更新' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        error: '該教師在此日期和時段已有排班'
      });
    }
    logger.error('更新排班失敗:', error);
    res.status(500).json({ success: false, error: '更新排班失敗' });
  }
});

// 刪除排班（TODO: 需要認證中間件）
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await query('DELETE FROM schedules WHERE id = ?', [id]);

    res.json({ success: true, message: '排班已刪除' });
  } catch (error) {
    logger.error('刪除排班失敗:', error);
    res.status(500).json({ success: false, error: '刪除排班失敗' });
  }
});

module.exports = router;
