/**
 * RAG Service
 *
 * Orchestrates Retrieval-Augmented Generation:
 * 1. Retrieve relevant documents from Vespa
 * 2. Build context-aware prompts
 * 3. Stream responses from OpenAI
 */

const OpenAI = require('openai');
const axios = require('axios');

// Configuration
const VESPA_URL = process.env.VESPA_URL || 'http://127.0.0.1:8080';
const EMBEDDING_SERVICE_URL = process.env.EMBEDDING_SERVICE_URL || 'http://127.0.0.1:5000';
const DEFAULT_RETRIEVAL_LIMIT = 5;
const DEFAULT_MODEL = 'gpt-4o';
const DEFAULT_TEMPERATURE = 0.7;
const DEFAULT_MAX_TOKENS = 1000;

// Initialize OpenAI client
let openai = null;

function initOpenAI() {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  return openai;
}

/**
 * Build system prompt with retrieved context
 */
function buildSystemPrompt(documents) {
  const contextParts = documents.map((doc, i) => {
    const contentType = doc.content_type?.toUpperCase() || 'DOCUMENT';
    const title = doc.title || 'Untitled';
    const body = doc.body || '';

    return `[${i + 1}. ${contentType}] ${title}
${body.substring(0, 500)}${body.length > 500 ? '...' : ''}`;
  });

  const context = contextParts.join('\n\n---\n\n');

  return `You are a helpful AI assistant for CrownSync, a brand management platform that connects luxury brands with retailers.

Your role is to help brand administrators find information about campaigns, products, retailers, and other business data.

## Retrieved Context
The following documents were retrieved based on the user's question:

${context}

## Guidelines
- Answer based on the provided context when relevant information is available
- If the context doesn't contain relevant information, acknowledge this and provide general guidance
- Be concise but thorough in your responses
- Reference specific campaigns, products, retailers, or brands when applicable
- Use professional but friendly language
- If asked about data that requires live system access, explain that you're working with indexed data

## Response Format
- Use markdown formatting for better readability
- Use bullet points for lists
- Bold important terms or names
- Keep paragraphs short`;
}

/**
 * Retrieve relevant documents from Vespa
 */
async function retrieveContext(query, options = {}) {
  const {
    limit = DEFAULT_RETRIEVAL_LIMIT,
    contentType = 'all',
    rankingProfile = 'hybrid'
  } = options;

  try {
    console.log(`[RAG] Retrieving context for: "${query}" (limit: ${limit}, type: ${contentType})`);

    const params = {
      hits: limit,
      ranking: rankingProfile,
      timeout: '10s'
    };

    let yql;

    // Try hybrid search with embeddings
    if (rankingProfile === 'hybrid' || rankingProfile === 'image_search') {
      try {
        // Generate text embedding
        const embeddingResponse = await axios.post(
          `${EMBEDDING_SERVICE_URL}/embed_text`,
          { text: query },
          { timeout: 5000 }
        );

        if (embeddingResponse.data.success) {
          params['input.query(text_embedding)'] = JSON.stringify(embeddingResponse.data.embedding);
          yql = `select * from multimodal where ({targetHits: ${limit}}nearestNeighbor(image_embedding, text_embedding)) or userQuery()`;
          params.query = query;
        }
      } catch (embeddingError) {
        console.warn('[RAG] Embedding generation failed, falling back to text search:', embeddingError.message);
      }
    }

    // Fallback to text search
    if (!yql) {
      yql = `select * from multimodal where userQuery()`;
      params.query = query;
    }

    // Add content type filter if specified
    if (contentType !== 'all') {
      yql += ` and content_type contains "${contentType}"`;
    }

    params.yql = yql;

    const response = await axios.post(
      `${VESPA_URL}/search/`,
      null,
      { params }
    );

    const documents = (response.data.root.children || []).map(hit => ({
      id: hit.fields.id,
      content_type: hit.fields.content_type,
      relevance: hit.relevance,
      title: hit.fields.title,
      body: hit.fields.body,
      url: hit.fields.url,
      image_file_name: hit.fields.image_file_name,
      created_at: hit.fields.created_at
    }));

    console.log(`[RAG] Retrieved ${documents.length} documents`);
    return documents;

  } catch (error) {
    console.error('[RAG] Context retrieval failed:', error.message);
    return [];
  }
}

/**
 * Build messages array for OpenAI API
 */
function buildMessages(systemPrompt, conversationHistory, userMessage) {
  const messages = [
    { role: 'system', content: systemPrompt }
  ];

  // Add conversation history (skip system messages from history)
  for (const msg of conversationHistory) {
    if (msg.role !== 'system') {
      messages.push({
        role: msg.role,
        content: msg.content
      });
    }
  }

  // Add current user message
  messages.push({
    role: 'user',
    content: userMessage
  });

  return messages;
}

/**
 * Stream chat completion from OpenAI
 * Returns an async generator that yields tokens
 */
async function* streamCompletion(messages, options = {}) {
  const client = initOpenAI();

  if (!client) {
    throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.');
  }

  const {
    model = DEFAULT_MODEL,
    temperature = DEFAULT_TEMPERATURE,
    maxTokens = DEFAULT_MAX_TOKENS
  } = options;

  console.log(`[RAG] Streaming completion with ${model} (temp: ${temperature})`);

  const stream = await client.chat.completions.create({
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
    stream: true
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      yield content;
    }
  }
}

/**
 * Process a RAG query
 * Main entry point for the RAG pipeline
 */
async function processQuery(query, conversationHistory = [], options = {}) {
  // 1. Retrieve relevant documents
  const documents = await retrieveContext(query, {
    limit: options.retrievalLimit || DEFAULT_RETRIEVAL_LIMIT,
    contentType: options.contentType || 'all',
    rankingProfile: options.rankingProfile || 'hybrid'
  });

  // 2. Build system prompt with context
  const systemPrompt = buildSystemPrompt(documents);

  // 3. Build complete messages array
  const messages = buildMessages(systemPrompt, conversationHistory, query);

  // 4. Return data needed for streaming
  return {
    documents,
    messages,
    streamCompletion: () => streamCompletion(messages, {
      model: options.model || DEFAULT_MODEL,
      temperature: options.temperature || DEFAULT_TEMPERATURE,
      maxTokens: options.maxTokens || DEFAULT_MAX_TOKENS
    })
  };
}

/**
 * Non-streaming query (for testing/simple use cases)
 */
async function query(queryText, conversationHistory = [], options = {}) {
  const { documents, messages } = await processQuery(queryText, conversationHistory, options);

  const client = initOpenAI();
  if (!client) {
    throw new Error('OpenAI API key not configured');
  }

  const completion = await client.chat.completions.create({
    model: options.model || DEFAULT_MODEL,
    messages,
    temperature: options.temperature || DEFAULT_TEMPERATURE,
    max_tokens: options.maxTokens || DEFAULT_MAX_TOKENS
  });

  return {
    answer: completion.choices[0].message.content,
    documents,
    usage: completion.usage
  };
}

module.exports = {
  retrieveContext,
  buildSystemPrompt,
  buildMessages,
  streamCompletion,
  processQuery,
  query,
  initOpenAI
};
