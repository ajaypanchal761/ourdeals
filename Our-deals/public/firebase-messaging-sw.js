// Firebase Cloud Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js')

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
firebase.initializeApp(firebaseConfig)

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging()

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('🔔 Background message received:', payload)
  console.log('Notification payload:', payload.notification)
  console.log('Data payload:', payload.data)
  
  const notificationTitle = payload.notification?.title || payload.data?.title || 'New Notification'
  const notificationBody = payload.notification?.body || payload.data?.body || 'You have a new notification'
  
  const notificationOptions = {
    body: notificationBody,
    icon: payload.notification?.icon || payload.data?.icon || '/vite.svg',
    badge: '/vite.svg',
    image: payload.notification?.image || payload.data?.image,
    data: payload.data || {},
    requireInteraction: false,
    silent: false,
    tag: payload.data?.tag || 'default',
    renotify: true
  }

  console.log('🔔 Showing notification:', notificationTitle, notificationOptions)
  
  return self.registration.showNotification(notificationTitle, notificationOptions)
    .then(() => {
      console.log('✅ Notification displayed successfully')
    })
    .catch((error) => {
      console.error('❌ Error showing notification:', error)
    })
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification clicked:', event.notification)
  event.notification.close()
  
  // Open or focus the app
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i]
        if (client.url === '/' && 'focus' in client) {
          return client.focus()
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/')
      }
    })
  )
})
