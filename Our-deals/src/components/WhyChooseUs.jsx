import TranslatedText from './TranslatedText'

function WhyChooseUs() {
  const features = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: <TranslatedText>Verified Vendors</TranslatedText>,
      description: <TranslatedText>All businesses are verified and trusted</TranslatedText>
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: <TranslatedText>Best Deals</TranslatedText>,
      description: <TranslatedText>Exclusive offers and discounts</TranslatedText>
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
          <path d="M12 6V12L16 14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: <TranslatedText>24/7 Support</TranslatedText>,
      description: <TranslatedText>Round the clock customer assistance</TranslatedText>
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: <TranslatedText>Easy Booking</TranslatedText>,
      description: <TranslatedText>Quick and hassle-free service booking</TranslatedText>
    }
  ]

  return (
    <div className="w-full py-[clamp(8px,1vw,12px)] px-4 bg-gray-100">
      <h2 className="text-center text-[clamp(24px,3vw,32px)] font-bold text-gray-800 mb-[clamp(8px,1vw,12px)]">
        <TranslatedText>Why Choose Us</TranslatedText>
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-[clamp(16px,2vw,24px)] max-w-[1400px] mx-auto">
        {features.map((feature, index) => (
          <div key={index} className="bg-white rounded-[clamp(12px,1.5vw,16px)] p-[clamp(20px,2.5vw,24px)] flex flex-col items-center text-center shadow-sm">
            <div className="mb-[clamp(12px,1.5vw,16px)]">
              <div className="w-[clamp(40px,5vw,50px)] h-[clamp(40px,5vw,50px)] rounded-full bg-[#13335a] border-[clamp(2px,0.3vw,3px)] border-[#1e4a7a] flex items-center justify-center">
                <div className="w-[clamp(18px,2.2vw,22px)] h-[clamp(18px,2.2vw,22px)] text-white flex items-center justify-center">
                  {feature.icon}
                </div>
              </div>
            </div>
            <h3 className="text-[clamp(16px,2vw,20px)] font-bold text-gray-800 mb-[clamp(8px,1vw,12px)]">{feature.title}</h3>
            <p className="text-[clamp(13px,1.6vw,16px)] text-gray-600 leading-[1.5]">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WhyChooseUs

