/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COLD WAR RICH EDITOR - AAA CINEMATIC IMPLEMENTATION
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * TACTICAL DOCUMENT EDITOR - $1M IMPLEMENTATION
 *
 * FEATURES:
 * - Rich text formatting toolbar
 * - Bold, italic, underline, strikethrough
 * - Lists (ordered, unordered)
 * - Headings (H1, H2, H3)
 * - Cold War tactical styling
 * - Scanlines and glow effects
 */

import React, { useState, useRef, CSSProperties } from 'react';
import { getComponentChamferClip, THEME_VARIANTS, ANIMATION_TOKENS } from '@rhuds/core';
import { getRgbString, generateTechCode, getMilitaryTimestamp } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';
import { GlowOverlay } from '../utils/GlowOverlay';

export interface ColdWarRichEditorProps {
  /** Theme variant */
  theme?: 'perseus' | 'greenTerminal' | 'satelliteView';
  /** Editor size */
  size?: 'sm' | 'md' | 'lg';
  /** Initial content */
  content?: string;
  /** Change handler */
  onChange?: (content: string) => void;
  /** Read-only mode */
  readOnly?: boolean;
  /** Apply scanlines effect */
  scanlines?: boolean;
  /** Scanlines intensity */
  scanlinesIntensity?: 'low' | 'medium' | 'high';
  /** Apply glow effect */
  glow?: boolean;
  /** Show tech code */
  showTechCode?: boolean;
  /** Show corner brackets */
  showCorners?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Additional inline styles */
  style?: CSSProperties;
}

type FormatAction =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strikethrough'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'ul'
  | 'ol';

/**
 * Cold War Rich Editor Component
 */
