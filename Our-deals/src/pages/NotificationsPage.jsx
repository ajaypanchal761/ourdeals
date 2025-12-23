import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getNotifications } from '../services/notificationService'
import TranslatedText from '../components/TranslatedText'
import { useTranslation } from '../hooks/useTranslation'

function NotificationsPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const authToken = localStorage.getItem('auth_token')
    if (!authToken) {
      navigate('/login')
      return
    }

    const fetchNotifications = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await getNotifications()
        if (response?.status === true && Array.isArray(response?.data)) {
          // Sort by latest first (newest created_at first)
          const sorted = [...response.data].sort((a, b) => {
            const dateA = new Date(a.created_at)
            const dateB = new Date(b.created_at)
            return dateB - dateA
          })
          setNotifications(sorted)
        } else {
          setNotifications([])
          setError(response?.message || 'No notifications found')
        }
      } catch (err) {
        console.error('Error fetching notifications:', err)
        setError(err.response?.data?.message || 'Failed to load notifications')
        setNotifications([])
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [navigate])

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return t('Just now')
    if (diffMins < 60) {
      return diffMins === 1 ? t('1 minute ago') : `${diffMins} ${t('minutes ago')}`
    }
    if (diffHours < 24) {
      return diffHours === 1 ? t('1 hour ago') : `${diffHours} ${t('hours ago')}`
    }
    if (diffDays < 7) {
      return diffDays === 1 ? t('1 day ago') : `${diffDays} ${t('days ago')}`
    }
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#13335a] to-[#1e4a7a] px-[clamp(16px,2vw,24px)] py-[clamp(16px,2vw,20px)] flex justify-between items-center fixed top-0 left-0 right-0 z-[1000] shadow-[0_2px_12px_rgba(0,0,0,0.15)]">
        <button
          className="bg-transparent border-none cursor-pointer p-[clamp(3px,0.4vw,4px)] flex items-center justify-center transition-colors rounded-full w-[clamp(28px,3.5vw,32px)] h-[clamp(28px,3.5vw,32px)] text-white hover:bg-white/20 active:bg-white/30"
          onClick={() => navigate(-1)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[clamp(20px,2.5vw,24px)] h-[clamp(20px,2.5vw,24px)]">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h2 className="text-[clamp(18px,2.5vw,24px)] md:text-[clamp(16px,2vw,20px)] font-bold text-white m-0 flex-1 text-center leading-[1.3]">
          <TranslatedText>Notifications</TranslatedText>
        </h2>
        <div style={{ width: '24px' }}></div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-[clamp(12px,2vw,20px)] py-[clamp(16px,2vw,24px)] pt-[clamp(70px,10vw,90px)] pb-[clamp(20px,3vw,32px)] md:pt-[clamp(64px,8vw,80px)] md:pb-[clamp(20px,3vw,32px)]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 border-4 border-[#13335a] border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className="text-gray-500 text-[clamp(14px,3.5vw,16px)]">
              <TranslatedText>Loading notifications...</TranslatedText>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[clamp(48px,12vw,64px)] h-[clamp(48px,12vw,64px)] text-red-400 mb-4">
              <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="text-red-500 text-[clamp(14px,3.5vw,16px)] text-center font-medium">
              {t(error)}
            </div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-[clamp(80px,20vw,120px)] h-[clamp(80px,20vw,120px)] bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[clamp(40px,10vw,48px)] h-[clamp(40px,10vw,48px)] text-gray-400">
                <path d="M18 8A6 6 0 0 0 6 8C6 11.3137 3.31371 14 0 14H18C14.6863 14 12 11.3137 12 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-[clamp(16px,4vw,18px)] text-gray-600 font-medium mb-2">
              <TranslatedText>No notifications yet</TranslatedText>
            </p>
            <p className="text-[clamp(13px,3vw,15px)] text-gray-500 text-center max-w-sm">
              <TranslatedText>You'll see your notifications here when you receive them</TranslatedText>
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-[clamp(10px,2.5vw,14px)] max-w-3xl mx-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`group relative bg-white rounded-[clamp(12px,3vw,16px)] p-[clamp(14px,3.5vw,20px)] shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-all duration-200 border-l-4 ${!notification.isRead
                    ? 'border-l-[#13335a] bg-gradient-to-r from-blue-50/50 to-white'
                    : 'border-l-transparent'
                  }`}
              >
                <div className="flex items-start gap-[clamp(12px,3vw,16px)]">
                  {/* Notification Icon */}
                  <div className={`flex-shrink-0 w-[clamp(40px,10vw,48px)] h-[clamp(40px,10vw,48px)] rounded-full flex items-center justify-center ${!notification.isRead
                      ? 'bg-[#13335a]/10'
                      : 'bg-gray-100'
                    }`}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`w-[clamp(20px,5vw,24px)] h-[clamp(20px,5vw,24px)] ${!notification.isRead ? 'text-[#13335a]' : 'text-gray-500'
                        }`}
                    >
                      <path d="M18 8A6 6 0 0 0 6 8C6 11.3137 3.31371 14 0 14H18C14.6863 14 12 11.3137 12 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>

                  {/* Notification Content */}
                  <div className="flex-1 min-w-0">
                    <div className="mb-[clamp(6px,1.5vw,8px)]">
                      <h3 className={`text-[clamp(16px,4vw,20px)] font-bold m-0 leading-tight ${!notification.isRead ? 'text-[#13335a]' : 'text-gray-800'
                        }`}>
                        <TranslatedText>{notification.title}</TranslatedText>
                      </h3>
                    </div>
                    <p className="text-[clamp(14px,3.5vw,16px)] text-gray-700 m-0 leading-relaxed mb-[clamp(8px,2vw,10px)]">
                      <TranslatedText>{notification.message}</TranslatedText>
                    </p>
                    <div className="flex items-center gap-2">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-[clamp(12px,3vw,14px)] h-[clamp(12px,3vw,14px)] text-gray-400"
                      >
                        <path d="M12 8V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                      </svg>
                      <p className="text-[clamp(12px,3vw,13px)] text-gray-500 m-0 font-medium">
                        {formatDate(notification.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default NotificationsPage

