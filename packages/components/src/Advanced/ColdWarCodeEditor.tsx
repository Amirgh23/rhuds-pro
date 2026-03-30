/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COLD WAR CODE EDITOR - AAA CINEMATIC IMPLEMENTATION
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * TACTICAL CODE TERMINAL - $1M IMPLEMENTATION
 *
 * FEATURES:
 * - Syntax highlighting with Cold War theme
 * - Line numbers with tactical styling
 * - Active line highlighting
 * - Scanlines and glow effects
 * - Corner brackets and tech codes
 * - Monospace font with CRT effect
 */

import React, { useState, useRef, useEffect, CSSProperties, ChangeEvent } from 'react';
import { getComponentChamferClip, THEME_VARIANTS, ANIMATION_TOKENS } from '@rhuds/core';
import { getRgbString, generateTechCode, getMilitaryTimestamp } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';
import { GlowOverlay } from '../utils/GlowOverlay';

export interface ColdWarCodeEditorProps {
  /** Theme variant */
  theme?: 'perseus' | 'greenTerminal' | 'satelliteView';
  /** Editor size */
  size?: 'sm' | 'md' | 'lg';
  /** Initial code content */
  code?: string;
  /** Programming language for syntax highlighting */
  language?: 'javascript' | 'typescript' | 'python' | 'html' | 'css' | 'json';
  /** Change handler */
  onChange?: (code: string) => void;
  /** Read-only mode */
  readOnly?: boolean;
  /** Show line numbers */
  showLineNumbers?: boolean;
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

/**
 * Simple syntax highlighter for Cold War theme
 */
function highlightSyntax(code: string, language: string, themeColor: string): string {
  const lines = code.split('\n');

  return lines
    .map((line) => {
      let highlighted = line;

      // Keywords
      const keywords = [
        'const',
        'let',
        'var',
        'function',
        'return',
        'if',
        'else',
        'for',
        'while',
        'class',
        'import',
        'export',
        'from',
        'def',
        'async',
        'await',
      ];
      keywords.forEach((keyword) => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'g');
        highlighted = highlighted.replace(
          regex,
          `<span style="color: ${themeColor}; font-weight: 600;">${keyword}</span>`
        );
      });

      // Strings
      highlighted = highlighted.replace(
        /(['"`])(.*?)\1/g,
        `<span style="color: #33ff00; opacity: 0.8;">$1$2$1</span>`
      );

      // Comments
      highlighted = highlighted.replace(
        /(\/\/.*$)/g,
        `<span style="color: #666; font-style: italic;">$1</span>`
      );
      highlighted = highlighted.replace(
        /(\/\*[\s\S]*?\*\/)/g,
        `<span style="color: #666; font-style: italic;">$1</span>`
      );

      // Numbers
      highlighted = highlighted.replace(/\b(\d+)\b/g, `<span style="color: #00ccff;">$1</span>`);

      return highlighted;
    })
    .join('\n');
}

/**
 * Cold War Code Editor Component
 */
export const ColdWarCodeEditor: React.FC<ColdWarCodeEditorProps> = ({
  theme = 'perseus',
  size = 'md',
  code = '',
  language = 'javascript',
  onChange,
  readOnly = false,
  showLineNumbers = true,
  scanlines = true,
  scanlinesIntensity = 'medium',
  glow = true,
  showTechCode = true,
  showCorners = true,
  className = '',
  style = {},
}) => {
  const [content, setContent] = useState(code);
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const [techCode] = useState(() => generateTechCode('CODE'));
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const themeColors = THEME_VARIANTS[theme];
  const rgb = getRgbString(themeColors.primary);

  useEffect(() => {
    setContent(code);
  }, [code]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    onChange?.(newContent);
  };

  const handleScroll = () => {
    if (textareaRef.current) {
      const lineHeight = parseInt(getComputedStyle(textareaRef.current).lineHeight);
      const scrollTop = textareaRef.current.scrollTop;
      setActiveLineIndex(Math.floor(scrollTop / lineHeight));
    }
  };

  const lines = content.split('\n');
  const lineCount = lines.length;

  const sizeMap = {
    sm: { fontSize: '12px', padding: '8px', minHeight: '200px' },
    md: { fontSize: '14px', padding: '12px', minHeight: '300px' },
    lg: { fontSize: '16px', padding: '16px', minHeight: '400px' },
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

  const editorContainerStyles: CSSProperties = {
    display: 'flex',
    flex: 1,
    position: 'relative',
    minHeight: sizeStyles.minHeight,
  };

  const lineNumbersStyles: CSSProperties = {
    display: showLineNumbers ? 'flex' : 'none',
    flexDirection: 'column',
    padding: sizeStyles.padding,
    paddingRight: '8px',
    background: `rgba(${rgb}, 0.05)`,
    borderRight: `1px solid rgba(${rgb}, 0.2)`,
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    fontSize: sizeStyles.fontSize,
    lineHeight: '1.5',
    color: `rgba(${rgb}, 0.5)`,
    textAlign: 'right',
    userSelect: 'none',
    minWidth: '40px',
  };

  const textareaStyles: CSSProperties = {
    flex: 1,
    padding: sizeStyles.padding,
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    fontSize: sizeStyles.fontSize,
    lineHeight: '1.5',
    color: themeColors.text,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    resize: 'none',
    whiteSpace: 'pre',
    overflowWrap: 'normal',
    overflowX: 'auto',
    overflowY: 'auto',
    caretColor: themeColors.primary,
    textShadow: glow ? `0 0 4px ${themeColors.primary}` : 'none',
  };

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
          <span>{language.toUpperCase()} EDITOR</span>
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

      {/* Editor Container */}
      <div style={editorContainerStyles}>
        {/* Line Numbers */}
        {showLineNumbers && (
          <div style={lineNumbersStyles}>
            {Array.from({ length: lineCount }, (_, i) => (
              <div
                key={i}
                style={{
                  color: i === activeLineIndex ? themeColors.primary : `rgba(${rgb}, 0.5)`,
                  fontWeight: i === activeLineIndex ? 600 : 400,
                  textShadow:
                    i === activeLineIndex && glow ? `0 0 4px ${themeColors.primary}` : 'none',
                }}
              >
                {i + 1}
              </div>
            ))}
          </div>
        )}

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onScroll={handleScroll}
          readOnly={readOnly}
          spellCheck={false}
          style={textareaStyles}
        />
      </div>

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

export default ColdWarCodeEditor;
