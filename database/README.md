# 数据库配置说明

## PostgreSQL 数据库配置

本项目使用 PostgreSQL 作为数据库，用于存储AI模型、交易记录、账户净值等数据。

## 初始化数据库

### 1. 创建数据库

```sql
CREATE DATABASE alpha_arena;
```

### 2. 配置环境变量

在 `backend/.env` 文件中配置数据库连接信息：

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=alpha_arena
DB_USER=postgres
DB_PASSWORD=postgres
```

### 3. 同步数据库模型

```bash
cd backend
npm run dev
```

在开发环境下，系统会自动同步数据库模型。

## 数据模型说明

### 1. models - AI模型表

存储AI模型的基本信息。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| name | STRING(100) | 模型名称 |
| algorithm | STRING(50) | 算法类型 |
| description | TEXT | 模型描述 |
| developerId | INTEGER | 开发者ID |
| riskProfile | ENUM | 风险偏好 |
| isActive | BOOLEAN | 是否启用 |

### 2. trades - 交易记录表

存储每笔交易的详细信息。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| modelId | INTEGER | 模型ID |
| stockCode | STRING(20) | 股票代码 |
| stockName | STRING(50) | 股票名称 |
| action | ENUM | 操作类型（buy/sell） |
| price | DECIMAL | 成交价格 |
| volume | INTEGER | 成交数量 |
| amount | DECIMAL | 成交金额 |
| pnl | DECIMAL | 盈亏 |
| holdingDays | INTEGER | 持仓天数 |
| date | DATE | 交易日期 |

### 3. accounts - 账户表

存储模型的净值变化。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| modelId | INTEGER | 模型ID |
| nav | DECIMAL | 净值 |
| navChange | DECIMAL | 净值变化（金额） |
| navChangePercent | DECIMAL | 净值变化（百分比） |
| totalAssets | DECIMAL | 总资产 |
| cash | DECIMAL | 现金 |
| positions | DECIMAL | 持仓市值 |
| date | DATE | 日期 |

### 4. markets - 市场数据表

存储股票的行情数据。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| stockCode | STRING(20) | 股票代码 |
| stockName | STRING(50) | 股票名称 |
| open | DECIMAL | 开盘价 |
| close | DECIMAL | 收盘价 |
| high | DECIMAL | 最高价 |
| low | DECIMAL | 最低价 |
| volume | BIGINT | 成交量 |
| amount | DECIMAL | 成交额 |
| change | DECIMAL | 涨跌额 |
| changePercent | DECIMAL | 涨跌幅 |
| date | DATE | 日期 |

## 索引说明

- trades 表：modelId, stockCode, date, (modelId, date)
- accounts 表：modelId, date, (modelId, date)
- markets 表：stockCode, date, (stockCode, date) unique

## 数据关联

- Model 1:N Trade
- Model 1:N Account

## 数据备份

建议定期备份数据库：

```bash
pg_dump -U postgres alpha_arena > backup_$(date +%Y%m%d).sql
```

## 恢复数据库

```bash
psql -U postgres alpha_arena < backup_20240101.sql
```

