import winston from 'winston';

/**
 * 日志工具
 * 用于记录应用运行过程中的各种信息
 */
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'alpha-arena-backend' },
  transports: [
    // 写入所有日志到 console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(
          ({ timestamp, level, message, ...meta }) =>
            `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`
        )
      )
    }),
    // 写入错误日志到文件
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    // 写入所有日志到文件
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

export default logger;

