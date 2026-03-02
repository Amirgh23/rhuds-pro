import React from 'react'
import styled, { css } from 'styled-components'

export interface AccordionItem {
  id: string
  title: React.ReactNode
  content: React.ReactNode
  disabled?: boolean
}

export interface AccordionProps {
  items: AccordionItem[]
  expandedIds?: string[]
  onExpandChange?: (expandedIds: string[]) => void
  allowMultiple?: boolean
  size?: 'sm' | 'md' | 'lg'
  testId?: string
  ariaLabel?: string
}

const AccordionContainer = styled.div`
  width: 100%;
  border: 1px solid var(--rhuds-colors-border);
  border-radius: 2px;
  overflow: hidden;
`

const AccordionItemContainer = styled.div`
  border-bottom: 1px solid var(--rhuds-colors-border);

  &:last-child {
    border-bottom: none;
  }
`

const AccordionHeader = styled.button<{ isExpanded: boolean; disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: var(--rhuds-spacing-md) var(--rhuds-spacing-lg);
  background: transparent;
  border: none;
  color: var(--rhuds-colors-text);
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  font-size: var(--rhuds-typography-fontSize-md);
  font-weight: var(--rhuds-typography-fontWeight-semibold);
  font-family: var(--rhuds-typography-fontFamily);
  transition: all var(--rhuds-transitions-normal);
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};

  &:hover:not(:disabled) {
    background: rgba(0, 255, 0, 0.05);
  }

  &:focus-visible {
    outline: 2px solid var(--rhuds-colors-primary);
    outline-offset: -2px;
  }

  ${(props) =>
    props.isExpanded &&
    css`
      background: rgba(0, 255, 0, 0.1);
      box-shadow: inset 0 0 10px rgba(0, 255, 0, 0.1);
    `}
`

const AccordionIcon = styled.span<{ isExpanded: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  transition: transform var(--rhuds-transitions-normal);
  transform: ${(props) => (props.isExpanded ? 'rotate(180deg)' : 'rotate(0)')};
  color: var(--rhuds-colors-primary);
  flex-shrink: 0;
`

const AccordionContent = styled.div<{ isExpanded: boolean }>`
  max-height: ${(props) => (props.isExpanded ? '1000px' : '0')};
  overflow: hidden;
  transition: max-height var(--rhuds-transitions-normal),
    opacity var(--rhuds-transitions-normal);
  opacity: ${(props) => (props.isExpanded ? 1 : 0)};
  background: var(--rhuds-colors-background);
`

const AccordionBody = styled.div`
  padding: var(--rhuds-spacing-lg);
  color: var(--rhuds-colors-text);
`

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      items,
      expandedIds: controlledExpandedIds,
      onExpandChange,
      allowMultiple = false,
      size = 'md',
      testId,
      ariaLabel,
    },
    ref
  ) => {
    const [internalExpandedIds, setInternalExpandedIds] = React.useState<
      string[]
    >([])
    const expandedIds =
      controlledExpandedIds !== undefined
        ? controlledExpandedIds
        : internalExpandedIds

    const handleExpandChange = (itemId: string) => {
      let newExpandedIds: string[]

      if (expandedIds.includes(itemId)) {
        newExpandedIds = expandedIds.filter((id) => id !== itemId)
      } else {
        if (allowMultiple) {
          newExpandedIds = [...expandedIds, itemId]
        } else {
          newExpandedIds = [itemId]
        }
      }

      if (onExpandChange) {
        onExpandChange(newExpandedIds)
      } else {
        setInternalExpandedIds(newExpandedIds)
      }
    }

    const handleKeyDown = (
      e: React.KeyboardEvent<HTMLButtonElement>,
      itemId: string
    ) => {
      const itemIndex = items.findIndex((item) => item.id === itemId)

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          if (itemIndex < items.length - 1) {
            const nextButton = document.querySelector(
              `[data-accordion-item="${items[itemIndex + 1].id}"]`
            ) as HTMLButtonElement
            nextButton?.focus()
          }
          break
        case 'ArrowUp':
          e.preventDefault()
          if (itemIndex > 0) {
            const prevButton = document.querySelector(
              `[data-accordion-item="${items[itemIndex - 1].id}"]`
            ) as HTMLButtonElement
            prevButton?.focus()
          }
          break
        case 'Home':
          e.preventDefault()
          const firstButton = document.querySelector(
            `[data-accordion-item="${items[0].id}"]`
          ) as HTMLButtonElement
          firstButton?.focus()
          break
        case 'End':
          e.preventDefault()
          const lastButton = document.querySelector(
            `[data-accordion-item="${items[items.length - 1].id}"]`
          ) as HTMLButtonElement
          lastButton?.focus()
          break
        default:
          break
      }
    }

    return (
      <AccordionContainer
        ref={ref}
        data-testid={testId}
        role="region"
        aria-label={ariaLabel}
      >
        {items.map((item) => (
          <AccordionItemContainer key={item.id}>
            <AccordionHeader
              isExpanded={expandedIds.includes(item.id)}
              disabled={item.disabled}
              onClick={() => !item.disabled && handleExpandChange(item.id)}
              onKeyDown={(e) => handleKeyDown(e, item.id)}
              aria-expanded={expandedIds.includes(item.id)}
              aria-controls={`${testId}-content-${item.id}`}
              data-accordion-item={item.id}
              data-testid={testId ? `${testId}-header-${item.id}` : undefined}
            >
              <span>{item.title}</span>
              <AccordionIcon isExpanded={expandedIds.includes(item.id)}>
                ▼
              </AccordionIcon>
            </AccordionHeader>
            <AccordionContent isExpanded={expandedIds.includes(item.id)}>
              <AccordionBody
                id={`${testId}-content-${item.id}`}
                role="region"
                data-testid={testId ? `${testId}-content-${item.id}` : undefined}
              >
                {item.content}
              </AccordionBody>
            </AccordionContent>
          </AccordionItemContainer>
        ))}
      </AccordionContainer>
    )
  }
)

Accordion.displayName = 'Accordion'
