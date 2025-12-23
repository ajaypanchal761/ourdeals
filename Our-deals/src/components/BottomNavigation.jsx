import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import LoginModal from './LoginModal'
import TranslatedText from './TranslatedText'

function BottomNavigation() {
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const isCallEnquiry = location.pathname === '/call-enquiry'
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [userData, setUserData] = useState(null)
  const [showMoreBottomSheet, setShowMoreBottomSheet] = useState(false)

  // Load user data from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('userData')
    if (savedUser) {
      setUserData(JSON.parse(savedUser))
    }
  }, [])

  // Listen for storage changes (when user logs in/out in another tab)
  useEffect(() => {
    const handleStorageChange = () => {
      const savedUser = localStorage.getItem('userData')
      if (savedUser) {
        setUserData(JSON.parse(savedUser))
      } else {
        setUserData(null)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleLoginSuccess = (data) => {
    setUserData(data)
    localStorage.setItem('userData', JSON.stringify(data))
    setIsLoginModalOpen(false)
    navigate('/profile') // Navigate to profile after login
  }

  const handleProfileClick = () => {
    if (userData) {
      navigate('/profile')
    } else {
      setIsLoginModalOpen(true)
    }
  }

  const handleMoreClick = () => {
    setShowMoreBottomSheet(true)
  }

  const handleCloseMoreBottomSheet = () => {
    setShowMoreBottomSheet(false)
  }

  const handleAgentClick = () => {
    setShowMoreBottomSheet(false)
    navigate('/agent-registration')
  }

  const handleVendorClick = () => {
    setShowMoreBottomSheet(false)
    // Redirect to Play Store - Our Deals app
    // Replace with actual Play Store package ID when available
    const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.ourdeals.app'
    window.open(playStoreUrl, '_blank')
  }

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-evenly items-center py-1.5 z-[1000] shadow-[0_-2px_8px_rgba(0,0,0,0.1)] h-[56px] max-h-[56px] overflow-hidden md:hidden">
        <button
          type="button"
          className={`flex flex-col items-center justify-center gap-0.5 bg-transparent border-none cursor-pointer py-1 px-1.5 text-gray-500 transition-colors flex-1 min-w-0 text-center pointer-events-auto touch-manipulation [-webkit-tap-highlight-color:transparent] ${isHome ? 'text-blue-600' : ''} active:opacity-70`}
          onClick={() => navigate('/')}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0 block">
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[10px] font-medium leading-tight whitespace-nowrap overflow-hidden text-ellipsis max-w-full"><TranslatedText>Home</TranslatedText></span>
        </button>
        <button
          type="button"
          className={`flex flex-col items-center justify-center gap-0.5 bg-transparent border-none cursor-pointer py-1 px-1.5 text-gray-500 transition-colors flex-1 min-w-0 text-center pointer-events-auto touch-manipulation [-webkit-tap-highlight-color:transparent] ${isCallEnquiry ? 'text-blue-600' : ''} active:opacity-70`}
          onClick={() => navigate('/call-enquiry')}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0 block">
            <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7292C21.7209 20.9842 21.5573 21.2126 21.3518 21.3992C21.1463 21.5858 20.9033 21.7262 20.6381 21.811C20.3729 21.8958 20.0922 21.9231 19.815 21.891C16.7428 21.5856 13.786 20.5341 11.19 18.82C8.77382 17.3148 6.72533 15.2663 5.22 12.85C3.49997 10.2412 2.44824 7.27099 2.15 4.18C2.11793 3.90322 2.14518 3.62281 2.22981 3.35788C2.31444 3.09295 2.45452 2.85002 2.64082 2.64458C2.82712 2.43914 3.05531 2.27554 3.31007 2.16389C3.56483 2.05224 3.84034 1.99508 4.119 2H7.119C7.59357 1.99522 8.05808 2.16708 8.43322 2.49055C8.80836 2.81402 9.07173 3.27236 9.179 3.78L9.88 6.75C9.98603 7.24195 9.93842 7.75767 9.74447 8.22293C9.55052 8.68819 9.21969 9.08114 8.8 9.35L7.33 10.28C8.47697 12.3301 10.1699 14.023 12.22 15.17L13.15 13.71C13.4201 13.2908 13.8132 12.9602 14.2784 12.7663C14.7436 12.5724 15.2591 12.5247 15.75 12.63L18.71 13.33C19.2176 13.4373 19.676 13.7007 19.9995 14.0758C20.323 14.4509 20.4948 14.9154 20.49 15.39L22 19.39Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[10px] font-medium leading-tight whitespace-nowrap overflow-hidden text-ellipsis max-w-full"><TranslatedText>Call Enquiry</TranslatedText></span>
        </button>
        <button
          type="button"
          className={`flex flex-col items-center justify-center gap-0.5 bg-transparent border-none cursor-pointer py-1 px-1.5 text-gray-500 transition-colors flex-1 min-w-0 text-center pointer-events-auto touch-manipulation [-webkit-tap-highlight-color:transparent] ${showMoreBottomSheet ? 'text-blue-600' : ''} active:opacity-70`}
          onClick={handleMoreClick}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0 block">
            <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[10px] font-medium leading-tight whitespace-nowrap overflow-hidden text-ellipsis max-w-full"><TranslatedText>More</TranslatedText></span>
        </button>
        <button
          type="button"
          className={`flex flex-col items-center justify-center gap-0.5 bg-transparent border-none cursor-pointer py-1 px-1.5 text-gray-500 transition-colors flex-1 min-w-0 text-center pointer-events-auto touch-manipulation [-webkit-tap-highlight-color:transparent] ${location.pathname === '/profile' ? 'text-blue-600' : ''} active:opacity-70`}
          onClick={handleProfileClick}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0 block">
            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[10px] font-medium leading-tight whitespace-nowrap overflow-hidden text-ellipsis max-w-full"><TranslatedText>Profile</TranslatedText></span>
        </button>
      </nav>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* More Bottom Sheet */}
      {showMoreBottomSheet && (
        <>
          <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 backdrop-blur-sm z-[9998] animate-[fadeIn_0.3s_ease-out] md:hidden" onClick={handleCloseMoreBottomSheet}></div>
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[20px] z-[9999] shadow-[0_-4px_20px_rgba(0,0,0,0.15)] animate-[slideUp_0.3s_ease-out] max-h-[40vh] pb-[env(safe-area-inset-bottom)] md:hidden">
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto my-3 mb-5 cursor-pointer transition-colors hover:bg-gray-400" onClick={handleCloseMoreBottomSheet}></div>
            <div className="flex justify-around items-center px-6 pb-8 gap-6">
              <div className="flex flex-col items-center justify-center cursor-pointer flex-1 p-4 rounded-xl transition-colors gap-2 active:bg-gray-100" onClick={handleAgentClick}>
                <div className="w-12 h-12 flex items-center justify-center text-[#13335a] bg-gray-100 rounded-xl transition-all active:bg-gray-200 active:scale-95">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2.5" />
                    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2.5" />
                    <path d="M7 17C7 14.7909 9.23858 13 12 13C14.7614 13 17 14.7909 17 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-gray-700 text-center"><TranslatedText>Agent</TranslatedText></span>
              </div>
              <div className="flex flex-col items-center justify-center cursor-pointer flex-1 p-4 rounded-xl transition-colors gap-2 active:bg-gray-100" onClick={handleVendorClick}>
                <div className="w-12 h-12 flex items-center justify-center text-[#13335a] bg-gray-100 rounded-xl transition-all active:bg-gray-200 active:scale-95">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-gray-700 text-center"><TranslatedText>Vendor</TranslatedText></span>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default BottomNavigation

