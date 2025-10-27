import api from './apiService';
import type { ApiResponse } from './apiService';

/**
 * 账户相关 API
 */

export interface NavData {
  date: string;
  nav: number;
  navChange: number;
  navChangePercent: number;
  totalAssets: number;
  cash: number;
  positions: number;
}

export interface NavDataResponse {
  list: NavData[];
  stats: {
    initialNav: string;
    currentNav: string;
    totalReturn: string;
    period: number;
  };
}

export interface CompareModelsParams {
  modelIds: string;
  startDate?: string;
  endDate?: string;
}

/**
 * 获取模型净值数据
 */
export const getNavData = async (modelId: number, startDate?: string, endDate?: string) => {
  const params: any = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  
  const response = await api.get<ApiResponse<NavDataResponse>>(`/accounts/${modelId}/nav`, { params });
  return response.data;
};

/**
 * 获取多模型对比数据
 */
export const compareModels = async (params: CompareModelsParams) => {
  const response = await api.get('/accounts/compare', { params });
  return response.data;
};

/**
 * 获取账户当前状态
 */
export const getCurrentAccount = async (modelId: number) => {
  const response = await api.get(`/accounts/${modelId}/current`);
  return response.data;
};


