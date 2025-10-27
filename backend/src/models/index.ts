import AIModel from './Model';
import Trade from './Trade';
import Account from './Account';
import Market from './Market';
import { sequelize } from '../config/database';

/**
 * 定义模型关联关系
 */
const setupAssociations = () => {
  // 模型与交易记录的一对多关系
  AIModel.hasMany(Trade, { foreignKey: 'modelId', as: 'trades' });
  Trade.belongsTo(AIModel, { foreignKey: 'modelId', as: 'model' });

  // 模型与账户的一对多关系
  AIModel.hasMany(Account, { foreignKey: 'modelId', as: 'accounts' });
  Account.belongsTo(AIModel, { foreignKey: 'modelId', as: 'model' });
};

// 初始化关联关系
setupAssociations();

export {
  sequelize,
  AIModel,
  Trade,
  Account,
  Market
};

