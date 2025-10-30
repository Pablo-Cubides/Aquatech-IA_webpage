// jest.d.ts
import '@testing-library/jest-dom'

// Extender los tipos de Jest con Testing Library
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R
      toHaveTextContent(text: string): R
      toHaveAttribute(attr: string, value?: string): R
    }
  }
}