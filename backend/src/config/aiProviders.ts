/**
 * AI服务提供商配置
 */
export interface AIProviderConfig {
  name: string;           // 提供商名称
  displayName: string;    // 显示名称
  apiKey: string;         // API密钥
  baseUrl: string;        // API地址
  models: string[];       // 支持的模型列表（可配置）
  enabled: boolean;       // 是否启用
}

export interface ModelDisplayConfig {
  provider: string;
  modelName: string;
  displayName: string;
}

export interface ModelConfig {
  provider: string;       // 提供商
  modelName: string;      // 模型名称
  displayName: string;    // 显示名称
  enabled: boolean;       // 是否启用
}

/**
 * 解析模型列表（从环境变量或使用默认值）
 */
function parseModels(envVar?: string, defaults: string[] = []): string[] {
  if (envVar) {
    return envVar.split(',').map(m => m.trim()).filter(m => m);
  }
  return defaults;
}

/**
 * 从环境变量加载AI提供商配置
 */
export function loadAIProvidersConfig(): Record<string, AIProviderConfig> {
  return {
    siliconflow: {
      name: 'siliconflow',
      displayName: '硅基流动',
      apiKey: process.env.SILICONFLOW_API_KEY || '',
      baseUrl: process.env.SILICONFLOW_BASE_URL || 'https://api.siliconflow.cn/v1',
      models: parseModels(
        process.env.SILICONFLOW_MODELS,
        ['deepseek-chat', 'deepseek-coder']
      ),
      enabled: process.env.SILICONFLOW_ENABLED === 'true'
    },
    dashscope: {
      name: 'dashscope',
      displayName: '阿里云百炼模型服务',
      apiKey: process.env.DASHSCOPE_API_KEY || '',
      baseUrl: process.env.DASHSCOPE_BASE_URL || 'https://dashscope.aliyuncs.com/api/v1',
      models: parseModels(
        process.env.DASHSCOPE_MODELS,
        ['qwen-turbo', 'qwen-plus', 'qwen-max']
      ),
      enabled: process.env.DASHSCOPE_ENABLED === 'true'
    }
  };
}

/**
 * 模型显示名称映射
 */
const MODEL_DISPLAY_NAMES: Record<string, Record<string, string>> = {
  siliconflow: {
    'deepseek-chat': 'DeepSeek Chat',
    'deepseek-coder': 'DeepSeek Coder'
  },
  dashscope: {
    'qwen-turbo': '通义千问 Turbo',
    'qwen-plus': '通义千问 Plus',
    'qwen-max': '通义千问 Max'
  }
};

/**
 * 从环境变量加载模型配置
 */
export function loadModelsConfig(): ModelConfig[] {
  const providers = loadAIProvidersConfig();
  const models: ModelConfig[] = [];

  // 遍历所有启用的提供商
  for (const [providerName, provider] of Object.entries(providers)) {
    if (provider.enabled) {
      // 为每个模型创建配置
      for (const modelName of provider.models) {
        const displayNames = MODEL_DISPLAY_NAMES[providerName] || {};
        models.push({
          provider: providerName,
          modelName,
          displayName: displayNames[modelName] || modelName,
          enabled: true
        });
      }
    }
  }

  return models;
}

/**
 * 获取启用的提供商列表
 */
export function getEnabledProviders(): AIProviderConfig[] {
  const providers = loadAIProvidersConfig();
  return Object.values(providers).filter(p => p.enabled && p.apiKey);
}

/**
 * 获取可用的模型列表
 */
export function getAvailableModels(): ModelConfig[] {
  return loadModelsConfig().filter(m => m.enabled);
}

