import { useState, useEffect, useRef } from 'react'
import SearchSection from '../components/SearchSection'
import BannerWithCategories from '../components/BannerWithCategories'
import CategoryGrid from '../components/CategoryGrid'
import PopularCategoriesSection from '../components/PopularCategoriesSection'
import BannerCarousel from '../components/BannerCarousel'
import RemainingCategorySectionsList from '../components/RemainingCategorySectionsList'
import WhyChooseUs from '../components/WhyChooseUs'
import Statistics from '../components/Statistics'
import TrustBadges from '../components/TrustBadges'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'
import { getAllCategories, getPopularCategories, getHomeServices, getHealthFitness, getBeautyCare, getProfessionalServices, getTrendingCategories, getRentalServices, getSomeCategories, getAllSubcategories, getWeddingCategories } from '../services/categoryService'
import { getAllBanners } from '../services/bannerService'
import { useDynamicTranslation } from '../hooks/useDynamicTranslation'
import { useTranslation } from '../hooks/useTranslation'
import { isTranslationDisabled } from '../services/translationService'
import TranslatedText from '../components/TranslatedText'
// Temporary import for testing - remove after API is enabled
import HomePageTranslationTest from '../components/HomePageTranslationTest'

function HomePage() {
  const { translateObject } = useDynamicTranslation()
  const { currentLanguage } = useTranslation()

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [popularCategories, setPopularCategories] = useState([])
  const [homeServices, setHomeServices] = useState([])
  const [healthFitness, setHealthFitness] = useState([])
  const [beautyCare, setBeautyCare] = useState([])
  const [professionalServices, setProfessionalServices] = useState([])
  const [trendingCategories, setTrendingCategories] = useState([])
  const [rentalServices, setRentalServices] = useState([])
  const [someCategories, setSomeCategories] = useState([])
  const [bannerDemo, setBannerDemo] = useState([])
  const [homepageBanner1, setHomepageBanner1] = useState([])
  const [homepageBanner2, setHomepageBanner2] = useState([])
  const [weddingBanners, setWeddingBanners] = useState([])

  // Translated category data states
  const [translatedCategories, setTranslatedCategories] = useState([])
  const [translatedPopularCategories, setTranslatedPopularCategories] = useState([])
  const [translatedHomeServices, setTranslatedHomeServices] = useState([])
  const [translatedHealthFitness, setTranslatedHealthFitness] = useState([])
  const [translatedBeautyCare, setTranslatedBeautyCare] = useState([])
  const [translatedProfessionalServices, setTranslatedProfessionalServices] = useState([])
  const [translatedTrendingCategories, setTranslatedTrendingCategories] = useState([])
  const [translatedRentalServices, setTranslatedRentalServices] = useState([])
  const [translatedSomeCategories, setTranslatedSomeCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories()

        let categoriesData = []

        if (response?.data && Array.isArray(response.data)) {
          categoriesData = response.data
        } else if (Array.isArray(response)) {
          categoriesData = response
        }

        setCategories(categoriesData)
      } catch (error) {
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()

    const fetchPopularCategories = async () => {
      try {
        const response = await getPopularCategories()

        if (response?.data && Array.isArray(response.data)) {
          setPopularCategories(response.data)
        } else {
          setPopularCategories([])
        }
      } catch (error) {
        setPopularCategories([])
      }
    }

    fetchPopularCategories()

    const fetchHomeServices = async () => {
      try {
        const response = await getHomeServices()

        if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
          setHomeServices(response.data)
        } else {
          console.log('HomePage - No homeServices data or empty array')
          setHomeServices([])
        }
      } catch (error) {
        console.error('HomePage - Error fetching homeServices:', error)
        setHomeServices([])
      }
    }

    fetchHomeServices()

    const fetchHealthFitness = async () => {
      try {
        const response = await getHealthFitness()

        if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
          setHealthFitness(response.data)
        } else {
          console.log('HomePage - No healthFitness data or empty array')
          setHealthFitness([])
        }
      } catch (error) {
        console.error('HomePage - Error fetching healthFitness:', error)
        setHealthFitness([])
      }
    }

    fetchHealthFitness()

    const fetchBeautyCare = async () => {
      try {
        const response = await getBeautyCare()

        if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
          setBeautyCare(response.data)
        } else {
          console.log('HomePage - No beautyCare data or empty array')
          setBeautyCare([])
        }
      } catch (error) {
        console.error('HomePage - Error fetching beautyCare:', error)
        setBeautyCare([])
      }
    }

    fetchBeautyCare()

    const fetchProfessionalServices = async () => {
      try {
        const response = await getProfessionalServices()

        if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
          setProfessionalServices(response.data)
        } else {
          console.log('HomePage - No professionalServices data or empty array')
          setProfessionalServices([])
        }
      } catch (error) {
        console.error('HomePage - Error fetching professionalServices:', error)
        setProfessionalServices([])
      }
    }

    const fetchTrendingCategories = async () => {
      try {
        const response = await getTrendingCategories()
        if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
          setTrendingCategories(response.data)
        } else {
          setTrendingCategories([])
        }
      } catch (error) {
        setTrendingCategories([])
      }
    }

    fetchProfessionalServices()
    fetchTrendingCategories()

    const fetchRentalServices = async () => {
      try {
        const response = await getRentalServices()
        if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
          setRentalServices(response.data)
        } else {
          setRentalServices([])
        }
      } catch (error) {
        setRentalServices([])
      }
    }

    const fetchSomeCategories = async () => {
      try {
        const response = await getSomeCategories()
        if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
          setSomeCategories(response.data)
        } else {
          setSomeCategories([])
        }
      } catch (error) {
        setSomeCategories([])
      }
    }

    fetchRentalServices()
    fetchSomeCategories()

    // Fetch all banners from single API
    const fetchAllBanners = async () => {
      try {
        const response = await getAllBanners()

        if (response?.status === true && response?.data && Array.isArray(response.data) && response.data.length > 0) {
          // Find "Banner Demo" (id: 1) for BannerWithCategories - First position
          const bannerDemoData = response.data.find(b => b.id === 1 || b.title === 'Banner Demo')
          if (bannerDemoData && bannerDemoData.images && Array.isArray(bannerDemoData.images)) {
            setBannerDemo(bannerDemoData.images)
          }

          // Find "Homepage Banner 1" (id: 5) - Second position
          const banner1 = response.data.find(b => b.id === 5 || b.title === 'Homepage Banner 1')
          if (banner1 && banner1.images && Array.isArray(banner1.images)) {
            setHomepageBanner1(banner1.images)
          }

          // Find "Homepage Banner 2" (id: 6) - Third position
          const banner2 = response.data.find(b => b.id === 6 || b.title === 'Homepage Banner 2')
          if (banner2 && banner2.images && Array.isArray(banner2.images)) {
            setHomepageBanner2(banner2.images)
          }

          // Find "Shadi Banners" (id: 4) - Wedding banners
          const weddingBannerData = response.data.find(b => b.id === 4 || b.title === 'Shadi Banners')
          if (weddingBannerData && weddingBannerData.images && Array.isArray(weddingBannerData.images)) {
            setWeddingBanners(weddingBannerData.images)
          }
        }
      } catch (error) {
        // Silent fail for banners to avoid noise
      }
    }

    fetchAllBanners()

  }, [])

  // Consolidate translation logic
  const shouldTranslate = currentLanguage !== 'en'

  useEffect(() => {
    if (!shouldTranslate) {
      setTranslatedCategories([])
      setTranslatedPopularCategories([])
      setTranslatedHomeServices([])
      setTranslatedHealthFitness([])
      setTranslatedBeautyCare([])
      setTranslatedProfessionalServices([])
      setTranslatedTrendingCategories([])
      setTranslatedRentalServices([])
      setTranslatedSomeCategories([])
      return
    }

    const translateAll = async () => {
      const dataToTranslate = [
        { data: categories, setter: setTranslatedCategories },
        { data: popularCategories, setter: setTranslatedPopularCategories },
        { data: homeServices, setter: setTranslatedHomeServices },
        { data: healthFitness, setter: setTranslatedHealthFitness },
        { data: beautyCare, setter: setTranslatedBeautyCare },
        { data: professionalServices, setter: setTranslatedProfessionalServices },
        { data: trendingCategories, setter: setTranslatedTrendingCategories },
        { data: rentalServices, setter: setTranslatedRentalServices },
        { data: someCategories, setter: setTranslatedSomeCategories }
      ]

      for (const item of dataToTranslate) {
        if (item.data.length > 0) {
          try {
            const translated = await translateObject(item.data, ['name'])
            item.setter(translated || item.data)
          } catch (error) {
            if (!isTranslationDisabled()) {
              console.error('Translation error:', error)
            }
            item.setter(item.data)
          }
        }
      }
    }

    const timeoutId = setTimeout(translateAll, 150)
    return () => clearTimeout(timeoutId)
  }, [
    currentLanguage,
    shouldTranslate,
    translateObject,
    categories.length,
    popularCategories.length,
    homeServices.length,
    healthFitness.length,
    beautyCare.length,
    professionalServices.length,
    trendingCategories.length,
    rentalServices.length,
    someCategories.length
  ])

  return (
    <main className="bg-white pt-[clamp(50px,6vw,60px)] md:pt-[clamp(50px,6vw,70px)]">
      <div className="max-w-[1400px] mx-auto pt-[clamp(16px,3vw,32px)] pb-0 px-0 bg-white md:px-0 md:pt-[clamp(16px,2vw,24px)]">
        <SearchSection />
        <BannerWithCategories popularCategories={translatedPopularCategories.length > 0 ? translatedPopularCategories : popularCategories} bannerImages={bannerDemo} />
        <CategoryGrid categories={translatedCategories.length > 0 ? translatedCategories : categories} loading={loading} />
        <PopularCategoriesSection popularCategories={translatedPopularCategories.length > 0 ? translatedPopularCategories : popularCategories} />

        <RemainingCategorySectionsList
          categoryName="Home Services"
          subcategories={translatedHomeServices.length > 0 ? translatedHomeServices : homeServices}
        />
        <RemainingCategorySectionsList
          categoryName="Health & Fitness"
          subcategories={translatedHealthFitness.length > 0 ? translatedHealthFitness : healthFitness}
        />

        <BannerCarousel bannerSet={1} images={homepageBanner1} />

        <RemainingCategorySectionsList
          categoryName="Beauty Care"
          subcategories={translatedBeautyCare.length > 0 ? translatedBeautyCare : beautyCare}
        />
        <RemainingCategorySectionsList
          categoryName="Professional Services"
          subcategories={translatedProfessionalServices.length > 0 ? translatedProfessionalServices : professionalServices}
        />
        <RemainingCategorySectionsList
          categoryName="Trending"
          subcategories={translatedTrendingCategories.length > 0 ? translatedTrendingCategories : trendingCategories}
        />

        <BannerCarousel bannerSet={2} images={homepageBanner2} />

        <RemainingCategorySectionsList
          categoryName="Rental Services"
          subcategories={translatedRentalServices.length > 0 ? translatedRentalServices : rentalServices}
        />
        <RemainingCategorySectionsList
          categoryName="Some Categories"
          subcategories={translatedSomeCategories.length > 0 ? translatedSomeCategories : someCategories}
        />

        <WhyChooseUs />
        <Statistics />
        <TrustBadges />
        <FAQ />
      </div>
      <Footer />
    </main>
  )
}

export default HomePage
