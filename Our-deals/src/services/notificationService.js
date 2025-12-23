import api from './api'
import { API_ENDPOINTS } from '../utils/constants'

// Register device token with backend
export const registerDeviceToken = async (token, deviceType = 'web') => {
  if (!token) {
    console.warn('notificationService: Missing FCM token, skipping registration')
    return
  }

  try {
    console.log('notificationService: Registering device token', { token, deviceType })

    // Get auth token from localStorage
    const authToken = localStorage.getItem('auth_token')
    
    if (!authToken) {
      console.warn('notificationService: No auth token found, device token registration may fail')
    }

    const response = await api.post(
      API_ENDPOINTS.DEVICE_TOKEN,
      {
        token,
        device_type: deviceType,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
      }
    )

    console.log('notificationService: Device token registration response', response.data)
    return response.data
  } catch (error) {
    console.error('notificationService: Failed to register device token', error)
    throw error
  }
}

// Fetch user notifications
// API: GET /api/notifications
// Response: { status: true, message: "...", data: [...], count: 2 }
// Auth Required: Yes (Bearer Token)
export const getNotifications = async () => {
  try {
    console.log('notificationService: Fetching notifications')
    
    const response = await api.get(API_ENDPOINTS.NOTIFICATIONS)
    
    console.log('notificationService: Notifications response', response.data)
    return response.data
  } catch (error) {
    console.error('notificationService: Failed to fetch notifications', error)
    throw error
  }
}
