# 🐛 Bug 修復報告

**日期：** 2025-11-20
**分支：** `claude/database-schema-setup-0133ZyFeWM98XMnvPyZLwPAK`
**Commit：** f0acb7e

---

## 📋 修復摘要

總共修復了 **10 個問題**：
- 🔴 嚴重 Bug：2 個
- 🟡 中等問題：3 個
- 🟢 程式碼品質：3 個
- 🚀 新功能：2 個

---

## 🔴 嚴重 Bug 修復

### 1. 修復測試資料密碼 Hash

**問題：**
```sql
-- 原始碼（錯誤）
INSERT INTO `users` (`username`, `password`, ...) VALUES
('admin', '$2a$10$XXX', ...);  -- ❌ 假的 hash，無法登入
```

**修復後：**
```sql
-- 新程式碼（正確）
INSERT INTO `users` (`username`, `password`, ...) VALUES
('admin', '$2a$10$wwxHp.aoqFbZqrkyqw32VO8NU00MyjY7DxNDhWexgMZRS2CYfAi86', ...);
```

**影響檔案：**
- `database/init/02_seed_data.sql`

**測試帳號：**
- Admin: `admin` / `Admin123!@#`
- Teacher1: `teacher1` / `Teacher123!`
- Teacher2: `teacher2` / `Teacher123!`

---

### 2. 修復健康檢查端點

**問題：**
```javascript
// backend/src/index.js:49（錯誤）
app.get('/health', (req, res) => {
  res.json({
    database: 'connected'  // ❌ 硬編碼，不管資料庫是否真的連線
  });
});
```

**修復後：**
```javascript
// backend/src/index.js:47-69（正確）
app.get('/health', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('SELECT 1');  // ✅ 真的測試連線
    connection.release();
    res.json({ database: 'connected' });
  } catch (error) {
    res.status(503).json({ database: 'disconnected' });
  }
});
```

**影響檔案：**
- `backend/src/index.js`

---

## 🟡 中等問題修復

### 3. 新增資料庫唯一約束

**問題：**
- 同一個老師可以在同一天同一時段被分配多次班
- 同一個老師可以在同一學期被分配到同一課程多次

**修復後：**
```sql
-- database/init/01_schema.sql:60
UNIQUE KEY `unique_teacher_schedule` (`teacher_id`, `date`, `shift_type`)

-- database/init/01_schema.sql:91
UNIQUE KEY `unique_course_assignment` (`course_id`, `teacher_id`, `semester`, `year`)
```

**影響檔案：**
- `database/init/01_schema.sql`

---

### 4. 修復 CORS 安全性設定

**問題：**
```javascript
// backend/src/index.js:21（錯誤）
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',  // ❌ 預設允許所有來源
}));
```

**修復後：**
```javascript
// backend/src/index.js:20-25（正確）
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use(cors({
  origin: corsOrigin.split(',').map(o => o.trim()),  // ✅ 預設只允許本地
  credentials: true,
  optionsSuccessStatus: 200
}));
```

**影響檔案：**
- `backend/src/index.js`

---

### 5. 修復測試資料的 user_id 關聯

**問題：**
```sql
-- database/init/02_seed_data.sql:19-22（錯誤）
INSERT INTO `teachers` (`name`, ...) VALUES
('張老師', ...);  -- ❌ user_id 是 NULL，無法測試登入
```

**修復後：**
```sql
-- database/init/02_seed_data.sql:23-26（正確）
INSERT INTO `teachers` (`user_id`, `name`, ...) VALUES
(2, '張老師', ...),  -- ✅ 關聯到 teacher1
(3, '李老師', ...);  -- ✅ 關聯到 teacher2
```

**影響檔案：**
- `database/init/02_seed_data.sql`

---

## 🟢 程式碼品質提升

### 6. 整合 Winston Logger

**新增檔案：**
- `backend/src/config/logger.js`（64 行）

**功能：**
- ✅ 結構化日誌輸出（JSON 格式）
- ✅ 日誌分級（info, error, debug）
- ✅ 日誌檔案自動輪換（每個 5MB，保留 5 個）
- ✅ 開發環境同時輸出到控制台
- ✅ HTTP 請求日誌整合 Morgan

