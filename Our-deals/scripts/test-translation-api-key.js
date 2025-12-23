#!/usr/bin/env node

/**
 * Test Google Translate API Key
 * Run this script to verify your API key works correctly
 *
 * Usage: node scripts/test-translation-api-key.js
 */

import https from 'https';

const API_KEY = process.env.VITE_GOOGLE_CLOUD_TRANSLATE_API_KEY || 'AIzaSyCJ93FSo-ZXlnpn57KozyhzuSzYqpj9XwM';

console.log('🔍 Testing Google Translate API Key...');
console.log('API Key:', API_KEY.substring(0, 20) + '...');

const testTranslation = () => {
  const postData = JSON.stringify({
    q: ['Hello world'],
    target: 'hi',
    source: 'en',
  });

  const options = {
    hostname: 'translation.googleapis.com',
    port: 443,
    path: `/language/translate/v2?key=${API_KEY}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    },
  };

  const req = https.request(options, (res) => {
    console.log(`📡 HTTP Status: ${res.statusCode}`);

    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const responseData = JSON.parse(data);

        if (res.statusCode === 200) {
          console.log('✅ API Key is valid!');
          console.log('📝 Translated text:', responseData.data.translations[0].translatedText);
          process.exit(0);
        } else {
          console.log('❌ API Error:', responseData.error.message);
          console.log('🔍 Error details:');

          if (res.statusCode === 403) {
            console.log('  🚫 403 Forbidden - This usually means:');
            console.log('     • API key is invalid or expired');
            console.log('     • Cloud Translation API is not enabled for your project');
            console.log('     • API key doesn\'t have translation permissions');
            console.log('     • Billing restrictions or referrer limits');
            console.log('');
            console.log('  🛠️  Solutions:');
            console.log('     1. Go to Google Cloud Console: https://console.cloud.google.com/');
            console.log('     2. Enable Cloud Translation API:');
            console.log('        https://console.cloud.google.com/apis/library/translate.googleapis.com');
            console.log('     3. Check your API key in Credentials:');
            console.log('        https://console.cloud.google.com/apis/credentials');
            console.log('     4. Verify billing is enabled for your project');
            console.log('     5. Create a new API key if needed');
          }

          process.exit(1);
        }
      } catch (error) {
        console.log('❌ Error parsing response:', error.message);
        console.log('Raw response:', data);
        process.exit(1);
      }
    });
  });

  req.on('error', (error) => {
    console.log('❌ Network Error:', error.message);
    process.exit(1);
  });

  req.write(postData);
  req.end();
};

testTranslation();
