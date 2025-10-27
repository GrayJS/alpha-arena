# 🚀 Alpha Arena 启动指南

## 快速启动

### 1️⃣ 环境要求

- ✅ Node.js >= 18
- ✅ PostgreSQL >= 14
- ✅ npm 或 yarn

### 2️⃣ 安装依赖

所有依赖已安装完成！如果您需要重新安装：

```bash
# 自动安装所有依赖
npm run setup

# 或手动安装
cd backend && npm install
cd ../frontend && npm install
```

### 3️⃣ 配置数据库

#### 步骤1：创建数据库

使用 PostgreSQL 客户端执行：

```sql
CREATE DATABASE alpha_arena;
```

或者使用命令行：

```bash
psql -U postgres
CREATE DATABASE alpha_arena;
\q
```

#### 步骤2：配置环境变量

编辑 `backend/.env` 文件（如果不存在，从 `backend/env.example` 复制）：

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=alpha_arena
DB_USER=postgres
DB_PASSWORD=您的数据库密码
```

### 4️⃣ 启动项目

#### 方法1：一键启动（推荐）

Windows PowerShell:
```powershell
.\start.ps1
```

#### 方法2：npm 命令

```bash
# 同时启动前后端
npm run dev

# 或分别启动
npm run dev:backend   # 后端服务 (端口 3000)
npm run dev:frontend  # 前端服务 (端口 5173)
```

### 5️⃣ 访问应用

启动成功后，访问：

- 🌐 **前端应用**: http://localhost:5173
- 🔌 **后端 API**: http://localhost:3000
- ❤️ **健康检查**: http://localhost:3000/health
- 📋 **API 文档**: http://localhost:3000/api

## ✅ 验证安装

### 检查后端

访问 http://localhost:3000/health 应该返回：

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 10.123
}
```

### 检查前端

访问 http://localhost:5173 应该看到主页。

### 检查数据库

后端启动时会自动：
1. 连接数据库
2. 同步数据模型
3. 初始化种子数据（3个测试模型）

查看控制台输出确认。

## 📝 常见问题

### ❌ 数据库连接失败

**错误**: `Unable to connect to the database`

**解决**:
1. 确认 PostgreSQL 服务正在运行
2. 检查 `.env` 配置是否正确
3. 确认数据库已创建

### ❌ 端口被占用

**错误**: `Port 3000 (or 5173) is already in use`

**解决**:
1. 修改端口配置
2. 或终止占用端口的进程

### ❌ 依赖安装失败

**错误**: npm install 失败

**解决**:
```bash
# 清理缓存并重新安装
npm cache clean --force
npm run setup
```

## 🎯 下一步

现在项目已经启动，您可以：

1. **查看数据**: http://localhost:5173
2. **查看 API**: http://localhost:3000/api/models
3. **阅读文档**: 
   - [README.md](README.md) - 项目概述
   - [DEVELOPMENT.md](DEVELOPMENT.md) - 开发指南
   - [PROJECT_STATUS.md](PROJECT_STATUS.md) - 项目状态

## 💡 开发提示

- 使用模拟数据开始开发
- 代码修改会自动重载
- 查看控制台了解运行状态
- 数据库会在开发模式下自动同步

---

祝您开发愉快！🎉

