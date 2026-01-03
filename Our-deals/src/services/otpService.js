import api from './api'
import { API_ENDPOINTS } from '../utils/constants'

// Send OTP
// API: POST /api/send-otp
// Request: { phone: "9876543210" }
// Response: { status: true, message: "OTP sent successfully", data: {...} }
// Auth Required: No
export const sendOTP = async (phone) => {
  try {
    console.log('=== sendOTP API Call ===')
    console.log('Endpoint:', API_ENDPOINTS.SEND_OTP)
    console.log('Method: POST')
    console.log('Phone:', phone)

    const response = await api.post(API_ENDPOINTS.SEND_OTP, {
      phone: phone
    })

    console.log('=== sendOTP API Response ===')
    console.log('Response:', response.data)

    return response.data
  } catch (error) {
    console.error('=== sendOTP API Error ===')
    console.error('Error:', error)
    console.error('Error Response:', error?.response?.data)
    throw error
  }
}

// Verify OTP
// API: POST /api/verify-otp
// Request: { phone: "9876543210", otp: "xxxx" }
// Response: { status: true, message: "OTP verified successfully", data: { user: {...}, token: "...", token_type: "Bearer" } }
// Auth Required: No
export const verifyOTP = async (phone, otp) => {
  try {
    console.log('=== verifyOTP API Call ===')
    console.log('Endpoint:', API_ENDPOINTS.VERIFY_OTP)
    console.log('Method: POST')
    console.log('Phone:', phone)
    console.log('OTP:', otp)

    const requestBody = {
      phone: phone,
      otp: otp
    }

    const response = await api.post(API_ENDPOINTS.VERIFY_OTP, requestBody)

    console.log('=== verifyOTP API Response ===')
    console.log('Response:', response.data)

    return response.data
  } catch (error) {
    console.error('=== verifyOTP API Error ===')
    console.error('Error:', error)
    console.error('Error Response:', error?.response?.data)
    throw error
  }
}

// Resend OTP
// API: POST /api/resend-otp
// Request: { phone: "9876543210" }
// Response: { status: true, message: "OTP resent successfully", data: {...} }
// Auth Required: No
export const resendOTP = async (phone) => {
  try {
    console.log('=== resendOTP API Call ===')
    console.log('Endpoint:', API_ENDPOINTS.RESEND_OTP)
    console.log('Method: POST')
    console.log('Phone:', phone)

    const response = await api.post(API_ENDPOINTS.RESEND_OTP, {
      phone: phone
    })

    console.log('=== resendOTP API Response ===')
    console.log('Response:', response.data)

    return response.data
  } catch (error) {
    console.error('=== resendOTP API Error ===')
    console.error('Error:', error)
    console.error('Error Response:', error?.response?.data)
    throw error
  }
}

// Check OTP Status
// API: POST /api/check-otp-status
// Request: { phone: "9876543210" }
// Response: { status: true, data: { has_active_otp: true, time_left_seconds: 240, expires_at: "..." } }
// Auth Required: No
export const checkOTPStatus = async (phone) => {
  try {
    console.log('=== checkOTPStatus API Call ===')
    console.log('Endpoint:', API_ENDPOINTS.CHECK_OTP_STATUS)
    console.log('Method: POST')
    console.log('Phone:', phone)

    const response = await api.post(API_ENDPOINTS.CHECK_OTP_STATUS, {
      phone: phone
    })

    console.log('=== checkOTPStatus API Response ===')
    console.log('Response:', response.data)

    return response.data
  } catch (error) {
    console.error('=== checkOTPStatus API Error ===')
    console.error('Error:', error)
    console.error('Error Response:', error?.response?.data)
    throw error
  }
}

