
function Logo() {
  return (
    <div className="flex items-center gap-3">
      <svg 
        className="w-[50px] h-[50px]" 
        viewBox="0 0 200 80" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Orange circle */}
        <circle cx="25" cy="20" r="12" fill="#ff6600" />
        
        {/* Dark blue U shape */}
        <path 
          d="M 15 35 Q 15 55 35 55 L 65 55 Q 85 55 85 35 L 85 20" 
          stroke="#1a237e" 
          strokeWidth="8" 
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-[32px] font-bold text-[#1a237e] tracking-[-0.5px]">Ourdeals</span>
    </div>
  )
}

export default Logo

