# 📘 教師排班管理系統 - 網站開發細節書

**版本：** 2.0 (Azure + Docker 版本)
**最後更新：** 2025-11-18
**專案代號：** Teacher Roster Management System

---

## 📋 目錄

1. [專案概述](#專案概述)
2. [技術架構](#技術架構)
3. [系統需求](#系統需求)
4. [功能清單](#功能清單)
5. [資料庫設計](#資料庫設計)
6. [API 規格](#api-規格)
7. [前端設計](#前端設計)
8. [部署架構](#部署架構)
9. [開發環境設置](#開發環境設置)
10. [測試計劃](#測試計劃)
11. [安全性設計](#安全性設計)
12. [效能優化](#效能優化)
13. [維護與監控](#維護與監控)

---

## 📖 專案概述

### 專案背景

本專案為海事教師排班管理系統，從原本的 Google Apps Script + Google Sheets 架構升級為專業的三層式 Web 應用程式。

### 專案目標

1. ✅ 提供穩定、可擴展的教師排班管理功能
2. ✅ 支援多種課程類型（線上、線下、混合）
3. ✅ 實現自動化部署流程
4. ✅ 提供完整的權限管理機制
5. ✅ 確保資料安全與備份

### 架構升級對照

| 項目 | 舊架構 (v1.0) | 新架構 (v2.0) |
|------|---------------|---------------|
| **前端** | 純 HTML + localStorage | React + TypeScript (規劃中) / 靜態 HTML |
| **後端** | Google Apps Script | Node.js 18 + Express |
| **資料庫** | Google Sheets | Azure Database for MySQL 8.0 |
| **認證** | 硬編碼 Token | JWT + bcrypt |
| **部署** | 手動更新 | GitHub Actions + Docker |
| **監控** | 無 | Azure Monitor (可選) |
| **成本** | 免費 | 約 NT$2,000-3,000/月 |

---

## 🏗️ 技術架構

### 整體架構圖

```
┌─────────────────────────────────────────────────────┐
│                    使用者                            │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│              前端層 (Frontend)                       │
│  ┌──────────────────────────────────────────────┐  │
│  │  HTML5 + CSS3 + JavaScript                   │  │
│  │  (或 React + TypeScript - 規劃中)            │  │
│  └──────────────────────────────────────────────┘  │
└────────────────┬────────────────────────────────────┘
                 │ HTTPS / REST API
                 ▼
┌─────────────────────────────────────────────────────┐
│              應用層 (Backend API)                    │
│  ┌──────────────────────────────────────────────┐  │
│  │  Node.js 18 + Express.js                     │  │
│  │  • 路由控制 (Routing)                        │  │
│  │  • 業務邏輯 (Business Logic)                 │  │
│  │  • 認證授權 (JWT)                            │  │
│  │  • 資料驗證 (Validation)                     │  │
│  └──────────────────────────────────────────────┘  │
└────────────────┬────────────────────────────────────┘
                 │ MySQL Protocol (SSL)
                 ▼
┌─────────────────────────────────────────────────────┐
│              資料層 (Database)                       │
│  ┌──────────────────────────────────────────────┐  │
│  │  Azure Database for MySQL 8.0                │  │
│  │  • 教師資料                                   │  │
│  │  • 課程資料                                   │  │
│  │  • 排班資料                                   │  │
│  │  • 使用者權限                                 │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### 技術堆疊 (Tech Stack)

#### 前端技術

| 技術 | 版本 | 用途 |
|------|------|------|
| HTML5 | - | 頁面結構 |
| CSS3 | - | 樣式設計 |
| JavaScript | ES6+ | 前端邏輯 |
| React (規劃) | 18+ | 框架 |
| TypeScript (規劃) | 5+ | 型別安全 |

#### 後端技術

| 技術 | 版本 | 用途 |
|------|------|------|
| Node.js | 18 LTS | 執行環境 |
| Express.js | 4.18+ | Web 框架 |
| mysql2 | 3.6+ | MySQL 驅動 |
| bcryptjs | 2.4+ | 密碼加密 |
| jsonwebtoken | 9.0+ | JWT 認證 |
| express-validator | 7.0+ | 輸入驗證 |
| helmet | 7.0+ | 安全標頭 |
| cors | 2.8+ | 跨域處理 |
| express-rate-limit | 7.0+ | 請求限流 |
| morgan | 1.10+ | 日誌記錄 |
| winston | 3.10+ | 進階日誌 |
| dotenv | 16.3+ | 環境變數 |

#### 資料庫技術

| 技術 | 版本 | 用途 |
|------|------|------|
| MySQL | 8.0 | 關聯式資料庫 |
| Azure Database for MySQL | Flexible Server | 託管服務 |

#### DevOps 技術

| 技術 | 版本 | 用途 |
|------|------|------|
| Docker | 24+ | 容器化 |
| Docker Compose | 2.0+ | 多容器編排 |
| GitHub Actions | - | CI/CD |
| Docker Hub | - | 映像檔倉庫 |
| Azure Container Instances | - | 容器託管 (可選) |

---

## 💻 系統需求

### 開發環境需求

**必要工具：**
- Node.js 18.0.0 或更高版本
- Docker Desktop 24.0.0 或更高版本
- Git 2.30.0 或更高版本
- 文字編輯器 (推薦 VS Code)

**推薦工具：**
- Postman 或 Insomnia (API 測試)
- MySQL Workbench (資料庫管理)
- Azure CLI (Azure 部署)

### 生產環境需求

**基礎設施：**
- Azure 訂閱帳戶
- Docker Hub 帳戶
- GitHub 帳戶

**最低配置：**
- CPU: 1 vCore
- 記憶體: 1.5 GB
- 儲存空間: 10 GB
- 網路: 穩定的網際網路連線

**建議配置：**
- CPU: 2 vCore
- 記憶體: 4 GB
- 儲存空間: 50 GB
- 資料庫: Azure MySQL Flexible Server (Basic 層級)

### 瀏覽器支援

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- 不支援 IE 11

---

## 🎯 功能清單

### 核心功能模組

#### 1. 使用者認證與授權

**功能項目：**
- ✅ 使用者註冊
- ✅ 使用者登入
- ✅ 使用者登出
- ✅ JWT Token 驗證
- ✅ Token 自動刷新
- ✅ 密碼加密儲存 (bcrypt)
- ✅ 角色權限管理 (RBAC)

**角色定義：**
- `admin` - 系統管理員（完整權限）
- `manager` - 排班管理員（管理權限）
- `teacher` - 教師（基本權限）
- `viewer` - 觀察者（唯讀權限）

#### 2. 教師管理

**功能項目：**
- ✅ 新增教師資料
- ✅ 查詢教師資料
- ✅ 更新教師資料
- ✅ 刪除教師資料
- ✅ 批次匯入教師
- ✅ 教師照片上傳
- ✅ 經歷管理
- ✅ 證照管理
- ✅ 專長標籤

**資料欄位：**
- 基本資訊：姓名、員工編號、部門
- 聯絡資訊：電話、Email
- 專業資訊：教學科目、證照、經歷
- 狀態：在職/離職

#### 3. 課程管理

**功能項目：**
- ✅ 新增課程
- ✅ 查詢課程
- ✅ 更新課程
- ✅ 刪除課程
- ✅ 課程分類
- ✅ 授課方式設定

**課程類型：**
- 海事專業課程
- 一般學科課程
- 技能訓練課程

**授課方式：**
- 線上課程 (Online)
- 實體課程 (Offline)
- 混合課程 (Hybrid)

#### 4. 排班管理

**功能項目：**
- ✅ 建立排班
- ✅ 查詢排班
- ✅ 更新排班
- ✅ 刪除排班
- ✅ 衝堂檢查
- ✅ 月度統計
- ✅ 時數計算
- ✅ 排班狀態管理

**排班狀態：**
- `scheduled` - 已排定
- `confirmed` - 已確認
- `cancelled` - 已取消

**時段類型：**
- `morning` - 上午
- `afternoon` - 下午
- `evening` - 晚上
- `full_day` - 全天

#### 5. 問卷系統 (規劃中)

**功能項目：**
- 🚧 問卷範本管理
- 🚧 問卷發送
- 🚧 問卷回收
- 🚧 問卷統計

#### 6. 操作日誌

**功能項目：**
- ✅ 所有操作自動記錄
- ✅ IP 位址追蹤
- ✅ User Agent 記錄
- ✅ 操作內容 JSON 儲存
- ✅ 日誌查詢與匯出

**記錄項目：**
- 使用者 ID
- 操作類型 (CREATE/UPDATE/DELETE)
- 目標資源
- 操作時間
- IP 位址
- 詳細內容

---

## 🗄️ 資料庫設計

### ER 圖 (Entity-Relationship Diagram)

```
┌──────────────┐         ┌──────────────┐
│    users     │────────▶│   teachers   │
│              │ 1     0..1│              │
│ • id (PK)    │         │ • id (PK)    │
│ • username   │         │ • user_id(FK)│
│ • password   │         │ • name       │
│ • email      │         │ • employee_id│
│ • role       │         │ • department │
└──────────────┘         └───────┬──────┘
                                 │
                                 │ 1
                                 │
                                 │ N
                         ┌───────▼──────┐
                         │  schedules   │
                         │              │
                         │ • id (PK)    │
                         │ • teacher_id │
                         │ • date       │
                         │ • shift_type │
                         │ • status     │
                         └──────────────┘

┌──────────────┐         ┌──────────────────┐
│   courses    │────────▶│ course_assign... │
│              │ 1     N │                  │
│ • id (PK)    │         │ • id (PK)        │
│ • course_code│         │ • course_id (FK) │
│ • course_name│         │ • teacher_id(FK) │
│ • description│         │ • semester       │
└──────────────┘         │ • year           │
                         └──────────────────┘
```

### 資料表結構

#### 1. users（使用者表）

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  role ENUM('admin', 'manager', 'teacher', 'viewer') DEFAULT 'teacher',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**欄位說明：**
- `id`: 主鍵，自動遞增
- `username`: 使用者名稱，唯一
- `password`: bcrypt 加密後的密碼
- `email`: 電子郵件，唯一
- `role`: 角色（admin/manager/teacher/viewer）
- `is_active`: 帳號是否啟用
- `created_at`: 建立時間
- `updated_at`: 更新時間

#### 2. teachers（教師表）

```sql
CREATE TABLE teachers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  name VARCHAR(100) NOT NULL,
  employee_id VARCHAR(50) UNIQUE,
  department VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_name (name),
  INDEX idx_employee_id (employee_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**欄位說明：**
- `id`: 主鍵，自動遞增
- `user_id`: 關聯的使用者 ID（外鍵）
- `name`: 教師姓名
- `employee_id`: 員工編號，唯一
- `department`: 部門
- `phone`: 電話
- `email`: 電子郵件
- `is_active`: 是否在職

#### 3. schedules（排班表）

```sql
CREATE TABLE schedules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  teacher_id INT NOT NULL,
  date DATE NOT NULL,
  shift_type ENUM('morning', 'afternoon', 'evening', 'full_day') NOT NULL,
  status ENUM('scheduled', 'confirmed', 'cancelled') DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
  INDEX idx_date (date),
  INDEX idx_teacher_date (teacher_id, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**欄位說明：**
- `id`: 主鍵，自動遞增
- `teacher_id`: 教師 ID（外鍵）
- `date`: 排班日期
- `shift_type`: 班別（上午/下午/晚上/全天）
- `status`: 狀態（已排定/已確認/已取消）
- `notes`: 備註

#### 4. courses（課程表）

```sql
CREATE TABLE courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_code VARCHAR(20) NOT NULL UNIQUE,
  course_name VARCHAR(200) NOT NULL,
  description TEXT,
  credits INT DEFAULT 3,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_course_code (course_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**欄位說明：**
- `id`: 主鍵，自動遞增
- `course_code`: 課程代碼，唯一
- `course_name`: 課程名稱
- `description`: 課程描述
- `credits`: 學分數
- `is_active`: 是否啟用

#### 5. course_assignments（課程分配表）

```sql
CREATE TABLE course_assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  teacher_id INT NOT NULL,
  semester VARCHAR(20) NOT NULL,
  year INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
  INDEX idx_semester_year (semester, year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**欄位說明：**
- `id`: 主鍵，自動遞增
- `course_id`: 課程 ID（外鍵）
- `teacher_id`: 教師 ID（外鍵）
- `semester`: 學期（上學期/下學期）
- `year`: 學年度

### 索引策略

**主要索引：**
- 所有表的主鍵 (PRIMARY KEY)
- 唯一約束欄位 (UNIQUE)

**查詢優化索引：**
- `users.username` - 登入查詢
- `teachers.employee_id` - 員工編號查詢
- `schedules.date` - 日期範圍查詢
- `schedules.teacher_id, date` - 複合索引（教師排班查詢）
- `courses.course_code` - 課程代碼查詢

---

## 🔌 API 規格

### API 基本資訊

**Base URL:**
```
開發環境: http://localhost:3001/api
正式環境: https://your-domain.com/api
```

**認證方式:**
```
Authorization: Bearer {JWT_TOKEN}
```

**回應格式:**
```json
{
  "success": true,
  "data": { ... },
  "message": "操作成功"
}
```

**錯誤格式:**
```json
{
  "success": false,
  "error": "錯誤訊息",
  "code": "ERROR_CODE"
}
```

### API 端點清單

#### 認證 API

**1. 使用者登入**
```
POST /api/auth/login
Content-Type: application/json

Request:
{
  "username": "admin",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "role": "admin"
    }
  }
}
```

**2. 使用者註冊**
```
POST /api/auth/register
Content-Type: application/json

Request:
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "password123",
  "role": "teacher"
}

Response:
{
  "success": true,
  "data": {
    "id": 2,
    "username": "newuser",
    "email": "user@example.com"
  }
}
```

#### 教師管理 API

**1. 取得所有教師**
```
GET /api/teachers
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "張老師",
      "employee_id": "T001",
      "department": "數學系",
      "phone": "0912-345-678",
      "email": "zhang@example.com",
      "is_active": true
    }
  ]
}
```

**2. 取得單一教師**
```
GET /api/teachers/:id
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "name": "張老師",
    "employee_id": "T001",
    "department": "數學系",
    "phone": "0912-345-678",
    "email": "zhang@example.com"
  }
}
```

**3. 新增教師**
```
POST /api/teachers
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "name": "李老師",
  "employee_id": "T002",
  "department": "英文系",
  "phone": "0923-456-789",
  "email": "li@example.com"
}

Response:
{
  "success": true,
  "data": {
    "id": 2,
    "name": "李老師",
    ...
  }
}
```

**4. 更新教師**
```
PUT /api/teachers/:id
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "phone": "0912-999-888"
}

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "phone": "0912-999-888",
    ...
  }
}
```

**5. 刪除教師**
```
DELETE /api/teachers/:id
Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "教師已刪除"
}
```

#### 排班管理 API

**1. 取得排班列表**
```
GET /api/schedules?date=2025-01-01&teacher_id=1
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "teacher_id": 1,
      "teacher_name": "張老師",
      "date": "2025-01-01",
      "shift_type": "morning",
      "status": "confirmed",
      "notes": "備註"
    }
  ]
}
```

**2. 建立排班**
```
POST /api/schedules
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "teacher_id": 1,
  "date": "2025-01-02",
  "shift_type": "afternoon",
  "notes": "測試排班"
}

