import React from 'react'
import styled, { css } from 'styled-components'

export interface BreadcrumbItem {
  id: string
  label: React.ReactNode
  href?: string
  onClick?: () => void
  active?: boolean
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  onItemClick?: (itemId: string) => void
  separator?: React.ReactNode
  testId?: string
  ariaLabel?: string
}

const BreadcrumbContainer = styled.nav`
  display: flex;
  align-items: center;
  gap: var(--rhuds-spacing-sm);
  padding: var(--rhuds-spacing-md) var(--rhuds-spacing-lg);
  background: transparent;
  font-size: var(--rhuds-typography-fontSize-sm);
`

const BreadcrumbList = styled.ol`
  display: flex;
  align-items: center;
  gap: var(--rhuds-spacing-sm);
  list-style: none;
  margin: 0;
  padding: 0;
`

const BreadcrumbItemContainer = styled.li`
  display: flex;
  align-items: center;
  gap: var(--rhuds-spacing-sm);
`

const BreadcrumbLink = styled.a<{ active?: boolean }>`
  color: ${(props) =>
    props.active
      ? 'var(--rhuds-colors-text)'
      : 'var(--rhuds-colors-primary)'};
  text-decoration: none;
  cursor: ${(props) => (props.active ? 'default' : 'pointer')};
  transition: all var(--rhuds-transitions-normal);
  font-weight: ${(props) =>
    props.active
      ? 'var(--rhuds-typography-fontWeight-semibold)'
      : 'var(--rhuds-typography-fontWeight-normal)'};
  position: relative;

  ${(props) =>
    !props.active &&
    css`
      &:hover {
        color: var(--rhuds-colors-secondary);
        text-decoration: underline;
        text-decoration-color: var(--rhuds-colors-primary);
        text-decoration-thickness: 2px;
        text-underline-offset: 4px;
      }
    `}

  &:focus-visible {
    outline: 2px solid var(--rhuds-colors-primary);
    outline-offset: 2px;
  }

  ${(props) =>
    props.active &&
    css`
      box-shadow: 0 0 10px rgba(0, 255, 0, 0.2);
    `}
`

const BreadcrumbSeparator = styled.span`
  color: var(--rhuds-colors-border);
  display: flex;
  align-items: center;
  user-select: none;
`

export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  (
    {
      items,
      onItemClick,
      separator = '/',
      testId,
      ariaLabel,
    },
    ref
  ) => {
    const handleItemClick = (itemId: string, item: BreadcrumbItem) => {
      if (!item.active) {
        onItemClick?.(itemId)
        if (!item.href) {
          item.onClick?.()
        }
      }
    }

    return (
      <BreadcrumbContainer
        ref={ref}
        data-testid={testId}
        aria-label={ariaLabel || 'Breadcrumb navigation'}
      >
        <BreadcrumbList>
          {items.map((item, index) => (
            <React.Fragment key={item.id}>
              <BreadcrumbItemContainer>
                <BreadcrumbLink
                  href={item.href || '#'}
                  active={item.active}
                  onClick={(e) => {
                    if (!item.href) {
                      e.preventDefault()
                    }
                    handleItemClick(item.id, item)
                  }}
                  aria-current={item.active ? 'page' : undefined}
                  role="link"
                  data-testid={testId ? `${testId}-item-${item.id}` : undefined}
                >
                  {item.label}
                </BreadcrumbLink>
              </BreadcrumbItemContainer>
              {index < items.length - 1 && (
                <BreadcrumbSeparator aria-hidden="true">
                  {separator}
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </BreadcrumbContainer>
    )
  }
)

Breadcrumb.displayName = 'Breadcrumb'
