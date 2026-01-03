import { useState, useRef, useEffect } from 'react'
import TranslatedText from './TranslatedText'

function OTPModal({ isOpen, onClose, mobileNumber, onBack, error, loading, onResend }) {
  const [otp, setOtp] = useState(['', '', '', ''])
  const [resendTimer, setResendTimer] = useState(9)
  const inputRefs = useRef([])

  useEffect(() => {
    if (isOpen && resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => (prev > 0 ? prev - 1 : 0))
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isOpen, resendTimer])

  if (!isOpen) return null

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 4)
    const newOtp = [...otp]
    for (let i = 0; i < pastedData.length && i < 4; i++) {
      newOtp[i] = pastedData[i]
    }
    setOtp(newOtp)
    const nextEmptyIndex = pastedData.length < 4 ? pastedData.length : 3
    inputRefs.current[nextEmptyIndex]?.focus()
  }

  const handleVerify = () => {
    const otpString = otp.join('')
    if (otpString.length === 4) {
      // Pass OTP to parent for backend verification
      onClose(otpString)
    }
  }

  const handleResend = () => {
    if (resendTimer === 0) {
      // Handle resend OTP via parent prop
      console.log('OTPModal: Call onResend')
      if (onResend) {
        onResend()
      }
      setOtp(['', '', '', ''])
      setResendTimer(9)
      inputRefs.current[0]?.focus()
    }
  }

  const isOtpComplete = otp.every(digit => digit !== '')

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-[#13335A] via-[#213F65] to-[#5E738E] z-[9999] flex items-center justify-center min-h-screen p-[clamp(16px,4vw,32px)] box-border overflow-y-auto text-white">
      {onBack && (
        <button className="absolute top-[clamp(12px,3vw,20px)] left-[clamp(12px,3vw,20px)] bg-white/20 border-none rounded-full w-[clamp(36px,9vw,44px)] h-[clamp(36px,9vw,44px)] flex items-center justify-center cursor-pointer transition-colors hover:bg-white/30 z-[10000] backdrop-blur-sm" onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[clamp(18px,4.5vw,22px)] h-[clamp(18px,4.5vw,22px)]">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
      <div className="w-full max-w-[400px] flex flex-col items-center text-center">
        <h1 className="text-[clamp(28px,7vw,44px)] font-black text-white m-0 mb-[clamp(12px,3vw,20px)] flex flex-col gap-[clamp(2px,1vw,6px)] leading-tight">
          <span>
            <TranslatedText>OTP</TranslatedText>
          </span>
          <span>
            <TranslatedText>Verification</TranslatedText>
          </span>
        </h1>
        <p className="text-[clamp(13px,3vw,15px)] text-white/90 m-0 mb-[clamp(6px,1.5vw,10px)] font-normal">
          <TranslatedText>Enter the 4-digit code sent to</TranslatedText>
        </p>
        <p className="text-[clamp(15px,3.5vw,18px)] text-white m-0 mb-[clamp(24px,5vw,40px)] font-semibold">+91 {mobileNumber}</p>

        {error && (
          <div className="mb-[clamp(16px,3vw,20px)] p-2 bg-red-500/20 border border-red-200/50 rounded-lg text-white text-sm w-full">
            <TranslatedText>{error}</TranslatedText>
          </div>
        )}

        <div className="flex gap-[clamp(10px,2.5vw,16px)] justify-center mb-[clamp(20px,4vw,28px)]">
          {otp.map((digit, index) => (
            <div key={index} className="relative">
              <input
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                className="w-[clamp(50px,12vw,70px)] h-[clamp(50px,12vw,70px)] border-none rounded-[clamp(10px,2.5vw,14px)] bg-white text-center text-[clamp(20px,5vw,28px)] font-bold text-black outline-none transition-all focus:shadow-[0_0_0_3px_rgba(255,255,255,0.3)] focus:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                maxLength="1"
                inputMode="numeric"
                disabled={loading}
              />
            </div>
          ))}
        </div>

        <div className="mb-[clamp(20px,4vw,28px)]">
          <span className="text-[clamp(13px,3vw,15px)] text-white/90">
            <TranslatedText>Didn't receive OTP?</TranslatedText> {resendTimer > 0 && <span className="font-semibold">{resendTimer}s</span>}
            {resendTimer === 0 && (
              <button
                onClick={handleResend}
                disabled={loading}
                className="ml-2 text-white font-semibold underline bg-transparent border-none cursor-pointer hover:text-white/80 transition-colors disabled:opacity-50"
              >
                <TranslatedText>Resend</TranslatedText>
              </button>
            )}
          </span>
        </div>

        <button
          className="w-full max-w-[350px] bg-[#E10129] text-white border-none p-[clamp(11px,2.8vw,14px)_clamp(16px,4vw,20px)] rounded-[clamp(10px,2.5vw,14px)] font-bold text-[clamp(14px,3.5vw,16px)] cursor-pointer transition-all hover:bg-[#c00122] hover:scale-[1.02] disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
          onClick={handleVerify}
          disabled={!isOtpComplete || loading}
        >
          {loading ? <TranslatedText>Verifying...</TranslatedText> : <TranslatedText>Verify & Continue</TranslatedText>}
        </button>
      </div>
    </div>
  )
}

export default OTPModal

