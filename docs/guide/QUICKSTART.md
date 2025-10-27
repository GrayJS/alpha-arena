# 快速开始指南

本指南将帮助您快速启动 Alpha Arena·A股版 项目。

## 前提条件

- Node.js >= 18
- PostgreSQL >= 14
- npm 或 yarn

## 安装步骤

### 1. 安装项目依赖

```bash
npm run setup
```

这会自动安装前端和后端的所有依赖。

### 2. 配置数据库

#### 2.1 安装 PostgreSQL

如果还没有安装 PostgreSQL：

**Windows:**
```bash
# 下载并安装 PostgreSQL 14+
# https://www.postgresql.org/download/windows/
```

**macOS:**
```bash
brew install postgresql@14
```

**Linux:**
```bash
sudo apt-get install postgresql postgresql-contrib
```

#### 2.2 创建数据库

```bash
# 登录 PostgreSQL
psql -U postgres

# 创建数据库
CREATE DATABASE alpha_arena;

# 退出
\q
```

#### 2.3 配置环境变量

```bash
cd backend
cp .env.example .env
```

编辑 `backend/.env` 文件：

```
# 数据库配置
DB_HOST=localhost
DB_PORT=5432
DB_NAME=alpha_arena
DB_USER=postgres
DB_PASSWORD=your_password
```

### 3. 启动项目

```bash
# 在项目根目录执行
npm run dev
```

这会同时启动前端和后端服务：
- 后端 API：http://localhost:3000
- 前端应用：http://localhost:5173

## 验证安装

### 1. 检查后端服务

访问 http://localhost:3000/health

应该看到：
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 10.123
}
```

### 2. 检查前端应用

访问 http://localhost:5173

应该看到 Alpha Arena 首页。

### 3. 检查数据库连接

查看后端控制台输出，应该看到：
```
数据库连接成功
数据库模型已同步
```

## 常用命令

```bash
# 安装依赖
npm run setup

# 开发模式（前后端同时启动）
npm run dev

# 仅启动后端
npm run dev:backend

# 仅启动前端
npm run dev:frontend

# 构建生产版本
npm run build

# 运行数据库迁移（如果需要）
cd backend
npm run db:migrate
```

## 常见问题

### 问题1：数据库连接失败

**症状：** 启动时提示无法连接到数据库

**解决方案：**
1. 确认 PostgreSQL 服务正在运行
2. 检查 `.env` 文件中的数据库配置
3. 确认数据库是否存在：
   ```bash
   psql -U postgres -l | grep alpha_arena
   ```

### 问题2：端口被占用

**症状：** 启动时提示端口 3000 或 5173 已被占用

**解决方案：**
1. 修改后端端口（`backend/.env`）：
   ```
   PORT=3001
   ```
2. 修改前端端口（`frontend/vite.config.ts`）：
   ```typescript
   server: {
     port: 5174,
     // ...
   }
   ```

### 问题3：依赖安装失败

**症状：** `npm install` 失败

**解决方案：**
1. 清理缓存：
   ```bash
   npm cache clean --force
   ```
2. 删除 node_modules 重新安装：
   ```bash
   rm -rf node_modules backend/node_modules frontend/node_modules
   npm run setup
   ```

### 问题4：TypeScript 类型错误

**症状：** 启动时提示类型错误

**解决方案：**
```bash
cd backend && npm install
cd ../frontend && npm install
```

## 下一步

1. 查看[开发指南](DEVELOPMENT.md)了解项目结构
2. 查看[产品需求](doc/README.md)了解功能列表
3. 开始编写代码！

## 获取帮助

- 查看 `README.md` 了解项目概述
- 查看 `DEVELOPMENT.md` 了解开发流程
- 查看 `database/README.md` 了解数据库结构
- 提交 Issue 获取支持

---

祝您开发愉快！🚀

