import { useState, useEffect } from 'react'
import { isTranslationDisabled } from '../services/translationService'
import { useNavigate } from 'react-router-dom'
import banner7 from '../assets/banner 7.jpg'
import banner8 from '../assets/banner 8.webp'
import TranslatedText from './TranslatedText'
import { useDynamicTranslation } from '../hooks/useDynamicTranslation'
import { useTranslation } from '../hooks/useTranslation'

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

function BannerWithCategories({ popularCategories = [], bannerImages = [] }) {
  const navigate = useNavigate()
  const { translateObject } = useDynamicTranslation()
  const { currentLanguage } = useTranslation()
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)
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
            console.error('Error translating categories:', error)
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

  // Use API banner images if available, otherwise use local fallback banners
  const banners = bannerImages.length > 0
    ? bannerImages.map(imagePath => getImageUrl(imagePath))
    : [banner7, banner8]

  // Use popular categories from API if available
  const categoriesToDisplay = (translatedCategories.length > 0 ? translatedCategories : popularCategories || []).slice(0, 2).map(cat => {
    let normalizedName = cat.name
    if (cat.name && (cat.name.toLowerCase().includes('wedding') || cat.id === 13)) {
      normalizedName = 'Wedding Requisites'
    }
    if (cat.name && (cat.name.toLowerCase().includes('explore') || cat.id === 23)) {
      normalizedName = 'Explore City'
    }
    return {
      id: cat.id,
      name: normalizedName,
      image: getImageUrl(cat.image)
    }
  })

  useEffect(() => {
    // Set first banner as active immediately
    if (banners.length > 0) {
      setCurrentBannerIndex(0)
    }

    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [banners.length])

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${encodeURIComponent(categoryName)}`, { state: { categoryName } })
  }

  return (
    <div className="hidden md:flex w-full px-4 mb-[clamp(24px,3vw,32px)] md:mb-[clamp(20px,2.5vw,28px)] flex-col md:flex-row gap-[clamp(12px,1.5vw,16px)] items-stretch">
      {/* Banner */}
      <div className="flex-[2] rounded-[clamp(12px,1.5vw,16px)] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.1)] relative bg-gray-100 h-[clamp(150px,20vw,300px)] min-h-[clamp(150px,20vw,300px)]">
        <div className="relative w-full h-full">
          {banners.map((banner, index) => (
            <img
              key={index}
              src={banner}
              alt={<TranslatedText>Banner {index + 1}</TranslatedText>}
              className={`absolute top-0 left-0 w-full h-full block object-cover transition-opacity duration-500 ${index === currentBannerIndex ? 'opacity-100 z-[1]' : 'opacity-0'} ${index === 0 ? 'opacity-100 z-[1]' : ''}`}
            />
          ))}
        </div>
        <div className="absolute bottom-[clamp(12px,1.5vw,16px)] left-1/2 -translate-x-1/2 flex gap-[clamp(6px,0.8vw,8px)] z-10">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`w-[clamp(8px,1vw,10px)] h-[clamp(8px,1vw,10px)] rounded-full border-none cursor-pointer transition-colors p-0 ${index === currentBannerIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/80'}`}
              onClick={() => setCurrentBannerIndex(index)}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      </div>
      {/* Category Boxes */}
      <div className="grid grid-cols-2 gap-[clamp(12px,1.5vw,16px)] flex-[1] h-[clamp(150px,20vw,300px)] min-h-[clamp(150px,20vw,300px)]">
        {categoriesToDisplay.map((category, index) => (
          <div
            key={category.id || index}
            className="bg-white rounded-[clamp(28px,4vw,40px)] shadow-[0_-2px_6px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.08),-2px_0_6px_rgba(0,0,0,0.08),2px_0_6px_rgba(0,0,0,0.08)] overflow-visible cursor-pointer flex-shrink-0 transition-all flex flex-col p-[clamp(12px,1.5vw,16px)] box-border relative hover:-translate-y-1 h-full"
            onClick={() => handleCategoryClick(category.name)}
          >
            <div className="flex items-center justify-between py-[clamp(12px,1.5vw,16px)] px-[clamp(10px,1.3vw,14px)] bg-white box-border flex-shrink-0">
              <span className="text-[clamp(14px,1.8vw,18px)] font-bold text-[#856D65] flex-1 leading-[1.3] break-words overflow-hidden text-ellipsis line-clamp-2">
                <TranslatedText>{category.name}</TranslatedText>
              </span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#856D65] flex-shrink-0 w-[clamp(12px,1.5vw,16px)] h-[clamp(12px,1.5vw,16px)] ml-2">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="w-full flex-1 relative overflow-hidden bg-white rounded-b-[clamp(28px,4vw,40px)] min-h-0">
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute top-0 left-0 w-full h-full object-contain scale-[2.1]"
                  onError={(e) => {
                    console.error('Image load error for:', category.image)
                    e.target.style.display = 'none'
                  }}
                />
              ) : (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BannerWithCategories

