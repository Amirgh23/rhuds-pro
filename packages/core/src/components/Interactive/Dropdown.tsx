import React from 'react'
import styled, { css } from 'styled-components'

export interface DropdownItem {
  id: string
  label: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  divider?: boolean
}

export interface DropdownProps {
  trigger: React.ReactNode
  items: DropdownItem[]
  isOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
  placement?: 'bottom' | 'top'
  size?: 'sm' | 'md' | 'lg'
  soundEffect?: boolean
  testId?: string
  ariaLabel?: string
}

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`

const DropdownTrigger = styled.div`
  cursor: pointer;
`

const DropdownMenu = styled.div<{ isOpen: boolean; placement: string }>`
  position: absolute;
  ${(props) => (props.placement === 'top' ? 'bottom: 100%;' : 'top: 100%;')}
  left: 0;
  background: var(--rhuds-colors-surface);
  border: 1px solid var(--rhuds-colors-border);
  border-radius: 2px;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.2);
  min-width: 200px;
  z-index: 999;
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  visibility: ${(props) => (props.isOpen ? 'visible' : 'hidden')};
  transform: ${(props) =>
    props.isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: opacity var(--rhuds-transitions-normal),
    visibility var(--rhuds-transitions-normal),
    transform var(--rhuds-transitions-normal);
  margin-top: ${(props) => (props.placement === 'top' ? '-8px' : '8px')};
  margin-bottom: ${(props) => (props.placement === 'bottom' ? '-8px' : '0')};
`

const DropdownItemStyled = styled.button<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: var(--rhuds-spacing-md) var(--rhuds-spacing-lg);
  background: transparent;
  border: none;
  color: var(--rhuds-colors-text);
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  font-size: var(--rhuds-typography-fontSize-md);
  font-family: var(--rhuds-typography-fontFamily);
  transition: all var(--rhuds-transitions-normal);
  text-align: left;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};

  &:hover:not(:disabled) {
    background: rgba(0, 255, 0, 0.1);
    padding-left: calc(var(--rhuds-spacing-lg) + 4px);
  }

  &:focus-visible {
    outline: 2px solid var(--rhuds-colors-primary);
    outline-offset: -2px;
  }

  &:active:not(:disabled) {
    background: rgba(0, 255, 0, 0.2);
  }
`

const DropdownDivider = styled.div`
  height: 1px;
  background: var(--rhuds-colors-border);
  margin: var(--rhuds-spacing-sm) 0;
`

export const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      trigger,
      items,
      isOpen: controlledIsOpen,
      onOpenChange,
      placement = 'bottom',
      size = 'md',
      soundEffect = true,
      testId,
      ariaLabel,
    },
    ref
  ) => {
    const [internalIsOpen, setInternalIsOpen] = React.useState(false)
    const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen
    const containerRef = React.useRef<HTMLDivElement>(null)
    const menuRef = React.useRef<HTMLDivElement>(null)
    const [focusedIndex, setFocusedIndex] = React.useState(-1)

    const handleOpenChange = (newIsOpen: boolean) => {
      if (onOpenChange) {
        onOpenChange(newIsOpen)
      } else {
        setInternalIsOpen(newIsOpen)
      }
      if (newIsOpen) {
        setFocusedIndex(-1)
      }
    }

    const handleTriggerClick = () => {
      handleOpenChange(!isOpen)
    }

    const handleItemClick = (item: DropdownItem) => {
      if (!item.disabled && !item.divider) {
        item.onClick?.()
        handleOpenChange(false)
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!isOpen) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleOpenChange(true)
        }
        return
      }

      const enabledItems = items.filter((item) => !item.disabled && !item.divider)

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setFocusedIndex((prev) =>
            prev < enabledItems.length - 1 ? prev + 1 : 0
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setFocusedIndex((prev) =>
            prev > 0 ? prev - 1 : enabledItems.length - 1
          )
          break
        case 'Enter':
          e.preventDefault()
          if (focusedIndex >= 0 && focusedIndex < enabledItems.length) {
            handleItemClick(enabledItems[focusedIndex])
          }
          break
        case 'Escape':
          e.preventDefault()
          handleOpenChange(false)
          break
        default:
          break
      }
    }

    React.useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          handleOpenChange(false)
        }
      }

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [isOpen])

    return (
      <DropdownContainer
        ref={ref || containerRef}
        data-testid={testId}
        onKeyDown={handleKeyDown}
      >
        <DropdownTrigger
          onClick={handleTriggerClick}
          role="button"
          tabIndex={0}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          aria-label={ariaLabel}
        >
          {trigger}
        </DropdownTrigger>
        <DropdownMenu
          ref={menuRef}
          isOpen={isOpen}
          placement={placement}
          role="menu"
          data-testid={testId ? `${testId}-menu` : undefined}
        >
          {items.map((item, index) => {
            if (item.divider) {
              return <DropdownDivider key={item.id} />
            }

            const enabledItems = items.filter(
              (i) => !i.disabled && !i.divider
            )
            const enabledIndex = enabledItems.findIndex((i) => i.id === item.id)
            const isFocused = focusedIndex === enabledIndex

            return (
              <DropdownItemStyled
                key={item.id}
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
                role="menuitem"
                tabIndex={isFocused ? 0 : -1}
                autoFocus={isFocused}
                data-testid={testId ? `${testId}-item-${item.id}` : undefined}
              >
                {item.label}
              </DropdownItemStyled>
            )
          })}
        </DropdownMenu>
      </DropdownContainer>
    )
  }
)

Dropdown.displayName = 'Dropdown'
