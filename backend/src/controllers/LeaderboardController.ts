import { Request, Response } from 'express';
import { AIModel, Account, Trade } from '../models';
import { calculateSharpeRatio, calculateMaxDrawdown, calculateWinRate } from '../services/tradeCalculator';
import logger from '../utils/logger';

/**
 * 排行榜控制器
 */
class LeaderboardController {
  /**
   * 获取模型排行榜
   * GET /api/leaderboard
   */
  async getLeaderboard(req: Request, res: Response) {
    try {
      const { sortBy = 'return', sortOrder = 'desc' } = req.query;

      // 获取所有活跃模型
      const models = await AIModel.findAll({
        where: { isActive: true }
      });

      // 计算每个模型的指标
      const leaderboard = await Promise.all(
        models.map(async (model) => {
          // 获取最新的净值数据
          const latestAccount = await Account.findOne({
            where: { modelId: model.id },
            order: [['date', 'DESC']]
          });

          // 获取所有净值数据用于计算指标
          const allAccounts = await Account.findAll({
            where: { modelId: model.id },
            order: [['date', 'ASC']]
          });

          // 获取交易记录
          const trades = await Trade.findAll({
            where: { modelId: model.id }
          });

          // 计算各项指标
          const navs = allAccounts.map(acc => Number(acc.nav));
          const currentNav = latestAccount ? Number(latestAccount.nav) : 1;
          const totalReturn = currentNav - 1;
          const returns = navs.length > 1 
            ? navs.slice(1).map((nav, i) => (nav - navs[i]) / navs[i])
            : [];
          const sharpeRatio = returns.length > 0 ? calculateSharpeRatio(returns) : 0;
          const { maxDrawdown } = calculateMaxDrawdown(navs);
          const winRate = calculateWinRate(trades);
          const totalTrades = trades.length;

          return {
            modelId: model.id,
            modelName: model.name,
            algorithm: model.algorithm,
            riskProfile: model.riskProfile,
            currentNav: currentNav.toFixed(4),
            totalReturn: (totalReturn * 100).toFixed(2),
            sharpeRatio: sharpeRatio.toFixed(2),
            maxDrawdown: maxDrawdown.toFixed(2),
            winRate: `${winRate.toFixed(2)}%`,
            totalTrades,
            startDate: allAccounts[0]?.date || null,
            endDate: allAccounts[allAccounts.length - 1]?.date || null
          };
        })
      );

      // 排序
      const sortedLeaderboard = leaderboard.sort((a, b) => {
        let comparison = 0;
        
        if (sortBy === 'return') {
          comparison = parseFloat(a.totalReturn) - parseFloat(b.totalReturn);
        } else if (sortBy === 'sharpe') {
          comparison = parseFloat(a.sharpeRatio) - parseFloat(b.sharpeRatio);
        } else if (sortBy === 'drawdown') {
          comparison = parseFloat(a.maxDrawdown) - parseFloat(b.maxDrawdown);
        }
        
        return sortOrder === 'desc' ? -comparison : comparison;
      });

      res.json({
        code: 0,
        data: sortedLeaderboard,
        message: 'success'
      });
    } catch (error) {
      logger.error('获取排行榜失败:', error);
      res.status(500).json({
        code: -1,
        message: '获取排行榜失败',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * 获取Top N模型
   * GET /api/leaderboard/top
   */
  async getTopModels(req: Request, res: Response) {
    try {
      const { limit = 5, sortBy = 'return', sortOrder = 'desc' } = req.query as any;

      // 复用排行榜计算逻辑
      const models = await AIModel.findAll({
        where: { isActive: true }
      });

      const leaderboard = await Promise.all(
        models.map(async (model) => {
          const latestAccount = await Account.findOne({
            where: { modelId: model.id },
            order: [['date', 'DESC']]
          });

          const allAccounts = await Account.findAll({
            where: { modelId: model.id },
            order: [['date', 'ASC']]
          });

          const trades = await Trade.findAll({
            where: { modelId: model.id }
          });

          const navs = allAccounts.map(acc => Number(acc.nav));
          const currentNav = latestAccount ? Number(latestAccount.nav) : 1;
          const totalReturn = currentNav - 1;
          const returns = navs.length > 1
            ? navs.slice(1).map((nav, i) => (nav - navs[i]) / navs[i])
            : [];
          const sharpeRatio = returns.length > 0 ? calculateSharpeRatio(returns) : 0;
          const { maxDrawdown } = calculateMaxDrawdown(navs);
          const winRate = calculateWinRate(trades);

          return {
            modelId: model.id,
            modelName: model.name,
            algorithm: model.algorithm,
            riskProfile: model.riskProfile,
            currentNav: currentNav.toFixed(4),
            totalReturn: (totalReturn * 100).toFixed(2),
            sharpeRatio: sharpeRatio.toFixed(2),
            maxDrawdown: maxDrawdown.toFixed(2),
            winRate: `${winRate.toFixed(2)}%`,
            totalTrades: trades.length,
            startDate: allAccounts[0]?.date || null,
            endDate: allAccounts[allAccounts.length - 1]?.date || null
          };
        })
      );

      const sorted = leaderboard.sort((a, b) => {
        let comparison = 0;
        if (sortBy === 'return') {
          comparison = parseFloat(a.totalReturn) - parseFloat(b.totalReturn);
        } else if (sortBy === 'sharpe') {
          comparison = parseFloat(a.sharpeRatio) - parseFloat(b.sharpeRatio);
        } else if (sortBy === 'drawdown') {
          comparison = parseFloat(a.maxDrawdown) - parseFloat(b.maxDrawdown);
        } else {
          // 默认按收益
          comparison = parseFloat(a.totalReturn) - parseFloat(b.totalReturn);
        }
        return sortOrder === 'desc' ? -comparison : comparison;
      });

      const topN = sorted.slice(0, Number(limit));

      res.json({
        code: 0,
        data: topN,
        message: 'success'
      });
    } catch (error) {
      logger.error('获取Top模型失败:', error);
      res.status(500).json({
        code: -1,
        message: '获取Top模型失败',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export default new LeaderboardController();


