import api from './api'

// Search subcategories/vendors by keyword
// API: GET /api/search?keyword={keyword}
// Response: { success: true/false, data: [ { id, category_id, name, image }, ... ] }
export const searchSubcategories = async (keyword) => {
  const response = await api.get('/search', {
    params: { keyword },
  })
  return response.data
}


