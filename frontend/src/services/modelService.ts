import api from './api';

/**
 * 模型相关 API
 */

export interface Model {
  id: number;
  name: string;
  algorithm: string;
  description?: string;
  riskProfile: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ModelListParams {
  page?: number;
  pageSize?: number;
  isActive?: boolean;
  riskProfile?: string;
}

export interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

/**
 * 获取模型列表
 */
export const getModels = async (params?: ModelListParams) => {
  const response = await api.get<ApiResponse<{
    list: Model[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }>>('/models', { params });
  return response.data;
};

/**
 * 获取单个模型详情
 */
export const getModelById = async (id: number) => {
  const response = await api.get<ApiResponse<Model>>(`/models/${id}`);
  return response.data;
};

/**
 * 创建新模型
 */
export const createModel = async (model: Partial<Model>) => {
  const response = await api.post<ApiResponse<Model>>('/models', model);
  return response.data;
};

