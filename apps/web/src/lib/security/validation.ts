/**
 * Input validation utilities for security
 */

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

/**
 * Sanitize user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') {
    return ''
  }

  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate URL format
 */
export function validateURL(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Validate slug format (alphanumeric and hyphens only)
 */
export function validateSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  return slugRegex.test(slug)
}

/**
 * Validate ID format (prevent NoSQL injection)
 */
export function validateId(id: string): boolean {
  // Only allow alphanumeric characters, hyphens, and underscores
  const idRegex = /^[a-zA-Z0-9_-]+$/
  return idRegex.test(id) && id.length <= 100
}

/**
 * Sanitize SQL-like input (for Prisma queries)
 */
export function sanitizeSearchQuery(query: string): string {
  if (typeof query !== 'string') {
    return ''
  }

  return query
    .replace(/[%_\\]/g, '\\$&') // Escape SQL wildcards
    .replace(/['";]/g, '') // Remove quotes and semicolons
    .trim()
    .substring(0, 100) // Limit length
}

/**
 * Validate pagination parameters
 */
export function validatePagination(
  page?: string | number,
  limit?: string | number
): { page: number; limit: number } {
  const parsedPage = Math.max(1, parseInt(String(page || '1'), 10) || 1)
  const parsedLimit = Math.min(
    100,
    Math.max(1, parseInt(String(limit || '10'), 10) || 10)
  )

  return { page: parsedPage, limit: parsedLimit }
}

/**
 * Validate and sanitize object for database operations
 */
export function sanitizeObject<T extends Record<string, any>>(
  obj: T,
  allowedKeys: string[]
): Partial<T> {
  const sanitized: Partial<T> = {}

  for (const key of allowedKeys) {
    if (key in obj) {
      const value = obj[key]

      if (typeof value === 'string') {
        sanitized[key as keyof T] = sanitizeInput(value) as T[keyof T]
      } else if (typeof value === 'number' || typeof value === 'boolean') {
        sanitized[key as keyof T] = value as T[keyof T]
      } else if (Array.isArray(value)) {
        sanitized[key as keyof T] = value.map((item) =>
          typeof item === 'string' ? sanitizeInput(item) : item
        ) as T[keyof T]
      }
    }
  }

  return sanitized
}

/**
 * Rate limiting helper
 */
export function createRateLimiter(
  maxRequests: number,
  windowMs: number
): (identifier: string) => boolean {
  const requests = new Map<string, { count: number; resetTime: number }>()

  return (identifier: string): boolean => {
    const now = Date.now()
    const record = requests.get(identifier)

    if (!record || now > record.resetTime) {
      requests.set(identifier, {
        count: 1,
        resetTime: now + windowMs,
      })
      return true
    }

    if (record.count >= maxRequests) {
      return false
    }

    record.count++
    return true
  }
}

/**
 * Validate request origin
 */
export function isValidOrigin(origin: string | null): boolean {
  if (!origin) return false

  const allowedOrigins = [
    process.env.NEXT_PUBLIC_BASE_URL || 'https://aquatechia.com',
    'http://localhost:3000',
    'http://localhost:3001',
  ]

  return allowedOrigins.includes(origin)
}

/**
 * Generate CSRF token
 */
export function generateCSRFToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Validate file upload
 */
export function validateFileUpload(
  file: File,
  options: {
    maxSize?: number // in bytes
    allowedTypes?: string[]
  } = {}
): { valid: boolean; error?: string } {
  const { maxSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'image/webp'] } = options

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds ${maxSize / 1024 / 1024}MB limit`,
    }
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed`,
    }
  }

  return { valid: true }
}
