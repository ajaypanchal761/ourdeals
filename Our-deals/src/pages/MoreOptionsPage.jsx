import { useNavigate } from 'react-router-dom'
import TranslatedText from '../components/TranslatedText'

function MoreOptionsPage() {
  const navigate = useNavigate()

  const handleAgentClick = () => {
    navigate('/agent-registration')
  }

  const handleVendorClick = () => {
    // Navigate to vendor page or handle vendor action
    // navigate('/vendor')
    console.log('Vendor clicked')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
      <div className="bg-gradient-to-br from-[#13335a] to-[#1e4a7a] px-[clamp(16px,2vw,24px)] py-[clamp(16px,2vw,20px)] flex justify-between items-center sticky top-0 z-10 flex-shrink-0 md:fixed md:top-0 md:left-0 md:right-0 md:z-[1000] md:w-full md:shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
        <button className="bg-transparent border-none cursor-pointer p-[clamp(3px,0.4vw,4px)] flex items-center justify-center transition-colors rounded-full w-[clamp(28px,3.5vw,32px)] h-[clamp(28px,3.5vw,32px)] text-white hover:bg-white/20" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[clamp(20px,2.5vw,24px)] h-[clamp(20px,2.5vw,24px)]">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h2 className="text-[clamp(18px,2.5vw,24px)] font-bold text-white m-0 flex-1 text-center leading-[1.3]"><TranslatedText>More Options</TranslatedText></h2>
        <div style={{ width: '24px' }}></div>
      </div>

      <div className="flex-1 px-[clamp(16px,2vw,24px)] py-[clamp(24px,3vw,40px)] md:py-[clamp(20px,2.5vw,32px)] flex items-center justify-center min-h-[calc(100vh-clamp(60px,10vw,80px)-80px)] md:mt-[clamp(50px,8vw,70px)]">
        <div className="grid grid-cols-2 gap-[clamp(20px,3vw,32px)] md:gap-[clamp(16px,2.5vw,24px)] w-full max-w-[500px]">
          <div className="flex flex-col items-center justify-center bg-white rounded-[clamp(12px,1.5vw,16px)] p-[clamp(24px,3vw,40px)] md:p-[clamp(20px,2.5vw,32px)] px-[clamp(20px,2.5vw,32px)] md:px-[clamp(16px,2vw,24px)] cursor-pointer transition-all shadow-[0_2px_8px_rgba(0,0,0,0.1)] gap-[clamp(12px,1.5vw,16px)] min-h-[clamp(140px,18vw,180px)] md:min-h-[clamp(120px,15vw,160px)] hover:-translate-y-1 hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)] active:-translate-y-0.5" onClick={handleAgentClick}>
            <div className="w-[clamp(64px,8vw,80px)] md:w-[clamp(56px,7vw,72px)] h-[clamp(64px,8vw,80px)] md:h-[clamp(56px,7vw,72px)] flex items-center justify-center text-[#13335a] bg-gray-100 rounded-[clamp(12px,1.5vw,16px)] transition-all hover:bg-[#e8f0f7] hover:scale-105">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[clamp(32px,4vw,40px)] md:w-[clamp(28px,3.5vw,36px)] h-[clamp(32px,4vw,40px)] md:h-[clamp(28px,3.5vw,36px)]">
                <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
                <path d="M7 17C7 14.7909 9.23858 13 12 13C14.7614 13 17 14.7909 17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-[clamp(16px,2vw,20px)] md:text-[clamp(14px,1.8vw,18px)] font-semibold text-gray-700 text-center group-hover:text-[#13335a]"><TranslatedText>Agent</TranslatedText></span>
          </div>

          <div className="flex flex-col items-center justify-center bg-white rounded-[clamp(12px,1.5vw,16px)] p-[clamp(24px,3vw,40px)] md:p-[clamp(20px,2.5vw,32px)] px-[clamp(20px,2.5vw,32px)] md:px-[clamp(16px,2vw,24px)] cursor-pointer transition-all shadow-[0_2px_8px_rgba(0,0,0,0.1)] gap-[clamp(12px,1.5vw,16px)] min-h-[clamp(140px,18vw,180px)] md:min-h-[clamp(120px,15vw,160px)] hover:-translate-y-1 hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)] active:-translate-y-0.5" onClick={handleVendorClick}>
            <div className="w-[clamp(64px,8vw,80px)] md:w-[clamp(56px,7vw,72px)] h-[clamp(64px,8vw,80px)] md:h-[clamp(56px,7vw,72px)] flex items-center justify-center text-[#13335a] bg-gray-100 rounded-[clamp(12px,1.5vw,16px)] transition-all hover:bg-[#e8f0f7] hover:scale-105">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[clamp(32px,4vw,40px)] md:w-[clamp(28px,3.5vw,36px)] h-[clamp(32px,4vw,40px)] md:h-[clamp(28px,3.5vw,36px)]">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-[clamp(16px,2vw,20px)] md:text-[clamp(14px,1.8vw,18px)] font-semibold text-gray-700 text-center group-hover:text-[#13335a]"><TranslatedText>Vendor</TranslatedText></span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MoreOptionsPage

