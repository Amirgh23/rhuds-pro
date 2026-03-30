/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COLD WAR FILE UPLOAD - AAA CINEMATIC IMPLEMENTATION
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useRef, DragEvent, ChangeEvent, CSSProperties } from 'react';
import { getComponentChamferClip, THEME_VARIANTS, ANIMATION_TOKENS } from '@rhuds/core';
import { getRgbString, generateTechCode } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';
import { GlowOverlay } from '../utils/GlowOverlay';

export interface ColdWarFileUploadProps {
  theme?: 'perseus' | 'greenTerminal' | 'satelliteView';
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  onUpload?: (files: File[]) => void;
  scanlines?: boolean;
  scanlinesIntensity?: 'low' | 'medium' | 'high';
  glow?: boolean;
  showCorners?: boolean;
  className?: string;
  style?: CSSProperties;
}

export const ColdWarFileUpload: React.FC<ColdWarFileUploadProps> = ({
  theme = 'perseus',
  accept,
  multiple = false,
  maxSize,
  onUpload,
  scanlines = true,
  scanlinesIntensity = 'medium',
  glow = true,
  showCorners = true,
  className = '',
  style = {},
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [techCode] = useState(() => generateTechCode('UPL'));
  const fileInputRef = useRef<HTMLInputElement>(null);
  const themeColors = THEME_VARIANTS[theme];
  const rgb = getRgbString(themeColors.primary);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter((file) => {
      if (maxSize && file.size > maxSize) return false;
      return true;
    });

    setFiles(validFiles);
    onUpload?.(validFiles);

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 100);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const containerStyles: CSSProperties = {
    position: 'relative',
    borderRadius: 0,
    clipPath: getComponentChamferClip('card'),
    background: isDragging
      ? `
        repeating-linear-gradient(
          45deg,
          rgba(${rgb}, 0.1),
          rgba(${rgb}, 0.1) 10px,
          rgba(${rgb}, 0.05) 10px,
          rgba(${rgb}, 0.05) 20px
        ),
        linear-gradient(135deg, rgba(10, 10, 20, 0.98) 0%, rgba(10, 10, 20, 0.95) 100())
      `
      : `
        repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(${rgb}, 0.02) 2px,
          rgba(${rgb}, 0.02) 4px
        ),
        linear-gradient(135deg, rgba(10, 10, 20, 0.98) 0%, rgba(10, 10, 20, 0.95) 100())
      `,
    border: `2px dashed ${isDragging ? themeColors.primary : `rgba(${rgb}, 0.3)`}`,
    boxShadow: isDragging
      ? `inset 0 0 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(${rgb}, 0.4), 0 4px 12px rgba(0, 0, 0, 0.4)`
      : `inset 0 0 20px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3)`,
    transition: `all ${ANIMATION_TOKENS.timing.transition} ${ANIMATION_TOKENS.easing.smooth}`,
    overflow: 'hidden',
    ...style,
  };

  const dropzoneStyles: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    minHeight: '200px',
    cursor: 'pointer',
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    color: themeColors.primary,
    textAlign: 'center',
  };

  return (
    <div className={className} style={containerStyles}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileInput}
        style={{ display: 'none' }}
      />

      <div
        style={dropzoneStyles}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {files.length === 0 ? (
          <>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.6 }}>↑</div>
            <div
              style={{
                fontSize: '14px',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}
            >
              DROP FILES HERE
            </div>
            <div style={{ fontSize: '11px', opacity: 0.6 }}>OR CLICK TO SELECT</div>
            <div style={{ fontSize: '9px', opacity: 0.4, marginTop: '12px' }}>{techCode}</div>
          </>
        ) : (
          <div style={{ width: '100%' }}>
            <div
              style={{
                fontSize: '14px',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginBottom: '16px',
              }}
            >
              {files.length} FILE{files.length > 1 ? 'S' : ''} SELECTED
            </div>
            {files.map((file, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  marginBottom: '8px',
                  background: `rgba(${rgb}, 0.1)`,
                  border: `1px solid rgba(${rgb}, 0.3)`,
                  fontSize: '11px',
                }}
              >
                <span
                  style={{
                    flex: 1,
                    textAlign: 'left',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {file.name}
                </span>
                <span style={{ opacity: 0.6, marginLeft: '12px' }}>
                  {formatFileSize(file.size)}
                </span>
              </div>
            ))}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div style={{ marginTop: '16px', width: '100%' }}>
                <div
                  style={{
                    width: '100%',
                    height: '4px',
                    background: `rgba(${rgb}, 0.2)`,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${uploadProgress}%`,
                      height: '100%',
                      background: themeColors.primary,
                      boxShadow: `0 0 10px ${themeColors.primary}`,
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
                <div style={{ fontSize: '10px', marginTop: '8px', opacity: 0.6 }}>
                  UPLOADING: {uploadProgress}%
                </div>
              </div>
            )}
          </div>
        )}
      </div>

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
            }}
          />
        </>
      )}

      {scanlines && <ScanlinesOverlay intensity={scanlinesIntensity} />}
      {glow && <GlowOverlay color={themeColors.primary} intensity="low" />}
    </div>
  );
};

export default ColdWarFileUpload;
