import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, ChevronDown, ChevronUp, User, Bot, AlertCircle, BookOpen } from 'lucide-react';
import SourceDocuments from './SourceDocuments';

/**
 * MessageBubble Component
 *
 * Displays a single message with Markdown rendering and source documents.
 */
function MessageBubble({ message, isLast }) {
  const [copied, setCopied] = useState(false);
  const [showSources, setShowSources] = useState(true); // Default to showing sources

  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';
  const hasContent = message.content && message.content.length > 0;
  const hasSources = message.sources && message.sources.length > 0;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser ? 'bg-blue-500' : 'bg-indigo-100'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-indigo-600" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[75%]`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-800'
          } ${message.error ? 'border border-red-300 bg-red-50' : ''}`}
        >
          {/* Error indicator */}
          {message.error && (
            <div className="flex items-center gap-2 text-red-600 text-sm mb-2">
              <AlertCircle className="w-4 h-4" />
              <span>Error: {message.error}</span>
            </div>
          )}

          {/* Message content */}
          {hasContent ? (
            isUser ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
              <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-ol:my-1 prose-li:my-0">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              </div>
            )
          ) : message.isStreaming ? (
            <span className="inline-block w-2 h-4 bg-gray-400 animate-pulse rounded" />
          ) : null}

          {/* Streaming cursor */}
          {message.isStreaming && hasContent && (
            <span className="inline-block w-2 h-4 bg-gray-400 animate-pulse rounded ml-1" />
          )}
        </div>

        {/* Actions and metadata */}
        {isAssistant && hasContent && !message.isStreaming && (
          <div className="flex items-center gap-2 mt-1 px-1">
            {/* Copy button */}
            <button
              onClick={handleCopy}
              className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
              title="Copy response"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-green-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Sources/Citations toggle */}
            {hasSources && (
              <button
                onClick={() => setShowSources(!showSources)}
                className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full transition-colors ${
                  showSources
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                <BookOpen className="w-3 h-3" />
                <span>{message.sources.length} citations</span>
                {showSources ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
            )}

            {/* Timestamp */}
            <span className="text-xs text-gray-400">
              {formatTime(message.timestamp)}
            </span>
          </div>
        )}

        {/* User message timestamp */}
        {isUser && (
          <span className="text-xs text-gray-400 mt-1 px-1">
            {formatTime(message.timestamp)}
          </span>
        )}

        {/* Sources panel */}
        {isAssistant && showSources && hasSources && (
          <SourceDocuments documents={message.sources} />
        )}
      </div>
    </div>
  );
}

export default MessageBubble;
