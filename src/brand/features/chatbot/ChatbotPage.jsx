import React, { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, Search, MessageCircle, Plus, Send, Square, Loader2 } from 'lucide-react';
import { useVespaSearch } from './hooks/useVespaSearch';
import { useRAGChat } from './hooks/useRAGChat';
import ChatInput from './components/ChatInput';
import SearchOptions from './components/SearchOptions';
import SearchResults from './components/SearchResults';
import MessageList from './components/MessageList';
import ServiceStatus, { ServiceStatusBadge } from './components/ServiceStatus';

const ChatbotPage = () => {
  // Mode: 'chat' or 'search'
  const [mode, setMode] = useState('chat');
  const [chatInput, setChatInput] = useState('');
  const inputRef = useRef(null);

  // Search mode state
  const {
    query,
    filters,
    results,
    totalCount,
    isLoading: isSearching,
    error: searchError,
    serviceStatus,
    setQuery,
    setFilters,
    clearSearch,
    retrySearch,
    checkHealth,
  } = useVespaSearch();

  // Chat mode state
  const {
    messages,
    isStreaming,
    conversationId,
    error: chatError,
    sendMessage,
    cancelStream,
    clearConversation,
    retryLastMessage,
  } = useRAGChat();

  // Focus input when mode changes
  useEffect(() => {
    if (mode === 'chat' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [mode]);

  // Handle send message
  const handleSendMessage = () => {
    if (chatInput.trim() && !isStreaming) {
      sendMessage(chatInput);
      setChatInput('');
    }
  };

  // Handle key press in chat input
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50/30 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex-shrink-0 px-8 pt-8 pb-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-sm">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">AI Assistant</h1>
                <p className="text-sm text-gray-500">
                  {mode === 'chat' ? 'Ask questions about your brand data' : 'Search across your brand data'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ServiceStatusBadge status={serviceStatus} />
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="flex items-center gap-2 mb-4">
            <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-white">
              <button
                onClick={() => setMode('chat')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  mode === 'chat'
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                Chat
              </button>
              <button
                onClick={() => setMode('search')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  mode === 'search'
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>

            {/* New Chat button (Chat mode only) */}
            {mode === 'chat' && messages.length > 0 && (
              <button
                onClick={clearConversation}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Chat
              </button>
            )}
          </div>

          {/* Service Status Alert (only when offline) */}
          {serviceStatus === 'offline' && (
            <div className="mb-4">
              <ServiceStatus status={serviceStatus} onRetry={checkHealth} />
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {mode === 'search' ? (
        <>
          {/* Search Mode */}
          <div className="flex-shrink-0 px-8">
            <div className="max-w-4xl mx-auto">
              <ChatInput
                value={query}
                onChange={setQuery}
                onClear={clearSearch}
                isLoading={isSearching}
              />
            </div>
          </div>

          <div className="flex-shrink-0 border-y border-gray-100 mt-4">
            <div className="max-w-4xl mx-auto">
              <SearchOptions
                filters={filters}
                onFiltersChange={setFilters}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-6">
            <div className="max-w-4xl mx-auto">
              <SearchResults
                results={results}
                totalCount={totalCount}
                isLoading={isSearching}
                error={searchError}
                query={query}
                onRetry={retrySearch}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Chat Mode */}
          <div className="flex-1 overflow-hidden px-8">
            <div className="max-w-4xl mx-auto h-full">
              <MessageList
                messages={messages}
                isStreaming={isStreaming}
              />
            </div>
          </div>

          {/* Error display */}
          {chatError && (
            <div className="flex-shrink-0 px-8 pb-2">
              <div className="max-w-4xl mx-auto">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center justify-between">
                  <span className="text-sm text-red-700">{chatError}</span>
                  <button
                    onClick={retryLastMessage}
                    className="text-sm text-red-700 hover:text-red-900 font-medium"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Chat Input */}
          <div className="flex-shrink-0 px-8 pb-8 pt-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a question about campaigns, products, retailers..."
                    rows={1}
                    disabled={isStreaming}
                    className="w-full px-4 py-3 pr-12 bg-white border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all"
                    style={{
                      minHeight: '48px',
                      maxHeight: '200px'
                    }}
                    onInput={(e) => {
                      e.target.style.height = 'auto';
                      e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
                    }}
                  />
                </div>

                {isStreaming ? (
                  <button
                    onClick={cancelStream}
                    className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
                    title="Stop generating"
                  >
                    <Square className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim()}
                    className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
                    title="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                )}
              </div>

              <p className="text-xs text-gray-400 mt-2 text-center">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </div>
        </>
      )}

      {/* Footer Tips (Search mode, when no query) */}
      {mode === 'search' && !query && !isSearching && results.length === 0 && (
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
