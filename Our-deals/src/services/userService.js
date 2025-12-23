import api from './api'
import { API_ENDPOINTS } from '../utils/constants'

// Update User Profile
// API: POST /api/update/profile
// Request: multipart/form-data with user_id, name, email, phone, city, address, lat, long, profile_img (optional)
// Response: { status: true, message: "...", user: {...} }
export const updateProfile = async (profileData) => {
  const {
    id,
    user_id,
    name,
    email,
    phone,
    city,
    address,
    lat,
    long,
  } = profileData
  
  // Use user_id if provided, otherwise fall back to id
  const userId = user_id || id
  
  console.log('=== updateProfile API Call ===')
  console.log('Endpoint:', API_ENDPOINTS.UPDATE_PROFILE)
  console.log('Data:', { user_id: userId, name, email, phone, city, address, lat, long })
  
  // Create FormData for multipart/form-data
  const formData = new FormData()
  
  // Backend expects `user_id` in request
  if (userId) {
    formData.append('user_id', userId)
  }
  if (name) formData.append('name', name)
  if (email) formData.append('email', email)
  if (phone) {
    // Remove +91 if present, API expects just the 10-digit number
    const phoneNumber = phone.startsWith('+91') ? phone.replace('+91', '') : phone
    formData.append('phone', phoneNumber)
  }
  if (city) formData.append('city', city)
  if (address) formData.append('address', address)
  if (lat) formData.append('lat', lat)
  if (long) formData.append('long', long)
  
  const response = await api.post(API_ENDPOINTS.UPDATE_PROFILE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Accept': 'application/json'
    },
    maxRedirects: 0
  })
  
  console.log('=== updateProfile API Response ===')
  console.log('Full response:', response.data)
  console.log('User data:', response.data?.user)
  
  return response.data
}

