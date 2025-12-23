import { useNavigate } from 'react-router-dom'
import TranslatedText from '../components/TranslatedText'

function PrivacyPolicyPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white flex flex-col md:max-w-full md:h-screen md:max-h-screen md:overflow-hidden">
      <div className="bg-gradient-to-br from-[#13335a] to-[#1e4a7a] p-[clamp(16px,2vw,20px)_clamp(16px,2vw,24px)] flex justify-between items-center sticky top-0 z-10 flex-shrink-0">
        <button className="bg-transparent border-none cursor-pointer p-[clamp(3px,0.4vw,4px)] flex items-center justify-center transition-colors rounded-full w-[clamp(28px,3.5vw,32px)] h-[clamp(28px,3.5vw,32px)] hover:bg-white/20" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[clamp(20px,2.5vw,24px)] h-[clamp(20px,2.5vw,24px)]">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h2 className="text-[clamp(18px,2.5vw,24px)] font-bold text-white m-0 flex-1 text-center leading-[1.3]"><TranslatedText>Privacy Policy</TranslatedText></h2>
        <div className="w-6"></div>
      </div>

      <div className="p-[clamp(16px,2vw,24px)] flex-1 overflow-y-auto overflow-x-hidden [-webkit-overflow-scrolling:touch] min-h-0 md:pb-20">
        <h1 className="text-[clamp(18px,2.5vw,24px)] font-bold text-[#1a1a1a] m-0 mb-[clamp(16px,2vw,24px)] leading-[1.3]"><TranslatedText>Privacy Policy – Ourdeals</TranslatedText></h1>

        <section className="mb-[clamp(20px,2.5vw,32px)]">
          <h3 className="text-[clamp(15px,1.8vw,18px)] font-bold text-[#1a1a1a] m-0 mb-[clamp(8px,1vw,12px)] leading-[1.4]"><TranslatedText>1. Information We Collect</TranslatedText></h3>
          <ul className="list-none p-0 m-0">
            <li className="text-[clamp(13px,1.6vw,16px)] text-gray-700 leading-relaxed mb-[clamp(8px,1vw,12px)] pl-[clamp(20px,2.5vw,24px)] relative before:content-['•'] before:absolute before:left-[clamp(6px,0.8vw,8px)] before:text-[#13335a] before:font-bold before:text-[clamp(16px,2.2vw,20px)]">
              <strong className="text-[#1a1a1a] font-semibold text-[clamp(13px,1.6vw,16px)]"><TranslatedText>Personal Information:</TranslatedText></strong> <TranslatedText>When you make a booking, we may collect your name, phone number, location, and booking details.</TranslatedText>
            </li>
            <li className="text-[clamp(13px,1.6vw,16px)] text-gray-700 leading-relaxed mb-[clamp(8px,1vw,12px)] pl-[clamp(20px,2.5vw,24px)] relative before:content-['•'] before:absolute before:left-[clamp(6px,0.8vw,8px)] before:text-[#13335a] before:font-bold before:text-[clamp(16px,2.2vw,20px)]">
              <strong className="text-[#1a1a1a] font-semibold text-[clamp(13px,1.6vw,16px)]"><TranslatedText>Usage Data:</TranslatedText></strong> <TranslatedText>We may automatically collect information about how you use the app (such as pages visited and time spent).</TranslatedText>
            </li>
          </ul>
        </section>

        <section className="mb-[clamp(20px,2.5vw,32px)]">
          <h3 className="text-[clamp(15px,1.8vw,18px)] font-bold text-[#1a1a1a] m-0 mb-[clamp(8px,1vw,12px)] leading-[1.4]"><TranslatedText>2. How We Use Your Information</TranslatedText></h3>
          <p className="text-[clamp(13px,1.6vw,16px)] text-gray-700 leading-relaxed m-0 mb-[clamp(8px,1vw,12px)]"><TranslatedText>We use the collected information for purposes such as:</TranslatedText></p>
          <ul className="list-none p-0 m-0">
            <li className="text-[clamp(13px,1.6vw,16px)] text-gray-700 leading-relaxed mb-[clamp(8px,1vw,12px)] pl-[clamp(20px,2.5vw,24px)] relative before:content-['•'] before:absolute before:left-[clamp(6px,0.8vw,8px)] before:text-[#13335a] before:font-bold before:text-[clamp(16px,2.2vw,20px)]"><TranslatedText>Processing your bookings.</TranslatedText></li>
            <li className="text-[clamp(13px,1.6vw,16px)] text-gray-700 leading-relaxed mb-[clamp(8px,1vw,12px)] pl-[clamp(20px,2.5vw,24px)] relative before:content-['•'] before:absolute before:left-[clamp(6px,0.8vw,8px)] before:text-[#13335a] before:font-bold before:text-[clamp(16px,2.2vw,20px)]"><TranslatedText>Connecting you directly with vendors (through call or chat).</TranslatedText></li>
            <li className="text-[clamp(13px,1.6vw,16px)] text-gray-700 leading-relaxed mb-[clamp(8px,1vw,12px)] pl-[clamp(20px,2.5vw,24px)] relative before:content-['•'] before:absolute before:left-[clamp(6px,0.8vw,8px)] before:text-[#13335a] before:font-bold before:text-[clamp(16px,2.2vw,20px)]"><TranslatedText>Improving user experience and app performance.</TranslatedText></li>
            <li className="text-[clamp(13px,1.6vw,16px)] text-gray-700 leading-relaxed mb-[clamp(8px,1vw,12px)] pl-[clamp(20px,2.5vw,24px)] relative before:content-['•'] before:absolute before:left-[clamp(6px,0.8vw,8px)] before:text-[#13335a] before:font-bold before:text-[clamp(16px,2.2vw,20px)]"><TranslatedText>Ensuring security, fraud prevention, and legal compliance.</TranslatedText></li>
          </ul>
        </section>

        <section className="mb-[clamp(20px,2.5vw,32px)]">
          <h3 className="text-[clamp(15px,1.8vw,18px)] font-bold text-[#1a1a1a] m-0 mb-[clamp(8px,1vw,12px)] leading-[1.4]"><TranslatedText>3. Sharing of Information</TranslatedText></h3>
          <ul className="list-none p-0 m-0">
            <li className="text-[clamp(13px,1.6vw,16px)] text-gray-700 leading-relaxed mb-[clamp(8px,1vw,12px)] pl-[clamp(20px,2.5vw,24px)] relative before:content-['•'] before:absolute before:left-[clamp(6px,0.8vw,8px)] before:text-[#13335a] before:font-bold before:text-[clamp(16px,2.2vw,20px)]"><TranslatedText>We only share your information with the vendor you choose to connect with.</TranslatedText></li>
            <li className="text-[clamp(13px,1.6vw,16px)] text-gray-700 leading-relaxed mb-[clamp(8px,1vw,12px)] pl-[clamp(20px,2.5vw,24px)] relative before:content-['•'] before:absolute before:left-[clamp(6px,0.8vw,8px)] before:text-[#13335a] before:font-bold before:text-[clamp(16px,2.2vw,20px)]"><TranslatedText>We do not sell or rent your personal data to any third party.</TranslatedText></li>
            <li className="text-[clamp(13px,1.6vw,16px)] text-gray-700 leading-relaxed mb-[clamp(8px,1vw,12px)] pl-[clamp(20px,2.5vw,24px)] relative before:content-['•'] before:absolute before:left-[clamp(6px,0.8vw,8px)] before:text-[#13335a] before:font-bold before:text-[clamp(16px,2.2vw,20px)]"><TranslatedText>Information may be shared with law enforcement authorities only when required by law.</TranslatedText></li>
          </ul>
        </section>

        <section className="mb-[clamp(20px,2.5vw,32px)]">
          <h3 className="text-[clamp(15px,1.8vw,18px)] font-bold text-[#1a1a1a] m-0 mb-[clamp(8px,1vw,12px)] leading-[1.4]"><TranslatedText>4. Data Security</TranslatedText></h3>
          <ul className="list-none p-0 m-0">
            <li className="text-[clamp(13px,1.6vw,16px)] text-gray-700 leading-relaxed mb-[clamp(8px,1vw,12px)] pl-[clamp(20px,2.5vw,24px)] relative before:content-['•'] before:absolute before:left-[clamp(6px,0.8vw,8px)] before:text-[#13335a] before:font-bold before:text-[clamp(16px,2.2vw,20px)]"><TranslatedText>We use secure servers, encryption, and other safeguards to protect your personal data from unauthorized access, alteration, or misuse.</TranslatedText></li>
          </ul>
        </section>

        <section className="mb-[clamp(20px,2.5vw,32px)]">
          <h3 className="text-[clamp(15px,1.8vw,18px)] font-bold text-[#1a1a1a] m-0 mb-[clamp(8px,1vw,12px)] leading-[1.4]"><TranslatedText>5. Your Rights & Control</TranslatedText></h3>
          <ul className="list-none p-0 m-0">
            <li className="text-[clamp(13px,1.6vw,16px)] text-gray-700 leading-relaxed mb-[clamp(8px,1vw,12px)] pl-[clamp(20px,2.5vw,24px)] relative before:content-['•'] before:absolute before:left-[clamp(6px,0.8vw,8px)] before:text-[#13335a] before:font-bold before:text-[clamp(16px,2.2vw,20px)]"><TranslatedText>You can update or delete your account information anytime.</TranslatedText></li>
            <li className="text-[clamp(13px,1.6vw,16px)] text-gray-700 leading-relaxed mb-[clamp(8px,1vw,12px)] pl-[clamp(20px,2.5vw,24px)] relative before:content-['•'] before:absolute before:left-[clamp(6px,0.8vw,8px)] before:text-[#13335a] before:font-bold before:text-[clamp(16px,2.2vw,20px)]"><TranslatedText>You may contact us to request deletion of your personal data.</TranslatedText></li>
          </ul>
        </section>

        <section className="mb-[clamp(20px,2.5vw,32px)]">
          <h3 className="text-[clamp(15px,1.8vw,18px)] font-bold text-[#1a1a1a] m-0 mb-[clamp(8px,1vw,12px)] leading-[1.4]"><TranslatedText>6. Cookies & Tracking</TranslatedText></h3>
          <ul className="list-none p-0 m-0">
            <li className="text-[clamp(13px,1.6vw,16px)] text-gray-700 leading-relaxed mb-[clamp(8px,1vw,12px)] pl-[clamp(20px,2.5vw,24px)] relative before:content-['•'] before:absolute before:left-[clamp(6px,0.8vw,8px)] before:text-[#13335a] before:font-bold before:text-[clamp(16px,2.2vw,20px)]"><TranslatedText>We may use cookies or similar technologies to improve app performance and user experience.</TranslatedText></li>
          </ul>
        </section>

        <section className="mb-[clamp(20px,2.5vw,32px)]">
          <h3 className="text-[clamp(15px,1.8vw,18px)] font-bold text-[#1a1a1a] m-0 mb-[clamp(8px,1vw,12px)] leading-[1.4]"><TranslatedText>7. Changes to This Policy</TranslatedText></h3>
          <ul className="list-none p-0 m-0">
            <li className="text-[clamp(13px,1.6vw,16px)] text-gray-700 leading-relaxed mb-[clamp(8px,1vw,12px)] pl-[clamp(20px,2.5vw,24px)] relative before:content-['•'] before:absolute before:left-[clamp(6px,0.8vw,8px)] before:text-[#13335a] before:font-bold before:text-[clamp(16px,2.2vw,20px)]"><TranslatedText>We may update this Privacy Policy from time to time. Any changes will be effective once posted in the app.</TranslatedText></li>
          </ul>
        </section>

        <section className="mb-[clamp(20px,2.5vw,32px)]">
          <h3 className="text-[clamp(15px,1.8vw,18px)] font-bold text-[#1a1a1a] m-0 mb-[clamp(8px,1vw,12px)] leading-[1.4]"><TranslatedText>8. Contact Us</TranslatedText></h3>
          <p className="text-[clamp(13px,1.6vw,16px)] text-gray-700 leading-relaxed m-0 mb-[clamp(8px,1vw,12px)]"><TranslatedText>For any questions about this Privacy Policy or our data practices, please contact us at:</TranslatedText></p>
          <div className="mt-[clamp(12px,1.5vw,16px)] flex flex-col gap-[clamp(8px,1vw,12px)]">
            <div className="flex items-center gap-[clamp(8px,1vw,12px)] text-[clamp(13px,1.6vw,16px)] text-gray-700 leading-normal">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#13335a] flex-shrink-0 w-[clamp(16px,2vw,20px)] h-[clamp(16px,2vw,20px)]">
                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span><TranslatedText>Email</TranslatedText>: ourdealsservices@gmail.com</span>
            </div>
            <div className="flex items-center gap-[clamp(8px,1vw,12px)] text-[clamp(13px,1.6vw,16px)] text-gray-700 leading-normal">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#13335a] flex-shrink-0 w-[clamp(16px,2vw,20px)] h-[clamp(16px,2vw,20px)]">
                <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7292C21.7209 20.9842 21.5573 21.2126 21.3518 21.3992C21.1463 21.5858 20.9033 21.7262 20.6381 21.811C20.3729 21.8958 20.0922 21.9231 19.815 21.891C16.7428 21.5856 13.786 20.5341 11.19 18.82C8.77382 17.3148 6.72533 15.2663 5.22 12.85C3.49997 10.2412 2.44824 7.27099 2.15 4.18C2.11793 3.90322 2.14518 3.62281 2.22981 3.35788C2.31444 3.09295 2.45452 2.85002 2.64082 2.64458C2.82712 2.43914 3.05531 2.27554 3.31007 2.16389C3.56483 2.05224 3.84034 1.99508 4.119 2H7.119C7.59357 1.99522 8.05808 2.16708 8.43322 2.49055C8.80836 2.81402 9.07173 3.27236 9.179 3.78L9.88 6.75C9.98603 7.24195 9.93842 7.75767 9.74447 8.22293C9.55052 8.68819 9.21969 9.08114 8.8 9.35L7.33 10.28C8.47697 12.3301 10.1699 14.023 12.22 15.17L13.15 13.71C13.4201 13.2908 13.8132 12.9602 14.2784 12.7663C14.7436 12.5724 15.2591 12.5247 15.75 12.63L18.71 13.33C19.2176 13.4373 19.676 13.7007 19.9995 14.0758C20.323 14.4509 20.4948 14.9154 20.49 15.39L22 19.39Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span><TranslatedText>Phone</TranslatedText>: +91 0510-2990891</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default PrivacyPolicyPage

