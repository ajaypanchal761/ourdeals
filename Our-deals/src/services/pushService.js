import { getFirebaseMessaging } from '../firebase'
import { getToken, onMessage } from 'firebase/messaging'
import { registerDeviceToken } from './notificationService'

// const VAPID_KEY = 'BHPVZKFccEwYL1C0I2Kb00GG01X4mBdECeo7pMS7FDN40HhydoD-vQlfEckP783bpzdXC59-WYrVpx76gn9H3SM'
const VAPID_KEY = 'BFnSH97u_mwaiGtckTrhqlR4VtqEVmd_Yk34DRizWEEsALE9LbWDjTpFb944IlpW8KCyN44RfPJA1dUT2RpQUNQ'
const LOCAL_STORAGE_KEY = 'fcm_token'

// Request browser notification permission and register FCM token with backend
export const initPushNotifications = async () => {
  if (typeof window === 'undefined') return

  if (!('Notification' in window)) {
    console.warn('Push notifications are not supported in this browser.')
    return
  }

  try {
    // Request notification permission
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      console.log('User did not grant notification permission')
      return
    }

    // Register service worker and wait for it to be ready
    let serviceWorkerRegistration = null
    if ('serviceWorker' in navigator) {
      try {
        // Check if service worker is already registered
        const existingRegistration = await navigator.serviceWorker.getRegistration('/')
        
        if (existingRegistration) {
          console.log('✅ Service Worker already registered:', existingRegistration.scope)
          serviceWorkerRegistration = existingRegistration
          
          // Wait for service worker to be active
          if (serviceWorkerRegistration.active) {
            console.log('✅ Service Worker is active')
          } else if (serviceWorkerRegistration.installing) {
            console.log('⏳ Service Worker is installing, waiting...')
            await new Promise((resolve) => {
              serviceWorkerRegistration.installing.addEventListener('statechange', () => {
                if (serviceWorkerRegistration.installing.state === 'activated') {
                  resolve()
                }
              })
            })
          } else if (serviceWorkerRegistration.waiting) {
            console.log('⏳ Service Worker is waiting, activating...')
            serviceWorkerRegistration.waiting.postMessage({ type: 'SKIP_WAITING' })
            await new Promise((resolve) => {
              serviceWorkerRegistration.waiting.addEventListener('statechange', () => {
                if (serviceWorkerRegistration.waiting.state === 'activated') {
                  resolve()
                }
              })
            })
          }
        } else {
          // Register new service worker
          serviceWorkerRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
            scope: '/'
          })
          console.log('✅ Service Worker registered:', serviceWorkerRegistration.scope)
          
          // Wait for service worker to be ready
          if (serviceWorkerRegistration.installing) {
            console.log('⏳ Waiting for Service Worker to activate...')
            await new Promise((resolve) => {
              serviceWorkerRegistration.installing.addEventListener('statechange', () => {
                if (serviceWorkerRegistration.installing.state === 'activated') {
                  console.log('✅ Service Worker activated')
                  resolve()
                }
              })
            })
          }
        }
      } catch (error) {
        console.error('❌ Service Worker registration failed:', error)
        return
      }
    } else {
      console.warn('⚠️ Service Worker not supported in this browser')
      return
    }

    // Get Firebase Messaging instance
    const messaging = await getFirebaseMessaging()
    if (!messaging) {
      console.warn('Firebase Messaging not available')
      return
    }

    // Get FCM token - ensure service worker is ready
    let currentToken = null
    try {
      currentToken = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: serviceWorkerRegistration
      })
    } catch (tokenError) {
      console.error('❌ Error getting FCM token:', tokenError)
      
      // If token error, try to get token without service worker registration
      try {
        console.log('🔄 Retrying token generation without service worker registration...')
        currentToken = await getToken(messaging, {
          vapidKey: VAPID_KEY
        })
      } catch (retryError) {
        console.error('❌ Failed to get FCM token after retry:', retryError)
        return
      }
    }

    if (!currentToken) {
      console.warn('⚠️ No FCM registration token available.')
      console.warn('⚠️ Possible reasons:')
      console.warn('   - Service worker not properly registered')
      console.warn('   - Notification permission not granted')
      console.warn('   - Firebase configuration issue')
      return
    }

    // Validate token format
    if (typeof currentToken !== 'string' || currentToken.length < 50) {
      console.error('❌ Invalid FCM token format:', currentToken)
      return
    }

    console.log('📱 FCM Token generated successfully')
    console.log('📱 Token length:', currentToken.length)
    console.log('📱 Token preview:', currentToken.substring(0, 30) + '...' + currentToken.substring(currentToken.length - 10))
    console.log('📱 Token format valid:', currentToken.includes(':') ? 'Yes (contains colon)' : 'Warning: No colon found')

    // Check if token already exists
    const existingToken = localStorage.getItem(LOCAL_STORAGE_KEY)
    
    if (existingToken === currentToken) {
      console.log('FCM token already exists locally. Re-registering with backend to ensure DB sync...')
      try {
        await registerDeviceToken(currentToken, 'web')
        // Ensure localStorage has the latest token (even if same, ensures consistency)
        localStorage.setItem(LOCAL_STORAGE_KEY, currentToken)
        console.log('✅ FCM token re-registered with backend DB and localStorage updated')
      } catch (err) {
        console.warn('⚠️ Failed to re-register token (may already exist in DB):', err.message)
        // Still update localStorage to ensure it has current token
        localStorage.setItem(LOCAL_STORAGE_KEY, currentToken)
      }
    } else {
      console.log('📱 Token changed! Registering new FCM token with backend...')
      console.log('Old token:', existingToken ? existingToken.substring(0, 20) + '...' : 'None')
      console.log('New token:', currentToken.substring(0, 20) + '...')
      try {
        await registerDeviceToken(currentToken, 'web')
        // Update localStorage with new token (this is the token that's now in DB)
        localStorage.setItem(LOCAL_STORAGE_KEY, currentToken)
        console.log('✅ New FCM token registered with backend DB and localStorage updated')
      } catch (err) {
        console.error('❌ Failed to register token with backend:', err)
        // Still store locally even if backend registration fails
        // This ensures localStorage has the latest token
        localStorage.setItem(LOCAL_STORAGE_KEY, currentToken)
        console.log('⚠️ Token saved to localStorage but backend registration failed')
      }
    }

    // Handle foreground messages
    onMessage(messaging, (payload) => {
      console.log('FCM foreground message received:', payload)
      const { title, body } = payload.notification || {}
      if (title) {
        new Notification(title, { body })
      }
    })
  } catch (error) {
    console.error('Error initializing push notifications:', error)
  }
}

// Refresh FCM token and update in backend
// This should be called when "NotRegistered" error occurs
export const refreshFCMToken = async () => {
  console.log('🔄 Refreshing FCM token...')
  
  try {
    // Clear old token from localStorage
    const oldToken = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (oldToken) {
      console.log('🗑️ Clearing old invalid token from localStorage')
      localStorage.removeItem(LOCAL_STORAGE_KEY)
    }
    
    // Re-initialize push notifications to get fresh token
    await initPushNotifications()
    console.log('✅ FCM token refreshed successfully')
  } catch (error) {
    console.error('❌ Error refreshing FCM token:', error)
    throw error
  }
}

// Force refresh token on app load (if user is logged in)
export const ensureFCMTokenIsValid = async () => {
  const authToken = localStorage.getItem('auth_token')
  const userData = localStorage.getItem('userData')
  
  if (!authToken || !userData) {
    console.log('⚠️ User not logged in, skipping FCM token validation')
    return
  }
  
  console.log('🔍 Checking FCM token validity...')
  
  try {
    // Always refresh token on app load to ensure it's valid
    await initPushNotifications()
    console.log('✅ FCM token validated and updated')
  } catch (error) {
    console.error('❌ Error validating FCM token:', error)
  }
}
