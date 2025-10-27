import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

/**
 * 交易记录属性接口
 */
interface TradeAttributes {
  id: number;
  modelId: number; // 模型ID
  stockCode: string; // 股票代码
  stockName: string; // 股票名称
  action: string; // 操作：buy、sell
  price: number; // 成交价格
  volume: number; // 成交数量
  amount: number; // 成交金额
  pnl?: number; // 盈亏（卖出时）
  holdingDays?: number; // 持仓天数
  date: Date; // 交易日期
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * 交易创建时可选字段
 */
interface TradeCreationAttributes extends Optional<TradeAttributes, 'id' | 'createdAt' | 'updatedAt' | 'pnl' | 'holdingDays'> {}

/**
 * 交易记录数据模型
 */
class Trade extends Model<TradeAttributes, TradeCreationAttributes> implements TradeAttributes {
  public id!: number;
  public modelId!: number;
  public stockCode!: string;
  public stockName!: string;
  public action!: string;
  public price!: number;
  public volume!: number;
  public amount!: number;
  public pnl?: number;
  public holdingDays?: number;
  public date!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Trade.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    modelId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: '模型ID'
    },
    stockCode: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: '股票代码'
    },
    stockName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: '股票名称'
    },
    action: {
      type: DataTypes.ENUM('buy', 'sell'),
      allowNull: false,
      comment: '操作类型'
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: '成交价格'
    },
    volume: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: '成交数量'
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      comment: '成交金额'
    },
    pnl: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      comment: '盈亏金额'
    },
    holdingDays: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      comment: '持仓天数'
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: '交易日期'
    }
  },
  {
    sequelize,
    tableName: 'trades',
    underscored: false,
    timestamps: true,
    indexes: [
      { fields: ['modelId'] },
      { fields: ['stockCode'] },
      { fields: ['date'] },
      { fields: ['modelId', 'date'] }
    ]
  }
);

export default Trade;

