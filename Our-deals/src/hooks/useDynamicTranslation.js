import { useState, useCallback } from 'react'
import { useTranslation } from './useTranslation'
import { extractTexts } from '../utils/translationUtils'
import { isTranslationDisabled } from '../services/translationService'

/**
 * useDynamicTranslation Hook
 * Pattern 2: Dynamic API data translation
 * 
 * Usage:
 * const { translateObject } = useDynamicTranslation()
 * const translatedData = await translateObject(vendorData, ['name', 'description'])
 */
export const useDynamicTranslation = () => {
  const { translate, currentLanguage, isTranslating } = useTranslation()
  const [translating, setTranslating] = useState(false)

  /**
   * Translate object or array of objects
   * @param {Object|Array} data - Object or array of objects to translate
   * @param {Array<string>} keys - Array of keys to translate
   * @param {string} sourceLanguage - Source language (default: 'en')
   * @returns {Promise<Object|Array>} Translated data
   */
  const translateObject = useCallback(async (data, keys = [], sourceLanguage = 'en') => {
    if (!data || isTranslationDisabled()) {
      return data
    }

    // If no keys provided, return original data
    if (!keys || keys.length === 0) {
      return data
    }

    setTranslating(true)

    try {
      // Handle array of objects
      if (Array.isArray(data)) {
        // Extract all texts to translate
        const allTexts = extractTexts(data, keys)

        if (allTexts.length === 0) {
          return data
        }

        // Translate all texts in batch
        const translatedTexts = await translate(allTexts, sourceLanguage)

        // Map translated texts back to objects
        let textIndex = 0
        return data.map((item) => {
          const translatedItem = { ...item }

          keys.forEach((key) => {
            if (item[key] && typeof item[key] === 'string' && item[key].trim()) {
              translatedItem[key] = translatedTexts[textIndex] || item[key]
              textIndex++
            }
          })

          return translatedItem
        })
      }
      // Handle single object
      else if (typeof data === 'object' && data !== null) {
        // Extract texts to translate
        const texts = extractTexts([data], keys)

        if (texts.length === 0) {
          return data
        }

        // Translate texts
        const translatedTexts = await translate(texts, sourceLanguage)

        // Map translated texts back to object
        const translatedItem = { ...data }
        let textIndex = 0

        keys.forEach((key) => {
          if (data[key] && typeof data[key] === 'string' && data[key].trim()) {
            translatedItem[key] = translatedTexts[textIndex] || data[key]
            textIndex++
          }
        })

        return translatedItem
      }

      return data
    } catch (error) {
      if (!isTranslationDisabled()) {
        console.error('Error translating object:', error)
      }
      return data
    } finally {
      setTranslating(false)
    }
  }, [translate, currentLanguage])

  return {
    translateObject,
    isTranslating: translating || isTranslating,
    currentLanguage,
  }
}

export default useDynamicTranslation

