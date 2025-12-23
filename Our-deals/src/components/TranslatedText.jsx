import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from '../hooks/useTranslation'
import { needsTranslation } from '../utils/translationUtils'

/**
 * TranslatedText Component
 * Pattern 1: Static UI translation
 * 
 * Usage:
 * <TranslatedText>Text to translate</TranslatedText>
 * <TranslatedText sourceLanguage="en" skipTranslation={language === 'en'}>Text</TranslatedText>
 */
const TranslatedText = ({
  children,
  sourceLanguage = 'en',
  skipTranslation = false,
  className = '',
  ...props
}) => {
  const { currentLanguage, translate, isTranslating, translateSync } = useTranslation()

  const text = useMemo(() => {
    if (typeof children === 'string') {
      return children
    }
    if (typeof children === 'number') {
      return String(children)
    }
    return ''
  }, [children])

  // 1. Try synchronous translation first (static labels + cache)
  const syncResult = useMemo(() => {
    if (skipTranslation || !text || !needsTranslation(text, sourceLanguage, currentLanguage)) {
      return null
    }
    return translateSync(text)
  }, [text, currentLanguage, skipTranslation, sourceLanguage, translateSync])

  const [translatedText, setTranslatedText] = useState(syncResult)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // If we already have a sync match or don't need translation, skip effect
    if (syncResult || skipTranslation || !text || !needsTranslation(text, sourceLanguage, currentLanguage)) {
      setTranslatedText(syncResult)
      setIsLoading(false)
      return
    }

    let isMounted = true
    let timeoutId = null

    // Debounce translation to avoid too many simultaneous calls
    const performTranslation = async () => {
      if (!isMounted) return

      setIsLoading(true)
      try {
        const result = await translate(text, sourceLanguage)
        if (isMounted) {
          setTranslatedText(result)
        }
      } catch (error) {
        console.error('Error translating text:', error)
        if (isMounted) {
          setTranslatedText(null) // Fallback to original text
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    // Debounce translation calls to batch them
    timeoutId = setTimeout(performTranslation, 100)

    return () => {
      isMounted = false
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [text, sourceLanguage, currentLanguage, skipTranslation, translate, syncResult])

  // Determine what to display
  const displayText = translatedText !== null ? translatedText : (syncResult || text)

  return (
    <span className={className} {...props}>
      {isLoading ? (
        <span className="opacity-50">{text}</span>
      ) : (
        displayText
      )}
    </span>
  )
}

export default TranslatedText

