import { useNavigate } from 'react-router-dom'
import TranslatedText from './TranslatedText'
import { useDynamicTranslation } from '../hooks/useDynamicTranslation'
import { useTranslation } from '../hooks/useTranslation'
import { useState, useEffect } from 'react'
import { isTranslationDisabled } from '../services/translationService'

function CategoryGrid({ categories = [], loading = false }) {
  const navigate = useNavigate()
  const { translateObject } = useDynamicTranslation()
  const { currentLanguage } = useTranslation()
  const [translatedCategories, setTranslatedCategories] = useState([])
  const shouldTranslate = currentLanguage !== 'en'

  // Translate category names when categories or language change
  useEffect(() => {
    if (!shouldTranslate || categories.length === 0) {
      setTranslatedCategories([])
      return
    }

    let isMounted = true
    const timeoutId = setTimeout(async () => {
      if (categories.length > 0 && isMounted) {
        try {
          const translated = await translateObject(categories, ['name', 'category_name', 'title', 'cat_name'])
          if (isMounted) {
            setTranslatedCategories(translated || categories)
          }
        } catch (error) {
          if (!isTranslationDisabled()) {
            console.error('Error translating categories:', error)
          }
          if (isMounted) {
            setTranslatedCategories(categories)
          }
        }
      }
    }, 100)

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
    }
  }, [categories.length, currentLanguage, shouldTranslate, translateObject])

  // Base URL for images from API
  const IMAGE_BASE_URL = 'https://ourdeals.appzetodemo.com/'

  // Construct full image URL from API response
  const getImageUrl = (imagePath) => {
    if (!imagePath) return ''
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath
    }
    // API returns relative paths like "uploads/cat_img/..."
    return `${IMAGE_BASE_URL}${imagePath}`
  }

  const categoriesToUse = (translatedCategories.length > 0 ? translatedCategories : categories).length > 0
    ? (translatedCategories.length > 0 ? translatedCategories : categories).map((cat, index) => ({
      categoryName: cat.name || cat.category_name || cat.title || cat.cat_name || 'Category',
      image: getImageUrl(cat.image || cat.icon || cat.image_url || cat.cat_img || ''),
      isPopular: cat.is_popular || cat.isPopular || false,
      id: cat.id || cat.category_id || index
    }))
    : []

  // Get only non-popular categories (isPopular: false) and take first 12 (2 rows x 6 columns)
  const nonPopularCategories = categoriesToUse
    .filter(category => !category.isPopular)
    .slice(0, 12)

  if (loading) {
    return (
      <div className="bg-transparent rounded-lg shadow-none px-4 py-0 w-full box-border">
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500"><TranslatedText>Loading categories...</TranslatedText></div>
        </div>
      </div>
    )
  }

  if (categoriesToUse.length === 0) {
    return (
      <div className="bg-transparent rounded-lg shadow-none px-4 py-0 w-full box-border">
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500"><TranslatedText>No categories available.</TranslatedText></div>
        </div>
      </div>
    )
  }

  const handleCategoryClick = (categoryName) => {
    navigate(`/categories/${encodeURIComponent(categoryName)}`)
  }

  const handleSeeMore = () => {
    navigate('/categories')
  }

  return (
    <div className="bg-transparent rounded-lg shadow-none px-4 py-0 w-full box-border">
      <div className="grid grid-rows-2 grid-flow-col w-full gap-2 overflow-x-auto overflow-y-hidden md:[scrollbar-width:thin] md:[scrollbar-color:#c1c1c1_#f1f1f1] [-webkit-overflow-scrolling:touch] md:grid-rows-2 md:grid-flow-col [&::-webkit-scrollbar]:hidden [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar]:h-0 [-ms-overflow-style:none] [scrollbar-width:none]" style={{ gridAutoColumns: '1fr', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {nonPopularCategories.map((category, index) => (
          <div key={index} className="flex flex-col items-center cursor-pointer pt-5 md:pt-0 w-full box-border" onClick={() => handleCategoryClick(category.categoryName)}>
            <div className="w-20 h-[90px] rounded-lg bg-[#F1F4F9] flex items-center justify-center mb-3 border-2 border-gray-200 overflow-hidden transition-all relative mx-auto hover:bg-[#F1F4F9] hover:border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.15),0_2px_4px_rgba(0,0,0,0.1)] hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.15)] p-1">
              <img
                src={category.image}
                alt={category.categoryName}
                className="w-full h-full object-contain transition-all"
                style={{
                  padding: '2px',
                  margin: 'auto',
                  maxWidth: 'calc(100% - 4px)',
                  maxHeight: 'calc(100% - 4px)',
                  display: 'block'
                }}
                onError={(e) => {
                  // Hide image if it fails to load
                  e.target.style.display = 'none'
                }}
              />
            </div>
            <span className="text-[clamp(10px,1.2vw,14px)] md:text-[clamp(9px,1.1vw,12px)] font-medium text-black text-center transition-colors leading-[1.3] break-words max-w-full w-full block hover:text-[#13335a]">
              <TranslatedText>{category.categoryName}</TranslatedText>
            </span>
          </div>
        ))}
        {/* More Option */}
        <div className="flex flex-col items-center cursor-pointer pt-5 md:pt-0 w-full box-border" onClick={handleSeeMore}>
          <div className="w-20 h-[90px] rounded-lg flex items-center justify-center bg-transparent border-none">
            <div className="flex flex-col items-center justify-center gap-1">
              <span className="text-[11px] font-semibold text-[#13335a] text-center"><TranslatedText>See More</TranslatedText></span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#13335a] w-5 h-5">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryGrid
