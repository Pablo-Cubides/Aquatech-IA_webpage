import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import RatingStars from '@/components/recomendaciones/RatingStars'

describe('RatingStars', () => {
  describe('Rendering', () => {
    it('should render 5 star elements', () => {
      const { container } = render(<RatingStars value={5} />)

      const stars = container.querySelectorAll('span[aria-hidden]')
      expect(stars).toHaveLength(5)
    })

    it('should have accessible label', () => {
      render(<RatingStars value={4.5} />)

      expect(screen.getByLabelText('Calificación 4.5 de 5')).toBeInTheDocument()
    })
  })

  describe('Rating display', () => {
    it('should show 5 filled stars for value 5', () => {
      const { container } = render(<RatingStars value={5} />)

      const filledStars = Array.from(container.querySelectorAll('span')).filter(
        (span) => span.textContent === '★'
      )
      const emptyStars = Array.from(container.querySelectorAll('span')).filter(
        (span) => span.textContent === '☆'
      )

      expect(filledStars).toHaveLength(5)
      expect(emptyStars).toHaveLength(0)
    })

    it('should show 4 filled stars for value 4', () => {
      const { container } = render(<RatingStars value={4} />)

      const filledStars = Array.from(container.querySelectorAll('span')).filter(
        (span) => span.textContent === '★'
      )
      const emptyStars = Array.from(container.querySelectorAll('span')).filter(
        (span) => span.textContent === '☆'
      )

      expect(filledStars).toHaveLength(4)
      expect(emptyStars).toHaveLength(1)
    })

    it('should show 3 filled stars for value 3', () => {
      const { container } = render(<RatingStars value={3} />)

      const filledStars = Array.from(container.querySelectorAll('span')).filter(
        (span) => span.textContent === '★'
      )

      expect(filledStars).toHaveLength(3)
    })

    it('should show no filled stars for value 0', () => {
      const { container } = render(<RatingStars value={0} />)

      const emptyStars = Array.from(container.querySelectorAll('span')).filter(
        (span) => span.textContent === '☆'
      )

      expect(emptyStars).toHaveLength(5)
    })
  })

  describe('Rounding behavior', () => {
    it('should round 4.7 to 4.5', () => {
      const { container } = render(<RatingStars value={4.7} />)

      expect(screen.getByLabelText('Calificación 4.5 de 5')).toBeInTheDocument()
    })

    it('should round 4.3 to 4.5', () => {
      const { container } = render(<RatingStars value={4.3} />)

      expect(screen.getByLabelText('Calificación 4.5 de 5')).toBeInTheDocument()
    })

    it('should round 4.6 to 4.5', () => {
      const { container } = render(<RatingStars value={4.6} />)

      expect(screen.getByLabelText('Calificación 4.5 de 5')).toBeInTheDocument()
    })

    it('should round 3.8 to 4', () => {
      const { container } = render(<RatingStars value={3.8} />)

      expect(screen.getByLabelText('Calificación 4 de 5')).toBeInTheDocument()
    })

    it('should round 3.2 to 3', () => {
      const { container } = render(<RatingStars value={3.2} />)

      expect(screen.getByLabelText('Calificación 3 de 5')).toBeInTheDocument()
    })

    it('should round to nearest 0.5 increment', () => {
      const testCases = [
        { input: 1.2, expected: 1 },
        { input: 1.3, expected: 1.5 },
        { input: 1.7, expected: 1.5 },
        { input: 1.8, expected: 2 },
        { input: 2.2, expected: 2 },
        { input: 2.3, expected: 2.5 },
      ]

      testCases.forEach(({ input, expected }) => {
        const { rerender, getByLabelText } = render(
          <RatingStars value={input} />
        )
        expect(
          getByLabelText(`Calificación ${expected} de 5`)
        ).toBeInTheDocument()
        rerender(<div />)
      })
    })
  })

  describe('Edge cases', () => {
    it('should handle undefined value (default to 5)', () => {
      render(<RatingStars />)

      expect(screen.getByLabelText('Calificación 5 de 5')).toBeInTheDocument()
    })

    it('should handle value greater than 5', () => {
      const { container } = render(<RatingStars value={6.5} />)

      const filledStars = Array.from(container.querySelectorAll('span')).filter(
        (span) => span.textContent === '★'
      )

      // Should show 5 filled stars (maximum)
      expect(filledStars).toHaveLength(5)
    })

    it('should handle negative value', () => {
      const { container } = render(<RatingStars value={-1} />)

      const emptyStars = Array.from(container.querySelectorAll('span')).filter(
        (span) => span.textContent === '☆'
      )

      // Should show 0 filled stars
      expect(emptyStars).toHaveLength(5)
    })

    it('should handle NaN value', () => {
      const { container } = render(<RatingStars value={NaN} />)

      const emptyStars = Array.from(container.querySelectorAll('span')).filter(
        (span) => span.textContent === '☆'
      )

      expect(emptyStars).toHaveLength(5)
    })

    it('should handle decimal values close to integer', () => {
      render(<RatingStars value={3.999} />)

      expect(screen.getByLabelText('Calificación 4 de 5')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have aria-hidden on star icons', () => {
      const { container } = render(<RatingStars value={4} />)

      const stars = container.querySelectorAll('span[aria-hidden]')
      stars.forEach((star) => {
        expect(star).toHaveAttribute('aria-hidden')
      })
    })

    it('should have descriptive aria-label', () => {
      render(<RatingStars value={3.5} />)

      const element = screen.getByLabelText('Calificación 3.5 de 5')
      expect(element).toBeInTheDocument()
    })

    it('should format aria-label correctly for integer values', () => {
      render(<RatingStars value={4} />)

      expect(screen.getByLabelText('Calificación 4 de 5')).toBeInTheDocument()
    })

    it('should format aria-label correctly for decimal values', () => {
      render(<RatingStars value={4.5} />)

      expect(screen.getByLabelText('Calificación 4.5 de 5')).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('should have flex layout classes', () => {
      const { container } = render(<RatingStars value={5} />)

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('flex')
      expect(wrapper).toHaveClass('items-center')
      expect(wrapper).toHaveClass('gap-0.5')
    })
  })
})
