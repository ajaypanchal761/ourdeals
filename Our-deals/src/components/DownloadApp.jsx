import { MdPhoneAndroid } from 'react-icons/md'
import TranslatedText from './TranslatedText'

function DownloadApp({ isMobile = false }) {
  return (
    <div className={`flex items-center gap-0 flex-shrink-0 relative z-[999] ml-auto ${isMobile ? 'md:hidden' : 'hidden md:flex'}`}>
      <a
        href="https://play.google.com/store/apps/details?id=com.appzeto.ourdeals.user"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center bg-white text-black border border-black rounded-lg py-[clamp(6px,0.8vw,10px)] px-[clamp(10px,1.2vw,16px)] cursor-pointer transition-colors whitespace-nowrap font-semibold text-[clamp(11px,1.2vw,14px)] hover:bg-gray-50 gap-2 no-underline"
      >
        <span className="text-black font-semibold"><TranslatedText>Download App</TranslatedText></span>
        <MdPhoneAndroid className="w-5 h-5 text-black" />
      </a>
    </div>
  )
}

export default DownloadApp

