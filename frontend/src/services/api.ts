import axios from 'axios';

/**
 * API 基础配置
 */
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * 请求拦截器
 */
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器
 */
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('Response error:', error);
    
    if (error.response) {
      // 服务器返回了错误
      const { status, data } = error.response;
      
      if (status === 401) {
        // 未授权，跳转到登录页
        window.location.href = '/login';
      }
      
      return Promise.reject(data || { message: '请求失败' });
    }
    
    return Promise.reject(error);
  }
);

export default api;

