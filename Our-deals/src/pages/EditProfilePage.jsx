import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { updateProfile } from '../services/userService'
import TranslatedText from '../components/TranslatedText'
import { useTranslation } from '../hooks/useTranslation'

function EditProfilePage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('userData')
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser)
        setName(parsed.name || '')
        setEmail(parsed.email || '')
        setPhone(parsed.phone || parsed.mobile || parsed.mobileNumber || '')
        setCity(parsed.city || '')
        setAddress(parsed.address || '')
      } catch (err) {
        console.error('EditProfilePage: Error parsing userData from localStorage', err)
      }
    }
  }, [])

  const handleUpdate = async () => {
    if (!name.trim()) {
      setError(t('Name is required'))
      return
    }

    setLoading(true)
    setError('')

    try {
      const savedUser = JSON.parse(localStorage.getItem('userData') || '{}')
      const userId = savedUser.id

      // Load location from localStorage (saved by locationService under "userLocation")
      let lat = savedUser.lat || null
      let long = savedUser.long || null
      try {
        const savedLocation = JSON.parse(localStorage.getItem('userLocation') || 'null')
        if (savedLocation) {
          lat = savedLocation.lat ?? lat
          // locationService stores longitude as "lng"
          long = savedLocation.lng ?? savedLocation.long ?? long
        }
      } catch {
        // ignore location parse errors, fall back to whatever is in savedUser
      }

      if (!userId) {
        setError(t('User ID not found. Please login again.'))
        setLoading(false)
        return
      }

      const phoneNumber = phone
        ? (phone.startsWith('+91') ? phone.replace('+91', '') : phone).replace(/\D/g, '')
        : ''

      const response = await updateProfile({
        user_id: userId,
        name: name.trim(),
        email: email.trim(),
        phone: phoneNumber,
        city: city.trim(),
        address: address.trim(),
        lat: lat,
        long: long,
      })

      if (response.status === true && response.user) {
        const apiUser = response.user
        // Overwrite localStorage userData with latest basic fields from API response
        const updatedData = {
          id: apiUser.id ?? userId,
          name: apiUser.name ?? name.trim(),
          email: apiUser.email ?? email.trim(),
          phone: apiUser.phone ?? phoneNumber,
          city: apiUser.city ?? city.trim(),
          address: apiUser.address ?? address.trim(),
        }

        localStorage.setItem('userData', JSON.stringify(updatedData))
        window.dispatchEvent(new CustomEvent('userLogin'))
        navigate('/profile', { replace: true })
      } else {
        setError(response.message || 'Failed to update profile')
      }
    } catch (err) {
      console.error('EditProfilePage: Update Profile Error:', err)
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to update profile. Please try again.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-[500px] mx-auto shadow-[0_0_20px_rgba(0,0,0,0.1)] md:max-w-full md:h-screen md:max-h-screen md:overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#13335a] to-[#1e4a7a] px-[clamp(16px,2vw,24px)] py-[clamp(16px,2vw,20px)] flex justify-between items-center fixed top-0 left-0 right-0 z-[1000] flex-shrink-0 w-full max-w-[500px] md:max-w-full mx-auto shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
        <button
          className="bg-transparent border-none text-white cursor-pointer p-0 w-[clamp(28px,3.5vw,32px)] h-[clamp(28px,3.5vw,32px)] flex items-center justify-center rounded-full transition-colors hover:bg-white/20"
          onClick={() => navigate('/profile')}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 12H5M5 12L12 19M5 12L12 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h2 className="text-[clamp(18px,2.5vw,24px)] font-bold text-white m-0"><TranslatedText>Edit Profile</TranslatedText></h2>
        <div className="w-[clamp(28px,3.5vw,32px)]" />
      </div>

      {/* Content */}
      <div className="px-[clamp(16px,2vw,24px)] py-[clamp(16px,2vw,24px)] pt-[calc(clamp(16px,2vw,20px)*2+clamp(18px,2.5vw,24px)+clamp(16px,2vw,24px))] flex-1 overflow-y-auto overflow-x-hidden [-webkit-overflow-scrolling:touch] min-h-0 md:flex-1 md:overflow-y-auto md:overflow-x-hidden md:min-h-0 md:pt-[calc(clamp(16px,2vw,20px)*2+clamp(18px,2.5vw,24px)+clamp(16px,2vw,24px))] md:pb-20">

        {error && (
          <div className="mb-[clamp(14px,3.5vw,20px)] p-[clamp(8px,2vw,10px)] bg-red-50 border border-red-200 rounded-[clamp(6px,1.5vw,8px)] text-red-700 text-[clamp(12px,3vw,14px)]">
            <TranslatedText>{error}</TranslatedText>
          </div>
        )}

        <div className="space-y-[clamp(12px,2.5vw,16px)] mb-[clamp(18px,3.5vw,22px)]">
          {/* Name */}
          <div className="flex items-center border border-gray-200 rounded-[clamp(6px,1.5vw,8px)] py-[clamp(9px,2.2vw,11px)] px-[clamp(10px,2.5vw,14px)] bg-white focus-within:border-[#13335a]">
            <input
              type="text"
              className="flex-1 border-none outline-none text-[clamp(13px,3.2vw,15px)] text-[#1a1a1a] bg-transparent"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('Enter your name')}
              required
            />
          </div>

          {/* Email */}
          <div className="flex items-center border border-gray-200 rounded-[clamp(6px,1.5vw,8px)] py-[clamp(9px,2.2vw,11px)] px-[clamp(10px,2.5vw,14px)] bg-white focus-within:border-[#13335a]">
            <input
              type="email"
              className="flex-1 border-none outline-none text-[clamp(13px,3.2vw,15px)] text-[#1a1a1a] bg-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('Enter your email')}
            />
          </div>

          {/* Phone */}
          <div className="flex items-center border border-gray-200 rounded-[clamp(6px,1.5vw,8px)] py-[clamp(9px,2.2vw,11px)] px-[clamp(10px,2.5vw,14px)] bg-white focus-within:border-[#13335a]">
            <span className="bg-gray-50 px-2 py-1 text-[#13335a] font-semibold border-r border-gray-300 text-[clamp(12px,3vw,14px)]">
              +91
            </span>
            <input
              type="tel"
              className="flex-1 border-none outline-none text-[clamp(13px,3.2vw,15px)] text-[#1a1a1a] bg-transparent ml-2"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))
              }
              placeholder={t('Enter phone number')}
              maxLength="10"
            />
          </div>

          {/* City */}
          <div className="flex items-center border border-gray-200 rounded-[clamp(6px,1.5vw,8px)] py-[clamp(9px,2.2vw,11px)] px-[clamp(10px,2.5vw,14px)] bg-white focus-within:border-[#13335a]">
            <input
              type="text"
              className="flex-1 border-none outline-none text-[clamp(13px,3.2vw,15px)] text-[#1a1a1a] bg-transparent"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder={t('Enter your city')}
            />
          </div>

          {/* Address */}
          <div className="flex items-start border border-gray-200 rounded-[clamp(6px,1.5vw,8px)] py-[clamp(9px,2.2vw,11px)] px-[clamp(10px,2.5vw,14px)] bg-white focus-within:border-[#13335a]">
            <textarea
              className="flex-1 border-none outline-none text-[clamp(13px,3.2vw,15px)] text-[#1a1a1a] bg-transparent resize-none min-h-[70px]"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={t('Enter your address')}
            />
          </div>
        </div>

        <button
          className="w-full bg-[#13335a] text-white border-none py-[clamp(10px,2.5vw,12px)] px-[clamp(16px,4vw,20px)] rounded-[clamp(6px,1.5vw,8px)] font-semibold text-[clamp(13px,3.2vw,15px)] cursor-pointer transition-colors leading-[1.5] hover:bg-[#0f2440] disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={handleUpdate}
          disabled={!name.trim() || loading}
        >
          {loading ? <TranslatedText>Updating...</TranslatedText> : <TranslatedText>Save Changes</TranslatedText>}
        </button>
      </div>
    </div>
  )
}

export default EditProfilePage


