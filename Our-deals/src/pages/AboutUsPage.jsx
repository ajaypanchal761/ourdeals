import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchPages } from '../services/pagesService'
import TranslatedText from '../components/TranslatedText'
import { useTranslation } from '../hooks/useTranslation'

function AboutUsPage() {
  const navigate = useNavigate()
  const { t, translate, currentLanguage } = useTranslation()
  const [content, setContent] = useState('')
  const [translatedContent, setTranslatedContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadPage = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetchPages()

        const isOk = response?.success === true || response?.status === true
        const pages = Array.isArray(response?.data) ? response.data : response?.data?.data || []

        if (isOk && Array.isArray(pages) && pages.length > 0) {
          const aboutPage =
            pages.find((page) => page.title?.toLowerCase() === 'about us') ||
            pages.find((page) => page.title?.toLowerCase().includes('about')) ||
            pages[0]

          if (aboutPage?.description) {
            setContent(aboutPage.description)
            setTranslatedContent(aboutPage.description)
          } else {
            setError('About Us content not available.')
          }
        } else {
          setError('Unable to load About Us content.')
        }
      } catch (err) {
        console.error('Error fetching About Us page:', err)
        setError('Failed to load About Us content. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadPage()
  }, [])

  // Translate content when language changes
  useEffect(() => {
    if (!content) return

    if (currentLanguage === 'en') {
      setTranslatedContent(content)
      return
    }

    let isMounted = true
    const performTranslate = async () => {
      try {
        const result = await translate(content)
        if (isMounted) {
          setTranslatedContent(result || content)
        }
      } catch (err) {
        if (isMounted) setTranslatedContent(content)
      }
    }

    // Tiny debounce/delay
    const timer = setTimeout(performTranslate, 100)
    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [content, currentLanguage, translate])

  return (
    <div className="fixed inset-0 w-full bg-white animate-[fadeInScale_0.3s_ease-out] overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#13335a] to-[#1e4a7a] px-[clamp(12px,3vw,20px)] py-[clamp(12px,2.5vw,16px)] flex justify-between items-center sticky top-0 z-10 flex-shrink-0">
        <button
          className="bg-transparent border-none cursor-pointer p-[clamp(2px,0.5vw,3px)] flex items-center justify-center transition-colors rounded-full w-[clamp(28px,7vw,32px)] h-[clamp(28px,7vw,32px)] hover:bg-white/20"
          onClick={() => navigate(-1)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[clamp(18px,4.5vw,22px)] h-[clamp(18px,4.5vw,22px)]"
          >
            <path
              d="M19 12H5M5 12L12 19M5 12L12 5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h2 className="text-[clamp(16px,4vw,20px)] font-bold text-white m-0 flex-1 text-center leading-[1.3]">
          <TranslatedText>About Us</TranslatedText>
        </h2>
        <div style={{ width: 'clamp(28px,7vw,32px)' }}></div>
      </div>

      {/* Content */}
      <div className="px-[clamp(16px,2vw,24px)] md:px-[clamp(16px,2vw,24px)] py-[clamp(16px,2vw,24px)] pb-[clamp(24px,4vw,32px)] flex-1 overflow-y-auto">
        {loading && (
          <div className="text-center text-gray-500 text-[clamp(13px,3vw,15px)]">
            <TranslatedText>Loading About Us...</TranslatedText>
          </div>
        )}

        {!loading && error && (
          <div className="text-center text-red-500 text-[clamp(13px,3vw,15px)]">
            <TranslatedText>{error}</TranslatedText>
          </div>
        )}

        {!loading && !error && translatedContent && (
          <div
            className="prose max-w-none prose-sm md:prose lg:prose-lg prose-p:mb-3 prose-h3:text-[clamp(16px,3vw,20px)] prose-p:text-[clamp(13px,3vw,15px)] prose-p:text-gray-700"
            // Backend returns safe HTML (e.g., from CMS). We trust this content.
            dangerouslySetInnerHTML={{ __html: translatedContent }}
          />
        )}
      </div>
    </div>
  )
}

export default AboutUsPage


