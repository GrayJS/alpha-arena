/**
 * AI服务提供商基类
 */
export interface ProviderConfig {
  apiKey: string;
  baseUrl: string;
}

export interface AIResponse {
  success: boolean;
  action?: 'buy' | 'sell' | 'hold';
  confidence?: number;
  reasoning?: string;
  stockCode?: string;
  stockName?: string;
  expectedPrice?: number;
  recommendation?: string;
  rawResponse?: any;  // 原始响应数据
}

export interface AIRequest {
  stockCode: string;
  stockName: string;
  currentPrice: number;
  historicalData?: any;
  context?: string;
}

/**
 * AI服务提供商抽象基类
 */
export abstract class BaseProvider {
  protected config: ProviderConfig;
  protected modelName: string;

  constructor(config: ProviderConfig, modelName: string) {
    this.config = config;
    this.modelName = modelName;
  }

  /**
   * 分析股票并给出交易建议
   */
  abstract analyze(request: AIRequest): Promise<AIResponse>;

  /**
   * 验证API配置
   */
  abstract validate(): Promise<boolean>;

  /**
   * 构建提示词
   */
  protected buildPrompt(request: AIRequest): string {
    return `
分析以下股票，给出交易建议：

股票代码: ${request.stockCode}
股票名称: ${request.stockName}
当前价格: ¥${request.currentPrice}

请分析这只股票，并给出以下格式的回答：
1. 交易建议：买入/卖出/持有
2. 信心度：0-100分
3. 理由：简要说明理由
4. 预期价格：如果不持有，给出预期价格

要求返回格式：
ACTION: buy/sell/hold
CONFIDENCE: 数字
REASONING: 理由
EXPECTED_PRICE: 价格
    `;
  }

  /**
   * 解析AI响应
   */
  protected parseResponse(content: string, request: AIRequest): AIResponse {
    const response: AIResponse = {
      success: true,
      stockCode: request.stockCode,
      stockName: request.stockName
    };

    // 提取ACTION
    const actionMatch = content.match(/ACTION:\s*(buy|sell|hold)/i);
    if (actionMatch) {
      response.action = actionMatch[1].toLowerCase() as 'buy' | 'sell' | 'hold';
    }

    // 提取CONFIDENCE
    const confidenceMatch = content.match(/CONFIDENCE:\s*(\d+)/i);
    if (confidenceMatch) {
      response.confidence = parseInt(confidenceMatch[1]);
    }

    // 提取REASONING
    const reasoningMatch = content.match(/REASONING:\s*(.+?)(?=EXPECTED_PRICE|$)/is);
    if (reasoningMatch) {
      response.reasoning = reasoningMatch[1].trim();
    }

    // 提取EXPECTED_PRICE
    const priceMatch = content.match(/EXPECTED_PRICE:\s*(\d+\.?\d*)/i);
    if (priceMatch) {
      response.expectedPrice = parseFloat(priceMatch[1]);
    }

    return response;
  }

  /**
   * 发送HTTP请求
   */
  protected async fetch(url: string, options: RequestInit): Promise<Response> {
    return fetch(url, options);
  }
}

