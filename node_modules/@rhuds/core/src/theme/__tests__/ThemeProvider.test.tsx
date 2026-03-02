import React from 'react'
import { render, screen } from '@testing-library/react'
import { ThemeProvider, useTheme, darkMode, lightMode } from '../index'

const TestComponent: React.FC = () => {
  const { currentMode, setTheme } = useTheme()
  return (
    <div>
      <div data-testid="current-theme">{currentMode.name}</div>
      <button onClick={() => setTheme('light')}>Switch to Light</button>
    </div>
  )
}

describe('ThemeProvider', () => {
  it('should provide theme context', () => {
    render(
      <ThemeProvider defaultTheme="dark">
        <TestComponent />
      </ThemeProvider>
    )

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark')
  })

  it('should switch themes', () => {
    const { rerender } = render(
      <ThemeProvider defaultTheme="dark">
        <TestComponent />
      </ThemeProvider>
    )

    const button = screen.getByRole('button', { name: /Switch to Light/i })
    button.click()

    rerender(
      <ThemeProvider defaultTheme="dark">
        <TestComponent />
      </ThemeProvider>
    )
  })

  it('should throw error when useTheme is used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation()

    expect(() => {
      render(<TestComponent />)
    }).toThrow('useTheme must be used within <ThemeProvider>')

    consoleError.mockRestore()
  })

  it('should inject CSS variables', () => {
    render(
      <ThemeProvider defaultTheme="dark">
        <div>Test</div>
      </ThemeProvider>
    )

    const root = document.documentElement
    expect(root.style.getPropertyValue('--rhuds-colors-primary')).toBe(darkMode.tokens.colors.primary)
  })

  it('should persist theme to localStorage', () => {
    const { rerender } = render(
      <ThemeProvider defaultTheme="dark">
        <TestComponent />
      </ThemeProvider>
    )

    const button = screen.getByRole('button', { name: /Switch to Light/i })
    button.click()

    expect(localStorage.getItem('rhuds-theme')).toBe('light')
  })
})
