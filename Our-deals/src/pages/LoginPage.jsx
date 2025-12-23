import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { userLogin } from '../services/authService'
import { sendOTP } from '../services/otpService'
import TranslatedText from '../components/TranslatedText'
import { useTranslation } from '../hooks/useTranslation'

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()

  // Get phone from navigation state if coming back from OTP page
  const { phone } = location.state || {}

  const [mobileNumber, setMobileNumber] = useState(phone || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Set phone number if coming from OTP page
  useEffect(() => {
    if (phone) {
      setMobileNumber(phone)
    }
  }, [phone])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    if (mobileNumber.length !== 10) {
      setError('Please enter a valid 10-digit mobile number')
      return
    }

    setLoading(true)
    try {
      const phone = mobileNumber // Send without +91 prefix as per API

      console.log('=== Login Page: Calling userLogin API ===')
      const response = await userLogin(phone)

      console.log('Login response:', response)

      if (response.status === true) {
        // User exists - send OTP then go to OTP page
        console.log('✅ User found, sending OTP...')
        try {
          const otpResponse = await sendOTP(mobileNumber)
          console.log('Send OTP response:', otpResponse)

          if (otpResponse.status === true) {
            console.log('✅ OTP sent, navigating to OTP page')
            navigate('/otp', {
              state: {
                phone: mobileNumber,
                fromPage: 'login'
              },
              replace: true
            })
          } else {
            setError(otpResponse.message || 'Failed to send OTP')
          }
        } catch (otpErr) {
          console.error('Send OTP Error (login flow):', otpErr)
          const otpErrorMessage =
            otpErr.response?.data?.message ||
            otpErr.response?.data?.error ||
            otpErr.message ||
            'Failed to send OTP. Please try again.'
          setError(otpErrorMessage)
        }
      } else {
        // User not found
        setError('You are not registered. Please sign up.')
      }
    } catch (err) {
      console.error('Login Error:', err)
      // Check if it's a user not found error
      const apiMessage = err.response?.data?.message || err.response?.data?.error || ''
      if (apiMessage.toLowerCase().includes('not found') || apiMessage.toLowerCase().includes('user not found') || err.response?.status === 404) {
        setError('You are not registered. Please sign up.')
      } else {
        const errorMessage = apiMessage || err.message || 'Login failed. Please try again.'
        setError(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#13335a] to-[#1e4a7a] flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-2xl p-6 md:p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-black text-[#13335a] mb-2">Ourdeals</h1>
          <p className="text-gray-600">
            <TranslatedText>Welcome back</TranslatedText>
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <TranslatedText>{error}</TranslatedText>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <TranslatedText>Mobile Number</TranslatedText>
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-[#13335a] focus-within:ring-2 focus-within:ring-[#13335a]/20">
              <span className="bg-gray-50 px-4 py-3 text-[#13335a] font-semibold border-r border-gray-300">
                +91
              </span>
              <input
                type="tel"
                className="flex-1 px-4 py-3 outline-none text-gray-900"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder={t("Enter your phone number")}
                maxLength="10"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || mobileNumber.length !== 10}
            className="w-full bg-[#13335a] text-white py-3 rounded-lg font-semibold hover:bg-[#1e4a7a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <TranslatedText>Sending OTP...</TranslatedText>
            ) : (
              <TranslatedText>Continue</TranslatedText>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            <TranslatedText>Don't have an account?</TranslatedText>{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-[#13335a] font-semibold hover:underline"
            >
              <TranslatedText>Sign Up</TranslatedText>
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
