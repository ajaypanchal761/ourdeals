import { useState, useEffect } from 'react'
import { isTranslationDisabled } from '../services/translationService'
import { useNavigate, useParams } from 'react-router-dom'
import BannerCarousel from '../components/BannerCarousel'
import { getSubcategoriesByCategoryId } from '../services/categoryService'
import { getWeddingBanners } from '../services/bannerService'
import TranslatedText from '../components/TranslatedText'
import { useTranslation } from '../hooks/useTranslation'
import { useDynamicTranslation } from '../hooks/useDynamicTranslation'

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

function CategorySubcategoriesPage() {
  const navigate = useNavigate()
  const { categoryName } = useParams()
  const decodedCategoryName = decodeURIComponent(categoryName)
  const { t } = useTranslation()
  const { translateObject } = useDynamicTranslation()
  const { currentLanguage } = useTranslation()
  const shouldTranslate = currentLanguage !== 'en'
  const [subcategories, setSubcategories] = useState([])
  const [translatedSubcategories, setTranslatedSubcategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [weddingBannerImages, setWeddingBannerImages] = useState([])

  // Check if this is "Wedding Requisites" category
  const isWeddingRequisites = decodedCategoryName === 'Wedding Requisites'

  // Fetch subcategories (and banners for Wedding Requisites)
  useEffect(() => {
    if (isWeddingRequisites) {
      const fetchWeddingSubcategories = async () => {
        setLoading(true)
        setError(null)
        try {
          // Category ID 13 for Wedding Requisites
          const response = await getSubcategoriesByCategoryId(13)
          if (response.status === true && response.data && Array.isArray(response.data)) {
            // Transform API data to match display format
            const transformedSubcategories = response.data.map(item => ({
              id: item.id,
              name: item.name || '',
              image: getImageUrl(item.image || '')
            }))
            setSubcategories(transformedSubcategories)
          } else {
            setError('No subcategories found')
            setSubcategories([])
          }

          // Fetch wedding banners for this page
          try {
            const bannerResponse = await getWeddingBanners()
            if (bannerResponse.status === true && Array.isArray(bannerResponse.data) && bannerResponse.data.length > 0) {
              // Each item has an "images" array – flatten all images
              const allImages = bannerResponse.data.flatMap(item => item.images || [])
              setWeddingBannerImages(allImages)
            } else {
              setWeddingBannerImages([])
            }
          } catch (bannerError) {
            console.error('Error fetching wedding banners:', bannerError)
            setWeddingBannerImages([])
          }
        } catch (err) {
          console.error('Error fetching wedding subcategories:', err)
          setError('Failed to load subcategories')
          setSubcategories([])
        } finally {
          setLoading(false)
        }
      }
      fetchWeddingSubcategories()
    } else {
      setError('No subcategories available')
      setSubcategories([])
    }
  }, [decodedCategoryName, isWeddingRequisites])

  // Translate subcategory names when they are loaded or language changes
  useEffect(() => {
    if (!shouldTranslate || subcategories.length === 0) {
      setTranslatedSubcategories([])
      return
    }

    let isMounted = true
    const timeoutId = setTimeout(async () => {
      if (subcategories.length > 0 && isMounted) {
        try {
          const translated = await translateObject(subcategories, ['name'])
          if (isMounted) {
            setTranslatedSubcategories(translated || subcategories)
          }
        } catch (error) {
          if (!isTranslationDisabled()) {
            console.error('Error translating subcategories:', error)
          }
          if (isMounted) {
            setTranslatedSubcategories(subcategories)
          }
        }
      }
    }, 100)

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
    }
  }, [subcategories.length, currentLanguage, shouldTranslate, translateObject])

  const parentCategory = decodedCategoryName

  const handleSubcategoryClick = (subcategoryName) => {
    navigate(`/vendors/${encodeURIComponent(subcategoryName)}`)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header - Fixed on Top */}
      <div className="bg-[#13335a] px-[clamp(16px,2vw,24px)] md:px-[clamp(12px,1.5vw,16px)] py-[clamp(16px,2vw,20px)] flex justify-between items-center fixed top-0 left-0 right-0 z-[1000] shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
        <button className="bg-transparent border-none cursor-pointer p-1 flex items-center justify-center transition-colors rounded-full w-8 h-8 hover:bg-white/20" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h2 className="text-[clamp(18px,2.5vw,24px)] md:text-[clamp(18px,2.2vw,22px)] font-bold text-white m-0 flex-1 text-center"><TranslatedText>{parentCategory || decodedCategoryName}</TranslatedText></h2>
        <div style={{ width: '24px' }}></div>
      </div>

      {/* Content with top padding so it doesn't hide behind fixed header */}
      <div className="flex-1 p-[clamp(16px,2vw,24px)] pt-[clamp(72px,10vw,96px)] md:p-[clamp(12px,1.5vw,16px)] md:pt-[clamp(64px,8vw,80px)] overflow-y-auto pb-[100px] bg-white">
        <div className="mb-[clamp(16px,2vw,24px)]">
          {/* Wedding page ke liye upar banner carousel */}
          <BannerCarousel bannerSet={1} images={isWeddingRequisites ? weddingBannerImages : []} />
        </div>
        {loading ? (
          <div className="text-center py-10 px-5 text-gray-500">
            <p><TranslatedText>Loading subcategories...</TranslatedText></p>
          </div>
        ) : error ? (
          <div className="text-center py-10 px-5 text-red-500">
            <p><TranslatedText>{error}</TranslatedText></p>
          </div>
        ) : (translatedSubcategories.length > 0 ? translatedSubcategories : subcategories).length > 0 ? (
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-[clamp(8px,1vw,12px)] md:gap-[clamp(6px,0.8vw,10px)] mt-[clamp(16px,2vw,24px)] md:mt-[clamp(12px,1.5vw,16px)]">
            {(translatedSubcategories.length > 0 ? translatedSubcategories : subcategories).map((subcat, index) => {
              const subcatName = typeof subcat === 'string' ? subcat : subcat.name
              const subcatImage = typeof subcat === 'object' ? subcat.image : null
              const subcatId = typeof subcat === 'object' && subcat.id ? subcat.id : index

              return (
                <div
                  key={subcatId || index}
                  className="flex flex-col items-center cursor-pointer transition-all bg-transparent rounded-[clamp(10px,1.2vw,12px)] overflow-visible shadow-none hover:-translate-y-1 hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
                  onClick={() => handleSubcategoryClick(subcatName)}
                >
                  <div className="w-full aspect-square rounded-[clamp(10px,1.2vw,12px)] overflow-hidden bg-gray-100 flex items-center justify-center">
                    {subcatImage ? (
                      <img src={subcatImage} alt={subcatName} className="w-full h-full object-cover block" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#13335a] text-white font-bold text-[clamp(16px,2vw,20px)] sm:text-[clamp(18px,2.2vw,24px)] md:text-[clamp(18px,2.3vw,25px)] lg:text-[clamp(20px,2.5vw,28px)]">
                        <span>{subcatName.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-[clamp(10px,1.2vw,12px)] sm:text-[clamp(11px,1.3vw,13px)] md:text-[clamp(11px,1.3vw,13px)] lg:text-[clamp(12px,1.4vw,14px)] xl:text-[clamp(12px,1.5vw,15px)] font-bold text-gray-800 text-center leading-[1.4] pt-[clamp(6px,0.8vw,10px)] sm:pt-[clamp(7px,0.9vw,11px)] md:pt-[clamp(6px,0.8vw,8px)] lg:pt-[clamp(8px,1vw,12px)] w-full box-border mt-[clamp(4px,0.6vw,8px)] sm:mt-[clamp(5px,0.7vw,9px)] md:mt-[clamp(4px,0.6vw,6px)] lg:mt-[clamp(6px,0.8vw,10px)] group-hover:text-[#13335a]"><TranslatedText>{subcatName}</TranslatedText></span>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-10 px-5 text-gray-500">
            <p><TranslatedText>No subcategories available.</TranslatedText></p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CategorySubcategoriesPage

