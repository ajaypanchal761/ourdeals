import { useState, useEffect, useRef } from 'react'
import { useTranslationContext } from '../contexts/TranslationContext'
import { useTranslation } from 'react-i18next'

import { IoMdGlobe } from 'react-icons/io'

function LanguageSelector() {
  const { setLanguage } = useTranslationContext()
  const { i18n } = useTranslation()
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
  const languageDropdownRef = useRef(null)

  // Only English and Hindi as requested
  const languages = [
    { code: 'EN', name: 'English', langCode: 'en' },
    { code: 'HI', name: 'हिंदी', langCode: 'hi' },
    { code: 'MR', name: 'मराठी', langCode: 'mr' },
    { code: 'PA', name: 'पंजाबी', langCode: 'pa' },
    { code: 'GU', name: 'ગુજરાતી', langCode: 'gu' },
    { code: 'BN', name: 'বাংলা', langCode: 'bn' },
  ]

  // Determine current language code for display
  const getCurrentLangObject = () => {
    const currentLang = i18n.language || 'en';
    const normalizedLang = currentLang.split('-')[0]; // Handle en-US, etc.
    return languages.find(l => l.langCode === normalizedLang) || languages[0];
  }

  const selectedLanguage = getCurrentLangObject();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
        setIsLanguageDropdownOpen(false)
      }
    }

    if (isLanguageDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isLanguageDropdownOpen])

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang.langCode)
    setIsLanguageDropdownOpen(false)
  }

  return (
    <div className="relative" ref={languageDropdownRef}>
      <button
        className="flex items-center gap-1.5 md:gap-2 px-2 py-1 md:px-3 md:py-1.5 border border-gray-200 rounded-full bg-white cursor-pointer text-xs md:text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-300 shadow-sm"
        onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
      >
        <IoMdGlobe className="text-gray-500 text-sm md:text-lg" />
        <span>{selectedLanguage.code}</span>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400 w-3.5 h-3.5 transition-transform duration-200" style={{ transform: isLanguageDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {isLanguageDropdownOpen && (
        <div className="absolute right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] min-w-[160px] z-50 overflow-hidden top-full py-1 animate-in fade-in zoom-in-95 duration-200">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center justify-between hover:bg-gray-50 ${selectedLanguage.code === lang.code ? 'text-[#13335a] font-bold bg-blue-50' : 'text-gray-600 font-medium'}`}
              onClick={() => handleLanguageChange(lang)}
            >
              {lang.name}
              {selectedLanguage.code === lang.code && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#13335a]"></span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default LanguageSelector
