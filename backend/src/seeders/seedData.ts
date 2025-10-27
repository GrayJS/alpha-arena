import { AIModel, Account, Trade } from '../models';
import logger from '../utils/logger';

/**
 * 初始化种子数据
 * 用于开发环境快速搭建测试数据
 */
export const seedData = async () => {
  try {
    logger.info('开始初始化种子数据...');

    // 创建模型
    const models = await AIModel.bulkCreate([
      {
        name: 'GPT-4 量化策略',
        algorithm: 'GPT-4',
        description: '基于GPT-4的智能量化策略',
        riskProfile: 'aggressive',
        isActive: true
      },
      {
        name: 'XGBoost 预测模型',
        algorithm: 'XGBoost',
        description: '使用XGBoost进行股票价格预测',
        riskProfile: 'moderate',
        isActive: true
      },
      {
        name: 'LSTM 时序预测',
        algorithm: 'LSTM',
        description: '基于LSTM的时序预测模型',
        riskProfile: 'conservative',
        isActive: true
      }
    ]);

    logger.info(`创建了 ${models.length} 个模型`);

    // 创建初始账户净值
    const today = new Date();
    const accounts = [];
    
    for (const model of models) {
      accounts.push({
        modelId: model.id,
        nav: 1.0,
        navChange: 0,
        navChangePercent: 0,
        totalAssets: 1000000,
        cash: 1000000,
        positions: 0,
        date: today
      });
    }
    
    await Account.bulkCreate(accounts);
    logger.info(`创建了 ${accounts.length} 个初始账户`);

    logger.info('种子数据初始化完成！');
  } catch (error) {
    logger.error('种子数据初始化失败:', error);
    throw error;
  }
};

