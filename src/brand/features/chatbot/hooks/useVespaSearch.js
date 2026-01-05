import { useState, useCallback, useRef, useEffect } from 'react';

const DEBOUNCE_DELAY = 300;

const defaultFilters = {
  content_type: 'all',
  ranking_profile: 'hybrid',
  limit: 20,
};

export function useVespaSearch() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState(defaultFilters);
  const [results, setResults] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [serviceStatus, setServiceStatus] = useState('unknown'); // 'online' | 'offline' | 'unknown'

  const debounceRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Check service health
  const checkHealth = useCallback(async () => {
    try {
      const response = await fetch('/api/health', {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        setServiceStatus('online');
        return true;
      } else {
        setServiceStatus('offline');
        return false;
      }
    } catch {
      setServiceStatus('offline');
      return false;
    }
  }, []);

  // Check health on mount
  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  // Perform search
  const performSearch = useCallback(async (searchQuery, searchFilters) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setTotalCount(0);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          content_type: searchFilters.content_type,
          ranking_profile: searchFilters.ranking_profile,
          limit: searchFilters.limit,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data = await response.json();

      setResults(data.hits || []);
      setTotalCount(data.total_count || 0);
      setServiceStatus('online');
    } catch (err) {
      if (err.name === 'AbortError') {
        return; // Ignore aborted requests
      }

      console.error('Search error:', err);
      setError(err.message || 'Search failed. Please try again.');
      setResults([]);
      setTotalCount(0);

      // Check if service went offline
      if (err.message?.includes('fetch') || err.name === 'TypeError') {
        setServiceStatus('offline');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search trigger
  const triggerSearch = useCallback((searchQuery, searchFilters) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      performSearch(searchQuery, searchFilters);
    }, DEBOUNCE_DELAY);
  }, [performSearch]);

  // Update query with debounced search
  const updateQuery = useCallback((newQuery) => {
    setQuery(newQuery);
    triggerSearch(newQuery, filters);
  }, [filters, triggerSearch]);

  // Update filters and re-search
  const updateFilters = useCallback((newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);

    if (query.trim()) {
      performSearch(query, updatedFilters);
    }
  }, [filters, query, performSearch]);

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setTotalCount(0);
    setError(null);
  }, []);

  // Retry search
  const retrySearch = useCallback(() => {
    if (query.trim()) {
      performSearch(query, filters);
    }
  }, [query, filters, performSearch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    query,
    filters,
    results,
    totalCount,
    isLoading,
    error,
    serviceStatus,
    setQuery: updateQuery,
    setFilters: updateFilters,
    clearSearch,
    retrySearch,
    checkHealth,
  };
}

export default useVespaSearch;
