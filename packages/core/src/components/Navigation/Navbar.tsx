import React from 'react'
import styled, { css } from 'styled-components'

export interface NavbarItem {
  id: string
  label: React.ReactNode
  href?: string
  onClick?: () => void
  active?: boolean
}

export interface NavbarProps {
  logo?: React.ReactNode
  items: NavbarItem[]
  onItemClick?: (itemId: string) => void
  mobileMenuOpen?: boolean
  onMobileMenuToggle?: () => void
  testId?: string
  ariaLabel?: string
}

const NavbarContainer = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--rhuds-spacing-md) var(--rhuds-spacing-lg);
  background: var(--rhuds-colors-surface);
  border-bottom: 1px solid var(--rhuds-colors-border);
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.1);
  gap: var(--rhuds-spacing-lg);

  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--rhuds-spacing-md);
  flex-shrink: 0;
`

const NavbarMenu = styled.div<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: var(--rhuds-spacing-lg);
  flex: 1;

  @media (max-width: 768px) {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    gap: 0;
    background: var(--rhuds-colors-surface);
    border-bottom: 1px solid var(--rhuds-colors-border);
    max-height: ${(props) => (props.isOpen ? '500px' : '0')};
    overflow: hidden;
    transition: max-height var(--rhuds-transitions-normal);
  }
`

const NavbarItem = styled.a<{ active?: boolean }>`
  display: flex;
  align-items: center;
  padding: var(--rhuds-spacing-md) var(--rhuds-spacing-lg);
  color: ${(props) =>
    props.active ? 'var(--rhuds-colors-primary)' : 'var(--rhuds-colors-text)'};
  text-decoration: none;
  cursor: pointer;
  font-size: var(--rhuds-typography-fontSize-md);
  font-family: var(--rhuds-typography-fontFamily);
  transition: all var(--rhuds-transitions-normal);
  border-bottom: 2px solid transparent;
  position: relative;

  &:hover {
    color: var(--rhuds-colors-primary);
    background: rgba(0, 255, 0, 0.05);
  }

  ${(props) =>
    props.active &&
    css`
      border-bottom-color: var(--rhuds-colors-primary);
      box-shadow: 0 0 10px rgba(0, 255, 0, 0.2);
    `}

  &:focus-visible {
    outline: 2px solid var(--rhuds-colors-primary);
    outline-offset: 2px;
  }

  @media (max-width: 768px) {
    width: 100%;
    border-bottom: 1px solid var(--rhuds-colors-border);
    border-right: 3px solid transparent;

    ${(props) =>
      props.active &&
      css`
        border-right-color: var(--rhuds-colors-primary);
        border-bottom-color: var(--rhuds-colors-border);
      `}
  }
`

const MobileMenuButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  color: var(--rhuds-colors-text);
  cursor: pointer;
  font-size: 24px;
  padding: var(--rhuds-spacing-md);
  transition: all var(--rhuds-transitions-normal);

  &:hover {
    color: var(--rhuds-colors-primary);
  }

  &:focus-visible {
    outline: 2px solid var(--rhuds-colors-primary);
    outline-offset: 2px;
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

export const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  (
    {
      logo,
      items,
      onItemClick,
      mobileMenuOpen: controlledMobileMenuOpen,
      onMobileMenuToggle,
      testId,
      ariaLabel,
    },
    ref
  ) => {
    const [internalMobileMenuOpen, setInternalMobileMenuOpen] =
      React.useState(false)
    const mobileMenuOpen =
      controlledMobileMenuOpen !== undefined
        ? controlledMobileMenuOpen
        : internalMobileMenuOpen

    const handleMobileMenuToggle = () => {
      if (onMobileMenuToggle) {
        onMobileMenuToggle()
      } else {
        setInternalMobileMenuOpen(!mobileMenuOpen)
      }
    }

    const handleItemClick = (itemId: string, item: NavbarItem) => {
      onItemClick?.(itemId)
      if (!item.href) {
        item.onClick?.()
      }
      // Close mobile menu after clicking
      if (internalMobileMenuOpen) {
        setInternalMobileMenuOpen(false)
      }
    }

    return (
      <NavbarContainer
        ref={ref}
        data-testid={testId}
        aria-label={ariaLabel || 'Main navigation'}
      >
        {logo && <LogoContainer>{logo}</LogoContainer>}
        <NavbarMenu isOpen={mobileMenuOpen} role="menubar">
          {items.map((item) => (
            <NavbarItem
              key={item.id}
              href={item.href || '#'}
              active={item.active}
              onClick={(e) => {
                if (!item.href) {
                  e.preventDefault()
                }
                handleItemClick(item.id, item)
              }}
              role="menuitem"
              data-testid={testId ? `${testId}-item-${item.id}` : undefined}
            >
              {item.label}
            </NavbarItem>
          ))}
        </NavbarMenu>
        <MobileMenuButton
          onClick={handleMobileMenuToggle}
          aria-label="Toggle mobile menu"
          aria-expanded={mobileMenuOpen}
          data-testid={testId ? `${testId}-mobile-toggle` : undefined}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </MobileMenuButton>
      </NavbarContainer>
    )
  }
)

Navbar.displayName = 'Navbar'
