import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
const API_TIMEOUT = 10000; // 10 seconds

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // console.log('API Request:', {
    //   method: config.method?.toUpperCase(),
    //   url: config.url,
    //   baseURL: config.baseURL,
    //   data: config.data,
    //   headers: config.headers
    // });
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // console.log('API Response:', {
    //   status: response.status,
    //   statusText: response.statusText,
    //   data: response.data
    // });
    return response;
  },
  async (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      config: {
        method: error.config?.method,
        url: error.config?.url,
        data: error.config?.data
      }
    });

    // Handle 429 (Too Many Requests) with retry logic
    if (error.response?.status === 429) {
      const retryCount = error.config?.retryCount || 0;
      const maxRetries = 3;
      const retryDelay = Math.pow(2, retryCount) * 1000; // Exponential backoff: 1s, 2s, 4s

      if (retryCount < maxRetries) {
        console.log(`🔄 Retrying request (${retryCount + 1}/${maxRetries}) after ${retryDelay}ms...`);
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        
        // Add retry count to config
        error.config.retryCount = retryCount + 1;
        
        // Retry the request
        return apiClient.request(error.config);
      } else {
        console.error('❌ Max retries reached for 429 error');
        error.message = 'Demasiadas peticiones. Por favor, espera unos segundos antes de intentar de nuevo.';
      }
    }

    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Generic API methods
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.get(url, config).then(response => response.data),
  
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.post(url, data, config).then(response => response.data),
  
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.put(url, data, config).then(response => response.data),
  
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.patch(url, data, config).then(response => response.data),
  
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.delete(url, config).then(response => response.data),
};

export default apiClient;
