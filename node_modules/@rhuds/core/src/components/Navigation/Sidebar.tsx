import React from 'react'
import styled, { css } from 'styled-components'

export interface SidebarItem {
  id: string
  label: React.ReactNode
  icon?: React.ReactNode
  href?: string
  onClick?: () => void
  active?: boolean
  disabled?: boolean
}

export interface SidebarProps {
  items: SidebarItem[]
  isCollapsed?: boolean
  onCollapsedChange?: (isCollapsed: boolean) => void
  onItemClick?: (itemId: string) => void
  testId?: string
  ariaLabel?: string
}

const SidebarContainer = styled.aside<{ isCollapsed: boolean }>`
  display: flex;
  flex-direction: column;
  background: var(--rhuds-colors-surface);
  border-right: 1px solid var(--rhuds-colors-border);
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.1);
  transition: width var(--rhuds-transitions-normal);
  width: ${(props) => (props.isCollapsed ? '60px' : '250px')};
  min-height: 100vh;
  position: relative;
`

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: var(--rhuds-spacing-md);
  border-bottom: 1px solid var(--rhuds-colors-border);
`

const CollapseButton = styled.button`
  background: transparent;
  border: none;
  color: var(--rhuds-colors-text);
  cursor: pointer;
  font-size: 18px;
  padding: var(--rhuds-spacing-sm);
  transition: all var(--rhuds-transitions-normal);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;

  &:hover {
    color: var(--rhuds-colors-primary);
    transform: scale(1.1);
  }

  &:focus-visible {
    outline: 2px solid var(--rhuds-colors-primary);
    outline-offset: 2px;
  }
`

const SidebarMenu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  flex: 1;
  overflow-y: auto;
`

const SidebarItemStyled = styled.a<{
  active?: boolean
  disabled?: boolean
  isCollapsed: boolean
}>`
  display: flex;
  align-items: center;
  gap: var(--rhuds-spacing-md);
  padding: var(--rhuds-spacing-md);
  color: ${(props) =>
    props.active
      ? 'var(--rhuds-colors-primary)'
      : 'var(--rhuds-colors-text)'};
  text-decoration: none;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  font-size: var(--rhuds-typography-fontSize-md);
  font-family: var(--rhuds-typography-fontFamily);
  transition: all var(--rhuds-transitions-normal);
  border-left: 3px solid transparent;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${(props) =>
    props.active &&
    css`
      border-left-color: var(--rhuds-colors-primary);
      background: rgba(0, 255, 0, 0.1);
      box-shadow: inset 0 0 10px rgba(0, 255, 0, 0.1);
    `}

  &:hover:not(:disabled) {
    background: rgba(0, 255, 0, 0.05);
    padding-left: calc(var(--rhuds-spacing-md) + 4px);
  }

  &:focus-visible {
    outline: 2px solid var(--rhuds-colors-primary);
    outline-offset: -2px;
  }

  ${(props) =>
    props.isCollapsed &&
    css`
      justify-content: center;
      padding: var(--rhuds-spacing-md);
      border-left: none;
      border-bottom: 1px solid var(--rhuds-colors-border);

      &:hover:not(:disabled) {
        padding-left: var(--rhuds-spacing-md);
      }
    `}
`

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
`

const LabelWrapper = styled.span<{ isCollapsed: boolean }>`
  display: ${(props) => (props.isCollapsed ? 'none' : 'inline')};
  overflow: hidden;
  text-overflow: ellipsis;
`

export const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  (
    {
      items,
      isCollapsed: controlledIsCollapsed,
      onCollapsedChange,
      onItemClick,
      testId,
      ariaLabel,
    },
    ref
  ) => {
    const [internalIsCollapsed, setInternalIsCollapsed] = React.useState(false)
    const isCollapsed =
      controlledIsCollapsed !== undefined
        ? controlledIsCollapsed
        : internalIsCollapsed

    const handleCollapsedChange = () => {
      if (onCollapsedChange) {
        onCollapsedChange(!isCollapsed)
      } else {
        setInternalIsCollapsed(!isCollapsed)
      }
    }

    const handleItemClick = (itemId: string, item: SidebarItem) => {
      if (!item.disabled) {
        onItemClick?.(itemId)
        if (!item.href) {
          item.onClick?.()
        }
      }
    }

    return (
      <SidebarContainer
        ref={ref}
        isCollapsed={isCollapsed}
        data-testid={testId}
        aria-label={ariaLabel || 'Sidebar navigation'}
      >
        <SidebarHeader>
          <CollapseButton
            onClick={handleCollapsedChange}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            data-testid={testId ? `${testId}-collapse` : undefined}
          >
            {isCollapsed ? '→' : '←'}
          </CollapseButton>
        </SidebarHeader>
        <SidebarMenu role="menubar">
          {items.map((item) => (
            <SidebarItemStyled
              key={item.id}
              href={item.href || '#'}
              active={item.active}
              disabled={item.disabled}
              isCollapsed={isCollapsed}
              onClick={(e) => {
                if (!item.href) {
                  e.preventDefault()
                }
                handleItemClick(item.id, item)
              }}
              role="menuitem"
              title={isCollapsed ? (item.label as string) : undefined}
              data-testid={testId ? `${testId}-item-${item.id}` : undefined}
            >
              {item.icon && <IconWrapper>{item.icon}</IconWrapper>}
              <LabelWrapper isCollapsed={isCollapsed}>
                {item.label}
              </LabelWrapper>
            </SidebarItemStyled>
          ))}
        </SidebarMenu>
      </SidebarContainer>
    )
  }
)

Sidebar.displayName = 'Sidebar'
