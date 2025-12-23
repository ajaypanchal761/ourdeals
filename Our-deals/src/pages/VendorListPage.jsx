import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchVendors } from '../services/vendorService'
import { getAllSubcategoriesAlt } from '../services/categoryService'
import { loadUserLocation, getBrowserLocation } from '../services/locationService'
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
  // Clean any leading slashes or escaped backslashes
  const cleanPath = imagePath.replace(/^[\\/]+/, '')
  return `${IMAGE_BASE_URL}${cleanPath}`
}

function VendorListPage() {
  const navigate = useNavigate()
  const { subcategoryName } = useParams()
  const [selectedFilter, setSelectedFilter] = useState('Near by')
  const [vendors, setVendors] = useState([])
  const [translatedVendors, setTranslatedVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const { currentLanguage } = useTranslation()
  const { translateObject } = useDynamicTranslation()
  const shouldTranslate = currentLanguage !== 'en'
  const [locationTimestamp, setLocationTimestamp] = useState(Date.now())

  // Listen for location changes
  useEffect(() => {
    const handleLocationChange = () => {
      console.log('VendorListPage - Location changed, triggering refetch')
      setLocationTimestamp(Date.now())
    }
    window.addEventListener('userLocationChanged', handleLocationChange)
    return () => window.removeEventListener('userLocationChanged', handleLocationChange)
  }, [])

  // Get user location (prefer saved from header/search, fallback to browser / default)
  const getUserLocation = async () => {
    // 1) Use stored location if available
    const stored = loadUserLocation()
    if (stored?.lat && stored?.lng) {
      console.log('VendorListPage - Using stored user location:', stored)
      return { lat: stored.lat, lng: stored.lng }
    }

    // 2) Fallback to browser geolocation
    try {
      const coords = await getBrowserLocation()
      console.log('VendorListPage - Browser geolocation:', coords)
      return coords
    } catch (error) {
      console.log('VendorListPage - Geolocation error, using Indore default:', error)
      // 3) Default to Indore center coordinates
      return { lat: 22.7196, lng: 75.8577 }
    }
  }

  // Fetch vendors from API
  useEffect(() => {
    const fetchVendorsData = async () => {
      console.log('=== VendorListPage - useEffect triggered ===')
      console.log('subcategoryName:', subcategoryName)
      console.log('selectedFilter:', selectedFilter)

      if (!subcategoryName) {
        console.log('VendorListPage - No subcategoryName in params')
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        console.log('VendorListPage - subcategoryName from URL:', subcategoryName)

        // Decode subcategory name from URL
        const decodedSubcategoryName = decodeURIComponent(subcategoryName)
        console.log('VendorListPage - Decoded subcategoryName:', decodedSubcategoryName)

        // First, get all subcategories to find subcat_id
        console.log('VendorListPage - Calling getAllSubcategoriesAlt...')
        const subcategoriesResponse = await getAllSubcategoriesAlt()
        console.log('VendorListPage - All subcategories response:', subcategoriesResponse)
        console.log('VendorListPage - Response status:', subcategoriesResponse?.status)
        console.log('VendorListPage - Response data type:', typeof subcategoriesResponse?.data)
        console.log('VendorListPage - Response data is array:', Array.isArray(subcategoriesResponse?.data))
        console.log('VendorListPage - Response data length:', subcategoriesResponse?.data?.length || 0)

        let subcatId = null
        if (subcategoriesResponse?.data && Array.isArray(subcategoriesResponse.data)) {
          console.log('VendorListPage - Searching for subcategory in', subcategoriesResponse.data.length, 'items')

          // Find subcategory by name (case-insensitive)
          const subcategory = subcategoriesResponse.data.find(
            subcat => {
              const subcatName = subcat.name || subcat.subcategory_name || subcat.title || ''
              const match = subcatName.toLowerCase() === decodedSubcategoryName.toLowerCase()
              if (match) {
                console.log('VendorListPage - Match found!', { subcatName, decodedSubcategoryName })
              }
              return match
            }
          )

          if (subcategory) {
            subcatId = subcategory.id || subcategory.subcat_id || subcategory.subcategory_id
            console.log('VendorListPage - Found subcategory:', subcategory)
            console.log('VendorListPage - subcat_id:', subcatId)
          } else {
            console.log('VendorListPage - Subcategory not found. Searching for:', decodedSubcategoryName)
            console.log('VendorListPage - First 10 available subcategories:',
              subcategoriesResponse.data.slice(0, 10).map(s => ({
                id: s.id || s.subcat_id || s.subcategory_id,
                name: s.name || s.subcategory_name || s.title
              }))
            )
          }
        } else {
          console.log('VendorListPage - Invalid subcategories response structure')
        }

        if (!subcatId) {
          console.log('VendorListPage - Could not find subcat_id for:', decodedSubcategoryName)
          setVendors([])
          setLoading(false)
          return
        }

        // Get user location (covers all of Indore)
        console.log('VendorListPage - Getting user location...')
        const location = await getUserLocation()
        const userLat = location.lat
        const userLng = location.lng
        console.log('VendorListPage - User location:', { lat: userLat, lng: userLng })

        // Map filter label to API filter value ensuring exact match with backend requirements
        const FILTER_MAP = {
          'Near by': 'nearby',
          'Available': 'available',
          'Top-rated': 'top-rated'
        }

        // Default to 'nearby' to match initial state
        const apiFilter = FILTER_MAP[selectedFilter] || 'nearby'

        // Explicitly logging to confirm only ONE filter value is sent
        console.log(`VendorListPage - Sending request with SINGLE filter value: "${apiFilter}"`)

        console.log('VendorListPage - Calling fetchVendors with:', {
          lat: userLat,
          lng: userLng,
          subcat_id: subcatId,
          filter: apiFilter
        })

        const vendorsResponse = await fetchVendors(userLat, userLng, subcatId, apiFilter)
        console.log('VendorListPage - fetchVendors response:', vendorsResponse)

        if (vendorsResponse?.data && Array.isArray(vendorsResponse.data)) {
          console.log('VendorListPage - Setting vendors:', vendorsResponse.data.length, 'vendors')
          setVendors([...vendorsResponse.data])
        } else {
          console.log('VendorListPage - No vendors data or empty array')
          setVendors([])
        }
      } catch (error) {
        console.error('VendorListPage - Error fetching vendors:', error)
        setVendors([])
      } finally {
        setLoading(false)
        console.log('VendorListPage - Loading set to false')
      }
    }

    fetchVendorsData()
  }, [subcategoryName, selectedFilter, locationTimestamp])

  // Translate vendors list
  useEffect(() => {
    if (!shouldTranslate || vendors.length === 0) {
      setTranslatedVendors([])
      return
    }

    let isMounted = true
    const timeoutId = setTimeout(async () => {
      if (vendors.length > 0 && isMounted) {
        try {
          // Translate vendor names, addresses, and service names
          // Note: service_names is an array, translateObject handles nested arrays if configured or we flatten
          // For now, let's translate top level fields. specific nested array translation might need more logic
          // but translateObject is usually flat.
          // We can at least translate brand_name, name, address, service_name
          const translated = await translateObject(vendors, ['brand_name', 'name', 'address', 'service_name', 'service_names'])
          if (isMounted) {
            setTranslatedVendors(translated || vendors)
          }
        } catch (error) {
          console.error('Error translating vendors:', error)
          if (isMounted) {
            setTranslatedVendors(vendors)
          }
        }
      }
    }, 100)

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
    }
  }, [vendors, currentLanguage, shouldTranslate, translateObject])

  const filters = [
    { id: 'nearby', label: 'Near by', icon: 'location' },
    { id: 'available', label: 'Available', icon: 'lightning' },
    { id: 'toprated', label: 'Top-rated', icon: 'star' }
  ]

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`
  }

  const handleChat = (whatsapp) => {
    window.open(`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`, '_blank')
  }

  const handleDirection = (address) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header - Fixed on Top */}
      <div className="bg-[#13335a] p-[clamp(16px,2vw,20px)_clamp(16px,2vw,24px)] flex justify-between items-center fixed top-0 left-0 right-0 z-[1000] shadow-[0_2px_8px_rgba(0,0,0,0.15)] md:p-[clamp(12px,2vw,16px)]">
        <button className="bg-transparent border-none cursor-pointer p-1 flex items-center justify-center transition-colors rounded-full w-[clamp(28px,4vw,32px)] h-[clamp(28px,4vw,32px)] hover:bg-white/20" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[clamp(20px,3vw,24px)] h-[clamp(20px,3vw,24px)]">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h2 className="text-[clamp(18px,3vw,24px)] font-bold text-white m-0 flex-1 text-center"><TranslatedText>Vendor List</TranslatedText></h2>
        <div className="w-6"></div>
      </div>

      {/* Content with top padding so it doesn't hide behind fixed header */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-[clamp(12px,2vw,16px)] pt-[clamp(72px,10vw,96px)] [-webkit-overflow-scrolling:touch] min-h-0 pb-20 bg-white md:p-[clamp(10px,1.5vw,12px)] md:pt-[clamp(64px,8vw,80px)] md:pb-20 md:bg-gray-50">
        {/* Filter Buttons */}
        <div className="flex gap-[clamp(6px,1vw,8px)] mb-[clamp(12px,2vw,16px)] mt-[clamp(12px,2vw,16px)] md:mt-[clamp(16px,2.5vw,24px)] overflow-x-auto pb-[clamp(6px,1vw,8px)] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden md:gap-[clamp(4px,0.75vw,6px)] md:mb-[clamp(10px,1.5vw,12px)]">
          {filters.map((filter) => (
            <button
              key={filter.id}
              className={`flex items-center gap-[clamp(4px,0.75vw,6px)] p-[clamp(8px,1.25vw,10px)_clamp(12px,2vw,16px)] border rounded-lg text-[clamp(13px,2vw,16px)] font-bold cursor-pointer transition-all whitespace-nowrap flex-shrink-0 md:p-[clamp(6px,1vw,8px)_clamp(10px,1.5vw,12px)] md:text-[clamp(12px,1.8vw,15px)] ${selectedFilter === filter.label
                ? 'bg-[#13335a] text-white border-[#13335a]'
                : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
              onClick={() => setSelectedFilter(filter.label)}
            >
              {filter.icon === 'location' && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[clamp(14px,2vw,16px)] h-[clamp(14px,2vw,16px)] flex-shrink-0">
                  <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor" />
                </svg>
              )}
              {filter.icon === 'lightning' && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[clamp(14px,2vw,16px)] h-[clamp(14px,2vw,16px)] flex-shrink-0">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {filter.icon === 'star' && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-[clamp(14px,2vw,16px)] h-[clamp(14px,2vw,16px)] flex-shrink-0">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              )}
              <span><TranslatedText>{filter.label}</TranslatedText></span>
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="text-[clamp(13px,2vw,16px)] font-bold text-black mb-[clamp(12px,2vw,16px)] md:text-[clamp(12px,1.75vw,14px)] md:mb-[clamp(10px,1.5vw,12px)]">
          {loading ? <TranslatedText>Loading...</TranslatedText> : <span><TranslatedText>{vendors.length.toString()}</TranslatedText> <TranslatedText>Results for your search</TranslatedText></span>}
        </div>

        {/* Vendor Cards */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500"><TranslatedText>Loading vendors...</TranslatedText></div>
          </div>
        ) : vendors.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500"><TranslatedText>No vendors found for this subcategory.</TranslatedText></div>
          </div>
        ) : (
          <div className="flex flex-col gap-[clamp(16px,2.5vw,20px)]">
            {(translatedVendors.length > 0 ? translatedVendors : vendors).map((vendor) => {
              // Map API response to component format based on backend fields
              const vendorName = vendor.brand_name || vendor.name || 'Vendor'
              const vendorAddress = vendor.address || 'Address not available'
              // Primary service name (single) + full services list (multiple)
              const servicesArray =
                Array.isArray(vendor.service_names) && vendor.service_names.length > 0
                  ? vendor.service_names
                  : vendor.service_name
                    ? [vendor.service_name]
                    : []
              const primaryServiceName =
                vendor.service_name || (servicesArray.length > 0 ? servicesArray[0] : 'Service')
              const servicesListText =
                servicesArray.length > 0 ? servicesArray.join(', ') : primaryServiceName
              const distanceKm =
                typeof vendor.distance === 'number'
                  ? `${vendor.distance.toFixed(1)} km`
                  : vendor.distance
                    ? `${Number(vendor.distance).toFixed(1)} km`
                    : null
              const avgRating =
                vendor.avg_rating !== undefined && vendor.avg_rating !== null
                  ? Number(vendor.avg_rating).toFixed(1)
                  : null
              const totalReviews =
                vendor.total_reviews !== undefined && vendor.total_reviews !== null
                  ? Number(vendor.total_reviews)
                  : null
              const vendorPhone = vendor.phone || vendor.contact || ''
              const vendorWhatsapp = vendor.whatsapp || vendor.phone || vendor.contact || ''
              const vendorSince = vendor.established_year || vendor.since || ''

              // Parse work_img JSON string to get first image
              let firstWorkImage = null
              if (vendor.work_img) {
                try {
                  const parsed = typeof vendor.work_img === 'string'
                    ? JSON.parse(vendor.work_img)
                    : vendor.work_img
                  if (Array.isArray(parsed) && parsed.length > 0) {
                    firstWorkImage = getImageUrl(parsed[0])
                  }
                } catch {
                  // ignore parse errors, fallback to placeholder
                }
              }

              return (
                <div
                  key={vendor.id}
                  className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] overflow-hidden transition-all cursor-pointer hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)]"
                  onClick={() => navigate(`/vendor/${vendor.id}`, {
                    state: {
                      avg_rating: vendor.avg_rating,
                      total_reviews: vendor.total_reviews,
                      service_names: vendor.service_names || (vendor.service_name ? [vendor.service_name] : []),
                      service_name: vendor.service_name
                    }
                  })}
                >
                  {/* Details and Image Section */}
                  <div className="flex gap-[clamp(16px,2.5vw,20px)] p-[clamp(16px,2.5vw,20px)]">
                    {/* Left Side - Image / Work image */}
                    <div className="flex-shrink-0 w-[clamp(80px,15vw,120px)] flex flex-col gap-[clamp(8px,1.2vw,10px)]">
                      {firstWorkImage ? (
                        <div className="w-full aspect-[2/3] bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={firstWorkImage}
                            alt={vendorName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-full aspect-[2/3] bg-gray-100 rounded-lg flex flex-col items-center justify-center gap-[clamp(8px,1.2vw,10px)]">
                          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[clamp(40px,6vw,56px)] h-[clamp(40px,6vw,56px)] text-gray-400">
                            <path d="M3 18L7 14L10 17L14 12L17 15L21 11V20H3V18Z" fill="currentColor" fillOpacity="0.2" />
                            <path d="M3 18L7 14L10 17L14 12L17 15L21 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="18" cy="6" r="2.5" fill="currentColor" fillOpacity="0.4" />
                            <path d="M18 3.5C18.2761 3.5 18.5 3.72386 18.5 4C18.5 4.27614 18.2761 4.5 18 4.5C17.7239 4.5 17.5 4.27614 17.5 4C17.5 3.72386 17.7239 3.5 18 3.5Z" fill="currentColor" />
                          </svg>
                          <span className="text-[clamp(10px,1.4vw,12px)] font-semibold text-gray-500 uppercase tracking-wide"><TranslatedText>Image</TranslatedText></span>
                        </div>
                      )}
                      {/* Since Text Below Gray Box */}
                      {vendorSince && (
                        <div className="text-[clamp(11px,1.6vw,13px)] text-gray-400 text-center"><TranslatedText>Since</TranslatedText> <TranslatedText>{vendorSince}</TranslatedText></div>
                      )}
                    </div>

                    {/* Right Side - Vendor Details */}
                    <div className="flex-1 flex flex-col gap-[clamp(8px,1.2vw,10px)] min-w-0">
                      <h3 className="text-[clamp(18px,2.8vw,22px)] font-bold text-[#13335a] m-0 leading-tight">
                        <TranslatedText>{vendorName}</TranslatedText>
                      </h3>

                      {/* Distance + Rating row */}
                      <div className="flex items-center gap-[clamp(8px,1.2vw,10px)] text-[clamp(12px,1.8vw,14px)] text-gray-700 font-semibold flex-wrap">
                        {distanceKm && (
                          <span><TranslatedText>{distanceKm}</TranslatedText> <TranslatedText>away</TranslatedText></span>
                        )}
                        {avgRating && (
                          <span className="flex items-center gap-1">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              xmlns="http://www.w3.org/2000/svg"
                              className="text-yellow-500"
                            >
                              <path d="M12 2L14.8333 8.50871L22 9.2918L16.5 13.7413L18.1667 20.9082L12 17.25L5.83329 20.9082L7.49996 13.7413L1.99996 9.2918L9.16663 8.50871L12 2Z" />
                            </svg>
                            <span><TranslatedText>{avgRating}</TranslatedText></span>
                            {totalReviews !== null && (
                              <span className="text-gray-500 text-[clamp(11px,1.6vw,13px)]">
                                (<TranslatedText>{totalReviews.toString()}</TranslatedText> <TranslatedText>reviews</TranslatedText>)
                              </span>
                            )}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-[clamp(4px,0.75vw,6px)] text-[clamp(13px,2vw,15px)] text-black font-bold">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[clamp(13px,2vw,15px)] h-[clamp(13px,2vw,15px)] flex-shrink-0">
                          <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#E10129" />
                        </svg>
                        <span>
                          <TranslatedText>{vendorAddress}</TranslatedText>
                        </span>
                      </div>

                      <div className="inline-block px-[clamp(10px,1.5vw,12px)] py-[clamp(5px,0.7vw,7px)] bg-gray-100 rounded-lg text-[clamp(11px,1.6vw,13px)] font-semibold text-gray-700 w-fit">
                        <TranslatedText>{primaryServiceName}</TranslatedText>
                      </div>

                      <div className="flex items-center gap-[clamp(4px,0.75vw,6px)] text-[clamp(13px,2vw,15px)] text-blue-500 font-semibold">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[clamp(13px,2vw,15px)] h-[clamp(13px,2vw,15px)] flex-shrink-0">
                          <path d="M20 6L9 17L4 12" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>
                          <TranslatedText>{servicesListText}</TranslatedText>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons - Separate Section Below */}
                  <div className="px-[clamp(16px,2.5vw,20px)] pb-[clamp(16px,2.5vw,20px)] pt-0" onClick={(e) => e.stopPropagation()}>
                    <div className="flex flex-row gap-[clamp(6px,1vw,8px)] w-full">
                      <button className="flex-1 flex items-center justify-center gap-[clamp(4px,0.75vw,6px)] py-[clamp(10px,1.5vw,12px)] px-[clamp(8px,1.2vw,12px)] rounded-lg text-[clamp(11px,1.6vw,13px)] font-bold cursor-pointer transition-all bg-[#13335a] text-white hover:bg-[#1e4a7a] min-w-0" onClick={() => handleCall(vendorPhone)}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[clamp(14px,2vw,16px)] h-[clamp(14px,2vw,16px)] flex-shrink-0">
                          <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7292C21.7209 20.9842 21.5573 21.2126 21.3518 21.3992C21.1463 21.5858 20.9033 21.7262 20.6381 21.811C20.3729 21.8958 20.0922 21.9231 19.815 21.891C16.7428 21.5856 13.786 20.5341 11.19 18.82C8.77382 17.3148 6.72533 15.2663 5.22 12.85C3.49997 10.2412 2.44824 7.27099 2.15 4.18C2.11793 3.90322 2.14518 3.62281 2.22981 3.35788C2.31444 3.09295 2.45452 2.85002 2.64082 2.64458C2.82712 2.43914 3.05531 2.27554 3.31007 2.16389C3.56483 2.05224 3.84034 1.99508 4.119 2H7.119C7.59357 1.99522 8.05808 2.16708 8.43322 2.49055C8.80836 2.81402 9.07173 3.27236 9.179 3.78L9.88 6.75C9.98603 7.24195 9.93842 7.75767 9.74447 8.22293C9.55052 8.68819 9.21969 9.08114 8.8 9.35L7.33 10.28C8.47697 12.3301 10.1699 14.023 12.22 15.17L13.15 13.71C13.4201 13.2908 13.8132 12.9602 14.2784 12.7663C14.7436 12.5724 15.2591 12.5247 15.75 12.63L18.71 13.33C19.2176 13.4373 19.676 13.7007 19.9995 14.0758C20.323 14.4509 20.4948 14.9154 20.49 15.39L22 19.39Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="whitespace-nowrap"><TranslatedText>Call</TranslatedText></span>
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-[clamp(4px,0.75vw,6px)] py-[clamp(10px,1.5vw,12px)] px-[clamp(8px,1.2vw,12px)] rounded-lg text-[clamp(11px,1.6vw,13px)] font-bold cursor-pointer transition-all border border-gray-200 bg-white text-green-500 hover:bg-green-50 min-w-0" onClick={() => handleChat(vendorWhatsapp)}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[clamp(14px,2vw,16px)] h-[clamp(14px,2vw,16px)] flex-shrink-0">
                          <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="whitespace-nowrap"><TranslatedText>Chat</TranslatedText></span>
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-[clamp(4px,0.75vw,6px)] py-[clamp(10px,1.5vw,12px)] px-[clamp(8px,1.2vw,12px)] rounded-lg text-[clamp(11px,1.6vw,13px)] font-bold cursor-pointer transition-all border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 min-w-0" onClick={() => handleDirection(vendorAddress)}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[clamp(14px,2vw,16px)] h-[clamp(14px,2vw,16px)] flex-shrink-0">
                          <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="whitespace-nowrap"><TranslatedText>Direction</TranslatedText></span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div >
  )
}

export default VendorListPage