Response:
{
  "success": true,
  "data": {
    "id": 2,
    "teacher_id": 1,
    "date": "2025-01-02",
    "shift_type": "afternoon",
    "status": "scheduled"
  }
}
```

**3. 更新排班**
```
PUT /api/schedules/:id
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "status": "confirmed"
}

Response:
{
  "success": true,
  "data": { ... }
}
```

**4. 刪除排班**
```
DELETE /api/schedules/:id
Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "排班已刪除"
}
```

### HTTP 狀態碼

| 狀態碼 | 說明 |
|--------|------|
| 200 | 請求成功 |
| 201 | 資源已建立 |
| 400 | 錯誤的請求 |
| 401 | 未授權 |
| 403 | 禁止訪問 |
| 404 | 資源不存在 |
| 409 | 資源衝突 |
| 500 | 伺服器錯誤 |

### 錯誤代碼

| 代碼 | 說明 |
|------|------|
| AUTH_FAILED | 認證失敗 |
| INVALID_TOKEN | 無效的 Token |
| TOKEN_EXPIRED | Token 已過期 |
| PERMISSION_DENIED | 權限不足 |
| VALIDATION_ERROR | 驗證錯誤 |
| RESOURCE_NOT_FOUND | 資源不存在 |
| DUPLICATE_ENTRY | 資料重複 |

---

## 🎨 前端設計

### 頁面結構

#### 1. 首頁 (index.html)
- 系統登入
- 角色選擇
- 系統公告

#### 2. 教師管理 (teacher-management.html)
- 教師列表
- 新增/編輯教師
- 刪除教師
- 搜尋/篩選

#### 3. 課程管理 (course-management.html)
- 課程列表
- 新增/編輯課程
- 課程分類

#### 4. 海事課程 (maritime-courses.html)
- 專業課程管理
- 證照課程管理

#### 5. 問卷管理 (survey-management.html)
- 問卷範本
- 問卷發送
- 統計分析

#### 6. 問卷填寫 (survey-form.html)
- 問卷填寫介面
- 提交確認

### UI/UX 設計原則

**設計目標：**
- 簡潔易用
- 響應式設計
- 無障礙支援

**配色方案：**
- 主色：#2196F3（藍色）
- 輔色：#4CAF50（綠色）
- 警告色：#FF9800（橙色）
- 錯誤色：#F44336（紅色）

**字體：**
- 中文：Microsoft JhengHei, PingFang TC
- 英文：Roboto, Arial

---

## 🚀 部署架構

### 部署流程圖

```
開發者推送代碼
    ↓
