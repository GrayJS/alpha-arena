import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { sequelize } from './config/database';
import { AIModel } from './models';
import logger from './utils/logger';
import routes from './routes';
import { initializeScheduler } from './scheduler/tasks';
import { seedData } from './seeders/seedData';
import { generateAllMockData } from './utils/mockData';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(helmet()); // 安全头部
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(compression()); // 压缩响应
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim())
  }
}));

// 路由
app.use('/api', routes);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// 启动服务器
const startServer = async () => {
  try {
    // 测试数据库连接
    await sequelize.authenticate();
    logger.info('数据库连接成功');

    // 同步数据库模型（开发环境）
    if (process.env.NODE_ENV === 'development') {
      // 使用 force: false 避免自动修改表结构
      await sequelize.sync({ force: false });
      logger.info('数据库模型已同步');

      // 初始化种子数据（如果数据库为空）
      const modelCount = await AIModel.count();
      if (modelCount === 0) {
        await seedData();
        logger.info('种子数据初始化完成');
      }

      // 生成模拟数据（开发环境）
      if (process.env.NODE_ENV === 'development') {
        try {
          await generateAllMockData();
        } catch (error) {
          logger.warn('生成模拟数据失败，但可以继续运行:', error);
        }
      }
    }

    app.listen(PORT, () => {
      logger.info(`服务器运行在 http://localhost:${PORT}`);
      
      // 初始化定时任务
      initializeScheduler();
    });
  } catch (error) {
    logger.error('启动服务器失败:', error);
    process.exit(1);
  }
};

startServer();

export default app;

