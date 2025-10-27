# AI模型使用示例

本文档提供详细的AI模型集成和使用示例。

---

## 🚀 快速开始

### 1. 配置API密钥

编辑 `backend/.env`:

```env
# DeepSeek API
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxx

# 千问 API
QWEN_API_KEY=sk-xxxxxxxxxxxxx
```

### 2. 启动服务

```bash
npm run dev
```

---

## 📝 完整使用示例

### 步骤1：初始化AI服务

```bash
# 初始化DeepSeek
curl -X POST http://localhost:3000/api/ai/init \
  -H "Content-Type: application/json" \
  -d '{
    "modelId": 1,
    "aiType": "deepseek",
    "apiKey": "your-deepseek-api-key"
  }'

# 初始化千问
curl -X POST http://localhost:3000/api/ai/init \
  -H "Content-Type: application/json" \
  -d '{
    "modelId": 2,
    "aiType": "qwen",
    "apiKey": "your-qwen-api-key"
  }'
```

**响应**:
```json
{
  "code": 0,
  "message": "AI服务初始化成功",
  "data": {
    "modelId": 1,
    "aiType": "deepseek"
  }
}
```

### 步骤2：分析股票

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

**响应**:
```json
{
  "code": 0,
  "data": {
    "success": true,
    "action": "buy",
    "confidence": 85,
    "reasoning": "技术指标显示超买，但基本面良好，建议买入",
    "stockCode": "000001",
    "stockName": "平安银行",
    "expectedPrice": 13.20
  },
  "message": "success"
}
```

### 步骤3：获取支持的AI模型

```bash
curl http://localhost:3000/api/ai/models
```

**响应**:
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

## 💻 代码示例

### Node.js / TypeScript

```typescript
import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

// 初始化AI服务
async function initAI(modelId: number, aiType: string, apiKey: string) {
  try {
    const response = await axios.post(`${API_BASE}/ai/init`, {
      modelId,
      aiType,
      apiKey
    });
    console.log('AI服务初始化成功:', response.data);
  } catch (error) {
    console.error('初始化失败:', error);
  }
}

// 分析股票
async function analyzeStock(
  modelId: number,
  stockCode: string,
  stockName: string,
  price: number
) {
  try {
    const response = await axios.post(`${API_BASE}/ai/analyze`, {
      modelId,
      stockCode,
      stockName,
      currentPrice: price
    });
    
    const result = response.data.data;
    console.log(`建议: ${result.action}`);
    console.log(`信心度: ${result.confidence}%`);
    console.log(`理由: ${result.reasoning}`);
    
    return result;
  } catch (error) {
    console.error('分析失败:', error);
  }
}

// 使用示例
async function example() {
  // 初始化
  await initAI(1, 'deepseek', 'your-api-key');
  
  // 分析股票
  await analyzeStock(1, '000001', '平安银行', 12.50);
  await analyzeStock(1, '600519', '贵州茅台', 1800.00);
  await analyzeStock(1, '000002', '万科A', 8.30);
}

example();
```

### Python

```python
import requests

API_BASE = 'http://localhost:3000/api'

def init_ai(model_id, ai_type, api_key):
    """初始化AI服务"""
    url = f'{API_BASE}/ai/init'
    data = {
        'modelId': model_id,
        'aiType': ai_type,
        'apiKey': api_key
    }
    response = requests.post(url, json=data)
    print(response.json())

def analyze_stock(model_id, stock_code, stock_name, price):
    """分析股票"""
    url = f'{API_BASE}/ai/analyze'
    data = {
        'modelId': model_id,
        'stockCode': stock_code,
        'stockName': stock_name,
        'currentPrice': price
    }
    response = requests.post(url, json=data)
    result = response.json()
    
    if result['code'] == 0:
        data = result['data']
        print(f'建议: {data["action"]}')
        print(f'信心度: {data["confidence"]}%')
        print(f'理由: {data["reasoning"]}')
    else:
        print(f'分析失败: {result["message"]}')

# 使用示例
if __name__ == '__main__':
    # 初始化
    init_ai(1, 'deepseek', 'your-api-key')
    
    # 分析股票
    analyze_stock(1, '000001', '平安银行', 12.50)
    analyze_stock(1, '600519', '贵州茅台', 1800.00)
```

### JavaScript (浏览器)

```javascript
// 初始化AI服务
async function initAI(modelId, aiType, apiKey) {
  const response = await fetch('http://localhost:3000/api/ai/init', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ modelId, aiType, apiKey })
  });
  return response.json();
}

// 分析股票
async function analyzeStock(modelId, stockCode, stockName, price) {
  const response = await fetch('http://localhost:3000/api/ai/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      modelId,
      stockCode,
      stockName,
      currentPrice: price
    })
  });
  
  const result = await response.json();
  console.log(result.data);
  return result.data;
}

// 使用
await initAI(1, 'deepseek', 'your-api-key');
await analyzeStock(1, '000001', '平安银行', 12.50);
```

---

## 🔧 自动化交易示例

```typescript
// 自动化交易脚本
import axios from 'axios';

interface AIResult {
  action: 'buy' | 'sell' | 'hold';
  confidence: number;
  reasoning: string;
  stockCode: string;
  expectedPrice?: number;
}

async function autoTrade(modelId: number, apiKey: string) {
  const stocks = [
    { code: '000001', name: '平安银行', price: 12.50 },
    { code: '600519', name: '贵州茅台', price: 1800.00 },
    { code: '000002', name: '万科A', price: 8.30 }
  ];

  // 初始化AI
  await axios.post('http://localhost:3000/api/ai/init', {
    modelId,
    aiType: 'deepseek',
    apiKey
  });

  // 分析每只股票
  for (const stock of stocks) {
    const response = await axios.post('http://localhost:3000/api/ai/analyze', {
      modelId,
      stockCode: stock.code,
      stockName: stock.name,
      currentPrice: stock.price
    });

    const result: AIResult = response.data.data;

    // 根据AI建议执行操作
    if (result.action === 'buy' && result.confidence >= 70) {
      console.log(`建议买入: ${stock.name}`);
      // 执行买入操作...
    } else if (result.action === 'sell' && result.confidence >= 70) {
      console.log(`建议卖出: ${stock.name}`);
      // 执行卖出操作...
    } else {
      console.log(`保持持有: ${stock.name}`);
    }
  }
}

// 运行
autoTrade(1, 'your-api-key');
```

---

## 📊 决策逻辑

### 买入条件

```typescript
if (result.action === 'buy' && result.confidence >= 70) {
  // 执行买入
}
```

### 卖出条件

```typescript
if (result.action === 'sell' && result.confidence >= 70) {
  // 执行卖出
}
```

### 持有条件

```typescript
if (result.action === 'hold' || result.confidence < 70) {
  // 保持持有
}
```

---

## ⚙️ 高级配置

### 自定义提示词

编辑对应的服务文件，修改 `buildPrompt` 方法来自定义提示词。

### 调整参数

修改 `temperature` 和 `max_tokens` 参数来控制AI输出。

### 错误重试

```typescript
async function analyzeWithRetry(modelId, stockCode, stockName, price, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await analyzeStock(modelId, stockCode, stockName, price);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}
```

---

## 🔍 调试技巧

### 查看日志

```bash
# 后端日志
tail -f backend/logs/combined.log

# 错误日志
tail -f backend/logs/error.log
```

### 测试API

```bash
# 健康检查
curl http://localhost:3000/health

# 获取支持的AI模型
curl http://localhost:3000/api/ai/models
```

---

**更多信息请查看 [AI集成说明.md](AI集成说明.md)**

