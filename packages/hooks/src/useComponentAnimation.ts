import React from 'react'

export type AnimationTrigger = 'mount' | 'hover' | 'click' | 'focus'

export interface UseComponentAnimationOptions {
  trigger?: AnimationTrigger
  duration?: number
  disabled?: boolean
}

export interface UseComponentAnimationReturn {
  ref: React.RefObject<HTMLElement>
  isAnimating: boolean
  animate: () => void
}

/**
 * Hook for managing component animations with various trigger types
 * Respects prefers-reduced-motion media query
 *
 * @param trigger - Animation trigger type: 'mount', 'hover', 'click', 'focus'
 * @param duration - Animation duration in milliseconds (default: 300)
 * @param disabled - Disable animations (default: false)
 * @returns Object with ref, isAnimating state, and animate function
 *
 * @example
 * const { ref, isAnimating, animate } = useComponentAnimation('hover', 300)
 * return <div ref={ref} className={isAnimating ? 'animating' : ''} />
 */
export function useComponentAnimation(
  trigger: AnimationTrigger = 'mount',
  duration: number = 300,
  disabled: boolean = false
): UseComponentAnimationReturn {
  const ref = React.useRef<HTMLElement>(null)
  const [isAnimating, setIsAnimating] = React.useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false)

  // Check for prefers-reduced-motion
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const animate = React.useCallback(() => {
    if (disabled || prefersReducedMotion) return

    setIsAnimating(true)
    const timer = setTimeout(() => {
      setIsAnimating(false)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, disabled, prefersReducedMotion])

  // Handle mount animation
  React.useEffect(() => {
    if (trigger === 'mount' && !disabled && !prefersReducedMotion) {
      animate()
    }
  }, [trigger, disabled, prefersReducedMotion, animate])

  // Handle hover animation
  React.useEffect(() => {
    if (trigger !== 'hover' || !ref.current) return

    const element = ref.current

    const handleMouseEnter = () => {
      animate()
    }

    element.addEventListener('mouseenter', handleMouseEnter)
    return () => element.removeEventListener('mouseenter', handleMouseEnter)
  }, [trigger, animate])

  // Handle click animation
  React.useEffect(() => {
    if (trigger !== 'click' || !ref.current) return

    const element = ref.current

    const handleClick = () => {
      animate()
    }

    element.addEventListener('click', handleClick)
    return () => element.removeEventListener('click', handleClick)
  }, [trigger, animate])

  // Handle focus animation
  React.useEffect(() => {
    if (trigger !== 'focus' || !ref.current) return

    const element = ref.current

    const handleFocus = () => {
      animate()
    }

    element.addEventListener('focus', handleFocus)
    return () => element.removeEventListener('focus', handleFocus)
  }, [trigger, animate])

  return {
    ref,
    isAnimating,
    animate,
  }
}
