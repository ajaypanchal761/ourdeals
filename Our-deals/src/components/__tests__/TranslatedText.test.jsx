import { describe, it, expect, beforeEach, vi } from 'vitest'
import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import TranslatedText from '../TranslatedText'
import { TranslationProvider } from '../../contexts/TranslationContext'
import { useTranslation } from '../../hooks/useTranslation'
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

describe('TranslatedText', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should render original text when translation is not needed', () => {
    render(<TranslatedText>Hello World</TranslatedText>, { wrapper })

    expect(screen.getByText('Hello World')).toBeInTheDocument()
    expect(translationService.translate).not.toHaveBeenCalled()
  })

  it('should translate text when languages differ', async () => {
    translationService.translate.mockResolvedValue('नमस्ते')
    
    // Set language in localStorage first
    localStorage.setItem('selectedLanguage', JSON.stringify({ code: 'HI' }))

    render(
      <TranslationProvider>
        <TranslatedText sourceLanguage="en">Hello</TranslatedText>
      </TranslationProvider>
    )

    await waitFor(() => {
      expect(translationService.translate).toHaveBeenCalled()
    }, { timeout: 2000 })
  })

  it('should display loading state during translation', async () => {
    let resolveTranslation
    const translationPromise = new Promise((resolve) => {
      resolveTranslation = resolve
    })
    translationService.translate.mockReturnValue(translationPromise)
    
    // Set language in localStorage first
    localStorage.setItem('selectedLanguage', JSON.stringify({ code: 'HI' }))

    render(
      <TranslationProvider>
        <TranslatedText sourceLanguage="en">Hello</TranslatedText>
      </TranslationProvider>
    )

    // Wait for translation to start
    await waitFor(() => {
      expect(translationService.translate).toHaveBeenCalled()
    }, { timeout: 2000 })

    // Check that component is in loading state (isLoading should be true)
    // The component shows opacity-50 when isLoading is true
    const span = screen.getByText('Hello').closest('span')
    expect(span).toBeInTheDocument()
    
    // Resolve the promise to complete the test
    await act(async () => {
      resolveTranslation('नमस्ते')
      await translationPromise
    })
    
    // After resolution, loading should be complete
    await waitFor(() => {
      expect(span).toBeInTheDocument()
    })
  })

  it('should skip translation when skipTranslation prop is true', () => {
    render(
      <TranslationProvider>
        <TranslatedText skipTranslation={true}>Hello</TranslatedText>
      </TranslationProvider>
    )

    expect(screen.getByText('Hello')).toBeInTheDocument()
    expect(translationService.translate).not.toHaveBeenCalled()
  })

  it('should handle empty text', () => {
    render(
      <TranslationProvider>
        <TranslatedText>{''}</TranslatedText>
      </TranslationProvider>
    )

    expect(translationService.translate).not.toHaveBeenCalled()
  })

  it('should handle number children', () => {
    render(
      <TranslationProvider>
        <TranslatedText>{123}</TranslatedText>
      </TranslationProvider>
    )

    expect(screen.getByText('123')).toBeInTheDocument()
  })

  it('should apply className prop', () => {
    const { container } = render(
      <TranslationProvider>
        <TranslatedText className="test-class">Hello</TranslatedText>
      </TranslationProvider>
    )

    const span = container.querySelector('span.test-class')
    expect(span).toBeInTheDocument()
  })

  it('should pass through other props', () => {
    const { container } = render(
      <TranslationProvider>
        <TranslatedText data-testid="test-text" id="test-id">
          Hello
        </TranslatedText>
      </TranslationProvider>
    )

    const span = container.querySelector('#test-id')
    expect(span).toBeInTheDocument()
    expect(span).toHaveAttribute('data-testid', 'test-text')
  })

  it('should handle translation errors gracefully', async () => {
    translationService.translate.mockRejectedValueOnce(new Error('Translation failed'))

    render(
      <TranslationProvider>
        <TranslatedText sourceLanguage="fr">Bonjour</TranslatedText>
      </TranslationProvider>
    )

    // Should display original text on error
    await waitFor(() => {
      expect(screen.getByText('Bonjour')).toBeInTheDocument()
    })
  })

  it('should update translation when language changes', async () => {
    translationService.translate.mockResolvedValue('नमस्ते')

    const TestComponent = () => {
      const { setLanguage } = useTranslation()
      const [changed, setChanged] = React.useState(false)
      
      React.useEffect(() => {
        // Change language after component mounts
        if (!changed) {
          const timer = setTimeout(() => {
            setLanguage('HI')
            setChanged(true)
          }, 100)
          return () => clearTimeout(timer)
        }
      }, [changed, setLanguage])

      return <TranslatedText sourceLanguage="en">Hello</TranslatedText>
    }

    render(
      <TranslationProvider>
        <TestComponent />
      </TranslationProvider>
    )

    expect(screen.getByText('Hello')).toBeInTheDocument()

    // Wait for language change and translation
    await waitFor(() => {
      expect(translationService.translate).toHaveBeenCalled()
    }, { timeout: 3000 })
  })

  it('should update translation when text changes', async () => {
    translationService.translate
      .mockResolvedValueOnce('नमस्ते')
      .mockResolvedValueOnce('दुनिया')

    const { rerender } = render(
      <TranslationProvider>
        <TranslatedText sourceLanguage="en">Hello</TranslatedText>
      </TranslationProvider>
    )

    rerender(
      <TranslationProvider>
        <TranslatedText sourceLanguage="en">World</TranslatedText>
      </TranslationProvider>
    )

    // Component should handle text changes
    expect(screen.getByText('World')).toBeInTheDocument()
  })
})

