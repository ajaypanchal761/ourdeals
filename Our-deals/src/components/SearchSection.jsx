import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaSearch, FaMicrophone } from 'react-icons/fa'
import DownloadApp from './DownloadApp'
import TranslatedText from './TranslatedText'
import { useTranslation } from '../hooks/useTranslation'
import { useDynamicTranslation } from '../hooks/useDynamicTranslation'
import {
  loadUserLocation,
  saveUserLocation,
  searchAddressSuggestions,
  getPlaceDetails,
} from '../services/locationService'
import { searchSubcategories } from '../services/searchService'

function SearchSection() {
  const navigate = useNavigate()
  const { t, currentLanguage, translate } = useTranslation() // Destructure translate
  const { translateObject } = useDynamicTranslation()
  const [location, setLocation] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0)
  const [currentSearchText, setCurrentSearchText] = useState(0)
  const [isTextAnimating, setIsTextAnimating] = useState(false)
  const searchInputRef = useRef(null)
  const dropdownRef = useRef(null)
  const [locationSuggestions, setLocationSuggestions] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const searchDebounceRef = useRef(null)
  const [isLocationSearching, setIsLocationSearching] = useState(false)
  const [isLocationFocused, setIsLocationFocused] = useState(false)
  const locationDebounceRef = useRef(null)
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef(null)

  // Translate location input when language changes
  useEffect(() => {
    if (currentLanguage !== 'en' && location) {
      translate(location).then(translated => {
        if (translated) setLocation(translated)
      })
    }
  }, [currentLanguage, translate, location])

  const searchTexts = [
    { number: "'4.9 lakh+'", text: "Businesses" },
    { number: "'5.9 lakh+'", text: "Products & Services" }
  ]

  const placeholderOptions = ['Spa & Salons', 'Doctor', 'Restaurants', 'Hotels', 'Beauty Spa', 'Home Decor']

  const recentSearches = [
    { text: 'Lunch Foodie', type: 'Category' },
    { text: 'Parlour For Ladies', type: 'Category' }
  ]

  const trendingSearches = [
    'Real Estate Agents',
    'Banquet Halls',
    'Dentists',
    'Car Rental',
    'Gynaecologist & Obstetrician Doctors',
    'Estate Agents For Residential Rental'
  ]

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setIsSearchFocused(false)
      }
    }

    if (isSearchFocused) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isSearchFocused])

  useEffect(() => {
    if (!searchQuery && !isSearchFocused) {
      const interval = setInterval(() => {
        setCurrentPlaceholder((prev) => (prev + 1) % placeholderOptions.length)
      }, 3000) // Change every 3 seconds

      return () => clearInterval(interval)
    }
  }, [searchQuery, isSearchFocused, placeholderOptions.length])

  useEffect(() => {
    const interval = setInterval(() => {
      // Slide out (move up and fade)
      setIsTextAnimating(true)

      // After slide out completes, change text and slide in
      setTimeout(() => {
        setCurrentSearchText((prev) => (prev + 1) % searchTexts.length)
        // Small delay before slide in
        setTimeout(() => {
          setIsTextAnimating(false)
        }, 50)
      }, 400) // Animation duration
    }, 6000) // Change every 6 seconds

    return () => clearInterval(interval)
  }, [searchTexts.length])

  // Cleanup speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null
        recognitionRef.current.onend = null
        recognitionRef.current.onerror = null
        recognitionRef.current.stop()
      }
    }
  }, [])

  // Initialize location from stored userLocation
  useEffect(() => {
    const updateLocation = () => {
      const stored = loadUserLocation()
      if (stored?.city) {
        // Use displayName (full address) if available, just like Header
        setLocation(stored.displayName || stored.city)
      }
    }

    // Initial load
    updateLocation()

    // Listen for changes
    window.addEventListener('userLocationChanged', updateLocation)
    return () => window.removeEventListener('userLocationChanged', updateLocation)
  }, [])

  const handleLocationChange = (value) => {
    setLocation(value)
    setIsLocationFocused(true)

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
        console.error('SearchSection - Error fetching location suggestions:', error)
        setLocationSuggestions([])
      } finally {
        setIsLocationSearching(false)
      }
    }, 400)
  }

  const handleLocationSuggestionSelect = async (suggestion) => {
    // 1. Optimistic update: Set text immediately to full name
    let displayText = suggestion.displayName || suggestion.city

    // Ensure we use the translated version if applicable
    if (currentLanguage !== 'en') {
      try {
        const translated = await translate(displayText)
        if (translated) displayText = translated
      } catch (e) {
        // ignore
      }
    }

    setLocation(displayText)
    setIsLocationFocused(false)

    let locationObj = null

    // Check if lat/lng already present (e.g. historical data or browser location)
    if (suggestion.lat && suggestion.lng) {
      locationObj = suggestion
    } else if (suggestion.place_id) {
      // Fetch details from Google Places
      try {
        locationObj = await getPlaceDetails(suggestion.place_id, currentLanguage)
      } catch (error) {
        console.error('SearchSection - Error fetching place details:', error)
        // Ensure we still save the text even if details fetch fails
        locationObj = {
          city: suggestion.city,
          displayName: displayText,
          lat: 0,
          lng: 0
        }
      }
    }

    if (locationObj) {
      saveUserLocation(locationObj)
      // If we got a better display name from details, update it
      // Use displayName to show full location as requested
      const fullLocationName = locationObj.displayName || locationObj.city || displayText
      if (fullLocationName && fullLocationName !== displayText) {
        setLocation(fullLocationName)
      }
    }

    setLocationSuggestions([])
  }

  const handleSearchClick = (text) => {
    setSearchQuery(text)
    setIsSearchFocused(false)
    if (text) {
      navigate(`/vendors/${encodeURIComponent(text)}`)
    }
  }

  // Call search API when user types in search box
  useEffect(() => {
    const query = searchQuery.trim()

    if (!query || query.length < 2) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current)
    }

    searchDebounceRef.current = setTimeout(async () => {
      try {
        setIsSearching(true)
        const response = await searchSubcategories(query)
        const isOk = response?.success === true || response?.status === true
        const results = Array.isArray(response?.data) ? response.data : []
        setSearchResults(isOk ? results : [])
      } catch (error) {
        console.error('SearchSection - Error fetching search results:', error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }, 400)

    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current)
      }
    }
  }, [searchQuery])

  const clearRecentSearches = () => {
    // Handle clear recent searches
  }

  const handleVoiceSearch = () => {
    const SpeechRecognition =
      typeof window !== 'undefined' &&
      (window.SpeechRecognition || window.webkitSpeechRecognition)

    if (!SpeechRecognition) {
      alert(t('Voice search is not supported in this browser.'))
      return
    }

    // Explicit user consent before starting mic (UX prompt)
    if (!isListening) {
      const ok = window.confirm(
        t('Allow voice search to use your microphone to fill the search box?')
      )
      if (!ok) {
        return
      }
    }

    // Stop if already listening
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop()
      return
    }

    const recognition =
      recognitionRef.current || new SpeechRecognition()

    recognition.lang = 'en-IN'
    recognition.interimResults = true
    recognition.maxAlternatives = 1

    recognition.onresult = (event) => {
      let transcript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      const cleaned = transcript.trim()
      setSearchQuery(cleaned)
      setIsSearchFocused(true)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.onerror = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition
    setIsListening(true)
    recognition.start()
  }

  return (
    <div className="relative bg-transparent px-[clamp(12px,3vw,16px)] pt-0 mt-0 mb-0 md:mb-[clamp(16px,3vw,24px)] md:px-[clamp(12px,2vw,16px)] md:pt-[clamp(12px,2vw,20px)] md:mt-0">
      <div className="relative w-full m-0">
        {/* Search Text Above Search Bar */}
        <div className="mb-[clamp(10px,2.5vw,14px)] md:mb-[clamp(12px,2.5vw,16px)]">
          <div className="w-full h-px bg-gray-200 mb-[clamp(6px,1.5vw,10px)]"></div>
          <p className="text-[clamp(11px,2.8vw,14px)] md:text-[clamp(13px,2.5vw,16px)] font-bold leading-tight flex items-baseline flex-wrap">
            <span className="text-black"><TranslatedText>Search across</TranslatedText></span>
            <span
              className="inline-block relative overflow-hidden align-baseline ml-2"
              style={{
                transform: isTextAnimating
                  ? 'translate3d(0px, -8px, 0px)'
                  : 'translate3d(0px, 0px, 0px)',
                transition: 'transform 0.4s ease-in-out, opacity 0.4s ease-in-out',
                opacity: isTextAnimating ? 0 : 1
              }}
            >
              <span className="text-[#4A90E2]">
                <TranslatedText>{searchTexts[currentSearchText].number}</TranslatedText>{' '}
                <span className="text-[#4A90E2]"><TranslatedText>{searchTexts[currentSearchText].text}</TranslatedText></span>
              </span>
            </span>
          </p>
        </div>
        <div className="flex gap-[clamp(12px,3vw,16px)] md:flex-row md:gap-[clamp(16px,3vw,24px)] relative items-start">
          <div className="flex-1 max-w-[800px]">
            <div className="flex gap-[clamp(12px,3vw,16px)] md:flex-row md:gap-[clamp(16px,3vw,24px)] relative">
              {/* Location search (desktop visible, but results panel is global) */}
              <div className="hidden md:flex flex-row items-center bg-[#F7F8FC] border-2 border-gray-200 rounded-lg py-[clamp(9px,2.2vw,11px)] px-[clamp(10px,2.5vw,14px)] flex-[0_0_auto] max-w-[clamp(140px,18vw,190px)] min-w-[clamp(120px,16vw,170px)] whitespace-nowrap overflow-hidden relative">
                <span className="mr-2 inline-flex items-center justify-center text-[#E10129] flex-shrink-0 align-middle">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="block w-[clamp(16px,4vw,18px)] h-[clamp(16px,4vw,18px)]">
                    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor" />
                  </svg>
                </span>
                <input
                  type="text"
                  className="bg-transparent border-none outline-none flex-1 text-black text-[clamp(13px,3.2vw,15px)] text-left min-w-0 whitespace-nowrap overflow-hidden text-ellipsis placeholder:text-[#6B6D70]"
                  value={location}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  onMouseDown={() => {
                    // Har click par, agar koi purana location text hai to clear kar do
                    if (location) {
                      setLocation('')
                      setLocationSuggestions([])
                    }
                  }}
                  onFocus={() => {
                    // Focus par sirf suggestion panel open rakho
                    setIsLocationFocused(true)
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      setIsLocationFocused(false)
                    }, 150)
                  }}
                  placeholder=""
                />
              </div>
              <div className="flex items-center bg-[#F7F8FC] border-2 md:border border-gray-200 rounded-lg py-[clamp(10px,2.5vw,12px)] px-[clamp(10px,2.5vw,12px)] md:py-[clamp(10px,2.5vw,14px)] md:px-[clamp(10px,2.5vw,14px)] flex-1 max-w-[600px] relative z-[100] gap-0 md:gap-[clamp(5px,1.2vw,7px)]" ref={dropdownRef}>
                <FaSearch className="flex items-center justify-center text-[#11345A] flex-shrink-0 w-[clamp(14px,3.5vw,16px)] h-[clamp(14px,3.5vw,16px)] mr-[clamp(6px,1.5vw,8px)] md:w-[clamp(16px,4vw,18px)] md:h-[clamp(16px,4vw,18px)] md:mr-[clamp(6px,1.5vw,8px)]" />
                <div className="relative flex-1 flex items-center md:mr-0 md:pr-0">
                  {!searchQuery && (
                    <span className="absolute left-0 pointer-events-none text-[clamp(12px,3vw,13px)] md:text-[clamp(13px,3.2vw,15px)] whitespace-nowrap">
                      <span className="text-[#494B4E]"><TranslatedText>Search for</TranslatedText> </span>
                      <span className="text-[#B0B2B5]"><TranslatedText>{placeholderOptions[currentPlaceholder]}</TranslatedText></span>
                    </span>
                  )}
                  <input
                    ref={searchInputRef}
                    type="text"
                    className="bg-transparent border-none outline-none flex-1 text-black text-[clamp(12px,3vw,13px)] md:text-[clamp(13px,3.2vw,15px)] p-0 w-full placeholder:text-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    placeholder=""
                  />
                </div>
                <div className="w-px h-[clamp(16px,4vw,20px)] bg-gray-200 flex-shrink-0 m-0"></div>
                <button
                  className="static bg-none border-none cursor-pointer p-0 m-0 flex items-center justify-center text-[#11345A] transition-colors flex-shrink-0 hover:text-[#13335a]"
                  aria-label="Voice search"
                  type="button"
                  onClick={handleVoiceSearch}
                >
                  <FaMicrophone
                    className={`w-[clamp(16px,4vw,18px)] h-[clamp(16px,4vw,18px)] ${isListening ? 'text-red-500' : ''
                      }`}
                  />
                </button>
                {isSearchFocused && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.15)] mt-1 max-h-[500px] overflow-y-auto z-[1000]">
                    {searchQuery.trim().length >= 2 ? (
                      <div className="p-[clamp(12px,3vw,16px)]">
                        <div className="flex justify-between items-center mb-[clamp(10px,2.5vw,12px)]">
                          <span className="text-[clamp(10px,2.5vw,11px)] font-bold text-gray-500 uppercase tracking-wider">
                            <TranslatedText>Search Results</TranslatedText>
                          </span>
                          {isSearching && (
                            <span className="text-[10px] text-gray-400"><TranslatedText>Searching...</TranslatedText></span>
                          )}
                        </div>
                        {!isSearching && searchResults.length === 0 && (
                          <p className="text-[12px] text-gray-500 m-0">
                            <TranslatedText>No results found for</TranslatedText> &quot;{searchQuery}&quot;
                          </p>
                        )}
                        <div className="flex flex-col gap-1">
                          {searchResults.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              className="flex items-center gap-[clamp(10px,2.5vw,12px)] p-[clamp(8px,2vw,10px)_clamp(10px,2.5vw,12px)] w-full text-left rounded-md cursor-pointer transition-colors hover:bg-gray-50"
                              onClick={() => {
                                if (item.name) {
                                  navigate(`/vendors/${encodeURIComponent(item.name)}`)
                                  setIsSearchFocused(false)
                                }
                              }}
                            >
                              <FaSearch className="text-gray-500 flex-shrink-0 w-[clamp(12px,3vw,14px)] h-[clamp(12px,3vw,14px)]" />
                              <div className="flex flex-col flex-1 min-w-0">
                                <span className="text-[12px] font-medium text-[#1a1a1a] truncate">
                                  <TranslatedText>{item.name}</TranslatedText>
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="p-[clamp(12px,3vw,16px)] border-b border-gray-100">
                          <div className="flex justify-between items-center mb-[clamp(10px,2.5vw,12px)]">
                            <span className="text-[clamp(10px,2.5vw,11px)] font-bold text-gray-500 uppercase tracking-wider">
                              <TranslatedText>RECENT SEARCHES</TranslatedText>
                            </span>
                            <button
                              className="bg-none border-none text-[#13335a] text-[clamp(10px,2.5vw,11px)] font-semibold cursor-pointer p-0 transition-colors hover:text-[#0f2440]"
                              onClick={clearRecentSearches}
                            >
                              <TranslatedText>Clear All</TranslatedText>
                            </button>
                          </div>
                          <div className="flex flex-col gap-1">
                            {recentSearches.map((search, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-[clamp(10px,2.5vw,12px)] p-[clamp(8px,2vw,10px)_clamp(10px,2.5vw,12px)] rounded-md cursor-pointer transition-colors hover:bg-gray-50"
                                onClick={() => handleSearchClick(search.text)}
                              >
                                <FaSearch className="text-gray-500 flex-shrink-0 w-[clamp(12px,3vw,14px)] h-[clamp(12px,3vw,14px)]" />
                                <div className="flex flex-col flex-1">
                                  <span className="text-[clamp(12px,3vw,13px)] font-medium text-[#1a1a1a] mb-0.5">
                                    <TranslatedText>{search.text}</TranslatedText>
                                  </span>
                                  <span className="text-[clamp(10px,2.5vw,11px)] text-gray-400">
                                    <TranslatedText>{search.type}</TranslatedText>
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="p-[clamp(12px,3vw,16px)]">
                          <div className="flex justify-between items-center mb-[clamp(10px,2.5vw,12px)]">
                            <span className="text-[clamp(10px,2.5vw,11px)] font-bold text-gray-500 uppercase tracking-wider">
                              <TranslatedText>TRENDING SEARCHES</TranslatedText>
                            </span>
                          </div>
                          <div className="flex flex-col gap-1">
                            {trendingSearches.map((search, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-[clamp(10px,2.5vw,12px)] p-[clamp(8px,2vw,10px)_clamp(10px,2.5vw,12px)] rounded-md cursor-pointer transition-colors hover:bg-gray-50"
                                onClick={() => handleSearchClick(search)}
                              >
                                <div className="w-[clamp(20px,5vw,24px)] h-[clamp(20px,5vw,24px)] bg-gray-200 rounded flex items-center justify-center flex-shrink-0 text-gray-500">
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-[clamp(12px,3vw,14px)] h-[clamp(12px,3vw,14px)]"
                                  >
                                    <path
                                      d="M7 17L17 7M17 7H7M17 7V17"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </div>
                                <div className="flex flex-col flex-1">
                                  <span className="text-[clamp(12px,3vw,13px)] font-medium text-[#1a1a1a] mb-0.5">
                                    <TranslatedText>{search}</TranslatedText>
                                  </span>
                                  <span className="text-[clamp(10px,2.5vw,11px)] text-gray-400">
                                    <TranslatedText>Category</TranslatedText>
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Download App Button - Right Side (Desktop Only) */}
          <div className="hidden md:flex items-start pt-2 ml-auto">
            <DownloadApp isMobile={false} />
          </div>
        </div>
        {/* Download App Button - Below Search Bar, Right Side (Desktop Only) - Mobile removed, using above */}
      </div>

      {/* Global location suggestions panel (overlay, content ko neeche push nahi kare) */}
      {isLocationFocused && (locationSuggestions.length > 0 || isLocationSearching) && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.15)] max-h-[320px] overflow-y-auto z-[900] w-full max-w-[420px] mx-auto md:ml-0">
          <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
              <TranslatedText>Nearby locations</TranslatedText>
            </span>
            {isLocationSearching && (
              <span className="text-[11px] text-gray-400"><TranslatedText>Searching...</TranslatedText></span>
            )}
          </div>
          {!isLocationSearching &&
            locationSuggestions.map((s, index) => (
              <button
                key={`${s.lat}-${s.lng}-${index}`}
                type="button"
                className="w-full text-left px-3 py-2 flex gap-2 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0"
                onMouseDown={(e) => {
                  // MouseDown use kar rahe hain taaki blur se pehle hi value set ho jaaye
                  e.preventDefault()
                  handleLocationSuggestionSelect(s)
                }}
              >
                <div className="mt-0.5">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-[#E10129]"
                  >
                    <path
                      d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 truncate">
                    <TranslatedText>{s.city}</TranslatedText>
                  </div>
                  <div className="text-[11px] text-gray-500 line-clamp-2">
                    <TranslatedText>{s.displayName}</TranslatedText>
                  </div>
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  )
}

export default SearchSection
