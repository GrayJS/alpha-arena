/**
 * 交易计算服务
 * 用于计算模型收益、净值、风险指标等
 */

import logger from '../utils/logger';

interface TradeData {
  price: number;
  volume: number;
  action: 'buy' | 'sell';
}

/**
 * 计算单笔交易的盈亏
 */
export const calculateTradePnL = (buyPrice: number, sellPrice: number, volume: number): number => {
  return (sellPrice - buyPrice) * volume;
};

/**
 * 计算累计收益率
 */
export const calculateTotalReturn = (initialNav: number, currentNav: number): number => {
  return ((currentNav - initialNav) / initialNav) * 100;
};

/**
 * 计算夏普比率
 */
export const calculateSharpeRatio = (returns: number[], riskFreeRate: number = 0.03): number => {
  if (returns.length === 0) return 0;

  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length;
  const stdDev = Math.sqrt(variance);

  if (stdDev === 0) return 0;

  return (avgReturn - riskFreeRate) / stdDev * Math.sqrt(252); // 年化夏普比率
};

/**
 * 计算最大回撤
 */
export const calculateMaxDrawdown = (navs: number[]): { maxDrawdown: number; period: [number, number] } => {
  let maxNav = navs[0];
  let maxDrawdown = 0;
  let maxDrawdownStart = 0;
  let maxDrawdownEnd = 0;

  for (let i = 1; i < navs.length; i++) {
    if (navs[i] > maxNav) {
      maxNav = navs[i];
      maxDrawdownStart = i;
    }

    const drawdown = (maxNav - navs[i]) / maxNav;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
      maxDrawdownEnd = i;
    }
  }

  return {
    maxDrawdown: maxDrawdown * 100,
    period: [maxDrawdownStart, maxDrawdownEnd]
  };
};

/**
 * 计算胜率
 */
export const calculateWinRate = (trades: any[]): number => {
  if (trades.length === 0) return 0;

  const profitableTrades = trades.filter(trade => (trade.pnl || 0) > 0).length;
  return (profitableTrades / trades.length) * 100;
};

/**
 * 计算平均持仓天数
 */
export const calculateAvgHoldingDays = (trades: any[]): number => {
  if (trades.length === 0) return 0;

  const holdingDays = trades
    .filter(trade => trade.holdingDays)
    .map(trade => trade.holdingDays);

  if (holdingDays.length === 0) return 0;

  return holdingDays.reduce((a, b) => a + b, 0) / holdingDays.length;
};

logger.info('交易计算服务已加载');

