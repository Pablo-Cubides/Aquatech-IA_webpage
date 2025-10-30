/**
 * Extensión de tipos para Jest DOM
 * Este archivo asegura que TypeScript reconozca los matchers de @testing-library/jest-dom
 */

import '@testing-library/jest-dom'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R
      toHaveTextContent(text: string | RegExp): R
      toHaveAttribute(attr: string, value?: string): R
      toHaveClass(...classNames: string[]): R
      toHaveStyle(css: string | Record<string, any>): R
      toBeVisible(): R
      toBeDisabled(): R
      toBeEnabled(): R
      toBeEmpty(): R
      toBeEmptyDOMElement(): R
      toBeInvalid(): R
      toBeRequired(): R
      toBeValid(): R
      toContainElement(element: HTMLElement | null): R
      toContainHTML(html: string): R
      toHaveAccessibleDescription(description?: string | RegExp): R
      toHaveAccessibleName(name?: string | RegExp): R
      toHaveDescription(description?: string | RegExp): R
      toHaveFocus(): R
      toHaveFormValues(values: Record<string, any>): R
      toHaveValue(value?: string | string[] | number | null): R
      toHaveDisplayValue(value: string | RegExp | Array<string | RegExp>): R
      toBeChecked(): R
      toBePartiallyChecked(): R
      toHaveErrorMessage(message?: string | RegExp): R
    }
  }
}

