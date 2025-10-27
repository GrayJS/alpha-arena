import { Router } from 'express';
import modelRoutes from './models';
import tradeRoutes from './trades';
import accountRoutes from './accounts';
import marketRoutes from './markets';
import leaderboardRoutes from './leaderboard';
import aiRoutes from './ai';

const router = Router();

/**
 * API路由配置
 */
router.use('/models', modelRoutes);
router.use('/trades', tradeRoutes);
router.use('/accounts', accountRoutes);
router.use('/markets', marketRoutes);
router.use('/leaderboard', leaderboardRoutes);
router.use('/ai', aiRoutes);

export default router;

