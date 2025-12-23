import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "./i18n";

// Disable zoom on mobile
const viewport = document.querySelector('meta[name="viewport"]')
if (viewport) {
  viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
}

// Prevent zoom gestures
document.addEventListener('gesturestart', (e) => e.preventDefault())
document.addEventListener('gesturechange', (e) => e.preventDefault())
document.addEventListener('gestureend', (e) => e.preventDefault())

// Prevent double-tap zoom
let lastTouchEnd = 0
document.addEventListener('touchend', (e) => {
  const now = Date.now()
  if (now - lastTouchEnd <= 300) {
    e.preventDefault()
  }
  lastTouchEnd = now
}, false)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
