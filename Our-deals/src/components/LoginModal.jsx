import { useState } from 'react'
import OTPModal from './OTPModal'

function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [mobileNumber, setMobileNumber] = useState('')
  const [showOTPSent, setShowOTPSent] = useState(false)
  const [showOTP, setShowOTP] = useState(false)

  if (!isOpen) return null

  const handleLogin = () => {
    if (mobileNumber.length === 10) {
      setShowOTPSent(true)
    }
  }

  const handleOTPSentOK = () => {
    setShowOTPSent(false)
    setShowOTP(true)
  }

  const handleOTPClose = (otp) => {
    if (otp) {
      // OTP verified, directly login success
      setShowOTP(false)
      const userData = {
        mobile: mobileNumber,
        name: `User ${mobileNumber}` // Default name
      }
      if (onLoginSuccess) {
        onLoginSuccess(userData)
      }
      onClose() // Close modal and return to main page
    } else {
      // Maybe later or close
      setShowOTP(false)
      onClose()
    }
  }

  return (
    <>
      {!showOTPSent && !showOTP && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-[#13335A] via-[#213F65] to-[#5E738E] z-[9999] flex items-center justify-center min-h-screen p-[clamp(20px,4vw,40px)] box-border overflow-y-auto">
          <button className="absolute top-[clamp(16px,3vw,24px)] left-[clamp(16px,3vw,24px)] bg-white/20 border-none rounded-full w-[clamp(40px,6vw,48px)] h-[clamp(40px,6vw,48px)] flex items-center justify-center cursor-pointer transition-colors hover:bg-white/30 z-[10000] backdrop-blur-sm" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[clamp(20px,3vw,24px)] h-[clamp(20px,3vw,24px)]">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
                  />
                </div>
              </div>
              
              <button 
                className="w-full bg-[#E10129] text-white border-none p-[clamp(14px,2vw,16px)_clamp(20px,3vw,24px)] rounded-2xl font-bold text-[clamp(16px,2.5vw,18px)] cursor-pointer transition-colors mb-0 mt-0 box-border leading-tight hover:bg-[#c00122] disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={handleLogin}
                disabled={!mobileNumber || mobileNumber.length !== 10}
              >
                Continue
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
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
          onClose={handleOTPClose}
          mobileNumber={mobileNumber}
          onBack={() => {
            setShowOTP(false)
            setShowOTPSent(false)
          }}
        />
      )}
    </>
  )
}

export default LoginModal

