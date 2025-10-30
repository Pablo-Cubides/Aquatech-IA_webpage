import { describe, it, expect } from 'vitest'
import { filterItems, sortItems, type FiltersState } from '@/lib/filters-env'
import type { Resource } from '@/lib/types-env'

describe('filterItems', () => {
  const mockResources: Resource[] = [
    {
      id: '1',
      slug: 'curso-ia-basico',
      type: 'course',
      title: 'Curso de IA Básico',
      description: 'Aprende los fundamentos de inteligencia artificial',
      language: 'es',
      region: 'LatAm',
      topics: ['ia', 'machine-learning'],
      level: 'intro',
      format: 'video',
      platform: 'Udemy',
      affiliate_url: 'https://example.com/1',
      price: 49.99,
      currency: 'USD',
      rating_value: 4.5,
      rating_count: 1200,
      images: [{ src: '/test.jpg', alt: 'test' }],
    },
    {
      id: '2',
      slug: 'libro-ia-avanzado',
      type: 'ebook',
      title: 'Machine Learning Avanzado',
      description: 'Técnicas avanzadas de ML con Python',
      language: 'en',
      topics: ['ia', 'python', 'deep-learning'],
      level: 'avanzado',
      platform: 'Amazon',
      affiliate_url: 'https://example.com/2',
      price: 89.99,
      rating_value: 4.8,
      rating_count: 450,
      images: [{ src: '/test2.jpg', alt: 'test2' }],
    },
    {
      id: '3',
      slug: 'software-analisis',
      type: 'software',
      title: 'Analytics Pro',
      description: 'Software de análisis de datos',
      language: 'es',
      region: 'Global',
      topics: ['data', 'analytics'],
      platform: 'SaaS Platform',
      affiliate_url: 'https://example.com/3',
      price: 299,
      rating_value: 4.2,
      rating_count: 89,
      images: [{ src: '/test3.jpg', alt: 'test3' }],
    },
    {
      id: '4',
      slug: 'curso-gratis',
      type: 'course',
      title: 'Curso Gratuito de Python',
      description: 'Introducción a Python',
      language: 'es',
      topics: ['python', 'programacion'],
      level: 'intro',
      format: 'video',
      platform: 'Coursera',
      affiliate_url: 'https://example.com/4',
      price: 0,
      rating_value: 4.6,
      rating_count: 3400,
      images: [{ src: '/test4.jpg', alt: 'test4' }],
    },
  ]

  const defaultFilters: FiltersState = {
    q: '',
    type: 'all',
    topics: [],
    level: [],
    format: [],
    language: [],
    region: [],
    platform: [],
    price: 'all',
    sortBy: 'relevance',
  }

  describe('Type filtering', () => {
    it('should return all items when type is "all"', () => {
      const result = filterItems(mockResources, defaultFilters)
      expect(result).toHaveLength(4)
    })

    it('should filter by course type', () => {
      const result = filterItems(mockResources, { ...defaultFilters, type: 'course' })
      expect(result).toHaveLength(2)
      expect(result.every((r) => r.type === 'course')).toBe(true)
    })

    it('should filter by ebook type', () => {
      const result = filterItems(mockResources, { ...defaultFilters, type: 'ebook' })
      expect(result).toHaveLength(1)
      expect(result[0].type).toBe('ebook')
    })

    it('should filter by software type', () => {
      const result = filterItems(mockResources, { ...defaultFilters, type: 'software' })
      expect(result).toHaveLength(1)
      expect(result[0].type).toBe('software')
    })
  })

  describe('Search query filtering', () => {
    it('should find items by title', () => {
      const result = filterItems(mockResources, { ...defaultFilters, q: 'IA Básico' })
      expect(result).toHaveLength(1)
      expect(result[0].title).toContain('IA Básico')
    })

    it('should be case insensitive', () => {
      const result = filterItems(mockResources, { ...defaultFilters, q: 'machine learning' })
      expect(result.length).toBeGreaterThan(0)
    })

    it('should search in description', () => {
      const result = filterItems(mockResources, { ...defaultFilters, q: 'Python' })
      expect(result.length).toBeGreaterThan(0)
    })

    it('should search in platform', () => {
      const result = filterItems(mockResources, { ...defaultFilters, q: 'Udemy' })
      expect(result).toHaveLength(1)
    })

    it('should search in topics', () => {
      const result = filterItems(mockResources, { ...defaultFilters, q: 'machine-learning' })
      expect(result.length).toBeGreaterThan(0)
    })

    it('should return empty array when no match', () => {
      const result = filterItems(mockResources, { ...defaultFilters, q: 'nonexistent' })
      expect(result).toHaveLength(0)
    })
  })

  describe('Topics filtering', () => {
    it('should filter by single topic', () => {
      const result = filterItems(mockResources, { ...defaultFilters, topics: ['ia'] })
      expect(result).toHaveLength(2)
      expect(result.every((r) => r.topics.includes('ia'))).toBe(true)
    })

    it('should filter by multiple topics (OR logic)', () => {
      const result = filterItems(mockResources, {
        ...defaultFilters,
        topics: ['python', 'data'],
      })
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('Level filtering', () => {
    it('should filter courses by intro level', () => {
      const result = filterItems(mockResources, { ...defaultFilters, level: ['intro'] })
      expect(result.every((r) => r.level === 'intro' || r.type !== 'course')).toBe(true)
    })

    it('should filter by advanced level', () => {
      const result = filterItems(mockResources, { ...defaultFilters, level: ['avanzado'] })
      const advancedItems = result.filter((r) => r.type === 'course' || r.type === 'certification')
      expect(advancedItems.every((r) => r.level === 'avanzado')).toBe(true)
    })

    it('should not apply level filter to non-course items', () => {
      const result = filterItems(mockResources, {
        ...defaultFilters,
        type: 'software',
        level: ['intro'],
      })
      expect(result).toHaveLength(1)
    })
  })

  describe('Language filtering', () => {
    it('should filter by Spanish', () => {
      const result = filterItems(mockResources, { ...defaultFilters, language: ['es'] })
      expect(result.every((r) => r.language === 'es')).toBe(true)
    })

    it('should filter by English', () => {
      const result = filterItems(mockResources, { ...defaultFilters, language: ['en'] })
      expect(result.every((r) => r.language === 'en')).toBe(true)
    })

    it('should allow multiple languages', () => {
      const result = filterItems(mockResources, { ...defaultFilters, language: ['es', 'en'] })
      expect(result).toHaveLength(4)
    })
  })

  describe('Region filtering', () => {
    it('should filter by LatAm region', () => {
      const result = filterItems(mockResources, { ...defaultFilters, region: ['LatAm'] })
      expect(result.every((r) => !r.region || r.region === 'LatAm')).toBe(true)
    })

    it('should filter by Global region', () => {
      const result = filterItems(mockResources, { ...defaultFilters, region: ['Global'] })
      expect(result.some((r) => r.region === 'Global')).toBe(true)
    })
  })

  describe('Platform filtering', () => {
    it('should filter by platform', () => {
      const result = filterItems(mockResources, { ...defaultFilters, platform: ['Udemy'] })
      expect(result).toHaveLength(1)
      expect(result[0].platform).toBe('Udemy')
    })

    it('should allow multiple platforms', () => {
      const result = filterItems(mockResources, {
        ...defaultFilters,
        platform: ['Udemy', 'Amazon'],
      })
      expect(result).toHaveLength(2)
    })
  })

  describe('Price filtering', () => {
    it('should filter free items', () => {
      const result = filterItems(mockResources, { ...defaultFilters, price: 'free' })
      expect(result.every((r) => r.price === 0)).toBe(true)
    })

    it('should filter items under $25', () => {
      const result = filterItems(mockResources, { ...defaultFilters, price: '<25' })
      expect(result.every((r) => r.price && r.price > 0 && r.price < 25)).toBe(true)
    })

    it('should filter items $25-$100', () => {
      const result = filterItems(mockResources, { ...defaultFilters, price: '25-100' })
      expect(result.every((r) => r.price && r.price >= 25 && r.price <= 100)).toBe(true)
    })

    it('should filter items $100-$300', () => {
      const result = filterItems(mockResources, { ...defaultFilters, price: '100-300' })
      expect(result.every((r) => r.price && r.price > 100 && r.price <= 300)).toBe(true)
    })

    it('should filter items over $300', () => {
      const result = filterItems(mockResources, { ...defaultFilters, price: '300+' })
      expect(result.every((r) => r.price && r.price > 300)).toBe(true)
    })
  })

  describe('Combined filters', () => {
    it('should apply multiple filters correctly', () => {
      const result = filterItems(mockResources, {
        ...defaultFilters,
        type: 'course',
        language: ['es'],
        level: ['intro'],
      })
      expect(result.every((r) => r.type === 'course' && r.language === 'es' && r.level === 'intro')).toBe(true)
    })

    it('should handle search with filters', () => {
      const result = filterItems(mockResources, {
        ...defaultFilters,
        q: 'ia',
        type: 'course',
        language: ['es'],
      })
      expect(result.length).toBeGreaterThan(0)
      expect(result.every((r) => r.type === 'course' && r.language === 'es')).toBe(true)
    })

    it('should return empty when no items match all filters', () => {
      const result = filterItems(mockResources, {
        ...defaultFilters,
        type: 'course',
        language: ['en'],
        platform: ['Udemy'],
      })
      expect(result).toHaveLength(0)
    })
  })
})

describe('sortItems', () => {
  const mockResources: Resource[] = [
    {
      id: '1',
      slug: 'item-1',
      type: 'course',
      title: 'Item 1',
      description: 'Test',
      language: 'es',
      topics: [],
      platform: 'Test',
      affiliate_url: 'https://test.com',
      price: 50,
      rating_value: 4.5,
      rating_count: 100,
      published_at: '2024-01-01',
      images: [{ src: '/test.jpg', alt: 'test' }],
    },
    {
      id: '2',
      slug: 'item-2',
      type: 'course',
      title: 'Item 2',
      description: 'Test',
      language: 'es',
      topics: [],
      platform: 'Test',
      affiliate_url: 'https://test.com',
      price: 100,
      rating_value: 4.8,
      rating_count: 500,
      published_at: '2024-06-01',
      images: [{ src: '/test.jpg', alt: 'test' }],
    },
    {
      id: '3',
      slug: 'item-3',
      type: 'course',
      title: 'Item 3',
      description: 'Test',
      language: 'es',
      topics: [],
      platform: 'Test',
      affiliate_url: 'https://test.com',
      price: 25,
      rating_value: 4.2,
      rating_count: 50,
      last_verified_at: '2024-12-01',
      images: [{ src: '/test.jpg', alt: 'test' }],
    },
  ]

  it('should sort by rating (highest first)', () => {
    const result = sortItems(mockResources, 'rating')
    expect(result[0].rating_value).toBe(4.8)
    expect(result[1].rating_value).toBe(4.5)
    expect(result[2].rating_value).toBe(4.2)
  })

  it('should sort by newest', () => {
    const result = sortItems(mockResources, 'newest')
    expect(result[0].id).toBe('3') // last_verified_at más reciente
    expect(result[1].id).toBe('2') // published_at más reciente
    expect(result[2].id).toBe('1')
  })

  it('should sort by bestsellers (rating count)', () => {
    const result = sortItems(mockResources, 'bestsellers')
    expect(result[0].rating_count).toBe(500)
    expect(result[1].rating_count).toBe(100)
    expect(result[2].rating_count).toBe(50)
  })

  it('should sort by price ascending', () => {
    const result = sortItems(mockResources, 'price_asc')
    expect(result[0].price).toBe(25)
    expect(result[1].price).toBe(50)
    expect(result[2].price).toBe(100)
  })

  it('should sort by price descending', () => {
    const result = sortItems(mockResources, 'price_desc')
    expect(result[0].price).toBe(100)
    expect(result[1].price).toBe(50)
    expect(result[2].price).toBe(25)
  })

  it('should sort by relevance (default)', () => {
    const result = sortItems(mockResources, 'relevance')
    // Por defecto ordena por rating, luego por frescura
    expect(result[0].rating_value).toBe(4.8)
  })

  it('should handle missing prices in price sorting', () => {
    const withoutPrice: Resource[] = [
      { ...mockResources[0], price: undefined },
      mockResources[1],
    ]
    const result = sortItems(withoutPrice, 'price_asc')
    expect(result[0].id).toBe('2') // El que tiene precio va primero
  })

  it('should not mutate original array', () => {
    const original = [...mockResources]
    sortItems(mockResources, 'rating')
    expect(mockResources).toEqual(original)
  })
})