export const ColdWarRichEditor: React.FC<ColdWarRichEditorProps> = ({
  theme = 'perseus',
  size = 'md',
  content = '',
  onChange,
  readOnly = false,
  scanlines = true,
  scanlinesIntensity = 'medium',
  glow = true,
  showTechCode = true,
  showCorners = true,
  className = '',
  style = {},
}) => {
  const [htmlContent, setHtmlContent] = useState(content);
  const [techCode] = useState(() => generateTechCode('EDIT'));
  const editorRef = useRef<HTMLDivElement>(null);
  const themeColors = THEME_VARIANTS[theme];
  const rgb = getRgbString(themeColors.primary);

  const handleFormat = (action: FormatAction) => {
    if (readOnly) return;

    document.execCommand(action, false, undefined);

    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setHtmlContent(newContent);
      onChange?.(newContent);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setHtmlContent(newContent);
      onChange?.(newContent);
    }
  };

  const sizeMap = {
    sm: { fontSize: '12px', padding: '8px', minHeight: '200px', toolbarHeight: '36px' },
    md: { fontSize: '14px', padding: '12px', minHeight: '300px', toolbarHeight: '42px' },
    lg: { fontSize: '16px', padding: '16px', minHeight: '400px', toolbarHeight: '48px' },
  };

  const sizeStyles = sizeMap[size];

  const containerStyles: CSSProperties = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 0,
    clipPath: getComponentChamferClip('card'),
    background: `
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(${rgb}, 0.02) 2px,
        rgba(${rgb}, 0.02) 4px
      ),
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 2px,
        rgba(${rgb}, 0.02) 2px,
        rgba(${rgb}, 0.02) 4px
      ),
      linear-gradient(135deg, rgba(10, 10, 20, 0.98) 0%, rgba(10, 10, 20, 0.95) 100%)
    `,
    border: `1px solid rgba(${rgb}, 0.3)`,
    boxShadow: `
      inset 0 0 30px rgba(0, 0, 0, 0.6),
      inset 0 0 10px rgba(${rgb}, 0.1),
      0 4px 12px rgba(0, 0, 0, 0.4)
    `,
    overflow: 'hidden',
    ...style,
  };

  const headerStyles: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 12px',
    borderBottom: `1px solid rgba(${rgb}, 0.3)`,
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: themeColors.primary,
    background: `rgba(${rgb}, 0.1)`,
  };

  const toolbarStyles: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '8px 12px',
    borderBottom: `1px solid rgba(${rgb}, 0.2)`,
    background: `rgba(${rgb}, 0.05)`,
    height: sizeStyles.toolbarHeight,
    flexWrap: 'wrap',
  };

  const toolButtonStyles: CSSProperties = {
    padding: '6px 10px',
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase',
    color: themeColors.primary,
    background: 'transparent',
    border: `1px solid rgba(${rgb}, 0.3)`,
    cursor: readOnly ? 'not-allowed' : 'pointer',
    transition: `all ${ANIMATION_TOKENS.timing.hover} ${ANIMATION_TOKENS.easing.tactical}`,
    opacity: readOnly ? 0.4 : 1,
  };

  const editorStyles: CSSProperties = {
    flex: 1,
    padding: sizeStyles.padding,
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    fontSize: sizeStyles.fontSize,
    lineHeight: '1.6',
    color: themeColors.text,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    minHeight: sizeStyles.minHeight,
    overflowY: 'auto',
    textShadow: glow ? `0 0 4px ${themeColors.primary}` : 'none',
  };

  const toolbarButtons: Array<{ action: FormatAction; label: string; icon: string }> = [
    { action: 'bold', label: 'B', icon: '𝐁' },
    { action: 'italic', label: 'I', icon: '𝐼' },
    { action: 'underline', label: 'U', icon: 'U̲' },
    { action: 'strikethrough', label: 'S', icon: 'S̶' },
    { action: 'h1', label: 'H1', icon: 'H1' },
    { action: 'h2', label: 'H2', icon: 'H2' },
    { action: 'h3', label: 'H3', icon: 'H3' },
    { action: 'ul', label: 'UL', icon: '•' },
    { action: 'ol', label: 'OL', icon: '1.' },
  ];

  return (
    <div className={className} style={containerStyles}>
      {/* Header */}
      <div style={headerStyles}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              display: 'inline-block',
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: themeColors.primary,
              boxShadow: `0 0 6px ${themeColors.primary}`,
              animation: 'led-pulse 1s ease-in-out infinite',
            }}
          />
          <span>RICH TEXT EDITOR</span>
        </div>
        {showTechCode && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '9px',
              opacity: 0.6,
            }}
          >
            <span>{techCode}</span>
            <span>{getMilitaryTimestamp()}</span>
          </div>
        )}
      </div>

      {/* Toolbar */}
      {!readOnly && (
        <div style={toolbarStyles}>
          {toolbarButtons.map(({ action, label, icon }) => (
            <button
              key={action}
              onClick={() => handleFormat(action)}
              style={toolButtonStyles}
              onMouseEnter={(e) => {
                if (!readOnly) {
                  e.currentTarget.style.background = `rgba(${rgb}, 0.2)`;
                  e.currentTarget.style.boxShadow = `0 0 10px rgba(${rgb}, 0.3)`;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.boxShadow = 'none';
              }}
              disabled={readOnly}
            >
              {icon}
            </button>
          ))}
        </div>
      )}

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={!readOnly}
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
        style={editorStyles}
      />

      {/* Corner Brackets */}
      {showCorners && (
        <>
          <div
            style={{
              position: 'absolute',
              top: '4px',
              left: '4px',
              width: '12px',
              height: '12px',
              borderTop: `2px solid ${themeColors.primary}`,
              borderLeft: `2px solid ${themeColors.primary}`,
              opacity: 0.6,
              zIndex: 10,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '12px',
              height: '12px',
              borderTop: `2px solid ${themeColors.primary}`,
              borderRight: `2px solid ${themeColors.primary}`,
              opacity: 0.6,
              zIndex: 10,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '4px',
              left: '4px',
              width: '12px',
              height: '12px',
              borderBottom: `2px solid ${themeColors.primary}`,
              borderLeft: `2px solid ${themeColors.primary}`,
              opacity: 0.6,
              zIndex: 10,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '4px',
              right: '4px',
              width: '12px',
              height: '12px',
              borderBottom: `2px solid ${themeColors.primary}`,
              borderRight: `2px solid ${themeColors.primary}`,
              opacity: 0.6,
              zIndex: 10,
            }}
          />
        </>
      )}

      {/* Scanlines */}
      {scanlines && <ScanlinesOverlay intensity={scanlinesIntensity} />}

      {/* Glow */}
      {glow && <GlowOverlay color={themeColors.primary} intensity="low" />}

      {/* Animations */}
      <style>
        {`
          @keyframes led-pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default ColdWarRichEditor;
