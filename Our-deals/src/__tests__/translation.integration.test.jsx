import { describe, it, expect, beforeEach, vi } from 'vitest'
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TranslationProvider } from '../contexts/TranslationContext'
import TranslatedText from '../components/TranslatedText'
import LanguageSelector from '../components/LanguageSelector'
import { useTranslation } from '../hooks/useTranslation'
import { useDynamicTranslation } from '../hooks/useDynamicTranslation'
import * as translationService from '../services/translationService'

// Mock the translation service
vi.mock('../services/translationService', () => ({
  translate: vi.fn(),
  clearTranslationCache: vi.fn(),
  getCacheStats: vi.fn(),
}))

const TestApp = () => {
  const { translate } = useTranslation()
  const { translateObject } = useDynamicTranslation()

  return (
    <div>
      <LanguageSelector />
      <TranslatedText sourceLanguage="en">Hello World</TranslatedText>
      <div data-testid="translated-content">Content</div>
    </div>
  )
}

describe('Translation Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should translate content when language is changed via LanguageSelector', async () => {
    translationService.translate.mockResolvedValue('नमस्ते दुनिया')

    const user = userEvent.setup()
    render(
      <TranslationProvider>
        <TestApp />
      </TranslationProvider>
    )

    // Change language to Hindi
    const button = screen.getByRole('button')
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByText('हिंदी - HI')).toBeInTheDocument()
    })

    const hindiOption = screen.getByText('हिंदी - HI')
    await user.click(hindiOption)

    // TranslatedText should trigger translation
    await waitFor(() => {
      expect(translationService.translate).toHaveBeenCalled()
    })
  })

  it('should clear cache when language changes', async () => {
    const user = userEvent.setup()
    render(
      <TranslationProvider>
        <TestApp />
      </TranslationProvider>
    )

    const button = screen.getByRole('button')
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByText('हिंदी - HI')).toBeInTheDocument()
    })

    const hindiOption = screen.getByText('हिंदी - HI')
    await user.click(hindiOption)

    await waitFor(() => {
      expect(translationService.clearTranslationCache).toHaveBeenCalled()
    })
  })

  it('should persist language selection across page reloads', async () => {
    const user = userEvent.setup()
    const { unmount } = render(
      <TranslationProvider>
        <TestApp />
      </TranslationProvider>
    )

    // Change language
    const button = screen.getByRole('button')
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByText('मराठी - MR')).toBeInTheDocument()
    })

    const marathiOption = screen.getByText('मराठी - MR')
    await user.click(marathiOption)

    await waitFor(() => {
      const saved = JSON.parse(localStorage.getItem('selectedLanguage'))
      expect(saved.code).toBe('MR')
    })

    // Unmount and remount (simulating page reload)
    unmount()

    render(
      <TranslationProvider>
        <TestApp />
      </TranslationProvider>
    )

    // Language should be restored
    await waitFor(() => {
      const button = screen.getByRole('button')
      expect(button).toHaveTextContent('MR')
    })
  })

  it('should handle multiple TranslatedText components', async () => {
    translationService.translate
      .mockResolvedValue('नमस्ते दुनिया')

    const MultipleTexts = () => (
      <div>
        <TranslatedText sourceLanguage="en">Hello</TranslatedText>
        <TranslatedText sourceLanguage="en">World</TranslatedText>
      </div>
    )

    const user = userEvent.setup()
    render(
      <TranslationProvider>
        <LanguageSelector />
        <MultipleTexts />
      </TranslationProvider>
    )

    // Change language
    const button = screen.getByRole('button')
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByText('हिंदी - HI')).toBeInTheDocument()
    })

    const hindiOption = screen.getByText('हिंदी - HI')
    await user.click(hindiOption)

    // Both texts should trigger translation (may be called more than once due to re-renders)
    await waitFor(() => {
      expect(translationService.translate).toHaveBeenCalled()
      // Check that translate was called at least twice (once per component)
      expect(translationService.translate.mock.calls.length).toBeGreaterThanOrEqual(2)
    })
  })

  it('should work with useDynamicTranslation hook', async () => {
    translationService.translate.mockResolvedValue(['नमस्ते', 'विक्रेता'])

    const DynamicTranslationTest = () => {
      const { translateObject } = useDynamicTranslation()
      const [data] = React.useState({
        name: 'Hello',
        description: 'Vendor',
      })
      const [translated, setTranslated] = React.useState(null)

      React.useEffect(() => {
        translateObject(data, ['name', 'description']).then(setTranslated)
      }, [translateObject])

      return (
        <div>
          {translated && (
            <div>
              <div data-testid="translated-name">{translated.name}</div>
              <div data-testid="translated-description">{translated.description}</div>
            </div>
          )}
        </div>
      )
    }

    render(
      <TranslationProvider>
        <DynamicTranslationTest />
      </TranslationProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('translated-name')).toHaveTextContent('नमस्ते')
      expect(screen.getByTestId('translated-description')).toHaveTextContent('विक्रेता')
    })
  })

  it('should handle language change event propagation', async () => {
    const eventListener = vi.fn()
    window.addEventListener('languageChanged', eventListener)

    const user = userEvent.setup()
    render(
      <TranslationProvider>
        <TestApp />
      </TranslationProvider>
    )

    const button = screen.getByRole('button')
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByText('ગુજરાતી - GU')).toBeInTheDocument()
    })

    const gujaratiOption = screen.getByText('ગુજરાતી - GU')
    await user.click(gujaratiOption)

    await waitFor(() => {
      expect(eventListener).toHaveBeenCalled()
      // Get the last call (language change happens after initial render)
      const calls = eventListener.mock.calls
      const lastCall = calls[calls.length - 1]
      const event = lastCall[0]
      expect(event.detail.language).toBe('gu')
      expect(event.detail.code).toBe('GU')
    }, { timeout: 1000 })

    window.removeEventListener('languageChanged', eventListener)
  })

  it('should handle translation errors gracefully in integration', async () => {
    translationService.translate.mockRejectedValue(new Error('API Error'))

    const user = userEvent.setup()
    render(
      <TranslationProvider>
        <TestApp />
      </TranslationProvider>
    )

    // Change language
    const button = screen.getByRole('button')
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByText('हिंदी - HI')).toBeInTheDocument()
    })

    const hindiOption = screen.getByText('हिंदी - HI')
    await user.click(hindiOption)

    // Should still display original text on error (TranslatedText falls back to original)
    await waitFor(() => {
      // The text might be split across elements, so check if it exists
      const textContent = document.body.textContent || ''
      expect(textContent).toContain('Hello World')
    }, { timeout: 1000 })
  })
})

