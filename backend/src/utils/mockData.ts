/**
 * 模拟数据生成工具
 * 用于开发环境生成测试数据
 */

import { AIModel, Account, Trade } from '../models';
import logger from './logger';

/**
 * 生成模拟净值数据
 */
export async function generateMockNavData(modelId: number, days: number = 180) {
  const accounts = [];
  let nav = 1.0;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    // 模拟净值波动（随机游走）
    const change = (Math.random() - 0.45) * 0.02; // 稍微偏向上涨
    nav = Math.max(0.5, nav + change); // 确保净值不低于0.5

    const navChange = change;
    const navChangePercent = (change / (nav - change)) * 100;
    
    // 模拟资产分配
    const totalAssets = 1000000 * nav;
    const positions = totalAssets * (0.5 + Math.random() * 0.3); // 30%-80% 持仓
    const cash = totalAssets - positions;

    accounts.push({
      modelId,
      nav: parseFloat(nav.toFixed(4)),
      navChange: parseFloat(navChange.toFixed(4)),
      navChangePercent: parseFloat(navChangePercent.toFixed(4)),
      totalAssets: Math.round(totalAssets),
      cash: Math.round(cash),
      positions: Math.round(positions),
      date: date.toISOString().split('T')[0]
    });
  }

  await Account.bulkCreate(accounts);
  logger.info(`为模型 ${modelId} 生成了 ${accounts.length} 条净值数据`);
  
  return accounts;
}

/**
 * 生成模拟交易数据
 */
export async function generateMockTrades(modelId: number, days: number = 180) {
  const trades = [];
  const stocks = [
    { code: '000001', name: '平安银行' },
    { code: '000002', name: '万科A' },
    { code: '000858', name: '五粮液' },
    { code: '600000', name: '浦发银行' },
    { code: '600036', name: '招商银行' },
    { code: '600519', name: '贵州茅台' },
    { code: '000651', name: '格力电器' },
    { code: '002304', name: '洋河股份' }
  ];

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  let holdingPositions: Array<{
    stock: typeof stocks[0];
    buyPrice: number;
    buyDate: Date;
    volume: number;
  }> = [];

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // 周末不交易
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    // 30% 概率买入
    if (Math.random() < 0.3 && holdingPositions.length < 5) {
      const stock = stocks[Math.floor(Math.random() * stocks.length)];
      const price = 10 + Math.random() * 100;
      const volume = Math.floor(Math.random() * 1000) + 100;

      trades.push({
        modelId,
        stockCode: stock.code,
        stockName: stock.name,
        action: 'buy',
        price: parseFloat(price.toFixed(2)),
        volume,
        amount: Math.round(price * volume),
        date: date.toISOString().split('T')[0]
      });

      holdingPositions.push({
        stock,
        buyPrice: price,
        buyDate: new Date(date),
        volume
      });
    }

    // 20% 概率卖出
    if (Math.random() < 0.2 && holdingPositions.length > 0) {
      const position = holdingPositions.splice(
        Math.floor(Math.random() * holdingPositions.length), 
        1
      )[0];
      
      const sellPrice = position.buyPrice * (0.9 + Math.random() * 0.3);
      const volume = position.volume;
      const pnl = (sellPrice - position.buyPrice) * volume;
      const holdingDays = Math.floor((date.getTime() - position.buyDate.getTime()) / (1000 * 60 * 60 * 24));

      trades.push({
        modelId,
        stockCode: position.stock.code,
        stockName: position.stock.name,
        action: 'sell',
        price: parseFloat(sellPrice.toFixed(2)),
        volume,
        amount: Math.round(sellPrice * volume),
        pnl: parseFloat(pnl.toFixed(2)),
        holdingDays,
        date: date.toISOString().split('T')[0]
      });
    }
  }

  if (trades.length > 0) {
    await Trade.bulkCreate(trades);
    logger.info(`为模型 ${modelId} 生成了 ${trades.length} 条交易数据`);
  }

  return trades;
}

/**
 * 为所有模型生成模拟数据
 */
export async function generateAllMockData() {
  try {
    const models = await AIModel.findAll({ where: { isActive: true } });
    
    for (const model of models) {
      // 检查是否已有数据
      const existingAccounts = await Account.count({ where: { modelId: model.id } });
      
      if (existingAccounts === 0) {
        logger.info(`为模型 ${model.name} 生成模拟数据...`);
        await generateMockNavData(model.id);
        await generateMockTrades(model.id);
      } else {
        logger.info(`模型 ${model.name} 已有数据，跳过`);
      }
    }
    
    logger.info('模拟数据生成完成');
  } catch (error) {
    logger.error('生成模拟数据失败:', error);
    throw error;
  }
}


