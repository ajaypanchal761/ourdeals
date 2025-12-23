import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()
  ],
  server: {
    host: '0.0.0.0', // Allow access from network
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://ourdeals.appzetodemo.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Explicitly preserve the HTTP method - CRITICAL for POST requests
            if (req.method) {
              proxyReq.method = req.method.toUpperCase()
            }
            // Ensure Content-Type is set for POST requests
            if (req.method === 'POST' || req.method === 'post') {
              if (!proxyReq.getHeader('Content-Type')) {
                proxyReq.setHeader('Content-Type', 'application/json')
              }
              // Ensure method is POST
              proxyReq.method = 'POST'
            }
            console.log('Proxying request:', req.method, req.url, 'to', proxyReq.path)
            console.log('Request method:', proxyReq.method)
            console.log('Request headers:', JSON.stringify(proxyReq.getHeaders(), null, 2))
          })
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Proxy response:', proxyRes.statusCode, 'for', req.method, req.url)
          })
          proxy.on('error', (err, req, res) => {
            console.error('Proxy error:', err.message)
          })
        }
      }
    }
  },
})