import { generateCacheKey, batchTexts, needsTranslation } from '../utils/translationUtils'
import { getStaticTranslation } from '../data/locales'

/**
 * Translation Service
 * Handles Google Cloud Translate API integration with batch translation and caching
 */

// In-memory translation cache (initially loaded from localStorage)
const STORAGE_KEY = 'translation_cache'
const MAX_CACHE_SIZE = 500 // Limit cache size to avoid localStorage bloat

const loadCache = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      return new Map(Object.entries(parsed))
    }
  } catch (error) {
    console.error('[TranslationService] Error loading cache:', error)
  }
  return new Map()
}

const saveCache = (cache) => {
  try {
    // Convert Map to Object for JSON storage
    const obj = Object.fromEntries(cache)

    // Simple cache eviction if too large
    if (cache.size > MAX_CACHE_SIZE) {
      const keys = Array.from(cache.keys())
      for (let i = 0; i < keys.length - MAX_CACHE_SIZE; i++) {
        delete obj[keys[i]]
      }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj))
  } catch (error) {
    console.error('[TranslationService] Error saving cache:', error)
  }
}

const translationCache = loadCache()

// Track if API is disabled (e.g. due to 403 Forbidden)
let isApiDisabled = false

// Pending translation requests to avoid duplicate API calls
const pendingRequests = new Map()

// Batch queue for debouncing
let batchQueue = []
let batchTimeout = null
const BATCH_DEBOUNCE_MS = 300
const BATCH_SIZE = 128

/**
 * Get Google Cloud Translate API key from environment
 */
const getApiKey = () => {
  if (isApiDisabled) return ''

  // Try both VITE_ prefixed and direct env variable
  const apiKey = import.meta.env.VITE_GOOGLE_CLOUD_TRANSLATE_API_KEY ||
    import.meta.env.GOOGLE_CLOUD_TRANSLATE_API_KEY ||
    ''

  if (!apiKey) {
    // Only warn once
    if (!getApiKey.warned) {
      console.warn('[TranslationService] Google Cloud Translate API key not configured. Add VITE_GOOGLE_CLOUD_TRANSLATE_API_KEY to your .env file.')
      getApiKey.warned = true
    }
  }

  return apiKey
}

/**
 * Translate a single text using Google Cloud Translate API
 */
const translateSingle = async (text, targetLang, sourceLang = 'en') => {
  if (!needsTranslation(text, sourceLang, targetLang)) {
    return text
  }

  // 1. Check static translations first (fastest, no API, no cache)
  const staticMatch = getStaticTranslation(text, targetLang)
  if (staticMatch) return staticMatch

  const cacheKey = generateCacheKey(text, sourceLang, targetLang)

  // Check cache first
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)
  }

  // Check if there's a pending request for this text
  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey)
  }

  const apiKey = getApiKey()
  if (!apiKey) return text

  const requestPromise = (async () => {
    try {
      const apiKey = getApiKey()
      if (!apiKey || isApiDisabled) throw new Error('API disabled')

      const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: [text],
          target: targetLang,
          source: sourceLang,
        }),
      })

      if (!response.ok) {
        if (response.status === 403) {
          isApiDisabled = true
          console.error('[TranslationService] Google Translate API returned 403 Forbidden. The API key might be restricted or translation service is not enabled for this project. Disabling dynamic translation.')
        }
        throw new Error(`API error: ${response.status}`)
      }
      const data = await response.json()
      const translatedText = data.data?.translations?.[0]?.translatedText || text

      // Update cache
      translationCache.set(cacheKey, translatedText)
      saveCache(translationCache)

      return translatedText
    } catch (error) {
      if (!isApiDisabled) {
        console.error('Translation error:', error)
      }
      return text
    } finally {
      pendingRequests.delete(cacheKey)
    }
  })()

  pendingRequests.set(cacheKey, requestPromise)
  return requestPromise
}

