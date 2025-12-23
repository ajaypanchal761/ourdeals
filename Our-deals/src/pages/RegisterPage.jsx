import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { userRegister } from '../services/authService'
import { sendOTP } from '../services/otpService'
import TranslatedText from '../components/TranslatedText'
import { useTranslation } from '../hooks/useTranslation'

function RegisterPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()

  // Get data from navigation state if coming back from OTP page
  const { phone, name: prevName, address: prevAddress, city: prevCity } = location.state || {}

  const [mobileNumber, setMobileNumber] = useState(phone || '')
  const [name, setName] = useState(prevName || '')
  const [address, setAddress] = useState(prevAddress || '')
  const [city, setCity] = useState(prevCity || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Set form data if coming from OTP page
  useEffect(() => {
    if (phone) {
      setMobileNumber(phone)
    }
    if (prevName) {
      setName(prevName)
    }
    if (prevAddress) {
      setAddress(prevAddress)
    }
    if (prevCity) {
      setCity(prevCity)
    }
  }, [phone, prevName, prevAddress, prevCity])

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')

    if (mobileNumber.length !== 10) {
      setError(t('Please enter a valid 10-digit mobile number'))
      return
    }

    if (!name.trim() || !address.trim() || !city.trim()) {
      setError(t('Please fill all fields'))
      return
    }

    setLoading(true)
    try {
      // Step 1: Call userRegister API
      console.log('=== Register Page: Step 1 - Calling userRegister API ===')
      const registerResponse = await userRegister({
        name: name.trim(),
        phone: mobileNumber,
        address: address.trim(),
        city: city.trim(),
      })

      console.log('Register response:', registerResponse)

      // Check if registration was successful
      if (registerResponse.status === true || registerResponse.token) {
        console.log('✅ Registration successful')

        // Step 2: Call sendOTP API only if registration is successful
        console.log('=== Register Page: Step 2 - Calling sendOTP API ===')
        try {
          const otpResponse = await sendOTP(mobileNumber)
          console.log('Send OTP response:', otpResponse)

          if (otpResponse.status === true) {
            console.log('✅ OTP sent successfully, navigating to OTP page')
            // Navigate to OTP page
            navigate('/otp', {
              state: {
                phone: mobileNumber,
                name: name.trim(),
                address: address.trim(),
                city: city.trim(),
                fromPage: 'register'
              },
              replace: true
            })
          } else {
            setError(otpResponse.message || 'Failed to send OTP')
          }
        } catch (otpErr) {
          console.error('Send OTP Error:', otpErr)
          const otpErrorMessage = otpErr.response?.data?.message || otpErr.response?.data?.error || otpErr.message || 'Failed to send OTP. Please try again.'
          setError(otpErrorMessage)
        }
      } else {
        setError(registerResponse.message || 'Registration failed')
      }
    } catch (err) {
      console.error('Register Error:', err)
      // Check if user already exists (registration failed because user exists)
      const apiMessage = err.response?.data?.message || err.response?.data?.error || ''
      if (apiMessage.toLowerCase().includes('already exists') ||
        apiMessage.toLowerCase().includes('already registered') ||
        apiMessage.toLowerCase().includes('user exists') ||
        err.response?.status === 422) {
        setError(t('You are already registered. Please login.'))
      } else {
        const errorMessage = apiMessage || err.message || 'Registration failed. Please try again.'
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
          <p className="text-gray-600"><TranslatedText>Create your account</TranslatedText></p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <TranslatedText>{error}</TranslatedText>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
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
                placeholder={t('Enter your phone number')}
                maxLength="10"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <TranslatedText>Name</TranslatedText>
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#13335a] focus:ring-2 focus:ring-[#13335a]/20"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('Enter your name')}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <TranslatedText>Address</TranslatedText>
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#13335a] focus:ring-2 focus:ring-[#13335a]/20"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={t('Enter your address')}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <TranslatedText>City</TranslatedText>
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#13335a] focus:ring-2 focus:ring-[#13335a]/20"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder={t('Enter your city')}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || mobileNumber.length !== 10 || !name.trim() || !address.trim() || !city.trim()}
            className="w-full bg-[#13335a] text-white py-3 rounded-lg font-semibold hover:bg-[#1e4a7a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <TranslatedText>Sending OTP...</TranslatedText> : <TranslatedText>Continue</TranslatedText>}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            <TranslatedText>Already have an account?</TranslatedText>{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-[#13335a] font-semibold hover:underline"
            >
              <TranslatedText>Login</TranslatedText>
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage

