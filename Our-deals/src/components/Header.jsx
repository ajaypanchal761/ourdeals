import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoMdNotifications, IoMdPerson } from 'react-icons/io'
import DownloadApp from './DownloadApp'
import LanguageSelector from './LanguageSelector'
import {
  getBrowserLocation,
  reverseGeocode,
  loadUserLocation,
  saveUserLocation,
  searchAddressSuggestions,
  getPlaceDetails,
} from '../services/locationService'
import TranslatedText from './TranslatedText'
import { useTranslation } from '../hooks/useTranslation'
import { useDynamicTranslation } from '../hooks/useDynamicTranslation'
import ProfilePage from '../pages/ProfilePage'

function Header() {
  const navigate = useNavigate()
  const { t, currentLanguage, translate } = useTranslation() // Destructure translate
  const { translateObject } = useDynamicTranslation()

  const [userData, setUserData] = useState(null)
  const [selectedLocation, setSelectedLocation] = useState('')
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false)
  const [showLocationPopup, setShowLocationPopup] = useState(false)
  const [locationDisplayName, setLocationDisplayName] = useState('')
  const [locationInputValue, setLocationInputValue] = useState('')
  const [locationSuggestions, setLocationSuggestions] = useState([])
  const [isLocationSearching, setIsLocationSearching] = useState(false)
  const [isGettingDetails, setIsGettingDetails] = useState(false)
  const locationDebounceRef = useRef(null)
  const isSelectingRef = useRef(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  // Translate selected location when language changes or when loaded from storage
  useEffect(() => {
    if (selectedLocation) {
      // Translate the selected location to the current language
      translate(selectedLocation).then(translated => {
        if (translated && translated !== selectedLocation) {
          // If translation is different, update state
          // This handles:
          // 1. Initial load (English "Pune" -> Marathi "पुणे")
          // 2. Language switch (Marathi "पुणे" -> English "Pune")
          setSelectedLocation(translated)
          setLocationInputValue(translated)
        }
      })
    }
  }, [currentLanguage, selectedLocation, translate])

  // Load user data and location from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('userData')
    if (savedUser) {
      setUserData(JSON.parse(savedUser))
    }

    // 1) New unified location object (already chosen or previously saved)
    const stored = loadUserLocation()
    if (stored?.city) {
      // FIX: Use displayName (full address) if available, otherwise fallback to city
      const displayLocation = stored.displayName || stored.city
      setSelectedLocation(displayLocation)
      setLocationInputValue(displayLocation)
      setLocationDisplayName(displayLocation)
      return
    }

    // 2) Backward compatibility with old selectedLocation string (if any)
    const oldSavedLocation = localStorage.getItem('selectedLocation')
    if (oldSavedLocation) {
      setSelectedLocation(oldSavedLocation)
      setLocationInputValue(oldSavedLocation)
      // Optionally migrate it without coordinates
      saveUserLocation({
        city: oldSavedLocation,
        displayName: oldSavedLocation,
      })
      return
    }

    // 3) No saved location -> first visit: call browser Geolocation API (browser will show native permission prompt)
    ; (async () => {
      try {
        const coords = await getBrowserLocation()
        const place = await reverseGeocode(coords.lat, coords.lng)
        const locationObj = {
          lat: place.lat,
          lng: place.lng,
          city: place.city || place.displayName || '',
          displayName: place.displayName,
        }
        saveUserLocation(locationObj)
        // Request: Show full location (displayName), not just city
        const fullLocation = locationObj.displayName || locationObj.city || 'Select location'
        setSelectedLocation(fullLocation)
        setLocationInputValue(fullLocation)
        setLocationDisplayName(fullLocation)
        setShowLocationPopup(true)
      } catch (error) {
        // If user denies browser permission or something fails, just keep default text
        console.log('Header - Could not get browser location:', error)
      }
    })()
  }, [])

  // Listen for login events to update user data
  useEffect(() => {
    const handleLoginEvent = () => {
      const savedUser = localStorage.getItem('userData')
      if (savedUser) {
        setUserData(JSON.parse(savedUser))
      } else {
        setUserData(null)
      }
    }

    window.addEventListener('userLogin', handleLoginEvent)
    return () => window.removeEventListener('userLogin', handleLoginEvent)
  }, [])

  // Listen for location changes from anywhere in the app
  useEffect(() => {
    const handleLocationChanged = () => {
      const stored = loadUserLocation()
      if (stored?.city) {
        const displayLocation = stored.displayName || stored.city
        setSelectedLocation(displayLocation)
        setLocationInputValue(displayLocation)
        setLocationDisplayName(displayLocation)
      }
    }

    window.addEventListener('userLocationChanged', handleLocationChanged)
    return () => window.removeEventListener('userLocationChanged', handleLocationChanged)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isLocationDropdownOpen && !event.target.closest('.relative')) {
        setIsLocationDropdownOpen(false)
      }
    }

    if (isLocationDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isLocationDropdownOpen])

  // Handle location input focus - clear text to allow typing
  const handleLocationInputFocus = () => {
    setLocationInputValue('')
    setIsLocationDropdownOpen(true)
    setLocationSuggestions([])
  }

  // Handle location input blur - restore saved location if nothing selected
  const handleLocationInputBlur = () => {
    // Small delay to allow suggestion click to register
    setTimeout(() => {
      if (isSelectingRef.current) {
        isSelectingRef.current = false
        return
      }
      if (!locationInputValue || locationInputValue.trim() === '') {
        const stored = loadUserLocation()
        if (stored?.city) {
          setLocationInputValue(stored.displayName || stored.city)
        } else {
          setLocationInputValue('Select location')
        }
      }
      setIsLocationDropdownOpen(false)
    }, 200)
  }

  // Handle location input change with debouncing
  const handleLocationInputChange = (value) => {
    setLocationInputValue(value)
    setIsLocationDropdownOpen(true)

    if (locationDebounceRef.current) {
      clearTimeout(locationDebounceRef.current)
    }

    const query = value.trim()
    if (query.length < 3) {
      setLocationSuggestions([])
      setIsLocationSearching(false)
      return
    }

    locationDebounceRef.current = setTimeout(async () => {
      try {
        setIsLocationSearching(true)
        const results = await searchAddressSuggestions(query, currentLanguage)
        setLocationSuggestions(results)
      } catch (error) {
        console.error('Header - Error fetching location suggestions:', error)
        setLocationSuggestions([])
      } finally {
        setIsLocationSearching(false)
      }
    }, 400)
  }

  // Handle location suggestion selection
  // Handle location suggestion selection
  // Handle location suggestion selection
  const handleLocationSuggestionSelect = async (suggestion) => {
    isSelectingRef.current = true
    setIsGettingDetails(true)

    // Optimistic update: Prefer full displayName (address) over city for input
    let displayText = suggestion.displayName || suggestion.city

    // Ensure we use the translated version if applicable (dropdown shows translated via TranslatedText)
    if (currentLanguage !== 'en') {
      try {
        const translated = await translate(displayText)
        if (translated) displayText = translated
      } catch (e) {
        // ignore error
      }
    }

    setSelectedLocation(displayText)
    setLocationInputValue(displayText)
    setIsLocationDropdownOpen(false)

    try {
      let locationObj = null

      // If we already have lat/lng (e.g. from browser geolocation history), use it
      if (suggestion.lat && suggestion.lng) {
        locationObj = suggestion
      } else if (suggestion.place_id) {
        // Fetch details from Google Places/Geocoding
        try {
          locationObj = await getPlaceDetails(suggestion.place_id, currentLanguage)
        } catch (e) {
          console.error('Header - getPlaceDetails failed', e)
          // Fallback
          locationObj = {
            city: suggestion.city,
            displayName: displayText,
            lat: 0,
            lng: 0
          }
        }
      }

      if (locationObj) {
        // Force display name to match what user selected/saw (suggestion description)
        // This prevents "reverting" to formatted_address or city which might be different
        if (displayText) {
          locationObj.displayName = displayText
        }

        saveUserLocation(locationObj)
        // Ensure we keep the full display name
        const fullLocationName = locationObj.displayName || locationObj.city || 'Select location'


        setLocationDisplayName(fullLocationName)
      }
    } catch (error) {
      console.error('Header - Error:', error)
    } finally {
      setIsGettingDetails(false)
      setLocationSuggestions([])
      setShowLocationPopup(true)

      // Trigger location changed event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('userLocationChanged'))
      }
    }
  }


  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)] py-1.5 z-[1000] w-full md:py-3">
        <div className="max-w-[1400px] mx-auto px-6 md:px-4 relative">
          <div className="flex justify-between items-center min-h-[44px] md:min-h-[50px]">
            {/* Left side - Logo Text (Desktop only) */}
            <div className="hidden md:flex items-center justify-start cursor-pointer transition-opacity hover:opacity-80 h-full" onClick={() => navigate('/')}>
              <span className="text-[clamp(20px,2.5vw,28px)] md:text-[clamp(24px,3vw,32px)] font-bold text-[#13335a]">Ourdeals</span>
            </div>



            {/* Mobile - Location Selector and Bell Icon */}
            <div className="flex md:hidden items-center justify-between w-full relative">
              {/* Location Selector */}
              <div
                className="flex items-center gap-1.5 w-[180px] mr-2 relative"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#E10129] flex-shrink-0">
                  <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor" />
                </svg>
                <input
                  type="text"
                  value={locationInputValue}
                  placeholder={t("Select location")}
                  onChange={(e) => handleLocationInputChange(e.target.value)}
                  onFocus={handleLocationInputFocus}
                  onBlur={handleLocationInputBlur}
                  className="text-sm text-gray-700 font-bold truncate overflow-hidden text-ellipsis whitespace-nowrap min-w-0 flex-1 bg-transparent border-none outline-none cursor-text p-0"
                />
                {/* Location suggestions dropdown */}
                {isLocationDropdownOpen && locationInputValue.trim().length >= 3 && (
                  <div className="absolute left-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.15)] max-h-[320px] overflow-y-auto z-[1100] w-[280px]">
                    <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
                        <TranslatedText>Nearby locations</TranslatedText>
                      </span>
                      {isLocationSearching && (
                        <span className="text-[11px] text-gray-400"><TranslatedText>Searching...</TranslatedText></span>
                      )}
                    </div>
                    {isLocationSearching ? (
                      <div className="px-3 py-4 text-center text-gray-500 text-sm"><TranslatedText>Searching...</TranslatedText></div>
                    ) : locationSuggestions.length > 0 ? (
                      locationSuggestions.map((s, index) => (
                        <button
                          key={`${s.place_id || index}`}
                          type="button"
                          className="w-full text-left px-3 py-2 flex gap-2 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0"
                          onMouseDown={(e) => {
                            e.preventDefault()
                            handleLocationSuggestionSelect(s)
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#E10129] flex-shrink-0 mt-0.5">
                            <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor" />
                          </svg>
                          <div className="flex-1 min-w-0">
                            <div className="text-[13px] font-medium text-gray-900 truncate">
                              <TranslatedText>{s.displayName}</TranslatedText>
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-4 text-center text-gray-500 text-sm"><TranslatedText>No results found</TranslatedText></div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Side Icons: Language + Notification */}
              <div className="flex items-center gap-2">
                <LanguageSelector />
                <button
                  className="p-2 bg-transparent border-none rounded-full cursor-pointer relative"
                  onClick={() => navigate('/notifications')}
                  title={t("Notifications")}
                >
                  <IoMdNotifications className="text-[#13335a] text-2xl" />
                </button>
              </div>
            </div>

            {/* Right side - Language Selector, Free Listing, Login, Desktop: Call Enquiry, More, Profile Icon */}
            {/* Desktop Actions - Language & Profile */}
            <div className="hidden md:flex items-center gap-4">
              {/* Navigation Links */}
              <a
                href="https://play.google.com/store/apps/details?id=com.appzeto.ourdealsvendor.app"
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center gap-1.5 no-underline hover:opacity-80 transition-opacity cursor-pointer"
              >
                <span className="absolute -top-4 left-2 bg-[#E10129] text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase whitespace-nowrap"><TranslatedText>BUSINESS</TranslatedText></span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500">
                  <path d="M3 3V21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7 16L12 11L16 15L21 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-gray-500 text-sm font-medium"><TranslatedText>Free Listing</TranslatedText></span>
              </a>

              <button
                className="bg-transparent text-gray-500 border-none py-2.5 px-4 rounded-lg font-medium text-sm cursor-pointer transition-colors hover:text-gray-700"
                onClick={() => navigate('/call-enquiry')}
              >
                <TranslatedText>Call Enquiry</TranslatedText>
              </button>

              <button
                className="bg-transparent text-gray-500 border-none py-2.5 px-4 rounded-lg font-medium text-sm cursor-pointer transition-colors hover:text-gray-700"
                onClick={() => navigate('/more')}
              >
                <TranslatedText>More</TranslatedText>
              </button>

              {/* Language Selector */}
              <LanguageSelector />

              {/* User Profile/Login */}
              {userData || localStorage.getItem('auth_token') ? (
                <div className="flex items-center gap-2">
                  <button
                    className="p-2 bg-transparent border-none rounded-full cursor-pointer relative"
                    title={t("Notifications")}
                    type="button"
                    onClick={() => navigate('/notifications')}
                  >
                    <IoMdNotifications className="text-[#13335a] text-2xl" />
                  </button>
                  <button
                    className="bg-gray-200 border-none p-2 cursor-pointer transition-colors hover:bg-gray-300 rounded-full"
                    onClick={() => setIsProfileOpen(true)}
                    title={t("Profile")}
                  >
                    <IoMdPerson className="text-[#13335a] text-2xl" />
                  </button>
                </div>
              ) : (
                <button
                  className="bg-[#13335a] text-white border-none py-2 px-4 rounded-lg font-medium text-sm cursor-pointer transition-colors hover:bg-[#1e4a7a] whitespace-nowrap"
                  onClick={() => navigate('/login')}
                >
                  <TranslatedText>Login / Sign Up</TranslatedText>
                </button>
              )}
            </div>
          </div>

        </div>
      </header>

      {/* Profile Sidebar Drawer (Desktop) */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-[2000]">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={() => setIsProfileOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute top-0 right-0 bottom-0 w-full max-w-[550px] bg-white shadow-2xl transform transition-transform animate-[slideInRight_0.3s_ease-out]">
            <ProfilePage isDrawer={true} onClose={() => setIsProfileOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}

export default Header
