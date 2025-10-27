# AI模型配置指南

本文档说明如何配置和使用AI模型。

---

## 📋 配置架构

项目采用**提供商+模型**的配置架构：

```
AI Provider (提供商)
    ├── SiliconFlow (硅基流动)
    │   ├── deepseek-chat
    │   └── deepseek-coder
    └── DashScope (阿里云)
        ├── qwen-turbo
        ├── qwen-plus
        └── qwen-max
```

---

## ⚙️ 配置文件

### 1. 环境变量配置

编辑 `backend/.env`：

```env
# 硅基流动配置
SILICONFLOW_ENABLED=true                    # 启用此提供商
SILICONFLOW_API_KEY=sk-xxxxxxxxxxxxx        # API密钥
SILICONFLOW_BASE_URL=https://api.siliconflow.cn/v1

# 阿里云配置
DASHSCOPE_ENABLED=true                      # 启用此提供商
DASHSCOPE_API_KEY=sk-xxxxxxxxxxxxx          # API密钥
DASHSCOPE_BASE_URL=https://dashscope.aliyuncs.com/api/v1
```

### 2. 模型配置

模型通过数据库的 `algorithm` 字段配置，格式：

```
provider:modelName
```

**示例**:
- `siliconflow:deepseek-chat` - 使用硅基流动的 DeepSeek Chat
- `dashscope:qwen-turbo` - 使用阿里云的千问 Turbo

---

## 🚀 使用方法

### 方法1：从环境变量自动配置

如果启用了提供商且配置了API密钥，系统会自动加载：

```bash
# 启动服务
npm run dev

# AI服务会自动从配置加载
```

### 方法2：手动初始化

#### 1. 初始化模型

```bash
curl -X POST http://localhost:3000/api/ai/init \
  -H "Content-Type: application/json" \
  -d '{
    "modelId": 1,
    "provider": "siliconflow",
    "modelName": "deepseek-chat"
  }'
```

#### 2. 获取可用的提供商和模型

```bash
# 获取提供商列表
curl http://localhost:3000/api/ai/providers

# 获取可用模型列表
curl http://localhost:3000/api/ai/models
```

---

## 📝 配置示例

### 场景1：使用DeepSeek模型

**1. 配置环境变量**

```env
SILICONFLOW_ENABLED=true
SILICONFLOW_API_KEY=sk-your-key
```

**2. 创建或更新模型**

```json
{
  "name": "DeepSeek量化策略",
  "algorithm": "siliconflow:deepseek-chat",
  "riskProfile": "moderate"
}
```

**3. 初始化服务**

```bash
curl -X POST http://localhost:3000/api/ai/init \
  -d '{"modelId": 1}'
```

### 场景2：使用千问模型

**1. 配置环境变量**

```env
DASHSCOPE_ENABLED=true
DASHSCOPE_API_KEY=sk-your-key
```

**2. 创建模型**

```json
{
  "name": "千问量化策略",
  "algorithm": "dashscope:qwen-turbo",
  "riskProfile": "aggressive"
}
```

**3. 初始化服务**

```bash
curl -X POST http://localhost:3000/api/ai/init \
  -d '{"modelId": 2}'
```

---

## 🔧 添加新的提供商

### 步骤1：创建提供商类

在 `backend/src/services/ai/providers/` 目录创建新文件：

```typescript
// NewProvider.ts
import { BaseProvider, AIRequest, AIResponse } from './BaseProvider';

export class NewProvider extends BaseProvider {
  async analyze(request: AIRequest): Promise<AIResponse> {
    // 实现分析逻辑
  }

  async validate(): Promise<boolean> {
    // 实现验证逻辑
  }
}
```

### 步骤2：注册提供商

在 `backend/src/config/aiProviders.ts` 中添加：

```typescript
export function loadAIProvidersConfig() {
  return {
    // ... 现有配置
    
    newprovider: {
      name: 'newprovider',
      displayName: '新提供商',
      apiKey: process.env.NEWPROVIDER_API_KEY || '',
      baseUrl: process.env.NEWPROVIDER_BASE_URL || 'https://api.example.com',
      models: ['model1', 'model2'],
      enabled: process.env.NEWPROVIDER_ENABLED === 'true'
    }
  };
}
```

### 步骤3：在工厂中注册

在 `ProviderFactory.ts` 中添加：

```typescript
case 'newprovider':
  return new NewProvider({ ... }, modelName);
```

### 步骤4：配置环境变量

在 `backend/env.example` 中添加：

```env
# 新提供商
NEWPROVIDER_ENABLED=false
NEWPROVIDER_API_KEY=your-api-key
NEWPROVIDER_BASE_URL=https://api.example.com
```

---

## 🎯 模型选择建议

### 适用场景

**DeepSeek Chat**
- ✅ 复杂的量化分析
- ✅ 多因子模型
- ✅ 技术指标分析

**DeepSeek Coder**
- ✅ 策略代码生成
- ✅ 回测逻辑优化

**Qwen Turbo**
- ✅ 快速决策
- ✅ 实时交易信号

**Qwen Plus/Max**
- ✅ 深度分析
- ✅ 长期投资建议

---

## 📊 API使用示例

### 初始化所有模型

```typescript
import axios from 'axios';

const models = [
  { id: 1, algorithm: 'siliconflow:deepseek-chat' },
  { id: 2, algorithm: 'dashscope:qwen-turbo' }
];

for (const model of models) {
  await axios.post('http://localhost:3000/api/ai/init', {
    modelId: model.id
  });
}
```

### 批量分析

```typescript
const stocks = [
  { code: '000001', name: '平安银行', price: 12.50 },
  { code: '600519', name: '贵州茅台', price: 1800 }
];

for (const modelId of [1, 2]) {
  for (const stock of stocks) {
    const result = await axios.post('http://localhost:3000/api/ai/analyze', {
      modelId,
      ...stock
    });
    console.log(result.data);
  }
}
```

---

## 🔍 调试

### 查看配置

```bash
# 查看启用的提供商
curl http://localhost:3000/api/ai/providers

# 查看可用模型
curl http://localhost:3000/api/ai/models
```

### 查看日志

```bash
# 后端日志
tail -f backend/logs/combined.log

# 错误日志
tail -f backend/logs/error.log
```

---

## ⚠️ 注意事项

1. **API密钥安全**：不要将 `.env` 文件提交到代码仓库
2. **性能考虑**：避免频繁调用AI API
3. **成本控制**：合理设置缓存策略
4. **错误处理**：实现重试机制

---

**更多信息请查看 [AI集成说明.md](AI集成说明.md)**

