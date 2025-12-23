import { initializeApp, getApps } from 'firebase/app'
import { getMessaging, isSupported } from 'firebase/messaging'

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZXe7FLj282wVqEgMPlEbP_L7_GFvHgic",
  authDomain: "our-deals.firebaseapp.com",
  projectId: "our-deals",
  storageBucket: "our-deals.firebasestorage.app",
  messagingSenderId: "343685711870",
  appId: "1:343685711870:web:ee22aaa7d76314688822af",
  measurementId: "G-YSBL46QYTQ"
}

// Initialize Firebase
let app
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApps()[0]
}

// Get Firebase Messaging (lazy load)
export const getFirebaseMessaging = async () => {
  if (typeof window === 'undefined') return null
  
  const supported = await isSupported()
  if (!supported) {
    console.warn('Firebase Messaging is not supported in this browser')
    return null
  }
  
  return getMessaging(app)
}

export default app
