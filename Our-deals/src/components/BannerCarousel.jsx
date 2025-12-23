import { useState, useEffect } from 'react'
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

function BannerCarousel({ bannerSet = 1, images = [] }) {
  console.log(`BannerCarousel ${bannerSet} - Received images:`, images)

  // Use API images if provided, otherwise use empty array
  const banners = images.length > 0
    ? images.map((imagePath, index) => {
      const fullUrl = getImageUrl(imagePath)
      console.log(`BannerCarousel ${bannerSet} - Image ${index + 1}:`, { imagePath, fullUrl })
      return {
        id: index + 1,
        image: fullUrl,
        alt: <TranslatedText>Banner {bannerSet} - {index + 1}</TranslatedText>
      }
    })
    : []

  console.log(`BannerCarousel ${bannerSet} - Processed banners:`, banners)

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (banners.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length)
    }, 4000) // Change banner every 4 seconds

    return () => clearInterval(interval)
  }, [banners.length])

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  // Don't render if no banners
  if (banners.length === 0) {
    console.log(`BannerCarousel ${bannerSet} - No banners to render, returning null`)
    return null
  }

  console.log(`BannerCarousel ${bannerSet} - Rendering with ${banners.length} banners`)

  return (
    <div className="mb-12">
      <div className="relative w-full overflow-hidden rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.1)] bg-white aspect-[21/9] max-h-[clamp(200px,25vw,350px)] md:aspect-[24/9] md:max-h-[clamp(150px,20vw,250px)]">
        <div
          className="flex transition-transform duration-500 ease-in-out w-full h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {banners.map((banner) => (
            <div key={banner.id} className="min-w-full w-full h-full overflow-hidden relative flex-shrink-0">
              <img src={banner.image} alt={banner.alt} className="w-full h-full object-cover block" style={{ imageRendering: 'crisp-edges' }} />
            </div>
          ))}
        </div>
        <div className="absolute bottom-4 md:bottom-3 left-1/2 -translate-x-1/2 flex gap-2 md:gap-1.5 z-10 bg-black/50 px-3 py-1.5 md:px-2.5 md:py-1 rounded-full">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`rounded-full border-none cursor-pointer transition-all p-0 ${index === currentIndex ? 'bg-[#13335a] w-5 md:w-[18px] rounded-[10px] md:rounded-[9px]' : 'bg-white/60 w-2 md:w-1.5 hover:bg-white/90 hover:scale-110'} h-2 md:h-1.5`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default BannerCarousel

