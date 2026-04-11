import { useState, useEffect, useCallback, DependencyList } from 'react';

/**
 * Return type for useAsync hook
 * @template T - The type of data returned by the async function
 */
export interface UseAsyncReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: () => Promise<void>;
}

/**
 * Hook for handling async operations
 * @template T - The type of data returned by the async function
 * @param asyncFunction - The async function to execute
 * @param dependencies - Dependency list for the effect (default: [])
 * @returns Object containing data, loading state, error, and execute function
 */
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  dependencies: DependencyList = []
): UseAsyncReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await asyncFunction();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, loading, error, execute };
}
