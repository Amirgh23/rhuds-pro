import React, { useState, useRef, DragEvent } from 'react';
import { useTheme } from '@rhuds/core';

export interface FileUploadProps {
  onUpload?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  disabled?: boolean;
  showProgress?: boolean;
  className?: string;
}

export function FileUpload({
  onUpload,
  accept,
  multiple = false,
  maxSize = 10 * 1024 * 1024, // 10MB
  disabled = false,
  showProgress = true,
  className = '',
}: FileUploadProps) {
  const theme = useTheme();
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = (selectedFiles: File[]) => {
    const validFiles = selectedFiles.filter(file => {
      if (maxSize && file.size > maxSize) {
        console.warn(`File ${file.name} exceeds max size`);
        return false;
      }
      return true;
    });

    setFiles(prev => multiple ? [...prev, ...validFiles] : validFiles);
    
    // Simulate upload progress
    validFiles.forEach(file => {
      simulateUpload(file);
    });

    onUpload?.(validFiles);
  };

  const simulateUpload = (file: File) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(prev => ({ ...prev, [file.name]: progress }));
      
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 200);
  };

  const handleRemoveFile = (fileName: string) => {
    setFiles(prev => prev.filter(f => f.name !== fileName));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileName];
      return newProgress;
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className={className}>
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        style={{
          border: `2px dashed ${isDragging ? theme.currentMode.tokens.colors.primary : theme.currentMode.tokens.colors.border}`,
          borderRadius: '8px',
          padding: '32px',
          textAlign: 'center',
          backgroundColor: isDragging ? `${theme.currentMode.tokens.colors.primary}10` : theme.currentMode.tokens.colors.surface,
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          disabled={disabled}
          style={{ display: 'none' }}
        />
        
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
        <div style={{ color: theme.currentMode.tokens.colors.text, marginBottom: '8px' }}>
          {isDragging ? 'Drop files here' : 'Drag & drop files here'}
        </div>
        <div style={{ color: theme.currentMode.tokens.colors.text, opacity: 0.6, fontSize: '14px' }}>
          or click to browse
        </div>
        {maxSize && (
          <div style={{ color: theme.currentMode.tokens.colors.text, opacity: 0.6, fontSize: '12px', marginTop: '8px' }}>
            Max size: {formatFileSize(maxSize)}
          </div>
        )}
      </div>

      {files.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          {files.map(file => (
            <div
              key={file.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px',
                backgroundColor: theme.currentMode.tokens.colors.surface,
                borderRadius: '4px',
                marginBottom: '8px',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ color: theme.currentMode.tokens.colors.text, fontWeight: 'bold' }}>
                  {file.name}
                </div>
                <div style={{ color: theme.currentMode.tokens.colors.text, opacity: 0.6, fontSize: '12px' }}>
                  {formatFileSize(file.size)}
                </div>
                {showProgress && uploadProgress[file.name] !== undefined && (
                  <div style={{ marginTop: '8px' }}>
                    <div
                      style={{
                        width: '100%',
                        height: '4px',
                        backgroundColor: theme.currentMode.tokens.colors.border,
                        borderRadius: '2px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${uploadProgress[file.name]}%`,
                          height: '100%',
                          backgroundColor: theme.currentMode.tokens.colors.primary,
                          transition: 'width 0.2s',
                        }}
                      />
                    </div>
                    <div style={{ fontSize: '12px', color: theme.currentMode.tokens.colors.text, marginTop: '4px' }}>
                      {uploadProgress[file.name]}%
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile(file.name);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: theme.currentMode.tokens.colors.error,
                  cursor: 'pointer',
                  fontSize: '20px',
                  padding: '4px 8px',
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

