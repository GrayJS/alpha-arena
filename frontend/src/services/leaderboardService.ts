import api from './apiService';
import type { ApiResponse } from './apiService';

/**
 * 排行榜相关 API
 */

export interface LeaderboardItem {
  modelId: number;
  modelName: string;
  algorithm: string;
  riskProfile: string;
  currentNav: string;
  totalReturn: string;
  sharpeRatio: string;
  maxDrawdown: string;
  winRate: string;
  totalTrades: number;
  startDate: string | null;
  endDate: string | null;
}

export interface LeaderboardParams {
  sortBy?: 'return' | 'sharpe' | 'drawdown';
  sortOrder?: 'asc' | 'desc';
  period?: 'total' | 'month' | 'week';
}

/**
 * 获取排行榜
 */
export const getLeaderboard = async (params?: LeaderboardParams) => {
  const response = await api.get<ApiResponse<LeaderboardItem[]>>('/leaderboard', { params });
  return response.data;
};

/**
 * 获取Top N模型
 */
export const getTopModels = async (limit: number = 5) => {
  const response = await api.get('/leaderboard/top', { params: { limit } });
  return response.data;
};


