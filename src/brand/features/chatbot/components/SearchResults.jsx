import React from 'react';
import { Search, RefreshCw, AlertCircle } from 'lucide-react';
import ResultCard from './ResultCard';

// Loading skeleton
function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="h-3 bg-gray-100 rounded w-1/4" />
              <div className="h-3 bg-gray-100 rounded w-full" />
              <div className="h-3 bg-gray-100 rounded w-3/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Empty state
function EmptyState({ hasQuery }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Search className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {hasQuery ? 'No results found' : 'Start searching'}
      </h3>
      <p className="text-sm text-gray-500 max-w-sm">
        {hasQuery
          ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
          : 'Search for campaigns, products, retailers, brands, and more.'}
      </p>
      {!hasQuery && (
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {['Verragio campaigns', 'diamond rings', 'platinum retailers', 'luxury watches'].map((suggestion) => (
            <span
              key={suggestion}
              className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-full cursor-pointer
                         hover:bg-gray-200 transition-colors"
            >
              {suggestion}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// Error state
function ErrorState({ error, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Something went wrong
      </h3>
      <p className="text-sm text-gray-500 max-w-sm mb-4">
        {error || 'An error occurred while searching. Please try again.'}
      </p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm
                   rounded-lg hover:bg-gray-800 transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        Try again
      </button>
    </div>
  );
}

export function SearchResults({
  results,
  totalCount,
  isLoading,
  error,
  query,
  onRetry,
}) {
  // Loading state
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }

  // Empty state
  if (!results || results.length === 0) {
    return <EmptyState hasQuery={!!query?.trim()} />;
  }

  // Results
  return (
    <div className="space-y-4">
      {/* Results count */}
      <div className="text-sm text-gray-500">
        Found <span className="font-medium text-gray-700">{totalCount}</span> results
        {query && (
          <span>
            {' '}for <span className="font-medium text-gray-700">"{query}"</span>
          </span>
        )}
      </div>

      {/* Results list */}
      <div className="space-y-3">
        {results.map((result, index) => (
          <ResultCard key={result.id || index} result={result} />
        ))}
      </div>

      {/* Load more indicator */}
      {results.length < totalCount && (
        <div className="text-center py-4">
          <span className="text-sm text-gray-500">
            Showing {results.length} of {totalCount} results
          </span>
        </div>
      )}
    </div>
  );
}

export default SearchResults;