GitHub Repository
    ↓
GitHub Actions 觸發
    ↓
構建 Docker 映像檔
    ↓
推送到 Docker Hub
    ↓
部署到 Azure Container Instances (可選)
    ↓
連接 Azure Database for MySQL
    ↓
網站上線
```

### 環境配置

#### 開發環境 (Development)
```yaml
環境: Local Docker
資料庫: 本地 MySQL 或 Azure
域名: localhost:3001
SSL: 否
```

#### 測試環境 (Staging)
```yaml
環境: Azure Container Instances
資料庫: Azure MySQL (Basic)
域名: staging.your-domain.com
SSL: 是
```

#### 正式環境 (Production)
```yaml
環境: Azure Container Instances / App Service
資料庫: Azure MySQL (General Purpose)
域名: your-domain.com
SSL: 是
備份: 每日自動備份
監控: Azure Monitor
```

### Docker 配置

**Dockerfile 重點：**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
EXPOSE 3001
CMD ["node", "src/index.js"]
```

**docker-compose.azure.yml:**
```yaml
services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    env_file:
      - .env
    volumes:
      - ./backend/azure-mysql-ca.pem:/app/azure-mysql-ca.pem:ro
```

### GitHub Actions CI/CD

**觸發條件：**
- 推送到 `main` 分支
- 推送到 `claude/migrate-azure-docs-*` 分支
- 手動觸發

