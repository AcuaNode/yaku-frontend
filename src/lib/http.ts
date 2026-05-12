import axios from 'axios'
import { API_BASE_URL } from '../config/api.config'
import { getToken, clearTokens } from '../utils/token'

export const http = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
})

// Inject access token on every request
http.interceptors.request.use(config => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 globally — clear session and redirect to login
http.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      clearTokens()
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)
