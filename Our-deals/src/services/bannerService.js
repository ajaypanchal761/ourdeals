import api from './api'
import { API_ENDPOINTS } from '../utils/constants'

// Get All Banners
// API: GET /api/fetch/banner
// Response: { status: true, data: [...], message: "Banner Fetch Successfully" }
// Auth Required: No
export const getAllBanners = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.ALL_BANNERS)
    return response.data
  } catch (error) {
    throw error
  }
}

// Get Homepage Banners
// API: GET /api/fetch/homepage/banner
// Response: { status: true, data: [...], message: "HomePage Banner Fetch Successfully !" }
// Auth Required: Yes (Bearer Token)
export const getHomepageBanners = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.HOMEPAGE_BANNERS)
    return response.data
  } catch (error) {
    throw error
  }
}

// Get Wedding Banners
// API: GET /api/fetch/wedding/banner
// Response: { status: true, data: [...], message: "HomePage Banner Fetch Successfully !" }
// Auth Required: No
export const getWeddingBanners = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.WEDDING_BANNERS)
    return response.data
  } catch (error) {
    throw error
  }
}

