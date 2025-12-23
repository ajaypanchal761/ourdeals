import api from './api'
import { API_ENDPOINTS } from '../utils/constants'

// Fetch static pages like Contact Us, About Us, etc.
// API: GET /api/fetch/pages
// Response: { success: true, data: [ { id, title, description, ... }, ... ] }
export const fetchPages = async () => {
  const response = await api.get(API_ENDPOINTS.PAGES)
  return response.data
}


