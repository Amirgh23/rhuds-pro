/**
 * Text Component
 * Typography component with animation support
 */

import React, { useMemo } from 'react';
import { useTheme } from '@rhuds/core';
import { TextProps } from './types';

/**
 * Get variant styles
 */
function getVariantStyles(variant: string = 'body'): React.CSSProperties {
  const styles: Record<string, React.CSSProperties> = {
    h1: { fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.2 },
    h2: { fontSize: '2rem', fontWeight: 700, lineHeight: 1.3 },
    h3: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.4 },
    h4: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.4 },
    h5: { fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.5 },
    h6: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.5 },
    body: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.6 },
    caption: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.5 },
    code: { fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.6, fontFamily: 'monospace' },
  };

  return styles[variant] || styles.body;
}

/**
 * Get alignment styles
 */
function getAlignStyles(align: string = 'left'): React.CSSProperties {
  return { textAlign: align as any };
}

/**
 * Get weight styles
 */
function getWeightStyles(weight: string = 'normal'): React.CSSProperties {
  const weights: Record<string, number> = {
    light: 300,
    normal: 400,
    semibold: 600,
    bold: 700,
  };

  return { fontWeight: weights[weight] || 400 };
}

/**
 * Get transform styles
 */
function getTransformStyles(transform: string = 'none'): React.CSSProperties {
  if (transform === 'none') return {};
  return { textTransform: transform as any };
}

/**
 * Text Component
 */
export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  align = 'left',
  weight,
  color,
  size,
  lineHeight,
  letterSpacing,
  transform = 'none',
  animated = false,
  animationSpeed = 1,
  truncate = false,
  maxLines,
  className,
  style,
  as: Component = 'p',
}) => {
  const theme = useTheme();

  const computedStyle = useMemo<React.CSSProperties>(() => {
    const tokens = (theme as any)?.currentMode?.tokens || theme;
    const variantStyles = getVariantStyles(variant);
    const alignStyles = getAlignStyles(align);
    const weightStyles = weight ? getWeightStyles(weight) : {};
    const transformStyles = getTransformStyles(transform);

    return {
      ...variantStyles,
      ...alignStyles,
      ...weightStyles,
      ...transformStyles,
      color: color || tokens.colors?.text || '#ffffff',
      fontSize: size ? `${size}px` : variantStyles.fontSize,
      lineHeight: lineHeight || variantStyles.lineHeight,
      letterSpacing: letterSpacing ? `${letterSpacing}px` : undefined,
      overflow: truncate ? 'hidden' : undefined,
      textOverflow: truncate ? 'ellipsis' : undefined,
      whiteSpace: truncate && !maxLines ? 'nowrap' : undefined,
      display: truncate && maxLines ? '-webkit-box' : undefined,
      WebkitLineClamp: maxLines ? maxLines : undefined,
      WebkitBoxOrient: maxLines ? 'vertical' : undefined,
      opacity: animated ? 0.8 : 1,
      transition: animated ? `opacity ${0.3 / animationSpeed}s ease-in-out` : undefined,
      ...style,
    };
  }, [variant, align, weight, color, size, lineHeight, letterSpacing, transform, truncate, maxLines, animated, animationSpeed, theme, style]);

  return (
    <Component className={className} style={computedStyle} onMouseEnter={(e) => {
      if (animated) {
        (e.currentTarget as HTMLElement).style.opacity = '1';
      }
    }} onMouseLeave={(e) => {
      if (animated) {
        (e.currentTarget as HTMLElement).style.opacity = '0.8';
      }
    }}>
      {children}
    </Component>
  );
};

Text.displayName = 'Text';
