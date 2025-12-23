import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchPages } from '../services/pagesService'
import { userLogout } from '../services/authService'
import TranslatedText from '../components/TranslatedText'
import { useTranslation } from '../hooks/useTranslation'

import { useDynamicTranslation } from '../hooks/useDynamicTranslation'

function ProfilePage({ isDrawer = false, onClose = () => { } }) {
  const navigate = useNavigate()
  const { setLanguage, currentLanguageCode, currentLanguage } = useTranslation() // Ensure currentLanguage is available
  const { translateObject } = useDynamicTranslation()
  const [userData, setUserData] = useState(null)
  const [translatedUserData, setTranslatedUserData] = useState(null)
  const [pages, setPages] = useState([])
  const [loadingPages, setLoadingPages] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Load user data from localStorage
  useEffect(() => {
    const loadUserData = () => {
      const savedUser = localStorage.getItem('userData')
      if (savedUser) {
        try {
          const parsedData = JSON.parse(savedUser)
          setUserData(parsedData)
        } catch (error) {
          console.error('Error parsing user data:', error)
          setUserData(null)
        }
      } else {
        setUserData(null)
      }
    }

    loadUserData()

    // Listen for login events to update user data
    const handleLoginEvent = () => {
      loadUserData()
    }

    window.addEventListener('userLogin', handleLoginEvent)
    return () => window.removeEventListener('userLogin', handleLoginEvent)
  }, [])

  // Translate user data
  useEffect(() => {
    if (currentLanguage === 'en' || !userData) {
      setTranslatedUserData(null)
      return
    }

    let isMounted = true
    const timeoutId = setTimeout(async () => {
      try {
        // Translate name, city, address
        const translated = await translateObject(userData, ['name', 'city', 'address'])
        if (isMounted) {
          setTranslatedUserData(translated)
        }
      } catch (error) {
        console.error('Error translating user data:', error)
      }
    }, 100)

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
    }
  }, [userData, currentLanguage, translateObject])

  // Fetch pages from API
  useEffect(() => {
    const loadPages = async () => {
      setLoadingPages(true)
      try {
        const response = await fetchPages()
        if (response?.success === true && Array.isArray(response?.data)) {
          setPages(response.data.filter(page => page.status === 'Active'))
        }
      } catch (error) {
        console.error('Error fetching pages:', error)
      } finally {
        setLoadingPages(false)
      }
    }
    loadPages()
  }, [])

  const handlePageClick = (page) => {
    // If drawer, maybe close drawer or navigate?
    navigate(`/page/${page.id}`)
    if (isDrawer) onClose()
  }

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true)
  }

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true)
    try {
      // Call logout API
      await userLogout()
      // userLogout already clears localStorage and dispatches event
      setUserData(null)
      setShowLogoutConfirm(false)
      if (isDrawer) onClose()
      else navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
      // Even if API fails, clear local data and logout
      setUserData(null)
      localStorage.removeItem('auth_token')
      localStorage.removeItem('userData')
      window.dispatchEvent(new CustomEvent('userLogin'))
      setShowLogoutConfirm(false)
      if (isDrawer) onClose()
      else navigate('/')
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false)
  }

  // Edit is now a separate page, so no modal/update handlers needed here

  // Agar user data nahi hai, tab bhi /profile route pe ek proper page dikhao
  // jahan se user login ya sign up kar sake.
  if (!userData) {
    return (
      <div className={`${isDrawer ? 'h-full flex flex-col' : 'min-h-screen'} bg-gradient-to-br from-[#13335a] to-[#1e4a7a] flex items-center justify-center p-4`}>
        <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-2xl p-6 md:p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-black text-[#13335a] mb-2">Ourdeals</h1>
          </div>

          <p className="text-gray-600 mb-6 text-center">
            <TranslatedText>Please log in to view your profile details.</TranslatedText>
          </p>

          <button
            className="w-full bg-[#13335a] text-white py-3 rounded-lg font-semibold hover:bg-[#1e4a7a] transition-colors"
            onClick={() => {
              navigate('/login')
              if (isDrawer) onClose()
            }}
          >
            <TranslatedText>Login / Sign Up</TranslatedText>
          </button>
        </div>
      </div>
    )
  }

  const displayUser = (currentLanguage !== 'en' && translatedUserData) ? translatedUserData : userData

  return (
    <div className={`${isDrawer
      ? 'h-full w-full bg-white flex flex-col overflow-hidden'
      : 'min-h-screen bg-white flex flex-col max-w-[500px] mx-auto shadow-[0_0_20px_rgba(0,0,0,0.1)] md:max-w-full md:h-screen md:max-h-screen md:overflow-hidden'
      }`}>
      {/* Header */}
      <div className={`bg-gradient-to-br from-[#13335a] to-[#1e4a7a] px-[clamp(16px,2vw,24px)] py-[clamp(16px,2vw,20px)] flex justify-between items-center z-[1000] flex-shrink-0 w-full shadow-[0_2px_8px_rgba(0,0,0,0.1)] ${isDrawer ? 'sticky top-0' : 'fixed top-0 left-0 right-0 max-w-[500px] md:max-w-full mx-auto'}`}>
        <h2 className="text-[clamp(18px,2.5vw,24px)] font-bold text-white m-0"><TranslatedText>Profile</TranslatedText></h2>
        <button
          className="bg-transparent border-none text-[clamp(24px,3.5vw,32px)] text-white cursor-pointer leading-none p-0 w-[clamp(28px,3.5vw,32px)] h-[clamp(28px,3.5vw,32px)] flex items-center justify-center rounded-full transition-colors hover:bg-white/20"
          onClick={() => isDrawer ? onClose() : navigate('/')}
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div className={`px-[clamp(16px,2vw,24px)] py-[clamp(16px,2vw,24px)] pb-[72px] flex-1 overflow-y-auto overflow-x-hidden [-webkit-overflow-scrolling:touch] min-h-0 md:flex-1 md:overflow-y-auto md:overflow-x-hidden md:min-h-0 md:pb-20 ${isDrawer ? '' : 'pt-[calc(clamp(16px,2vw,20px)*2+clamp(18px,2.5vw,24px)+clamp(16px,2vw,24px))] md:pt-[calc(clamp(16px,2vw,20px)*2+clamp(18px,2.5vw,24px)+clamp(16px,2vw,24px))]'}`}>
        {/* User Profile Section */}
        <div className="mb-[clamp(16px,2vw,24px)]">
          <div className="flex items-center gap-[clamp(12px,1.5vw,16px)] mb-[clamp(12px,1.5vw,16px)] relative">
            <div className="w-[clamp(60px,8vw,80px)] h-[clamp(60px,8vw,80px)] rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
              <span className="text-[clamp(24px,4vw,36px)] font-extrabold text-gray-500">
                {userData?.name ? userData.name.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-[clamp(18px,2.5vw,24px)] font-bold text-[#1a1a1a] m-0 mb-[clamp(3px,0.4vw,4px)] leading-[1.3]">
                <TranslatedText>{displayUser?.name || 'User'}</TranslatedText>
              </h3>
              {displayUser?.phone || displayUser?.mobile || displayUser?.mobileNumber ? (
                <p className="text-[clamp(13px,1.6vw,16px)] font-bold text-gray-500 m-0 leading-[1.4]">
                  +91 {displayUser?.phone || displayUser?.mobile || displayUser?.mobileNumber}
                </p>
              ) : null}
            </div>
            <button
              className="bg-transparent border-none cursor-pointer p-[clamp(6px,0.8vw,8px)] text-gray-500 transition-colors hover:text-[#13335a]"
              onClick={() => navigate('/profile/edit')}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.5 2.50023C18.8978 2.10243 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.10243 21.5 2.50023C21.8978 2.89804 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.10243 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* User Details Section */}
          <div className="bg-gray-50 rounded-[clamp(8px,1vw,12px)] p-[clamp(12px,1.5vw,16px)] space-y-[clamp(10px,1.2vw,12px)]">
            {/* Email */}
            {displayUser?.email && (
              <div className="flex items-start gap-[clamp(10px,1.2vw,12px)]">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-gray-500 flex-shrink-0 w-[clamp(18px,2.2vw,20px)] h-[clamp(18px,2.2vw,20px)] mt-0.5"
                >
                  <path
                    d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 6L12 13L2 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex-1">
                  <p className="text-[clamp(11px,1.3vw,13px)] font-medium text-gray-400 m-0 mb-[clamp(2px,0.3vw,4px)]">
                    <TranslatedText>Email</TranslatedText>
                  </p>
                  <p className="text-[clamp(13px,1.6vw,16px)] font-semibold text-gray-700 m-0 leading-[1.4]">
                    <TranslatedText>{displayUser.email}</TranslatedText>
                  </p>
                </div>
              </div>
            )}

            {/* City */}
            {displayUser?.city && (
              <div className="flex items-start gap-[clamp(10px,1.2vw,12px)]">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-gray-500 flex-shrink-0 w-[clamp(18px,2.2vw,20px)] h-[clamp(18px,2.2vw,20px)] mt-0.5"
                >
                  <path
                    d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"
                    fill="currentColor"
                  />
                </svg>
                <div className="flex-1">
                  <p className="text-[clamp(11px,1.3vw,13px)] font-medium text-gray-400 m-0 mb-[clamp(2px,0.3vw,4px)]">
                    <TranslatedText>City</TranslatedText>
                  </p>
                  <p className="text-[clamp(13px,1.6vw,16px)] font-semibold text-gray-700 m-0 leading-[1.4]">
                    <TranslatedText>{displayUser.city}</TranslatedText>
                  </p>
                </div>
              </div>
            )}

            {/* Address */}
            {displayUser?.address && (
              <div className="flex items-start gap-[clamp(10px,1.2vw,12px)]">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-gray-500 flex-shrink-0 w-[clamp(18px,2.2vw,20px)] h-[clamp(18px,2.2vw,20px)] mt-0.5"
                >
                  <path
                    d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 22V12H15V22"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex-1">
                  <p className="text-[clamp(11px,1.3vw,13px)] font-medium text-gray-400 m-0 mb-[clamp(2px,0.3vw,4px)]">
                    <TranslatedText>Address</TranslatedText>
                  </p>
                  <p className="text-[clamp(13px,1.6vw,16px)] font-semibold text-gray-700 m-0 leading-[1.4]">
                    <TranslatedText>{displayUser.address}</TranslatedText>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-[clamp(8px,1.2vw,12px)] mb-[clamp(16px,2vw,24px)]">
          <button
            className="flex-1 flex items-center justify-center gap-[clamp(6px,0.8vw,8px)] py-[clamp(10px,1.2vw,12px)] px-[clamp(12px,1.5vw,16px)] border border-gray-200 rounded-[clamp(6px,0.8vw,8px)] bg-white text-gray-700 text-[clamp(12px,1.4vw,14px)] font-medium cursor-pointer transition-all hover:border-[#13335a] hover:text-[#13335a] hover:bg-gray-50"
            onClick={() => navigate('/contact-us')}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-[clamp(16px,2vw,20px)] h-[clamp(16px,2vw,20px)]"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
                fill="currentColor"
              />
            </svg>
            <span><TranslatedText>Help</TranslatedText></span>
          </button>
        </div>

        {/* Add Your Business */}
        <a
          href="https://play.google.com/store/apps/details?id=com.appzeto.ourdealsvendor.app"
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-between items-center py-[clamp(12px,1.5vw,16px)] px-[clamp(12px,1.5vw,16px)] bg-gray-50 rounded-[clamp(6px,0.8vw,8px)] mb-[clamp(16px,2vw,24px)] cursor-pointer transition-colors hover:bg-gray-100 no-underline"
        >
          <span className="text-[clamp(13px,1.6vw,16px)] font-medium text-gray-700 leading-[1.4]">
            <TranslatedText>Add Your Business</TranslatedText>
          </span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-500 w-[clamp(16px,2vw,20px)] h-[clamp(16px,2vw,20px)]"
          >
            <path
              d="M9 18L15 12L9 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>

        {/* App and User Setting */}
        <div className="mb-[clamp(16px,2vw,24px)]">
          <h4 className="text-[clamp(11px,1.3vw,14px)] font-bold text-gray-400 m-0 mb-[clamp(8px,1vw,12px)] uppercase tracking-[0.5px] leading-[1.4]">
            <TranslatedText>App and User Setting</TranslatedText>
          </h4>
          <div className="flex flex-wrap gap-[clamp(8px,1.2vw,12px)]">
            <button
              className={`flex-1 min-w-[100px] py-[clamp(10px,1.2vw,12px)] px-[clamp(12px,1.5vw,16px)] border rounded-[clamp(6px,0.8vw,8px)] bg-white text-gray-700 text-[clamp(12px,1.4vw,14px)] font-medium cursor-pointer transition-all leading-[1.4] ${currentLanguageCode === 'EN'
                ? 'border-[#13335a] bg-[#e8f0f7] text-[#13335a]'
                : 'border-gray-200 hover:border-[#13335a]'
                }`}
              onClick={() => setLanguage('EN')}
            >
              English
            </button>
            <button
              className={`flex-1 min-w-[100px] py-[clamp(10px,1.2vw,12px)] px-[clamp(12px,1.5vw,16px)] border rounded-[clamp(6px,0.8vw,8px)] bg-white text-gray-700 text-[clamp(12px,1.4vw,14px)] font-medium cursor-pointer transition-all leading-[1.4] ${currentLanguageCode === 'HI'
                ? 'border-[#13335a] bg-[#e8f0f7] text-[#13335a]'
                : 'border-gray-200 hover:border-[#13335a]'
                }`}
              onClick={() => setLanguage('HI')}
            >
              हिंदी
            </button>
            <button
              className={`flex-1 min-w-[100px] py-[clamp(10px,1.2vw,12px)] px-[clamp(12px,1.5vw,16px)] border rounded-[clamp(6px,0.8vw,8px)] bg-white text-gray-700 text-[clamp(12px,1.4vw,14px)] font-medium cursor-pointer transition-all leading-[1.4] ${currentLanguageCode === 'MR'
                ? 'border-[#13335a] bg-[#e8f0f7] text-[#13335a]'
                : 'border-gray-200 hover:border-[#13335a]'
                }`}
              onClick={() => setLanguage('MR')}
            >
              मराठी
            </button>
          </div>
        </div>

        {/* More Section */}
        <div className="mb-[clamp(16px,2vw,24px)]">
          <h4 className="text-[clamp(11px,1.3vw,14px)] font-bold text-gray-400 m-0 mb-[clamp(8px,1vw,12px)] uppercase tracking-[0.5px] leading-[1.4]">
            <TranslatedText>More</TranslatedText>
          </h4>
          <div className="flex flex-col gap-0">
            {loadingPages ? (
              <div className="py-[clamp(12px,1.5vw,16px)] text-center text-gray-500 text-sm"><TranslatedText>Loading pages...</TranslatedText></div>
            ) : pages.length > 0 ? (
              pages.map((page, index) => (
                <div
                  key={page.id}
                  className="flex items-center gap-[clamp(10px,1.2vw,12px)] py-[clamp(12px,1.5vw,16px)] border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 hover:-mx-[clamp(16px,2vw,24px)] hover:px-[clamp(16px,2vw,24px)]"
                  onClick={() => handlePageClick(page)}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-gray-700 flex-shrink-0 w-[clamp(18px,2.2vw,24px)] h-[clamp(18px,2.2vw,24px)]"
                  >
                    <path
                      d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14 2V8H20"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="flex-1 text-[clamp(13px,1.6vw,16px)] font-bold text-gray-700 leading-[1.4]">
                    <TranslatedText>{page.title}</TranslatedText>
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-gray-400 flex-shrink-0 w-[clamp(16px,2vw,20px)] h-[clamp(16px,2vw,20px)]"
                  >
                    <path
                      d="M9 18L15 12L9 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              ))
            ) : (
              <div className="py-[clamp(12px,1.5vw,16px)] text-center text-gray-500 text-sm"><TranslatedText>No pages available</TranslatedText></div>
            )}

            <div
              className="flex items-center gap-[clamp(10px,1.2vw,12px)] py-[clamp(12px,1.5vw,16px)] cursor-pointer transition-colors hover:bg-gray-50 hover:-mx-[clamp(16px,2vw,24px)] hover:px-[clamp(16px,2vw,24px)]"
              onClick={handleLogoutClick}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-700 flex-shrink-0 w-[clamp(18px,2.2vw,24px)] h-[clamp(18px,2.2vw,24px)]"
              >
                <path
                  d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 17L21 12L16 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 12H9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="flex-1 text-[clamp(13px,1.6vw,16px)] font-bold text-gray-700 leading-[1.4]">
                <TranslatedText>Logout</TranslatedText>
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-400 flex-shrink-0 w-[clamp(16px,2vw,20px)] h-[clamp(16px,2vw,20px)]"
              >
                <path
                  d="M9 18L15 12L9 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-4"
          onClick={handleLogoutCancel}
        >
          <div
            className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-[fadeIn_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-red-600"
                >
                  <path
                    d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-[clamp(18px,4vw,22px)] font-bold text-gray-900 mb-1"><TranslatedText>Confirm Logout</TranslatedText></h3>
                <p className="text-[clamp(13px,3vw,15px)] text-gray-600"><TranslatedText>Are you sure you want to logout?</TranslatedText></p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={handleLogoutCancel}
                className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium text-[clamp(13px,3vw,15px)] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoggingOut}
              >
                <TranslatedText>Cancel</TranslatedText>
              </button>
              <button
                type="button"
                onClick={handleLogoutConfirm}
                className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-[clamp(13px,3vw,15px)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span><TranslatedText>Logging out...</TranslatedText></span>
                  </>
                ) : (
                  <TranslatedText>Logout</TranslatedText>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePage

