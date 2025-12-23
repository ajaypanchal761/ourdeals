import { useNavigate } from 'react-router-dom'
import TranslatedText from './TranslatedText'
import { useDynamicTranslation } from '../hooks/useDynamicTranslation'
import { useTranslation } from '../hooks/useTranslation'
import { useState, useEffect } from 'react'
import { isTranslationDisabled } from '../services/translationService'

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

function CategorySection({ category }) {
  const navigate = useNavigate()
  const { translateObject } = useDynamicTranslation()
  const [translatedSubcategories, setTranslatedSubcategories] = useState([])


  // Get current language to trigger translations only when language changes
  const { currentLanguage } = useTranslation()
  const shouldTranslate = currentLanguage !== 'en'

  // Translate subcategory names when category or language changes
  useEffect(() => {
    if (!shouldTranslate) {
      setTranslatedSubcategories([])
      return
    }

    if (!category?.subCategories || category.subCategories.length === 0) {
      return
    }

    let isMounted = true
    const timeoutId = setTimeout(async () => {
      if (category?.subCategories && category.subCategories.length > 0 && isMounted) {
        try {
          // Add original_name to preserve English name for navigation
          const itemsToTranslate = category.subCategories.map(item => ({
            ...item,
            original_name: item.name || item.subcategory_name || item.title
          }))

          const translated = await translateObject(itemsToTranslate, ['name'])
          if (isMounted) {
            setTranslatedSubcategories(translated || itemsToTranslate)
          }
        } catch (error) {
          if (!isTranslationDisabled()) {
            console.error('Error translating subcategories:', error)
          }
          if (isMounted) {
            setTranslatedSubcategories(category.subCategories)
          }
        }
      }
    }, 100) // Debounce translations

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
    }
  }, [category?.subCategories?.length, currentLanguage, shouldTranslate, translateObject])

  const handleSubcategoryClick = (subcategoryName) => {
    navigate(`/vendors/${encodeURIComponent(subcategoryName)}`)
  }

  const handleCategoryClick = () => {
    navigate(`/categories/${encodeURIComponent(category.categoryName)}`)
  }

  if (!category || !category.subCategories || category.subCategories.length === 0) {
    return null
  }


  const subcategoriesToDisplay = translatedSubcategories.length > 0 ? translatedSubcategories : (category?.subCategories || [])

  return (
    <div className={`w-full mb-[clamp(32px,4vw,24px)] ${category.categoryName === 'Home Services' || category.categoryName === 'Health & Fitness' || category.categoryName === 'Beauty Care' || category.categoryName === 'Professional Services' || category.categoryName === 'Trending' || category.categoryName === 'Rental Services' || category.categoryName === 'Some Categories' ? 'min-[1088px]:mt-[clamp(24px,3vw,32px)]' : ''}`}>
      <div className="flex items-center justify-between mb-[clamp(16px,2vw,24px)] cursor-pointer p-0" onClick={handleCategoryClick}>
        <h3 className="text-[clamp(20px,2.5vw,28px)] md:text-[clamp(18px,2.2vw,24px)] font-bold text-gray-800 m-0 pl-0">
          <TranslatedText>{category.categoryName}</TranslatedText>
        </h3>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-gray-500 flex-shrink-0 w-[clamp(18px,2vw,24px)] h-[clamp(18px,2vw,24px)]"
        >
          <path
            d="M9 18L15 12L9 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="flex gap-2 overflow-x-auto overflow-y-hidden p-0 md:scrollbar-thin md:scrollbar-thumb-[#cbd5e0] md:scrollbar-track-transparent md:[&::-webkit-scrollbar]:h-1.5 md:[&::-webkit-scrollbar-track]:bg-transparent md:[&::-webkit-scrollbar-thumb]:bg-[#cbd5e0] md:[&::-webkit-scrollbar-thumb]:rounded-sm [-webkit-overflow-scrolling:touch] max-w-[1400px] mx-auto [&::-webkit-scrollbar]:hidden [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar]:h-0 [-ms-overflow-style:none] [scrollbar-width:none] md:[scrollbar-width:thin] md:[scrollbar-color:#cbd5e0_transparent]" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {subcategoriesToDisplay.map((subcat, index) => {
          const subcatName = typeof subcat === 'string' ? subcat : (subcat.name || subcat.subcategory_name || subcat.title || 'Service')
          // Use original_name for navigation if available (ensures English name is used for API lookups)
          const navName = typeof subcat === 'object' && subcat.original_name ? subcat.original_name : subcatName

          const subcatImageRaw = typeof subcat === 'object' ? subcat.image : null
          const subcatImage = subcatImageRaw ? (subcatImageRaw.startsWith('http://') || subcatImageRaw.startsWith('https://') ? subcatImageRaw : getImageUrl(subcatImageRaw)) : null

          return (
            <div
              key={index}
              className="flex flex-col items-center cursor-pointer flex-shrink-0 w-[calc(100%/4)] min-w-[calc(100%/4)] md:w-[calc(100%/5)] md:min-w-[calc(100%/5)] lg:w-[calc(100%/6)] lg:min-w-[calc(100%/6)] lg:max-w-[90px] transition-transform hover:-translate-y-0.5"
              onClick={() => handleSubcategoryClick(navName)}
            >
              <div className="w-full h-0 pb-[150%] relative rounded-[clamp(10px,1.2vw,12px)] overflow-hidden bg-gray-100 mb-[clamp(8px,1vw,12px)] aspect-[2/3] shadow-[0_4px_12px_rgba(0,0,0,0.15),0_2px_4px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.15)]">
                {subcatImage ? (
                  <img
                    src={subcatImage}
                    alt={subcatName}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-[#13335a] text-white font-bold text-[clamp(20px,3vw,28px)]">
                    <span>{subcatName.charAt(0)}</span>
                  </div>
                )}
              </div>
              <span className="text-[clamp(12px,1.4vw,14px)] font-bold text-gray-700 text-center leading-[1.4] break-words w-full block hover:text-[#13335a]">
                <TranslatedText>{subcatName}</TranslatedText>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CategorySection

