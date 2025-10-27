# 🚀 Docker 一键部署 - 5分钟快速上手

## ✅ 前置条件

安装 Docker Desktop：
- Windows: https://www.docker.com/products/docker-desktop
- macOS: https://www.docker.com/products/docker-desktop  
- Linux: `curl -fsSL https://get.docker.com | sh`

验证安装：
```bash
docker --version
docker compose version
```

## 🎯 一键启动

### 方法1：最简单（无配置）

```bash
# 1. 克隆项目
git clone <your-repo-url>
cd stockAnalysis

# 2. 一键启动
docker compose up -d

# 3. 等待启动完成（约1-2分钟）
docker compose logs -f
```

**启动后访问**：
- 🌐 前端：http://localhost
- 🔌 后端API：http://localhost:3000
- ✅ 健康检查：http://localhost:3000/health

### 方法2：配置AI功能（可选）

```bash
# 1. 复制环境配置
cp env.docker.example .env

# 2. 编辑 .env 文件，添加您的 API 密钥
notepad .env  # Windows
nano .env      # Linux/Mac

# 3. 启动
docker compose up -d
```

## 📊 数据位置

所有数据保存在 `./data/postgres/` 目录，可以：
- ✅ 备份整个目录
- ✅ 删除容器不丢失数据
- ✅ 迁移到其他服务器

## 🛠️ 常用命令

```bash
# 查看状态
docker compose ps

# 查看日志
docker compose logs -f

# 重启服务
docker compose restart

# 停止服务
docker compose stop

# 完全删除（包含数据）
docker compose down -v
```

## ❓ 遇到问题？

### 端口被占用
```bash
# 修改端口：编辑 docker-compose.yml
# 将 "80:80" 改为 "8080:80"
```

### 启动失败
```bash
# 查看详细日志
docker compose logs backend
docker compose logs postgres

# 重新构建
docker compose build --no-cache
docker compose up -d
```

## 📖 更多信息

- 📘 [完整 Docker 部署指南](docs/guide/DOCKER_DEPLOYMENT.md)
- 📗 [快速参考](DOCKER_README.md)
- 💻 [开发部署指南](docs/guide/DEVELOPMENT.md)

---

**🎉 就这么简单！现在开始使用吧！**
