import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { verifyOTP, resendOTP, checkOTPStatus } from '../services/otpService'
import TranslatedText from '../components/TranslatedText'
import { useTranslation } from '../hooks/useTranslation'

function OTPPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()

  // Get data from navigation state or URL params
  const { phone, name, address, city, fromPage } = location.state || {}

  const [mobileNumber, setMobileNumber] = useState(phone || '')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [otpTimer, setOtpTimer] = useState(null)
  const [resendCooldown, setResendCooldown] = useState(30)
  const [otpStatus, setOtpStatus] = useState(null)
  const [isExpired, setIsExpired] = useState(false)

  // Resend Cooldown Timer
  useEffect(() => {
    let timer
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0))
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [resendCooldown])

  // OTP Expiration Timer
  useEffect(() => {
    let interval = null
    if (otpTimer > 0) {
      setIsExpired(false)
      interval = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            setIsExpired(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (otpTimer === 0 && mobileNumber) {
      setIsExpired(true)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [otpTimer, mobileNumber])

  // Check OTP status periodically
  useEffect(() => {
    if (mobileNumber && otpTimer > 0) {
      const checkStatus = async () => {
        try {
          const status = await checkOTPStatus(mobileNumber)
          if (status?.data) {
            setOtpStatus(status.data)
            if (status.data.time_left_seconds !== undefined && status.data.time_left_seconds !== null) {
              const timeLeft = parseInt(status.data.time_left_seconds)
              if (timeLeft > 0) {
                setOtpTimer(timeLeft)
                setIsExpired(false)
              } else {
                setOtpTimer(0)
                setIsExpired(true)
              }
            }
          }
        } catch (error) {
          console.error('Error checking OTP status:', error)
        }
      }

      const interval = setInterval(checkStatus, 10000) // Check every 10 seconds
      return () => clearInterval(interval)
    }
  }, [mobileNumber, otpTimer])

  // Initialize timer when component mounts
  useEffect(() => {
    if (mobileNumber) {
      // Check OTP status first to get actual time from API
      const checkStatus = async () => {
        try {
          const status = await checkOTPStatus(mobileNumber)
          if (status?.data) {
            setOtpStatus(status.data)
            if (status.data.time_left_seconds !== undefined && status.data.time_left_seconds !== null) {
              const timeLeft = parseInt(status.data.time_left_seconds)
              if (timeLeft > 0) {
                setOtpTimer(timeLeft)
                setIsExpired(false)
              } else {
                setOtpTimer(0)
                setIsExpired(true)
              }
            } else {
              // If no time_left_seconds in response, use default 240 seconds
              setOtpTimer(240)
              setIsExpired(false)
            }
          } else {
            // Default fallback
            setOtpTimer(240)
            setIsExpired(false)
          }
        } catch (err) {
          console.error('Error checking OTP status:', err)
          // Default fallback on error
          setOtpTimer(240)
          setIsExpired(false)
        }
      }
      checkStatus()
    } else {
      // If no phone number, redirect back
      navigate(fromPage === 'register' ? '/register' : '/login', { replace: true })
    }
  }, [mobileNumber, navigate, fromPage])

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setError('')

    if (otp.length !== 4) {
      setError(t('Please enter a valid 4-digit OTP'))
      return
    }

    setLoading(true)
    try {
      const phone = mobileNumber

      console.log('=== OTP Page: Calling verifyOTP API ===')
      const response = await verifyOTP(phone, otp)

      console.log('Verify OTP response:', response)

      if (response.status === true && response.data) {
        // OTP verified successfully
        const { user, token } = response.data

        // Save token and user data
        if (token) {
          // Keep login token consistent with other flows
          localStorage.setItem('auth_token', token)
        }
        if (user) {
          const userData = {
            id: user.id ?? user.user_id ?? null,
            name: user.name || name || '',
            phone: user.phone || mobileNumber,
            email: user.email ?? null,
            address: user.address || address || '',
            city: user.city || city || '',
          }
          localStorage.setItem('userData', JSON.stringify(userData))
        }

        console.log('✅ OTP verified successfully, redirecting to home')

        window.dispatchEvent(new CustomEvent('userLogin'))
        const successMessage = fromPage === 'register' ? 'Registration Successful!' : 'Login Successful!'
        toast.success(successMessage)
        navigate('/', { replace: true })
      } else {
        setError(response.message || 'Invalid OTP')
      }
    } catch (err) {
      console.error('Verify OTP Error:', err)
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Invalid OTP. Please try again.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setError('')
    setLoading(true)
    try {
      const phone = mobileNumber

      console.log('=== OTP Page: Calling resendOTP API ===')
      const response = await resendOTP(phone)

      console.log('Resend OTP response:', response)

      if (response.status === true) {
        console.log('✅ OTP resent successfully')
        setOtp('')
        setIsExpired(false)
        setResendCooldown(30)
        toast.success('OTP Resent Successfully!')

        // Check OTP status to get actual time from API
        try {
          const status = await checkOTPStatus(phone)
          if (status?.data?.time_left_seconds !== undefined && status?.data?.time_left_seconds !== null) {
            const timeLeft = parseInt(status.data.time_left_seconds)
            if (timeLeft > 0) {
              setOtpTimer(timeLeft)
              setIsExpired(false)
            } else {
              setOtpTimer(0)
              setIsExpired(true)
            }
          } else {
            // Default fallback
            setOtpTimer(240)
            setIsExpired(false)
          }
        } catch (err) {
          console.error('Error checking OTP status:', err)
          // Default fallback on error
          setOtpTimer(240)
          setIsExpired(false)
        }
      } else {
        setError(response.message || 'Failed to resend OTP')
      }
    } catch (err) {
      console.error('Resend OTP Error:', err)
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to resend OTP. Please try again.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#13335a] to-[#1e4a7a] flex items-center justify-center p-[clamp(12px,3vw,20px)]">
      <div className="w-full max-w-[clamp(320px,90vw,400px)] bg-white rounded-[clamp(12px,2vw,16px)] shadow-2xl p-[clamp(16px,4vw,24px)] md:p-[clamp(20px,5vw,32px)]">
        <div className="text-center mb-[clamp(16px,4vw,24px)]">
          <h1 className="text-[clamp(24px,6vw,32px)] md:text-[clamp(28px,7vw,36px)] font-black text-[#13335a] mb-[clamp(4px,1vw,8px)]">Ourdeals</h1>
          <p className="text-gray-600 text-[clamp(13px,3.5vw,16px)]"><TranslatedText>Welcome back</TranslatedText></p>
        </div>

        {error && (
          <div className="mb-[clamp(12px,3vw,16px)] p-[clamp(10px,2.5vw,12px)] bg-red-50 border border-red-200 rounded-lg text-red-700 text-[clamp(12px,3vw,14px)]">
            <TranslatedText>{error}</TranslatedText>
          </div>
        )}

        {isExpired && (
          <div className="mb-[clamp(12px,3vw,16px)] p-[clamp(10px,2.5vw,12px)] bg-orange-50 border border-orange-200 rounded-lg text-orange-700 text-[clamp(12px,3vw,14px)] text-center font-medium">
            <TranslatedText>OTP expired</TranslatedText>
          </div>
        )}

        <form onSubmit={handleVerifyOTP} className="space-y-[clamp(12px,3vw,20px)]">
          <div>
            <label className="block text-[clamp(13px,3.5vw,15px)] font-medium text-gray-700 mb-[clamp(6px,1.5vw,8px)]">
              <TranslatedText>Enter OTP</TranslatedText>
            </label>
            <p className="text-[clamp(12px,3vw,14px)] text-gray-600 mb-[clamp(8px,2vw,12px)]">
              <TranslatedText>OTP sent to</TranslatedText> +91 {mobileNumber}
            </p>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                className={`w-full px-[clamp(12px,3vw,16px)] py-[clamp(10px,2.5vw,12px)] border rounded-lg outline-none text-center text-[clamp(16px,4vw,18px)] font-medium focus:ring-2 focus:ring-[#13335a]/20 transition-all ${isExpired
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 focus:border-[#13335a]'
                  }`}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder={t('Enter 4 digit OTP')}
                maxLength="4"
                required
                autoFocus
                disabled={isExpired}
              />
            </div>
            {otpTimer > 0 && !isExpired && (
              <p className="text-[clamp(11px,2.8vw,13px)] text-gray-500 mt-[clamp(8px,2vw,12px)] text-center">
                <TranslatedText>OTP expires in</TranslatedText> {Math.ceil(otpTimer / 60)} <TranslatedText>minutes</TranslatedText>
              </p>
            )}
            {isExpired && (
              <p className="text-[clamp(11px,2.8vw,13px)] text-red-600 mt-[clamp(8px,2vw,12px)] text-center font-medium">
                <TranslatedText>Please resend OTP to continue</TranslatedText>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 4 || isExpired}
            className="w-full bg-[#13335a] text-white py-[clamp(10px,2.5vw,14px)] rounded-lg font-semibold hover:bg-[#1e4a7a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-[clamp(14px,3.5vw,16px)] shadow-md"
          >
            {loading ? <TranslatedText>Verifying...</TranslatedText> : <TranslatedText>Verify OTP</TranslatedText>}
          </button>

          <div className="flex items-center justify-center gap-[clamp(6px,1.5vw,8px)] pt-[clamp(4px,1vw,8px)]">
            <span className="text-[clamp(12px,3vw,14px)] text-gray-600"><TranslatedText>Didn't receive OTP?</TranslatedText></span>
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={loading || resendCooldown > 0}
              className="text-[clamp(12px,3vw,14px)] text-[#13335a] font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <TranslatedText>Resend OTP</TranslatedText> {resendCooldown > 0 && <span>({resendCooldown}s)</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default OTPPage
