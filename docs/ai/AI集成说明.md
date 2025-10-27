# AI模型集成说明

本项目已集成两个AI模型API，用于股票量化分析和交易决策。

---

## 🤖 支持的AI模型

### 1. DeepSeek (硅基流动)

**特性**:
- 模型：deepseek-chat
- 提供商：硅基流动
- API地址：https://api.siliconflow.cn/v1
- 主要用途：股票分析和交易建议

### 2. Qwen (阿里云通义千问)

**特性**:
- 模型：qwen-turbo
- 提供商：阿里云
- API地址：https://dashscope.aliyuncs.com/api/v1
- 主要用途：智能决策和趋势预测

---

## 📝 配置方法

### 1. 环境变量配置

编辑 `backend/.env` 文件：

```env
# DeepSeek API配置
DEEPSEEK_API_KEY=你的硅基流动API密钥

# 阿里云千问配置
QWEN_API_KEY=你的阿里云API密钥
```

### 2. 获取API密钥

#### DeepSeek (硅基流动)

1. 访问：https://siliconflow.cn
2. 注册账号
3. 创建API密钥
4. 复制密钥到 `.env` 文件

#### 阿里云千问

1. 访问：https://dashscope.console.aliyun.com/
2. 开通服务
3. 获取API Key
4. 复制密钥到 `.env` 文件

---

## 🚀 使用方法

### 1. 初始化AI服务

```bash
# API调用示例
curl -X POST http://localhost:3000/api/ai/init \
  -H "Content-Type: application/json" \
  -d '{
    "modelId": 1,
    "aiType": "deepseek",
    "apiKey": "your-api-key"
  }'
```

**参数说明**:
- `modelId`: 模型ID（数据库中模型的ID）
- `aiType`: AI类型（deepseek 或 qwen）
- `apiKey`: API密钥

### 2. 分析股票

```bash
curl -X POST http://localhost:3000/api/ai/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "modelId": 1,
    "stockCode": "000001",
    "stockName": "平安银行",
    "currentPrice": 12.50
  }'
```

**返回格式**:
```json
{
  "code": 0,
  "data": {
    "success": true,
    "action": "buy",
    "confidence": 85,
    "reasoning": "基于技术分析和基本面，建议买入",
    "stockCode": "000001",
    "stockName": "平安银行",
    "expectedPrice": 13.20
  },
  "message": "success"
}
```

### 3. 获取支持的AI模型列表

```bash
curl http://localhost:3000/api/ai/models
```

**返回**:
```json
{
  "code": 0,
  "data": [
    {
      "name": "deepseek",
      "displayName": "DeepSeek (硅基流动)"
    },
    {
      "name": "qwen",
      "displayName": "Qwen (阿里云通义千问)"
    }
  ],
  "message": "success"
}
```

---

## 💻 代码集成示例

### TypeScript/Node.js

```typescript
import fetch from 'node-fetch';

// 初始化AI服务
async function initAIService(modelId: number, aiType: string, apiKey: string) {
  const response = await fetch('http://localhost:3000/api/ai/init', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ modelId, aiType, apiKey })
  });
  return response.json();
}

// 分析股票
async function analyzeStock(modelId: number, stockCode: string, stockName: string, price: number) {
  const response = await fetch('http://localhost:3000/api/ai/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ modelId, stockCode, stockName, currentPrice: price })
  });
  return response.json();
}

// 使用示例
const result = await analyzeStock(1, '000001', '平安银行', 12.50);
console.log(result);
```

### Python

```python
import requests

# 初始化AI服务
def init_ai_service(model_id, ai_type, api_key):
    url = 'http://localhost:3000/api/ai/init'
    data = {
        'modelId': model_id,
        'aiType': ai_type,
        'apiKey': api_key
    }
    response = requests.post(url, json=data)
    return response.json()

# 分析股票
def analyze_stock(model_id, stock_code, stock_name, price):
    url = 'http://localhost:3000/api/ai/analyze'
    data = {
        'modelId': model_id,
        'stockCode': stock_code,
        'stockName': stock_name,
        'currentPrice': price
    }
    response = requests.post(url, json=data)
    return response.json()

# 使用示例
result = analyze_stock(1, '000001', '平安银行', 12.50)
print(result)
```

---

## 🔧 API响应格式

### 成功响应

```json
{
  "code": 0,
  "data": {
    "success": true,
    "action": "buy",
    "confidence": 85,
    "reasoning": "分析理由",
    "stockCode": "000001",
    "stockName": "平安银行",
    "expectedPrice": 13.20
  },
  "message": "success"
}
```

### 失败响应

```json
{
  "code": -1,
  "message": "错误信息"
}
```

---

## 📊 AI决策说明

### Action（操作建议）

- `buy`: 买入
- `sell`: 卖出
- `hold`: 持有

### Confidence（信心度）

- 范围：0-100
- 表示模型对建议的信心程度

### Reasoning（分析理由）

- 模型给出的决策理由
- 包括技术分析、基本面分析等

### ExpectedPrice（预期价格）

- 目标价位
- 用于买卖时机判断

---

## ⚙️ 自定义提示词

### 修改提示词模板

在对应的服务文件中修改 `buildPrompt` 方法：

```typescript
private buildPrompt(request: AIRequest): string {
  return `
    你的自定义提示词
    ${request.stockCode}
    ${request.stockName}
    ${request.currentPrice}
  `;
}
```

---

## 🔍 错误处理

### 常见错误

1. **API密钥无效**
   - 检查 `.env` 文件中的密钥配置
   - 验证API密钥是否有效

2. **网络请求失败**
   - 检查网络连接
   - 确认API服务可用

3. **模型服务未初始化**
   - 先调用初始化API
   - 确认模型ID正确

---

## 📞 技术支持

遇到问题？

1. 查看日志文件：`backend/logs/error.log`
2. 检查API配置
3. 提交 Issue
4. 查看文档

---

**祝使用愉快！** 🎉

