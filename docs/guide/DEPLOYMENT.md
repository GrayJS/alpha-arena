# Alpha Arena · A股版 - 部署指南

本文档说明如何部署 Alpha Arena 项目到生产环境。

---

## 📋 部署前准备

### 环境要求

- **Node.js**: >= 18.0.0
- **PostgreSQL**: >= 14.0
- **操作系统**: Windows / Linux / macOS
- **内存**: >= 2GB
- **磁盘**: >= 5GB

### 检查环境

```bash
# 检查 Node.js 版本
node -v

# 检查 npm 版本
npm -v

# 检查 PostgreSQL 版本
psql --version
```

---

## 🔧 开发环境部署

### 1. 克隆项目

```bash
git clone <repository-url>
cd stockAnalysis
```

### 2. 安装依赖

```bash
# 安装根目录依赖
npm install

# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

### 3. 配置数据库

#### 创建数据库

```sql
-- 使用 PostgreSQL 客户端
CREATE DATABASE alpha_arena;

-- 检查数据库
\l
```

#### 配置环境变量

```bash
# 在 backend 目录下
Copy-Item env.example .env

# 编辑 .env 文件
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=alpha_arena
# DB_USER=postgres
# DB_PASSWORD=你的密码
```

### 4. 启动项目

```bash
# 回到根目录
cd ..

# 启动开发服务器（同时启动前后端）
npm run dev

# 或分别启动
npm run dev:backend   # 后端 http://localhost:3000
npm run dev:frontend  # 前端 http://localhost:5173
```

### 5. 验证安装

访问以下地址验证：
- 健康检查: http://localhost:3000/health
- 前端应用: http://localhost:5173
- API 测试: http://localhost:3000/api/models

---

## 🚀 生产环境部署

### 方案1: 传统部署

#### 1. 构建项目

```bash
# 构建后端
cd backend
npm run build

# 构建前端
cd ../frontend
npm run build
```

#### 2. 配置生产环境

**backend/.env**:
```env
NODE_ENV=production
PORT=3000

DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=alpha_arena
DB_USER=your-username
DB_PASSWORD=your-password

JWT_SECRET=your-secret-key
CORS_ORIGIN=https://your-domain.com
```

#### 3. 启动后端服务

```bash
cd backend
NODE_ENV=production npm start
```

#### 4. 部署前端

使用 Nginx 或其他 Web 服务器：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /path/to/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

### 方案2: Docker 部署

#### Dockerfile (后端)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

#### Dockerfile (前端)

```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: alpha_arena
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    environment:
      NODE_ENV: production
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: alpha_arena
      DB_USER: postgres
      DB_PASSWORD: postgres
    ports:
      - "3000:3000"
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

#### 启动 Docker 容器

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

---

### 方案3: 云平台部署

#### Vercel / Netlify (前端)

1. 连接 GitHub 仓库
2. 设置构建命令：`npm run build`
3. 设置输出目录：`dist`
4. 配置环境变量

#### Railway / Render (后端)

1. 连接 GitHub 仓库
2. 添加 PostgreSQL 数据库
3. 配置环境变量
4. 设置启动命令：`npm start`

---

## 📊 数据库迁移

### 开发环境

```bash
# 数据库自动同步
npm run dev

# 生成数据迁移文件
cd backend
npx sequelize-cli migration:generate --name migration-name
```

### 生产环境

```bash
# 运行迁移
cd backend
npm run db:migrate

# 回滚迁移
npx sequelize-cli db:migrate:undo
```

---

## 🔍 监控和日志

### 应用监控

```bash
# PM2 进程管理
npm install -g pm2

# 启动应用
pm2 start backend/dist/index.js

# 查看状态
pm2 status

# 查看日志
pm2 logs
```

### 日志配置

日志文件位置：
- `backend/logs/error.log` - 错误日志
- `backend/logs/combined.log` - 所有日志

---

## 🔒 安全配置

### 1. 环境变量保护

```bash
# 不要提交 .env 文件
echo ".env" >> .gitignore
```

### 2. HTTPS 配置

```nginx
server {
    listen 443 ssl;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # ... 其他配置
}
```

### 3. 防火墙配置

```bash
# 只开放必要端口
ufw allow 80
ufw allow 443
ufw allow 5432  # 仅限内网访问
ufw enable
```

---

## 📈 性能优化

### 1. 数据库优化

```sql
-- 创建索引
CREATE INDEX idx_trades_model_date ON trades(model_id, date);
CREATE INDEX idx_accounts_model_date ON accounts(model_id, date);
```

### 2. 缓存配置

```typescript
// 使用 Redis 缓存
import { createClient } from 'redis';

const redisClient = createClient({
  url: 'redis://localhost:6379'
});
```

### 3. CDN 配置

使用 CDN 加速静态资源加载。

---

## 🐛 故障排查

### 常见问题

#### 1. 数据库连接失败

```bash
# 检查 PostgreSQL 服务
sudo systemctl status postgresql

# 检查连接
psql -U postgres -d alpha_arena
```

#### 2. 端口被占用

```bash
# 查找占用端口的进程
netstat -ano | findstr :3000

# Windows
taskkill /PID <PID> /F
```

#### 3. 内存不足

```bash
# 检查内存使用
free -h

# 增加 Node.js 内存限制
node --max-old-space-size=4096 dist/index.js
```

---

## 📝 维护建议

### 定期维护

1. **日志清理**: 定期清理旧日志文件
2. **数据备份**: 定期备份数据库
3. **更新依赖**: 定期更新 npm 包
4. **性能监控**: 监控应用性能

### 备份脚本

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d)
pg_dump -U postgres alpha_arena > backup_$DATE.sql
```

---

## ✅ 部署检查清单

- [ ] 环境变量已配置
- [ ] 数据库已创建
- [ ] 依赖已安装
- [ ] 项目已构建
- [ ] 防火墙已配置
- [ ] HTTPS 已配置
- [ ] 日志已配置
- [ ] 监控已设置
- [ ] 备份计划已制定

---

## 📞 获取帮助

遇到问题？

1. 查看日志文件
2. 检查文档
3. 提交 Issue
4. 联系维护者

---

**部署完成后，记得更新域名和 DNS 设置！**


