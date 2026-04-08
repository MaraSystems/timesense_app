import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Generic request function
async function request<T>(
  endpoint: string,
  options: AxiosRequestConfig = {}
): Promise<T> {
  const response: AxiosResponse<T> = await apiClient.request({
    url: endpoint,
    ...options,
  })
  return response.data
}

export const api = {
  get: <T>(endpoint: string, config?: AxiosRequestConfig) =>
    request<T>(endpoint, { ...config, method: 'GET' }),

  post: <T>(endpoint: string, data?: unknown, config?: AxiosRequestConfig) =>
    request<T>(endpoint, { ...config, method: 'POST', data }),

  put: <T>(endpoint: string, data?: unknown, config?: AxiosRequestConfig) =>
    request<T>(endpoint, { ...config, method: 'PUT', data }),

  patch: <T>(endpoint: string, data?: unknown, config?: AxiosRequestConfig) =>
    request<T>(endpoint, { ...config, method: 'PATCH', data }),

  delete: <T>(endpoint: string, config?: AxiosRequestConfig) =>
    request<T>(endpoint, { ...config, method: 'DELETE' }),
}

export default api