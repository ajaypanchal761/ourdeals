import { useState, useEffect } from 'react'
import { updateProfile } from '../services/userService'

function EditProfileModal({ isOpen, onClose, userData, onUpdate }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen && userData) {
      setName(userData.name || '')
      setEmail(userData.email || '')
      setPhone(userData.phone || userData.mobile || userData.mobileNumber || '')
      setCity(userData.city || '')
      setAddress(userData.address || '')
      setError('')
    }
  }, [isOpen, userData])

  if (!isOpen) return null

  const handleUpdate = async () => {
    if (!name.trim()) {
      setError('Name is required')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Get id from userData or localStorage
      const storedUser = JSON.parse(localStorage.getItem('userData') || '{}')
      const userId = userData?.id || storedUser.id

      if (!userId) {
        setError('User ID not found. Please login again.')
        setLoading(false)
        return
      }

      // Format phone number (remove +91 if present)
      const phoneNumber = phone.startsWith('+91') ? phone.replace('+91', '') : phone.replace(/\D/g, '')

      // Call update profile API with `user_id` as per backend contract
      const response = await updateProfile({
        user_id: userId,
        name: name.trim(),
        email: email.trim(),
        phone: phoneNumber,
        city: city.trim(),
        address: address.trim()
      })

      if (response.status === true && response.user) {
        console.log('EditProfileModal: API response received:', response.user)
        
        const apiUser = response.user
        // Overwrite localStorage userData with latest basic fields from API response
      const updatedData = {
          id: apiUser.id ?? userId,
          name: apiUser.name ?? name.trim(),
          email: apiUser.email ?? email.trim(),
          phone: apiUser.phone ?? phoneNumber,
          city: apiUser.city ?? city.trim(),
          address: apiUser.address ?? address.trim(),
        }

        console.log('EditProfileModal: Updated data to save:', updatedData)

        // Save to localStorage
        localStorage.setItem('userData', JSON.stringify(updatedData))
        console.log('EditProfileModal: User data saved to localStorage')
        
        // Dispatch event to update other components (Header, etc.)
        window.dispatchEvent(new CustomEvent('userLogin'))
        console.log('EditProfileModal: userLogin event dispatched')

        // Call onUpdate callback to update ProfilePage state immediately
      if (onUpdate) {
          console.log('EditProfileModal: Calling onUpdate callback')
        onUpdate(updatedData)
      }
        
      onClose()
      } else {
        setError(response.message || 'Failed to update profile')
      }
    } catch (err) {
      console.error('Update Profile Error:', err)
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to update profile. Please try again.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (userData) {
      setName(userData.name || '')
      setEmail(userData.email || '')
      setPhone(userData.phone || userData.mobile || userData.mobileNumber || '')
      setCity(userData.city || '')
      setAddress(userData.address || '')
    }
    setError('')
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-[8px] z-[10002] animate-[fadeIn_0.3s_ease-in-out]" onClick={handleCancel}></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-[clamp(10px,2.5vw,14px)] shadow-[0_20px_60px_rgba(0,0,0,0.3)] w-[90%] max-w-[400px] md:w-[95%] z-[10003] animate-[modalFadeIn_0.3s_ease-out] overflow-hidden p-[clamp(14px,3.5vw,20px)] md:p-[clamp(12px,3vw,16px)]" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-[clamp(16px,4vw,20px)] font-bold text-[#13335a] m-0 mb-[clamp(14px,3.5vw,20px)] text-center leading-[1.3]">Edit Profile</h2>

        <div className="flex justify-center mb-[clamp(14px,3.5vw,20px)]">
          <div className="relative w-[clamp(60px,15vw,90px)] h-[clamp(60px,15vw,90px)] rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-[clamp(26px,6.5vw,42px)] font-bold text-gray-500">
              {name ? name.charAt(0).toUpperCase() : (userData?.name ? userData.name.charAt(0).toUpperCase() : 'U')}
            </span>
            <div className="absolute bottom-0 right-0 w-[clamp(22px,5.5vw,28px)] h-[clamp(22px,5.5vw,28px)] rounded-full bg-[#13335a] flex items-center justify-center text-white border-[clamp(2px,0.5vw,3px)] border-white cursor-pointer transition-colors hover:bg-[#0f2440]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[clamp(11px,2.8vw,14px)] h-[clamp(11px,2.8vw,14px)]">
                <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M18.5 2.50023C18.8978 2.10243 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.10243 21.5 2.50023C21.8978 2.89804 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.10243 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-[clamp(10px,2.5vw,14px)] p-[clamp(8px,2vw,10px)] bg-red-50 border border-red-200 rounded-[clamp(6px,1.5vw,8px)] text-red-700 text-[clamp(12px,3vw,14px)]">
            {error}
          </div>
        )}

        <div className="space-y-[clamp(10px,2.5vw,14px)] mb-[clamp(14px,3.5vw,20px)] max-h-[60vh] overflow-y-auto">
          {/* Name */}
          <div className="flex items-center border-[clamp(1.5px,0.4vw,2px)] border-gray-200 rounded-[clamp(6px,1.5vw,8px)] py-[clamp(9px,2.2vw,11px)] px-[clamp(10px,2.5vw,14px)] transition-colors bg-white focus-within:border-[#13335a]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500 mr-[clamp(7px,1.8vw,10px)] flex-shrink-0 w-[clamp(16px,4vw,18px)] h-[clamp(16px,4vw,18px)]">
              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <input
              type="text"
              className="flex-1 border-none outline-none text-[clamp(13px,3.2vw,15px)] text-[#1a1a1a] bg-transparent leading-[1.5] placeholder:text-gray-400 placeholder:text-[clamp(13px,3.2vw,15px)]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Email */}
          <div className="flex items-center border-[clamp(1.5px,0.4vw,2px)] border-gray-200 rounded-[clamp(6px,1.5vw,8px)] py-[clamp(9px,2.2vw,11px)] px-[clamp(10px,2.5vw,14px)] transition-colors bg-white focus-within:border-[#13335a]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500 mr-[clamp(7px,1.8vw,10px)] flex-shrink-0 w-[clamp(16px,4vw,18px)] h-[clamp(16px,4vw,18px)]">
              <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="L22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <input
              type="email"
              className="flex-1 border-none outline-none text-[clamp(13px,3.2vw,15px)] text-[#1a1a1a] bg-transparent leading-[1.5] placeholder:text-gray-400 placeholder:text-[clamp(13px,3.2vw,15px)]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          {/* Phone */}
          <div className="flex items-center border-[clamp(1.5px,0.4vw,2px)] border-gray-200 rounded-[clamp(6px,1.5vw,8px)] py-[clamp(9px,2.2vw,11px)] px-[clamp(10px,2.5vw,14px)] transition-colors bg-white focus-within:border-[#13335a]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500 mr-[clamp(7px,1.8vw,10px)] flex-shrink-0 w-[clamp(16px,4vw,18px)] h-[clamp(16px,4vw,18px)]">
              <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7292C21.7209 20.9842 21.5573 21.2131 21.3522 21.4011C21.1471 21.5891 20.905 21.7319 20.6409 21.8201C20.3768 21.9083 20.0965 21.9399 19.82 21.912C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.19 12.85C3.49997 10.2412 2.44824 7.27099 2.12 4.18C2.09211 3.90354 2.12368 3.62321 2.21191 3.35912C2.30013 3.09503 2.44294 2.85293 2.63093 2.64783C2.81892 2.44273 3.04784 2.27916 3.30282 2.16757C3.5578 2.05598 3.83352 1.99906 4.12 2H7.12C7.68147 1.99522 8.22211 2.16708 8.65891 2.48781C9.09571 2.80854 9.40329 3.25991 9.53 3.77L10.9 8.62C10.9653 8.90354 10.9763 9.20041 10.9321 9.49063C10.8879 9.78085 10.7896 10.0582 10.6441 10.3062C10.4986 10.5542 10.3092 10.7672 10.0878 10.933C9.86637 11.0988 9.61777 11.2138 9.357 11.271C7.89687 11.5854 6.58701 12.3969 5.62 13.58C6.80314 14.547 7.61459 15.8569 7.93 17.317C7.98718 17.5778 8.10219 17.8264 8.26799 18.0478C8.43379 18.2692 8.64677 18.4586 8.89478 18.6041C9.14279 18.7496 9.42015 18.8479 9.71037 18.8921C10.0006 18.9363 10.2975 18.9253 10.581 18.86L15.38 20.23C15.8901 20.3567 16.3415 20.6643 16.6622 21.1011C16.9829 21.5379 17.1548 22.0785 17.15 22.64L17.14 22.92H17.15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex items-center flex-1">
              <span className="bg-gray-50 px-2 py-1 text-[#13335a] font-semibold border-r border-gray-300 text-[clamp(12px,3vw,14px)]">+91</span>
              <input
                type="tel"
                className="flex-1 border-none outline-none text-[clamp(13px,3.2vw,15px)] text-[#1a1a1a] bg-transparent leading-[1.5] placeholder:text-gray-400 placeholder:text-[clamp(13px,3.2vw,15px)] ml-2"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="Enter phone number"
                maxLength="10"
              />
            </div>
          </div>

          {/* City */}
          <div className="flex items-center border-[clamp(1.5px,0.4vw,2px)] border-gray-200 rounded-[clamp(6px,1.5vw,8px)] py-[clamp(9px,2.2vw,11px)] px-[clamp(10px,2.5vw,14px)] transition-colors bg-white focus-within:border-[#13335a]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500 mr-[clamp(7px,1.8vw,10px)] flex-shrink-0 w-[clamp(16px,4vw,18px)] h-[clamp(16px,4vw,18px)]">
              <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor" />
            </svg>
            <input
              type="text"
              className="flex-1 border-none outline-none text-[clamp(13px,3.2vw,15px)] text-[#1a1a1a] bg-transparent leading-[1.5] placeholder:text-gray-400 placeholder:text-[clamp(13px,3.2vw,15px)]"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter your city"
            />
          </div>

          {/* Address */}
          <div className="flex items-start border-[clamp(1.5px,0.4vw,2px)] border-gray-200 rounded-[clamp(6px,1.5vw,8px)] py-[clamp(9px,2.2vw,11px)] px-[clamp(10px,2.5vw,14px)] transition-colors bg-white focus-within:border-[#13335a]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500 mr-[clamp(7px,1.8vw,10px)] flex-shrink-0 w-[clamp(16px,4vw,18px)] h-[clamp(16px,4vw,18px)] mt-1">
              <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <textarea
              className="flex-1 border-none outline-none text-[clamp(13px,3.2vw,15px)] text-[#1a1a1a] bg-transparent leading-[1.5] placeholder:text-gray-400 placeholder:text-[clamp(13px,3.2vw,15px)] resize-none min-h-[60px]"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address"
              rows="3"
            />
          </div>
        </div>

        <div className="flex flex-col gap-[clamp(7px,1.8vw,10px)]">
          <button className="w-full bg-[#13335a] text-white border-none py-[clamp(10px,2.5vw,12px)] px-[clamp(16px,4vw,20px)] rounded-[clamp(6px,1.5vw,8px)] font-semibold text-[clamp(13px,3.2vw,15px)] cursor-pointer transition-colors leading-[1.5] hover:bg-[#0f2440] disabled:bg-gray-400 disabled:cursor-not-allowed" onClick={handleUpdate} disabled={!name.trim() || loading}>
            {loading ? 'Updating...' : 'Update'}
          </button>
          <button className="w-full bg-transparent border-none text-gray-500 text-[clamp(12px,3vw,14px)] font-medium cursor-pointer p-[clamp(5px,1.2vw,7px)] transition-colors leading-[1.5] hover:text-gray-700" onClick={handleCancel} disabled={loading}>
            Cancel
          </button>
        </div>
      </div>
    </>
  )
}

export default EditProfileModal