**執行步驟：**
1. 檢出代碼
2. 驗證配置
3. 登入 Docker Hub
4. 構建 Docker 映像檔
5. 推送到 Docker Hub
6. (可選) 部署到 Azure

---

## 🛠️ 開發環境設置

### 快速開始

**1. 克隆專案**
```bash
git clone https://github.com/Hsuanx14/1.git
cd 1
```

**2. 安裝依賴**
```bash
cd backend
npm install
```

**3. 配置環境變數**
```bash
cp .env.example .env
# 編輯 .env 填入您的設定
```

**4. 初始化資料庫**
```bash
mysql -h your-db-host -u your-user -p < database/init/01_schema.sql
mysql -h your-db-host -u your-user -p < database/init/02_seed_data.sql
```

**5. 啟動開發伺服器**
```bash
npm run dev
```

### 使用 Docker 開發

**1. 構建映像檔**
```bash
docker build -t teacher-roster-backend ./backend
```

**2. 運行容器**
```bash
docker run -d -p 3001:3001 --env-file .env teacher-roster-backend
```

**3. 使用 Docker Compose**
```bash
docker-compose -f docker-compose.azure.yml up -d
```

---

## 🧪 測試計劃

### 測試類型

#### 1. 單元測試 (Unit Testing)
- 測試個別函數
- 使用 Jest 或 Mocha

