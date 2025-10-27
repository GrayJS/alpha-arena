# AI模型配置完整指南

本文档说明如何完全自定义配置AI模型。

---

## 📋 配置架构

```
提供商 (Provider)
    ↓
    配置环境变量
    ├── API密钥
    ├── API地址  
    └── 模型列表（可自定义）
        ↓
    模型1: model1
    模型2: model2
    模型3: model3
```

---

## ⚙️ 完整配置示例

### 1. 基础配置

编辑 `backend/.env`：

```env
# ========== 硅基流动配置 ==========
# 是否启用
SILICONFLOW_ENABLED=true

# API密钥（必需）
SILICONFLOW_API_KEY=sk-xxxxxxxxxxxxx

# API地址（可选，使用默认值）
SILICONFLOW_BASE_URL=https://api.siliconflow.cn/v1

# 支持的模型列表（可自定义）
# 支持多个模型，用逗号分隔
# 不配置则使用默认模型
SILICONFLOW_MODELS=deepseek-chat,deepseek-coder,deepseek-reasoner

# ========== 阿里云配置 ==========
# 是否启用
DASHSCOPE_ENABLED=true

# API密钥（必需）
DASHSCOPE_API_KEY=sk-xxxxxxxxxxxxx

# API地址（可选）
DASHSCOPE_BASE_URL=https://dashscope.aliyuncs.com/api/v1

# 支持的模型列表（可自定义）
DASHSCOPE_MODELS=qwen-turbo,qwen-plus,qwen-max
```

---

## 🎯 配置场景

### 场景1：使用默认模型

只配置提供商，使用默认模型：

```env
SILICONFLOW_ENABLED=true
SILICONFLOW_API_KEY=your-key
# 不配置 MODELS，使用默认: deepseek-chat, deepseek-coder
```

**默认模型**:
- SiliconFlow: `deepseek-chat`, `deepseek-coder`
- DashScope: `qwen-turbo`, `qwen-plus`, `qwen-max`

### 场景2：自定义模型

配置自己的模型列表：

```env
# 只使用特定的模型
SILICONFLOW_MODELS=deepseek-chat
```

### 场景3：添加新模型

```env
# 使用自定义的模型名称
SILICONFLOW_MODELS=deepseek-chat,deepseek-reasoner,custom-model
DASHSCOPE_MODELS=qwen-turbo,custom-qwen
```

---

## 📝 数据库模型配置

模型通过数据库的 `algorithm` 字段关联，格式：

```
provider:modelName
```

### 示例

```sql
-- 使用硅基流动的 deepseek-chat
UPDATE models SET algorithm = 'siliconflow:deepseek-chat' WHERE id = 1;

-- 使用阿里云的 qwen-turbo
UPDATE models SET algorithm = 'dashscope:qwen-turbo' WHERE id = 2;

-- 使用自定义模型
UPDATE models SET algorithm = 'siliconflow:custom-model' WHERE id = 3;
```

---

## 🚀 使用流程

### 步骤1：配置环境变量

```env
SILICONFLOW_ENABLED=true
SILICONFLOW_API_KEY=your-key
SILICONFLOW_MODELS=deepseek-chat  # 可选
```

### 步骤2：创建模型

```bash
curl -X POST http://localhost:3000/api/models \
  -H "Content-Type: application/json" \
  -d '{
    "name": "DeepSeek策略",
    "algorithm": "siliconflow:deepseek-chat",
    "riskProfile": "moderate"
  }'
```

### 步骤3：初始化AI服务

```bash
# 自动从模型配置读取
curl -X POST http://localhost:3000/api/ai/init \
  -d '{"modelId": 1}'

# 或手动指定
curl -X POST http://localhost:3000/api/ai/init \
  -d '{
    "modelId": 1,
    "provider": "siliconflow",
    "modelName": "deepseek-chat"
  }'
```

### 步骤4：分析股票

```bash
curl -X POST http://localhost:3000/api/ai/analyze \
  -d '{
    "modelId": 1,
    "stockCode": "000001",
    "stockName": "平安银行",
    "currentPrice": 12.50
  }'
```

---

## 🔧 查询可用模型

