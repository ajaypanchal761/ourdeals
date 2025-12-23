import { describe, it, expect, beforeEach, vi } from 'vitest'
import { translate, clearTranslationCache, getCacheStats } from '../translationService'

// Mock fetch globally
global.fetch = vi.fn()

describe('translationService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    clearTranslationCache()
    // Reset environment variables
    vi.stubEnv('VITE_GOOGLE_CLOUD_TRANSLATE_API_KEY', 'test-api-key')
    vi.stubEnv('GOOGLE_CLOUD_TRANSLATE_API_KEY', '')
  })

  describe('translate - single text', () => {
    it('should translate a single text successfully', async () => {
      const mockResponse = {
        data: {
          translations: [
            {
              translatedText: 'नमस्ते',
            },
          ],
        },
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await translate('Hello', 'hi', 'en')
      expect(result).toBe('नमस्ते')
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    it('should use cache for repeated translations', async () => {
      const mockResponse = {
        data: {
          translations: [
            {
              translatedText: 'नमस्ते',
            },
          ],
        },
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      // First call
      const result1 = await translate('Hello', 'hi', 'en')
      expect(result1).toBe('नमस्ते')

      // Second call should use cache
      const result2 = await translate('Hello', 'hi', 'en')
      expect(result2).toBe('नमस्ते')

      // Should only call API once
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    it('should return original text when API key is missing', async () => {
      vi.stubEnv('VITE_GOOGLE_CLOUD_TRANSLATE_API_KEY', '')
      vi.stubEnv('GOOGLE_CLOUD_TRANSLATE_API_KEY', '')

      const result = await translate('Hello', 'hi', 'en')
      expect(result).toBe('Hello')
      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('should return original text when source and target languages are the same', async () => {
      const result = await translate('Hello', 'en', 'en')
      expect(result).toBe('Hello')
      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('should handle API errors gracefully', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
      })

      const result = await translate('Hello', 'hi', 'en')
      expect(result).toBe('Hello') // Should return original text on error
    })

    it('should handle API error response with error object', async () => {
      const mockErrorResponse = {
        error: {
          message: 'Invalid API key',
        },
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockErrorResponse,
      })

      const result = await translate('Hello', 'hi', 'en')
      expect(result).toBe('Hello') // Should return original text on error
    })

    it('should handle network errors', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'))

      const result = await translate('Hello', 'hi', 'en')
      expect(result).toBe('Hello') // Should return original text on error
    })

    it('should make correct API call with proper parameters', async () => {
      const mockResponse = {
        data: {
          translations: [
            {
              translatedText: 'नमस्ते',
            },
          ],
        },
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      await translate('Hello World', 'hi', 'en')

      expect(global.fetch).toHaveBeenCalledWith(
        'https://translation.googleapis.com/language/translate/v2?key=test-api-key',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: ['Hello World'],
            target: 'hi',
            source: 'en',
          }),
        }
      )
    })
  })

  describe('translate - batch translation', () => {
    it('should translate multiple texts in batch', async () => {
      const mockResponse = {
        data: {
          translations: [
            { translatedText: 'नमस्ते' },
            { translatedText: 'दुनिया' },
            { translatedText: 'परीक्षण' },
          ],
        },
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const texts = ['Hello', 'World', 'Test']
      const result = await translate(texts, 'hi', 'en')

      expect(result).toEqual(['नमस्ते', 'दुनिया', 'परीक्षण'])
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    it('should use cache for texts that are already translated', async () => {
      // First batch
      const mockResponse1 = {
        data: {
          translations: [
            { translatedText: 'नमस्ते' },
            { translatedText: 'दुनिया' },
          ],
        },
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse1,
      })

      const texts1 = ['Hello', 'World']
      await translate(texts1, 'hi', 'en')

      // Second batch with one cached text
      const mockResponse2 = {
        data: {
          translations: [{ translatedText: 'परीक्षण' }],
        },
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse2,
      })

      const texts2 = ['Hello', 'Test'] // 'Hello' is cached
      const result = await translate(texts2, 'hi', 'en')

      expect(result).toEqual(['नमस्ते', 'परीक्षण'])
      expect(global.fetch).toHaveBeenCalledTimes(2)
    })

    it('should handle texts that do not need translation', async () => {
      const texts = ['Hello', 'World']
      const result = await translate(texts, 'en', 'en')

      expect(result).toEqual(['Hello', 'World'])
      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('should batch large arrays into chunks', async () => {
      const texts = Array.from({ length: 200 }, (_, i) => `Text ${i}`)
      const mockResponse = {
        data: {
          translations: texts.map((text) => ({ translatedText: `Translated ${text}` })),
        },
      }

      // Mock multiple responses for batches
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await translate(texts, 'hi', 'en')

      expect(result).toHaveLength(200)
      // Should make multiple API calls for batches of 128
      expect(global.fetch).toHaveBeenCalledTimes(2) // 200 / 128 = 2 batches
    })

    it('should handle empty array', async () => {
      const result = await translate([], 'hi', 'en')
      expect(result).toEqual([])
      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('should preserve order of translations', async () => {
      const mockResponse = {
        data: {
          translations: [
            { translatedText: 'नमस्ते' },
            { translatedText: 'दुनिया' },
            { translatedText: 'परीक्षण' },
          ],
        },
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const texts = ['Hello', 'World', 'Test']
      const result = await translate(texts, 'hi', 'en')

      expect(result[0]).toBe('नमस्ते')
      expect(result[1]).toBe('दुनिया')
      expect(result[2]).toBe('परीक्षण')
    })

    it('should handle partial cache hits correctly', async () => {
      // First translation
      const mockResponse1 = {
        data: {
          translations: [{ translatedText: 'नमस्ते' }],
        },
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse1,
      })

      await translate(['Hello'], 'hi', 'en')

      // Second translation with cached and new texts
      const mockResponse2 = {
        data: {
          translations: [{ translatedText: 'दुनिया' }],
        },
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse2,
      })

      const result = await translate(['Hello', 'World'], 'hi', 'en')

      expect(result).toEqual(['नमस्ते', 'दुनिया'])
    })
  })

  describe('clearTranslationCache', () => {
    it('should clear translation cache', async () => {
      const mockResponse = {
        data: {
          translations: [{ translatedText: 'नमस्ते' }],
        },
      }

      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      // Translate and cache
      await translate('Hello', 'hi', 'en')
      expect(global.fetch).toHaveBeenCalledTimes(1)

      // Clear cache
      clearTranslationCache()

      // Translate again - should call API
      await translate('Hello', 'hi', 'en')
      expect(global.fetch).toHaveBeenCalledTimes(2)
    })
  })

  describe('getCacheStats', () => {
    it('should return cache statistics', async () => {
      const mockResponse = {
        data: {
          translations: [{ translatedText: 'नमस्ते' }],
        },
      }

      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      const statsBefore = getCacheStats()
      expect(statsBefore.cacheSize).toBe(0)

      await translate('Hello', 'hi', 'en')

      const statsAfter = getCacheStats()
      expect(statsAfter.cacheSize).toBe(1)
      expect(statsAfter.pendingRequests).toBe(0)
    })
  })
})



