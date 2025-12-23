# Translation Feature Test Suite

This directory contains comprehensive tests for the translation feature of the Our Deals application.

## Test Structure

### Unit Tests

1. **`src/utils/__tests__/translationUtils.test.js`**
   - Tests for utility functions:
     - `mapLanguageCode` - Language code mapping (UI ↔ API)
     - `reverseMapLanguageCode` - Reverse language code mapping
     - `generateCacheKey` - Cache key generation
     - `extractTexts` - Text extraction from objects/arrays
     - `needsTranslation` - Translation necessity check
     - `batchTexts` - Text batching for API calls

2. **`src/services/__tests__/translationService.test.js`**
   - Tests for translation service:
     - Single text translation
     - Batch translation
     - Caching mechanism
     - Error handling
     - API key validation
     - Cache statistics

### Component Tests

3. **`src/contexts/__tests__/TranslationContext.test.jsx`**
   - Tests for TranslationContext:
     - Language state management
     - localStorage persistence
     - Language change events
     - Cache clearing on language change
     - Error handling for invalid localStorage data

4. **`src/hooks/__tests__/useTranslation.test.jsx`**
   - Tests for useTranslation hook:
     - Language and language code access
     - Translation function
     - Loading state management
     - Error handling

5. **`src/hooks/__tests__/useDynamicTranslation.test.jsx`**
   - Tests for useDynamicTranslation hook:
     - Object translation
     - Array translation
     - Key extraction
     - Error handling
     - Loading state

6. **`src/components/__tests__/TranslatedText.test.jsx`**
   - Tests for TranslatedText component:
     - Text rendering
     - Translation triggering
     - Loading states
     - Error handling
     - Prop handling

7. **`src/components/__tests__/LanguageSelector.test.jsx`**
   - Tests for LanguageSelector component:
     - Dropdown functionality
     - Language selection
     - Language persistence
     - Event handling
     - Click outside behavior

### Integration Tests

8. **`src/__tests__/translation.integration.test.jsx`**
   - End-to-end integration tests:
     - Language change flow
     - Cache clearing on language change
     - localStorage persistence
     - Multiple component interaction
     - Event propagation

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm test -- --watch
```

### Run tests with UI
```bash
npm run test:ui
```

### Run tests with coverage
```bash
npm run test:coverage
```

### Run specific test file
```bash
npm test -- translationUtils.test.js
```

### Run tests matching a pattern
```bash
npm test -- --grep "translation"
```

## Test Coverage

The test suite covers:

- ✅ All utility functions
- ✅ Translation service (single & batch)
- ✅ Caching mechanism
- ✅ Error handling
- ✅ Context management
- ✅ React hooks
- ✅ React components
- ✅ Integration scenarios
- ✅ localStorage persistence
- ✅ Event handling

## Mocking

- **Translation Service**: Mocked to avoid actual API calls during tests
- **localStorage**: Cleared before each test
- **Window Events**: Properly handled and cleaned up

## Test Environment

- **Framework**: Vitest
- **React Testing**: @testing-library/react
- **User Interaction**: @testing-library/user-event
- **DOM Environment**: jsdom

## Writing New Tests

When adding new translation features:

1. Add unit tests for new utility functions
2. Add service tests for new API interactions
3. Add component tests for new UI components
4. Add integration tests for new user flows
5. Update this README with new test descriptions

## Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Always clear mocks and localStorage between tests
3. **Async Handling**: Use `waitFor` for async operations
4. **User Events**: Use `@testing-library/user-event` for interactions
5. **Assertions**: Use descriptive test names and clear assertions



