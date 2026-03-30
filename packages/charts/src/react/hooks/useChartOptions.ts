/**
 * useChartOptions Hook
 * Manages chart options state
 */

import { useState, useCallback } from 'react';
import type { ChartOptions } from '../../engine/types/index';

export const useChartOptions = (initialOptions: Partial<ChartOptions> = {}) => {
  const [options, setOptions] = useState<Partial<ChartOptions>>(initialOptions);

  const updateOptions = useCallback((newOptions: Partial<ChartOptions>) => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      ...newOptions,
    }));
  }, []);

  const updateAnimationOptions = useCallback((animationOptions: any) => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      animation: {
        ...prevOptions.animation,
        ...animationOptions,
      },
    }));
  }, []);

  const updatePluginOptions = useCallback((pluginId: string, pluginOptions: any) => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      plugins: {
        ...prevOptions.plugins,
        [pluginId]: {
          ...(prevOptions.plugins?.[pluginId] as any),
          ...pluginOptions,
        },
      },
    }));
  }, []);

  const resetOptions = useCallback(() => {
    setOptions(initialOptions);
  }, [initialOptions]);

  return {
    options,
    setOptions,
    updateOptions,
    updateAnimationOptions,
    updatePluginOptions,
    resetOptions,
  };
};

export default useChartOptions;
