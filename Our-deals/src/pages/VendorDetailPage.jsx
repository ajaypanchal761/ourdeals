import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { FaPhone, FaWhatsapp, FaDirections, FaShare } from 'react-icons/fa'
import { getVendorDetails, fetchWorkImages, deleteWorkImage, submitReview, getVendorReviews } from '../services/vendorService'
import { createEnquiry } from '../services/enquiryService'
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

function VendorDetailPage() {
  const navigate = useNavigate()
  const { vendorId } = useParams()
  const location = useLocation()
  const { t, currentLanguage } = useTranslation()
  const { translateObject } = useDynamicTranslation()
  const [activeTab, setActiveTab] = useState('Overview')
  const [selectedRating, setSelectedRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [vendorData, setVendorData] = useState(null)
  const [translatedVendorData, setTranslatedVendorData] = useState(null)
  const [workImages, setWorkImages] = useState([])
  const [loadingWorkImages, setLoadingWorkImages] = useState(false)
  const [deletingImage, setDeletingImage] = useState(null)
  const [reviewText, setReviewText] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewSuccess, setReviewSuccess] = useState('')
  const [reviewError, setReviewError] = useState('')
  const [hasAuth, setHasAuth] = useState(false)
  const reviewDisabled = !hasAuth

  // Auto-hide review success banner after a short delay
  useEffect(() => {
    if (!reviewSuccess) return
    const timer = setTimeout(() => setReviewSuccess(''), 2000)
    return () => clearTimeout(timer)
  }, [reviewSuccess])
  const [reviews, setReviews] = useState([])
  const [loadingReviews, setLoadingReviews] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false)
  const [enquiryDate, setEnquiryDate] = useState('')
  const [enquirySubmitting, setEnquirySubmitting] = useState(false)
  const [enquiryError, setEnquiryError] = useState('')
  const [enquirySuccess, setEnquirySuccess] = useState('')
  const [currentUserId, setCurrentUserId] = useState(null)
  const [currentUserName, setCurrentUserName] = useState('')

  // Fetch vendor details and work images
  useEffect(() => {
    // Read user id from localStorage (if logged in)
    try {
      const storedUser = JSON.parse(localStorage.getItem('userData') || '{}')
      if (storedUser?.id) {
        setCurrentUserId(storedUser.id)
      }
      if (storedUser?.name) {
        setCurrentUserName(storedUser.name)
      }
      const token = localStorage.getItem('auth_token')
      setHasAuth(!!token)
    } catch {
      // ignore parse errors
    }

    const fetchVendorDetails = async () => {
      if (!vendorId) {
        console.log('VendorDetailPage - No vendorId in params')
        return
      }

      try {
        console.log('VendorDetailPage - Calling getVendorDetails with vendorId:', vendorId)
        const response = await getVendorDetails(vendorId)
        console.log('VendorDetailPage - getVendorDetails response:', response)
        console.log('VendorDetailPage - Vendor data:', response?.data)

        if (response?.status && response?.data) {
          // Merge passed data from navigation state with API response
          const passedData = location.state || {}
          const mergedData = {
            ...response.data,
            // Override with passed data if available (from vendor list)
            avg_rating: passedData.avg_rating !== undefined ? passedData.avg_rating : response.data.avg_rating,
            total_reviews: passedData.total_reviews !== undefined ? passedData.total_reviews : response.data.total_reviews,
            service_names: passedData.service_names || response.data.service_names || [],
            service_name: passedData.service_name || response.data.service_name
          }
          setVendorData(mergedData)

          // Set reviews from vendor detail response if available (as fallback)
          if (response.data.review && Array.isArray(response.data.review) && response.data.review.length > 0) {
            setReviews(response.data.review)
          }

          // Fetch work images if vendor has an ID
          if (response.data.id) {
            fetchWorkImagesData(response.data.id)
          }

          // Fetch vendor reviews from separate endpoint (will override if successful)
          if (response.data.id) {
            fetchVendorReviews(response.data.id)
          }
        }
      } catch (error) {
        console.error('VendorDetailPage - Error fetching vendor details:', error)
        console.error('VendorDetailPage - Error details:', error?.response?.data || error?.message)
      }
    }

    fetchVendorDetails()
  }, [vendorId])

  // Translate vendor details
  useEffect(() => {
    if (currentLanguage === 'en' || !vendorData) {
      setTranslatedVendorData(null)
      return
    }

    let isMounted = true
    const timeoutId = setTimeout(async () => {
      try {
        // Translate common fields
        const translated = await translateObject(vendorData, ['brand_name', 'name', 'address', 'city', 'service_name', 'service_names'])
        if (isMounted) {
          setTranslatedVendorData(translated)
        }
      } catch (error) {
        console.error('Error translating vendor details:', error)
      }
    }, 100)

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
    }
  }, [vendorData, currentLanguage, translateObject])

  // Translate reviews
  const [translatedReviews, setTranslatedReviews] = useState([])

  useEffect(() => {
    if (currentLanguage === 'en' || reviews.length === 0) {
      setTranslatedReviews([])
      return
    }

    let isMounted = true
    const timeoutId = setTimeout(async () => {
      try {
        // Flatten reviews for translation
        const reviewsToTranslate = reviews.map(review => {
          let userName = 'Anonymous'
          if (review.user?.name) {
            userName = review.user.name
          } else if (review.user_name) {
            userName = review.user_name
          } else if (review.name) {
            userName = review.name
          }

          return {
            ...review,
            // Create temporary fields for translation
            translated_review_content: review.review || review.comment || '',
            translated_user_name: userName
          }
        })

        // Translate the temporary fields
        const translated = await translateObject(reviewsToTranslate, ['translated_review_content', 'translated_user_name'])

        if (isMounted) {
          setTranslatedReviews(translated || reviews)
        }
      } catch (error) {
        console.error('Error translating reviews:', error)
        if (isMounted) {
          setTranslatedReviews(reviews)
        }
      }
    }, 100)

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
    }
  }, [reviews, currentLanguage, translateObject])

  // Fetch work images
  const fetchWorkImagesData = async (userId) => {
    try {
      setLoadingWorkImages(true)
      const response = await fetchWorkImages(userId)
      if (response?.status && response?.work_img) {
        let images = []
        if (typeof response.work_img === 'string') {
          try {
            images = JSON.parse(response.work_img)
          } catch (e) {
            images = [response.work_img]
          }
        } else if (Array.isArray(response.work_img)) {
          images = response.work_img
        }
        setWorkImages(images.map(img => getImageUrl(img)))
      }
    } catch (error) {
      console.error('VendorDetailPage - Error fetching work images:', error)
    } finally {
      setLoadingWorkImages(false)
    }
  }

  // Fetch vendor reviews
  const fetchVendorReviews = async (vendorId) => {
    try {
      setLoadingReviews(true)
      const response = await getVendorReviews(vendorId)
      // Handle different response structures
      // Priority: response.reviews > response.data.reviews > response.data (array) > response.data.review
      if (response?.reviews && Array.isArray(response.reviews) && response.reviews.length > 0) {
        // Direct reviews array (e.g., { vendor_id: "243", reviews: [...] })
        setReviews(response.reviews)
        return
      } else if (response?.status) {
        // If response.data is an array, use it directly
        if (Array.isArray(response.data) && response.data.length > 0) {
          setReviews(response.data)
          return
        }
        // If response.data is an object with reviews array
        else if (response.data?.reviews && Array.isArray(response.data.reviews) && response.data.reviews.length > 0) {
          setReviews(response.data.reviews)
          return
        }
        // If response.data is an object with review array (from vendor detail)
        else if (response.data?.review && Array.isArray(response.data.review) && response.data.review.length > 0) {
          setReviews(response.data.review)
          return
        }
      }
      // If separate API doesn't return reviews, keep existing ones (don't clear)
      // Reviews from vendor detail response will be used
    } catch (error) {
      console.error('VendorDetailPage - Error fetching vendor reviews:', error)
      // Don't clear reviews on error - keep reviews from vendor detail response
    } finally {
      setLoadingReviews(false)
    }
  }

  // Handle image delete
  const handleImageDelete = async (imageUrl) => {
    if (!vendorData?.id) {
      alert('Vendor ID not found')
      return
    }

    const imagePath = imageUrl.replace(IMAGE_BASE_URL, '').replace(/^\/+/, '')

    if (!confirm('Are you sure you want to delete this image?')) {
      return
    }

    try {
      setDeletingImage(imageUrl)
      const response = await deleteWorkImage(vendorData.id, imagePath)
      if (response?.status) {
        await fetchWorkImagesData(vendorData.id)
        alert('Image deleted successfully!')
      }
    } catch (error) {
      console.error('VendorDetailPage - Error deleting image:', error)
      alert(error?.response?.data?.message || 'Failed to delete image')
    } finally {
      setDeletingImage(null)
    }
  }

  // Use API data if available, otherwise use fallback
  // Create base object from vendorData
  const baseData = vendorData || {
    id: parseInt(vendorId) || 1,
    name: 'Vendor',
    brand_name: '',
    avg_rating: '0.0',
    total_reviews: 0,
    address: 'Address not available',
    city: '',
    established_year: '',
    hours: 'Hours not available',
    phone: '',
    email: '',
    whatsapp: '',
    is_whatsapp: false,
    service: [],
    review: [],
    work_img: null
  }

  // Use translated data if available, otherwise base data
  const displayData = translatedVendorData || baseData

  // Map API response to display format
  const vendorName = displayData.brand_name || displayData.name || 'Vendor'
  const vendorOwnerName = displayData.name || ''
  const vendorAddress = displayData.address || 'Address not available'
  const vendorCity = displayData.city || ''
  const vendorPhone = displayData.phone || displayData.mobile || displayData.contact || ''
  const vendorWhatsapp = displayData.whatsapp || displayData.phone || displayData.mobile || displayData.contact || ''
  const vendorEmail = displayData.email || ''
  const vendorRating = displayData.avg_rating ? parseFloat(displayData.avg_rating).toFixed(1) : '0.0'
  const vendorReviews = displayData.total_reviews || 0
  const vendorSince = displayData.established_year || ''
  const vendorIsWhatsapp =
    displayData.is_whatsapp === true ||
    displayData.is_whatsapp === 1 ||
    displayData.is_whatsapp === '1' ||
    displayData.is_whatsapp === 'true'
  const vendorProfileImg = displayData.profile_img ? getImageUrl(displayData.profile_img) : null

  // Parse work_img from vendorData if workImages is empty
  let vendorImages = workImages.length > 0 ? workImages : []
  if (vendorImages.length === 0 && displayData.work_img) {
    try {
      const parsedImages = typeof displayData.work_img === 'string' ? JSON.parse(displayData.work_img) : displayData.work_img
      if (Array.isArray(parsedImages) && parsedImages.length > 0) {
        vendorImages = parsedImages.map(img => getImageUrl(img))
      }
    } catch (e) {
      if (typeof displayData.work_img === 'string' && displayData.work_img.trim() !== '[]') {
        vendorImages = [getImageUrl(displayData.work_img)]
      }
    }
  }
  // Carousel navigation functions
  const goToNextImage = () => {
    if (vendorImages.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % vendorImages.length)
    }
  }

  const goToPrevImage = () => {
    if (vendorImages.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + vendorImages.length) % vendorImages.length)
    }
  }

  const goToImage = (index) => {
    setCurrentImageIndex(index)
  }

  // Reset image index when images change
  useEffect(() => {
    if (vendorImages.length > 0) {
      setCurrentImageIndex(0)
    }
  }, [vendorImages.length])

  // Keyboard navigation for image modal
  useEffect(() => {
    if (!isImageModalOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsImageModalOpen(false)
      } else if (e.key === 'ArrowLeft') {
        goToPrevImage()
      } else if (e.key === 'ArrowRight') {
        goToNextImage()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isImageModalOpen, vendorImages.length])

  // Get services from service_names array, fallback to service_name
  let vendorServices = []
  if (displayData.service_names && Array.isArray(displayData.service_names) && displayData.service_names.length > 0) {
    // Use service_names array from passed data - show all elements
    vendorServices = displayData.service_names.map(name => ({ icon: 'list', text: name || 'Service' }))
  } else if (displayData.service_name) {
    // Fallback to service_name (single value) - convert to array format
    vendorServices = [{ icon: 'list', text: displayData.service_name }]
  }

  // Reviews are now fetched separately via getVendorReviews API
  // reviews state is used instead of displayData.review

  const handleCall = () => {
    window.location.href = `tel:+91${vendorPhone}`
  }

  const handleWhatsApp = () => {
    if (!vendorIsWhatsapp || !vendorWhatsapp) return
    const whatsappNumber = vendorWhatsapp.replace(/[^0-9]/g, '')
    window.open(`https://wa.me/91${whatsappNumber}`, '_blank')
  }

  const handleDirection = () => {
    const fullQuery = vendorCity
      ? `${vendorAddress}, ${vendorCity}`
      : vendorAddress
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullQuery)}`,
      '_blank'
    )
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: vendorName,
        text: `Check out ${vendorName} at ${vendorAddress}`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  const openEnquiryModal = () => {
    const today = new Date().toISOString().split('T')[0]
    setEnquiryDate((prev) => prev || today)
    setEnquiryError('')
    setEnquirySuccess('')
    setIsEnquiryModalOpen(true)
  }

  const closeEnquiryModal = () => {
    setIsEnquiryModalOpen(false)
    setEnquirySubmitting(false)
    setEnquiryError('')
    setEnquirySuccess('')
  }

  const handleSubmitEnquiry = async (e) => {
    e.preventDefault()
    setEnquiryError('')
    setEnquirySuccess('')

    const userId = currentUserId
    const vendorIdNumeric = vendorData?.id || parseInt(vendorId)

    if (!userId) {
      setEnquiryError('Please login to submit an enquiry.')
      return
    }

    if (!vendorIdNumeric) {
      setEnquiryError('Vendor not found.')
      return
    }

    if (!enquiryDate) {
      setEnquiryError('Please select a date.')
      return
    }

    try {
      setEnquirySubmitting(true)
      const response = await createEnquiry({
        user_id: userId,
        vendor_id: vendorIdNumeric,
        date: enquiryDate
      })

      if (response?.status === 'success' || response?.status === true) {
        setEnquirySuccess(response?.message || 'Enquiry created successfully')
        setTimeout(() => {
          closeEnquiryModal()
        }, 600)
      } else {
        setEnquiryError(response?.message || 'Failed to create enquiry')
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to create enquiry'
      setEnquiryError(message)
    } finally {
      setEnquirySubmitting(false)
    }
  }

  const handleSubmitReview = async () => {
    if (!selectedRating || selectedRating === 0) {
      return
    }
    if (!reviewText.trim()) {
      return
    }
    if (!hasAuth) {
      setReviewError('Please login or sign up to submit a review.')
      return
    }
    if (!vendorId) {
      return
    }

    try {
      setSubmittingReview(true)
      setReviewSuccess('')
      setReviewError('')
      const response = await submitReview(parseInt(vendorId), reviewText.trim(), selectedRating)
      // Treat any successful response as success (status field not enforced)
      setReviewText('')
      setSelectedRating(0)
      setReviewSuccess(response?.message || 'Review submitted successfully')
      // Refresh vendor details to get updated reviews
      const updatedResponse = await getVendorDetails(vendorId)
      if (updatedResponse?.status && updatedResponse?.data) {
        setVendorData(updatedResponse.data)
        // Set reviews from updated vendor detail response
        if (updatedResponse.data.review && Array.isArray(updatedResponse.data.review) && updatedResponse.data.review.length > 0) {
          setReviews(updatedResponse.data.review)
        }
      }
      // Also try to fetch from separate reviews endpoint
      await fetchVendorReviews(parseInt(vendorId))
    } catch (error) {
      console.error('VendorDetailPage - Error submitting review:', error)
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to submit review'
      setReviewError(message)
    } finally {
      setSubmittingReview(false)
    }
  }

  const tabs = ['Overview', 'Reviews', 'Quick Info']

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header - Fixed on Top */}
      <div className="bg-gradient-to-br from-[#13335a] to-[#1e4a7a] p-[clamp(12px,2.5vw,20px)_clamp(16px,3vw,24px)] flex justify-between items-center fixed top-0 left-0 right-0 z-[1000] shadow-[0_2px_8px_rgba(0,0,0,0.15)] backdrop-blur-[10px]">
        <button className="bg-transparent border-none cursor-pointer p-1 flex items-center justify-center transition-colors rounded-full w-[clamp(28px,4vw,32px)] h-[clamp(28px,4vw,32px)] hover:bg-white/20" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[clamp(20px,3vw,24px)] h-[clamp(20px,3vw,24px)]">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h2 className="text-[clamp(18px,3vw,24px)] font-bold text-white m-0 flex-1 text-center"><TranslatedText>About Service</TranslatedText></h2>
        <div className="w-6"></div>
      </div>

      {/* Content with top padding so it doesn't hide behind fixed header */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-[clamp(16px,3vw,24px)] pt-[clamp(72px,10vw,96px)] pb-[120px] [-webkit-overflow-scrolling:touch] md:p-[clamp(14px,2vw,18px)] md:pt-[clamp(64px,8vw,80px)] md:pb-[100px]">
        {/* Main Vendor Card */}
        <div className="bg-gradient-to-br from-[#F2E8F0] via-[#DEDCE9] via-[#BCC6E1] to-[#98B0D6] rounded-[clamp(16px,2.5vw,20px)] shadow-[0_2px_8px_rgba(0,0,0,0.1)] border-none overflow-hidden mb-[clamp(16px,3vw,24px)]">
          {/* Details and Image Section */}
          <div className="flex gap-[clamp(16px,2.5vw,24px)] p-[clamp(20px,4vw,32px)] bg-white/30 min-w-0 overflow-hidden md:flex-row md:p-[clamp(12px,2vw,16px)] md:gap-[clamp(12px,2vw,16px)]">
            <div className="flex-1 flex flex-col gap-[clamp(16px,2.5vw,20px)] min-w-0 overflow-hidden">
              <div className="flex flex-col gap-[clamp(6px,1vw,8px)]">
                <div className="flex items-center gap-[clamp(6px,1vw,8px)]">
                  {vendorProfileImg ? (
                    <div className="w-[clamp(32px,5vw,40px)] h-[clamp(32px,5vw,40px)] rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      <img
                        src={vendorProfileImg}
                        alt={vendorName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#1a1a1a] w-[clamp(16px,2.5vw,20px)] h-[clamp(16px,2.5vw,20px)]">
                      <path d="M7 11L12 2L17 11M7 11H17M7 11L12 14L17 11M17 18H7L12 22L17 18Z" fill="currentColor" />
                    </svg>
                  )}
                  <h1 className="text-[clamp(20px,3.5vw,28px)] font-bold text-[#1a1a1a] m-0 tracking-[-0.5px]"><TranslatedText>{vendorName}</TranslatedText></h1>
                </div>
                <div className="flex items-center gap-[clamp(6px,1vw,8px)]">
                  <div className="flex items-center gap-[clamp(3px,0.5vw,4px)] bg-[#31652E] text-white p-[clamp(5px,0.75vw,6px)_clamp(10px,1.5vw,12px)] rounded-lg font-bold text-[clamp(13px,1.9vw,15px)]">
                    <span>{vendorRating}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="w-[clamp(14px,2vw,16px)] h-[clamp(14px,2vw,16px)]">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  </div>
                  <span className="text-[clamp(13px,1.9vw,15px)] text-black font-bold"><span><TranslatedText>{vendorReviews.toString()}</TranslatedText></span> <TranslatedText>Ratings</TranslatedText></span>
                </div>
              </div>

              <div className="flex flex-col gap-[clamp(6px,1vw,8px)] mt-[clamp(3px,0.5vw,4px)]">
                <p className="text-[clamp(13px,1.9vw,15px)] text-[#9E9BA6] m-0 font-medium"><TranslatedText>{vendorAddress}</TranslatedText></p>
                {vendorSince && (
                  <p className="text-[clamp(13px,1.9vw,15px)] text-black m-0 font-medium"><TranslatedText>Since</TranslatedText> <TranslatedText>{vendorSince}</TranslatedText></p>
                )}
                {vendorPhone && (
                  <p className="text-[clamp(13px,1.9vw,15px)] text-black m-0 font-medium"><TranslatedText>Contact</TranslatedText>: {vendorPhone}</p>
                )}
              </div>

              <div className="flex flex-col gap-[clamp(10px,1.5vw,12px)] mt-[clamp(3px,0.5vw,4px)]">
                {vendorServices.length > 0 ? vendorServices.map((service, index) => (
                  <div key={index} className="flex items-center gap-[clamp(8px,1.25vw,10px)] text-[clamp(13px,1.9vw,15px)] text-gray-700 font-medium">
                    {service.icon === 'list' && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 w-[clamp(14px,2vw,16px)] h-[clamp(14px,2vw,16px)]">
                        <path d="M8 6H21M8 12H21M8 18H21M3 6H3.01M3 12H3.01M3 18H3.01" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    {service.icon === 'lightning' && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 w-[clamp(14px,2vw,16px)] h-[clamp(14px,2vw,16px)]">
                        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    <span className="whitespace-nowrap"><TranslatedText>{service.text}</TranslatedText></span>
                  </div>
                )) : (
                  <div className="text-[clamp(13px,1.9vw,15px)] text-gray-500 font-medium">No services listed</div>
                )}
              </div>
            </div>

            <div className="flex-shrink-0 w-[clamp(80px,15vw,150px)] md:w-auto md:flex-shrink-0 md:min-w-0">
              {vendorImages.length > 0 ? (
                <div
                  className="relative w-[clamp(80px,15vw,150px)] h-[clamp(120px,22.5vw,225px)] bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.05)] md:w-[197px] md:h-[296px] md:m-0 md:aspect-auto cursor-pointer"
                  onClick={() => setIsImageModalOpen(true)}
                >
                  {/* Image Carousel */}
                  <div className="relative w-full h-full">
                    {vendorImages.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`${vendorName} - Image ${index + 1}`}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${index === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                          }`}
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                    ))}
                  </div>

                  {/* Navigation Arrows - Only show if more than 1 image */}
                  {vendorImages.length > 1 && (
                    <>
                      {/* Previous Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          goToPrevImage()
                        }}
                        className="absolute left-[clamp(4px,1vw,8px)] top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-[clamp(4px,0.8vw,6px)] transition-all flex items-center justify-center"
                        aria-label="Previous image"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[clamp(10px,1.2vw,14px)] h-[clamp(10px,1.2vw,14px)] md:w-[clamp(12px,1.5vw,16px)] md:h-[clamp(12px,1.5vw,16px)]">
                          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>

                      {/* Next Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          goToNextImage()
                        }}
                        className="absolute right-[clamp(4px,1vw,8px)] top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-[clamp(4px,0.8vw,6px)] transition-all flex items-center justify-center"
                        aria-label="Next image"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[clamp(10px,1.2vw,14px)] h-[clamp(10px,1.2vw,14px)] md:w-[clamp(12px,1.5vw,16px)] md:h-[clamp(12px,1.5vw,16px)]">
                          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>

                      {/* Dots Indicator */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-[clamp(4px,0.75vw,6px)]">
                        {vendorImages.map((_, index) => (
                          <button
                            key={index}
                            onClick={(e) => {
                              e.stopPropagation()
                              goToImage(index)
                            }}
                            className={`rounded-full transition-all ${index === currentImageIndex
                              ? 'bg-white w-[clamp(20px,3vw,24px)] h-[clamp(6px,1vw,8px)]'
                              : 'bg-white/50 w-[clamp(6px,1vw,8px)] h-[clamp(6px,1vw,8px)]'
                              }`}
                            aria-label={`Go to image ${index + 1}`}
                          />
                        ))}
                      </div>

                      {/* Image Counter */}
                      <div className="absolute top-2 right-2 z-20 bg-black/50 text-white text-[clamp(10px,1.4vw,12px)] font-semibold px-[clamp(6px,1vw,8px)] py-[clamp(2px,0.5vw,4px)] rounded">
                        {currentImageIndex + 1} / {vendorImages.length}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="w-[clamp(80px,15vw,150px)] h-[clamp(120px,22.5vw,225px)] bg-gray-50 rounded-xl flex flex-col items-center justify-center gap-[clamp(8px,1.25vw,10px)] text-gray-400 border-2 border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.05)] md:w-[197px] md:h-[296px] md:m-0 md:aspect-auto">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[clamp(48px,8vw,64px)] h-[clamp(48px,8vw,64px)]">
                    <path d="M4 16L8.586 11.414C8.96106 11.0391 9.46967 10.8284 10 10.8284C10.5303 10.8284 11.0389 11.0391 11.414 11.414L16 16M14 14L15.586 12.414C15.9611 12.0391 16.4697 11.8284 17 11.8284C17.5303 11.8284 18.0389 12.0391 18.414 12.414L20 14M14 8H14.01M6 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V6C20 5.46957 19.7893 4.96086 19.4142 4.58579C19.0391 4.21071 18.5304 4 18 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-[clamp(8px,1.25vw,10px)] font-semibold text-gray-500 uppercase tracking-[0.5px]">No Image</span>
                </div>
              )}
            </div>
          </div>

          {/* Icons Container - Separate Section Below */}
          <div className="px-[clamp(20px,4vw,32px)] pb-[clamp(20px,4vw,32px)] pt-0 bg-white/30 md:px-[clamp(12px,2vw,16px)] md:pb-[clamp(12px,2vw,16px)]">
            <div className="flex gap-[clamp(10px,1.5vw,12px)] justify-start md:gap-[clamp(6px,1vw,8px)] md:overflow-x-auto md:[-webkit-overflow-scrolling:touch] md:[scrollbar-width:none] md:[&::-webkit-scrollbar]:hidden">
              <button className="flex flex-col items-center justify-center gap-[clamp(8px,1.25vw,10px)] p-0 border-none bg-transparent text-black text-[clamp(11px,1.6vw,13px)] font-medium cursor-pointer transition-all flex-shrink-0 hover:opacity-80 md:flex-shrink-0 md:min-w-auto" onClick={handleCall}>
                <div className="w-[clamp(48px,6vw,60px)] h-[clamp(48px,6vw,60px)] bg-[#E6EAF3] rounded-xl flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.1)] md:w-[clamp(40px,10vw,50px)] md:h-[clamp(40px,10vw,50px)]">
                  <FaPhone className="w-[clamp(20px,2.5vw,24px)] h-[clamp(20px,2.5vw,24px)] text-black md:w-[clamp(18px,4vw,20px)] md:h-[clamp(18px,4vw,20px)] rotate-90" />
                </div>
                <span><TranslatedText>Call Now</TranslatedText></span>
              </button>
              {vendorIsWhatsapp && vendorWhatsapp && (
                <button className="flex flex-col items-center justify-center gap-[clamp(8px,1.25vw,10px)] p-0 border-none bg-transparent text-black text-[clamp(11px,1.6vw,13px)] font-medium cursor-pointer transition-all flex-shrink-0 hover:opacity-80 md:flex-shrink-0 md:min-w-auto" onClick={handleWhatsApp}>
                  <div className="w-[clamp(48px,6vw,60px)] h-[clamp(48px,6vw,60px)] bg-[#E6EAF3] rounded-xl flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.1)] md:w-[clamp(40px,10vw,50px)] md:h-[clamp(40px,10vw,50px)]">
                    <div className="w-[clamp(32px,4vw,40px)] h-[clamp(32px,4vw,40px)] rounded-full border-2 border-green-600 flex items-center justify-center md:w-[clamp(28px,6vw,32px)] md:h-[clamp(28px,6vw,32px)]">
                      <FaWhatsapp className="w-[clamp(20px,2.5vw,24px)] h-[clamp(20px,2.5vw,24px)] text-green-600 md:w-[clamp(18px,4vw,20px)] md:h-[clamp(18px,4vw,20px)]" />
                    </div>
                  </div>
                  <span><TranslatedText>Whatsapp</TranslatedText></span>
                </button>
              )}
              <button className="flex flex-col items-center justify-center gap-[clamp(8px,1.25vw,10px)] p-0 border-none bg-transparent text-black text-[clamp(11px,1.6vw,13px)] font-medium cursor-pointer transition-all flex-shrink-0 hover:opacity-80 md:flex-shrink-0 md:min-w-auto" onClick={handleDirection}>
                <div className="w-[clamp(48px,6vw,60px)] h-[clamp(48px,6vw,60px)] bg-[#E6EAF3] rounded-xl flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.1)] md:w-[clamp(40px,10vw,50px)] md:h-[clamp(40px,10vw,50px)]">
                  <FaDirections className="w-[clamp(20px,2.5vw,24px)] h-[clamp(20px,2.5vw,24px)] text-black md:w-[clamp(18px,4vw,20px)] md:h-[clamp(18px,4vw,20px)]" />
                </div>
                <span><TranslatedText>Direction</TranslatedText></span>
              </button>
              <button className="flex flex-col items-center justify-center gap-[clamp(8px,1.25vw,10px)] p-0 border-none bg-transparent text-black text-[clamp(11px,1.6vw,13px)] font-medium cursor-pointer transition-all flex-shrink-0 hover:opacity-80 md:flex-shrink-0 md:min-w-auto" onClick={handleShare}>
                <div className="w-[clamp(48px,6vw,60px)] h-[clamp(48px,6vw,60px)] bg-[#E6EAF3] rounded-xl flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.1)] md:w-[clamp(40px,10vw,50px)] md:h-[clamp(40px,10vw,50px)]">
                  <FaShare className="w-[clamp(20px,2.5vw,24px)] h-[clamp(20px,2.5vw,24px)] text-black md:w-[clamp(18px,4vw,20px)] md:h-[clamp(18px,4vw,20px)]" />
                </div>
                <span><TranslatedText>Share</TranslatedText></span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-t border-b border-gray-200/80 bg-gradient-to-b from-white to-gray-50 backdrop-blur-[10px] md:overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`flex-1 p-[clamp(12px,2vw,16px)] border-none bg-transparent text-[clamp(14px,2vw,16px)] font-bold cursor-pointer transition-all border-b-[3px] border-transparent relative md:whitespace-nowrap md:p-[clamp(10px,1.5vw,12px)_clamp(14px,2vw,16px)] md:text-[clamp(12px,1.75vw,14px)] ${activeTab === tab
                  ? 'text-[#13335a] border-b-[#13335a] bg-white'
                  : 'text-gray-500 hover:bg-gray-100'
                  }`}
                onClick={() => setActiveTab(tab)}
              >
                <TranslatedText>{tab}</TranslatedText>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-[clamp(20px,4vw,32px)] pb-0 min-h-[200px] bg-white">
            {activeTab === 'Overview' && (
              <div className="flex flex-col gap-[clamp(16px,2.5vw,20px)]">
                {vendorCity && (
                  <div className="flex items-center gap-[clamp(10px,1.5vw,12px)]">
                    <span className="text-[clamp(13px,1.9vw,15px)] font-bold text-[#1a1a1a] min-w-[clamp(70px,11.25vw,90px)]"><TranslatedText>City</TranslatedText>:</span>
                    <span className="text-[clamp(13px,1.9vw,15px)] text-gray-700 font-medium"><TranslatedText>{vendorCity}</TranslatedText></span>
                  </div>
                )}
                {vendorPhone && (
                  <div className="flex items-center gap-[clamp(10px,1.5vw,12px)]">
                    <span className="text-[clamp(13px,1.9vw,15px)] font-bold text-[#1a1a1a] min-w-[clamp(70px,11.25vw,90px)]"><TranslatedText>Contact</TranslatedText>:</span>
                    <div className="flex items-center gap-[clamp(6px,1vw,8px)] text-[clamp(13px,1.9vw,15px)] text-gray-700 font-medium">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[clamp(14px,2vw,16px)] h-[clamp(14px,2vw,16px)] text-gray-500">
                        <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7292C21.7209 20.9842 21.5573 21.2126 21.3518 21.3992C21.1463 21.5858 20.9033 21.7262 20.6381 21.811C20.3729 21.8958 20.0922 21.9231 19.815 21.891C16.7428 21.5856 13.786 20.5341 11.19 18.82C8.77382 17.3148 6.72533 15.2663 5.22 12.85C3.49997 10.2412 2.44824 7.27099 2.15 4.18C2.11793 3.90322 2.14518 3.62281 2.22981 3.35788C2.31444 3.09295 2.45452 2.85002 2.64082 2.64458C2.82712 2.43914 3.05531 2.27554 3.31007 2.16389C3.56483 2.05224 3.84034 1.99508 4.119 2H7.119C7.59357 1.99522 8.05808 2.16708 8.43322 2.49055C8.80836 2.81402 9.07173 3.27236 9.179 3.78L9.88 6.75C9.98603 7.24195 9.93842 7.75767 9.74447 8.22293C9.55052 8.68819 9.21969 9.08114 8.8 9.35L7.33 10.28C8.47697 12.3301 10.1699 14.023 12.22 15.17L13.15 13.71C13.4201 13.2908 13.8132 12.9602 14.2784 12.7663C14.7436 12.5724 15.2591 12.5247 15.75 12.63L18.71 13.33C19.2176 13.4373 19.676 13.7007 19.9995 14.0758C20.323 14.4509 20.4948 14.9154 20.49 15.39L22 19.39Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>{vendorPhone}</span>
                    </div>
                  </div>
                )}
                {vendorEmail && (
                  <div className="flex items-center gap-[clamp(10px,1.5vw,12px)]">
                    <span className="text-[clamp(13px,1.9vw,15px)] font-bold text-[#1a1a1a] min-w-[clamp(70px,11.25vw,90px)]"><TranslatedText>Email</TranslatedText>:</span>
                    <div className="flex items-center gap-[clamp(6px,1vw,8px)] text-[clamp(13px,1.9vw,15px)] text-gray-700 font-medium">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[clamp(14px,2vw,16px)] h-[clamp(14px,2vw,16px)] text-gray-500">
                        <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>{vendorEmail}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Reviews' && (
              <div className="flex flex-col gap-[clamp(20px,3vw,24px)]">
                <h3 className="text-[clamp(16px,2.5vw,20px)] font-bold text-[#1a1a1a] m-0"><TranslatedText>Start Review</TranslatedText></h3>
                <div className="flex flex-col gap-[clamp(10px,1.5vw,12px)]">
                  <div className="flex gap-[clamp(6px,1vw,8px)] items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        className="bg-transparent border-none cursor-pointer p-1 flex items-center justify-center transition-transform hover:scale-110"
                        onClick={() => setSelectedRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                      >
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill={star <= (hoveredRating || selectedRating) ? "#fbbf24" : "none"}
                          stroke={star <= (hoveredRating || selectedRating) ? "#fbbf24" : "#d1d5db"}
                          strokeWidth="2"
                          className="w-[clamp(24px,4vw,32px)] h-[clamp(24px,4vw,32px)]"
                        >
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                  <p className="text-[clamp(12px,1.75vw,14px)] text-gray-500 m-0 font-normal"><TranslatedText>Tap a star to rate</TranslatedText></p>
                </div>

                {/* Review Input */}
                <div className="flex flex-col gap-[clamp(10px,1.5vw,12px)]">
                  {!hasAuth && (
                    <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm">
                      <TranslatedText>Please login or sign up to submit a review.</TranslatedText>
                    </div>
                  )}
                  {reviewSuccess && (
                    <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
                      {reviewSuccess}
                    </div>
                  )}
                  {reviewError && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                      <TranslatedText>{reviewError}</TranslatedText>
                    </div>
                  )}
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder={t('Write your review here...')}
                    className={`w-full p-[clamp(12px,2vw,16px)] border-2 rounded-lg text-[clamp(13px,1.9vw,15px)] font-medium text-gray-700 resize-none focus:outline-none min-h-[clamp(100px,15vw,120px)] ${reviewDisabled ? 'border-gray-200 bg-gray-50 cursor-not-allowed text-gray-400' : 'border-gray-300 focus:border-[#13335a]'
                      }`}
                    disabled={reviewDisabled}
                    rows={4}
                  />
                  <button
                    onClick={handleSubmitReview}
                    disabled={reviewDisabled || submittingReview || !selectedRating || !reviewText.trim()}
                    className={`w-full py-[clamp(12px,2vw,16px)] px-[clamp(20px,3vw,24px)] bg-[#13335a] text-white rounded-lg text-[clamp(14px,2vw,16px)] font-bold cursor-pointer transition-all hover:bg-[#1e4a7a] disabled:opacity-50 disabled:cursor-not-allowed ${submittingReview ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                  >
                    {submittingReview ? <TranslatedText>Submitting...</TranslatedText> : reviewDisabled ? <TranslatedText>Login to Submit</TranslatedText> : <TranslatedText>Submit Review</TranslatedText>}
                  </button>
                </div>

                <h3 className="text-[clamp(16px,2.5vw,20px)] font-bold text-[#1a1a1a] m-0 mt-[clamp(6px,1vw,8px)]"><TranslatedText>User Reviews</TranslatedText></h3>
                {loadingReviews ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-gray-500"><TranslatedText>Loading reviews...</TranslatedText></div>
                  </div>
                ) : (() => {
                  // Use reviews from state, favoring translated if available
                  const currentReviews = (translatedReviews.length > 0 && currentLanguage !== 'en') ? translatedReviews : reviews

                  const displayReviews = currentReviews.length > 0
                    ? currentReviews
                    : (vendorData?.review && Array.isArray(vendorData.review) && vendorData.review.length > 0
                      ? vendorData.review
                      : [])
                  // Sort reviews - newest first (reverse order)
                  const sortedReviews = [...displayReviews].reverse()

                  return sortedReviews.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-[clamp(16px,2.5vw,20px)]">
                      {sortedReviews.map((review, index) => {
                        const reviewRating = review.star || review.rating || 0
                        // Use translated content if available
                        const reviewText = review.translated_review_content || review.review || review.comment || ''

                        // Handle user name - prioritized translated name
                        let reviewUserName = review.translated_user_name || 'Anonymous'
                        if (!review.translated_user_name) {
                          if (review.user?.name) {
                            reviewUserName = review.user.name
                          } else if (review.user_name) {
                            reviewUserName = review.user_name
                          } else if (review.name) {
                            reviewUserName = review.name
                          } else if (review.user_id) {
                            // If only user_id is available, check if it's the current user
                            try {
                              const currentUser = JSON.parse(localStorage.getItem('userData') || '{}')
                              if (currentUser.id === review.user_id && currentUser.name) {
                                reviewUserName = currentUser.name
                              } else {
                                reviewUserName = 'Anonymous'
                              }
                            } catch {
                              reviewUserName = 'Anonymous'
                            }
                          }
                        }
                        const reviewDate = review.created_at || review.date || review.updated_at

                        return (
                          <div key={review.id || index} className="flex flex-col gap-[clamp(6px,1vw,8px)] p-[clamp(12px,2vw,16px)] bg-gray-50 rounded-lg">
                            {/* Stars (rating) */}
                            <div className="flex items-center gap-[clamp(4px,0.75vw,6px)] justify-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                  key={star}
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill={star <= reviewRating ? "#fbbf24" : "none"}
                                  stroke={star <= reviewRating ? "#fbbf24" : "#d1d5db"}
                                  strokeWidth="2"
                                  className="w-[clamp(14px,2vw,16px)] h-[clamp(14px,2vw,16px)]"
                                >
                                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                                </svg>
                              ))}
                            </div>
                            {/* Comment */}
                            {reviewText && (
                              <p className="text-[clamp(13px,1.9vw,15px)] text-gray-700 m-0 text-center"><TranslatedText>{reviewText}</TranslatedText></p>
                            )}
                            {/* Name (and date below comment) */}
                            <div className="flex flex-col items-center gap-[clamp(2px,0.4vw,4px)]">
                              <span className="text-[clamp(12px,1.75vw,14px)] font-bold text-gray-700"><TranslatedText>{reviewUserName}</TranslatedText></span>
                              {reviewDate && (
                                <span className="text-[clamp(11px,1.6vw,13px)] text-gray-500">{new Date(reviewDate).toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-[clamp(10px,1.5vw,12px)] p-[clamp(30px,5vw,40px)_clamp(16px,2.5vw,20px)] text-gray-400">
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[clamp(48px,8vw,64px)] h-[clamp(48px,8vw,64px)]">
                        <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M7 9L12 12L17 9" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="text-[clamp(12px,1.75vw,14px)] text-gray-500 m-0"><TranslatedText>No reviews yet</TranslatedText></p>
                    </div>
                  )
                })()}
              </div>
            )}

            {activeTab === 'Quick Info' && (
              <div className="flex flex-col">
                <div className="flex flex-col gap-[clamp(16px,2.5vw,20px)]">
                  <div className="flex justify-between items-start pb-[clamp(16px,2.5vw,20px)] border-b border-gray-200 last:border-b-0 last:pb-0">
                    <span className="text-[clamp(12px,1.75vw,14px)] font-bold text-[#1a1a1a] mb-[clamp(3px,0.5vw,4px)]"><TranslatedText>Address</TranslatedText></span>
                    <span className="text-[clamp(13px,1.9vw,15px)] text-gray-700 font-medium"><TranslatedText>{vendorAddress}</TranslatedText></span>
                  </div>
                  {vendorPhone && (
                    <div className="flex justify-between items-start pb-[clamp(16px,2.5vw,20px)] border-b border-gray-200 last:border-b-0 last:pb-0">
                      <span className="text-[clamp(12px,1.75vw,14px)] font-bold text-[#1a1a1a] mb-[clamp(3px,0.5vw,4px)]"><TranslatedText>Contacts</TranslatedText></span>
                      <span className="text-[clamp(13px,1.9vw,15px)] text-gray-700 font-medium">{vendorPhone}</span>
                    </div>
                  )}
                  {vendorSince && (
                    <div className="flex justify-between items-start pb-[clamp(16px,2.5vw,20px)] border-b border-gray-200 last:border-b-0 last:pb-0">
                      <span className="text-[clamp(12px,1.75vw,14px)] font-bold text-[#1a1a1a] mb-[clamp(3px,0.5vw,4px)]"><TranslatedText>Year of Establishment</TranslatedText></span>
                      <span className="text-[clamp(13px,1.9vw,15px)] text-gray-700 font-medium"><TranslatedText>{vendorSince}</TranslatedText></span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Buttons */}
          <div className="relative bg-[#13335a] flex gap-[clamp(10px,1.5vw,12px)] p-[clamp(12px,2vw,16px)] mt-0 mb-0 shadow-[0_-2px_8px_rgba(0,0,0,0.1)] border-none rounded-b-[clamp(16px,2.5vw,20px)] w-full box-border overflow-visible visible opacity-100 md:p-[clamp(10px,1.5vw,12px)] md:relative md:mt-0 md:mb-0 md:flex md:visible md:opacity-100 md:w-full md:box-border md:overflow-visible">
            <button className="flex-1 flex items-center justify-center gap-[clamp(8px,1.25vw,10px)] p-[clamp(12px,2vw,16px)_clamp(18px,3vw,24px)] border-none rounded-[10px] text-[clamp(14px,2vw,16px)] font-bold cursor-pointer transition-all shadow-[0_2px_4px_rgba(0,0,0,0.1)] bg-[#13335a] text-white hover:bg-[#0f2440] hover:-translate-y-0.5 hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)] md:p-[clamp(10px,1.5vw,12px)_clamp(14px,2vw,16px)] md:text-[clamp(12px,1.75vw,14px)] md:flex md:flex-1 md:min-w-0 md:overflow-visible" onClick={openEnquiryModal}>
              <FaPhone className="w-[clamp(16px,2.5vw,20px)] h-[clamp(16px,2.5vw,20px)] rotate-90" />
              <span><TranslatedText>Call Enquiry</TranslatedText></span>
            </button>
          </div>
        </div>
      </div>

      {/* Enquiry Modal */}
      {isEnquiryModalOpen && (
        <div className="fixed inset-0 z-[10000] bg-black/60 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={closeEnquiryModal}
              aria-label="Close enquiry form"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <h3 className="text-xl font-bold text-[#13335a] mb-4"><TranslatedText>Call Enquiry</TranslatedText></h3>

            <form className="flex flex-col gap-4" onSubmit={handleSubmitEnquiry}>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1"><TranslatedText>User</TranslatedText></label>
                <input
                  type="text"
                  value={currentUserName || t('Login required')}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                  placeholder={t('Login required')}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1"><TranslatedText>Vendor</TranslatedText></label>
                <input
                  type="text"
                  value={t(vendorName) || ''}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1"><TranslatedText>Preferred Date</TranslatedText></label>
                <input
                  type="date"
                  value={enquiryDate}
                  onChange={(e) => setEnquiryDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-[#13335a]"
                  required
                />
              </div>

              {enquiryError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  <TranslatedText>{enquiryError}</TranslatedText>
                </div>
              )}

              {enquirySuccess && (
                <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                  <TranslatedText>{enquirySuccess}</TranslatedText>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  className="flex-1 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold text-sm md:text-base hover:bg-gray-50"
                  onClick={closeEnquiryModal}
                  disabled={enquirySubmitting}
                >
                  <TranslatedText>Cancel</TranslatedText>
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-lg bg-[#13335a] text-white font-semibold text-sm md:text-base hover:bg-[#0f2440] disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={enquirySubmitting}
                >
                  {enquirySubmitting ? <TranslatedText>Submitting...</TranslatedText> : <TranslatedText>Submit Enquiry</TranslatedText>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Modal/Lightbox */}
      {
        isImageModalOpen && vendorImages.length > 0 && (
          <div
            className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setIsImageModalOpen(false)}
          >
            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsImageModalOpen(false)
              }}
              className="absolute top-4 right-4 z-[10000] bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-all"
              aria-label="Close"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Image Container */}
            <div
              className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={vendorImages[currentImageIndex]}
                alt={`${vendorName} - Image ${currentImageIndex + 1}`}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />

              {/* Navigation Arrows in Modal */}
              {vendorImages.length > 1 && (
                <>
                  {/* Previous Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      goToPrevImage()
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-all"
                    aria-label="Previous image"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {/* Next Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      goToNextImage()
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-all"
                    aria-label="Next image"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {/* Image Counter in Modal */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm font-semibold px-4 py-2 rounded-full">
                    {currentImageIndex + 1} / {vendorImages.length}
                  </div>
                </>
              )}
            </div>
          </div>
        )
      }
    </div >
  )
}

export default VendorDetailPage

