# Alpha Arena·A股版（AI量化竞技场）

一个面向 A股市场 的 AI 模型实时对比与展示平台。

平台通过统一的行情数据和模拟资金池，让不同的 AI 量化模型在同样的市场环境中进行虚拟实盘交易，并以图表和榜单的形式展示它们的收益、风险与交易逻辑。

## 📋 目录

- [产品定位](#产品定位)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [功能模块](#功能模块)
- [开发计划](#开发计划)
- [快速开始](#快速开始)

## 🧭 产品定位

这是一个仿制 [nof1.ai](https://nof1.ai/) 的AI量化竞技平台，专门针对A股市场定制化开发。

### 目标用户

- **量化策略开发者**：验证策略效果，展示模型实力
- **投资机构/自媒体**：跟踪AI量化策略表现
- **散户投资者**：对比不同AI模型表现，了解AI投资趋势
- **平台运营方**：搭建AI模型生态

## 🛠️ 技术栈

### 前端
- **React 18** + **TypeScript**
- **Vite** - 构建工具
- **Recharts** - 图表库
- **Ant Design** - UI组件库
- **Axios** - HTTP客户端
- **Zustand** - 状态管理

### 后端
- **Node.js** + **Express**
- **TypeScript**
- **PostgreSQL** - 数据库
- **Sequelize** - ORM
- **node-cron** - 定时任务

### 数据源
- **Tushare Pro** - A股行情数据
- **聚宽（JoinQuant）** - 备选数据源

## 📁 项目结构

```
stockAnalysis/
├── doc/                      # 项目文档和设计素材
│   ├── README.md           # 产品需求文档
│   └── image.png           # 设计参考图
├── backend/                 # 后端服务
│   ├── src/
│   │   ├── controllers/    # 控制器
│   │   ├── models/         # 数据模型
│   │   ├── routes/         # 路由
│   │   ├── services/       # 业务逻辑
│   │   ├── utils/          # 工具函数
│   │   └── config/         # 配置文件
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # 前端应用
│   ├── src/
│   │   ├── components/     # 组件
│   │   ├── pages/         # 页面
│   │   ├── stores/        # 状态管理
│   │   ├── services/      # API服务
│   │   └── utils/         # 工具函数
│   ├── package.json
│   └── vite.config.ts
├── database/              # 数据库相关
│   ├── migrations/        # 数据库迁移
│   └── seeds/            # 种子数据
└── README.md             # 项目说明文档
```

## 🎯 功能模块

### 核心功能（MVP版本）

1. **AI模型集成** ✨
   - DeepSeek (硅基流动) - 深度分析能力
   - Qwen (阿里云通义千问) - 智能决策
   - AI驱动的股票分析和交易建议
   - 可扩展的AI服务架构

2. **模型收益曲线对比**
   - 展示多个AI模型在A股市场的净值变化
   - 支持时间区间切换（日线、周线、月线）
   - 支持多模型叠加对比

3. **交易明细日志**
   - 每笔买卖及盈亏展示
   - 支持按模型/时间/股票筛选
   - AI决策建议记录
   - 导出交易记录

4. **模型排行榜**
   - 按收益率、夏普比率等指标排序
   - 展示最大回撤等风险指标
   - AI模型效果对比

5. **行情展示**
   - 顶部展示主要指数（上证、深证、创业板）

### 扩展功能（后续版本）

- 模型详情页
- 用户注册与模型上传
- 回放功能
- 策略信号订阅

## 📅 开发计划

### 第一阶段：MVP版本（当前阶段）
- [x] 项目结构搭建
- [ ] 数据库设计
- [ ] 后端API开发
- [ ] 前端页面开发
- [ ] 数据源集成
- [ ] 定时任务开发

### 第二阶段：功能完善
- [ ] 用户系统
- [ ] 模型上传功能
- [ ] 详细分析页面

### 第三阶段：高级功能
- [ ] 回放功能
- [ ] 信号订阅
- [ ] 社区功能

## 🚀 快速开始

### 部署方式选择

本项目支持两种部署方式：

1. **🐳 Docker 一键部署（推荐）** - 适合生产环境和快速启动
2. **💻 本地开发部署** - 适合开发和调试

### 🐳 方式一：Docker 一键部署（推荐）

#### 环境要求

- ✅ Docker >= 20.10
- ✅ Docker Compose >= 2.0

#### 快速启动

```bash
# 1. 克隆项目
git clone <your-repo-url>
cd stockAnalysis

# 2. 启动所有服务（生产环境）
docker compose up -d

# 3. 查看日志
docker compose logs -f
```

#### 访问应用

- 🌐 **前端**: http://localhost
- 🔌 **后端 API**: http://localhost:3000
- ❤️ **健康检查**: http://localhost:3000/health

#### 数据持久化

所有数据自动保存在 `./data/postgres/` 目录

#### 详细文档

📖 完整 Docker 部署指南: [Docker部署指南](docs/guide/DOCKER_DEPLOYMENT.md)

---

### 💻 方式二：本地开发部署

#### 环境要求

- ✅ Node.js >= 18
- ✅ PostgreSQL >= 14
- ✅ npm 或 yarn

#### 安装状态

✅ **所有依赖已安装完成！**

- 后端依赖已安装
- 前端依赖已安装
- 项目结构已搭建

#### 配置环境

**重要：创建 PostgreSQL 数据库**
```sql
CREATE DATABASE alpha_arena;
```

**配置数据库连接**

1. 创建 `.env` 文件：
```bash
# Windows
cd backend
copy env.example .env

# 或使用 PowerShell
Copy-Item env.example .env
```

2. 编辑 `backend/.env`，设置您的数据库密码：
```env
DB_PASSWORD=您的密码
```

#### 启动项目

**方法1：一键启动（推荐）**
```bash
npm run dev
```

**方法2：分别启动**
```bash
# 启动后端（端口 3000）
npm run dev:backend

# 启动前端（端口 5173）
npm run dev:frontend
```

#### 访问应用

- 🌐 **前端**: http://localhost:5173
- 🔌 **后端 API**: http://localhost:3000
- ❤️ **健康检查**: http://localhost:3000/health

📖 **详细启动指南**: 查看 [START.md](docs/guide/START.md) 或 `快速启动.txt`

## 📝 开发规范

### Git提交规范

本项目遵循 [约定式提交规范](https://www.conventionalcommits.org/zh-hans/v1.0.0-beta.4/)

示例：
- `feat: 添加模型排行榜功能`
- `fix: 修复收益计算错误`
- `docs: 更新API文档`
- `refactor: 重构数据获取逻辑`

### 代码注释

- 所有函数必须有清晰的注释说明
- 复杂逻辑需要有详细的行内注释
- 使用 JSDoc 规范注释

### 文档更新

- 开发新功能时同步更新相关文档
- API变更需要更新接口文档
- 数据库变更需要在 migrations 中记录

## 🤝 贡献指南

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目仅供学习和研究使用。

## 📚 文档

所有文档已整理到 `docs/` 目录，访问 [文档中心](docs/README.md) 查看完整文档索引。

📖 **项目结构说明**: 查看 [项目结构说明.md](项目结构说明.md) 了解为什么不使用 monorepo。

💡 **提示**: 看到根目录下的 `文档整理说明.md` 了解文档整理情况。

### 快速访问

- 📖 [文档中心](docs/README.md) - 完整的文档索引
- 🐳 [Docker部署指南](docs/guide/DOCKER_DEPLOYMENT.md) - 🚀 一键部署（推荐）
- 🚀 [快速启动指南](docs/guide/快速启动.txt) - 中文快速指南
- 🤖 [AI配置快速开始](docs/ai/AI配置快速开始.md) - AI模型3步配置
- 💻 [开发指南](docs/guide/DEVELOPMENT.md) - 参与开发
- 🚀 [部署指南](docs/guide/DEPLOYMENT.md) - 生产环境部署
- 🔌 [API文档](docs/api/API使用示例.md) - API使用示例
- 📊 [项目状态](docs/project/PROJECT_STATUS.md) - 项目开发状态
- 📋 [产品需求](docs/requirements/README.md) - 原始产品需求

## ⚠️ 注意事项

1. **数据库配置**：需要先安装和配置 PostgreSQL 数据库
2. **数据源**：需要配置 Tushare API Token（可选）
3. **开发环境**：建议使用 Node.js 18 或更高版本

## 🐛 已知问题

- [ ] 数据源集成还未完成
- [ ] 真实交易逻辑还未实现
- [ ] 用户认证功能还未添加

## 📧 联系方式

如有问题或建议，欢迎提交 Issue。

---

**注意**：本项目仍在积极开发中，部分功能可能不稳定。

