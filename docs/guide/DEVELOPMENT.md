# 开发指南

本文档说明如何参与 Alpha Arena·A股版 的开发。

## 开发环境要求

- Node.js >= 18
- PostgreSQL >= 14
- npm 或 yarn

## 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd stockAnalysis
```

### 2. 安装依赖

```bash
npm run install:all
```

或者分别安装：

```bash
# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

### 3. 配置数据库

1. 创建 PostgreSQL 数据库：

```sql
CREATE DATABASE alpha_arena;
```

2. 配置环境变量：

复制后端配置文件：

```bash
cd backend
cp .env.example .env
```

编辑 `backend/.env` 文件，配置数据库连接：

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=alpha_arena
DB_USER=postgres
DB_PASSWORD=postgres
```

### 4. 启动开发服务器

```bash
# 同时启动前后端
npm run dev

# 或者分别启动
npm run dev:backend  # 后端服务（端口 3000）
npm run dev:frontend # 前端开发服务器（端口 5173）
```

## 项目结构

```
stockAnalysis/
├── doc/              # 项目文档和设计素材
├── backend/          # 后端服务
│   ├── src/
│   │   ├── config/   # 配置文件
│   │   ├── controllers/  # 控制器
│   │   ├── models/    # 数据模型
│   │   ├── routes/    # 路由
│   │   ├── services/  # 业务逻辑
│   │   ├── utils/     # 工具函数
│   │   └── scheduler/ # 定时任务
│   ├── package.json
│   └── tsconfig.json
├── frontend/         # 前端应用
│   ├── src/
│   │   ├── components/  # 组件
│   │   ├── pages/      # 页面
│   │   ├── services/   # API服务
│   │   └── utils/      # 工具函数
│   ├── package.json
│   └── vite.config.ts
└── database/         # 数据库相关
```

## 开发规范

### Git 提交规范

使用约定式提交规范：

- `feat: 添加新功能`
- `fix: 修复bug`
- `docs: 更新文档`
- `style: 代码格式调整`
- `refactor: 重构代码`
- `perf: 性能优化`
- `test: 添加测试`
- `chore: 构建过程或辅助工具的变动`

### 代码规范

1. 所有代码必须使用 TypeScript
2. 所有函数必须有清晰的注释
3. 使用 ESLint 进行代码检查
4. 遵循单一职责原则

### API 设计规范

1. RESTful API 设计
2. 统一的响应格式：

```typescript
{
  code: 0,        // 0 表示成功，其他表示错误
  data: {},       // 数据
  message: 'success' // 消息
}
```

3. 使用语义化的HTTP状态码

## 开发流程

### 1. 创建功能分支

```bash
git checkout -b feature/your-feature-name
```

### 2. 开发功能

- 编写代码
- 添加注释
- 编写测试（可选）

### 3. 提交代码

```bash
git add .
git commit -m "feat: 添加XXX功能"
git push origin feature/your-feature-name
```

### 4. 创建 Pull Request

在 GitHub 上创建 PR，等待代码审查。

## 数据库迁移

### 创建迁移文件

```bash
cd backend
npx sequelize-cli migration:generate --name your-migration-name
```

### 运行迁移

```bash
npm run db:migrate
```

### 回滚迁移

```bash
npx sequelize-cli db:migrate:undo
```

## 测试

### 运行后端测试

```bash
cd backend
npm test
```

### 运行前端测试

```bash
cd frontend
npm test
```

## 部署

### 构建生产版本

```bash
npm run build
```

### 运行生产版本

```bash
cd backend
npm start
```

## 常见问题

### 1. 数据库连接失败

检查 `.env` 文件中的数据库配置是否正确。

### 2. 端口被占用

修改 `backend/.env` 或 `frontend/vite.config.ts` 中的端口配置。

### 3. TypeScript 类型错误

确保安装了所有依赖：

```bash
npm run install:all
```

## 获取帮助

- 查看文档：`doc/README.md`
- 提交 Issue
- 联系维护者

## 贡献者

感谢所有为项目做出贡献的开发者！