**範例：**
```javascript
const logger = require('./config/logger');

logger.info('伺服器已啟動', { port: 3001 });
logger.error('資料庫錯誤:', error);
```

**影響檔案：**
- `backend/src/config/logger.js`（新增）
- `backend/src/index.js`（整合）

---

### 7. 新增 Graceful Shutdown

**功能：**
- ✅ 監聽 SIGTERM 和 SIGINT 信號
- ✅ 優雅關閉 HTTP 伺服器
- ✅ 正確關閉資料庫連線池
- ✅ 10 秒超時保護

**程式碼：**
```javascript
// backend/src/index.js:129-151
const gracefulShutdown = async (signal) => {
  logger.info(`收到 ${signal} 信號，正在優雅關閉...`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
```

**影響檔案：**
- `backend/src/index.js`

---

### 8. 生成 package-lock.json

**檔案資訊：**
- 大小：66 KB
- 套件數量：163 個
- 安全性：0 個漏洞

**影響檔案：**
- `backend/package-lock.json`（新增）

---

## 🚀 新功能

### 9. 建立 API 路由骨架

**新增檔案：**
1. `backend/src/routes/index.js`（API 路由匯總）
2. `backend/src/routes/teachers.js`（教師管理）
3. `backend/src/routes/courses.js`（課程管理）
4. `backend/src/routes/schedules.js`（排班管理）

**API 端點：**

#### 教師管理（/api/teachers）
- `GET /api/teachers` - 獲取所有教師
- `GET /api/teachers/:id` - 獲取單一教師
- `POST /api/teachers` - 新增教師
- `PUT /api/teachers/:id` - 更新教師
- `DELETE /api/teachers/:id` - 刪除教師（軟刪除）

#### 課程管理（/api/courses）
- `GET /api/courses` - 獲取所有課程
- `GET /api/courses/:id` - 獲取單一課程
- `POST /api/courses` - 新增課程
- `PUT /api/courses/:id` - 更新課程
- `DELETE /api/courses/:id` - 刪除課程（軟刪除）

#### 排班管理（/api/schedules）
- `GET /api/schedules` - 獲取所有排班（支援日期範圍篩選）
- `GET /api/schedules/:id` - 獲取單一排班
- `POST /api/schedules` - 新增排班
- `PUT /api/schedules/:id` - 更新排班
- `DELETE /api/schedules/:id` - 刪除排班

**特色功能：**
- ✅ 唯一約束違反時回傳友善錯誤訊息（HTTP 409）
- ✅ 支援日期範圍篩選（`?start_date=2025-01-01&end_date=2025-12-31`）
- ✅ 支援按教師篩選（`?teacher_id=1`）
- ✅ 自動關聯教師名稱（JOIN 查詢）

**測試範例：**
```bash
# 測試 API
curl http://localhost:3001/api

# 獲取所有教師
curl http://localhost:3001/api/teachers

# 獲取特定日期範圍的排班
curl "http://localhost:3001/api/schedules?start_date=2025-01-01&end_date=2025-01-31"

# 新增教師
curl -X POST http://localhost:3001/api/teachers \
  -H "Content-Type: application/json" \
  -d '{"name":"陳老師","employee_id":"T004","department":"化學系"}'
```

---

### 10. 修復缺少的圖片

**問題：**
```html
<!-- index.html:441（錯誤）-->
<img src="teaching-materials-icon.png" alt="教材管理">
<!-- ❌ 圖片檔案不存在，顯示破圖 -->
```

**修復後：**
```html
<!-- index.html:440（正確）-->
<span class="card-icon">📚</span>
<!-- ✅ 改用 emoji，不需要額外圖片檔案 -->
```

**影響檔案：**
- `index.html`

---

## 📊 檔案變更統計

| 類型 | 數量 | 檔案列表 |
|------|------|----------|
| 新增檔案 | 6 | `backend/package-lock.json`<br>`backend/src/config/logger.js`<br>`backend/src/routes/*.js` (4個)<br>`scripts/generate-password-hash.js` |
| 修改檔案 | 3 | `backend/src/index.js`<br>`database/init/01_schema.sql`<br>`database/init/02_seed_data.sql`<br>`index.html` |
| 刪除檔案 | 0 | - |
| **總計** | **11** | - |

