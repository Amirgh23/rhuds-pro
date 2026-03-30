/**
 * useChartData Hook
 * Manages chart data state
 */

import { useState, useCallback } from 'react';
import type { ChartData } from '../../engine/types/index';

export const useChartData = (initialData: ChartData) => {
  const [data, setData] = useState<ChartData>(initialData);

  const updateData = useCallback((newData: Partial<ChartData>) => {
    setData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  }, []);

  const addDataset = useCallback((dataset: any) => {
    setData((prevData) => ({
      ...prevData,
      datasets: [...(prevData.datasets || []), dataset],
    }));
  }, []);

  const removeDataset = useCallback((index: number) => {
    setData((prevData) => ({
      ...prevData,
      datasets: prevData.datasets?.filter((_, i) => i !== index) || [],
    }));
  }, []);

  const updateDataset = useCallback((index: number, dataset: Partial<any>) => {
    setData((prevData) => ({
      ...prevData,
      datasets: prevData.datasets?.map((d, i) => (i === index ? { ...d, ...dataset } : d)) || [],
    }));
  }, []);

  const resetData = useCallback(() => {
    setData(initialData);
  }, [initialData]);

  return {
    data,
    setData,
    updateData,
    addDataset,
    removeDataset,
    updateDataset,
    resetData,
  };
};

export default useChartData;
