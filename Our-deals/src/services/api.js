import axios from 'axios'
import { API_BASE_URL, API_ENDPOINTS } from '../utils/constants'

// Endpoints that must not include Authorization headers
const NO_AUTH_ENDPOINTS = [
  API_ENDPOINTS.VENDOR_DETAIL,
  API_ENDPOINTS.FETCH_VENDORS,
  API_ENDPOINTS.VENDOR_REVIEWS,
  API_ENDPOINTS.POPULAR_CATEGORIES,
  API_ENDPOINTS.HOME_SERVICES,
  API_ENDPOINTS.HEALTH_FITNESS,
  API_ENDPOINTS.BEAUTY_CARE,
  API_ENDPOINTS.PROFESSIONAL_SERVICES,
  API_ENDPOINTS.TRENDING_CATEGORIES,
  API_ENDPOINTS.RENTAL_SERVICES,
  API_ENDPOINTS.SOME_CATEGORIES,
  API_ENDPOINTS.WEDDING_CATEGORIES,
  API_ENDPOINTS.ALL_BANNERS,
  API_ENDPOINTS.WEDDING_BANNERS
]

const isNoAuthEndpoint = (url) => {
  if (!url) return false

  // Handle both absolute URLs and relative paths
  const path = url.startsWith('http://') || url.startsWith('https://')
    ? new URL(url).pathname
    : url

  // Strip leading /api if present (when full path is provided)
  const normalizedPath = path.replace(/^\/api/, '')

  return NO_AUTH_ENDPOINTS.some((endpoint) => normalizedPath.startsWith(endpoint))
}

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false
})

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    // CRITICAL: Explicitly ensure POST method is preserved
    if (config.method && (config.method.toLowerCase() === 'post' || config.method === 'POST')) {
      config.method = 'POST'
    }
    
    // Ensure method is explicitly set if not provided
    if (!config.method && config.data) {
      config.method = 'POST'
    }
    
    const token = localStorage.getItem('auth_token')
    
    if (token && !isNoAuthEndpoint(config.url || '')) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('auth_token')
      localStorage.removeItem('userData')
      window.dispatchEvent(new CustomEvent('userLogin'))
    }
    return Promise.reject(error)
  }
)

export default api

