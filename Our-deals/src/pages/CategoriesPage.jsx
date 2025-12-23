import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getAllCategories, getSubcategoriesByCategoryId } from '../services/categoryService'
import TranslatedText from '../components/TranslatedText'
import { useTranslation } from '../hooks/useTranslation'
import { useDynamicTranslation } from '../hooks/useDynamicTranslation'
import { isTranslationDisabled } from '../services/translationService'

function CategoriesPage() {
  const navigate = useNavigate()
  const { categoryName } = useParams()
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [categories, setCategories] = useState([])
  const [translatedCategories, setTranslatedCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [translatedSubcategories, setTranslatedSubcategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [subcategoriesLoading, setSubcategoriesLoading] = useState(false)
  const { currentLanguage } = useTranslation()
  const { translateObject } = useDynamicTranslation()
  const shouldTranslate = currentLanguage !== 'en'

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

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('=== CategoriesPage: Calling Category API (GET) ===')
        const response = await getAllCategories()
        console.log('=== CategoriesPage: Category API Response ===')
        console.log('Full Response:', response)
        console.log('Response Status:', response?.status)
        console.log('Response Data:', response?.data)

        let categoriesData = []

        if (response?.data && Array.isArray(response.data)) {
          categoriesData = response.data.map(cat => ({
            id: cat.id || cat.category_id,
            name: cat.name || cat.category_name || cat.title || cat.cat_name || 'Category',
            image: getImageUrl(cat.image || cat.icon || cat.image_url || cat.cat_img || ''),
            isPopular: cat.is_popular || cat.isPopular || false
          }))
          console.log('✅ Categories mapped:', categoriesData.length, 'items')
        } else {
          console.warn('⚠️ No categories data found')
          categoriesData = []
        }

        setCategories(categoriesData)
        console.log('✅ Categories state updated')
      } catch (error) {
        console.error('=== CategoriesPage: Category API Error ===')
        console.error('Error:', error)
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Translate categories list
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
  }, [categories, currentLanguage, shouldTranslate, translateObject])

  // Get all categories for sidebar
  const allCategories = useMemo(() => {
    return categories.map(category => ({
      id: category.id,
      name: category.name,
      image: category.image
    }))
  }, [categories])

  // Set selected category from URL param or default to first category
  useEffect(() => {
    if (categoryName) {
      const decodedName = decodeURIComponent(categoryName)
      setSelectedCategory(decodedName)
    } else if (allCategories.length > 0 && !selectedCategory) {
      // Set first category as default
      setSelectedCategory(allCategories[0].name)
    }
  }, [categoryName, allCategories, selectedCategory])

  // Fetch subcategories when category is selected
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!selectedCategory || categories.length === 0) {
        setSubcategories([])
        return
      }

      // Find the selected category to get its ID
      const selectedCat = categories.find(cat => cat.name === selectedCategory)

      if (!selectedCat || !selectedCat.id) {
        console.log('⚠️ Category ID not found for selected category')
        setSubcategories([])
        return
      }

      setSubcategoriesLoading(true)
      try {
        console.log('=== CategoriesPage: Fetching Subcategories ===')
        console.log('Category ID:', selectedCat.id)
        console.log('Category Name:', selectedCategory)

        const response = await getSubcategoriesByCategoryId(selectedCat.id)
        console.log('=== CategoriesPage: Subcategories API Response ===')
        console.log('Full Response:', response)

        let subcategoriesData = []

        if (response?.data && Array.isArray(response.data)) {
          subcategoriesData = response.data.map(subcat => ({
            id: subcat.id || subcat.subcategory_id,
            name: subcat.name || subcat.subcategory_name || subcat.title || subcat.sub_cat_name || 'Subcategory',
            image: getImageUrl(subcat.image || subcat.icon || subcat.image_url || '')
          }))
          console.log('✅ Subcategories mapped:', subcategoriesData.length, 'items')
        } else {
          console.warn('⚠️ No subcategories data found')
        }

        setSubcategories(subcategoriesData)
      } catch (error) {
        console.error('=== CategoriesPage: Subcategories API Error ===')
        console.error('Error:', error)
        setSubcategories([])
      } finally {
        setSubcategoriesLoading(false)
      }
    }

    fetchSubcategories()
  }, [selectedCategory, categories])

  // Translate subcategories list
  useEffect(() => {
    if (!shouldTranslate || subcategories.length === 0) {
      setTranslatedSubcategories([])
      return
    }

    let isMounted = true
    const timeoutId = setTimeout(async () => {
      if (subcategories.length > 0 && isMounted) {
        try {
          // Preserve original name for navigation
          const itemsToTranslate = subcategories.map(item => ({
            ...item,
            original_name: item.name || item.subcategory_name || item.title
          }))

          const translated = await translateObject(itemsToTranslate, ['name', 'subcategory_name', 'title'])
          if (isMounted) {
            setTranslatedSubcategories(translated || itemsToTranslate)
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
  }, [subcategories, currentLanguage, shouldTranslate, translateObject])

  const subcategoriesToUse = translatedSubcategories.length > 0 ? translatedSubcategories : subcategories

  const handleCategoryClick = (categoryName) => {
    navigate(`/categories/${encodeURIComponent(categoryName)}`)
  }

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <div className="bg-white px-[clamp(16px,2vw,24px)] py-[clamp(16px,2vw,20px)] flex justify-between items-center fixed top-0 left-0 right-0 z-[1000] flex-shrink-0 w-full shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
        <button className="bg-transparent border-none cursor-pointer p-[clamp(3px,0.4vw,4px)] flex items-center justify-center transition-colors rounded-full w-[clamp(28px,3.5vw,32px)] h-[clamp(28px,3.5vw,32px)] hover:bg-black/5" onClick={() => navigate('/')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[clamp(20px,2.5vw,24px)] h-[clamp(20px,2.5vw,24px)]">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h2 className="text-[clamp(18px,2.5vw,24px)] md:text-[clamp(16px,2.2vw,20px)] font-bold text-black m-0 ml-3 flex-1 text-left leading-[1.3]"><TranslatedText>Categories</TranslatedText></h2>
        <div style={{ width: '24px' }}></div>
      </div>

      <div
        className="flex flex-1 overflow-hidden h-[calc(100vh-clamp(60px,10vw,80px))] min-h-0 relative isolate overscroll-none mt-[clamp(60px,10vw,80px)] pt-0 md:flex-row md:h-[calc(100vh-clamp(60px,10vw,80px))]"
        onWheel={(e) => {
          // Only allow scrolling if the event is on the sidebar
          const sidebar = e.currentTarget.querySelector('.categories-sidebar')
          if (!sidebar.contains(e.target)) {
            e.preventDefault()
            e.stopPropagation()
          }
        }}
      >
        {/* Left Sidebar - Categories List */}
        <div
          className="categories-sidebar w-[clamp(120px,20vw,200px)] max-w-[200px] md:w-[clamp(80px,22vw,120px)] md:max-w-[120px] bg-[#FAFAFA] border-r border-gray-200 overflow-y-auto overflow-x-hidden py-[clamp(12px,1.5vw,16px)] px-0 md:py-[clamp(6px,0.8vw,10px)] md:px-[clamp(4px,0.6vw,6px)] pb-[clamp(80px,12vw,100px)] md:pb-[clamp(12px,1.5vw,16px)] flex-shrink-0 h-full relative isolate [-webkit-overflow-scrolling:touch] [overscroll-behavior-y:contain] [overscroll-behavior-x:none] [touch-action:pan-y] [will-change:scroll-position] [contain:layout_style_paint] md:flex md:flex-col md:border-b-0"
          onWheel={(e) => {
            // Only prevent on desktop
            if (window.innerWidth > 768) {
              e.stopPropagation()
            }
          }}
        >
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500"><TranslatedText>Loading categories...</TranslatedText></div>
            </div>
          ) : (
            allCategories.map((category, index) => {
              const categoryName = category.name
              const isSelected = selectedCategory === categoryName

              return (
                <div
                  key={index}
                  className={`flex flex-col items-center justify-center gap-[clamp(4px,0.6vw,6px)] md:gap-[clamp(3px,0.5vw,5px)] py-[clamp(8px,1vw,10px)] px-[clamp(10px,1.2vw,14px)] md:py-[clamp(6px,0.8vw,10px)] md:px-[clamp(4px,0.6vw,6px)] cursor-pointer transition-all border-l-[clamp(3px,0.4vw,4px)] md:border-l-[clamp(2px,0.3vw,3px)] border-transparent bg-transparent hover:bg-gray-100 ${isSelected ? 'bg-white md:bg-white border-l-[clamp(3px,0.4vw,4px)] md:border-l-transparent shadow-[0_2px_8px_rgba(0,0,0,0.1)] rounded-[clamp(8px,1vw,12px)]' : ''}`}
                  onClick={() => handleCategoryClick(categoryName)}
                >
                  <div className={`w-[clamp(48px,6vw,60px)] md:w-[clamp(32px,4.5vw,50px)] h-[clamp(48px,6vw,60px)] md:h-[clamp(32px,4.5vw,50px)] rounded-[clamp(8px,1vw,12px)] ${isSelected ? 'bg-[#13335a]' : 'bg-gray-100'} flex items-center justify-center overflow-hidden flex-shrink-0`}>
                    {category.image ? (
                      <img src={category.image} alt={categoryName} className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#13335a] text-white font-bold text-[clamp(20px,2.5vw,28px)] md:text-[clamp(14px,1.8vw,20px)]">
                        <span>{categoryName.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <span className={`text-[clamp(10px,1.2vw,12px)] md:text-[clamp(8px,1vw,11px)] font-bold leading-[1.2] text-center block w-full overflow-hidden text-ellipsis line-clamp-2 ${isSelected ? 'text-[#13335a]' : 'text-gray-700'}`}>
                    <TranslatedText>{categoryName}</TranslatedText>
                  </span>
                </div>
              )
            })
          )}
        </div>

        {/* Right Content - Subcategories */}
        <div
          className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden md:overflow-y-auto md:overflow-x-hidden p-[clamp(16px,2vw,24px)] md:p-[clamp(6px,0.8vw,10px)] pb-[clamp(80px,12vw,100px)] md:pb-[clamp(16px,2vw,24px)] bg-white h-full relative isolate overscroll-none [-webkit-overflow-scrolling:touch]"
        >
          {selectedCategory && (
            <>
              <h3 className="text-[clamp(16px,2vw,20px)] md:text-[clamp(14px,1.8vw,18px)] font-bold text-[#1a1a1a] m-0 mb-[clamp(12px,1.5vw,16px)] md:mb-[clamp(10px,1.3vw,14px)] pb-[clamp(10px,1.2vw,12px)] md:pb-[clamp(8px,1vw,10px)] border-b-[clamp(1.5px,0.2vw,2px)] border-gray-200 leading-[1.3]"><TranslatedText>{selectedCategory}</TranslatedText></h3>
              {subcategoriesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-gray-500"><TranslatedText>Loading subcategories...</TranslatedText></div>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-[clamp(8px,1vw,12px)] mb-[clamp(20px,3vw,30px)]">
                  {(translatedSubcategories.length > 0 ? translatedSubcategories : subcategories).length > 0 ? (
                    (translatedSubcategories.length > 0 ? translatedSubcategories : subcategories).map((subcat, index) => {
                      const subcatName = subcat.name
                      const subcatImage = subcat.image

                      return (
                        <div
                          key={subcat.id || index}
                          className="flex flex-col items-center cursor-pointer transition-transform hover:-translate-y-1"
                          onClick={() => navigate(`/vendors/${encodeURIComponent(subcat.original_name || subcatName)}`)}
                        >
                          <div className="w-full aspect-square rounded-[clamp(8px,1vw,10px)] overflow-hidden bg-gray-100 mb-[clamp(6px,0.8vw,8px)] flex items-center justify-center relative">
                            {subcatImage ? (
                              <>
                                <img
                                  src={subcatImage}
                                  alt={subcatName}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = 'none'
                                    const fallback = e.target.nextElementSibling
                                    if (fallback) fallback.style.display = 'flex'
                                  }}
                                />
                                <div className="w-full h-full hidden items-center justify-center bg-[#13335a] text-white font-bold text-[clamp(18px,2.2vw,22px)] md:text-[clamp(16px,2vw,20px)] absolute inset-0">
                                  <span>{subcatName.charAt(0)}</span>
                                </div>
                              </>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-[#13335a] text-white font-bold text-[clamp(18px,2.2vw,22px)] md:text-[clamp(16px,2vw,20px)]">
                                <span>{subcatName.charAt(0)}</span>
                              </div>
                            )}
                          </div>
                          <span className="text-[clamp(10px,1.2vw,12px)] md:text-[clamp(11px,1.3vw,13px)] font-bold text-gray-700 text-center leading-[1.3] break-words w-full block group-hover:text-[#13335a]">
                            <TranslatedText>{subcatName}</TranslatedText>
                          </span>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-[clamp(30px,3.5vw,40px)] md:py-[clamp(24px,3vw,36px)] px-[clamp(16px,2vw,20px)] md:px-[clamp(12px,1.5vw,18px)] text-gray-500 text-[clamp(13px,1.6vw,16px)] md:text-[clamp(12px,1.5vw,15px)] leading-[1.5]">
                      <p><TranslatedText>No subcategories available for this category.</TranslatedText></p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default CategoriesPage

