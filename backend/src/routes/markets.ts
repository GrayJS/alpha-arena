import { Router, Request, Response } from 'express';

const router = Router();

/**
 * 获取市场指数数据
 * GET /api/markets/indices
 */
router.get('/indices', async (req: Request, res: Response) => {
  try {
    // 基础模拟数据（开发环境）
    const base = Date.now();
    const rand = (seed: number) => {
      const x = Math.sin(base + seed) * 10000;
      return x - Math.floor(x);
    };

    const data = {
      sh: {
        code: '000001',
        name: '上证指数',
        price: parseFloat((2900 + rand(1) * 400).toFixed(2)),
        change: parseFloat(((rand(2) - 0.5) * 2).toFixed(2))
      },
      sz: {
        code: '399001',
        name: '深证成指',
        price: parseFloat((9000 + rand(3) * 1500).toFixed(2)),
        change: parseFloat(((rand(4) - 0.5) * 2.5).toFixed(2))
      },
      cyb: {
        code: '399006',
        name: '创业板指',
        price: parseFloat((1700 + rand(5) * 300).toFixed(2)),
        change: parseFloat(((rand(6) - 0.5) * 3).toFixed(2))
      }
    };

    res.json({ code: 0, data, message: 'success' });
  } catch (error) {
    res.status(500).json({
      code: -1,
      message: '获取指数数据失败',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;

