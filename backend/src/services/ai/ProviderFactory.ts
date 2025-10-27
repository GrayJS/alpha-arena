import { BaseProvider } from './providers/BaseProvider';
import { SiliconFlowProvider } from './providers/SiliconFlowProvider';
import { DashScopeProvider } from './providers/DashScopeProvider';
import { loadAIProvidersConfig, AIProviderConfig } from '../../config/aiProviders';
import logger from '../../utils/logger';

/**
 * AI服务提供商工厂
 */
export class ProviderFactory {
  private static providers: Map<string, AIProviderConfig> = new Map();

  static {
    // 初始化时加载配置
    const config = loadAIProvidersConfig();
    Object.entries(config).forEach(([key, value]) => {
      this.providers.set(key, value);
    });
  }

  /**
   * 创建提供商实例
   */
  static createProvider(providerName: string, modelName: string): BaseProvider | null {
    try {
      const providerConfig = this.providers.get(providerName);
      
      if (!providerConfig) {
        logger.warn(`未知的提供商: ${providerName}`);
        return null;
      }

      if (!providerConfig.enabled) {
        logger.warn(`提供商 ${providerName} 未启用`);
        return null;
      }

      if (!providerConfig.apiKey) {
        logger.warn(`提供商 ${providerName} API密钥未配置`);
        return null;
      }

      // 根据提供商名称创建对应的实例
      switch (providerName) {
        case 'siliconflow':
          return new SiliconFlowProvider(
            {
              apiKey: providerConfig.apiKey,
              baseUrl: providerConfig.baseUrl
            },
            modelName
          );

        case 'dashscope':
          return new DashScopeProvider(
            {
              apiKey: providerConfig.apiKey,
              baseUrl: providerConfig.baseUrl
            },
            modelName
          );

        default:
          logger.warn(`不支持的提供商: ${providerName}`);
          return null;
      }
    } catch (error) {
      logger.error(`创建提供商失败 (${providerName}):`, error);
      return null;
    }
  }

  /**
   * 获取可用的提供商列表
   */
  static getAvailableProviders(): AIProviderConfig[] {
    return Array.from(this.providers.values()).filter(p => p.enabled);
  }

  /**
   * 获取提供商配置
   */
  static getProviderConfig(name: string): AIProviderConfig | undefined {
    return this.providers.get(name);
  }
}

