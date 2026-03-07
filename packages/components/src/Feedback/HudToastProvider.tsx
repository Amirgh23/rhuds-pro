/**
 * HudToastProvider Component
 * Toast notification system with HUD effects
 * Displays toasts at bottom-left with auto-dismiss
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { GradientAlert, AlertType } from './GradientAlert';

export interface ToastOptions {
  type?: AlertType;
  message: string;
  description?: string;
  duration?: number; // milliseconds, 0 = no auto-dismiss
}

interface Toast extends ToastOptions {
  id: string;
}

interface HudToastContextValue {
  showToast: (options: ToastOptions) => void;
  dismissToast: (id: string) => void;
}

const HudToastContext = createContext<HudToastContextValue | undefined>(undefined);

// Animations
const hudSlideIn = keyframes`
  0% {
    transform: translateX(-120%) translateY(20px);
    opacity: 0;
  }
  50% {
    transform: translateX(10px) translateY(0);
  }
  100% {
    transform: translateX(0) translateY(0);
    opacity: 1;
  }
`;

const hudSlideOut = keyframes`
  0% {
    transform: translateX(0) translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateX(-120%) translateY(20px);
    opacity: 0;
  }
`;

const hudGlitch = keyframes`
  0%, 100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-2px);
  }
  40% {
    transform: translateX(2px);
  }
  60% {
    transform: translateX(-2px);
  }
  80% {
    transform: translateX(2px);
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 10000;
  display: flex;
  flex-direction: column-reverse;
  gap: 12px;
  pointer-events: none;
  max-width: 420px;

  @media (max-width: 768px) {
    left: 10px;
    right: 10px;
    max-width: none;
  }
`;

const ToastWrapper = styled.div<{ $isExiting: boolean }>`
  pointer-events: auto;
  animation: ${props => props.$isExiting ? hudSlideOut : hudSlideIn} 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  animation-fill-mode: forwards;
  
  &:hover {
    animation: ${hudGlitch} 0.3s ease-in-out;
  }

  /* HUD scan line effect */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(41, 242, 223, 0.8), transparent);
    animation: hudScanLine 2s linear infinite;
    pointer-events: none;
    z-index: 1;
  }

  @keyframes hudScanLine {
    0% {
      transform: translateY(0);
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      transform: translateY(100px);
      opacity: 0;
    }
  }
`;

export interface HudToastProviderProps {
  children: React.ReactNode;
  maxToasts?: number;
}

export function HudToastProvider({ children, maxToasts = 5 }: HudToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [exitingToasts, setExitingToasts] = useState<Set<string>>(new Set());

  const dismissToast = useCallback((id: string) => {
    setExitingToasts(prev => new Set(prev).add(id));
    
    // Remove after animation completes
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
      setExitingToasts(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 500); // Match animation duration
  }, []);

  const showToast = useCallback((options: ToastOptions) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const duration = options.duration ?? 5000;

    const newToast: Toast = {
      ...options,
      id,
    };

    setToasts(prev => {
      const updated = [...prev, newToast];
      // Limit number of toasts
      if (updated.length > maxToasts) {
        const toRemove = updated[0];
        dismissToast(toRemove.id);
        return updated.slice(1);
      }
      return updated;
    });

    // Auto-dismiss
    if (duration > 0) {
      setTimeout(() => {
        dismissToast(id);
      }, duration);
    }
  }, [maxToasts, dismissToast]);

  return (
    <HudToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      <ToastContainer>
        {toasts.map(toast => (
          <ToastWrapper key={toast.id} $isExiting={exitingToasts.has(toast.id)}>
            <GradientAlert
              type={toast.type}
              message={toast.message}
              description={toast.description}
              onClose={() => dismissToast(toast.id)}
            />
          </ToastWrapper>
        ))}
      </ToastContainer>
    </HudToastContext.Provider>
  );
}

export function useHudToast() {
  const context = useContext(HudToastContext);
  if (!context) {
    throw new Error('useHudToast must be used within HudToastProvider');
  }
  return context;
}

export default HudToastProvider;
