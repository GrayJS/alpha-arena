# API 使用示例

本文档提供 Alpha Arena 后端 API 的详细使用示例。

## 基础信息

- **Base URL**: `http://localhost:3000/api`
- **Response Format**: JSON
- **统一响应格式**:
```json
{
  "code": 0,
  "data": {},
  "message": "success"
}
```

---

## API 端点

### 1. 模型管理 API

#### 获取模型列表
```http
GET /api/models
```

**查询参数**:
- `page`: 页码（默认 1）
- `pageSize`: 每页数量（默认 10）
- `isActive`: 是否启用（true/false）
- `riskProfile`: 风险偏好（conservative/moderate/aggressive）

**示例**:
```bash
curl http://localhost:3000/api/models?page=1&pageSize=10
```

**响应**:
```json
{
  "code": 0,
  "data": {
    "list": [
      {
        "id": 1,
        "name": "GPT-4 量化策略",
        "algorithm": "GPT-4",
        "description": "基于GPT-4的智能量化策略",
        "riskProfile": "aggressive",
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 10,
    "page": 1,
    "pageSize": 10,
    "totalPages": 1
  },
  "message": "success"
}
```

#### 获取模型详情
```http
GET /api/models/:id
```

**示例**:
```bash
curl http://localhost:3000/api/models/1
```

#### 创建新模型
```http
POST /api/models
```

**请求体**:
```json
{
  "name": "新模型",
  "algorithm": "XGBoost",
  "description": "模型描述",
  "riskProfile": "moderate"
}
```

---

### 2. 交易记录 API

#### 获取交易记录列表
```http
GET /api/trades
```

**查询参数**:
- `modelId`: 模型ID
- `stockCode`: 股票代码
- `action`: 操作类型（buy/sell）
- `startDate`: 开始日期（YYYY-MM-DD）
- `endDate`: 结束日期（YYYY-MM-DD）
- `page`: 页码
- `pageSize`: 每页数量

**示例**:
```bash
curl "http://localhost:3000/api/trades?modelId=1&startDate=2024-01-01&endDate=2024-12-31"
```

#### 获取单笔交易详情
```http
GET /api/trades/:id
```

#### 创建交易记录
```http
POST /api/trades
```

**请求体**:
```json
{
  "modelId": 1,
  "stockCode": "000001",
  "stockName": "平安银行",
  "action": "buy",
  "price": 12.50,
  "volume": 100,
  "date": "2024-01-15"
}
```

#### 获取交易统计
```http
GET /api/trades/stats/:modelId
```

**响应**:
```json
{
  "code": 0,
  "data": {
    "totalTrades": 150,
    "buyTrades": 80,
    "sellTrades": 70,
    "totalPnL": "12500.50",
    "winningTrades": 45,
    "losingTrades": 25,
    "winRate": "64.29%",
    "averagePnL": "83.34"
  },
  "message": "success"
}
```

---

### 3. 账户数据 API

#### 获取模型净值数据
```http
GET /api/accounts/:modelId/nav
```

**查询参数**:
- `startDate`: 开始日期
- `endDate`: 结束日期

**示例**:
```bash
curl "http://localhost:3000/api/accounts/1/nav?startDate=2024-01-01&endDate=2024-12-31"
```

**响应**:
```json
{
  "code": 0,
  "data": {
    "list": [
      {
        "date": "2024-01-01",
        "nav": 1.0,
        "navChange": 0,
        "navChangePercent": 0,
        "totalAssets": 1000000,
        "cash": 500000,
        "positions": 500000
      }
    ],
    "stats": {
      "initialNav": "1.0000",
      "currentNav": "1.4520",
      "totalReturn": "+45.20%",
      "period": 180
    }
  },
  "message": "success"
}
```

#### 多模型净值对比
```http
GET /api/accounts/compare
```

**查询参数**:
- `modelIds`: 模型ID列表（逗号分隔）
- `startDate`: 开始日期
- `endDate`: 结束日期

**示例**:
```bash
curl "http://localhost:3000/api/accounts/compare?modelIds=1,2,3"
```

#### 获取账户当前状态
```http
GET /api/accounts/:modelId/current
```

---

