import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useTranslation } from '../useTranslation'
import { TranslationProvider } from '../../contexts/TranslationContext'
import * as translationService from '../../services/translationService'

// Mock the translation service
vi.mock('../../services/translationService', () => ({
  translate: vi.fn(),
  clearTranslationCache: vi.fn(),
  getCacheStats: vi.fn(),
}))

const wrapper = ({ children }) => (
  <TranslationProvider>{children}</TranslationProvider>
)

describe('useTranslation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should return current language and language code', () => {
    const { result } = renderHook(() => useTranslation(), { wrapper })

    expect(result.current.currentLanguage).toBe('en')
    expect(result.current.currentLanguageCode).toBe('EN')
  })

  it('should provide setLanguage function', () => {
    const { result } = renderHook(() => useTranslation(), { wrapper })

    expect(typeof result.current.setLanguage).toBe('function')
  })

  it('should provide translate function', () => {
    const { result } = renderHook(() => useTranslation(), { wrapper })

    expect(typeof result.current.translate).toBe('function')
  })

  it('should provide isTranslating state', () => {
    const { result } = renderHook(() => useTranslation(), { wrapper })

    expect(typeof result.current.isTranslating).toBe('boolean')
    expect(result.current.isTranslating).toBe(false)
  })

  it('should translate single text', async () => {
    translationService.translate.mockResolvedValueOnce('नमस्ते')

    const { result } = renderHook(() => useTranslation(), { wrapper })

    let translatedText
    await act(async () => {
      translatedText = await result.current.translate('Hello', 'en')
    })

    expect(translatedText).toBe('नमस्ते')
    expect(translationService.translate).toHaveBeenCalledWith('Hello', 'en', 'en')
  })

  it('should translate array of texts', async () => {
    translationService.translate.mockResolvedValueOnce(['नमस्ते', 'दुनिया'])

    const { result } = renderHook(() => useTranslation(), { wrapper })

    let translatedTexts
    await act(async () => {
      translatedTexts = await result.current.translate(['Hello', 'World'], 'en')
    })

    expect(translatedTexts).toEqual(['नमस्ते', 'दुनिया'])
    expect(translationService.translate).toHaveBeenCalledWith(
      ['Hello', 'World'],
      'en',
      'en'
    )
  })

  it('should set isTranslating to true during translation', async () => {
    let resolveTranslation
    const translationPromise = new Promise((resolve) => {
      resolveTranslation = resolve
    })
    translationService.translate.mockReturnValueOnce(translationPromise)

    const { result } = renderHook(() => useTranslation(), { wrapper })

    act(() => {
      result.current.translate('Hello', 'en')
    })

    await waitFor(() => {
      expect(result.current.isTranslating).toBe(true)
    })

    await act(async () => {
      resolveTranslation('नमस्ते')
      await translationPromise
    })

    await waitFor(() => {
      expect(result.current.isTranslating).toBe(false)
    })
  })

  it('should handle translation errors gracefully', async () => {
    translationService.translate.mockRejectedValueOnce(new Error('Translation failed'))

    const { result } = renderHook(() => useTranslation(), { wrapper })

    let translatedText
    await act(async () => {
      translatedText = await result.current.translate('Hello', 'en')
    })

    expect(translatedText).toBe('Hello') // Should return original text on error
    expect(result.current.isTranslating).toBe(false)
  })

  it('should return original text when text is null/undefined', async () => {
    const { result } = renderHook(() => useTranslation(), { wrapper })

    let translatedText
    await act(async () => {
      translatedText = await result.current.translate(null, 'en')
    })

    expect(translatedText).toBeNull()
    expect(translationService.translate).not.toHaveBeenCalled()
  })

  it('should use current language as target language', async () => {
    translationService.translate.mockResolvedValueOnce('नमस्ते')

    const { result } = renderHook(() => useTranslation(), { wrapper })

    // Change language first
    await act(async () => {
      result.current.setLanguage('HI')
    })

    await waitFor(() => {
      expect(result.current.currentLanguage).toBe('hi')
    })

    // Translate - should use 'hi' as target
    await act(async () => {
      await result.current.translate('Hello', 'en')
    })

    expect(translationService.translate).toHaveBeenCalledWith('Hello', 'hi', 'en')
  })

  it('should use provided source language', async () => {
    translationService.translate.mockResolvedValueOnce('नमस्ते')

    const { result } = renderHook(() => useTranslation(), { wrapper })

    await act(async () => {
      await result.current.translate('Hello', 'fr')
    })

    expect(translationService.translate).toHaveBeenCalledWith('Hello', 'en', 'fr')
  })
})

