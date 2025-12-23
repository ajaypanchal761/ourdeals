import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { mapLanguageCode, reverseMapLanguageCode } from '../utils/translationUtils'
import { clearTranslationCache } from '../services/translationService'
import i18n from '../i18n'

/**
 * Translation Context
 * Manages global language state and translation functionality
 */

const TranslationContext = createContext(null)

const STORAGE_KEY = 'selectedLanguage'
const DEFAULT_LANGUAGE = 'en'
const DEFAULT_LANGUAGE_CODE = 'EN'

export const TranslationProvider = ({ children }) => {
  // Initialize from i18n which already handles detection
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return mapLanguageCode(i18n.language || DEFAULT_LANGUAGE_CODE)
  })
  const [isTranslating, setIsTranslating] = useState(false)

  // Sync state when i18n language changes
  useEffect(() => {
    const handleI18nChange = (lng) => {
      const normalized = mapLanguageCode(lng)
      console.log('[TranslationContext] i18n language changed:', lng, '->', normalized)
      setCurrentLanguage(normalized)

      // Dispatch custom event for legacy listeners
      try {
        const code = reverseMapLanguageCode(normalized)
        window.dispatchEvent(new CustomEvent('languageChanged', {
          detail: { language: normalized, code: code }
        }))
      } catch (e) {
        console.error('Error dispatching event:', e)
      }
    }

    i18n.on('languageChanged', handleI18nChange)

    // Initial sync
    const initialLang = mapLanguageCode(i18n.language)
    if (initialLang !== currentLanguage) {
      setCurrentLanguage(initialLang)
    }

    return () => {
      i18n.off('languageChanged', handleI18nChange)
    }
  }, [])

  // Clear cache when language changes
  useEffect(() => {
    clearTranslationCache()
  }, [currentLanguage])

  // Set language function - delegates to i18n
  const setLanguage = useCallback((language) => {
    const normalizedLang = typeof language === 'string'
      ? mapLanguageCode(language)
      : mapLanguageCode(language?.code || DEFAULT_LANGUAGE_CODE)

    const i18nCode = reverseMapLanguageCode(normalizedLang).toLowerCase()

    console.log('[TranslationContext] Setting language via i18n:', i18nCode)
    i18n.changeLanguage(i18nCode)
  }, [])

  // Get current language code (UI format: EN, HI, etc.)
  const currentLanguageCode = useMemo(() => {
    const code = reverseMapLanguageCode(currentLanguage)
    console.log('[TranslationContext] Current language code computed:', { currentLanguage, code })
    return code
  }, [currentLanguage])

  const value = useMemo(() => ({
    currentLanguage,
    currentLanguageCode,
    setLanguage,
    isTranslating,
    setIsTranslating,
  }), [currentLanguage, currentLanguageCode, setLanguage, isTranslating, setIsTranslating])

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  )
}

/**
 * Hook to access translation context
 */
export const useTranslationContext = () => {
  const context = useContext(TranslationContext)
  if (!context) {
    throw new Error('useTranslationContext must be used within TranslationProvider')
  }
  return context
}

export default TranslationContext

