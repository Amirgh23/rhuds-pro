import React, { ReactNode } from 'react';
import { ColdWarContextMenu } from './ColdWarContextMenu';
import { useColdWarContextMenu } from '../hooks/useColdWarContextMenu';

interface ColdWarPageWrapperProps {
  children: ReactNode;
}

export function ColdWarPageWrapper({ children }: ColdWarPageWrapperProps) {
  const { contextMenu, handleContextMenu, handleCloseContextMenu } = useColdWarContextMenu();

  return (
    <div
      onContextMenu={handleContextMenu}
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      {children}
      {contextMenu && (
        <ColdWarContextMenu x={contextMenu.x} y={contextMenu.y} onClose={handleCloseContextMenu} />
      )}
    </div>
  );
}
