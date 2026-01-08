/**
 * Chat Routes
 *
 * Handles RAG chatbot endpoints with streaming support.
 */

const express = require('express');
const router = express.Router();
const ragService = require('../services/ragService');
const conversationService = require('../services/conversationService');

/**
 * Filter documents to only include those that were actually referenced in the response
 * @param {Array} documents - Retrieved documents
 * @param {string} response - The LLM's response text
 * @returns {Array} - Filtered documents that were actually used
 */
function filterUsedDocuments(documents, response) {
  if (!documents || documents.length === 0 || !response) {
    return [];
  }

  const responseLower = response.toLowerCase();

  return documents.filter(doc => {
    // Check if the document title is mentioned in the response
    if (doc.title) {
      const titleWords = doc.title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
      // If at least 2 significant words from the title appear in the response
      const matchingWords = titleWords.filter(word => responseLower.includes(word));
      if (matchingWords.length >= Math.min(2, titleWords.length)) {
        return true;
      }
    }

    // Check if the document ID is mentioned
    if (doc.id && responseLower.includes(doc.id.toLowerCase())) {
      return true;
    }

    // For specific content types, check for key identifiers
    if (doc.content_type === 'campaign' || doc.content_type === 'product') {
      // Check for brand name mentions
      try {
        const metadata = doc.metadata ? JSON.parse(doc.metadata) : {};
        if (metadata.brandName && responseLower.includes(metadata.brandName.toLowerCase())) {
          // Also verify the specific item is mentioned
          if (doc.title && responseLower.includes(doc.title.toLowerCase().substring(0, 20))) {
            return true;
          }
        }
      } catch (e) {
        // Ignore JSON parse errors
      }
    }

    return false;
  });
}

/**
 * POST /api/chat
 *
 * Main chat endpoint with streaming response
 *
 * Request body:
 * {
 *   message: string,           // User's message
 *   conversationId?: string,   // Optional, creates new if missing
 *   options?: {
 *     model?: string,          // OpenAI model (default: gpt-4o)
 *     temperature?: number,    // 0-2 (default: 0.7)
 *     maxTokens?: number,      // Max response tokens (default: 1000)
 *     contentType?: string,    // Filter: all, campaign, product, etc.
 *     retrievalLimit?: number  // Number of docs to retrieve (default: 5)
 *   }
 * }
 *
 * Response: Server-Sent Events stream
 * - event: sources   → Retrieved documents
 * - event: token     → Individual tokens as they stream
 * - event: done      → Completion signal with conversation ID
 * - event: error     → Error message
 */
router.post('/', async (req, res) => {
  const { message, conversationId, options = {} } = req.body;

  // Validate request
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({
      error: 'Message is required',
      code: 'INVALID_MESSAGE'
    });
  }

  // Check OpenAI configuration
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      error: 'OpenAI API key not configured',
      code: 'MISSING_API_KEY'
    });
  }

  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering
  res.flushHeaders();

  try {
    // Get or create conversation
    const conversation = conversationService.getOrCreate(conversationId);
    console.log(`[Chat] Processing message in conversation: ${conversation.id}`);

    // Get conversation history for context
    const history = conversationService.getOpenAIMessages(conversation.id);

    // Process RAG query
    const { documents, streamCompletion } = await ragService.processQuery(
      message.trim(),
      history,
      {
        model: options.model,
        temperature: options.temperature,
        maxTokens: options.maxTokens,
        contentType: options.contentType,
        retrievalLimit: options.retrievalLimit,
        rankingProfile: options.rankingProfile || 'hybrid'
      }
    );

    // Add user message to history
    conversationService.addMessage(conversation.id, 'user', message.trim());

    // Stream OpenAI response
    let fullResponse = '';

    try {
      for await (const token of streamCompletion()) {
        fullResponse += token;
        res.write(`event: token\ndata: ${JSON.stringify({ token })}\n\n`);
      }
    } catch (streamError) {
      console.error('[Chat] Streaming error:', streamError.message);
      res.write(`event: error\ndata: ${JSON.stringify({
        error: 'Streaming failed',
        message: streamError.message
      })}\n\n`);
      res.end();
      return;
    }

    // Filter documents to only include those actually used in the response
    const usedDocuments = filterUsedDocuments(documents, fullResponse);
    console.log(`[Chat] Filtered citations: ${documents.length} retrieved -> ${usedDocuments.length} actually used`);

    // Send filtered sources AFTER response is complete (so we know which were actually used)
    res.write(`event: sources\ndata: ${JSON.stringify({ documents: usedDocuments })}\n\n`);

    // Add assistant response to history
    conversationService.addMessage(conversation.id, 'assistant', fullResponse, {
      sources: usedDocuments.map(d => d.id)
    });

    // Send completion signal
    res.write(`event: done\ndata: ${JSON.stringify({
      conversationId: conversation.id,
      messageCount: conversation.messages.length,
      citationsCount: usedDocuments.length
    })}\n\n`);

    res.end();
    console.log(`[Chat] Completed response (${fullResponse.length} chars)`);

  } catch (error) {
    console.error('[Chat] Error:', error);
    res.write(`event: error\ndata: ${JSON.stringify({
      error: 'Chat processing failed',
      message: error.message
    })}\n\n`);
    res.end();
  }
});

/**
 * POST /api/chat/simple
 *
 * Non-streaming chat endpoint (simpler for testing)
 */
router.post('/simple', async (req, res) => {
  const { message, conversationId, options = {} } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OpenAI API key not configured' });
  }

  try {
    const conversation = conversationService.getOrCreate(conversationId);
    const history = conversationService.getOpenAIMessages(conversation.id);

    const result = await ragService.query(message.trim(), history, options);

    // Update conversation history
    conversationService.addMessage(conversation.id, 'user', message.trim());
    conversationService.addMessage(conversation.id, 'assistant', result.answer, {
      sources: result.documents.map(d => d.id)
    });

    res.json({
      answer: result.answer,
      documents: result.documents,
      conversationId: conversation.id,
      usage: result.usage
    });

  } catch (error) {
    console.error('[Chat Simple] Error:', error);
    res.status(500).json({
      error: 'Chat failed',
      message: error.message
    });
  }
});

/**
 * GET /api/chat/conversation/:id
 *
 * Get conversation history
 */
router.get('/conversation/:id', (req, res) => {
  const { id } = req.params;
  const conversation = conversationService.get(id);

  if (!conversation) {
    return res.status(404).json({ error: 'Conversation not found' });
  }

  res.json({
    id: conversation.id,
    messages: conversation.messages,
    createdAt: conversation.createdAt,
    lastMessageAt: conversation.lastMessageAt
  });
});

/**
 * DELETE /api/chat/conversation/:id
 *
 * Delete a conversation (start fresh)
 */
router.delete('/conversation/:id', (req, res) => {
  const { id } = req.params;
  const deleted = conversationService.deleteConversation(id);

  if (!deleted) {
    return res.status(404).json({ error: 'Conversation not found' });
  }

  res.json({ success: true, message: 'Conversation deleted' });
});

/**
 * POST /api/chat/conversation/:id/clear
 *
 * Clear conversation messages but keep the ID
 */
router.post('/conversation/:id/clear', (req, res) => {
  const { id } = req.params;
  const cleared = conversationService.clearMessages(id);

  if (!cleared) {
    return res.status(404).json({ error: 'Conversation not found' });
  }

  res.json({ success: true, message: 'Conversation cleared' });
});

/**
 * GET /api/chat/stats
 *
 * Get chat service statistics
 */
router.get('/stats', (req, res) => {
  const stats = conversationService.getStats();
  res.json(stats);
});

module.exports = router;