### 获取提供商配置

```bash
curl http://localhost:3000/api/ai/providers
```

**响应**:
```json
{
  "code": 0,
  "data": [
    {
      "name": "siliconflow",
      "displayName": "硅基流动",
      "models": ["deepseek-chat", "deepseek-coder"],
      "enabled": true
    },
    {
      "name": "dashscope",
      "displayName": "阿里云灵积模型服务",
      "models": ["qwen-turbo", "qwen-plus"],
      "enabled": true
    }
  ]
}
```

### 获取所有可用模型

```bash
curl http://localhost:3000/api/ai/models
```

**响应**:
```json
{
  "code": 0,
  "data": [
    {
      "provider": "siliconflow",
      "modelName": "deepseek-chat",
      "displayName": "DeepSeek Chat",
      "enabled": true
    },
    {
      "provider": "dashscope",
      "modelName": "qwen-turbo",
      "displayName": "通义千问 Turbo",
      "enabled": true
    }
  ]
}
```

---

## 💡 最佳实践

### 1. 模型命名规范

```env
# 推荐：清晰的模型名称
SILICONFLOW_MODELS=deepseek-chat,deepseek-coder

# 不推荐：混乱的命名
SILICONFLOW_MODELS=model1,model2,xyz
```

### 2. 分别配置测试和生产环境

**开发环境** (`backend/.env.development`):
```env
SILICONFLOW_ENABLED=true
SILICONFLOW_API_KEY=dev-key
SILICONFLOW_MODELS=deepseek-chat  # 使用简单模型
```

**生产环境** (`backend/.env.production`):
```env
SILICONFLOW_ENABLED=true
SILICONFLOW_API_KEY=prod-key
SILICONFLOW_MODELS=deepseek-chat,deepseek-coder  # 使用完整模型列表
```

### 3. 配置验证

创建配置后，验证是否生效：

```bash
# 查看配置
curl http://localhost:3000/api/ai/providers

# 测试模型
curl -X POST http://localhost:3000/api/ai/analyze \
  -d '{
    "modelId": 1,
    "stockCode": "test",
    "stockName": "测试",
    "currentPrice": 10.0
  }'
```

---

## 🔍 配置示例

### 示例1：只使用DeepSeek

```env
SILICONFLOW_ENABLED=true
SILICONFLOW_API_KEY=sk-xxxx
SILICONFLOW_MODELS=deepseek-chat

DASHSCOPE_ENABLED=false
```

### 示例2：使用多个模型

```env
SILICONFLOW_ENABLED=true
SILICONFLOW_API_KEY=sk-xxxx
SILICONFLOW_MODELS=deepseek-chat,deepseek-coder,deepseek-reasoner

DASHSCOPE_ENABLED=true
DASHSCOPE_API_KEY=sk-yyyy
DASHSCOPE_MODELS=qwen-turbo,qwen-max
```

### 示例3：测试环境配置

```env
# 只启用一个提供商
SILICONFLOW_ENABLED=true
SILICONFLOW_API_KEY=test-key

# 只使用一个模型
SILICONFLOW_MODELS=deepseek-chat

# 其他提供商禁用
DASHSCOPE_ENABLED=false
```

---

## ⚠️ 注意事项

1. **模型名称必须准确**：配置的模型名称必须与API提供商支持的模型名称一致
2. **API密钥安全**：不要将 `.env` 文件提交到仓库
3. **模型列表验证**：启动服务时会验证模型是否可用
4. **大小写敏感**：模型名称区分大小写

---

## 🔄 更新配置

### 修改模型列表

```bash
# 1. 更新 .env 文件
SILICONFLOW_MODELS=new-model-name

# 2. 重启服务
npm run dev

# 3. 验证配置
curl http://localhost:3000/api/ai/models
```

### 热重载配置

配置更改后需要重启服务才能生效。

---

## 📊 配置优先级

1. **环境变量** - 最高优先级
2. **默认配置** - 如果环境变量未配置
3. **硬编码** - 最后备用

---

**更多信息**:
- [AIConfig指南.md](AIConfig指南.md) - 基础配置
- [AI集成说明.md](AI集成说明.md) - 集成说明

