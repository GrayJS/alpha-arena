import { Router } from 'express';
import ModelController from '../controllers/ModelController';

const router = Router();

/**
 * 获取所有模型列表
 * GET /api/models
 */
router.get('/', ModelController.getModels.bind(ModelController));

/**
 * 创建新模型
 * POST /api/models
 */
router.post('/', ModelController.createModel.bind(ModelController));

/**
 * 获取单个模型详情
 * GET /api/models/:id
 */
router.get('/:id', ModelController.getModelById.bind(ModelController));

export default router;

