import { AIModel, Account, Trade } from '../models';
import logger from '../utils/logger';

/**
 * 初始化种子数据
 * 用于开发环境快速搭建测试数据
 */
export const seedData = async () => {
  try {
    logger.info('开始初始化种子数据...');

    // 创建模型 - 基于实际支持的AI模型
    const models = await AIModel.bulkCreate([
      {
        name: 'DeepSeek Chat',
        algorithm: 'siliconflow:deepseek-chat',
        description: '基于硅基流动 DeepSeek Chat 的智能量化策略',
        riskProfile: 'moderate',
        isActive: true
      },
      {
        name: '通义千问 Turbo',
        algorithm: 'dashscope:qwen-turbo',
        description: '基于阿里云通义千问 Turbo 的快速决策模型',
        riskProfile: 'moderate',
        isActive: true
      },
      {
        name: '通义千问 Plus',
        algorithm: 'dashscope:qwen-plus',
        description: '基于阿里云通义千问 Plus 的高级分析模型',
        riskProfile: 'aggressive',
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

