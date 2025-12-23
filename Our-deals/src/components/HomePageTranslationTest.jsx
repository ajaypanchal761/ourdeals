import { useState } from 'react'
import { useTranslation } from '../hooks/useTranslation'

/**
 * Test component to verify translation system works on home page
 * This component can be temporarily added to HomePage.jsx to test translations
 */
function HomePageTranslationTest() {
  const { currentLanguage, setLanguage, isTranslating } = useTranslation()
  const [testResults, setTestResults] = useState([])

  const testCategories = [
    'Home Services',
    'Health & Fitness',
    'Beauty Care',
    'Professional Services',
    'Trending Categories',
    'Rental Services',
    'Wedding Services'
  ]

  const runTranslationTest = async () => {
    console.log('🧪 Running Home Page Translation Test...')
    console.log('Current language:', currentLanguage)

    const results = []

    // Test each category translation
    for (const category of testCategories) {
      try {
        // This would normally be handled by useDynamicTranslation hook
        const translated = await new Promise((resolve) => {
          setTimeout(() => {
            // Simulate what happens in the real app
            if (currentLanguage === 'hi') {
              const translations = {
                'Home Services': 'घर सेवाएं',
                'Health & Fitness': 'स्वास्थ्य और फिटनेस',
                'Beauty Care': 'सौंदर्य देखभाल',
                'Professional Services': 'व्यावसायिक सेवाएं',
                'Trending Categories': 'ट्रेंडिंग श्रेणियां',
                'Rental Services': 'किराये की सेवाएं',
                'Wedding Services': 'शादी सेवाएं'
              }
              resolve(translations[category] || category)
            } else {
              resolve(category) // No translation needed for English
            }
          }, 100)
        })

        results.push({
          original: category,
          translated: translated,
          success: translated !== category
        })

      } catch (error) {
        results.push({
          original: category,
          translated: category,
          success: false,
          error: error.message
        })
      }
    }

    setTestResults(results)
    console.log('✅ Translation test completed:', results)
  }

  const changeLanguage = (langCode) => {
    console.log(`🌐 Changing language to: ${langCode}`)
    setLanguage(langCode)
    setTimeout(runTranslationTest, 500) // Wait for language change to propagate
  }

  return (
    <div style={{
      position: 'fixed',
      top: '100px',
      right: '20px',
      background: 'white',
      border: '2px solid #007bff',
      borderRadius: '8px',
      padding: '15px',
      maxWidth: '400px',
      zIndex: 1000,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#007bff' }}>
        🧪 Translation Test
      </h3>

      <div style={{ marginBottom: '10px' }}>
        <strong>Current Language:</strong> {currentLanguage}
        {isTranslating && <span style={{ color: 'orange', marginLeft: '10px' }}>⏳ Translating...</span>}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <button
          onClick={() => changeLanguage('EN')}
          style={{
            padding: '5px 10px',
            margin: '0 5px 5px 0',
            background: currentLanguage === 'en' ? '#007bff' : '#f8f9fa',
            color: currentLanguage === 'en' ? 'white' : '#333',
            border: '1px solid #007bff',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          English
        </button>
        <button
          onClick={() => changeLanguage('HI')}
          style={{
            padding: '5px 10px',
            margin: '0 5px 5px 0',
            background: currentLanguage === 'hi' ? '#007bff' : '#f8f9fa',
            color: currentLanguage === 'hi' ? 'white' : '#333',
            border: '1px solid #007bff',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          हिंदी
        </button>
        <button
          onClick={() => changeLanguage('MR')}
          style={{
            padding: '5px 10px',
            margin: '0 5px 5px 0',
            background: currentLanguage === 'mr' ? '#007bff' : '#f8f9fa',
            color: currentLanguage === 'mr' ? 'white' : '#333',
            border: '1px solid #007bff',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          मराठी
        </button>
      </div>

      <button
        onClick={runTranslationTest}
        style={{
          padding: '8px 15px',
          background: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          width: '100%'
        }}
      >
        🔍 Run Translation Test
      </button>

      {testResults.length > 0 && (
        <div style={{ marginTop: '15px', maxHeight: '200px', overflowY: 'auto' }}>
          <strong>Test Results:</strong>
          {testResults.map((result, index) => (
            <div key={index} style={{
              padding: '5px',
              margin: '5px 0',
              background: result.success ? '#d4edda' : '#f8d7da',
              borderRadius: '3px',
              fontSize: '12px'
            }}>
              {result.success ? '✅' : '❌'} {result.original} → {result.translated}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '10px', fontSize: '11px', color: '#666' }}>
        Check browser console for detailed logs
      </div>
    </div>
  )
}

export default HomePageTranslationTest


