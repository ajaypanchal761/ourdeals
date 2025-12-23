import { describe, it, expect } from 'vitest'
import {
  mapLanguageCode,
  reverseMapLanguageCode,
  generateCacheKey,
  extractTexts,
  needsTranslation,
  batchTexts,
} from '../translationUtils'

describe('translationUtils', () => {
  describe('mapLanguageCode', () => {
    it('should map UI language codes to API codes', () => {
      expect(mapLanguageCode('EN')).toBe('en')
      expect(mapLanguageCode('HI')).toBe('hi')
      expect(mapLanguageCode('MR')).toBe('mr')
      expect(mapLanguageCode('BN')).toBe('bn')
      expect(mapLanguageCode('GU')).toBe('gu')
      expect(mapLanguageCode('KN')).toBe('kn')
      expect(mapLanguageCode('TA')).toBe('ta')
    })

    it('should handle lowercase input', () => {
      expect(mapLanguageCode('en')).toBe('en')
      expect(mapLanguageCode('hi')).toBe('hi')
    })

    it('should handle mixed case input', () => {
      expect(mapLanguageCode('En')).toBe('en')
      expect(mapLanguageCode('Hi')).toBe('hi')
    })

    it('should return lowercase for unknown codes', () => {
      expect(mapLanguageCode('FR')).toBe('fr')
      expect(mapLanguageCode('DE')).toBe('de')
    })

    it('should handle null/undefined', () => {
      expect(mapLanguageCode(null)).toBe('en')
      expect(mapLanguageCode(undefined)).toBe('en')
    })
  })

  describe('reverseMapLanguageCode', () => {
    it('should map API codes to UI codes', () => {
      expect(reverseMapLanguageCode('en')).toBe('EN')
      expect(reverseMapLanguageCode('hi')).toBe('HI')
      expect(reverseMapLanguageCode('mr')).toBe('MR')
      expect(reverseMapLanguageCode('bn')).toBe('BN')
      expect(reverseMapLanguageCode('gu')).toBe('GU')
      expect(reverseMapLanguageCode('kn')).toBe('KN')
      expect(reverseMapLanguageCode('ta')).toBe('TA')
    })

    it('should handle uppercase input', () => {
      expect(reverseMapLanguageCode('EN')).toBe('EN')
      expect(reverseMapLanguageCode('HI')).toBe('HI')
    })

    it('should return uppercase for unknown codes', () => {
      expect(reverseMapLanguageCode('fr')).toBe('FR')
      expect(reverseMapLanguageCode('de')).toBe('DE')
    })

    it('should handle null/undefined', () => {
      expect(reverseMapLanguageCode(null)).toBe('EN')
      expect(reverseMapLanguageCode(undefined)).toBe('EN')
    })
  })

  describe('generateCacheKey', () => {
    it('should generate correct cache key', () => {
      expect(generateCacheKey('Hello', 'en', 'hi')).toBe('Hello_en_hi')
      expect(generateCacheKey('World', 'en', 'mr')).toBe('World_en_mr')
    })

    it('should normalize text', () => {
      expect(generateCacheKey('  Hello World  ', 'en', 'hi')).toBe('Hello World_en_hi')
    })

    it('should handle empty text', () => {
      expect(generateCacheKey('', 'en', 'hi')).toBe('_en_hi')
    })

    it('should normalize language codes', () => {
      expect(generateCacheKey('Hello', 'EN', 'HI')).toBe('Hello_en_hi')
      expect(generateCacheKey('Hello', 'En', 'Hi')).toBe('Hello_en_hi')
    })

    it('should handle null/undefined languages', () => {
      expect(generateCacheKey('Hello', null, null)).toBe('Hello_en_en')
      expect(generateCacheKey('Hello', undefined, undefined)).toBe('Hello_en_en')
    })
  })

  describe('extractTexts', () => {
    it('should extract texts from array of strings', () => {
      const texts = ['Hello', 'World', 'Test']
      expect(extractTexts(texts)).toEqual(['Hello', 'World', 'Test'])
    })

    it('should extract texts from single string', () => {
      expect(extractTexts('Hello')).toEqual(['Hello'])
    })

    it('should extract texts from objects with specified keys', () => {
      const items = [
        { name: 'John', age: 30 },
        { name: 'Jane', age: 25 },
      ]
      expect(extractTexts(items, ['name'])).toEqual(['John', 'Jane'])
    })

    it('should extract multiple keys from objects', () => {
      const items = [
        { name: 'John', description: 'Developer' },
        { name: 'Jane', description: 'Designer' },
      ]
      expect(extractTexts(items, ['name', 'description'])).toEqual([
        'John',
        'Developer',
        'Jane',
        'Designer',
      ])
    })

    it('should filter out empty strings', () => {
      const texts = ['Hello', '', 'World', '   ', 'Test']
      expect(extractTexts(texts)).toEqual(['Hello', 'World', 'Test'])
    })

    it('should handle empty array', () => {
      expect(extractTexts([])).toEqual([])
    })

    it('should handle null/undefined', () => {
      expect(extractTexts(null)).toEqual([])
      expect(extractTexts(undefined)).toEqual([])
    })

    it('should ignore non-string values', () => {
      const items = [
        { name: 'John', age: 30 },
        { name: 'Jane', age: 25 },
      ]
      expect(extractTexts(items, ['name', 'age'])).toEqual(['John', 'Jane'])
    })
  })

  describe('needsTranslation', () => {
    it('should return true when languages differ', () => {
      expect(needsTranslation('Hello', 'en', 'hi')).toBe(true)
      expect(needsTranslation('World', 'en', 'mr')).toBe(true)
    })

    it('should return false when languages are the same', () => {
      expect(needsTranslation('Hello', 'en', 'en')).toBe(false)
      expect(needsTranslation('World', 'hi', 'hi')).toBe(false)
    })

    it('should handle case-insensitive comparison', () => {
      expect(needsTranslation('Hello', 'EN', 'en')).toBe(false)
      expect(needsTranslation('Hello', 'en', 'EN')).toBe(false)
      expect(needsTranslation('Hello', 'HI', 'hi')).toBe(false)
    })

    it('should return false for empty text', () => {
      expect(needsTranslation('', 'en', 'hi')).toBe(false)
      expect(needsTranslation('   ', 'en', 'hi')).toBe(false)
    })

    it('should return false for null/undefined text', () => {
      expect(needsTranslation(null, 'en', 'hi')).toBe(false)
      expect(needsTranslation(undefined, 'en', 'hi')).toBe(false)
    })

    it('should return false for non-string text', () => {
      expect(needsTranslation(123, 'en', 'hi')).toBe(false)
      expect(needsTranslation({}, 'en', 'hi')).toBe(false)
    })

    it('should default to en for null source language', () => {
      expect(needsTranslation('Hello', null, 'hi')).toBe(true)
      expect(needsTranslation('Hello', null, 'en')).toBe(false)
    })

    it('should default to en for null target language', () => {
      expect(needsTranslation('Hello', 'hi', null)).toBe(true)
      expect(needsTranslation('Hello', 'en', null)).toBe(false)
    })
  })

  describe('batchTexts', () => {
    it('should batch texts into chunks of specified size', () => {
      const texts = Array.from({ length: 10 }, (_, i) => `Text ${i}`)
      const batches = batchTexts(texts, 3)
      expect(batches).toHaveLength(4)
      expect(batches[0]).toHaveLength(3)
      expect(batches[1]).toHaveLength(3)
      expect(batches[2]).toHaveLength(3)
      expect(batches[3]).toHaveLength(1)
    })

    it('should use default batch size of 128', () => {
      const texts = Array.from({ length: 200 }, (_, i) => `Text ${i}`)
      const batches = batchTexts(texts)
      expect(batches).toHaveLength(2)
      expect(batches[0]).toHaveLength(128)
      expect(batches[1]).toHaveLength(72)
    })

    it('should handle empty array', () => {
      expect(batchTexts([])).toEqual([])
    })

    it('should handle array smaller than batch size', () => {
      const texts = ['Text 1', 'Text 2']
      const batches = batchTexts(texts, 10)
      expect(batches).toHaveLength(1)
      expect(batches[0]).toEqual(['Text 1', 'Text 2'])
    })

    it('should handle exact batch size', () => {
      const texts = Array.from({ length: 5 }, (_, i) => `Text ${i}`)
      const batches = batchTexts(texts, 5)
      expect(batches).toHaveLength(1)
      expect(batches[0]).toHaveLength(5)
    })
  })
})



