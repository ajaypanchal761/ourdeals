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
  const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath
  return `${IMAGE_BASE_URL}${cleanPath}`
}

function PopularCategoriesSection({ popularCategories = [] }) {
  const navigate = useNavigate()
  const { translateObject } = useDynamicTranslation()
  const { currentLanguage } = useTranslation()
  const [translatedCategories, setTranslatedCategories] = useState([])
  const shouldTranslate = currentLanguage !== 'en'

  // Translate category names when popularCategories or language change
  useEffect(() => {
    if (!shouldTranslate || popularCategories.length === 0) {
      setTranslatedCategories([])
      return
    }

    let isMounted = true
    const timeoutId = setTimeout(async () => {
      if (popularCategories.length > 0 && isMounted) {
        try {
          const translated = await translateObject(popularCategories, ['name'])
          if (isMounted) {
            setTranslatedCategories(translated || popularCategories)
          }
        } catch (error) {
          if (!isTranslationDisabled()) {
            console.error('Error translating popular categories:', error)
          }
          if (isMounted) {
            setTranslatedCategories(popularCategories)
          }
        }
      }
    }, 100)

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
    }
  }, [popularCategories.length, currentLanguage, shouldTranslate, translateObject])

  const categoriesToShow = (translatedCategories.length > 0 ? translatedCategories : popularCategories || [])
    .map((category) => {
      const rawName = category.name || category.categoryName || ''
      const lower = rawName.toLowerCase()

      // Normalize to fixed names for routing
      if (category.id === 13 || lower.includes('wedding')) {
        return {
          name: 'Wedding Requisites',
          image: getImageUrl(category.image || category.category_image || category.icon || ''),
        }
      }

      if (category.id === 23 || lower.includes('explore')) {
        return {
          name: 'Explore City',
          image: getImageUrl(category.image || category.category_image || category.icon || ''),
        }
      }

      return null
    })
    .filter(Boolean)

  const handleCategoryClick = (categoryName) => {
    // Navigate to category subcategories page with category name
    navigate(`/category/${encodeURIComponent(categoryName)}`, { state: { categoryName } })
  }

  if (!categoriesToShow.length) {
    return null
  }

  return (
    <div className="w-full pt-[clamp(16px,2vw,24px)] pb-[clamp(8px,1vw,12px)] px-4 bg-white block md:hidden">
      <h2 className="text-[clamp(20px,2.5vw,28px)] md:text-[clamp(18px,2.2vw,24px)] font-bold text-black mb-[clamp(16px,2vw,24px)] md:mb-[clamp(14px,1.8vw,20px)] pl-0">
        <TranslatedText>Popular Categories</TranslatedText>
      </h2>
      <div className="flex gap-4 md:gap-6 overflow-x-auto overflow-y-hidden pb-[clamp(8px,1vw,12px)] pt-2 pl-2 pr-4 md:pr-6 [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar]:h-0 [-ms-overflow-style:none] [scrollbar-width:none]" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {/* Show categories */}
        {categoriesToShow.map((category, index) => (
          <div
            key={index}
            className="bg-white rounded-[clamp(28px,4vw,40px)] shadow-[0_-2px_6px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.08),-2px_0_6px_rgba(0,0,0,0.08),2px_0_6px_rgba(0,0,0,0.08)] overflow-visible cursor-pointer flex-shrink-0 w-[calc((100%-16px)/2)] min-w-[calc((100%-16px)/2)] max-w-[calc((100%-16px)/2)] md:w-[calc((100%-24px)/2)] md:min-w-[calc((100%-24px)/2)] md:max-w-[calc((100%-24px)/2)] aspect-[3/4] transition-all flex flex-col p-[clamp(12px,1.5vw,16px)] box-border relative hover:-translate-y-1"
            onClick={() => handleCategoryClick(category.name)}
          >
            <div className="flex items-center justify-between py-[clamp(12px,1.5vw,16px)] px-[clamp(10px,1.3vw,14px)] bg-white box-border">
              <span className="text-[clamp(16px,2.2vw,22px)] font-bold text-[#856D65] flex-1 leading-[1.3] break-words overflow-hidden text-ellipsis line-clamp-2">
                <TranslatedText>{category.name}</TranslatedText>
              </span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#856D65] flex-shrink-0 w-[clamp(12px,1.5vw,16px)] h-[clamp(12px,1.5vw,16px)] ml-2">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="w-full flex-1 relative overflow-hidden bg-white rounded-b-[clamp(28px,4vw,40px)]">
              <img
                src={category.image}
                alt={category.name}
                className="absolute top-0 left-0 w-full h-full object-cover scale-[1.3]"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PopularCategoriesSection

