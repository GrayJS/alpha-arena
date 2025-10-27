import { Router } from 'express';
import AccountController from '../controllers/AccountController';

const router = Router();

/**
 * 获取模型净值对比数据
 * GET /api/accounts/compare
 */
router.get('/compare', AccountController.compareModels.bind(AccountController));

/**
 * 获取账户当前状态
 * GET /api/accounts/:modelId/current
 */
router.get('/:modelId/current', AccountController.getCurrentAccount.bind(AccountController));

/**
 * 获取模型净值数据
 * GET /api/accounts/:modelId/nav
 */
router.get('/:modelId/nav', AccountController.getNavData.bind(AccountController));

export default router;

