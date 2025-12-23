// API Configuration
// In development, use proxy to avoid CORS issues
// In production, use full HTTPS URL
export const API_BASE_URL = import.meta.env.DEV
  ? '/api'
  : 'https://ourdeals.appzetodemo.com/api'

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  USER_LOGIN: '/user/login',
  USER_REGISTER: '/user/register',
  USER_LOGOUT: '/user/logout',
  
  // OTP Management
  SEND_OTP: '/send-otp',
  VERIFY_OTP: '/verify-otp',
  RESEND_OTP: '/resend-otp',
  CHECK_OTP_STATUS: '/check-otp-status',
  
  // User Profile
  UPDATE_PROFILE: '/update/profile',
  
  // Categories
  CATEGORY: '/category',
  CATEGORY_SUBCATEGORIES: '/category/{id}/subcategories',
  POPULAR_CATEGORIES: '/fetch/popular/categories',
  HOME_SERVICES: '/fetch/home/services',
  HEALTH_FITNESS: '/fetch/health/fitness',
  BEAUTY_CARE: '/fetch/beauty/care',
  PROFESSIONAL_SERVICES: '/fetch/profesional/service',
  TRENDING_CATEGORIES: '/fetch/trending/categories',
  RENTAL_SERVICES: '/fetch/rental/service',
  SOME_CATEGORIES: '/fetch/some/categories',
  ALL_SUBCATEGORIES: '/category/all/subcategories',
  ALL_SUBCATEGORIES_ALT: '/subcategory/all',
  WEDDING_CATEGORIES: '/fetch/wedding/category',
  
  // Banners
  ALL_BANNERS: '/fetch/banner',
  HOMEPAGE_BANNERS: '/fetch/homepage/banner',
  WEDDING_BANNERS: '/fetch/wedding/banner',
  
  // Vendors
  VENDOR_DETAIL: '/fetch/vendor/detail',
  FETCH_VENDORS: '/fetch/vendor',
  VENDOR_WORK_IMAGE_ADD: '/vendor/work-image/add',
  VENDOR_WORK_IMAGE_FETCH: '/vendor/work-image/fetch',
  VENDOR_WORK_IMAGE_DELETE: '/vendor/work-image/delete',
  
  // Reviews
  REVIEWS: '/reviews',
  VENDOR_REVIEWS: '/vendor/reviews',
  
  // Agent
  AGENT_REGISTER: '/agent/register',
  
  // Notifications
  DEVICE_TOKEN: '/device-token',
  NOTIFICATIONS: '/notifications',
  
  // Search
  SEARCH: '/search',
  
  // Pages
  PAGES: '/fetch/pages',
  
  // Enquiries
  CREATE_ENQUIRY: '/enquires',
  GET_VENDOR_ENQUIRIES: '/enquires/vendor',
  GET_USER_ENQUIRIES: '/enquires/user',
}

