/**
 * Translation Utilities
 * Helper functions for language code mapping and translation processing
 */

/**
 * Map UI language codes to Google Translate API language codes
 * EN -> en, HI -> hi, etc.
 */
export const mapLanguageCode = (code) => {
  const languageMap = {
    'EN': 'en',
    'HI': 'hi',
    'MR': 'mr',
    'BN': 'bn',
    'GU': 'gu',
    'KN': 'kn',
    'TA': 'ta',
  }
  
  return languageMap[code?.toUpperCase()] || code?.toLowerCase() || 'en'
}

/**
 * Reverse map: Google Translate API codes to UI codes
 * en -> EN, hi -> HI, etc.
 */
export const reverseMapLanguageCode = (code) => {
  const reverseMap = {
    'en': 'EN',
    'hi': 'HI',
    'mr': 'MR',
    'bn': 'BN',
    'gu': 'GU',
    'kn': 'KN',
    'ta': 'TA',
  }
  
  return reverseMap[code?.toLowerCase()] || code?.toUpperCase() || 'EN'
}

/**
 * Generate cache key for translation
 * Format: {text}_{sourceLang}_{targetLang}
 */
export const generateCacheKey = (text, sourceLang, targetLang) => {
  const normalizedText = String(text || '').trim()
  const normalizedSource = String(sourceLang || 'en').toLowerCase()
  const normalizedTarget = String(targetLang || 'en').toLowerCase()
  
  return `${normalizedText}_${normalizedSource}_${normalizedTarget}`
}

/**
 * Extract text from various input types for batch processing
 */
export const extractTexts = (items, keys = []) => {
  const texts = []
  
  if (!items || (Array.isArray(items) && items.length === 0)) {
    return texts
  }
  
  const itemsArray = Array.isArray(items) ? items : [items]
  
  itemsArray.forEach((item) => {
    if (typeof item === 'string') {
      texts.push(item)
    } else if (typeof item === 'object' && item !== null) {
      keys.forEach((key) => {
        if (item[key] && typeof item[key] === 'string') {
          texts.push(item[key])
        }
      })
    }
  })
  
  return texts.filter((text) => text && text.trim().length > 0)
}

/**
 * Check if text needs translation
 */
export const needsTranslation = (text, sourceLang, targetLang) => {
  if (!text || typeof text !== 'string' || !text.trim()) {
    return false
  }
  
  const normalizedSource = String(sourceLang || 'en').toLowerCase()
  const normalizedTarget = String(targetLang || 'en').toLowerCase()
  
  return normalizedSource !== normalizedTarget
}

/**
 * Batch texts into chunks of specified size
 */
export const batchTexts = (texts, batchSize = 128) => {
  const batches = []
  for (let i = 0; i < texts.length; i += batchSize) {
    batches.push(texts.slice(i, i + batchSize))
  }
  return batches
}



