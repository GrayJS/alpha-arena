import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

/**
 * 市场数据属性接口
 */
interface MarketAttributes {
  id: number;
  stockCode: string; // 股票代码
  stockName: string; // 股票名称
  open: number; // 开盘价
  close: number; // 收盘价
  high: number; // 最高价
  low: number; // 最低价
  volume: number; // 成交量
  amount: number; // 成交额
  change: number; // 涨跌额
  changePercent: number; // 涨跌幅
  date: Date | string; // 日期（支持Date对象或字符串）
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * 市场数据创建时可选字段
 */
interface MarketCreationAttributes extends Optional<MarketAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

/**
 * 市场数据模型
 */
class Market extends Model<MarketAttributes, MarketCreationAttributes> implements MarketAttributes {
  public id!: number;
  public stockCode!: string;
  public stockName!: string;
  public open!: number;
  public close!: number;
  public high!: number;
  public low!: number;
  public volume!: number;
  public amount!: number;
  public change!: number;
  public changePercent!: number;
  public date!: Date | string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Market.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
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
    open: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: '开盘价'
    },
    close: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: '收盘价'
    },
    high: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: '最高价'
    },
    low: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: '最低价'
    },
    volume: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: '成交量'
    },
    amount: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
      comment: '成交额'
    },
    change: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      comment: '涨跌额'
    },
    changePercent: {
      type: DataTypes.DECIMAL(8, 4),
      allowNull: false,
      defaultValue: 0,
      comment: '涨跌幅'
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: '日期'
    }
  },
  {
    sequelize,
    tableName: 'markets',
    underscored: false,
    timestamps: true,
    indexes: [
      { fields: ['stockCode'] },
      { fields: ['date'] },
      { fields: ['stockCode', 'date'], unique: true }
    ]
  }
);

export default Market;

