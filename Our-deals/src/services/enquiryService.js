import api from './api'
import { API_ENDPOINTS } from '../utils/constants'

// Create Enquiry
// API: POST /api/enquires
// Request: { user_id: 1, vendor_id: 1, date: "2024-01-15" }
// Response: { status: "success", message: "Enquiry created successfully", data: {...} }
// Auth Required: Yes (Bearer Token)
export const createEnquiry = async (enquiryData) => {
  const { user_id, vendor_id, date } = enquiryData
  
  try {
    console.log('=== createEnquiry API Call ===')
    console.log('Endpoint:', API_ENDPOINTS.CREATE_ENQUIRY)
    console.log('Data:', { user_id, vendor_id, date })
    
    const response = await api.post(API_ENDPOINTS.CREATE_ENQUIRY, {
      user_id,
      vendor_id,
      date
    })
    
    console.log('=== createEnquiry API Response ===')
    console.log('Response:', response.data)
    
    return response.data
  } catch (error) {
    console.error('=== createEnquiry API Error ===')
    console.error('Error:', error)
    throw error
  }
}

// Get Enquiries by Vendor
// API: GET /api/enquires/vendor/{vendor_id}
// Response: { status: "success", message: "Enquiries fetched successfully", data: [...] }
// Auth Required: Yes (Bearer Token)
export const getVendorEnquiries = async (vendorId) => {
  try {
    console.log('=== getVendorEnquiries API Call ===')
    console.log('Endpoint:', `${API_ENDPOINTS.GET_VENDOR_ENQUIRIES}/${vendorId}`)
    
    const response = await api.get(`${API_ENDPOINTS.GET_VENDOR_ENQUIRIES}/${vendorId}`)
    
    console.log('=== getVendorEnquiries API Response ===')
    console.log('Response:', response.data)
    
    return response.data
  } catch (error) {
    console.error('=== getVendorEnquiries API Error ===')
    console.error('Error:', error)
    throw error
  }
}

// Get User Enquiries
// API: GET /api/enquires/user
// Response: { status: "success", message: "Enquiries fetched successfully", data: [...] }
// Auth Required: Yes (Bearer Token)
export const getUserEnquiries = async () => {
  try {
    console.log('=== getUserEnquiries API Call ===')
    console.log('Endpoint:', API_ENDPOINTS.GET_USER_ENQUIRIES)
    
    const response = await api.get(API_ENDPOINTS.GET_USER_ENQUIRIES)
    
    console.log('=== getUserEnquiries API Response ===')
    console.log('Response:', response.data)
    
    return response.data
  } catch (error) {
    console.error('=== getUserEnquiries API Error ===')
    console.error('Error:', error)
    throw error
  }
}