#### 2. 整合測試 (Integration Testing)
- 測試 API 端點
- 測試資料庫操作

#### 3. 端對端測試 (E2E Testing)
- 測試完整使用者流程
- 使用 Cypress 或 Playwright

### 測試案例

**認證測試：**
- ✓ 使用者可以成功登入
- ✓ 錯誤的密碼會被拒絕
- ✓ Token 過期後需要重新登入

**教師管理測試：**
- ✓ 可以新增教師
- ✓ 可以更新教師資料
- ✓ 不能新增重複的員工編號
- ✓ 刪除教師會同時刪除相關排班

**排班測試：**
- ✓ 可以建立排班
- ✓ 衝堂檢查有效
- ✓ 可以查詢特定日期的排班

---

## 🔒 安全性設計

### 認證與授權

**認證機制：**
- JWT (JSON Web Token)
- Token 有效期: 7 天
- bcrypt 密碼加密 (10 rounds)

**授權機制：**
- 基於角色的存取控制 (RBAC)
- 每個 API 端點驗證權限

### 資料安全

**傳輸安全：**
- HTTPS/TLS 加密
- Azure MySQL SSL 連線

**儲存安全：**
- 密碼 bcrypt 加密
- 敏感資料不記錄到日誌
- 定期資料備份

### 防護措施

