import { Router, Request, Response } from 'express';
import AIModelController from '../services/ai/AIModelController';
import AIModel from '../models/Model';
import { ProviderFactory } from '../services/ai/ProviderFactory';
import { getAvailableModels } from '../config/aiProviders';
import logger from '../utils/logger';

const router = Router();

/**
 * 初始化AI服务
 * POST /api/ai/init
 */
router.post('/init', async (req: Request, res: Response) => {
  try {
    const { modelId, provider, modelName } = req.body;

    if (!modelId) {
      return res.status(400).json({
        code: -1,
        message: '缺少必要参数：modelId'
      });
    }

    // 验证模型存在
    const model = await AIModel.findByPk(modelId);
    if (!model) {
      return res.status(404).json({
        code: -1,
        message: '模型不存在'
      });
    }

    // 初始化AI服务
    const success = await AIModelController.initializeModel(modelId, provider, modelName);

    if (success) {
      res.json({
        code: 0,
        message: 'AI服务初始化成功',
        data: { modelId, provider, modelName }
      });
    } else {
      res.status(500).json({
        code: -1,
        message: 'AI服务初始化失败'
      });
    }
  } catch (error) {
    logger.error('AI服务初始化失败:', error);
    res.status(500).json({
      code: -1,
      message: 'AI服务初始化失败',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * 分析股票
 * POST /api/ai/analyze
 */
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { modelId, stockCode, stockName, currentPrice } = req.body;

    if (!modelId || !stockCode || !stockName || !currentPrice) {
      return res.status(400).json({
        code: -1,
        message: '缺少必要参数'
      });
    }

    const result = await AIModelController.analyzeStock(
      modelId,
      stockCode,
      stockName,
      parseFloat(currentPrice)
    );

    if (result) {
      res.json({
        code: 0,
        data: result,
        message: 'success'
      });
    } else {
      res.status(500).json({
        code: -1,
        message: '分析失败'
      });
    }
  } catch (error) {
    logger.error('股票分析失败:', error);
    res.status(500).json({
      code: -1,
      message: '股票分析失败',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * 获取可用的AI模型列表
 * GET /api/ai/models
 */
router.get('/models', async (req: Request, res: Response) => {
  try {
    const models = getAvailableModels();

    res.json({
      code: 0,
      data: models,
      message: 'success'
    });
  } catch (error) {
    logger.error('获取AI模型列表失败:', error);
    res.status(500).json({
      code: -1,
      message: '获取AI模型列表失败'
    });
  }
});

/**
 * 获取可用的提供商列表
 * GET /api/ai/providers
 */
router.get('/providers', async (req: Request, res: Response) => {
  try {
    const providers = ProviderFactory.getAvailableProviders();

    res.json({
      code: 0,
      data: providers.map(p => ({
        name: p.name,
        displayName: p.displayName,
        models: p.models,
        enabled: p.enabled
      })),
      message: 'success'
    });
  } catch (error) {
    logger.error('获取提供商列表失败:', error);
    res.status(500).json({
      code: -1,
      message: '获取提供商列表失败'
    });
  }
});

export default router;

