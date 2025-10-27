import { BaseProvider, AIRequest, AIResponse, ProviderConfig } from './BaseProvider';
import logger from '../../../utils/logger';

/**
 * 硅基流动提供商
 */
export class SiliconFlowProvider extends BaseProvider {
  constructor(config: ProviderConfig, modelName: string = 'deepseek-chat') {
    super(config, modelName);
  }

  async analyze(request: AIRequest): Promise<AIResponse> {
    try {
      const url = `${this.config.baseUrl}/chat/completions`;
      const prompt = this.buildPrompt(request);

      const response = await this.fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: this.modelName,
          messages: [
            {
              role: 'system',
              content: '你是一位专业的股票量化分析师，擅长分析股票并提供交易建议。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`硅基流动API请求失败: ${response.status} ${errorText}`);
      }

      const data: any = await response.json();
      const aiContent = data.choices?.[0]?.message?.content || '';

      const result = this.parseResponse(aiContent, request);
      result.rawResponse = data;
      
      return result;
    } catch (error) {
      logger.error('硅基流动分析失败:', error);
      return {
        success: false,
        reasoning: `硅基流动分析失败: ${error instanceof Error ? error.message : 'Unknown error'}`,
        stockCode: request.stockCode,
        stockName: request.stockName
      };
    }
  }

  async validate(): Promise<boolean> {
    try {
      const url = `${this.config.baseUrl}/chat/completions`;
      const response = await this.fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: this.modelName,
          messages: [{ role: 'user', content: 'test' }],
          max_tokens: 10
        })
      });

      return response.ok;
    } catch (error) {
      logger.error('硅基流动验证失败:', error);
      return false;
    }
  }
}

