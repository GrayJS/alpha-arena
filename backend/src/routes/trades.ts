import { Router } from 'express';
import TradeController from '../controllers/TradeController';

const router = Router();

/**
 * 创建交易记录
 * POST /api/trades
 */
router.post('/', TradeController.createTrade.bind(TradeController));

/**
 * 获取交易记录列表
 * GET /api/trades
 */
router.get('/', TradeController.getTrades.bind(TradeController));

/**
 * 获取交易统计
 * GET /api/trades/stats/:modelId
 */
router.get('/stats/:modelId', TradeController.getTradeStats.bind(TradeController));

/**
 * 获取单笔交易详情
 * GET /api/trades/:id
 */
router.get('/:id', TradeController.getTradeById.bind(TradeController));

export default router;

