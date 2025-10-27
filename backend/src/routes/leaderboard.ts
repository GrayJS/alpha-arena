import { Router } from 'express';
import LeaderboardController from '../controllers/LeaderboardController';

const router = Router();

/**
 * 获取Top N模型
 * GET /api/leaderboard/top
 */
router.get('/top', LeaderboardController.getTopModels.bind(LeaderboardController));

/**
 * 获取模型排行榜
 * GET /api/leaderboard
 */
router.get('/', LeaderboardController.getLeaderboard.bind(LeaderboardController));

export default router;

