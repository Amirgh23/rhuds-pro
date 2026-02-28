import React from 'react'
import styled, { css } from 'styled-components'

export interface TabItem {
  id: string
  label: React.ReactNode
  content: React.ReactNode
  disabled?: boolean
}

export interface TabsProps {
  items: TabItem[]
  activeTabId?: string
  onTabChange?: (tabId: string) => void
  variant?: 'line' | 'card'
  size?: 'sm' | 'md' | 'lg'
  testId?: string
  ariaLabel?: string
}

const TabsContainer = styled.div`
  width: 100%;
`

const TabsList = styled.div<{ variant: string }>`
  display: flex;
  border-bottom: ${(props) =>
    props.variant === 'line'
      ? '1px solid var(--rhuds-colors-border)'
      : 'none'};
  gap: ${(props) => (props.variant === 'card' ? 'var(--rhuds-spacing-sm)' : '0')};
  padding: ${(props) =>
    props.variant === 'card' ? 'var(--rhuds-spacing-md)' : '0'};
  background: ${(props) =>
    props.variant === 'card' ? 'var(--rhuds-colors-background)' : 'transparent'};
`

const TabButton = styled.button<{
  isActive: boolean
  variant: string
  disabled?: boolean
}>`
  padding: var(--rhuds-spacing-md) var(--rhuds-spacing-lg);
  background: transparent;
  border: none;
  color: ${(props) =>
    props.isActive
      ? 'var(--rhuds-colors-primary)'
      : 'var(--rhuds-colors-text)'};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  font-size: var(--rhuds-typography-fontSize-md);
  font-weight: ${(props) =>
    props.isActive
      ? 'var(--rhuds-typography-fontWeight-semibold)'
      : 'var(--rhuds-typography-fontWeight-normal)'};
  font-family: var(--rhuds-typography-fontFamily);
  transition: all var(--rhuds-transitions-normal);
  position: relative;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  white-space: nowrap;

  ${(props) => {
    if (props.variant === 'line') {
      return css`
        border-bottom: 2px solid transparent;
        margin-bottom: -1px;

        ${props.isActive &&
        css`
          border-bottom-color: var(--rhuds-colors-primary);
          box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
        `}

        &:hover:not(:disabled) {
          color: var(--rhuds-colors-primary);
        }
      `
    } else {
      return css`
        border-radius: 2px;
        background: ${props.isActive
          ? 'var(--rhuds-colors-surface)'
          : 'transparent'};
        box-shadow: ${props.isActive
          ? '0 0 10px rgba(0, 255, 0, 0.2)'
          : 'none'};

        &:hover:not(:disabled) {
          background: rgba(0, 255, 0, 0.05);
        }
      `
    }
  }}

  &:focus-visible {
    outline: 2px solid var(--rhuds-colors-primary);
    outline-offset: 2px;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }
`

const TabContent = styled.div<{ isActive: boolean }>`
  display: ${(props) => (props.isActive ? 'block' : 'none')};
  padding: var(--rhuds-spacing-lg);
  animation: ${(props) =>
    props.isActive ? 'fadeIn 0.3s ease-in' : 'none'};

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      items,
      activeTabId: controlledActiveTabId,
      onTabChange,
      variant = 'line',
      size = 'md',
      testId,
      ariaLabel,
    },
    ref
  ) => {
    const [internalActiveTabId, setInternalActiveTabId] = React.useState(
      items[0]?.id || ''
    )
    const activeTabId =
      controlledActiveTabId !== undefined
        ? controlledActiveTabId
        : internalActiveTabId

    const handleTabChange = (tabId: string) => {
      if (onTabChange) {
        onTabChange(tabId)
      } else {
        setInternalActiveTabId(tabId)
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      const enabledItems = items.filter((item) => !item.disabled)
      const currentIndex = enabledItems.findIndex((item) => item.id === activeTabId)

      let nextIndex = currentIndex

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault()
          nextIndex =
            currentIndex < enabledItems.length - 1 ? currentIndex + 1 : 0
          break
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault()
          nextIndex =
            currentIndex > 0 ? currentIndex - 1 : enabledItems.length - 1
          break
        case 'Home':
          e.preventDefault()
          nextIndex = 0
          break
        case 'End':
          e.preventDefault()
          nextIndex = enabledItems.length - 1
          break
        default:
          return
      }

      if (nextIndex !== currentIndex) {
        handleTabChange(enabledItems[nextIndex].id)
      }
    }

    return (
      <TabsContainer
        ref={ref}
        data-testid={testId}
        role="tablist"
        aria-label={ariaLabel}
      >
        <TabsList variant={variant}>
          {items.map((item) => (
            <TabButton
              key={item.id}
              isActive={activeTabId === item.id}
              variant={variant}
              disabled={item.disabled}
              onClick={() => !item.disabled && handleTabChange(item.id)}
              onKeyDown={handleKeyDown}
              role="tab"
              aria-selected={activeTabId === item.id}
              aria-controls={`${testId}-panel-${item.id}`}
              tabIndex={activeTabId === item.id ? 0 : -1}
              data-testid={testId ? `${testId}-tab-${item.id}` : undefined}
            >
              {item.label}
            </TabButton>
          ))}
        </TabsList>
        {items.map((item) => (
          <TabContent
            key={item.id}
            isActive={activeTabId === item.id}
            role="tabpanel"
            id={`${testId}-panel-${item.id}`}
            aria-labelledby={`${testId}-tab-${item.id}`}
            data-testid={testId ? `${testId}-panel-${item.id}` : undefined}
          >
            {item.content}
          </TabContent>
        ))}
      </TabsContainer>
    )
  }
)

Tabs.displayName = 'Tabs'
