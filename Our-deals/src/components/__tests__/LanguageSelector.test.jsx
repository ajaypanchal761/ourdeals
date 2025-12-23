import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LanguageSelector from '../LanguageSelector'
import { TranslationProvider } from '../../contexts/TranslationContext'

const wrapper = ({ children }) => (
  <TranslationProvider>{children}</TranslationProvider>
)

describe('LanguageSelector', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should render language selector button', () => {
    render(<LanguageSelector />, { wrapper })

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('should display current language code', () => {
    render(<LanguageSelector />, { wrapper })

    expect(screen.getByText('EN')).toBeInTheDocument()
  })

  it('should open dropdown when clicked', async () => {
    const user = userEvent.setup()
    render(<LanguageSelector />, { wrapper })

    const button = screen.getByRole('button')
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByText('English - EN')).toBeInTheDocument()
      expect(screen.getByText('हिंदी - HI')).toBeInTheDocument()
    })
  })

  it('should display all available languages', async () => {
    const user = userEvent.setup()
    render(<LanguageSelector />, { wrapper })

    const button = screen.getByRole('button')
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByText('English - EN')).toBeInTheDocument()
      expect(screen.getByText('हिंदी - HI')).toBeInTheDocument()
      expect(screen.getByText('मराठी - MR')).toBeInTheDocument()
      expect(screen.getByText('বেঙ্গলি - BN')).toBeInTheDocument()
      expect(screen.getByText('ગુજરાતી - GU')).toBeInTheDocument()
      expect(screen.getByText('ಕನ್ನಡ - KN')).toBeInTheDocument()
      expect(screen.getByText('தமிழ் - TA')).toBeInTheDocument()
    })
  })

  it('should change language when language option is clicked', async () => {
    const user = userEvent.setup()
    render(<LanguageSelector />, { wrapper })

    const button = screen.getByRole('button')
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByText('हिंदी - HI')).toBeInTheDocument()
    })

    const hindiOption = screen.getByText('हिंदी - HI')
    await user.click(hindiOption)

    await waitFor(() => {
      // Language should be saved to localStorage
      const saved = JSON.parse(localStorage.getItem('selectedLanguage'))
      expect(saved.code).toBe('HI')
    })
  })

  it('should close dropdown when language is selected', async () => {
    const user = userEvent.setup()
    render(<LanguageSelector />, { wrapper })

    const button = screen.getByRole('button')
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByText('हिंदी - HI')).toBeInTheDocument()
    })

    const hindiOption = screen.getByText('हिंदी - HI')
    await user.click(hindiOption)

    await waitFor(() => {
      expect(screen.queryByText('हिंदी - HI')).not.toBeInTheDocument()
    })
  })

  it('should highlight selected language', async () => {
    const user = userEvent.setup()
    render(<LanguageSelector />, { wrapper })

    const button = screen.getByRole('button')
    await user.click(button)

    await waitFor(() => {
      const englishOption = screen.getByText('English - EN')
      expect(englishOption).toHaveClass('bg-[#e8f0f7]')
    })
  })

  it('should close dropdown when clicking outside', async () => {
    const user = userEvent.setup()
    render(
      <div>
        <LanguageSelector />
        <div data-testid="outside">Outside</div>
      </div>,
      { wrapper }
    )

    const button = screen.getByRole('button')
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByText('हिंदी - HI')).toBeInTheDocument()
    })

    const outside = screen.getByTestId('outside')
    await user.click(outside)

    await waitFor(() => {
      expect(screen.queryByText('हिंदी - HI')).not.toBeInTheDocument()
    })
  })

  it('should update displayed language code when language changes', async () => {
    const user = userEvent.setup()
    render(<LanguageSelector />, { wrapper })

    // Initially EN
    expect(screen.getByText('EN')).toBeInTheDocument()

    const button = screen.getByRole('button')
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByText('हिंदी - HI')).toBeInTheDocument()
    })

    const hindiOption = screen.getByText('हिंदी - HI')
    await user.click(hindiOption)

    await waitFor(() => {
      // Button should now show HI
      const updatedButton = screen.getByRole('button')
      expect(updatedButton).toHaveTextContent('HI')
    })
  })

  it('should handle language change event', async () => {
    const user = userEvent.setup()
    render(<LanguageSelector />, { wrapper })

    const eventListener = vi.fn()
    window.addEventListener('languageChanged', eventListener)

    const button = screen.getByRole('button')
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByText('मराठी - MR')).toBeInTheDocument()
    })

    const marathiOption = screen.getByText('मराठी - MR')
    await user.click(marathiOption)

    await waitFor(() => {
      expect(eventListener).toHaveBeenCalled()
    })

    window.removeEventListener('languageChanged', eventListener)
  })

  it('should close dropdown on language change event', async () => {
    const user = userEvent.setup()
    render(<LanguageSelector />, { wrapper })

    const button = screen.getByRole('button')
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByText('हिंदी - HI')).toBeInTheDocument()
    })

    // Simulate language change event
    window.dispatchEvent(
      new CustomEvent('languageChanged', {
        detail: { language: 'hi', code: 'HI' },
      })
    )

    await waitFor(() => {
      expect(screen.queryByText('हिंदी - HI')).not.toBeInTheDocument()
    })
  })
})



