import React, { useState } from 'react';
import { Text } from '@rhuds/components';

interface DocViewerProps {
  title: string;
  content: string;
}

export const DocViewer: React.FC<DocViewerProps> = ({ title, content }) => {
  return (
    <div style={{
      padding: '2rem',
      background: 'rgba(41, 242, 223, 0.05)',
      ,
      border: '1px solid rgba(41, 242, 223, 0.3)',
      marginBottom: '2rem',
    }}>
      <Text variant="h3" style={{ marginBottom: '1rem', color: '#29F2DF' }}>
        {title}
      </Text>
      <div style={{
        fontSize: '0.95rem',
        lineHeight: '1.6',
        color: 'rgba(255, 255, 255, 0.8)',
        whiteSpace: 'pre-wrap',
      }}>
        {content}
      </div>
    </div>
  );
};
