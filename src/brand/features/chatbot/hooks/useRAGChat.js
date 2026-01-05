import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * useRAGChat Hook
 *
 * Manages RAG chatbot state and handles streaming responses.
 */

const DEFAULT_OPTIONS = {
  model: 'gpt-4o',
  temperature: 0.7,
  maxTokens: 1000,
  contentType: 'all',
  retrievalLimit: 5
};

export function useRAGChat(initialOptions = {}) {
  // State
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [conversationId, setConversationId] = useState(() => {
    // Try to restore conversation ID from session storage
    return sessionStorage.getItem('rag-conversation-id') || null;
  });
  const [error, setError] = useState(null);
  const [options, setOptions] = useState({ ...DEFAULT_OPTIONS, ...initialOptions });

  // Refs for cleanup
  const abortControllerRef = useRef(null);

  // Persist conversation ID to session storage
  useEffect(() => {
    if (conversationId) {
      sessionStorage.setItem('rag-conversation-id', conversationId);
    }
  }, [conversationId]);

  /**
   * Send a message and stream the response
   */
  const sendMessage = useCallback(async (userMessage) => {
    if (!userMessage.trim() || isStreaming) return;

    // Clear any previous errors
    setError(null);

    // Add user message to UI immediately
    const userMessageObj = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage.trim(),
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMessageObj]);

    // Create placeholder for assistant message
    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      sources: [],
      timestamp: Date.now(),
      isStreaming: true
    };
    setMessages(prev => [...prev, assistantMessage]);
    setIsStreaming(true);

    // Create abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.trim(),
          conversationId,
          options: {
            model: options.model,
            temperature: options.temperature,
            maxTokens: options.maxTokens,
            contentType: options.contentType,
            retrievalLimit: options.retrievalLimit
          }
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed: ${response.status}`);
      }

      // Process SSE stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || ''; // Keep incomplete chunk

        for (const line of lines) {
          if (!line.trim()) continue;

          // Parse SSE event
          const eventMatch = line.match(/^event: (\w+)/);
          const dataMatch = line.match(/data: (.+)$/m);

          if (eventMatch && dataMatch) {
            const event = eventMatch[1];
            try {
              const data = JSON.parse(dataMatch[1]);

              switch (event) {
                case 'token':
                  // Append token to assistant message
                  setMessages(prev => {
                    const updated = [...prev];
                    const lastMsg = updated[updated.length - 1];
                    if (lastMsg.id === assistantMessageId) {
                      lastMsg.content += data.token;
                    }
                    return updated;
                  });
                  break;

                case 'sources':
                  // Update sources
                  setMessages(prev => {
                    const updated = [...prev];
                    const lastMsg = updated[updated.length - 1];
                    if (lastMsg.id === assistantMessageId) {
                      lastMsg.sources = data.documents || [];
                    }
                    return updated;
                  });
                  break;

                case 'done':
                  // Mark message as complete and save conversation ID
                  setConversationId(data.conversationId);
                  setMessages(prev => {
                    const updated = [...prev];
                    const lastMsg = updated[updated.length - 1];
                    if (lastMsg.id === assistantMessageId) {
                      lastMsg.isStreaming = false;
                    }
                    return updated;
                  });
                  break;

                case 'error':
                  throw new Error(data.message || data.error || 'Stream error');
              }
            } catch (parseError) {
              console.error('Failed to parse SSE data:', parseError);
            }
          }
        }
      }

    } catch (err) {
      if (err.name === 'AbortError') {
        // Request was cancelled, that's fine
        console.log('Request cancelled');
      } else {
        console.error('Chat error:', err);
        setError(err.message);

        // Remove the empty assistant message on error
        setMessages(prev => {
          const updated = [...prev];
          if (updated[updated.length - 1]?.id === assistantMessageId && !updated[updated.length - 1].content) {
            updated.pop();
          } else if (updated[updated.length - 1]?.id === assistantMessageId) {
            // Mark as error but keep partial content
            updated[updated.length - 1].isStreaming = false;
            updated[updated.length - 1].error = err.message;
          }
          return updated;
        });
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  }, [conversationId, options, isStreaming]);

  /**
   * Cancel the current streaming request
   */
  const cancelStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  /**
   * Clear the conversation and start fresh
   */
  const clearConversation = useCallback(() => {
    cancelStream();
    setMessages([]);
    setConversationId(null);
    setError(null);
    sessionStorage.removeItem('rag-conversation-id');
  }, [cancelStream]);

  /**
   * Retry the last message
   */
  const retryLastMessage = useCallback(() => {
    if (messages.length < 2) return;

    // Find the last user message
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (!lastUserMessage) return;

    // Remove the last assistant message (which failed)
    setMessages(prev => {
      const updated = [...prev];
      if (updated[updated.length - 1]?.role === 'assistant') {
        updated.pop();
      }
      // Also remove the user message we're about to retry
      if (updated[updated.length - 1]?.role === 'user') {
        updated.pop();
      }
      return updated;
    });

    setError(null);

    // Resend
    sendMessage(lastUserMessage.content);
  }, [messages, sendMessage]);

  /**
   * Update chat options
   */
  const updateOptions = useCallback((newOptions) => {
    setOptions(prev => ({ ...prev, ...newOptions }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    // State
    messages,
    isStreaming,
    conversationId,
    error,
    options,

    // Actions
    sendMessage,
    cancelStream,
    clearConversation,
    retryLastMessage,
    updateOptions,

    // Computed
    hasMessages: messages.length > 0
  };
}

export default useRAGChat;
