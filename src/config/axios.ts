import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig
} from 'axios';

// Environment-based configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000');

// Create axios instance with default config
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  withCredentials: true // Enable cookies for authentication
});

// Safe request-id generator for both browser and server runtimes
function safelyGenerateRequestId(): string {
  try {
    // @ts-ignore - crypto may or may not exist in the current runtime
    const c = (globalThis as any)?.crypto;
    if (c && typeof c.randomUUID === 'function') {
      return c.randomUUID();
    }
  } catch {}
  return `req-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token =
        localStorage.getItem('auth-token') ||
        sessionStorage.getItem('auth-token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Add request ID for tracking (SSR-safe)
    if (config.headers) {
      config.headers['X-Request-ID'] = safelyGenerateRequestId();
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Try to refresh token (browser-only)
      try {
        let refreshToken: string | null = null;
        if (typeof window !== 'undefined') {
          refreshToken =
            localStorage.getItem('refresh-token') ||
            sessionStorage.getItem('refresh-token');
        }
        if (refreshToken) {
          const refreshResponse = await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            {
              refreshToken
            }
          );

          const { accessToken } = refreshResponse.data;

          // Store new token
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth-token', accessToken);
          }

          // Retry original request with new token
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Clear tokens and redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-token');
          localStorage.removeItem('refresh-token');
          sessionStorage.removeItem('auth-token');
          sessionStorage.removeItem('refresh-token');

          // Redirect to login page
          window.location.href = '/auth/sign-in';
        }
      }
    }

    // Handle other errors
    if (error.response) {
      // Server responded with error status
      const { status } = error.response;

      // Handle specific error statuses
      switch (status) {
        case 400:
          break;
        case 403:
          break;
        case 404:
          break;
        case 422:
          break;
        case 429:
          break;
        case 500:
          break;
        case 502:
          break;
        case 503:
          break;
        default:
      }
    } else if (error.request) {
      // Request was made but no response received
    } else {
      // Something else happened
    }

    return Promise.reject(error);
  }
);

// API helper functions
export const api = {
  // GET request
  get: <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return axiosInstance.get<T>(url, config);
  },

  // POST request
  post: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return axiosInstance.post<T>(url, data, config);
  },

  // PUT request
  put: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return axiosInstance.put<T>(url, data, config);
  },

  // PATCH request
  patch: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return axiosInstance.patch<T>(url, data, config);
  },

  // DELETE request
  delete: <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return axiosInstance.delete<T>(url, config);
  },

  // Upload file
  upload: <T = any>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<AxiosResponse<T>> => {
    const formData = new FormData();
    formData.append('file', file);

    return axiosInstance.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        }
      }
    });
  }
};

// Export the axios instance for direct use if needed
export default axiosInstance;

// Export types for use in other files
export type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError };
