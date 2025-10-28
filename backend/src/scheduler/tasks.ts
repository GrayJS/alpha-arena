/**
 * 定时任务
 * 用于定时拉取行情数据、计算收益等
 */

import cron from 'node-cron';
import logger from '../utils/logger';
import { syncMarketData } from '../services/dataSource';
import { AIModel, Trade, Account } from '../models';
import { calculateSharpeRatio, calculateMaxDrawdown } from '../services/tradeCalculator';

// 监控的主要股票代码列表（可以根据需要扩展）
const MONITORED_STOCKS = [
  '000001', // 平安银行
  '000002', // 万科A
  '600000', // 浦发银行
  '600036', // 招商银行
  '600519', // 贵州茅台
  '000858', // 五粮液
  '002594', // 比亚迪
];

/**
 * 定时拉取行情数据
 * 每个交易日收盘后执行（16:00）
 */
export const scheduleMarketDataSync = () => {
  cron.schedule('0 16 * * 1-5', async () => {
    logger.info('开始拉取当日行情数据');
    
    try {
      const count = await syncMarketData(MONITORED_STOCKS);
      logger.info(`当日行情数据拉取完成，共同步 ${count} 条数据`);
    } catch (error) {
      logger.error('拉取行情数据失败:', error);
    }
  }, {
    scheduled: true,
    timezone: "Asia/Shanghai"
  });
};

/**
 * 定时计算模型收益
 * 每个交易日收盘后执行（16:30）
 */
export const scheduleProfitCalculation = () => {
  cron.schedule('30 16 * * 1-5', async () => {
    logger.info('开始计算模型收益');
    
    try {
      // 获取所有活跃的模型
      const models = await AIModel.findAll({
        where: { isActive: true }
      });

      for (const model of models) {
        // 获取最新交易记录
        const latestTrade = await Trade.findOne({
          where: { modelId: model.id },
          order: [['date', 'DESC']]
        });

        if (!latestTrade) {
          logger.info(`模型 ${model.name} 尚无交易记录`);
          continue;
        }

        // 获取该模型的所有账户记录
        const accounts = await Account.findAll({
          where: { modelId: model.id },
          order: [['date', 'ASC']]
        });

        // 计算最新净值（简化版，实际应该根据持仓和最新市场价计算）
        const navs = accounts.map(acc => Number(acc.nav));
        if (navs.length === 0) {
          continue;
        }

        const latestNav = navs[navs.length - 1];
        
        // 这里可以添加更复杂的收益计算逻辑
        // 例如：根据最新市场价更新持仓市值，重新计算净值等
        
        logger.info(`模型 ${model.name} 当前净值: ${latestNav.toFixed(4)}`);
      }

      logger.info('模型收益计算完成');
    } catch (error) {
      logger.error('计算模型收益失败:', error);
    }
  }, {
    scheduled: true,
    timezone: "Asia/Shanghai"
  });
};

/**
 * 定时更新排行榜
 * 每小时执行一次
 */
export const scheduleLeaderboardUpdate = () => {
  cron.schedule('0 * * * *', async () => {
    logger.info('开始更新排行榜');
    
    try {
      // 排行榜数据是动态计算的，无需特殊更新逻辑
      // 这里可以添加缓存更新逻辑
      logger.info('排行榜更新完成');
    } catch (error) {
      logger.error('更新排行榜失败:', error);
    }
  }, {
    scheduled: true,
    timezone: "Asia/Shanghai"
  });
};

/**
 * 初始化所有定时任务
 */
export const initializeScheduler = () => {
  logger.info('初始化定时任务');
  
  // 根据环境变量决定是否启用定时任务
  const enableScheduler = process.env.ENABLE_SCHEDULER === 'true' || process.env.NODE_ENV === 'production';
  
  if (enableScheduler) {
    logger.info('定时任务已启用');
    scheduleMarketDataSync();
    scheduleProfitCalculation();
    scheduleLeaderboardUpdate();
  } else {
    logger.info('定时任务未启用（开发环境）');
  }
};

