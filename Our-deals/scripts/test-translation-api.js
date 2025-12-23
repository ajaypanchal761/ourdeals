/**
 * Test Script for Google Cloud Translate API Key
 * 
 * This script tests the Google Cloud Translate API key by making a test translation request.
 * 
 * Usage:
 *   node scripts/test-translation-api.js
 * 
 * Make sure your .env file contains:
 *   GOOGLE_CLOUD_TRANSLATE_API_KEY=your_api_key_here
 *   OR
 *   VITE_GOOGLE_CLOUD_TRANSLATE_API_KEY=your_api_key_here
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green')
}

function logError(message) {
  log(`❌ ${message}`, 'red')
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow')
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'cyan')
}

/**
 * Load environment variables from .env file
 */
function loadEnvFile() {
  const envPath = join(rootDir, '.env')
  
  if (!existsSync(envPath)) {
    logWarning('.env file not found. Trying to read from process.env...')
    return {}
  }

  const envContent = readFileSync(envPath, 'utf-8')
  const envVars = {}
  
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=')
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim()
        // Remove quotes if present
        envVars[key.trim()] = value.replace(/^["']|["']$/g, '')
      }
    }
  })
  
  return envVars
}

/**
 * Get API key from environment
 */
function getApiKey() {
  const envVars = loadEnvFile()
  
  // Try both VITE_ prefixed and direct env variable
  const apiKey = 
    process.env.VITE_GOOGLE_CLOUD_TRANSLATE_API_KEY ||
    process.env.GOOGLE_CLOUD_TRANSLATE_API_KEY ||
    envVars.VITE_GOOGLE_CLOUD_TRANSLATE_API_KEY ||
    envVars.GOOGLE_CLOUD_TRANSLATE_API_KEY ||
    ''
  
  return apiKey
}

/**
 * Test Google Cloud Translate API
 */
async function testTranslationAPI(apiKey) {
  const testText = 'Hello, World!'
  const targetLang = 'hi' // Hindi
  const sourceLang = 'en'
  
  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`
  
  logInfo(`Testing translation: "${testText}" (${sourceLang} → ${targetLang})`)
  logInfo(`API URL: ${url.replace(apiKey, '***API_KEY***')}`)
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: [testText],
        target: targetLang,
        source: sourceLang,
      }),
    })
    
    const responseText = await response.text()
    let data
    
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      logError(`Failed to parse response: ${responseText}`)
      return false
    }
    
    if (!response.ok) {
      logError(`API Error: ${response.status} ${response.statusText}`)
      if (data.error) {
        logError(`Error Message: ${data.error.message || JSON.stringify(data.error)}`)
        if (data.error.errors) {
          data.error.errors.forEach(err => {
            logError(`  - ${err.message || JSON.stringify(err)}`)
          })
        }
      }
      return false
    }
    
    if (data.error) {
      logError(`API returned error: ${data.error.message || JSON.stringify(data.error)}`)
      return false
    }
    
    const translatedText = data.data?.translations?.[0]?.translatedText
    
    if (!translatedText) {
      logError('No translation found in response')
      logInfo(`Response: ${JSON.stringify(data, null, 2)}`)
      return false
    }
    
    logSuccess(`Translation successful!`)
    logInfo(`Original: "${testText}"`)
    logInfo(`Translated: "${translatedText}"`)
    
    return true
  } catch (error) {
    logError(`Network error: ${error.message}`)
    if (error.stack) {
      logError(`Stack trace: ${error.stack}`)
    }
    return false
  }
}

/**
 * Test multiple languages
 */
async function testMultipleLanguages(apiKey) {
  const testCases = [
    { text: 'Hello', source: 'en', target: 'hi', expected: 'नमस्ते' },
    { text: 'Thank you', source: 'en', target: 'mr', expected: 'धन्यवाद' },
    { text: 'Good morning', source: 'en', target: 'bn', expected: 'সুপ্রভাত' },
  ]
  
  logInfo('\nTesting multiple languages...')
  
  let successCount = 0
  for (const testCase of testCases) {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: [testCase.text],
          target: testCase.target,
          source: testCase.source,
        }),
      })
      
      const data = await response.json()
      
      if (data.error || !response.ok) {
        logError(`Failed: ${testCase.text} (${testCase.source} → ${testCase.target})`)
        if (data.error) {
          logError(`  Error: ${data.error.message}`)
        }
      } else {
        const translated = data.data?.translations?.[0]?.translatedText
        logSuccess(`${testCase.text} → ${translated} (${testCase.source} → ${testCase.target})`)
        successCount++
      }
    } catch (error) {
      logError(`Failed: ${testCase.text} - ${error.message}`)
    }
  }
  
  logInfo(`\nSuccessfully translated ${successCount}/${testCases.length} texts`)
  return successCount === testCases.length
}

/**
 * Main test function
 */
async function main() {
  log('\n' + '='.repeat(60), 'bright')
  log('Google Cloud Translate API Key Test', 'bright')
  log('='.repeat(60) + '\n', 'bright')
  
  // Check for API key
  const apiKey = getApiKey()
  
  if (!apiKey) {
    logError('API key not found!')
    logWarning('Please set one of the following environment variables:')
    logWarning('  - GOOGLE_CLOUD_TRANSLATE_API_KEY')
    logWarning('  - VITE_GOOGLE_CLOUD_TRANSLATE_API_KEY')
    logWarning('\nOr add it to your .env file:')
    logWarning('  GOOGLE_CLOUD_TRANSLATE_API_KEY=your_api_key_here')
    process.exit(1)
  }
  
  logSuccess(`API key found: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`)
  logInfo(`API key length: ${apiKey.length} characters\n`)
  
  // Test basic translation
  logInfo('Running basic translation test...\n')
  const basicTestPassed = await testTranslationAPI(apiKey)
  
  if (!basicTestPassed) {
    logError('\nBasic test failed. Please check your API key and try again.')
    process.exit(1)
  }
  
  // Test multiple languages
  log('\n' + '-'.repeat(60))
  const multiTestPassed = await testMultipleLanguages(apiKey)
  
  // Summary
  log('\n' + '='.repeat(60), 'bright')
  if (basicTestPassed && multiTestPassed) {
    logSuccess('All tests passed! Your API key is working correctly.')
    logInfo('You can now use the translation feature in your application.')
  } else {
    logWarning('Some tests failed. Please check the errors above.')
  }
  log('='.repeat(60) + '\n', 'bright')
  
  process.exit(basicTestPassed && multiTestPassed ? 0 : 1)
}

// Run the test
main().catch(error => {
  logError(`Unexpected error: ${error.message}`)
  if (error.stack) {
    logError(`Stack trace: ${error.stack}`)
  }
  process.exit(1)
})



