import React, { useRef, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';

export function ChatInput({
  value,
  onChange,
  onClear,
  isLoading,
  placeholder = 'Search campaigns, products, retailers...',
}) {
  const inputRef = useRef(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleClear = () => {
    onClear();
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    // Clear on Escape
    if (e.key === 'Escape' && value) {
      handleClear();
    }
  };

  return (
    <div className="relative">
      {/* Search Icon / Loading Spinner */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        {isLoading ? (
          <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
        ) : (
          <Search className="w-5 h-5 text-gray-400" />
        )}
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200
                   rounded-xl text-gray-900 placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300
                   transition-all duration-200"
      />

      {/* Clear Button */}
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2
                     p-1 rounded-full text-gray-400 hover:text-gray-600
                     hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export default ChatInput;
