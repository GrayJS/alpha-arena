import { BaseProvider, AIRequest, AIResponse, ProviderConfig } from './BaseProvider';
import logger from '../../../utils/logger';

/**
 * 阿里云百炼模型服务提供商
 */
export class DashScopeProvider extends BaseProvider {
  constructor(config: ProviderConfig, modelName: string = 'qwen-turbo') {
    super(config, modelName);
  }

  async analyze(request: AIRequest): Promise<AIResponse> {
    try {
      const url = `${this.config.baseUrl}/services/aigc/text-generation/generation`;
      const prompt = this.buildPrompt(request);

      const response = await this.fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
          'X-DashScope-SSE': 'disable'
        },
        body: JSON.stringify({
          model: this.modelName,
          input: {
            messages: [
              {
                role: 'system',
                content: '你是一位专业的股票量化分析师，擅长分析股票并提供交易建议。'
              },
              {
                role: 'user',
                content: prompt
              }
            ]
          },
          parameters: {
            temperature: 0.7,
            max_tokens: 500
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`阿里云API请求失败: ${response.status} ${errorText}`);
      }

      const data: any = await response.json();
      const aiContent = data.output?.choices?.[0]?.message?.content || '';

      const result = this.parseResponse(aiContent, request);
      result.rawResponse = data;
      
      return result;
    } catch (error) {
      logger.error('阿里云分析失败:', error);
      return {
        success: false,
        reasoning: `阿里云分析失败: ${error instanceof Error ? error.message : 'Unknown error'}`,
        stockCode: request.stockCode,
        stockName: request.stockName
      };
    }
  }

  async validate(): Promise<boolean> {
    try {
      const url = `${this.config.baseUrl}/services/aigc/text-generation/generation`;
      const response = await this.fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
          'X-DashScope-SSE': 'disable'
        },
        body: JSON.stringify({
          model: this.modelName,
          input: {
            messages: [{ role: 'user', content: 'test' }]
          },
          parameters: {
            max_tokens: 10
          }
        })
      });

      return response.ok;
    } catch (error) {
      logger.error('阿里云验证失败:', error);
      return false;
    }
  }
}

