import { describe, it, expect } from 'vitest'
import {
  sanitizeInput,
  validateEmail,
  validateURL,
  validateSlug,
  validateId,
  sanitizeSearchQuery,
  validatePagination,
  sanitizeObject,
  validateFileUpload,
} from '@/lib/security/validation'

describe('Security Validation', () => {
  describe('sanitizeInput', () => {
    it('should remove HTML tags', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe(
        'scriptalert("xss")/script'
      )
      expect(sanitizeInput('<div>Test</div>')).toBe('divTest/div')
    })

    it('should remove javascript: protocol', () => {
      expect(sanitizeInput('javascript:alert(1)')).toBe('alert(1)')
      expect(sanitizeInput('JAVASCRIPT:alert(1)')).toBe('alert(1)')
    })

    it('should remove event handlers', () => {
      expect(sanitizeInput('onclick=alert(1)')).toBe('alert(1)')
      expect(sanitizeInput('onload=hack()')).toBe('hack()')
      expect(sanitizeInput('ONCLICK=alert(1)')).toBe('alert(1)')
    })

    it('should trim whitespace', () => {
      expect(sanitizeInput('  test  ')).toBe('test')
      expect(sanitizeInput('\n\ttest\t\n')).toBe('test')
    })

    it('should handle empty strings', () => {
      expect(sanitizeInput('')).toBe('')
    })

    it('should handle non-string inputs', () => {
      expect(sanitizeInput(123 as any)).toBe('')
      expect(sanitizeInput(null as any)).toBe('')
      expect(sanitizeInput(undefined as any)).toBe('')
    })

    it('should preserve safe content', () => {
      expect(sanitizeInput('Hello World')).toBe('Hello World')
      expect(sanitizeInput('test@example.com')).toBe('test@example.com')
    })
  })

  describe('validateEmail', () => {
    it('should validate correct emails', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user+tag@domain.co.uk')).toBe(true)
      expect(validateEmail('name.surname@company.com')).toBe(true)
    })

    it('should reject invalid emails', () => {
      expect(validateEmail('invalid')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
      expect(validateEmail('@example.com')).toBe(false)
      expect(validateEmail('test @example.com')).toBe(false)
      expect(validateEmail('')).toBe(false)
    })
  })

  describe('validateURL', () => {
    it('should validate correct URLs', () => {
      expect(validateURL('https://example.com')).toBe(true)
      expect(validateURL('http://test.co')).toBe(true)
      expect(validateURL('https://example.com/path?query=1')).toBe(true)
    })

    it('should reject invalid URLs', () => {
      expect(validateURL('not-a-url')).toBe(false)
      expect(validateURL('ftp://example.com')).toBe(false)
      expect(validateURL('javascript:alert(1)')).toBe(false)
      expect(validateURL('')).toBe(false)
    })
  })

  describe('validateSlug', () => {
    it('should validate correct slugs', () => {
      expect(validateSlug('test-slug')).toBe(true)
      expect(validateSlug('my-article-123')).toBe(true)
      expect(validateSlug('simple')).toBe(true)
    })

    it('should reject invalid slugs', () => {
      expect(validateSlug('Test-Slug')).toBe(false) // uppercase
      expect(validateSlug('test_slug')).toBe(false) // underscore
      expect(validateSlug('test slug')).toBe(false) // space
      expect(validateSlug('test--slug')).toBe(false) // double hyphen
      expect(validateSlug('-test')).toBe(false) // starts with hyphen
      expect(validateSlug('test-')).toBe(false) // ends with hyphen
      expect(validateSlug('')).toBe(false)
    })
  })

  describe('validateId', () => {
    it('should validate correct IDs', () => {
      expect(validateId('abc123')).toBe(true)
      expect(validateId('user_123')).toBe(true)
      expect(validateId('test-id-456')).toBe(true)
    })

    it('should reject invalid IDs', () => {
      expect(validateId('test id')).toBe(false) // space
      expect(validateId('test@id')).toBe(false) // special char
      expect(validateId('test;id')).toBe(false) // semicolon
      expect(validateId('')).toBe(false)
    })

    it('should reject IDs longer than 100 characters', () => {
      const longId = 'a'.repeat(101)
      expect(validateId(longId)).toBe(false)
      expect(validateId('a'.repeat(100))).toBe(true)
    })
  })

  describe('sanitizeSearchQuery', () => {
    it('should escape SQL wildcards', () => {
      expect(sanitizeSearchQuery('test%')).toBe('test\\%')
      expect(sanitizeSearchQuery('test_')).toBe('test\\_')
      expect(sanitizeSearchQuery('test\\')).toBe('test\\\\')
    })

    it('should remove quotes and semicolons', () => {
      expect(sanitizeSearchQuery("test'query")).toBe('testquery')
      expect(sanitizeSearchQuery('test"query')).toBe('testquery')
      expect(sanitizeSearchQuery('test;query')).toBe('testquery')
    })

    it('should trim and limit length', () => {
      expect(sanitizeSearchQuery('  test  ')).toBe('test')
      const longQuery = 'a'.repeat(150)
      expect(sanitizeSearchQuery(longQuery)).toHaveLength(100)
    })

    it('should handle non-string inputs', () => {
      expect(sanitizeSearchQuery(123 as any)).toBe('')
    })
  })

  describe('validatePagination', () => {
    it('should return valid pagination values', () => {
      expect(validatePagination('1', '10')).toEqual({ page: 1, limit: 10 })
      expect(validatePagination(2, 20)).toEqual({ page: 2, limit: 20 })
    })

    it('should default to page 1 and limit 10', () => {
      expect(validatePagination()).toEqual({ page: 1, limit: 10 })
      expect(validatePagination(undefined, undefined)).toEqual({
        page: 1,
        limit: 10,
      })
    })

    it('should enforce minimum page of 1', () => {
      expect(validatePagination('0', '10')).toEqual({ page: 1, limit: 10 })
      expect(validatePagination('-5', '10')).toEqual({ page: 1, limit: 10 })
    })

    it('should enforce maximum limit of 100', () => {
      expect(validatePagination('1', '150')).toEqual({ page: 1, limit: 100 })
      expect(validatePagination('1', '1000')).toEqual({ page: 1, limit: 100 })
    })

    it('should handle invalid inputs', () => {
      expect(validatePagination('invalid', 'also-invalid')).toEqual({
        page: 1,
        limit: 10,
      })
    })
  })

  describe('sanitizeObject', () => {
    it('should only include allowed keys', () => {
      const input = { name: 'Test', email: 'test@example.com', hack: 'value' }
      const result = sanitizeObject(input, ['name', 'email'])

      expect(result).toEqual({ name: 'Test', email: 'test@example.com' })
      expect(result.hack).toBeUndefined()
    })

    it('should sanitize string values', () => {
      const input = { name: '<script>alert(1)</script>' }
      const result = sanitizeObject(input, ['name'])

      expect(result.name).toBe('scriptalert(1)/script')
    })

    it('should preserve numbers and booleans', () => {
      const input = { age: 25, active: true }
      const result = sanitizeObject(input, ['age', 'active'])

      expect(result).toEqual({ age: 25, active: true })
    })

    it('should sanitize arrays of strings', () => {
      const input = { tags: ['<tag1>', 'tag2'] }
      const result = sanitizeObject(input, ['tags'])

      expect(result.tags).toEqual(['tag1', 'tag2'])
    })
  })

  describe('validateFileUpload', () => {
    it('should validate correct file uploads', () => {
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
      const result = validateFileUpload(file)

      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should reject files exceeding size limit', () => {
      const largeContent = new Array(6 * 1024 * 1024).fill('a').join('') // 6MB
      const file = new File([largeContent], 'large.jpg', {
        type: 'image/jpeg',
      })
      const result = validateFileUpload(file)

      expect(result.valid).toBe(false)
      expect(result.error).toContain('size exceeds')
    })

    it('should reject disallowed file types', () => {
      const file = new File(['content'], 'test.pdf', {
        type: 'application/pdf',
      })
      const result = validateFileUpload(file)

      expect(result.valid).toBe(false)
      expect(result.error).toContain('not allowed')
    })

    it('should accept custom configuration', () => {
      const file = new File(['content'], 'test.pdf', {
        type: 'application/pdf',
      })
      const result = validateFileUpload(file, {
        maxSize: 10 * 1024 * 1024,
        allowedTypes: ['application/pdf'],
      })

      expect(result.valid).toBe(true)
    })
  })
})
