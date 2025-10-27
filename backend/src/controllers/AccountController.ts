import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Account, AIModel } from '../models';
import logger from '../utils/logger';

/**
 * 账户数据控制器
 */
class AccountController {
  /**
   * 获取模型净值数据
   * GET /api/accounts/:modelId/nav
   */
  async getNavData(req: Request, res: Response) {
    try {
      const { modelId } = req.params;
      const { startDate, endDate } = req.query;

      const where: any = { modelId };
      
      if (startDate || endDate) {
        where.date = {};
        if (startDate) {
          where.date[Op.gte] = startDate;
        }
        if (endDate) {
          where.date[Op.lte] = endDate;
        }
      }

      const accounts = await Account.findAll({
        where,
        include: [{
          model: AIModel,
          as: 'model',
          attributes: ['id', 'name']
        }],
        order: [['date', 'ASC']]
      });

      // 计算收益率等指标
      const navData = accounts.map(account => ({
        date: account.date,
        nav: Number(account.nav),
        navChange: Number(account.navChange),
        navChangePercent: Number(account.navChangePercent),
        totalAssets: Number(account.totalAssets),
        cash: Number(account.cash),
        positions: Number(account.positions)
      }));

      const initialNav = navData[0]?.nav || 1;
      const currentNav = navData[navData.length - 1]?.nav || 1;
      const totalReturn = ((currentNav - initialNav) / initialNav * 100).toFixed(2);

      res.json({
        code: 0,
        data: {
          list: navData,
          stats: {
            initialNav: initialNav.toFixed(4),
            currentNav: currentNav.toFixed(4),
            totalReturn: `${totalReturn}%`,
            period: navData.length
          }
        },
        message: 'success'
      });
    } catch (error) {
      logger.error('获取净值数据失败:', error);
      res.status(500).json({
        code: -1,
        message: '获取净值数据失败',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * 获取多个模型的净值对比数据
   * GET /api/accounts/compare
   */
  async compareModels(req: Request, res: Response) {
    try {
      const { modelIds, startDate, endDate } = req.query;

      if (!modelIds) {
        return res.status(400).json({
          code: -1,
          message: '请提供模型ID列表'
        });
      }

      const modelIdList = (modelIds as string).split(',').map(id => parseInt(id));

      const where: any = {
        modelId: { [Op.in]: modelIdList }
      };
      
      if (startDate || endDate) {
        where.date = {};
        if (startDate) {
          where.date[Op.gte] = startDate;
        }
        if (endDate) {
          where.date[Op.lte] = endDate;
        }
      }

      const accounts = await Account.findAll({
        where,
        include: [{
          model: AIModel,
          as: 'model',
          attributes: ['id', 'name', 'algorithm']
        }],
        order: [['date', 'ASC'], ['modelId', 'ASC']]
      });

      // 按模型分组
      const groupedData: { [key: number]: any[] } = {};
      
      accounts.forEach(account => {
        if (!groupedData[account.modelId]) {
          groupedData[account.modelId] = [];
        }
        groupedData[account.modelId].push({
          date: account.date,
          nav: Number(account.nav),
          modelName: (account as any).model?.name || 'Unknown'
        });
      });

      res.json({
        code: 0,
        data: groupedData,
        message: 'success'
      });
    } catch (error) {
      logger.error('获取对比数据失败:', error);
      res.status(500).json({
        code: -1,
        message: '获取对比数据失败',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * 获取账户当前状态
   * GET /api/accounts/:modelId/current
   */
  async getCurrentAccount(req: Request, res: Response) {
    try {
      const { modelId } = req.params;

      const latestAccount = await Account.findOne({
        where: { modelId },
        order: [['date', 'DESC']],
        include: [{
          model: AIModel,
          as: 'model',
          attributes: ['id', 'name']
        }]
      });

      if (!latestAccount) {
        return res.status(404).json({
          code: -1,
          message: '账户数据不存在'
        });
      }

      res.json({
        code: 0,
        data: latestAccount,
        message: 'success'
      });
    } catch (error) {
      logger.error('获取账户状态失败:', error);
      res.status(500).json({
        code: -1,
        message: '获取账户状态失败',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export default new AccountController();


