import { useState } from 'react'
import { toast } from 'react-hot-toast'
import OTPModal from './OTPModal'
import { userLogin } from '../services/authService'
import { sendOTP, verifyOTP, resendOTP } from '../services/otpService'

function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [mobileNumber, setMobileNumber] = useState('')
  const [showOTPSent, setShowOTPSent] = useState(false)
  const [showOTP, setShowOTP] = useState(false)
  const [loading, setLoading] = useState(false) // For API loading state
  const [error, setError] = useState('') // For API error messages

  if (!isOpen) return null

  const handleLogin = async () => {
    if (mobileNumber.length !== 10) {
      return
    }

    setLoading(true)
    setError('')

    try {
      // Step 1: Check if user exists using userLogin
      console.log('LoginModal: Checking user existence...')
      const loginResponse = await userLogin(mobileNumber)

      console.log('LoginModal: Login response:', loginResponse)

      if (loginResponse.status === true) {
        // User exists, now send OTP
        console.log('LoginModal: User found, sending OTP...')
        try {
          const otpResponse = await sendOTP(mobileNumber)
          console.log('LoginModal: OTP response:', otpResponse)

          if (otpResponse.status === true) {
            console.log('LoginModal: OTP sent successfully')
            toast.success('OTP Sent Successfully!')
            setShowOTPSent(true)
          } else {
            setError(otpResponse.message || 'Failed to send OTP')
          }
        } catch (otpErr) {
          console.error('LoginModal OTP Error:', otpErr)
          setError('Failed to send OTP. Please try again.')
        }
      } else {
        setError('User not found. Please register on the website first.')
      }
    } catch (err) {
      console.error('LoginModal Login Error:', err)
      const apiMessage = err.response?.data?.message || err.response?.data?.error || ''
      if (apiMessage.toLowerCase().includes('not found') || apiMessage.toLowerCase().includes('user not found') || err.response?.status === 404) {
        setError('User not found. Please register on the website first.')
      } else {
        setError(apiMessage || 'Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleOTPSentOK = () => {
    setShowOTPSent(false)
    setShowOTP(true)
    setError('')
  }

  // This function is now async to handle API verification
  const handleVerifyOTP = async (otp) => {
    if (!otp) {
      // User closed modal explicitly or passed empty
      setShowOTP(false)
      onClose()
      return
    }

    setLoading(true)
    setError('')

    try {
      console.log('LoginModal: Verifying OTP...', otp)
      const response = await verifyOTP(mobileNumber, otp)
      console.log('LoginModal: Verify response:', response)

      if (response.status === true && response.data) {
        // OTP Verified Successfully
        const { user, token } = response.data

        // Save token
        if (token) {
          localStorage.setItem('auth_token', token)
        }

        // Construct user data object consistent with other parts of the app
        const userData = {
          id: user?.id ?? user?.user_id ?? null,
          name: user?.name || `User ${mobileNumber}`,
          phone: user?.phone || mobileNumber,
          email: user?.email ?? null,
          address: user?.address || '',
          city: user?.city || '',
        }

        if (user) {
          localStorage.setItem('userData', JSON.stringify(userData))
        }

        // Notify parent and close
        if (onLoginSuccess) {
          onLoginSuccess(userData)
        }

        // Show success toast
        toast.success('Login Successful!')

        setShowOTP(false)
        onClose()

      } else {
        setError(response.message || 'Invalid OTP')
      }
    } catch (err) {
      console.error('LoginModal Verify Error:', err)
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Invalid OTP. Please try again.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setLoading(true)
    setError('')
    try {
      console.log('LoginModal: Resending OTP using resendOTP service...')

      const resendResponse = await resendOTP(mobileNumber)

      console.log('LoginModal: Resend response:', resendResponse)

      if (resendResponse.status === true) {
        toast.success('OTP Resent Successfully!')
      } else {
        setError(resendResponse.message || 'Failed to resend OTP')
      }
    } catch (err) {
      console.error('LoginModal Resend Error:', err)
      setError('Failed to resend OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {!showOTPSent && !showOTP && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-[#13335A] via-[#213F65] to-[#5E738E] z-[9999] flex items-center justify-center min-h-screen p-[clamp(20px,4vw,40px)] box-border overflow-y-auto">
          <button className="absolute top-[clamp(16px,3vw,24px)] left-[clamp(16px,3vw,24px)] bg-white/20 border-none rounded-full w-[clamp(40px,6vw,48px)] h-[clamp(40px,6vw,48px)] flex items-center justify-center cursor-pointer transition-colors hover:bg-white/30 z-[10000] backdrop-blur-sm" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[clamp(20px,3vw,24px)] h-[clamp(20px,3vw,24px)]">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="w-full max-w-[400px] flex flex-col items-center justify-center text-center">
            <h1 className="text-[clamp(40px,8vw,60px)] font-black text-white m-0 mb-[clamp(8px,1.5vw,12px)] tracking-[-0.5px]">Ourdeals</h1>
            <p className="text-[clamp(16px,3vw,20px)] text-white/90 m-0 mb-[clamp(30px,5vw,40px)] font-normal">Book Your Services in 2 minutes</p>

            <div className="w-full flex flex-col gap-[clamp(24px,4vw,32px)]">
              <div className="mb-[clamp(16px,2.5vw,20px)]">
                <div className="flex items-center border-none rounded-2xl overflow-hidden transition-[border-color] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.1)] w-full box-border focus-within:shadow-[0_2px_12px_rgba(0,0,0,0.15)]">
                  <span className="bg-transparent p-[clamp(14px,2vw,16px)_clamp(14px,2.5vw,18px)] text-[clamp(14px,2vw,16px)] font-semibold text-[#13335A] border-r-0 rounded-l-2xl flex items-center whitespace-nowrap box-border leading-tight">+91</span>
                  <input
                    type="tel"
                    className="flex-1 border-none outline-none p-[clamp(14px,2vw,16px)_clamp(14px,2.5vw,18px)] text-[clamp(14px,2vw,16px)] text-[#1a1a1a] bg-white rounded-r-2xl min-w-0 box-border leading-tight placeholder:text-gray-400 placeholder:font-normal"
                    value={mobileNumber}
                    onChange={(e) => {
                      setMobileNumber(e.target.value)
                      setError('') // Clear error on typing
                    }}
                    placeholder="Enter your phone number"
                    maxLength="10"
                    disabled={loading}
                  />
                </div>
                {error && <p className="text-red-300 text-sm mt-2 text-left px-2 font-medium">{error}</p>}
              </div>

              <button
                className="w-full bg-[#E10129] text-white border-none p-[clamp(14px,2vw,16px)_clamp(20px,3vw,24px)] rounded-2xl font-bold text-[clamp(16px,2.5vw,18px)] cursor-pointer transition-colors mb-0 mt-0 box-border leading-tight hover:bg-[#c00122] disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={handleLogin}
                disabled={!mobileNumber || mobileNumber.length !== 10 || loading}
              >
                {loading ? 'Processing...' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      )}
      {showOTPSent && (
        <>
          <div className="fixed top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-[#13335A] via-[#213F65] to-[#5E738E] z-[9999] flex items-center justify-center min-h-screen p-[clamp(20px,4vw,40px)] box-border overflow-y-auto">
            <button className="absolute top-[clamp(16px,3vw,24px)] left-[clamp(16px,3vw,24px)] bg-white/20 border-none rounded-full w-[clamp(40px,6vw,48px)] h-[clamp(40px,6vw,48px)] flex items-center justify-center cursor-pointer transition-colors hover:bg-white/30 z-[10000] backdrop-blur-sm" onClick={onClose}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[clamp(20px,3vw,24px)] h-[clamp(20px,3vw,24px)]">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="w-full max-w-[400px] flex flex-col items-center justify-center text-center">
              <h1 className="text-[clamp(40px,8vw,60px)] font-black text-white m-0 mb-[clamp(8px,1.5vw,12px)] tracking-[-0.5px]">Ourdeals</h1>
              <p className="text-[clamp(16px,3vw,20px)] text-white/90 m-0 mb-[clamp(30px,5vw,40px)] font-normal">Book Your Services in 2 minutes</p>

              <div className="w-full flex flex-col gap-[clamp(24px,4vw,32px)]">
                <div className="mb-[clamp(16px,2.5vw,20px)]">
                  <div className="flex items-center border-none rounded-2xl overflow-hidden transition-[border-color] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.1)] w-full box-border focus-within:shadow-[0_2px_12px_rgba(0,0,0,0.15)]">
                    <span className="bg-transparent p-[clamp(14px,2vw,16px)_clamp(14px,2.5vw,18px)] text-[clamp(14px,2vw,16px)] font-semibold text-[#13335A] border-r-0 rounded-l-2xl flex items-center whitespace-nowrap box-border leading-tight">+91</span>
                    <input
                      type="tel"
                      className="flex-1 border-none outline-none p-[clamp(14px,2vw,16px)_clamp(14px,2.5vw,18px)] text-[clamp(14px,2vw,16px)] text-[#1a1a1a] bg-white rounded-r-2xl min-w-0 box-border leading-tight placeholder:text-gray-400 placeholder:font-normal"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="Enter your phone number"
                      maxLength="10"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center z-[10000] animate-[fadeIn_0.3s_ease-in-out] p-[clamp(20px,4vw,40px)]">
            <div className="bg-white w-full max-w-[400px] rounded-2xl p-[clamp(24px,4vw,32px)_clamp(20px,4vw,24px)] shadow-[0_4px_20px_rgba(0,0,0,0.2)] animate-[fadeIn_0.3s_ease-out] relative">
              <h2 className="text-[clamp(20px,3.5vw,24px)] font-bold text-black m-0 mb-[clamp(12px,2vw,16px)]">OTP Sent!</h2>
              <p className="text-[clamp(14px,2.5vw,16px)] text-black m-0 mb-[clamp(24px,4vw,32px)] leading-relaxed">A verification code has been sent to your phone.</p>
              <button className="bg-transparent border-none text-[#13335A] text-[clamp(16px,2.5vw,18px)] font-semibold cursor-pointer p-0 ml-auto block transition-colors text-right w-full hover:text-[#0f2440]" onClick={handleOTPSentOK}>OK</button>
            </div>
          </div>
        </>
      )}
      {showOTP && (
        <OTPModal
          isOpen={showOTP}
          onClose={handleVerifyOTP}
          mobileNumber={mobileNumber}
          onBack={() => {
            setShowOTP(false)
            setShowOTPSent(false)
            setError('')
          }}
          onResend={handleResendOTP}
          error={error}
          loading={loading}
        />
      )}
    </>
  )
}

export default LoginModal
