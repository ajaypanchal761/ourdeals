import { useState } from 'react'

function NameModal({ isOpen, onClose, mobileNumber, onLoginSuccess }) {
  const [name, setName] = useState('')

  if (!isOpen) return null

  const handleSubmit = () => {
    if (name.trim()) {
      // Handle name submission here
      console.log('Name submitted:', name)
      // Pass user data to parent
      if (onLoginSuccess) {
        onLoginSuccess({ name, mobileNumber })
      }
      onClose() // Close modal and return to main page
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-[8px] z-[9998] animate-[fadeIn_0.3s_ease-in-out]"></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] w-[90%] md:w-[85%] max-w-[400px] md:max-w-[380px] z-[9999] animate-[modalFadeIn_0.3s_ease-out] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-br from-[#13335a] to-[#1e4a7a] p-[clamp(16px,2.5vw,20px)] md:p-[clamp(14px,2vw,18px)] text-white rounded-t-2xl">
          <div className="mb-[clamp(12px,1.5vw,16px)] flex items-baseline">
            <span className="text-[clamp(20px,3vw,28px)] md:text-[clamp(18px,2.5vw,24px)] font-black text-[#13335a] tracking-[-0.5px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">Our</span>
            <span className="text-[clamp(20px,3vw,28px)] md:text-[clamp(18px,2.5vw,24px)] font-black text-[#13335a] tracking-[-0.5px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">deals</span>
          </div>
          <h2 className="text-[clamp(22px,3.5vw,26px)] md:text-[clamp(20px,2.8vw,24px)] font-bold m-[clamp(10px,1.5vw,12px)]_0_[clamp(5px,0.75vw,6px)]_0 text-white tracking-[-0.3px]">Complete Your Profile</h2>
          <p className="text-[clamp(12px,1.75vw,14px)] md:text-[clamp(11px,1.5vw,13px)] m-0 text-white/90 font-normal">Enter your name to continue</p>
        </div>
        <div className="p-[clamp(20px,3vw,24px)] md:p-[clamp(16px,2.5vw,20px)] px-[clamp(16px,2.5vw,20px)] md:px-[clamp(14px,2vw,16px)] flex flex-col gap-[clamp(20px,3vw,24px)] md:gap-[clamp(18px,2.8vw,22px)]">
          <div className="mb-0">
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg py-[clamp(12px,2vw,16px)] md:py-[clamp(10px,1.5vw,12px)] px-[clamp(12px,2vw,16px)] md:px-[clamp(10px,1.5vw,12px)] text-[clamp(14px,2vw,16px)] md:text-[clamp(13px,1.8vw,15px)] text-[#1a1a1a] bg-white transition-all outline-none box-border font-normal focus:border-[#13335a] focus:shadow-[0_0_0_3px_rgba(19,51,90,0.08)] placeholder:text-gray-400 placeholder:font-normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>
          <div className="flex justify-between items-center p-0 bg-transparent rounded-none m-0">
            <span className="text-[clamp(12px,1.75vw,14px)] md:text-[clamp(11px,1.5vw,13px)] text-gray-700 font-medium">Mobile Number:</span>
            <span className="text-[clamp(12px,1.75vw,14px)] md:text-[clamp(11px,1.5vw,13px)] font-normal text-gray-500">+91 {mobileNumber}</span>
          </div>
          <button 
            className="w-full bg-[#13335a] text-white border-none py-[clamp(12px,1.75vw,14px)] md:py-[clamp(10px,1.5vw,12px)] px-[clamp(20px,3vw,24px)] md:px-[clamp(18px,2.5vw,22px)] rounded-lg font-semibold text-[clamp(14px,2vw,16px)] md:text-[clamp(13px,1.8vw,15px)] cursor-pointer transition-colors mt-[clamp(6px,1vw,8px)] md:mt-[clamp(5px,0.8vw,7px)] tracking-[0.3px] hover:bg-[#0f2440] disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={!name.trim()}
          >
            Continue
          </button>
        </div>
      </div>
    </>
  )
}

export default NameModal

