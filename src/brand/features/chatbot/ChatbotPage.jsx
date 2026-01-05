import React from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { useVespaSearch } from './hooks/useVespaSearch';
import ChatInput from './components/ChatInput';
import SearchOptions from './components/SearchOptions';
import SearchResults from './components/SearchResults';
import ServiceStatus, { ServiceStatusBadge } from './components/ServiceStatus';

const ChatbotPage = () => {
  const {
    query,
    filters,
    results,
    totalCount,
    isLoading,
    error,
    serviceStatus,
    setQuery,
    setFilters,
    clearSearch,
    retrySearch,
    checkHealth,
  } = useVespaSearch();

  return (
    <div className="flex flex-col h-full bg-gray-50/30 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex-shrink-0 px-8 pt-8 pb-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-sm">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">AI Assistant</h1>
                <p className="text-sm text-gray-500">Search across your brand data</p>
              </div>
            </div>
            <ServiceStatusBadge status={serviceStatus} />
          </div>

          {/* Service Status Alert (only when offline) */}
          {serviceStatus === 'offline' && (
            <div className="mb-4">
              <ServiceStatus status={serviceStatus} onRetry={checkHealth} />
            </div>
          )}

          {/* Search Input */}
          <ChatInput
            value={query}
            onChange={setQuery}
            onClear={clearSearch}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Search Options */}
      <div className="flex-shrink-0 border-y border-gray-100">
        <div className="max-w-4xl mx-auto">
          <SearchOptions
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>
      </div>

      {/* Results Area */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-4xl mx-auto">
          <SearchResults
            results={results}
            totalCount={totalCount}
            isLoading={isLoading}
            error={error}
            query={query}
            onRetry={retrySearch}
          />
        </div>
      </div>

      {/* Footer Tips (when no query) */}
      {!query && !isLoading && results.length === 0 && (
        <div className="flex-shrink-0 px-8 pb-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl p-6 border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Search Tips</h3>
                  <ul className="text-sm text-gray-600 space-y-1.5">
                    <li>
                      <span className="font-medium">Text mode:</span> Best for specific keywords like "diamond ring" or "Verragio"
                    </li>
                    <li>
                      <span className="font-medium">Image mode:</span> Describe what you're looking for: "gold watch with blue dial"
                    </li>
                    <li>
                      <span className="font-medium">Hybrid mode:</span> Combines both for comprehensive results (recommended)
                    </li>
                    <li>
                      <span className="font-medium">Filter by type:</span> Narrow down to campaigns, products, or retailers
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotPage;
