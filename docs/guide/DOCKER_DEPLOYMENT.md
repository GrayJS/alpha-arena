# Docker 一键部署指南

## 📋 目录

- [概述](#概述)
- [前置要求](#前置要求)
- [快速开始](#快速开始)
- [数据持久化](#数据持久化)
- [环境配置](#环境配置)
- [生产环境部署](#生产环境部署)
- [开发环境部署](#开发环境部署)
- [常见问题](#常见问题)

## 🎯 概述

本项目现已支持 Docker 一键部署，包含以下特性：

- ✅ **数据持久化**：数据库数据自动保存到主机磁盘
- ✅ **配置文件映射**：环境配置可映射到外部
- ✅ **健康检查**：自动确保服务正常运行
- ✅ **网络隔离**：独立的 Docker 网络
- ✅ **一键启动**：一条命令启动所有服务

## 📦 前置要求

### 必需软件

1. **Docker** (版本 >= 20.10)
   ```bash
   # 检查 Docker 版本
   docker --version
   ```

2. **Docker Compose** (版本 >= 2.0)
   ```bash
   # 检查 Docker Compose 版本
   docker compose version
   ```

### 安装 Docker

#### Windows

1. 下载 [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)
2. 安装并重启电脑
3. 启动 Docker Desktop

#### Linux

```bash
# 安装 Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 启动 Docker 服务
sudo systemctl start docker
sudo systemctl enable docker
```

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd stockAnalysis
```

### 2. 配置环境变量（可选）

创建 `.env` 文件（在项目根目录）：

```bash
# 复制示例文件
cp backend/env.example .env
```

编辑 `.env` 文件，配置以下内容：

```env
# AI 模型配置
SILICONFLOW_ENABLED=false
SILICONFLOW_API_KEY=your-api-key
DASHSCOPE_ENABLED=false
DASHSCOPE_API_KEY=your-api-key
TUSHARE_TOKEN=your-token

# JWT 密钥（生产环境务必修改）
JWT_SECRET=your-very-long-random-secret-key
```

### 3. 启动所有服务

#### 生产环境（推荐）

```bash
# 构建并启动所有服务
docker compose up -d

# 查看日志
docker compose logs -f
```

#### 开发环境

```bash
# 使用开发配置
docker compose -f docker-compose.dev.yml up -d

# 查看日志
docker compose -f docker-compose.dev.yml logs -f
```

### 4. 访问应用

启动成功后，访问以下地址：

- 🌐 **前端应用**: http://localhost
- 🔌 **后端 API**: http://localhost:3000
- 📊 **健康检查**: http://localhost:3000/health

## 💾 数据持久化

所有数据都会自动保存到主机磁盘：

### 数据存储位置

项目采用**绑定挂载**方式，数据存储在：

```
./data/postgres/  # PostgreSQL 数据库数据
```

### 数据管理

```bash
# 查看数据目录
ls -la ./data/postgres/

# 备份数据库
docker compose exec postgres pg_dump -U postgres alpha_arena > backup.sql

# 恢复数据库
cat backup.sql | docker compose exec -T postgres psql -U postgres alpha_arena
```

### 清理数据

```bash
# 删除所有容器和数据（⚠️ 危险操作）
docker compose down -v

# 只删除容器，保留数据
docker compose down
```

## ⚙️ 环境配置

### 查看服务状态

```bash
# 查看所有服务状态
docker compose ps

# 查看特定服务日志
docker compose logs backend
docker compose logs frontend
docker compose logs postgres
```

### 重启服务

```bash
# 重启所有服务
docker compose restart

# 重启特定服务
docker compose restart backend
```

### 停止服务

```bash
# 停止所有服务（保留数据）
docker compose stop

# 停止并删除容器
docker compose down
```

## 🏭 生产环境部署

### 部署前检查清单

- [ ] 修改 `.env` 文件中的默认密码
- [ ] 设置强密码的 JWT_SECRET
- [ ] 配置正确的 CORS_ORIGIN
- [ ] 配置 AI 模型 API 密钥
- [ ] 检查防火墙端口配置
- [ ] 配置 HTTPS（推荐）

### 生产环境启动

```bash
# 1. 构建镜像
docker compose build

# 2. 启动服务
docker compose up -d

# 3. 查看日志
docker compose logs -f

# 4. 检查健康状态
docker compose ps
```

### 更新应用

```bash
# 1. 拉取最新代码
git pull

# 2. 重新构建镜像
docker compose build

# 3. 重启服务
docker compose up -d
```

### 配置 HTTPS（推荐）

1. 使用 Nginx 作为反向代理
2. 配置 SSL 证书
3. 修改 `frontend/nginx.conf` 支持 HTTPS

## 🛠️ 开发环境部署

### 开发模式特性

- ✅ 源代码热重载
- ✅ 开发工具支持
- ✅ 详细日志输出
- ✅ 快速迭代

### 启动开发环境

```bash
# 使用开发配置启动
docker compose -f docker-compose.dev.yml up -d

# 实时查看日志
docker compose -f docker-compose.dev.yml logs -f backend
```

### 进入容器调试

```bash
# 进入后端容器
docker compose exec backend sh

# 进入数据库
docker compose exec postgres psql -U postgres alpha_arena
```

## 🔧 常见问题

### Q1: 端口被占用

**错误**: `Error starting userland proxy: listen tcp4 :80: bind: address already in use`

**解决方法**:

```bash
# 方法1: 修改 docker-compose.yml 中的端口映射
ports:
  - "8080:80"  # 改为其他端口

# 方法2: 停止占用端口的服务
# Windows
netstat -ano | findstr :80
taskkill /PID <PID> /F

# Linux
sudo lsof -i :80
sudo kill -9 <PID>
```

### Q2: 数据库连接失败

**错误**: `Error: connect ECONNREFUSED`

**解决方法**:

```bash
# 检查 PostgreSQL 容器状态
docker compose ps postgres

# 查看日志
docker compose logs postgres

# 等待数据库完全启动
# 健康检查会自动等待
```

### Q3: 权限问题

**错误**: `Permission denied`

**解决方法**:

```bash
# Linux/Mac: 设置数据目录权限
sudo chown -R 1001:1001 ./data

# Windows: 确保文件夹具有读写权限
```

### Q4: 构建失败

**错误**: `npm ERR!`

**解决方法**:

```bash
# 清除缓存并重新构建
docker compose build --no-cache

# 删除旧的镜像和容器
docker compose down
docker system prune -a
```

### Q5: 前端访问后端 API 失败

**解决**: 检查后端健康状态：

```bash
# 检查后端健康
curl http://localhost:3000/health

# 查看后端日志
docker compose logs backend
```

## 📝 管理命令速查

```bash
# 启动
docker compose up -d

# 停止
docker compose stop

# 重启
docker compose restart

# 查看日志
docker compose logs -f

# 查看状态
docker compose ps

# 删除容器和数据
docker compose down -v

# 重新构建
docker compose build --no-cache
docker compose up -d

# 进入容器
docker compose exec backend sh
docker compose exec postgres psql -U postgres alpha_arena

# 导出数据
docker compose exec postgres pg_dump -U postgres alpha_arena > backup.sql
```

## 🎉 完成

部署成功后，您可以：

1. 访问 http://localhost 查看应用
2. 访问 http://localhost:3000/health 检查后端健康状态
3. 查看日志进行调试

## 📚 相关文档

- [快速启动指南](QUICKSTART.md)
- [开发指南](DEVELOPMENT.md)
- [部署指南](DEPLOYMENT.md)
- [AI 配置指南](../ai/AI配置快速开始.md)

---

**提示**: 遇到问题？查看项目 [Issues](https://github.com/your-repo/issues) 或提交新 Issue。