**程式碼行數：**
- 新增：+2402 行
- 刪除：-53 行
- 淨增加：+2349 行

---

## 🧪 測試檢查清單

### 必須測試的項目

- [ ] **資料庫重新初始化**
  ```bash
  docker compose down -v
  docker compose up -d
  ```

- [ ] **健康檢查**
  ```bash
  curl http://localhost:3001/health
  # 預期輸出：{"status":"ok","database":"connected",...}
  ```

- [ ] **API 端點測試**
  ```bash
  # 測試教師列表
  curl http://localhost:3001/api/teachers

  # 測試課程列表
  curl http://localhost:3001/api/courses

  # 測試排班列表
  curl http://localhost:3001/api/schedules
  ```

- [ ] **唯一約束測試**
  ```bash
  # 嘗試新增重複排班（應該失敗並回傳 HTTP 409）
  curl -X POST http://localhost:3001/api/schedules \
    -H "Content-Type: application/json" \
    -d '{"teacher_id":1,"date":"2025-01-20","shift_type":"morning"}'

  # 預期輸出：{"success":false,"error":"該教師在此日期和時段已有排班"}
  ```

- [ ] **日誌檔案檢查**
  ```bash
  # 檢查日誌是否正確生成
  docker compose exec backend ls -lh /app/logs/

  # 查看日誌內容
  docker compose exec backend cat /app/logs/combined.log
  ```

- [ ] **Graceful Shutdown 測試**
  ```bash
  # 發送 SIGTERM 信號
  docker compose kill -s SIGTERM backend

  # 檢查是否優雅關閉（查看日誌）
  docker compose logs backend | grep "優雅關閉"
  ```

---

## 🎯 下一步建議

### 短期（1-2 週）
1. **實作認證系統**
   - JWT Token 簽發和驗證
   - Login/Logout API
   - 權限中間件（RBAC）

2. **完善 API 驗證**
   - 使用 express-validator
   - 輸入資料驗證
   - 錯誤訊息標準化

3. **前端整合**
   - 將靜態 HTML 改為呼叫 API
   - 實作登入頁面
   - 實作教師列表頁面

### 中期（2-4 週）
4. **測試覆蓋率**
   - 單元測試（Jest）
   - 整合測試（Supertest）
   - E2E 測試（Cypress）

5. **效能優化**
   - 新增資料庫索引優化
   - API 快取（Redis）
   - 查詢優化

6. **監控和警報**
   - 新增 Prometheus 指標
   - 設定 Grafana 儀表板
   - 設定錯誤警報（Email/Slack）

### 長期（1-3 個月）
7. **微服務架構**
   - 拆分認證服務
   - 拆分通知服務
   - API Gateway

8. **CI/CD 完善**
   - 自動化測試
   - 自動化部署
   - 藍綠部署

---

## 📚 相關文件

- [SECURITY.md](./SECURITY.md) - 安全性指南
- [README.md](./README.md) - 專案說明
- [QUICK_START.md](./QUICK_START.md) - 快速開始指南

---

## 🙋 常見問題

### Q1: 為什麼重新啟動 Docker 後資料不見了？
**A:** 使用 `docker compose down -v` 會刪除 volumes，包括資料庫資料。如果要保留資料，使用：
```bash
docker compose down
docker compose up -d
```

### Q2: 如何測試密碼是否正確？
**A:** 你可以在 Docker 容器中使用 bcrypt 驗證：
```bash
docker compose exec backend node -e "
const bcrypt = require('bcryptjs');
bcrypt.compare('Admin123!@#', '\$2a\$10\$wwxHp.aoqFbZqrkyqw32VO8NU00MyjY7DxNDhWexgMZRS2CYfAi86')
  .then(result => console.log('密碼正確:', result));
"
```

### Q3: 日誌檔案太大怎麼辦？
**A:** Winston 已經設定自動輪換（每個檔案最大 5MB，保留 5 個檔案）。如果需要調整，修改 `backend/src/config/logger.js`:
```javascript
maxsize: 10485760,  // 10MB
maxFiles: 10,       // 保留 10 個
```

---

**修復完成！** 🎉

所有變更已推送到分支：`claude/database-schema-setup-0133ZyFeWM98XMnvPyZLwPAK`
