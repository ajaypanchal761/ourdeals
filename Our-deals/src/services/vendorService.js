import api from './api'
import { API_ENDPOINTS } from '../utils/constants'

// Get Vendor Details
// API: GET /api/fetch/vendor/detail/{id}
// Response: { status: true, data: {...}, message: "Vendor Detail Fetch Successfully" }
// Auth Required: No
export const getVendorDetails = async (vendorId) => {
  try {
    const response = await api.get(`${API_ENDPOINTS.VENDOR_DETAIL}/${vendorId}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// Fetch Vendors with Location
// API: POST /api/fetch/vendor
// Response: { status: true, message: "Vendors found successfully", data: [...] }
// Auth Required: No
export const fetchVendors = async (lat, lng, subcatId, filter = 'nearby') => {
  try {
    const response = await api.post(API_ENDPOINTS.FETCH_VENDORS, {
      lat: lat,
      lng: lng,
      subcat_id: subcatId,
      filter: filter
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// Add Work Images
// API: POST /api/vendor/work-image/add
// Request: multipart/form-data with user_id and work_img[] (files)
// Response: { status: true, message: "Images added successfully.", work_img: [...] }
// Auth Required: Yes (Bearer Token)
export const addWorkImages = async (userId, imageFiles) => {
  try {
    const formData = new FormData()
    formData.append('user_id', userId)
    
    // Append each image file
    if (Array.isArray(imageFiles)) {
      imageFiles.forEach((file) => {
        formData.append('work_img[]', file)
      })
    } else {
      formData.append('work_img[]', imageFiles)
    }
    
    const response = await api.post(API_ENDPOINTS.VENDOR_WORK_IMAGE_ADD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    return response.data
  } catch (error) {
    throw error
  }
}

// Fetch Work Images
// API: POST /api/vendor/work-image/fetch
// Request: { user_id: 1 }
// Response: { status: true, message: "Images fetched successfully.", work_img: [...] }
// Auth Required: Yes (Bearer Token)
export const fetchWorkImages = async (userId) => {
  try {
    const response = await api.post(API_ENDPOINTS.VENDOR_WORK_IMAGE_FETCH, {
      user_id: userId
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// Delete Work Image
// API: POST /api/vendor/work-image/delete
// Request: { user_id: 1, image: "uploads/work/image.jpg" }
// Response: { status: true, message: "Image deleted successfully.", work_img: [...] }
// Auth Required: Yes (Bearer Token)
export const deleteWorkImage = async (userId, imagePath) => {
  try {
    const response = await api.post(API_ENDPOINTS.VENDOR_WORK_IMAGE_DELETE, {
      user_id: userId,
      image: imagePath
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// Submit Review
// API: POST /api/reviews
// Request: { vendor_id: 1, review: "Great service!", star: 5 }
// Response: { status: true, message: "Review submitted successfully", data: {...} }
// Auth Required: Yes (Bearer Token)
export const submitReview = async (vendorId, review, star) => {
  try {
    const response = await api.post(API_ENDPOINTS.REVIEWS, {
      vendor_id: vendorId,
      review: review,
      star: star
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// Get Vendor Reviews
// API: GET /api/vendor/reviews/{vendorId}
// Response: { status: true, data: [...], message: "Reviews fetched successfully" }
// Auth Required: No
export const getVendorReviews = async (vendorId) => {
  try {
    const response = await api.get(`${API_ENDPOINTS.VENDOR_REVIEWS}/${vendorId}`)
    return response.data
  } catch (error) {
    throw error
  }
}

