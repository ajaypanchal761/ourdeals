import api from './api'
import { API_ENDPOINTS } from '../utils/constants'

// Get All Categories
// API: GET /api/category
// Response: { status: true, data: [...], message: "Category Fetch Successfully!" }
export const getAllCategories = async () => {
  const response = await api.get(API_ENDPOINTS.CATEGORY)
  return response.data
}

// Get Subcategories by Category ID
// API: GET /api/category/{id}/subcategories
// Response: { status: true, data: [...], message: "Sub Category Fetch Successfully !" }
export const getSubcategoriesByCategoryId = async (categoryId) => {
  const response = await api.get(`/category/${categoryId}/subcategories`)
  return response.data
}

// Get Popular Categories
// API: GET /api/fetch/popular/categories
// Response: { status: true, data: [...], message: "Popular Category Fetch Successfully !" }
// Auth Required: No
export const getPopularCategories = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.POPULAR_CATEGORIES)
    return response.data
  } catch (error) {
    throw error
  }
}

// Get Home Services
// API: GET /api/fetch/home/services
// Response: { status: true, data: [...], message: "Sub Category Fetch Successfully !" }
// Auth Required: No
export const getHomeServices = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.HOME_SERVICES)
    return response.data
  } catch (error) {
    throw error
  }
}

// Get Health & Fitness
// API: GET /api/fetch/health/fitness
// Response: { status: true, data: [...], message: "Sub Category Fetch Successfully !" }
// Auth Required: No
export const getHealthFitness = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.HEALTH_FITNESS)
    return response.data
  } catch (error) {
    throw error
  }
}

// Get Beauty Care
// API: GET /api/fetch/beauty/care
// Response: { status: true, data: [...], message: "Sub Category Fetch Successfully !" }
// Auth Required: No
export const getBeautyCare = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.BEAUTY_CARE)
    return response.data
  } catch (error) {
    throw error
  }
}

// Get Professional Services
// API: GET /api/fetch/profesional/service
// Response: { status: true, data: [...], message: "Sub Category Fetch Successfully !" }
// Auth Required: No
export const getProfessionalServices = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.PROFESSIONAL_SERVICES)
    return response.data
  } catch (error) {
    throw error
  }
}

// Get Trending Categories
// API: GET /api/fetch/trending/categories
// Response: { status: true, data: [...], message: "Sub Category Fetch Successfully !" }
// Auth Required: No
export const getTrendingCategories = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.TRENDING_CATEGORIES)
    return response.data
  } catch (error) {
    throw error
  }
}

// Get Rental Services
// API: GET /api/fetch/rental/service
// Response: { status: true, data: [...], message: "Sub Category Fetch Successfully !" }
// Auth Required: No
export const getRentalServices = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.RENTAL_SERVICES)
    return response.data
  } catch (error) {
    throw error
  }
}

// Get Some Categories
// API: GET /api/fetch/some/categories
// Response: { status: true, data: [...], message: "Sub Category Fetch Successfully !" }
// Auth Required: No
export const getSomeCategories = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.SOME_CATEGORIES)
    return response.data
  } catch (error) {
    throw error
  }
}

// Get All Subcategories (Testing Only)
// API: GET /api/category/all/subcategories
// Response: { status: true, data: [...], message: "Sub Category Fetch Successfully !" }
// Auth Required: No
export const getAllSubcategories = async () => {
  try {
    console.log('getAllSubcategories - Calling API:', API_ENDPOINTS.ALL_SUBCATEGORIES)
    const response = await api.get(API_ENDPOINTS.ALL_SUBCATEGORIES)
    console.log('getAllSubcategories - Full response:', response)
    console.log('getAllSubcategories - Response data:', response?.data)
    console.log('getAllSubcategories - Data length:', response?.data?.data?.length || response?.data?.length || 0)
    return response.data
  } catch (error) {
    console.error('getAllSubcategories - Error:', error)
    console.error('getAllSubcategories - Error response:', error?.response)
    throw error
  }
}

// Get All Subcategories Alternative (Testing Only)
// API: GET /api/subcategory/all
// Response: { status: true, data: [...], message: "Sub Category Fetch Successfully !" }
// Auth Required: No
export const getAllSubcategoriesAlt = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.ALL_SUBCATEGORIES_ALT)
    return response.data
  } catch (error) {
    throw error
  }
}

// Get Wedding Categories (Testing Only)
// API: GET /api/fetch/wedding/category
// Response: { status: true, data: [...] }
// Auth Required: No
export const getWeddingCategories = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.WEDDING_CATEGORIES)
    return response.data
  } catch (error) {
    throw error
  }
}

