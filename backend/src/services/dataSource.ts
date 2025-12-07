/**
 * 数据源服务
 * 用于从各种数据源（Tushare、聚宽等）获取A股市场数据
 */

import axios from 'axios';
import logger from '../utils/logger';
import Market from '../models/Market';

// Tushare API 配置
const TUSHARE_TOKEN = process.env.TUSHARE_TOKEN || '';
logger.info('Tushare Token: %s', TUSHARE_TOKEN);
const TUSHARE_API_URL = 'http://api.tushare.pro';

/**
 * 调用Tushare API
 */
const callTushareAPI = async (api_name: string, params: any): Promise<any> => {
  if (!TUSHARE_TOKEN) {
    logger.warn('Tushare Token未配置，使用模拟数据');
    return null;
  }

  try {
    const response = await axios.post(TUSHARE_API_URL, {
      api_name,
      token: TUSHARE_TOKEN,
      params
    });

    if (response.data && response.data.code === 0) {
      return response.data.data;
    } else {
      logger.error(`Tushare API调用失败: ${response.data?.msg || '未知错误'}`);
      console.log('response.data', response.data);
      return null;
    }
  } catch (error) {
    logger.error('Tushare API请求失败:', error);
    console.log('error', error);
    return null;
  }
};

/**
 * 获取股票列表
 */
export const getStockList = async (): Promise<any[]> => {
  try {
    const result = await callTushareAPI('stock_basic', {
      exchange: '',
      list_status: 'L',
      fields: 'ts_code,symbol,name,area,industry,market'
    });

    if (!result) {
      logger.info('使用模拟股票列表');
      return [];
    }

    return result.items || [];
  } catch (error) {
    logger.error('获取股票列表失败:', error);
    throw error;
  }
};

/**
 * 获取市场行情数据
 */
export const getMarketData = async (stockCode: string, startDate: string, endDate: string): Promise<any[]> => {
  try {
    // 转换日期格式：YYYYMMDD
    const startDateFormatted = startDate.replace(/-/g, '');
    const endDateFormatted = endDate.replace(/-/g, '');
    
    // 确保股票代码格式正确（需要.SZ或.SH后缀）
    let tsCode = stockCode;
    if (!tsCode.includes('.')) {
      tsCode = `${stockCode}.SZ`;
    }

    const result = await callTushareAPI('daily', {
      ts_code: tsCode,
      start_date: startDateFormatted,
      end_date: endDateFormatted
    });

    if (!result) {
      logger.info(`使用模拟市场数据: ${stockCode}`);
      return [];
    }

    return result.items || [];
  } catch (error) {
    logger.error('获取市场数据失败:', error);
    throw error;
  }
};

/**
 * 获取指数数据
 */
export const getIndexData = async (indexCode: string): Promise<any> => {
  try {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const endDate = today.toISOString().split('T')[0].replace(/-/g, '');
    const startDate = yesterday.toISOString().split('T')[0].replace(/-/g, '');

    const result = await callTushareAPI('index_daily', {
      ts_code: indexCode,
      start_date: startDate,
      end_date: endDate
    });

    if (!result || !result.items || result.items.length === 0) {
      logger.info(`使用模拟指数数据: ${indexCode}`);
      return null;
    }

    // 返回最新的数据
    return result.items[result.items.length - 1];
  } catch (error) {
    logger.error('获取指数数据失败:', error);
    throw error;
  }
};

/**
 * 获取今日市场数据并保存
 */
export const syncMarketData = async (stockCodes: string[]): Promise<number> => {
  if (!TUSHARE_TOKEN) {
    logger.warn('Tushare Token未配置，跳过数据同步');
    return 0;
  }

  let syncedCount = 0;
  const today = new Date().toISOString().split('T')[0];

  for (const stockCode of stockCodes) {
    try {
      // 检查是否已有今日数据
      const existing = await Market.findOne({
        where: {
          stockCode,
          date: today
        }
      });

      if (existing) {
        logger.info(`数据已存在: ${stockCode} - ${today}`);
        continue;
      }

      // 获取数据
      const data = await getMarketData(stockCode, today, today);
      
      if (data && data.length > 0) {
        const marketData = data[0];
        
        // 保存到数据库
        await Market.create({
          stockCode,
          stockName: marketData.name || stockCode,
          open: marketData.open || 0,
          close: marketData.close || 0,
          high: marketData.high || 0,
          low: marketData.low || 0,
          volume: marketData.vol || 0,
          amount: marketData.amount || 0,
          change: marketData.change || 0,
          changePercent: marketData.pct_chg || 0,
          date: today
        });

        syncedCount++;
        logger.info(`已同步市场数据: ${stockCode}`);
      }
    } catch (error) {
      logger.error(`同步市场数据失败 ${stockCode}:`, error);
    }
  }

  logger.info(`市场数据同步完成，共同步 ${syncedCount} 条数据`);
  return syncedCount;
};

