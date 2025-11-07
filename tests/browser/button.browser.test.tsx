/**
 * Browser mode test example for React components
 *
 * Requires:
 * - pnpm add -D @vitest/browser-playwright playwright vitest-browser-react
 *
 * Run with: pnpm test:browser
 */

import { render } from 'vitest-browser-react'
import { page } from 'vitest/browser'
import { expect, test, describe } from 'vitest'
import { Button } from '@/components/ui/button'

describe('Button Component (Browser Mode)', () => {
  test('should render button with text', async () => {
    render(<Button>Click me</Button>)

    const button = page.getByRole('button', { name: 'Click me' })
    await expect.element(button).toBeInTheDocument()
    await expect.element(button).toHaveTextContent('Click me')
  })

  test('should handle click events', async () => {
    let clicked = false
    const handleClick = () => { clicked = true }

    render(<Button onClick={handleClick}>Click me</Button>)
    const button = page.getByRole('button', { name: 'Click me' })

    await button.click()
    expect(clicked).toBe(true)
  })

  test('should render with different variants', async () => {
    render(<Button variant="destructive">Delete</Button>)
    const button = page.getByRole('button', { name: 'Delete' })

    await expect.element(button).toBeInTheDocument()
    await expect.element(button).toHaveTextContent('Delete')
  })
})
