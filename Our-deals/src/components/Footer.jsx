import { useNavigate } from 'react-router-dom'
import TranslatedText from './TranslatedText'

function Footer() {
  const navigate = useNavigate()

  return (
    <footer className="w-full bg-[#1A3760] text-white pt-[clamp(8px,1vw,12px)] pb-0 px-0 max-w-none">
      <div className="w-full max-w-[1400px] mx-auto px-[clamp(16px,2vw,24px)]">
        <div className="grid grid-cols-3 gap-[clamp(8px,1vw,24px)] mb-[clamp(16px,2vw,28px)] justify-items-center">
          {/* About Section */}
          <div className="flex flex-col">
            <h3 className="text-[14px] font-bold text-white mb-[clamp(6px,0.8vw,12px)]"><TranslatedText>About Us</TranslatedText></h3>
            <p className="text-[clamp(8px,1vw,12px)] text-white leading-[1.6] m-0">
              <TranslatedText>Your trusted platform to discover and connect with verified businesses across India. Find the best services, deals, and vendors in your city.</TranslatedText>
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col">
            <h3 className="text-[14px] font-bold text-white mb-[clamp(6px,0.8vw,12px)]"><TranslatedText>Quick Links</TranslatedText></h3>
            <ul className="list-none p-0 m-0 flex flex-col gap-[clamp(4px,0.6vw,8px)]">
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate('/categories') }} className="text-[clamp(8px,1vw,12px)] text-white no-underline hover:underline">
                  <TranslatedText>Categories</TranslatedText>
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate('/vendors/Grocery') }} className="text-[clamp(8px,1vw,12px)] text-white no-underline hover:underline">
                  <TranslatedText>Vendors</TranslatedText>
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate('/contact-us') }} className="text-[clamp(8px,1vw,12px)] text-white no-underline hover:underline">
                  <TranslatedText>Contact Us</TranslatedText>
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate('/privacy-policy') }} className="text-[clamp(8px,1vw,12px)] text-white no-underline hover:underline">
                  <TranslatedText>Privacy Policy</TranslatedText>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col">
            <h3 className="text-[14px] font-bold text-white mb-[clamp(6px,0.8vw,12px)]"><TranslatedText>Contact</TranslatedText></h3>
            <div className="flex flex-col gap-[clamp(4px,0.6vw,10px)]">
              <div className="flex items-center gap-[clamp(4px,0.6vw,8px)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white flex-shrink-0 w-[clamp(10px,1.2vw,14px)] h-[clamp(10px,1.2vw,14px)]">
                  <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7292C21.7209 20.9842 21.5573 21.2126 21.3518 21.3992C21.1463 21.5858 20.9033 21.7262 20.6381 21.811C20.3729 21.8958 20.0922 21.9231 19.815 21.891C16.7428 21.5856 13.786 20.5341 11.19 18.82C8.77382 17.3148 6.72533 15.2663 5.22 12.85C3.49997 10.2412 2.44824 7.27099 2.15 4.18C2.11793 3.90322 2.14518 3.62281 2.22981 3.35788C2.31444 3.09295 2.45452 2.85002 2.64082 2.64458C2.82712 2.43914 3.05531 2.27554 3.31007 2.16389C3.56483 2.05224 3.84034 1.99508 4.119 2H7.119C7.59357 1.99522 8.05808 2.16708 8.43322 2.49055C8.80836 2.81402 9.07173 3.27236 9.179 3.78L9.88 6.75C9.98603 7.24195 9.93842 7.75767 9.74447 8.22293C9.55052 8.68819 9.21969 9.08114 8.8 9.35L7.33 10.28C8.47697 12.3301 10.1699 14.023 12.22 15.17L13.15 13.71C13.4201 13.2908 13.8132 12.9602 14.2784 12.7663C14.7436 12.5724 15.2591 12.5247 15.75 12.63L18.71 13.33C19.2176 13.4373 19.676 13.7007 19.9995 14.0758C20.323 14.4509 20.4948 14.9154 20.49 15.39L22 19.39Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[clamp(8px,1vw,12px)] text-white break-words">+91 1234567890</span>
              </div>
              <div className="flex items-center gap-[clamp(4px,0.6vw,8px)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white flex-shrink-0 w-[clamp(10px,1.2vw,14px)] h-[clamp(10px,1.2vw,14px)]">
                  <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[clamp(8px,1vw,12px)] text-white break-words">support@ourdeals.com</span>
              </div>
              <div className="flex items-center gap-[clamp(4px,0.6vw,8px)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white flex-shrink-0 w-[clamp(10px,1.2vw,14px)] h-[clamp(10px,1.2vw,14px)]">
                  <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[clamp(8px,1vw,12px)] text-white break-words"><TranslatedText>123 Business Street, City, State</TranslatedText></span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/30 pt-[clamp(12px,1.5vw,20px)] mt-[clamp(12px,1.5vw,20px)]">
          <p className="text-center text-[clamp(8px,1vw,12px)] text-white m-0">
            &copy; 2024 <TranslatedText>Our Deals. All rights reserved.</TranslatedText>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
