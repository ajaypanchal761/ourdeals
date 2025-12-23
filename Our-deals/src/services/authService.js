import api from './api'
import { API_ENDPOINTS } from '../utils/constants'

// User Login
// API: POST /api/user/login
// Request: { phone: "9876543210" }
// Response: { status: true, message: "...", token: "...", user: {...} }
export const userLogin = async (phone) => {
  // Remove +91 if present, API expects just the 10-digit number
  const phoneNumber = phone.startsWith('+91') ? phone.replace('+91', '') : phone
  
  console.log('=== userLogin API Call ===')
  console.log('Phone (original):', phone)
  console.log('Phone (formatted):', phoneNumber)
  console.log('Endpoint:', API_ENDPOINTS.USER_LOGIN)
  
  // CRITICAL: Explicitly use POST method - use api.post() which ensures POST
  console.log('Making POST request to:', API_ENDPOINTS.USER_LOGIN)
  const response = await api.post(API_ENDPOINTS.USER_LOGIN, {
    phone: phoneNumber
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    maxRedirects: 0 // Prevent redirects that might convert POST to GET
  })
  
  console.log('=== userLogin API Response ===')
  console.log('Full response:', response.data)
  console.log('Token:', response.data?.token)
  console.log('User data:', response.data?.user)
  
  // Store token if received
  if (response.data?.token) {
    localStorage.setItem('auth_token', response.data.token)
    console.log('✅ Token stored in localStorage')
  }
  
  // Store minimal user data from response
  if (response.data?.user) {
    const apiUser = response.data.user
    const userData = {
      id: apiUser.id ?? apiUser.user_id ?? null,
      name: apiUser.name || '',
      email: apiUser.email ?? null,
      phone: apiUser.phone || apiUser.mobile || '',
      city: apiUser.city || '',
      address: apiUser.address || '',
    }
    localStorage.setItem('userData', JSON.stringify(userData))
    console.log('✅ User data stored in localStorage:', userData)
  }
  
  return response.data
}

// User Register
// API: POST /api/user/register
// Request: { name: "...", phone: "9876543210", address: "...", city: "..." }
// Response: { status: true, message: "...", data: {...}, token: "..." }
export const userRegister = async (userData) => {
  const { name, phone, address, city } = userData
  
  // Remove +91 if present, API expects just the 10-digit number
  const phoneNumber = phone.startsWith('+91') ? phone.replace('+91', '') : phone
  
  console.log('=== userRegister API Call ===')
  console.log('Endpoint:', API_ENDPOINTS.USER_REGISTER)
  console.log('Data:', { name, phone: phoneNumber, address, city })
  
  // CRITICAL: Explicitly use POST method - use api.post() which ensures POST
  console.log('Making POST request to:', API_ENDPOINTS.USER_REGISTER)
  const response = await api.post(API_ENDPOINTS.USER_REGISTER, {
    name: name,
    phone: phoneNumber,
    address: address,
    city: city
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    maxRedirects: 0 // Prevent redirects that might convert POST to GET
  })
  
  console.log('=== userRegister API Response ===')
  console.log('Full response:', response.data)
  console.log('Token:', response.data?.token)
  console.log('Data:', response.data?.data)
  
  // Store token if received
  if (response.data?.token) {
    localStorage.setItem('auth_token', response.data.token)
    console.log('✅ Token stored in localStorage')
  }
  
  // Store user data from response.data (API returns data in 'data' field)
  // Store in same format as login (OTP verification)
  if (response.data?.data) {
    const apiUserData = response.data.data
    const userData = {
      id: apiUserData.id ?? apiUserData.user_id ?? response.data.id ?? response.data.user_id ?? null,
      name: apiUserData.name || name || '',
      phone: apiUserData.phone || apiUserData.mobile || phoneNumber,
      email: apiUserData.email ?? null,
      address: apiUserData.address || address || '',
      city: apiUserData.city || city || '',
    }
    localStorage.setItem('userData', JSON.stringify(userData))
    console.log('✅ User data stored in localStorage after registration:', userData)
    console.log('✅ User ID stored:', userData.id)
    
    if (!userData.id) {
      console.warn('⚠️ WARNING: User ID is null after registration!')
      console.warn('⚠️ API Response data:', apiUserData)
    }
  } else {
    console.warn('⚠️ No data field in registration response')
  }
  
  return response.data
}

// User Logout
// API: POST /api/user/logout
export const userLogout = async () => {
  console.log('=== userLogout API Call ===')
  console.log('Endpoint:', API_ENDPOINTS.USER_LOGOUT)
  
  // Explicitly use POST method
  const response = await api({
    method: 'POST',
    url: API_ENDPOINTS.USER_LOGOUT,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
  
  console.log('=== userLogout API Response ===')
  console.log('Response:', response.data)
  
  // Clear token and user data
  localStorage.removeItem('auth_token')
  localStorage.removeItem('userData')
  window.dispatchEvent(new CustomEvent('userLogin'))
  
  return response.data
}

