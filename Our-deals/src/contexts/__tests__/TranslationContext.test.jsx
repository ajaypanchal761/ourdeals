import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { act } from 'react'
import { TranslationProvider, useTranslationContext } from '../TranslationContext'

// Test component that uses the context
const TestComponent = () => {
  const { currentLanguage, currentLanguageCode, setLanguage, isTranslating } =
    useTranslationContext()

  return (
    <div>
      <div data-testid="current-language">{currentLanguage}</div>
      <div data-testid="current-language-code">{currentLanguageCode}</div>
      <div data-testid="is-translating">{isTranslating.toString()}</div>
      <button
        data-testid="set-language-hi"
        onClick={() => setLanguage('HI')}
      >
        Set Hindi
      </button>
      <button
        data-testid="set-language-en"
        onClick={() => setLanguage('EN')}
      >
        Set English
      </button>
      <button
        data-testid="set-language-object"
        onClick={() => setLanguage({ code: 'MR' })}
      >
        Set Marathi
      </button>
    </div>
  )
}

describe('TranslationContext', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should provide default language (en) when no localStorage value', () => {
    render(
      <TranslationProvider>
        <TestComponent />
      </TranslationProvider>
    )

    expect(screen.getByTestId('current-language')).toHaveTextContent('en')
    expect(screen.getByTestId('current-language-code')).toHaveTextContent('EN')
  })

  it('should load language from localStorage', () => {
    localStorage.setItem('selectedLanguage', JSON.stringify({ code: 'HI' }))

    render(
      <TranslationProvider>
        <TestComponent />
      </TranslationProvider>
    )

    expect(screen.getByTestId('current-language')).toHaveTextContent('hi')
    expect(screen.getByTestId('current-language-code')).toHaveTextContent('HI')
  })

  it('should save language to localStorage when changed', async () => {
    render(
      <TranslationProvider>
        <TestComponent />
      </TranslationProvider>
    )

    const setLanguageButton = screen.getByTestId('set-language-hi')

    await act(async () => {
      setLanguageButton.click()
    })

    await waitFor(() => {
      const saved = JSON.parse(localStorage.getItem('selectedLanguage'))
      expect(saved.code).toBe('HI')
    })

    expect(screen.getByTestId('current-language')).toHaveTextContent('hi')
    expect(screen.getByTestId('current-language-code')).toHaveTextContent('HI')
  })

  it('should handle language change via string code', async () => {
    render(
      <TranslationProvider>
        <TestComponent />
      </TranslationProvider>
    )

    const setLanguageButton = screen.getByTestId('set-language-hi')

    await act(async () => {
      setLanguageButton.click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('current-language')).toHaveTextContent('hi')
    })
  })

  it('should handle language change via object with code', async () => {
    render(
      <TranslationProvider>
        <TestComponent />
      </TranslationProvider>
    )

    const setLanguageButton = screen.getByTestId('set-language-object')

    await act(async () => {
      setLanguageButton.click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('current-language')).toHaveTextContent('mr')
      expect(screen.getByTestId('current-language-code')).toHaveTextContent('MR')
    })
  })

  it('should dispatch languageChanged event when language changes', async () => {
    const eventListener = vi.fn()
    window.addEventListener('languageChanged', eventListener)

    render(
      <TranslationProvider>
        <TestComponent />
      </TranslationProvider>
    )

    const setLanguageButton = screen.getByTestId('set-language-hi')

    await act(async () => {
      setLanguageButton.click()
    })

    await waitFor(() => {
      expect(eventListener).toHaveBeenCalled()
      // Get the last call (language change happens after initial render)
      const calls = eventListener.mock.calls
      const lastCall = calls[calls.length - 1]
      const event = lastCall[0]
      expect(event.detail.language).toBe('hi')
      expect(event.detail.code).toBe('HI')
    }, { timeout: 1000 })

    window.removeEventListener('languageChanged', eventListener)
  })

  it('should handle invalid localStorage data gracefully', () => {
    localStorage.setItem('selectedLanguage', 'invalid-json')

    render(
      <TranslationProvider>
        <TestComponent />
      </TranslationProvider>
    )

    // Should fallback to default
    expect(screen.getByTestId('current-language')).toHaveTextContent('en')
  })

  it('should clear translation cache when language changes', async () => {
    // Import here to avoid circular dependency issues
    const { clearTranslationCache } = await import('../../services/translationService')
    const clearSpy = vi.spyOn({ clearTranslationCache }, 'clearTranslationCache')

    render(
      <TranslationProvider>
        <TestComponent />
      </TranslationProvider>
    )

    const setLanguageButton = screen.getByTestId('set-language-hi')

    await act(async () => {
      setLanguageButton.click()
    })

    // Cache clearing happens in useEffect, so we wait a bit
    await waitFor(() => {
      expect(screen.getByTestId('current-language')).toHaveTextContent('hi')
    })

    clearSpy.mockRestore()
  })

  it('should provide isTranslating state', () => {
    render(
      <TranslationProvider>
        <TestComponent />
      </TranslationProvider>
    )

    expect(screen.getByTestId('is-translating')).toHaveTextContent('false')
  })
})

describe('useTranslationContext hook', () => {
  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      render(<TestComponent />)
    }).toThrow('useTranslationContext must be used within TranslationProvider')

    consoleSpy.mockRestore()
  })
})

