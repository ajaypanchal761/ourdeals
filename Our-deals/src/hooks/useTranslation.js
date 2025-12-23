import { useCallback, useMemo } from 'react'
import { useTranslationContext } from '../contexts/TranslationContext'
import { translate, translateSync, isTranslationDisabled } from '../services/translationService'
import { mapLanguageCode } from '../utils/translationUtils'

/**
 * useTranslation Hook
 * Convenience hook for accessing translation context and translating text
 */
export const useTranslation = () => {
  const { currentLanguage, setLanguage, isTranslating, setIsTranslating, currentLanguageCode } = useTranslationContext()

  /**
   * Translate text(s) to current language (Asynchronous)
   */
  const translateText = useCallback(async (textOrTexts, sourceLanguage = 'en') => {
    if (!textOrTexts || isTranslationDisabled()) {
      return textOrTexts
    }

    setIsTranslating(true)
    try {
      const result = await translate(textOrTexts, currentLanguage, sourceLanguage)
      return result
    } catch (error) {
      // Avoid logging if API was just disabled by another component
      if (!isTranslationDisabled()) {
        console.error('[useTranslation] Translation error:', error)
      }
      return textOrTexts
    } finally {
      setIsTranslating(false)
    }
  }, [currentLanguage, setIsTranslating])

  /**
   * Synchronous translation - returns NULL if not found
   * Used by TranslatedText to decide whether to trigger dynamic translation
   */
  const translateSyncWrapper = useCallback((text) => {
    return translateSync(text, currentLanguage)
  }, [currentLanguage])

  /**
   * Synchronous translation with fallback
   * Best for placeholders and immediate UI needs
   */
  const t = useCallback((text) => {
    return translateSyncWrapper(text) || text
  }, [translateSyncWrapper])

  return {
    currentLanguage,
    currentLanguageCode,
    setLanguage,
    translate: translateText,
    translateSync: translateSyncWrapper,
    t,
    isTranslating,
  }
}

export default useTranslation

