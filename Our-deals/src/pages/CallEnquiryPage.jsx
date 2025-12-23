import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUserEnquiries } from '../services/enquiryService'
import TranslatedText from '../components/TranslatedText'
import { useTranslation } from '../hooks/useTranslation'

function CallEnquiryPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [missingAuth, setMissingAuth] = useState(false)

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        setLoading(true)
        setError('')
        const token = localStorage.getItem('auth_token')
        if (!token) {
          setMissingAuth(true)
          setEnquiries([])
          return
        }
        setMissingAuth(false)
        const response = await getUserEnquiries()
        if ((response?.status === 'success' || response?.status === true) && Array.isArray(response?.data)) {
          const sorted = [...response.data].sort((a, b) => {
            const aDate = new Date(a?.created_at || a?.date || 0).getTime()
            const bDate = new Date(b?.created_at || b?.date || 0).getTime()
            return bDate - aDate
          })
          setEnquiries(sorted)
        } else {
          setEnquiries([])
          setError(response?.message || 'Failed to load enquiries')
        }
      } catch (err) {
        const message = err?.response?.data?.message || err?.message || 'Failed to load enquiries'
        setError(message)
        setEnquiries([])
      } finally {
        setLoading(false)
      }
    }

    fetchEnquiries()
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return t('N/A')
    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) return dateString
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-white flex flex-col pb-20">
      {/* Header - Fixed on Top */}
      <div className="bg-gradient-to-br from-[#13335a] to-[#1e4a7a] px-[clamp(16px,2vw,24px)] py-[clamp(16px,2vw,20px)] flex justify-between items-center fixed top-0 left-0 right-0 z-[1000] rounded-b-[clamp(12px,1.5vw,16px)] md:rounded-none shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
        <button className="bg-transparent border-none cursor-pointer p-[clamp(3px,0.4vw,4px)] flex items-center justify-center transition-colors rounded-full w-[clamp(28px,3.5vw,32px)] h-[clamp(28px,3.5vw,32px)] text-white hover:bg-white/20" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[clamp(20px,2.5vw,24px)] h-[clamp(20px,2.5vw,24px)]">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h2 className="text-[clamp(18px,2.5vw,24px)] md:text-[clamp(16px,2vw,20px)] font-bold text-white m-0 flex-1 text-center leading-[1.3]">
          <TranslatedText>Call Enquiry</TranslatedText>
        </h2>
        <div style={{ width: '24px' }}></div>
      </div>

      {/* Content with top margin to clear fixed header */}
      <div className="flex-1 px-[clamp(20px,2.5vw,32px)] py-[clamp(24px,3vw,32px)] min-h-[calc(100vh-clamp(60px,10vw,80px)-80px)] mt-[clamp(70px,10vw,90px)] md:mt-[clamp(60px,8vw,80px)]">
        <div className="max-w-5xl mx-auto flex flex-col gap-4">
          {missingAuth && (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <p className="text-[clamp(15px,2vw,17px)] text-gray-700 font-semibold text-center">
                <TranslatedText>Please login or sign up to view your call enquiries.</TranslatedText>
              </p>
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 rounded-lg bg-[#13335a] text-white font-semibold text-sm md:text-base hover:bg-[#0f2440]"
                  onClick={() => navigate('/login')}
                >
                  <TranslatedText>Login</TranslatedText>
                </button>
                <button
                  className="px-4 py-2 rounded-lg border border-[#13335a] text-[#13335a] font-semibold text-sm md:text-base hover:bg-[#13335a] hover:text-white"
                  onClick={() => navigate('/register')}
                >
                  <TranslatedText>Sign Up</TranslatedText>
                </button>
              </div>
            </div>
          )}

          {loading && !missingAuth && (
            <div className="flex items-center justify-center py-10">
              <p className="text-[clamp(14px,1.8vw,16px)] text-gray-600 m-0">
                <TranslatedText>Loading enquiries...</TranslatedText>
              </p>
            </div>
          )}

          {!loading && !missingAuth && error && (
            <div className="flex items-center justify-center py-6">
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-[clamp(13px,1.8vw,15px)]">
                {t(error)}
              </div>
            </div>
          )}

          {!loading && !missingAuth && !error && enquiries.length === 0 && (
            <div className="flex items-center justify-center py-10">
              <p className="text-[clamp(16px,2vw,18px)] md:text-[clamp(14px,1.8vw,16px)] text-gray-500 text-center m-0 font-normal">
                <TranslatedText>No call enquiries found.</TranslatedText>
              </p>
            </div>
          )}

          {!loading && !missingAuth && !error && enquiries.length > 0 && (
            <div className="grid grid-cols-1 gap-3">
              {enquiries.map((enquiry) => {
                const vendor = enquiry.vendor || {}
                const vendorName = vendor.vendor_name || vendor.name || vendor.brand_name || 'Vendor'
                const brandName = vendor.brand_name || ''

                return (
                  <div
                    key={enquiry.id}
                    className="bg-white border border-gray-200 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.05)] p-4 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex flex-col">
                        <span className="text-[clamp(15px,2vw,17px)] font-bold text-[#13335a]">
                          <TranslatedText>{vendorName}</TranslatedText>
                        </span>
                        {brandName && (
                          <span className="text-[clamp(12px,1.6vw,14px)] text-gray-600 font-semibold">
                            <TranslatedText>{brandName}</TranslatedText>
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-[clamp(12px,1.6vw,14px)] font-semibold text-gray-700">
                          <TranslatedText>Date</TranslatedText>
                        </span>
                        <div className="text-[clamp(13px,1.8vw,15px)] text-black font-bold">{formatDate(enquiry.date)}</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CallEnquiryPage

