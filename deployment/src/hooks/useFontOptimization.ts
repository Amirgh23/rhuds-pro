import { useEffect } from 'react';
import { initializeFontOptimization } from '../config/font-optimization';

/**
 * Hook to initialize font optimization
 * Loads secondary fonts on idle for better performance
 */
export const useFontOptimization = (): void => {
  useEffect(() => {
    // Initialize font optimization on component mount
    initializeFontOptimization();
  }, []);
};
