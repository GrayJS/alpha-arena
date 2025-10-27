# AI配置快速开始

最简单的AI模型配置方法。

---

## 🚀 3步配置

### 步骤1：配置环境变量

编辑 `backend/.env`：

```env
# 启用硅基流动
SILICONFLOW_ENABLED=true
SILICONFLOW_API_KEY=your-api-key

# 使用默认模型（不配置MODELS即可）
# 或自定义模型
SILICONFLOW_MODELS=deepseek-chat
```

### 步骤2：启动服务

```bash
npm run dev
```

### 步骤3：验证配置

```bash
# 查看可用的提供商
curl http://localhost:3000/api/ai/providers

# 查看可用的模型
curl http://localhost:3000/api/ai/models
```

---

## 📋 配置模板

### 最小配置（推荐）

```env
# 使用DeepSeek
SILICONFLOW_ENABLED=true
SILICONFLOW_API_KEY=sk-xxxx

# 使用千问
DASHSCOPE_ENABLED=true
DASHSCOPE_API_KEY=sk-yyyy
```

### 完整配置

```env
# 硅基流动
SILICONFLOW_ENABLED=true
SILICONFLOW_API_KEY=sk-xxxx
SILICONFLOW_BASE_URL=https://api.siliconflow.cn/v1
SILICONFLOW_MODELS=deepseek-chat,deepseek-coder

# 阿里云
DASHSCOPE_ENABLED=true
DASHSCOPE_API_KEY=sk-yyyy
DASHSCOPE_BASE_URL=https://dashscope.aliyuncs.com/api/v1
DASHSCOPE_MODELS=qwen-turbo,qwen-plus
```

---

## 🎯 常用配置

### 只使用DeepSeek

```env
SILICONFLOW_ENABLED=true
SILICONFLOW_API_KEY=your-key

DASHSCOPE_ENABLED=false
```

### 只使用千问

```env
DASHSCOPE_ENABLED=true
DASHSCOPE_API_KEY=your-key

SILICONFLOW_ENABLED=false
```

### 使用自定义模型

```env
SILICONFLOW_ENABLED=true
SILICONFLOW_API_KEY=your-key
SILICONFLOW_MODELS=my-custom-model
```

---

## ✅ 验证清单

- [ ] 已配置API密钥
- [ ] 已启用提供商
- [ ] 服务启动成功
- [ ] 可以获取提供商列表
- [ ] 可以获取模型列表
- [ ] 可以初始化AI服务

---

**开始使用**:
1. 配置 `.env` 文件
2. 启动服务
3. 查看 `http://localhost:3000/api/ai/providers`

