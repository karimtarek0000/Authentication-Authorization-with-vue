import { accessToken, refreshToken } from '@/auth'
import axios from 'axios'

let navigationController = new AbortController()

export const abortAllApiRequests = () => {
  navigationController.abort()
  navigationController = new AbortController()
}

const MAXIMUM_RETRY = 2

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  timeout: 10_000,
})

// Request interceptor
api.interceptors.request.use(
  config => {
    const requestConfig = config
    // const requestConfig = config as InternalAxiosRequestConfig

    // Attach the current navigation signal to every request unless custom signal exists.
    // if (!requestConfig.signal) {
    //   requestConfig.signal = navigationController.signal
    // }

    const token = accessToken.value
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`
    }
    return requestConfig
  },
  error => Promise.reject(error),
)

// Response interceptor
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    if (!originalRequest) {
      return Promise.reject(error)
    }

    // Navigation triggered cancellations should never be retried.
    if (error.code === 'ERR_CANCELED' || axios.isCancel(error)) {
      return Promise.reject(error)
    }

    // Add a retry count to config if not present
    originalRequest._retryCount = originalRequest._retryCount || 0

    // Only retry at most 2 times
    if (originalRequest._retryCount < MAXIMUM_RETRY) {
      originalRequest._retryCount += 1

      // Handle 401 logic with token refresh, otherwise just retry
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        try {
          await refreshToken()
          originalRequest.headers.Authorization = `Bearer ${accessToken.value}`
          return api(originalRequest)
        } catch (refreshError) {
          return Promise.reject(refreshError)
        }
      }

      // For ALL other errors: retry up to 2 times
      try {
        return api(originalRequest)
      } catch (retryError) {
        return Promise.reject(retryError)
      }
    }

    return Promise.reject(error)
  },
)
