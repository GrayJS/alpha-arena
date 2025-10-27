# 🐳 Docker 快速部署

## 🚀 一键启动

### 1. 启动所有服务

```bash
docker compose up -d
```

### 2. 查看日志

```bash
docker compose logs -f
```

### 3. 访问应用

- 🌐 **前端**: http://localhost
- 🔌 **后端**: http://localhost:3000
- ❤️ **健康检查**: http://localhost:3000/health

## 📂 数据持久化

所有数据保存在：
```
./data/postgres/  # 数据库数据
```

## ⚙️ 配置环境变量（可选）

1. 复制配置文件：
```bash
cp env.docker.example .env
```

2. 编辑 `.env` 文件，添加您的 API 密钥：
```env
SILICONFLOW_ENABLED=true
SILICONFLOW_API_KEY=your-api-key
DASHSCOPE_ENABLED=true
DASHSCOPE_API_KEY=your-api-key
```

## 🛠️ 常用命令

```bash
# 启动服务
docker compose up -d

# 停止服务
docker compose stop

# 重启服务
docker compose restart

# 查看日志
docker compose logs -f

# 删除所有数据（⚠️ 危险）
docker compose down -v
```

## 📖 完整文档

查看 [Docker部署指南](docs/guide/DOCKER_DEPLOYMENT.md) 获取详细信息。

---

**提示**: 首次启动可能需要几分钟来构建镜像和初始化数据库。
