import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

/**
 * 模型属性接口
 */
interface ModelAttributes {
  id: number;
  name: string; // 模型名称
  algorithm: string; // 算法类型（GPT、XGBoost、LSTM等）
  description?: string; // 模型描述
  developerId?: number; // 开发者ID
  riskProfile: string; // 风险偏好：conservative、moderate、aggressive
  isActive: boolean; // 是否启用
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * 模型创建时可选字段
 */
interface ModelCreationAttributes extends Optional<ModelAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

/**
 * AI模型数据模型
 */
class AIModel extends Model<ModelAttributes, ModelCreationAttributes> implements ModelAttributes {
  public id!: number;
  public name!: string;
  public algorithm!: string;
  public description?: string;
  public developerId?: number;
  public riskProfile!: string;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

AIModel.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: '模型名称'
    },
    algorithm: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: '算法类型'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '模型描述'
    },
    developerId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      comment: '开发者ID'
    },
    riskProfile: {
      type: DataTypes.ENUM('conservative', 'moderate', 'aggressive'),
      allowNull: false,
      defaultValue: 'moderate',
      comment: '风险偏好'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: '是否启用'
    }
  },
  {
    sequelize,
    tableName: 'models',
    underscored: false,
    timestamps: true
  }
);

export default AIModel;

