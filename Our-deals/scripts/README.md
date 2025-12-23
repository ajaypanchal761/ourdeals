# Translation API Test Scripts

This directory contains test scripts to verify your Google Cloud Translate API key is working correctly.

## Available Test Scripts

### 1. Node.js Test Script (`test-translation-api.js`)

A command-line script that tests your API key by making actual translation requests.

**Usage:**
```bash
npm run test:api-key
```

Or run directly:
```bash
node scripts/test-translation-api.js
```

**What it does:**
- Loads API key from environment variables or `.env` file
- Tests basic translation (English → Hindi)
- Tests multiple language translations
- Provides detailed error messages if something fails

**Environment Variables:**
The script looks for API key in this order:
1. `VITE_GOOGLE_CLOUD_TRANSLATE_API_KEY` (from process.env)
2. `GOOGLE_CLOUD_TRANSLATE_API_KEY` (from process.env)
3. `VITE_GOOGLE_CLOUD_TRANSLATE_API_KEY` (from .env file)
4. `GOOGLE_CLOUD_TRANSLATE_API_KEY` (from .env file)

### 2. Browser Test Script (`test-translation-api-browser.html`)

An HTML file you can open in your browser to test the API key interactively.

**Usage:**
1. Open `scripts/test-translation-api-browser.html` in your browser
2. Enter your API key
3. Click "Run Tests"
4. View the results

**Features:**
- Interactive UI
- Tests multiple languages
- Shows detailed error messages
- Saves API key in localStorage (for convenience)

## Setting Up Your API Key

### Option 1: Environment File (.env)

Create a `.env` file in the project root:

```env
GOOGLE_CLOUD_TRANSLATE_API_KEY=your_api_key_here
```

Or with VITE_ prefix:

```env
VITE_GOOGLE_CLOUD_TRANSLATE_API_KEY=your_api_key_here
```

### Option 2: Environment Variables

Set the environment variable before running:

**Windows (PowerShell):**
```powershell
$env:GOOGLE_CLOUD_TRANSLATE_API_KEY="your_api_key_here"
npm run test:api-key
```

**Windows (CMD):**
```cmd
set GOOGLE_CLOUD_TRANSLATE_API_KEY=your_api_key_here
npm run test:api-key
```

**Linux/Mac:**
```bash
export GOOGLE_CLOUD_TRANSLATE_API_KEY="your_api_key_here"
npm run test:api-key
```

## Expected Output

### Success:
```
✅ API key found: AIzaSyC1234...5678
ℹ️  API key length: 39 characters

ℹ️  Running basic translation test...

✅ Translation successful!
ℹ️  Original: "Hello, World!"
ℹ️  Translated: "नमस्ते, दुनिया!"

✅ All tests passed! Your API key is working correctly.
```

### Failure:
```
❌ API key not found!
⚠️  Please set one of the following environment variables:
⚠️    - GOOGLE_CLOUD_TRANSLATE_API_KEY
⚠️    - VITE_GOOGLE_CLOUD_TRANSLATE_API_KEY
```

## Troubleshooting

### API Key Not Found
- Make sure your `.env` file is in the project root
- Check that the variable name matches exactly (case-sensitive)
- Restart your terminal/IDE after creating `.env` file

### API Errors
- **403 Forbidden**: API key might not have Cloud Translation API enabled
- **400 Bad Request**: Check API key format
- **401 Unauthorized**: API key is invalid or expired
- **429 Too Many Requests**: Rate limit exceeded, wait a bit

### Network Errors
- Check your internet connection
- Verify firewall/proxy settings
- Make sure `https://translation.googleapis.com` is accessible

## Getting a Google Cloud Translate API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Cloud Translation API
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy the API key and add it to your `.env` file

## Security Notes

⚠️ **Important:**
- Never commit your `.env` file to version control
- Never expose your API key in client-side code (if possible)
- Restrict your API key to specific APIs/IPs in Google Cloud Console
- Use environment variables for production deployments