### 4. 排行榜 API

#### 获取排行榜
```http
GET /api/leaderboard
```

**查询参数**:
- `sortBy`: 排序字段（return/sharpe/drawdown）
- `sortOrder`: 排序顺序（asc/desc）
- `period`: 时间周期（total/month/week）

**示例**:
```bash
curl "http://localhost:3000/api/leaderboard?sortBy=return&sortOrder=desc"
```

**响应**:
```json
{
  "code": 0,
  "data": [
    {
      "modelId": 1,
      "modelName": "GPT-4 量化策略",
      "algorithm": "GPT-4",
      "riskProfile": "aggressive",
      "currentNav": "1.4520",
      "totalReturn": "45.20",
      "sharpeRatio": "2.50",
      "maxDrawdown": "8.50",
      "winRate": "68.50%",
      "totalTrades": 150,
      "startDate": "2024-01-01",
      "endDate": "2024-12-31"
    }
  ],
  "message": "success"
}
```

#### 获取Top N模型
```http
GET /api/leaderboard/top
```

**查询参数**:
- `limit`: 返回数量（默认 5）
- `sortBy`: 排序字段（return/sharpe/drawdown）
- `sortOrder`: 排序顺序（asc/desc）

**示例**:
```bash
curl "http://localhost:3000/api/leaderboard/top?limit=3&sortBy=sharpe&sortOrder=desc"
```

---

### 5. 市场数据 API

#### 获取指数数据
```http
GET /api/markets/indices
```

**响应**:
```json
{
  "code": 0,
  "data": {
    "sh": {
      "code": "000001",
      "name": "上证指数",
      "price": 3085.12,
      "change": 12.34,
      "changePercent": 0.4
    },
    "sz": {
      "code": "399001",
      "name": "深证成指",
      "price": 11245.67,
      "change": -23.45,
      "changePercent": -0.21
    },
    "cyb": {
      "code": "399006",
      "name": "创业板指",
      "price": 2267.89,
      "change": 8.92,
      "changePercent": 0.39
    }
  },
  "message": "success"
}
```

> 说明：开发环境该端点返回基于时间种子的模拟数据。

---

## 错误处理

### 错误响应格式
```json
{
  "code": -1,
  "message": "错误信息",
  "error": "详细错误信息（开发环境）"
}
```

### 常见错误码
- `400`: 请求参数错误
- `401`: 未授权
- `404`: 资源不存在
- `500`: 服务器错误

---

## 使用示例

### JavaScript/TypeScript

```typescript
import axios from 'axios';

// 获取模型列表
const response = await axios.get('http://localhost:3000/api/models', {
  params: {
    page: 1,
    pageSize: 10
  }
});

console.log(response.data);
```

### Python

```python
import requests

# 获取模型列表
response = requests.get('http://localhost:3000/api/models', params={
    'page': 1,
    'pageSize': 10
})

print(response.json())
```

### 使用示例 - React

```typescript
import { getModels } from './services/modelService';

// 获取模型列表
const fetchModels = async () => {
  try {
    const response = await getModels({ page: 1, pageSize: 10 });
    console.log(response.data.list);
  } catch (error) {
    console.error('获取模型列表失败:', error);
  }
};
```

---

## 测试工具

### Postman
导入以下 JSON 配置：
```json
{
  "info": {
    "name": "Alpha Arena API"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000/api"
    }
  ]
}
```

### cURL 示例
```bash
# 获取健康状态
curl http://localhost:3000/health

# 获取所有模型
curl http://localhost:3000/api/models

# 获取模型1的净值数据
curl http://localhost:3000/api/accounts/1/nav

# 获取排行榜
curl http://localhost:3000/api/leaderboard?sortBy=return&sortOrder=desc
```

---

## 注意事项

1. **开发环境**: 数据库为空时会自动生成种子数据
2. **模拟数据**: 首次启动会自动生成180天历史数据
3. **跨域**: 前端已配置 CORS
4. **超时**: API 请求超时时间为 10 秒
5. **分页**: 建议使用合理的 pageSize（默认 10，最大 100）

---

## 更新日志

- **v0.1.0** (2024-01): 初始版本，支持 MVP 功能


