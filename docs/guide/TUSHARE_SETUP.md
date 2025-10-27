# Tushare API 配置说明

## 关于 Tushare

Tushare 是一个获取中国金融市场数据和财经数据的开源 Python 库。

## 安装选项

### 方案1：使用官方 Python 库（推荐）

Tushare 是 Python 库，需要在 Node.js 中使用：

```bash
# 安装 Tushare Python 包
pip install tushare

# 或者使用 pythonexec 调用 Python 脚本
```

### 方案2：使用第三方 JavaScript 封装

可以使用第三方封装的 Tushare JS 库：

```bash
npm install tushare-api
```

### 方案3：直接使用 API 接口

不需要安装包，直接调用 Tushare REST API：

```javascript
// 示例：获取股票数据
axios.get('http://api.tushare.pro', {
  params: {
    api_name: 'daily',
    token: 'your-token',
    params: {
      ts_code: '000001.SZ',
      trade_date: '20240101'
    }
  }
});
```

## 配置说明

1. 注册 Tushare 账号：https://tushare.pro/register
2. 获取 API Token
3. 在 `.env` 文件中配置：

```
TUSHARE_TOKEN=your_token_here
```

## MVP 阶段建议

在 MVP 阶段，可以暂时**使用模拟数据**，不强制集成 Tushare。这样可以：
- 快速开发功能
- 不受数据源限制
- 方便测试

后续再集成真实数据源。

