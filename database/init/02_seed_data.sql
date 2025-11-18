-- =====================================================
-- 測試資料
-- =====================================================

SET NAMES utf8mb4;

-- =====================================================
-- 插入測試用戶
-- =====================================================
-- 密碼: Admin123!@# (需要在應用中使用 bcrypt 加密)
INSERT INTO `users` (`username`, `password`, `email`, `role`) VALUES
('admin', '$2a$10$XXX', 'admin@example.com', 'admin'),
('teacher1', '$2a$10$XXX', 'teacher1@example.com', 'teacher'),
('teacher2', '$2a$10$XXX', 'teacher2@example.com', 'teacher');

-- =====================================================
-- 插入測試教師
-- =====================================================
INSERT INTO `teachers` (`name`, `employee_id`, `department`, `phone`, `email`) VALUES
('張老師', 'T001', '數學系', '0912-345-678', 'zhang@example.com'),
('李老師', 'T002', '英文系', '0923-456-789', 'li@example.com'),
('王老師', 'T003', '物理系', '0934-567-890', 'wang@example.com');

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
