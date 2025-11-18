# =====================================================
# Backend Dockerfile - Node.js + Express
# =====================================================

FROM node:18-alpine

# 安裝必要的系統工具
RUN apk add --no-cache curl

# 設定工作目錄
WORKDIR /app

# 複製 package.json
COPY package*.json ./

# 安裝依賴（使用 npm install 因為沒有 lock 文件）
RUN npm install --omit=dev

# 複製應用程式碼
COPY . .

# 建立必要的目錄
RUN mkdir -p /app/logs /app/uploads

# 暴露端口
EXPOSE 3001

# 健康檢查
HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=40s \
  CMD curl -f http://localhost:3001/health || exit 1

# 啟動應用
CMD ["node", "src/index.js"]
