import { Router, Request, Response } from 'express';
import { getIndexData } from '../services/dataSource';
import logger from '../utils/logger';

const router = Router();

/**
 * 获取市场指数数据
 * GET /api/markets/indices
 */
router.get('/indices', async (req: Request, res: Response) => {
  try {
    // 真实环境：通过数据源服务获取指数数据（Tushare）
    // 指数代码：上证指数 000001.SH，深证成指 399001.SZ，创业板指 399006.SZ
    const [sh, sz, cyb] = await Promise.all([
      getIndexData('000001.SH'),
      getIndexData('399001.SZ'),
      getIndexData('399006.SZ')
    ]);

    const anyData = sh || sz || cyb;
    console.log('anyData', anyData);
    if (!anyData) {
      return res.status(500).json({
        code: -1,
        message: '未获取到指数数据，请检查Tushare配置或网络连接'
      });
    }

    const safeNum = (v: any, digits = 2) => {
      const n = Number(v);
      return Number.isFinite(n) ? parseFloat(n.toFixed(digits)) : 0;
    };

    const data = {
      sh: {
        code: '000001',
        name: '上证指数',
        price: safeNum(sh?.[2] /* close */),
        change: safeNum(sh?.[8] /* pct_chg */, 2)
      },
      sz: {
        code: '399001',
        name: '深证成指',
        price: safeNum(sz?.[2]),
        change: safeNum(sz?.[8], 2)
      },
      cyb: {
        code: '399006',
        name: '创业板指',
        price: safeNum(cyb?.[2]),
        change: safeNum(cyb?.[8], 2)
      }
    };

    res.json({ code: 0, data, message: 'success' });
  } catch (error) {
    logger.error('获取指数数据失败: %o', error);
    res.status(500).json({
      code: -1,
      message: '获取指数数据失败',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;

