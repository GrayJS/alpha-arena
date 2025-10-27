import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

/**
 * 账户属性接口
 */
interface AccountAttributes {
  id: number;
  modelId: number; // 模型ID
  nav: number; // 净值（Net Asset Value）
  navChange: number; // 净值变化（金额）
  navChangePercent: number; // 净值变化（百分比）
  totalAssets: number; // 总资产
  cash: number; // 现金
  positions: number; // 持仓市值
  date: Date; // 日期
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * 账户创建时可选字段
 */
interface AccountCreationAttributes extends Optional<AccountAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

/**
 * 账户数据模型
 */
class Account extends Model<AccountAttributes, AccountCreationAttributes> implements AccountAttributes {
  public id!: number;
  public modelId!: number;
  public nav!: number;
  public navChange!: number;
  public navChangePercent!: number;
  public totalAssets!: number;
  public cash!: number;
  public positions!: number;
  public date!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Account.init(
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
    nav: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      defaultValue: 1.0,
      comment: '净值'
    },
    navChange: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      defaultValue: 0,
      comment: '净值变化（金额）'
    },
    navChangePercent: {
      type: DataTypes.DECIMAL(8, 4),
      allowNull: false,
      defaultValue: 0,
      comment: '净值变化（百分比）'
    },
    totalAssets: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      comment: '总资产'
    },
    cash: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      comment: '现金'
    },
    positions: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      comment: '持仓市值'
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: '日期'
    }
  },
  {
    sequelize,
    tableName: 'accounts',
    underscored: false,
    timestamps: true,
    indexes: [
      { fields: ['modelId'] },
      { fields: ['date'] },
      { fields: ['modelId', 'date'] }
    ]
  }
);

export default Account;

