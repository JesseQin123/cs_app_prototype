/**
 * Conversation Service
 *
 * Manages multi-turn conversation history for RAG chatbot.
 * Uses in-memory storage (can be replaced with Redis/DB for production).
 */

const { v4: uuidv4 } = require('uuid');

// In-memory conversation storage
// Structure: { conversationId: { messages: [], createdAt, lastMessageAt } }
const conversations = new Map();

// Configuration
const MAX_HISTORY_MESSAGES = 20; // Keep last 20 messages per conversation
const CONVERSATION_TTL = 60 * 60 * 1000; // 1 hour TTL

/**
 * Create a new conversation
 */
function createConversation() {
  const id = uuidv4();
  const conversation = {
    id,
    messages: [],
    createdAt: Date.now(),
    lastMessageAt: Date.now()
  };
  conversations.set(id, conversation);
  return conversation;
}

/**
 * Get conversation by ID, or create new if not found
 */
function getOrCreate(conversationId) {
  if (conversationId && conversations.has(conversationId)) {
    const conversation = conversations.get(conversationId);
    conversation.lastMessageAt = Date.now();
    return conversation;
  }
  return createConversation();
}

/**
 * Get conversation by ID
 */
function get(conversationId) {
  return conversations.get(conversationId) || null;
}

/**
 * Add a message to conversation history
 */
function addMessage(conversationId, role, content, metadata = {}) {
  const conversation = conversations.get(conversationId);
  if (!conversation) {
    console.error(`Conversation not found: ${conversationId}`);
    return null;
  }

  const message = {
    id: uuidv4(),
    role, // 'user' | 'assistant' | 'system'
    content,
    timestamp: Date.now(),
    ...metadata
  };

  conversation.messages.push(message);
  conversation.lastMessageAt = Date.now();

  // Prune old messages if exceeding limit
  if (conversation.messages.length > MAX_HISTORY_MESSAGES) {
    // Keep system messages and last N messages
    const systemMessages = conversation.messages.filter(m => m.role === 'system');
    const nonSystemMessages = conversation.messages.filter(m => m.role !== 'system');
    const recentMessages = nonSystemMessages.slice(-MAX_HISTORY_MESSAGES);
    conversation.messages = [...systemMessages, ...recentMessages];
  }

  return message;
}

/**
 * Get conversation history formatted for OpenAI API
 */
function getOpenAIMessages(conversationId) {
  const conversation = conversations.get(conversationId);
  if (!conversation) {
    return [];
  }

  return conversation.messages.map(msg => ({
    role: msg.role,
    content: msg.content
  }));
}

/**
 * Clear a conversation's messages (start fresh)
 */
function clearMessages(conversationId) {
  const conversation = conversations.get(conversationId);
  if (conversation) {
    conversation.messages = [];
    conversation.lastMessageAt = Date.now();
    return true;
  }
  return false;
}

/**
 * Delete a conversation entirely
 */
function deleteConversation(conversationId) {
  return conversations.delete(conversationId);
}

/**
 * Cleanup old conversations (run periodically)
 */
function cleanupOldConversations() {
  const now = Date.now();
  let cleaned = 0;

  for (const [id, conversation] of conversations.entries()) {
    if (now - conversation.lastMessageAt > CONVERSATION_TTL) {
      conversations.delete(id);
      cleaned++;
    }
  }

  if (cleaned > 0) {
    console.log(`Cleaned up ${cleaned} expired conversations`);
  }

  return cleaned;
}

/**
 * Get statistics about active conversations
 */
function getStats() {
  return {
    activeConversations: conversations.size,
    totalMessages: Array.from(conversations.values())
      .reduce((sum, c) => sum + c.messages.length, 0)
  };
}

// Run cleanup every 10 minutes
setInterval(cleanupOldConversations, 10 * 60 * 1000);

module.exports = {
  createConversation,
  getOrCreate,
  get,
  addMessage,
  getOpenAIMessages,
  clearMessages,
  deleteConversation,
  cleanupOldConversations,
  getStats
};
