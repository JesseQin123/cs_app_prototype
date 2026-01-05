import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';

/**
 * MessageList Component
 *
 * Displays the conversation history with auto-scroll to bottom.
 */
function MessageList({ messages, isStreaming }) {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isStreaming]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4">💬</div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Start a Conversation
          </h3>
          <p className="text-gray-500 text-sm">
            Ask questions about campaigns, products, retailers, or any business data.
            I'll search our knowledge base and provide helpful answers.
          </p>
          <div className="mt-4 space-y-2 text-sm text-gray-400">
            <p>Try asking:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="bg-gray-100 px-3 py-1 rounded-full">"What Verragio campaigns are active?"</span>
              <span className="bg-gray-100 px-3 py-1 rounded-full">"Tell me about platinum retailers"</span>
              <span className="bg-gray-100 px-3 py-1 rounded-full">"What products are in the Couture collection?"</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 space-y-4"
    >
      {messages.map((message, index) => (
        <MessageBubble
          key={message.id || index}
          message={message}
          isLast={index === messages.length - 1}
        />
      ))}

      {/* Typing indicator when waiting for response */}
      {isStreaming && messages[messages.length - 1]?.role === 'user' && (
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <span className="text-indigo-600 text-sm">AI</span>
          </div>
          <div className="bg-gray-100 rounded-2xl px-4 py-3">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageList;
