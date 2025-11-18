# 🚀 Azure + Docker 部署指南

本指南將協助您使用 Azure Database for MySQL 和 Docker 部署教師排班系統。

## 📋 目錄

1. [前置需求](#前置需求)
2. [Azure 資料庫設定](#azure-資料庫設定)
3. [環境配置](#環境配置)
4. [Docker 部署](#docker-部署)
5. [測試與驗證](#測試與驗證)
6. [疑難排解](#疑難排解)

---

## 前置需求

### 必要工具

- Docker & Docker Compose
- Azure 帳號（免費試用或付費）
- Node.js 18+ (本機測試用)

### Azure CLI 安裝（可選）

```bash
# macOS
brew install azure-cli

# Ubuntu/Debian
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Windows
# 下載安裝程式: https://aka.ms/installazurecliwindows
```

---

## Azure 資料庫設定

### 步驟 1: 建立 MySQL 資料庫

#### 使用 Azure Portal (圖形化介面)

1. 前往 [Azure Portal](https://portal.azure.com)
2. 搜尋「Azure Database for MySQL」
3. 點選「建立」→ 選擇「彈性伺服器」
4. 填寫設定：

```
資源群組：teacher-roster-rg (新建)
伺服器名稱：teacher-roster-mysql
區域：East Asia (香港) 或 Southeast Asia (新加坡)
MySQL 版本：8.0
計算+儲存：Burstable B1ms (1 vCore, 2GiB RAM)
管理員帳號：roster_admin
密碼：[設定強密碼並記錄]
```

5. 點選「網路」標籤：
   - 選擇「公用存取」
   - 勾選「允許從 Azure 內的任何 Azure 服務存取此伺服器」

6. 點選「檢閱 + 建立」→「建立」

#### 使用 Azure CLI (命令列)

```bash
# 登入 Azure
az login

# 建立資源群組
az group create \
  --name teacher-roster-rg \
  --location eastasia

# 建立 MySQL 伺服器
az mysql flexible-server create \
  --resource-group teacher-roster-rg \
  --name teacher-roster-mysql \
  --location eastasia \
  --admin-user roster_admin \
  --admin-password 'YourStrongPassword123!@#' \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --version 8.0.21 \
  --storage-size 32 \
  --backup-retention 7 \
  --public-access 0.0.0.0-255.255.255.255

# 建立資料庫
az mysql flexible-server db create \
  --resource-group teacher-roster-rg \
  --server-name teacher-roster-mysql \
  --database-name teacher_roster
```

### 步驟 2: 設定防火牆規則

```bash
# 允許您的 IP 連線
az mysql flexible-server firewall-rule create \
  --resource-group teacher-roster-rg \
  --name teacher-roster-mysql \
  --rule-name AllowMyIP \
  --start-ip-address YOUR_IP \
  --end-ip-address YOUR_IP

# 取得您的 IP
curl ifconfig.me
```

---

## 環境配置

### 步驟 1: 更新 .env 檔案

編輯 `.env` 檔案，填寫您的 Azure 資料庫資訊：

```bash
# Azure Database for MySQL 設定
DB_HOST=teacher-roster-mysql.mysql.database.azure.com  # 替換為您的伺服器名稱
DB_PORT=3306
DB_NAME=teacher_roster
DB_USER=roster_admin
DB_PASSWORD=YourStrongPassword123!@#  # 替換為您設定的密碼

# Azure SSL 連線
DB_SSL_MODE=REQUIRED
DB_SSL_CA=/app/azure-mysql-ca.pem

# 後端設定
NODE_ENV=production
PORT=3001

# 生成 JWT 密鑰
# 執行: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=請替換為隨機生成的密鑰
JWT_EXPIRES_IN=7d
SESSION_SECRET=請替換為隨機生成的密鑰

# 前端設定
VITE_API_URL=http://localhost:3001/api

# CORS
CORS_ORIGIN=http://localhost:5173
```

### 步驟 2: 生成安全密鑰

```bash
# 生成 JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# 生成 SESSION_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# 將生成的密鑰複製到 .env 檔案
```

### 步驟 3: 初始化資料庫

```bash
# 使用 mysql 命令列工具連線到 Azure 資料庫
mysql -h teacher-roster-mysql.mysql.database.azure.com \
      -u roster_admin \
      -p \
      --ssl-mode=REQUIRED \
      teacher_roster < database/init/01_schema.sql

# 匯入測試資料（可選）
mysql -h teacher-roster-mysql.mysql.database.azure.com \
      -u roster_admin \
      -p \
      --ssl-mode=REQUIRED \
      teacher_roster < database/init/02_seed_data.sql
```

---

## Docker 部署

### 步驟 1: 測試連線

```bash
# 執行連線測試
node test-azure-connection.js
```

預期輸出：

```
============================================================
🔵 Azure Database for MySQL 連線測試
============================================================
✅ 連線成功！
📊 資料庫資訊:
   MySQL 版本: 8.0.21
   主機名稱: teacher-roster-mysql
   SSL 加密: 已啟用
============================================================
```

### 步驟 2: 啟動 Docker 容器

```bash
# 使用 Azure 版本的 docker-compose
docker-compose -f docker-compose.azure.yml up -d

# 查看日誌
docker-compose -f docker-compose.azure.yml logs -f backend
```

預期輸出：

```
✅ SSL 憑證已載入，將使用加密連線
✅ 資料庫連線成功 {
  host: 'teacher-roster-mysql.mysql.database.azure.com',
  database: 'teacher_roster',
  version: '8.0.21',
  ssl: '已啟用'
}
============================================================
🚀 伺服器已啟動
📍 環境: production
🌐 端口: 3001
============================================================
```

### 步驟 3: 驗證服務

```bash
# 健康檢查
curl http://localhost:3001/health

# 預期回應
{
  "status": "ok",
  "timestamp": "2025-01-18T...",
  "environment": "production",
  "database": "connected"
}
```

---

## 測試與驗證

### API 測試

```bash
# 健康檢查
curl http://localhost:3001/health

# API 根端點
curl http://localhost:3001/api

# 如果有設定測試用戶，可以測試登入
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "Admin123!@#"
  }'
```

### Docker 容器管理

```bash
# 查看運行中的容器
docker-compose -f docker-compose.azure.yml ps

# 查看日誌
docker-compose -f docker-compose.azure.yml logs -f

# 重新啟動服務
docker-compose -f docker-compose.azure.yml restart backend

# 停止服務
docker-compose -f docker-compose.azure.yml down

# 停止並移除所有資料
docker-compose -f docker-compose.azure.yml down -v
```

---

## 疑難排解

### 問題 1: 連線逾時

**症狀**: `Connection timeout` 或 `ETIMEDOUT`

**解決方案**:

```bash
# 1. 檢查防火牆規則
az mysql flexible-server firewall-rule list \
  --resource-group teacher-roster-rg \
  --name teacher-roster-mysql

# 2. 確認您的 IP
curl ifconfig.me

# 3. 新增防火牆規則
az mysql flexible-server firewall-rule create \
  --resource-group teacher-roster-rg \
  --name teacher-roster-mysql \
  --rule-name AllowMyNewIP \
  --start-ip-address YOUR_IP \
  --end-ip-address YOUR_IP
```

### 問題 2: SSL 連線錯誤

**症狀**: `SSL connection error`

**解決方案**:

```bash
# 檢查 SSL 憑證
ls -lh backend/azure-mysql-ca.pem

# 重新下載憑證
# 憑證已內建在專案中，無需重新下載
# 如需驗證，可檢查檔案內容是否以 -----BEGIN CERTIFICATE----- 開始
```

### 問題 3: 資料庫不存在

**症狀**: `Unknown database 'teacher_roster'`

**解決方案**:

```bash
# 手動建立資料庫
mysql -h teacher-roster-mysql.mysql.database.azure.com \
      -u roster_admin \
      -p \
      --ssl-mode=REQUIRED \
      -e "CREATE DATABASE IF NOT EXISTS teacher_roster CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### 問題 4: Docker 容器無法啟動

**症狀**: 容器啟動後立即退出

**解決方案**:

```bash
# 1. 檢查 .env 檔案是否正確配置
cat .env

# 2. 檢查 Docker 日誌
docker-compose -f docker-compose.azure.yml logs backend

# 3. 測試資料庫連線
node test-azure-connection.js

# 4. 重新建置映像
docker-compose -f docker-compose.azure.yml build --no-cache
docker-compose -f docker-compose.azure.yml up -d
```

---

## 成本估算

### 開發/測試環境

**Burstable B1ms**
- 1 vCore, 2 GiB RAM
- 32 GB 儲存空間
- 費用：約 NT$1,500-2,000/月

### 生產環境（小型）

**General Purpose D2ds_v4**
- 2 vCore, 8 GiB RAM
- 128 GB 儲存空間
- 費用：約 NT$5,000-7,000/月

### 節省成本技巧

1. **保留容量定價**: 預付 1-3 年可省 40-65%
2. **自動關機**: 開發環境非工作時間關閉
3. **監控使用率**: 定期檢查並調整規格

---

## 下一步

✅ **已完成**:
- Azure MySQL 資料庫設定
- Docker 環境配置
- 基本 API 建立

📝 **建議後續步驟**:
1. 開發完整的 API 端點
2. 建立前端應用
3. 設定 CI/CD 流程
4. 配置 Azure Monitor 監控
5. 啟用自動備份與還原測試

---

## 相關文件

- [AZURE_SETUP.md](./AZURE_SETUP.md) - Azure 詳細設定指南
- [SWITCH_TO_AZURE.md](./SWITCH_TO_AZURE.md) - 從本地遷移到 Azure
- [Azure MySQL 文件](https://docs.microsoft.com/azure/mysql/)
- [Docker Compose 文件](https://docs.docker.com/compose/)

---

**需要協助？** 請參考疑難排解章節或查看相關文件。
