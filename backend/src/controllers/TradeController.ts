import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Trade, AIModel } from '../models';
import logger from '../utils/logger';

/**
 * 交易记录控制器
 */
class TradeController {
  /**
   * 获取交易记录列表
   * GET /api/trades
   */
  async getTrades(req: Request, res: Response) {
    try {
      const { 
        modelId, 
        stockCode, 
        action,
        startDate, 
        endDate,
        page = 1, 
        pageSize = 20 
      } = req.query;

      const where: any = {};
      
      if (modelId) {
        where.modelId = modelId;
      }
      
      if (stockCode) {
        where.stockCode = stockCode;
      }
      
      if (action) {
        where.action = action;
      }
      
      if (startDate || endDate) {
        where.date = {};
        if (startDate) {
          where.date[Op.gte] = startDate;
        }
        if (endDate) {
          where.date[Op.lte] = endDate;
        }
      }

      const offset = (Number(page) - 1) * Number(pageSize);

      const { count, rows } = await Trade.findAndCountAll({
        where,
        include: [{
          model: AIModel,
          as: 'model',
          attributes: ['id', 'name', 'algorithm']
        }],
        limit: Number(pageSize),
        offset,
        order: [['date', 'DESC'], ['createdAt', 'DESC']]
      });

      res.json({
        code: 0,
        data: {
          list: rows,
          total: count,
          page: Number(page),
          pageSize: Number(pageSize),
          totalPages: Math.ceil(count / Number(pageSize))
        },
        message: 'success'
      });
    } catch (error) {
      logger.error('获取交易记录失败:', error);
      res.status(500).json({
        code: -1,
        message: '获取交易记录失败',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * 获取单笔交易详情
   * GET /api/trades/:id
   */
  async getTradeById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const trade = await Trade.findByPk(id, {
        include: [{
          model: AIModel,
          as: 'model',
          attributes: ['id', 'name', 'algorithm']
        }]
      });

      if (!trade) {
        return res.status(404).json({
          code: -1,
          message: '交易记录不存在'
        });
      }

      res.json({
        code: 0,
        data: trade,
        message: 'success'
      });
    } catch (error) {
      logger.error('获取交易详情失败:', error);
      res.status(500).json({
        code: -1,
        message: '获取交易详情失败',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * 创建交易记录
   * POST /api/trades
   */
  async createTrade(req: Request, res: Response) {
    try {
      const { modelId, stockCode, stockName, action, price, volume, date } = req.body;

      if (!modelId || !stockCode || !stockName || !action || !price || !volume || !date) {
        return res.status(400).json({
          code: -1,
          message: '交易信息不完整'
        });
      }

      if (!['buy', 'sell'].includes(action)) {
        return res.status(400).json({
          code: -1,
          message: '无效的操作类型'
        });
      }

      const amount = price * volume;
      const trade = await Trade.create({
        modelId,
        stockCode,
        stockName,
        action,
        price,
        volume,
        amount,
        date
      });

      res.status(201).json({
        code: 0,
        data: trade,
        message: 'success'
      });
    } catch (error) {
      logger.error('创建交易记录失败:', error);
      res.status(500).json({
        code: -1,
        message: '创建交易记录失败',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * 获取模型统计信息
   * GET /api/trades/stats/:modelId
   */
  async getTradeStats(req: Request, res: Response) {
    try {
      const { modelId } = req.params;

      const trades = await Trade.findAll({
        where: { modelId },
        order: [['date', 'ASC']]
      });

      const totalTrades = trades.length;
      const buyTrades = trades.filter(t => t.action === 'buy').length;
      const sellTrades = trades.filter(t => t.action === 'sell').length;
      const totalPnL = trades.reduce((sum, t) => sum + (Number(t.pnl) || 0), 0);
      const winningTrades = trades.filter(t => t.pnl && t.pnl > 0).length;
      const winRate = totalTrades > 0 ? (winningTrades / totalTrades * 100).toFixed(2) : '0';

      const stats = {
        totalTrades,
        buyTrades,
        sellTrades,
        totalPnL: totalPnL.toFixed(2),
        winningTrades,
        losingTrades: trades.filter(t => t.pnl && t.pnl < 0).length,
        winRate: `${winRate}%`,
        averagePnL: totalTrades > 0 ? (totalPnL / totalTrades).toFixed(2) : '0'
      };

      res.json({
        code: 0,
        data: stats,
        message: 'success'
      });
    } catch (error) {
      logger.error('获取交易统计失败:', error);
      res.status(500).json({
        code: -1,
        message: '获取交易统计失败',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export default new TradeController();


