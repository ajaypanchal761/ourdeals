import TranslatedText from './TranslatedText'

function TrustBadges() {
  const badges = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      text: <TranslatedText>Secure Payment</TranslatedText>
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      text: <TranslatedText>Verified Vendors</TranslatedText>
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      text: <TranslatedText>100% Trusted</TranslatedText>
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 6V12M12 12V18M12 12H18M12 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      text: <TranslatedText>24/7 Support</TranslatedText>
    }
  ]

  return (
    <div className="w-full py-[clamp(8px,1vw,12px)] px-4 bg-blue-50">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[clamp(16px,2vw,24px)]">
          {badges.map((badge, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-[clamp(40px,5vw,50px)] h-[clamp(40px,5vw,50px)] rounded-full bg-[#13335a] flex items-center justify-center mb-[clamp(12px,1.5vw,16px)]">
                <div className="w-[clamp(18px,2.2vw,22px)] h-[clamp(18px,2.2vw,22px)] text-white flex items-center justify-center">
                  {badge.icon}
                </div>
              </div>
              <span className="text-[clamp(14px,1.8vw,18px)] font-medium text-black">{badge.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TrustBadges

