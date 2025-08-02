// hooks/useApi.js
import { useState, useCallback, useRef } from 'react';
import apiClient from '../lib/api-client';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  // Generic API call function
  const callApi = useCallback(async (apiCall, options = {}) => {
    const {
      showLoading = true,
      clearError = true,
      retryCount = 0,
      retryDelay = 1000,
      onSuccess,
      onError,
    } = options;

    if (clearError) {
      setError(null);
    }

    if (showLoading) {
      setLoading(true);
    }

    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      const result = await apiCall(abortControllerRef.current.signal);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      // Don't set error if request was aborted
      if (err.name === 'AbortError') {
        return;
      }

      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);

      // Retry logic
      if (retryCount > 0) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return callApi(apiCall, { ...options, retryCount: retryCount - 1 });
      }

      if (onError) {
        onError(err);
      }

      throw err;
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, []);

  // Convenience methods for common HTTP operations
  const get = useCallback((url, options = {}) => {
    return callApi(
      (signal) => apiClient.get(url, { signal }),
      options
    );
  }, [callApi]);

  const post = useCallback((url, data, options = {}) => {
    return callApi(
      (signal) => apiClient.post(url, data, { signal }),
      options
    );
  }, [callApi]);

  const patch = useCallback((url, data, options = {}) => {
    return callApi(
      (signal) => apiClient.patch(url, data, { signal }),
      options
    );
  }, [callApi]);

  const del = useCallback((url, options = {}) => {
    return callApi(
      (signal) => apiClient.delete(url, { signal }),
      options
    );
  }, [callApi]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Abort current request
  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    loading,
    error,
    get,
    post,
    patch,
    delete: del,
    clearError,
    abort,
    callApi,
  };
}; 