import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * 统一的 API 响应格式
 */
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

/**
 * API 服务基类
 */
class ApiService {
  private instance: AxiosInstance;

  constructor(baseURL = '/api') {
    this.instance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.setupInterceptors();
  }

  /**
   * 设置拦截器
   */
  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        // 可以在这里添加 token 等
        return config;
      },
      (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response.data;
      },
      (error) => {
        console.error('Response error:', error);
        
        if (error.response) {
          const { status, data } = error.response;
          
          if (status === 401) {
            // 未授权
            // TODO: 跳转到登录页
          }
          
          return Promise.reject(data || { code: -1, message: '请求失败' });
        }
        
        return Promise.reject({
          code: -1,
          message: error.message || '网络错误'
        });
      }
    );
  }

  /**
   * GET 请求
   */
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.instance.get(url, config);
  }

  /**
   * POST 请求
   */
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.instance.post(url, data, config);
  }

  /**
   * PUT 请求
   */
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.instance.put(url, data, config);
  }

  /**
   * DELETE 请求
   */
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.instance.delete(url, config);
  }
}

export default new ApiService();

/**
 * 获取交易记录
 */
export const getTrades = async (params?: any) => {
  return apiService.get('/trades', { params });
};

