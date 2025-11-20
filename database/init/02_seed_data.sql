-- =====================================================
-- 測試資料
-- =====================================================

SET NAMES utf8mb4;

-- =====================================================
-- 插入測試用戶
-- =====================================================
-- Admin 帳號: admin / Admin123!@#
-- Teacher 帳號: teacher1, teacher2 / Teacher123!
INSERT INTO `users` (`username`, `password`, `email`, `role`) VALUES
('admin', '$2a$10$wwxHp.aoqFbZqrkyqw32VO8NU00MyjY7DxNDhWexgMZRS2CYfAi86', 'admin@example.com', 'admin'),
('teacher1', '$2a$10$GgzA./g18ahrnm/KWd99rO8OURh1ydyMnOuzJwN0hmRPcXv8rZgpO', 'teacher1@example.com', 'teacher'),
('teacher2', '$2a$10$GgzA./g18ahrnm/KWd99rO8OURh1ydyMnOuzJwN0hmRPcXv8rZgpO', 'teacher2@example.com', 'teacher');

-- =====================================================
-- 插入測試教師（關聯到用戶）
-- =====================================================
-- teacher1 (張老師) 關聯到 user_id=2
-- teacher2 (李老師) 關聯到 user_id=3
-- 王老師沒有用戶帳號（僅資料記錄）
INSERT INTO `teachers` (`user_id`, `name`, `employee_id`, `department`, `phone`, `email`) VALUES
(2, '張老師', 'T001', '數學系', '0912-345-678', 'teacher1@example.com'),
(3, '李老師', 'T002', '英文系', '0923-456-789', 'teacher2@example.com'),
(NULL, '王老師', 'T003', '物理系', '0934-567-890', 'wang@example.com');

-- =====================================================
-- 插入測試課程
-- =====================================================
INSERT INTO `courses` (`course_code`, `course_name`, `description`, `credits`) VALUES
('MATH101', '微積分', '大一必修課程', 3),
('ENG101', '英文寫作', '大一必修課程', 2),
('PHYS101', '普通物理', '大一必修課程', 3);

-- =====================================================
-- 插入測試排班
-- =====================================================
INSERT INTO `schedules` (`teacher_id`, `date`, `shift_type`, `status`) VALUES
(1, '2025-01-20', 'morning', 'confirmed'),
(2, '2025-01-20', 'afternoon', 'confirmed'),
(3, '2025-01-20', 'evening', 'scheduled');
