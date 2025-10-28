import { sequelize } from '../config/database';
import { seedData } from '../seeders/seedData';
import { generateAllMockData } from './mockData';
import logger from './logger';

/**
 * 重置数据库
 * 清除所有数据并重新初始化
 */
export const resetDatabase = async () => {
  try {
    logger.info('开始重置数据库...');

    // 测试数据库连接
    await sequelize.authenticate();
    logger.info('数据库连接成功');

    // 强制同步数据库（删除所有表并重新创建）
    await sequelize.sync({ force: true });
    logger.info('数据库表已重建');

    // 初始化种子数据
    await seedData();
    logger.info('种子数据初始化完成');

    // 生成模拟数据（开发环境）
    try {
      await generateAllMockData();
      logger.info('模拟数据生成完成');
    } catch (error) {
      logger.warn('生成模拟数据失败，但可以继续运行:', error);
    }

    logger.info('数据库重置完成！');
  } catch (error) {
    logger.error('重置数据库失败:', error);
    throw error;
  }
};

/**
 * 仅清除数据，不重建表结构
 */
export const clearDatabase = async () => {
  try {
    logger.info('开始清除数据库数据...');

    // 获取所有模型
    const { AIModel, Account, Trade, Market } = await import('../models');

    // 删除所有数据
    await Trade.destroy({ where: {}, truncate: true, cascade: true });
    logger.info('交易数据已清除');

    await Account.destroy({ where: {}, truncate: true, cascade: true });
    logger.info('账户数据已清除');

    await Market.destroy({ where: {}, truncate: true, cascade: true });
    logger.info('市场数据已清除');

    await AIModel.destroy({ where: {}, truncate: true, cascade: true });
    logger.info('模型数据已清除');

    logger.info('数据库清除完成！');

    // 重新初始化
    await seedData();
    logger.info('重新初始化种子数据完成');
  } catch (error) {
    logger.error('清除数据库失败:', error);
    throw error;
  }
};

// 如果直接运行此文件
if (require.main === module) {
  resetDatabase()
    .then(() => {
      logger.info('操作完成');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('操作失败:', error);
      process.exit(1);
    });
}

