import React, { useRef, useState, useCallback } from 'react';

export interface FileUploadProps {
  onFilesSelected?: (files: File[]) => void;
  onProgress?: (progress: number) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  onProgress,
  accept = '*',
  multiple = false,
  maxSize,
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const validateFiles = useCallback(
    (files: File[]): File[] => {
      return files.filter((file) => {
        if (maxSize && file.size > maxSize) return false;
        return true;
      });
    },
    [maxSize]
  );

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      const fileArray = Array.from(files);
      const validFiles = validateFiles(fileArray);

      setSelectedFiles(validFiles);
      onFilesSelected?.(validFiles);

      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
        }
        setUploadProgress(progress);
        onProgress?.(progress);
      }, 100);
    },
    [validateFiles, onFilesSelected, onProgress]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFileSelect(e.target.files);
    },
    [handleFileSelect]
  );

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        border: isDragging ? '2px solid #00ff00' : '2px dashed #666',
        borderRadius: '8px',
        padding: '20px',
        textAlign: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.3s ease',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleInputChange}
        disabled={disabled}
        style={{ display: 'none' }}
      />

      <button
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        style={{
          padding: '10px 20px',
          background: '#00ff00',
          color: '#000',
          border: 'none',
          borderRadius: '4px',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        Select Files
      </button>

      <p style={{ marginTop: '10px', color: '#aaa' }}>or drag and drop files here</p>

      {selectedFiles.length > 0 && (
        <div style={{ marginTop: '15px' }}>
          <p style={{ color: '#00ff00' }}>{selectedFiles.length} file(s) selected</p>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div
              style={{
                width: '100%',
                height: '4px',
                background: '#333',
                borderRadius: '2px',
                overflow: 'hidden',
                marginTop: '10px',
              }}
            >
              <div
                style={{
                  width: `${uploadProgress}%`,
                  height: '100%',
                  background: '#00ff00',
                  transition: 'width 0.1s ease',
                }}
              />
            </div>
          )}
          {uploadProgress === 100 && (
            <p style={{ color: '#00ff00', marginTop: '10px' }}>Upload complete!</p>
          )}
        </div>
      )}
    </div>
  );
};
