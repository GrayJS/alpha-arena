import AIService, { AIRequest } from './BaseAIService';
import { AIModel } from '../../models/Model';
import logger from '../../utils/logger';

/**
 * AI模型控制器
 * 负责调用AI服务并生成交易建议
 */
export class AIModelController {
  /**
   * 初始化模型AI服务
   * @param modelId 模型ID
   * @param provider 提供商名称（可选，从模型配置读取）
   * @param modelName 模型名称（可选）
   */
  async initializeModel(
    modelId: number,
    provider?: string,
    modelName?: string
  ): Promise<boolean> {
    try {
      let config;
      
      if (provider && modelName) {
        config = { provider, modelName };
      }

      return await AIService.initializeModel(modelId, config);
    } catch (error) {
      logger.error(`模型 ${modelId} 初始化失败:`, error);
      return false;
    }
  }

  /**
   * 分析股票
   */
  async analyzeStock(
    modelId: number,
    stockCode: string,
    stockName: string,
    currentPrice: number
  ) {
    const request: AIRequest = {
      stockCode,
      stockName,
      currentPrice
    };

    return await AIService.analyzeStock(modelId, request);
  }

  /**
   * 批量分析股票
   */
  async batchAnalyzeStocks(
    modelId: number,
    stocks: Array<{ stockCode: string; stockName: string; currentPrice: number }>
  ) {
    const results = [];

    for (const stock of stocks) {
      const result = await this.analyzeStock(
        modelId,
        stock.stockCode,
        stock.stockName,
        stock.currentPrice
      );
      
      if (result) {
        results.push({
          ...stock,
          ...result
        });
      }
    }

    return results;
  }
}

export default new AIModelController();

