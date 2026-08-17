import { useState, useEffect, useCallback, useRef } from 'react';

export const useFetch = (apiFunc, immediate = true, ...args) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  
  // Track parameters to prevent infinite loops if dependencies change
  const argsRef = useRef(args);
  useEffect(() => {
    argsRef.current = args;
  }, [args]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunc(...argsRef.current);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Something went wrong';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunc]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [fetchData, immediate]);

  return { data, setData, loading, error, refetch: fetchData };
};