**防範攻擊：**
- SQL Injection - 使用參數化查詢
- XSS - 輸入驗證與輸出編碼
- CSRF - Token 驗證
- DDoS - Rate Limiting

**安全標頭：**
```javascript
helmet({
  contentSecurityPolicy: true,
  xssFilter: true,
  noSniff: true,
  referrerPolicy: { policy: 'same-origin' }
})
```

**請求限流：**
```javascript
rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分鐘
  max: 100 // 最多 100 個請求
})
```

---

## ⚡ 效能優化

### 資料庫優化

**索引策略：**
- 主鍵索引
- 外鍵索引
- 常用查詢欄位索引

**查詢優化：**
- 使用連線池 (Connection Pool)
- 避免 N+1 查詢
- 使用適當的 JOIN

### API 優化

**回應優化：**
- 分頁查詢
- 欄位選擇性返回
- 壓縮回應 (gzip)

**快取策略：**
- 靜態資源快取
- API 回應快取 (規劃中)

### 前端優化

**載入優化：**
- 延遲載入 (Lazy Loading)
- 圖片優化
- CSS/JS 壓縮

---

## 📊 維護與監控

### 日誌管理

**日誌類型：**
- 應用日誌 (Application Logs)
- 錯誤日誌 (Error Logs)
- 存取日誌 (Access Logs)
- 操作日誌 (Audit Logs)

**日誌工具：**
- Winston (應用層)
- Morgan (HTTP 請求)

### 監控指標

**系統監控：**
- CPU 使用率
- 記憶體使用率
- 磁碟空間
- 網路流量

**應用監控：**
- API 回應時間
- 錯誤率
- 請求量
- 資料庫連線數

**資料庫監控：**
- 查詢效能
- 連線數
- 慢查詢
- 儲存空間

### 備份策略

**自動備份：**
- Azure MySQL 自動每日備份
- 保留 7-35 天
- 可還原到任意時間點

**手動備份：**
```bash
mysqldump -h host -u user -p database > backup.sql
```

---

## 📈 未來規劃

### 短期目標 (1-3 個月)

- [ ] 完成所有 API 端點
- [ ] 前端 React 重構
- [ ] 完整的測試覆蓋
- [ ] 效能優化

### 中期目標 (3-6 個月)

- [ ] 問卷系統完整實作
- [ ] 行動版 App
- [ ] 進階統計報表
- [ ] Email 通知系統

### 長期目標 (6-12 個月)

- [ ] AI 智慧排班建議
- [ ] 多語言支援
- [ ] 第三方整合
- [ ] 微服務架構

---

## 📞 聯絡資訊

**專案負責人：** [您的名字]
**Email：** [您的 Email]
**GitHub：** https://github.com/Hsuanx14/1
**Docker Hub：** https://hub.docker.com/r/hsuano216/teacher-roster-backend

---

## 📚 參考文件

- [README.md](./README.md) - 專案說明
- [CI_CD_SETUP.md](./CI_CD_SETUP.md) - CI/CD 設置指南
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - 部署指南
- [AZURE_SETUP.md](./AZURE_SETUP.md) - Azure 設置
- [SWITCH_TO_AZURE.md](./SWITCH_TO_AZURE.md) - Azure 遷移指南

---

**文件版本：** 2.0
**最後更新：** 2025-11-18
**維護者：** 開發團隊

---

*此文件包含完整的網站開發細節，包括架構設計、資料庫結構、API 規格、部署流程等所有技術資訊。*
