/**
 * AI服务封装类
 * 统一管理模型服务
 */
import { BaseProvider, AIRequest, AIResponse } from './providers/BaseProvider';
import { ProviderFactory } from './ProviderFactory';
import AIModel from '../../models/Model';
import logger from '../../utils/logger';

export interface AIModelConfig {
  provider: string;
  modelName: string;
}

export class AIService {
  private providers: Map<number, BaseProvider> = new Map();
  private modelConfigs: Map<number, AIModelConfig> = new Map();

  /**
   * 为模型初始化AI服务
   */
  async initializeModel(modelId: number, config?: AIModelConfig): Promise<boolean> {
    try {
      // 如果没有提供配置，从数据库读取模型信息
      if (!config) {
        const model = await AIModel.findByPk(modelId);
        if (!model) {
          logger.error(`模型不存在: ${modelId}`);
          return false;
        }

        // 从模型算法的字段中读取提供商和模型信息
        // 格式: "provider:modelName" 例如 "siliconflow:deepseek-chat"
        const parts = model.algorithm.split(':');
        if (parts.length === 2) {
          config = {
            provider: parts[0],
            modelName: parts[1]
          };
        } else {
          // 默认配置
          config = {
            provider: 'siliconflow',
            modelName: 'deepseek-chat'
          };
        }
      }

      // 创建提供商实例
      const provider = ProviderFactory.createProvider(config.provider, config.modelName);
      
      if (!provider) {
        logger.error(`无法创建AI服务: ${config.provider}`);
        return false;
      }

      // 验证服务
      const isValid = await provider.validate();
      if (!isValid) {
        logger.error(`AI服务验证失败: ${config.provider}`);
        return false;
      }

      this.providers.set(modelId, provider);
      this.modelConfigs.set(modelId, config);
      
      logger.info(`AI服务初始化成功: ${config.provider}:${config.modelName} (Model ${modelId})`);
      return true;
    } catch (error) {
      logger.error(`AI服务初始化失败:`, error);
      return false;
    }
  }

  /**
   * 分析股票
   */
  async analyzeStock(modelId: number, request: AIRequest): Promise<AIResponse | null> {
    try {
      const provider = this.providers.get(modelId);
      
      if (!provider) {
        logger.warn(`模型 ${modelId} 没有初始化AI服务`);
        return null;
      }

      const response = await provider.analyze(request);
      
      if (response.success) {
        logger.info(`模型 ${modelId} 分析股票 ${request.stockCode}: ${response.action}`);
      } else {
        logger.warn(`模型 ${modelId} 分析失败: ${response.reasoning}`);
      }

      return response;
    } catch (error) {
      logger.error(`模型 ${modelId} 分析股票失败:`, error);
      return null;
    }
  }

  /**
   * 获取模型配置
   */
  getModelConfig(modelId: number): AIModelConfig | undefined {
    return this.modelConfigs.get(modelId);
  }

  /**
   * 获取提供商
   */
  getProvider(modelId: number): BaseProvider | undefined {
    return this.providers.get(modelId);
  }
}

export default new AIService();

// 导出类型
export { AIRequest, AIResponse };

