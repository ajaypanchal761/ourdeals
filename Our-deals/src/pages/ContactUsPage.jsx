import { useNavigate } from 'react-router-dom'
import TranslatedText from '../components/TranslatedText'
import { useTranslation } from '../hooks/useTranslation'

function ContactUsPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    alert(t('Copied to clipboard!'))
  }

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`
  }

  const handleLink = (url) => {
    window.open(url, '_blank')
  }

  return (
    <div className="fixed inset-0 w-full bg-white animate-[fadeInScale_0.3s_ease-out] overflow-y-auto flex flex-col">
      <div className="bg-gradient-to-br from-[#13335a] to-[#1e4a7a] px-[clamp(12px,3vw,20px)] py-[clamp(12px,2.5vw,16px)] flex justify-between items-center sticky top-0 z-10 flex-shrink-0">
        <button className="bg-transparent border-none cursor-pointer p-[clamp(2px,0.5vw,3px)] flex items-center justify-center transition-colors rounded-full w-[clamp(28px,7vw,32px)] h-[clamp(28px,7vw,32px)] hover:bg-white/20" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[clamp(18px,4.5vw,22px)] h-[clamp(18px,4.5vw,22px)]">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h2 className="text-[clamp(16px,4vw,20px)] font-bold text-white m-0 flex-1 text-center leading-[1.3]"><TranslatedText>Contact Us</TranslatedText></h2>
        <div style={{ width: 'clamp(28px,7vw,32px)' }}></div>
      </div>

      <div className="px-[clamp(12px,3vw,20px)] md:px-[clamp(10px,2.5vw,14px)] flex-1 overflow-y-auto pb-[clamp(24px,4vw,32px)]">
        {/* Contact Cards */}
        <div className="flex flex-col gap-[clamp(10px,2.5vw,14px)] mb-[clamp(14px,3vw,20px)]">
          {/* Email */}
          <div className="bg-white border border-gray-200 rounded-[clamp(8px,2vw,10px)] p-[clamp(12px,3vw,16px)] md:p-[clamp(10px,2.5vw,14px)] flex items-center gap-[clamp(10px,2.5vw,14px)] shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
            <div className="w-[clamp(36px,9vw,44px)] h-[clamp(36px,9vw,44px)] rounded-full bg-[#13335a] flex items-center justify-center flex-shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[clamp(18px,4.5vw,22px)] h-[clamp(18px,4.5vw,22px)]">
                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 6L12 13L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[clamp(13px,3.2vw,15px)] font-bold text-[#1a1a1a] m-0 mb-[clamp(2px,0.5vw,3px)] leading-[1.3]"><TranslatedText>Email</TranslatedText></h4>
              <p className="text-[clamp(11px,2.8vw,13px)] text-gray-500 m-0 leading-[1.4] break-words">ourdealsservices@gmail.com</p>
            </div>
            <div className="flex gap-[clamp(4px,1vw,6px)] flex-shrink-0">
              <button className="bg-transparent border-none cursor-pointer p-[clamp(5px,1.2vw,7px)] flex items-center justify-center text-gray-500 transition-colors rounded-[clamp(5px,1.2vw,7px)] hover:bg-gray-100 hover:text-[#13335a]" onClick={() => handleCopy('ourdealsservices@gmail.com')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[clamp(16px,4vw,18px)] h-[clamp(16px,4vw,18px)]">
                  <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M20 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H20C21.1 23 22 22.1 22 21V7C22 5.9 21.1 5 20 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button className="bg-transparent border-none cursor-pointer p-[clamp(5px,1.2vw,7px)] flex items-center justify-center text-gray-500 transition-colors rounded-[clamp(5px,1.2vw,7px)] hover:bg-gray-100 hover:text-[#13335a]" onClick={() => handleLink('mailto:ourdealsservices@gmail.com')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[clamp(16px,4vw,18px)] h-[clamp(16px,4vw,18px)]">
                  <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15 3H21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Customer Care */}
          <div className="bg-white border border-gray-200 rounded-[clamp(8px,2vw,10px)] p-[clamp(12px,3vw,16px)] md:p-[clamp(10px,2.5vw,14px)] flex items-center gap-[clamp(10px,2.5vw,14px)] shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
            <div className="w-[clamp(36px,9vw,44px)] h-[clamp(36px,9vw,44px)] rounded-full bg-[#13335a] flex items-center justify-center flex-shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[clamp(18px,4.5vw,22px)] h-[clamp(18px,4.5vw,22px)]">
                <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7292C21.7209 20.9842 21.5573 21.2126 21.3518 21.3992C21.1463 21.5858 20.9033 21.7262 20.6381 21.811C20.3729 21.8958 20.0922 21.9231 19.815 21.891C16.7428 21.5856 13.786 20.5341 11.19 18.82C8.77382 17.3148 6.72533 15.2663 5.22 12.85C3.49997 10.2412 2.44824 7.27099 2.15 4.18C2.11793 3.90322 2.14518 3.62281 2.22981 3.35788C2.31444 3.09295 2.45452 2.85002 2.64082 2.64458C2.82712 2.43914 3.05531 2.27554 3.31007 2.16389C3.56483 2.05224 3.84034 1.99508 4.119 2H7.119C7.59357 1.99522 8.05808 2.16708 8.43322 2.49055C8.80836 2.81402 9.07173 3.27236 9.179 3.78L9.88 6.75C9.98603 7.24195 9.93842 7.75767 9.74447 8.22293C9.55052 8.68819 9.21969 9.08114 8.8 9.35L7.33 10.28C8.47697 12.3301 10.1699 14.023 12.22 15.17L13.15 13.71C13.4201 13.2908 13.8132 12.9602 14.2784 12.7663C14.7436 12.5724 15.2591 12.5247 15.75 12.63L18.71 13.33C19.2176 13.4373 19.676 13.7007 19.9995 14.0758C20.323 14.4509 20.4948 14.9154 20.49 15.39L22 19.39Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[clamp(13px,3.2vw,15px)] font-bold text-[#1a1a1a] m-0 mb-[clamp(2px,0.5vw,3px)] leading-[1.3]"><TranslatedText>Customer Care</TranslatedText></h4>
              <p className="text-[clamp(11px,2.8vw,13px)] text-gray-500 m-0 leading-[1.4] break-words">+91 9125959991</p>
            </div>
            <div className="flex gap-[clamp(4px,1vw,6px)] flex-shrink-0">
              <button className="bg-transparent border-none cursor-pointer p-[clamp(5px,1.2vw,7px)] flex items-center justify-center text-gray-500 transition-colors rounded-[clamp(5px,1.2vw,7px)] hover:bg-gray-100 hover:text-[#13335a]" onClick={() => handleCopy('+91 9125959991')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[clamp(16px,4vw,18px)] h-[clamp(16px,4vw,18px)]">
                  <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M20 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H20C21.1 23 22 22.1 22 21V7C22 5.9 21.1 5 20 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button className="bg-transparent border-none cursor-pointer p-[clamp(5px,1.2vw,7px)] flex items-center justify-center text-gray-500 transition-colors rounded-[clamp(5px,1.2vw,7px)] hover:bg-gray-100 hover:text-[#13335a]" onClick={() => handleCall('+919125959991')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[clamp(16px,4vw,18px)] h-[clamp(16px,4vw,18px)]">
                  <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7292C21.7209 20.9842 21.5573 21.2126 21.3518 21.3992C21.1463 21.5858 20.9033 21.7262 20.6381 21.811C20.3729 21.8958 20.0922 21.9231 19.815 21.891C16.7428 21.5856 13.786 20.5341 11.19 18.82C8.77382 17.3148 6.72533 15.2663 5.22 12.85C3.49997 10.2412 2.44824 7.27099 2.15 4.18C2.11793 3.90322 2.14518 3.62281 2.22981 3.35788C2.31444 3.09295 2.45452 2.85002 2.64082 2.64458C2.82712 2.43914 3.05531 2.27554 3.31007 2.16389C3.56483 2.05224 3.84034 1.99508 4.119 2H7.119C7.59357 1.99522 8.05808 2.16708 8.43322 2.49055C8.80836 2.81402 9.07173 3.27236 9.179 3.78L9.88 6.75C9.98603 7.24195 9.93842 7.75767 9.74447 8.22293C9.55052 8.68819 9.21969 9.08114 8.8 9.35L7.33 10.28C8.47697 12.3301 10.1699 14.023 12.22 15.17L13.15 13.71C13.4201 13.2908 13.8132 12.9602 14.2784 12.7663C14.7436 12.5724 15.2591 12.5247 15.75 12.63L18.71 13.33C19.2176 13.4373 19.676 13.7007 19.9995 14.0758C20.323 14.4509 20.4948 14.9154 20.49 15.39L22 19.39Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Toll-Free / Landline */}
          <div className="bg-white border border-gray-200 rounded-[clamp(10px,1.2vw,12px)] p-[clamp(16px,2vw,20px)] md:p-[clamp(12px,1.5vw,16px)] flex items-center gap-[clamp(12px,1.5vw,16px)] shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
            <div className="w-[clamp(40px,5vw,48px)] h-[clamp(40px,5vw,48px)] rounded-full bg-[#13335a] flex items-center justify-center flex-shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 18V12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12V18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21 18C21 19.1046 20.1046 20 19 20H18C16.8954 20 16 19.1046 16 18V16C16 14.8954 16.8954 14 18 14H19C20.1046 14 21 14.8954 21 16V18Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 18C7 19.1046 6.10457 20 5 20H4C2.89543 20 2 19.1046 2 18V16C2 14.8954 2.89543 14 4 14H5C6.10457 14 7 14.8954 7 16V18Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[clamp(14px,1.6vw,16px)] font-bold text-[#1a1a1a] m-0 mb-[clamp(3px,0.4vw,4px)] leading-[1.3]"><TranslatedText>Toll-Free / Landline</TranslatedText></h4>
              <p className="text-[clamp(12px,1.4vw,14px)] text-gray-500 m-0 leading-[1.4] break-words">0510-2990891</p>
            </div>
            <div className="flex gap-[clamp(6px,0.8vw,8px)] flex-shrink-0">
              <button className="bg-transparent border-none cursor-pointer p-[clamp(6px,0.8vw,8px)] flex items-center justify-center text-gray-500 transition-colors rounded-[clamp(6px,0.8vw,8px)] hover:bg-gray-100 hover:text-[#13335a]" onClick={() => handleCopy('0510-2990891')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[clamp(16px,2vw,20px)] h-[clamp(16px,2vw,20px)]">
                  <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M20 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H20C21.1 23 22 22.1 22 21V7C22 5.9 21.1 5 20 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button className="bg-transparent border-none cursor-pointer p-[clamp(6px,0.8vw,8px)] flex items-center justify-center text-gray-500 transition-colors rounded-[clamp(6px,0.8vw,8px)] hover:bg-gray-100 hover:text-[#13335a]" onClick={() => handleCall('05102990891')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[clamp(16px,2vw,20px)] h-[clamp(16px,2vw,20px)]">
                  <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7292C21.7209 20.9842 21.5573 21.2126 21.3518 21.3992C21.1463 21.5858 20.9033 21.7262 20.6381 21.811C20.3729 21.8958 20.0922 21.9231 19.815 21.891C16.7428 21.5856 13.786 20.5341 11.19 18.82C8.77382 17.3148 6.72533 15.2663 5.22 12.85C3.49997 10.2412 2.44824 7.27099 2.15 4.18C2.11793 3.90322 2.14518 3.62281 2.22981 3.35788C2.31444 3.09295 2.45452 2.85002 2.64082 2.64458C2.82712 2.43914 3.05531 2.27554 3.31007 2.16389C3.56483 2.05224 3.84034 1.99508 4.119 2H7.119C7.59357 1.99522 8.05808 2.16708 8.43322 2.49055C8.80836 2.81402 9.07173 3.27236 9.179 3.78L9.88 6.75C9.98603 7.24195 9.93842 7.75767 9.74447 8.22293C9.55052 8.68819 9.21969 9.08114 8.8 9.35L7.33 10.28C8.47697 12.3301 10.1699 14.023 12.22 15.17L13.15 13.71C13.4201 13.2908 13.8132 12.9602 14.2784 12.7663C14.7436 12.5724 15.2591 12.5247 15.75 12.63L18.71 13.33C19.2176 13.4373 19.676 13.7007 19.9995 14.0758C20.323 14.4509 20.4948 14.9154 20.49 15.39L22 19.39Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Website */}
          <div className="bg-white border border-gray-200 rounded-[clamp(10px,1.2vw,12px)] p-[clamp(16px,2vw,20px)] md:p-[clamp(12px,1.5vw,16px)] flex items-center gap-[clamp(12px,1.5vw,16px)] shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
            <div className="w-[clamp(40px,5vw,48px)] h-[clamp(40px,5vw,48px)] rounded-full bg-[#13335a] flex items-center justify-center flex-shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12H22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[clamp(14px,1.6vw,16px)] font-bold text-[#1a1a1a] m-0 mb-[clamp(3px,0.4vw,4px)] leading-[1.3]"><TranslatedText>Website</TranslatedText></h4>
              <p className="text-[clamp(12px,1.4vw,14px)] text-gray-500 m-0 leading-[1.4] break-words">https://www.ourdeals.in</p>
            </div>
            <div className="flex gap-[clamp(6px,0.8vw,8px)] flex-shrink-0">
              <button className="bg-transparent border-none cursor-pointer p-[clamp(6px,0.8vw,8px)] flex items-center justify-center text-gray-500 transition-colors rounded-[clamp(6px,0.8vw,8px)] hover:bg-gray-100 hover:text-[#13335a]" onClick={() => handleCopy('https://www.ourdeals.in')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[clamp(16px,2vw,20px)] h-[clamp(16px,2vw,20px)]">
                  <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M20 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H20C21.1 23 22 22.1 22 21V7C22 5.9 21.1 5 20 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button className="bg-transparent border-none cursor-pointer p-[clamp(6px,0.8vw,8px)] flex items-center justify-center text-gray-500 transition-colors rounded-[clamp(6px,0.8vw,8px)] hover:bg-gray-100 hover:text-[#13335a]" onClick={() => handleLink('https://www.ourdeals.in')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[clamp(16px,2vw,20px)] h-[clamp(16px,2vw,20px)]">
                  <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15 3H21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Company */}
          <div className="bg-white border border-gray-200 rounded-[clamp(10px,1.2vw,12px)] p-[clamp(16px,2vw,20px)] md:p-[clamp(12px,1.5vw,16px)] flex items-center gap-[clamp(12px,1.5vw,16px)] shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
            <div className="w-[clamp(40px,5vw,48px)] h-[clamp(40px,5vw,48px)] rounded-full bg-[#13335a] flex items-center justify-center flex-shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 21H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 21V7L13 2L21 7V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 9V13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 17V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15 13V17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15 9V13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[clamp(14px,1.6vw,16px)] font-bold text-[#1a1a1a] m-0 mb-[clamp(3px,0.4vw,4px)] leading-[1.3]"><TranslatedText>Company</TranslatedText></h4>
              <p className="text-[clamp(12px,1.4vw,14px)] text-gray-500 m-0 leading-[1.4] break-words"><TranslatedText>Our deals Services</TranslatedText></p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-[clamp(16px,2vw,24px)] border-t border-gray-200 mt-[clamp(16px,2vw,24px)]">
          <p className="text-[clamp(12px,1.4vw,14px)] text-gray-500 m-0 leading-[1.5]">© 2025 <TranslatedText>Our deals Services</TranslatedText></p>
        </div>
      </div>
    </div>
  )
}

export default ContactUsPage

