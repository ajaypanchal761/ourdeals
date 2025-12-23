import { useState, useEffect } from 'react'
import CategorySection from './CategorySection'
import TranslatedText from './TranslatedText'

// Base URL for images from API
const IMAGE_BASE_URL = 'https://ourdeals.appzetodemo.com/'

// Construct full image URL from API response
const getImageUrl = (imagePath) => {
  if (!imagePath) return ''
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  return `${IMAGE_BASE_URL}${imagePath}`
}

function RemainingCategorySectionsList({ categoryName = '', subcategories = [] }) {
  const [categoriesToDisplay, setCategoriesToDisplay] = useState([])

  useEffect(() => {
    // Only use API data, NO dummy data fallback
    if (categoryName && subcategories && Array.isArray(subcategories) && subcategories.length > 0) {
      // Transform API data to match CategorySection format
      const categoryData = {
        categoryName: categoryName,
        subCategories: subcategories.map(item => ({
          name: item.name || 'Item',
          image: getImageUrl(item.image || '')
        }))
      }

      setCategoriesToDisplay([categoryData])
    } else {
      setCategoriesToDisplay([])
    }
  }, [categoryName, subcategories])

  // Don't render anything if no data
  if (categoriesToDisplay.length === 0) {
    return null
  }

  return (
    <div className="w-full px-4">
      {categoriesToDisplay.map((category, index) => (
        <CategorySection key={index} category={category} />
      ))}
    </div>
  )
}

export default RemainingCategorySectionsList

