import api from './api'
import { API_ENDPOINTS } from '../utils/constants'

// Agent Registration
// API: POST /api/agent/register
// Request: multipart/form-data with name, email, dob, gender, profile_img, phone, alternet_mobile
// Response: { status: true, message: "...", data: {...}, token: "..." }
export const registerAgent = async (agentData) => {
  const {
    name,
    email,
    dob,
    gender,
    profile_img,
    phone,
    alternet_mobile,
  } = agentData
  
  console.log('=== registerAgent API Call ===')
  console.log('Endpoint:', API_ENDPOINTS.AGENT_REGISTER)
  console.log('Data:', { name, email, dob, gender, phone, alternet_mobile, hasProfileImg: !!profile_img })
  
  // Create FormData for multipart/form-data
  const formData = new FormData()
  
  if (name) formData.append('name', name)
  if (email) formData.append('email', email)
  if (dob) formData.append('dob', dob)
  if (gender) formData.append('gender', gender)
  if (profile_img) formData.append('profile_img', profile_img)
  if (phone) {
    // Remove +91 if present, API expects just the 10-digit number
    const phoneNumber = phone.startsWith('+91') ? phone.replace('+91', '') : phone
    formData.append('phone', phoneNumber)
  }
  if (alternet_mobile) {
    // Remove +91 if present
    const altPhoneNumber = alternet_mobile.startsWith('+91') ? alternet_mobile.replace('+91', '') : alternet_mobile
    formData.append('alternet_mobile', altPhoneNumber)
  }
  
  const response = await api.post(API_ENDPOINTS.AGENT_REGISTER, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Accept': 'application/json'
    },
    maxRedirects: 0
  })
  
  console.log('=== registerAgent API Response ===')
  console.log('Full response:', response.data)
  console.log('Token:', response.data?.token)
  console.log('Agent data:', response.data?.data)
  
  // Store token if received
  if (response.data?.token) {
    localStorage.setItem('auth_token', response.data.token)
    console.log('✅ Token stored in localStorage')
  }
  
  return response.data
}