/**
 * Translate multiple texts in batch using Google Cloud Translate API
 */
const translateBatch = async (texts, targetLang, sourceLang = 'en') => {
  if (!texts || texts.length === 0) return []
  if (isApiDisabled) return texts

  const apiKey = getApiKey()
  const results = []
  const uncachedTexts = []
  const uncachedIndices = []

  texts.forEach((text, index) => {
    if (!needsTranslation(text, sourceLang, targetLang)) {
      results[index] = text
      return
    }

    // Check static translations first
    const staticMatch = getStaticTranslation(text, targetLang)
    if (staticMatch) {
      results[index] = staticMatch
      return
    }

    const cacheKey = generateCacheKey(text, sourceLang, targetLang)
    if (translationCache.has(cacheKey)) {
      results[index] = translationCache.get(cacheKey)
    } else {
      uncachedTexts.push(text)
      uncachedIndices.push(index)
      results[index] = null
    }
  })

  if (uncachedTexts.length === 0) return results
  if (!apiKey) return results.map((r, i) => r !== null ? r : texts[i])

  const batches = batchTexts(uncachedTexts, BATCH_SIZE)

  try {
    let uncachedIndex = 0
    for (const batch of batches) {
      if (isApiDisabled) break

      const currentApiKey = getApiKey()
      if (!currentApiKey) break

      const url = `https://translation.googleapis.com/language/translate/v2?key=${currentApiKey}`
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: batch,
          target: targetLang,
          source: sourceLang,
        }),
      })

      if (!response.ok) {
        if (response.status === 403) {
          isApiDisabled = true
          console.error('[TranslationService] Google Translate API returned 403 Forbidden. Disabling dynamic translation.')
        }
        throw new Error(`API error: ${response.status}`)
      }
      const data = await response.json()
      const translations = data.data?.translations || []

      batch.forEach((originalText, batchIndex) => {
        const translatedText = translations[batchIndex]?.translatedText || originalText
        const cacheKey = generateCacheKey(originalText, sourceLang, targetLang)

        translationCache.set(cacheKey, translatedText)
        results[uncachedIndices[uncachedIndex]] = translatedText
        uncachedIndex++
      })
    }

    saveCache(translationCache)
    return results.map((result, index) => result !== null ? result : texts[index])
  } catch (error) {
    if (!isApiDisabled) {
      console.error('Batch translation error:', error)
    }
    return results.map((result, index) => result !== null ? result : texts[index])
  }
}

/**
 * Synchronous translation function - only checks static labels and cache.
 * Useful for input placeholders and avoiding async/API hits.
 */
export const translateSync = (text, targetLang, sourceLang = 'en') => {
  if (!text || !targetLang || !needsTranslation(text, sourceLang, targetLang)) {
    return text
  }

  // 1. Check static translations
  const staticMatch = getStaticTranslation(text, targetLang)
  if (staticMatch) return staticMatch

  // 2. Check cache
  const cacheKey = generateCacheKey(text, sourceLang, targetLang)
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)
  }

  return null
}

/**
 * Main translation function - handles both single and batch translation
 */
export const translate = async (textOrTexts, targetLang, sourceLang = 'en') => {
  if (Array.isArray(textOrTexts)) {
    return translateBatch(textOrTexts, targetLang, sourceLang)
  } else {
    return translateSingle(textOrTexts, targetLang, sourceLang)
  }
}

/**
 * Clear translation cache
 */
export const clearTranslationCache = () => {
  translationCache.clear()
  pendingRequests.clear()
  localStorage.removeItem(STORAGE_KEY)
}

/**
 * Check if the translation service is currently disabled
 */
export const isTranslationDisabled = () => isApiDisabled

/**
 * Get cache statistics (for debugging)
 */
export const getCacheStats = () => {
  return {
    cacheSize: translationCache.size,
    pendingRequests: pendingRequests.size,
  }
}

