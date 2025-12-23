# Translation Tests - Quick Start Guide

## Installation

First, install all dependencies:

```bash
npm install
```

## Running Tests

### Basic Commands

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-runs on file changes)
npm test -- --watch

# Run tests with interactive UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

### Running Specific Tests

```bash
# Run a specific test file
npm test -- translationUtils.test.js

# Run tests matching a pattern
npm test -- --grep "translation"

# Run tests in a specific directory
npm test -- src/utils/__tests__/
```

## Test Structure

```
src/
├── test/
│   ├── setup.js              # Test configuration and mocks
│   └── README.md             # Detailed test documentation
├── utils/__tests__/
│   └── translationUtils.test.js
├── services/__tests__/
│   └── translationService.test.js
├── contexts/__tests__/
│   └── TranslationContext.test.jsx
├── hooks/__tests__/
│   ├── useTranslation.test.jsx
│   └── useDynamicTranslation.test.jsx
├── components/__tests__/
│   ├── TranslatedText.test.jsx
│   └── LanguageSelector.test.jsx
└── __tests__/
    └── translation.integration.test.jsx
```

## What's Tested

### ✅ Utilities (39 tests)
- Language code mapping
- Cache key generation
- Text extraction
- Translation necessity checks
- Text batching

### ✅ Services (22 tests)
- Single text translation
- Batch translation
- Caching mechanism
- Error handling
- API integration

### ✅ Context (12 tests)
- Language state management
- localStorage persistence
- Event handling

### ✅ Hooks (34 tests)
- useTranslation hook
- useDynamicTranslation hook
- Error handling
- Loading states

### ✅ Components (21 tests)
- TranslatedText component
- LanguageSelector component
- User interactions

### ✅ Integration (8 tests)
- End-to-end flows
- Component interactions
- Event propagation

## Troubleshooting

### Tests not running?
- Ensure all dependencies are installed: `npm install`
- Check Node.js version (should be 16+)
- Verify Vitest is installed: `npm list vitest`

### Tests failing?
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for console errors in test output
- Verify environment variables are set correctly

### Coverage not showing?
- Run: `npm run test:coverage`
- Check that coverage provider is configured in `vitest.config.js`

## CI/CD Integration

Add to your CI pipeline:

```yaml
# Example GitHub Actions
- name: Run tests
  run: npm test

- name: Generate coverage
  run: npm run test:coverage
```

## Need Help?

- See `src/test/README.md` for detailed documentation
- See `TRANSLATION_TESTS_SUMMARY.md` for complete overview
- Check test files for examples of how to write new tests



