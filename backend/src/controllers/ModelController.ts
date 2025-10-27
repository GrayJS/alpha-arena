import { Request, Response } from 'express';
import { AIModel } from '../models';
import logger from '../utils/logger';

/**
 * 模型控制器
 */
class ModelController {
  /**
   * 获取所有模型列表
   * GET /api/models
   */
  async getModels(req: Request, res: Response) {
    try {
      const { isActive, riskProfile, page = 1, pageSize = 10 } = req.query;

      const where: any = {};
      
      if (isActive !== undefined) {
        where.isActive = isActive === 'true';
      }
      
      if (riskProfile) {
        where.riskProfile = riskProfile;
      }

      const offset = (Number(page) - 1) * Number(pageSize);

      const { count, rows } = await AIModel.findAndCountAll({
        where,
        limit: Number(pageSize),
        offset,
        order: [['createdAt', 'DESC']]
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
      logger.error('获取模型列表失败:', error);
      res.status(500).json({
        code: -1,
        message: '获取模型列表失败',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * 获取单个模型详情
   * GET /api/models/:id
   */
  async getModelById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const model = await AIModel.findByPk(id);

      if (!model) {
        return res.status(404).json({
          code: -1,
          message: '模型不存在'
        });
      }

      res.json({
        code: 0,
        data: model,
        message: 'success'
      });
    } catch (error) {
      logger.error('获取模型详情失败:', error);
      res.status(500).json({
        code: -1,
        message: '获取模型详情失败',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * 创建新模型
   * POST /api/models
   */
  async createModel(req: Request, res: Response) {
    try {
      const { name, algorithm, description, riskProfile = 'moderate' } = req.body;

      if (!name || !algorithm) {
        return res.status(400).json({
          code: -1,
          message: '模型名称和算法类型不能为空'
        });
      }

      const model = await AIModel.create({
        name,
        algorithm,
        description,
        riskProfile
      });

      res.status(201).json({
        code: 0,
        data: model,
        message: 'success'
      });
    } catch (error) {
      logger.error('创建模型失败:', error);
      res.status(500).json({
        code: -1,
        message: '创建模型失败',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export default new ModelController();

