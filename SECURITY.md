# 🔒 資料安全指南

## 目錄
- [安全性評估](#安全性評估)
- [目前的安全措施](#目前的安全措施)
- [潛在風險與建議](#潛在風險與建議)
- [正式環境部署檢查清單](#正式環境部署檢查清單)
- [密鑰管理最佳實踐](#密鑰管理最佳實踐)

---

## 安全性評估

### ✅ 已做好的安全措施

#### 1. **環境變數保護**
- ✅ `.env` 檔案已被 `.gitignore` 排除
- ✅ 敏感資料不會被提交到 Git
- ✅ 只提交 `.env.example`（範例檔案，無真實密碼）

#### 2. **資料庫安全**
- ✅ 本地開發資料庫與外網隔離
- ✅ 資料庫在 Docker 內部網路運行
- ✅ 支援 SSL/TLS 加密連線（Azure 環境）
- ✅ 使用參數化查詢防止 SQL Injection

#### 3. **應用程式安全**
- ✅ 密碼使用 bcrypt 雜湊加密
- ✅ JWT Token 身份驗證
- ✅ Helmet 安全標頭保護
- ✅ CORS 跨域請求控制
- ✅ Rate Limiting 速率限制（防 DDoS）
- ✅ Input Validation 輸入驗證

#### 4. **Docker 安全**
- ✅ 使用官方基礎映像（node:18-alpine）
- ✅ 生產環境只安裝必要依賴（npm install --omit=dev）
- ✅ 容器健康檢查機制

---

## 潛在風險與建議

### ⚠️ 本地開發環境（目前狀態）

| 項目 | 狀態 | 風險等級 | 說明 |
|------|------|----------|------|
| **資料庫密碼** | 🟡 待改善 | 低 | 目前使用簡單密碼，僅適合本地開發 |
| **JWT Secret** | 🟡 待改善 | 低 | 使用範例密鑰，需手動替換 |
| **資料庫埠號** | 🟢 安全 | 低 | 僅在本機 localhost 監聽 |
| **Docker 網路** | 🟢 安全 | 低 | 使用內部橋接網路，外網無法直接訪問 |

**建議：**
1. 使用提供的腳本生成安全密鑰：
   ```bash
   node scripts/generate-secrets.js
   ```

2. 如果電腦會連接公共 Wi-Fi，建議更改資料庫密碼

---

### 🔴 正式環境部署（重要！）

| 項目 | 要求 | 風險等級 | 說明 |
|------|------|----------|------|
| **JWT Secret** | 🔴 必須 | 高 | 必須使用 64 字元以上的隨機密鑰 |
| **資料庫密碼** | 🔴 必須 | 高 | 至少 16 字元，包含大小寫、數字、特殊符號 |
| **SSL/TLS** | 🔴 必須 | 高 | 資料庫必須啟用 SSL 加密 |
| **HTTPS** | 🔴 必須 | 高 | API 必須使用 HTTPS |
| **防火牆** | 🔴 必須 | 高 | 限制資料庫存取 IP |
| **日誌監控** | 🔴 必須 | 中 | 監控異常登入和 API 請求 |
| **定期備份** | 🔴 必須 | 高 | 自動化資料庫備份 |

---

## 正式環境部署檢查清單

### 1️⃣ **部署前準備**

- [ ] 使用 `node scripts/generate-secrets.js` 生成新密鑰
- [ ] 更新 `.env` 或 Azure 環境變數
- [ ] 確認 `.env` 不在 Git 版本控制中
- [ ] 檢查 `.gitignore` 包含所有敏感檔案

### 2️⃣ **資料庫安全**

- [ ] 資料庫密碼至少 16 字元
- [ ] 啟用 SSL/TLS 加密連線
- [ ] 設定防火牆規則（只允許特定 IP）
- [ ] 停用 root 遠端登入
- [ ] 啟用自動備份（每日）
- [ ] 測試備份恢復流程

### 3️⃣ **應用程式安全**

- [ ] `NODE_ENV=production`
- [ ] JWT_SECRET 使用 64 字元隨機密鑰
- [ ] SESSION_SECRET 使用 64 字元隨機密鑰
- [ ] CORS_ORIGIN 設定為正式域名
- [ ] 啟用 HTTPS（使用 Let's Encrypt 或 Azure SSL）
- [ ] 關閉不必要的 API 端點
- [ ] 限制上傳檔案大小和類型

### 4️⃣ **監控與日誌**

- [ ] 設定錯誤日誌警報
- [ ] 監控異常登入嘗試
- [ ] 設定 API 速率限制監控
- [ ] 定期檢查存取日誌

### 5️⃣ **定期維護**

- [ ] 每 3-6 個月更換 JWT Secret
- [ ] 每季度審查權限設定
- [ ] 定期更新依賴套件：`npm audit`
- [ ] 檢查安全漏洞：`npm audit fix`

---

## 密鑰管理最佳實踐

### 🔐 生成安全密鑰

**方法 1：使用提供的腳本**
```bash
node scripts/generate-secrets.js
```

**方法 2：使用 Node.js**
```bash
# 生成 64 字元 JWT Secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# 生成 32 字元 Session Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**方法 3：使用 OpenSSL**
```bash
openssl rand -hex 64
```

---

### 📁 環境變數分離

**本地開發：**
```
.env                    # 本地密鑰（不提交）
.env.example            # 範例檔案（提交）
```

**正式環境：**
- **Azure**: 使用 Azure App Service 的「應用程式設定」
- **Docker**: 使用環境變數或 Docker Secrets
- **Kubernetes**: 使用 Kubernetes Secrets

---

### 🚨 密鑰洩漏應對措施

**如果 .env 不小心被提交到 Git：**

1. **立即更換所有密鑰**
   ```bash
   node scripts/generate-secrets.js
   ```

2. **從 Git 歷史中移除**
   ```bash
   # ⚠️ 謹慎使用！會改寫 Git 歷史
   git filter-branch --force --index-filter \
     'git rm --cached --ignore-unmatch .env' \
     --prune-empty --tag-name-filter cat -- --all
   ```

3. **強制推送**
   ```bash
   git push --force --all
   ```

4. **通知團隊成員重新拉取**

---

## 常見安全問題 Q&A

### Q1: 我的 .env 檔案會被上傳到 GitHub 嗎？
**A:** ❌ 不會！已被 `.gitignore` 排除。可以用以下指令確認：
```bash
git status
# 如果 .env 出現在列表中，代表有問題
```

### Q2: 本地開發用簡單密碼安全嗎？
**A:** 🟢 可接受。如果只在本機運行且不開放外網存取，風險很低。但建議：
- 定期更新依賴套件
- 不要在公共 Wi-Fi 下運行
- 不要使用正式環境的資料

### Q3: 如何知道密碼是否夠強？
**A:** 強密碼應該：
- ✅ 至少 16 字元（正式環境建議 20+）
- ✅ 包含大小寫字母
- ✅ 包含數字
- ✅ 包含特殊符號 (!@#$%^&*)
- ✅ 不使用字典單字或個人資訊

### Q4: JWT Secret 洩漏會怎樣？
**A:** 🔴 非常嚴重！攻擊者可以：
- 偽造身份令牌
- 冒充任何用戶
- 繞過身份驗證

**應對：** 立即更換 JWT_SECRET 並強制所有用戶重新登入

### Q5: 資料庫備份重要嗎？
**A:** 🔴 極度重要！沒有備份可能導致：
- 硬體故障時資料全失
- 人為誤刪無法恢復
- 勒索軟體攻擊

**建議：**
- 每日自動備份
- 保留至少 30 天的備份
- 定期測試恢復流程

---

## 安全資源

### 📚 進階學習
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Docker Security](https://docs.docker.com/engine/security/)

### 🔧 安全工具
```bash
# 檢查 npm 套件漏洞
npm audit

# 自動修復漏洞
npm audit fix

# 檢查過時套件
npm outdated
```

---

## 聯絡與支援

如果發現安全問題，請：
1. **不要** 在公開 issue 中討論
2. 私下聯繫專案維護者
3. 提供詳細的問題描述和復現步驟

---

**最後更新：** 2025-11-20
**文件版本：** 1.0
