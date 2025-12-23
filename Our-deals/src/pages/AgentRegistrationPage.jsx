import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerAgent } from '../services/agentService'
import TranslatedText from '../components/TranslatedText'
import { useTranslation } from '../hooks/useTranslation'

function AgentRegistrationPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    fullName: '', dateOfBirth: '', gender: '', profilePhoto: null,
    mobileNumber: '', alternateMobileNumber: '', email: '', agreeToTerms: false
  })
  const [dragActive, setDragActive] = useState(false)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fields = ['fullName', 'dateOfBirth', 'gender', 'mobileNumber', 'email', 'agreeToTerms']
    const filled = fields.filter(f => formData[f] && formData[f] !== '').length
    setProgress(Math.round((filled / fields.length) * 100))
  }, [formData])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target

    // Normalize mobile numbers to 10 digits (no +91, no spaces or dashes)
    if (name === 'mobileNumber' || name === 'alternateMobileNumber') {
      const numeric = value.replace(/\D/g, '').slice(0, 10)
      setFormData(prev => ({ ...prev, [name]: numeric }))
      return
    }

    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) setFormData(prev => ({ ...prev, profilePhoto: file }))
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true)
    else if (e.type === "dragleave") setDragActive(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files?.[0]) {
      setFormData(prev => ({ ...prev, profilePhoto: e.dataTransfer.files[0] }))
    }
  }

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isValidMobile = (mobile) => /^\d{10}$/.test(mobile)
  const isFormValid = () => formData.fullName.trim() && formData.dateOfBirth && formData.gender &&
    isValidMobile(formData.mobileNumber) && isValidEmail(formData.email) &&
    formData.agreeToTerms

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isFormValid()) {
      setError(t('Please fill all required fields'))
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Map form data to API format
      const agentData = {
        name: formData.fullName.trim(),
        email: formData.email.trim(),
        dob: formData.dateOfBirth,
        gender: formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1), // Capitalize first letter
        profile_img: formData.profilePhoto,
        phone: formData.mobileNumber,
        alternet_mobile: formData.alternateMobileNumber || null,
      }

      const response = await registerAgent(agentData)

      if (response.status === true) {
        // Success - show success message and navigate back
        setSuccess(response.message || 'Agent registered successfully!')
        setError('')
        // Navigate back after a short delay to show success message
        setTimeout(() => {
          navigate(-1)
        }, 1500)
      } else {
        // Handle validation errors
        let errorMessage = response.message || 'Failed to submit registration. Please try again.'

        if (response.errors) {
          // Format validation errors
          const errorMessages = []
          Object.keys(response.errors).forEach(field => {
            const fieldErrors = response.errors[field]
            if (Array.isArray(fieldErrors)) {
              errorMessages.push(...fieldErrors)
            } else {
              errorMessages.push(fieldErrors)
            }
          })

          // Show main message and errors together
          if (errorMessages.length > 0) {
            errorMessage = response.message ? `${response.message}\n\n${errorMessages.join('\n')}` : errorMessages.join('\n')
          }
        }

        setError(errorMessage)
      }
    } catch (err) {
      console.error('Agent Registration Error:', err)
      const errorData = err.response?.data

      // Handle validation errors from catch block
      let errorMessage = errorData?.message || err.message || 'Failed to submit registration. Please try again.'

      if (errorData?.errors) {
        const errorMessages = []
        Object.keys(errorData.errors).forEach(field => {
          const fieldErrors = errorData.errors[field]
          if (Array.isArray(fieldErrors)) {
            errorMessages.push(...fieldErrors)
          } else {
            errorMessages.push(fieldErrors)
          }
        })

        // Show main message and errors together
        if (errorMessages.length > 0) {
          errorMessage = errorData.message ? `${errorData.message}\n\n${errorMessages.join('\n')}` : errorMessages.join('\n')
        }
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-[500px] mx-auto shadow-[0_0_20px_rgba(0,0,0,0.1)] md:max-w-full md:h-screen md:max-h-screen md:overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#13335a] to-[#1e4a7a] px-[clamp(16px,2vw,24px)] py-[clamp(16px,2vw,20px)] flex justify-between items-center fixed top-0 left-0 right-0 z-[1000] flex-shrink-0 w-full max-w-[500px] md:max-w-full mx-auto shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
        <button
          className="bg-transparent border-none text-white cursor-pointer p-0 w-[clamp(28px,3.5vw,32px)] h-[clamp(28px,3.5vw,32px)] flex items-center justify-center rounded-full transition-colors hover:bg-white/20"
          onClick={() => navigate(-1)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 12H5M5 12L12 19M5 12L12 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h2 className="text-[clamp(18px,2.5vw,24px)] font-bold text-white m-0"><TranslatedText>Agent Registration</TranslatedText></h2>
        <div className="w-[clamp(28px,3.5vw,32px)]" />
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200 px-[clamp(16px,2vw,24px)] py-[clamp(8px,2vw,12px)] fixed top-[clamp(56px,7vw,64px)] left-0 right-0 z-[999] w-full max-w-[500px] md:max-w-full mx-auto">
        <div className="flex justify-between items-center mb-[clamp(4px,1vw,6px)]">
          <span className="text-[clamp(11px,2.5vw,13px)] font-semibold text-gray-700"><TranslatedText>Progress</TranslatedText></span>
          <span className="text-[clamp(11px,2.5vw,13px)] font-bold text-[#13335a]">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-[clamp(6px,1.5vw,8px)] overflow-hidden">
          <div className="h-full bg-[#13335a] rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* Content */}
      <div className="px-[clamp(16px,2vw,24px)] py-[clamp(16px,2vw,24px)] pt-[calc(clamp(56px,7vw,64px)+clamp(60px,8vw,72px))] pb-[clamp(80px,12vw,100px)] flex-1 overflow-y-auto overflow-x-hidden [-webkit-overflow-scrolling:touch] min-h-0 md:flex-1 md:overflow-y-auto md:overflow-x-hidden md:min-h-0 md:pt-[calc(clamp(56px,7vw,64px)+clamp(60px,8vw,72px))] md:pb-20">

        {success && (
          <div className="mb-[clamp(14px,3.5vw,20px)] p-[clamp(8px,2vw,10px)] bg-green-50 border border-green-200 rounded-[clamp(6px,1.5vw,8px)] text-green-700 text-[clamp(12px,3vw,14px)]">
            <TranslatedText>{success}</TranslatedText>
          </div>
        )}

        {error && (
          <div className="mb-[clamp(14px,3.5vw,20px)] p-[clamp(8px,2vw,10px)] bg-red-50 border border-red-200 rounded-[clamp(6px,1.5vw,8px)] text-red-700 text-[clamp(12px,3vw,14px)]">
            <div className="whitespace-pre-line"><TranslatedText>{error}</TranslatedText></div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-[clamp(16px,3vw,24px)]">
          {/* Personal Details Section */}
          <div>
            <h3 className="text-[clamp(16px,3.5vw,18px)] font-bold text-[#13335a] mb-[clamp(12px,2.5vw,16px)]"><TranslatedText>Personal Details</TranslatedText></h3>

            <div className="space-y-[clamp(12px,2.5vw,16px)]">
              {/* Full Name */}
              <div className="flex items-center border border-gray-200 rounded-[clamp(6px,1.5vw,8px)] py-[clamp(9px,2.2vw,11px)] px-[clamp(10px,2.5vw,14px)] bg-white focus-within:border-[#13335a]">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder={t('Enter your full name')}
                  className="flex-1 border-none outline-none text-[clamp(13px,3.2vw,15px)] text-[#1a1a1a] bg-transparent"
                  required
                />
              </div>

              {/* Date of Birth and Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[clamp(12px,2.5vw,16px)]">
                <div className="flex items-center border border-gray-200 rounded-[clamp(6px,1.5vw,8px)] py-[clamp(9px,2.2vw,11px)] px-[clamp(10px,2.5vw,14px)] bg-white focus-within:border-[#13335a]">
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="flex-1 border-none outline-none text-[clamp(13px,3.2vw,15px)] text-[#1a1a1a] bg-transparent"
                    required
                  />
                </div>

                <div className="flex items-center border border-gray-200 rounded-[clamp(6px,1.5vw,8px)] py-[clamp(9px,2.2vw,11px)] px-[clamp(10px,2.5vw,14px)] bg-white focus-within:border-[#13335a]">
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="flex-1 border-none outline-none text-[clamp(13px,3.2vw,15px)] text-[#1a1a1a] bg-transparent cursor-pointer"
                    required
                  >
                    <option value="">{t('Select gender')}</option>
                    <option value="male">{t('Male')}</option>
                    <option value="female">{t('Female')}</option>
                    <option value="other">{t('Other')}</option>
                  </select>
                </div>
              </div>

              {/* Profile Photo Upload */}
              <div>
                <label className="block text-[clamp(12px,2.8vw,14px)] font-semibold text-gray-700 mb-[clamp(6px,1.5vw,8px)]"><TranslatedText>Profile Photo</TranslatedText></label>
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('profilePhoto').click()}
                  className={`border-2 border-dashed rounded-[clamp(6px,1.5vw,8px)] p-[clamp(20px,4vw,32px)] bg-gray-50 flex flex-col items-center justify-center cursor-pointer transition-all min-h-[clamp(140px,30vw,180px)] ${dragActive ? 'border-[#13335a] bg-blue-50' : 'border-gray-300 hover:border-[#13335a] hover:bg-gray-100'
                    }`}
                >
                  {formData.profilePhoto ? (
                    <div className="flex flex-col items-center">
                      <img
                        src={URL.createObjectURL(formData.profilePhoto)}
                        alt="Preview"
                        className="max-w-full max-h-[clamp(120px,25vw,192px)] rounded-[clamp(6px,1.5vw,8px)] object-cover mb-[clamp(8px,2vw,12px)] shadow-md"
                      />
                      <span className="text-[clamp(11px,2.5vw,13px)] text-gray-600"><TranslatedText>Click or drag to change</TranslatedText></span>
                    </div>
                  ) : (
                    <>
                      <div className="w-[clamp(48px,12vw,64px)] h-[clamp(48px,12vw,64px)] bg-[#13335a] rounded-full flex items-center justify-center mb-[clamp(8px,2vw,12px)]">
                        <svg className="w-[clamp(24px,6vw,32px)] h-[clamp(24px,6vw,32px)] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <span className="text-[clamp(13px,3vw,15px)] font-semibold text-gray-700 mb-1"><TranslatedText>Upload Photo</TranslatedText></span>
                      <span className="text-[clamp(11px,2.5vw,13px)] text-gray-500"><TranslatedText>Click or drag & drop</TranslatedText></span>
                    </>
                  )}
                  <input type="file" id="profilePhoto" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details Section */}
          <div>
            <h3 className="text-[clamp(16px,3.5vw,18px)] font-bold text-[#13335a] mb-[clamp(12px,2.5vw,16px)]"><TranslatedText>Contact Details</TranslatedText></h3>

            <div className="space-y-[clamp(12px,2.5vw,16px)]">
              {/* Mobile Number */}
              <div className="flex items-center border border-gray-200 rounded-[clamp(6px,1.5vw,8px)] py-[clamp(9px,2.2vw,11px)] px-[clamp(10px,2.5vw,14px)] bg-white focus-within:border-[#13335a]">
                <span className="bg-gray-50 px-2 py-1 text-[#13335a] font-semibold border-r border-gray-300 text-[clamp(12px,3vw,14px)]">
                  +91
                </span>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  placeholder={t('10-digit mobile number')}
                  maxLength="10"
                  className="flex-1 border-none outline-none text-[clamp(13px,3.2vw,15px)] text-[#1a1a1a] bg-transparent ml-2"
                  required
                />
                <span className="text-[clamp(11px,2.5vw,13px)] font-medium text-gray-500 ml-2">{formData.mobileNumber.length}/10</span>
              </div>

              {/* Alternate Mobile */}
              <div className="flex items-center border border-gray-200 rounded-[clamp(6px,1.5vw,8px)] py-[clamp(9px,2.2vw,11px)] px-[clamp(10px,2.5vw,14px)] bg-white focus-within:border-[#13335a]">
                <span className="bg-gray-50 px-2 py-1 text-[#13335a] font-semibold border-r border-gray-300 text-[clamp(12px,3vw,14px)]">
                  +91
                </span>
                <input
                  type="tel"
                  name="alternateMobileNumber"
                  value={formData.alternateMobileNumber}
                  onChange={handleInputChange}
                  placeholder={t('Alternate mobile (optional)')}
                  maxLength="10"
                  className="flex-1 border-none outline-none text-[clamp(13px,3.2vw,15px)] text-[#1a1a1a] bg-transparent ml-2"
                />
              </div>

              {/* Email */}
              <div className="flex items-center border border-gray-200 rounded-[clamp(6px,1.5vw,8px)] py-[clamp(9px,2.2vw,11px)] px-[clamp(10px,2.5vw,14px)] bg-white focus-within:border-[#13335a]">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  className="flex-1 border-none outline-none text-[clamp(13px,3.2vw,15px)] text-[#1a1a1a] bg-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start gap-[clamp(8px,2vw,12px)]">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              className="w-[clamp(16px,4vw,20px)] h-[clamp(16px,4vw,20px)] mt-0.5 cursor-pointer accent-[#13335a] rounded shrink-0"
              required
            />
            <label className="text-[clamp(12px,2.8vw,14px)] text-gray-700 cursor-pointer">
              <TranslatedText>I agree to the</TranslatedText> <span className="font-semibold text-[#13335a]"><TranslatedText>terms and conditions</TranslatedText></span> <TranslatedText>and confirm that all information provided is accurate.</TranslatedText>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid() || loading}
            className="w-full bg-[#13335a] text-white border-none py-[clamp(10px,2.5vw,12px)] px-[clamp(16px,4vw,20px)] rounded-[clamp(6px,1.5vw,8px)] font-semibold text-[clamp(13px,3.2vw,15px)] cursor-pointer transition-colors leading-[1.5] hover:bg-[#0f2440] disabled:bg-gray-400 disabled:cursor-not-allowed mb-[clamp(16px,3vw,24px)]"
          >
            {loading ? <TranslatedText>Submitting...</TranslatedText> : isFormValid() ? <TranslatedText>Submit Registration</TranslatedText> : <TranslatedText>Complete All Required Fields</TranslatedText>}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AgentRegistrationPage
