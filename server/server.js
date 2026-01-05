// Load environment variables
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const cors = require('cors');
const FormData = require('form-data');

// Import routes
const chatRoutes = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 3003; // Default port for CrownSync integration
const VESPA_URL = process.env.VESPA_URL || 'http://127.0.0.1:8080';
const EMBEDDING_SERVICE_URL = process.env.EMBEDDING_SERVICE_URL || 'http://127.0.0.1:5000';
const MAX_BODY_SIZE = 500000; // 500KB max for body text

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Mount chat routes
app.use('/api/chat', chatRoutes);

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB file size limit
  }
});

// ============================================
// HELPER FUNCTIONS
// ============================================

// Extract text from different file types
async function extractText(filePath, fileType) {
  try {
    if (fileType === 'application/pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const options = {
        max: 0,
        version: 'default'
      };
      const data = await pdfParse(dataBuffer, options);
      return data.text;
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } else if (fileType === 'text/plain') {
      return fs.readFileSync(filePath, 'utf8');
    } else {
      throw new Error('Unsupported file type');
    }
  } catch (error) {
    console.error('Error extracting text:', error);
    throw error;
  }
}

// Truncate text to fit within Vespa limits
function truncateText(text, maxLength = MAX_BODY_SIZE) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '... [truncated]';
}

// Generate unique document ID
function generateDocId() {
  return 'doc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// ============================================
// API ROUTES
// ============================================

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const vespaHealth = await axios.get(`${VESPA_URL}/state/v1/health`);
    let embeddingHealth = { status: 'not_checked' };

    try {
      embeddingHealth = await axios.get(`${EMBEDDING_SERVICE_URL}/health`, { timeout: 2000 });
    } catch (err) {
      embeddingHealth = { status: 'offline', error: err.message };
    }

    res.json({
      status: 'ok',
      vespa: vespaHealth.data,
      embedding_service: embeddingHealth.data || embeddingHealth
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
});

// Search endpoint - handles both text and image search
app.post('/api/search', async (req, res) => {
  try {
    const { query, content_type = 'all', limit = 20, ranking_profile = 'text_search' } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    console.log(`Searching for: "${query}" (type: ${content_type}, profile: ${ranking_profile})`);

    let yql;
    const params = {
      hits: limit,
      ranking: ranking_profile,
      timeout: '10s'
    };

    // For image search and hybrid, generate text embedding
    if (ranking_profile === 'image_search' || ranking_profile === 'hybrid') {
      try {
        console.log(`Generating text embedding for ${ranking_profile}...`);

        // Call embedding service to convert text to CLIP embedding
        const embeddingResponse = await axios.post(
          `${EMBEDDING_SERVICE_URL}/embed_text`,
          { text: query },
          { timeout: 5000 }
        );

        if (!embeddingResponse.data.success) {
          throw new Error('Text embedding generation failed');
        }

        const embedding = embeddingResponse.data.embedding;
        console.log(`Generated ${embedding.length}-dimensional embedding`);

        // Pass the text embedding as query tensor
        params['input.query(text_embedding)'] = JSON.stringify(embedding);

        // Build query based on ranking profile
        if (ranking_profile === 'image_search') {
          // Pure vector search
          if (content_type === 'image' || content_type === 'all') {
            yql = `select * from multimodal where ({targetHits: ${limit}}nearestNeighbor(image_embedding, text_embedding))`;
            if (content_type === 'image') {
              yql += ` and content_type contains "image"`;
            }
          } else {
            // Shouldn't happen, but fallback
            yql = `select * from multimodal where userQuery()`;
            params.query = query;
          }
        } else {
          // Hybrid search - combine text and vector search
          // Use nearestNeighbor for images and userQuery for text matching
          yql = `select * from multimodal where ({targetHits: ${limit}}nearestNeighbor(image_embedding, text_embedding)) or userQuery()`;
          if (content_type !== 'all') {
            yql += ` and content_type contains "${content_type}"`;
          }
          params.query = query;
        }

      } catch (err) {
        console.warn('Embedding generation failed:', err.message);
        console.warn('Falling back to text search');

        // Fallback to text search
        if (content_type !== 'all') {
          yql = `select * from multimodal where userQuery() and content_type contains "${content_type}"`;
        } else {
          yql = `select * from multimodal where userQuery()`;
        }
        params.query = query;
      }
    } else {
      // Text search only
      if (content_type !== 'all') {
        yql = `select * from multimodal where userQuery() and content_type contains "${content_type}"`;
      } else {
        yql = `select * from multimodal where userQuery()`;
      }
      params.query = query;
    }

    params.yql = yql;

    const response = await axios.post(
      `${VESPA_URL}/search/`,
      null,
      { params }
    );

    const results = {
      total_count: response.data.root.fields?.totalCount || response.data.root.children?.length || 0,
      hits: (response.data.root.children || []).map(hit => ({
        id: hit.fields.id,
        content_type: hit.fields.content_type,
        relevance: hit.relevance,
        title: hit.fields.title,
        body: hit.fields.body,
        url: hit.fields.url,
        image_file_name: hit.fields.image_file_name,
        created_at: hit.fields.created_at
      }))
    };

    res.json(results);
  } catch (error) {
    console.error('Search error:', error.message);
    res.status(500).json({
      error: 'Search failed',
      message: error.message,
      details: error.response?.data || error.message
    });
  }
});

// Upload text document
app.post('/api/upload/text', upload.single('file'), async (req, res) => {
  try {
    const { title, url } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    console.log('Processing text file:', file.originalname);

    // Extract text from file
    const text = await extractText(file.path, file.mimetype);
    const truncatedText = truncateText(text);

    // Create Vespa document
    const docId = generateDocId();
    const document = {
      fields: {
        id: docId,
        content_type: 'text',
        title: title || file.originalname,
        body: truncatedText,
        url: url || '',
        created_at: Date.now()
      }
    };

    // Feed to Vespa
    const vespaResponse = await axios.post(
      `${VESPA_URL}/document/v1/multimodal/multimodal/docid/${docId}`,
      document
    );

    // Clean up uploaded file
    fs.unlinkSync(file.path);

    res.json({
      success: true,
      document_id: docId,
      title: document.fields.title,
      body_length: truncatedText.length,
      vespa_response: vespaResponse.data
    });
  } catch (error) {
    console.error('Upload text error:', error);
    res.status(500).json({
      error: 'Upload failed',
      message: error.message
    });
  }
});

// Upload image
app.post('/api/upload/image', upload.single('file'), async (req, res) => {
  try {
    const { title } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    if (!file.mimetype.startsWith('image/')) {
      fs.unlinkSync(file.path);
      return res.status(400).json({ error: 'File must be an image' });
    }

    console.log('Processing image file:', file.originalname);

    // Generate embedding using Python service
    const formData = new FormData();
    formData.append('image', fs.createReadStream(file.path));

    const embeddingResponse = await axios.post(
      `${EMBEDDING_SERVICE_URL}/embed`,
      formData,
      {
        headers: formData.getHeaders(),
        timeout: 30000 // 30 second timeout for embedding generation
      }
    );

    if (!embeddingResponse.data.success) {
      throw new Error('Embedding generation failed');
    }

    // Create Vespa document
    const docId = generateDocId();
    const embedding = embeddingResponse.data.embedding;

    // Format embedding as Vespa tensor
    const tensorValues = {};
    for (let i = 0; i < embedding.length; i++) {
      tensorValues[`${i}`] = embedding[i];
    }

    const document = {
      fields: {
        id: docId,
        content_type: 'image',
        title: title || file.originalname,
        image_file_name: file.filename,
        image_embedding: {
          type: 'tensor<float>(x[512])',
          values: tensorValues
        },
        created_at: Date.now()
      }
    };

    // Feed to Vespa
    const vespaResponse = await axios.post(
      `${VESPA_URL}/document/v1/multimodal/multimodal/docid/${docId}`,
      document
    );

    res.json({
      success: true,
      document_id: docId,
      filename: file.filename,
      title: document.fields.title,
      embedding_dimension: embedding.length,
      vespa_response: vespaResponse.data
    });
  } catch (error) {
    console.error('Upload image error:', error);

    // Clean up file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      error: 'Upload failed',
      message: error.message
    });
  }
});

// Get document by ID
app.get('/api/document/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const response = await axios.get(
      `${VESPA_URL}/document/v1/multimodal/multimodal/docid/${id}`
    );

    res.json(response.data);
  } catch (error) {
    if (error.response?.status === 404) {
      res.status(404).json({ error: 'Document not found' });
    } else {
      res.status(500).json({
        error: 'Failed to retrieve document',
        message: error.message
      });
    }
  }
});

// Get indexing statistics
app.get('/api/stats', async (req, res) => {
  try {
    // Query for counts by content type
    const textCount = await axios.post(
      `${VESPA_URL}/search/`,
      null,
      {
        params: {
          yql: 'select * from multimodal where content_type contains "text"',
          hits: 0
        }
      }
    );

    const imageCount = await axios.post(
      `${VESPA_URL}/search/`,
      null,
      {
        params: {
          yql: 'select * from multimodal where content_type contains "image"',
          hits: 0
        }
      }
    );

    res.json({
      text_documents: textCount.data.root.fields?.totalCount || 0,
      images: imageCount.data.root.fields?.totalCount || 0,
      total: (textCount.data.root.fields?.totalCount || 0) + (imageCount.data.root.fields?.totalCount || 0)
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to retrieve stats',
      message: error.message
    });
  }
});

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve React app for all non-API routes in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`CrownSync RAG Chatbot API Server`);
  console.log(`========================================`);
  console.log(`Server running on port ${PORT}`);
  console.log(`Vespa URL: ${VESPA_URL}`);
  console.log(`Embedding Service URL: ${EMBEDDING_SERVICE_URL}`);
  console.log(`OpenAI API: ${process.env.OPENAI_API_KEY ? 'Configured' : 'NOT CONFIGURED'}`);
  console.log(`========================================`);
  console.log(`Endpoints:`);
  console.log(`  POST /api/chat         - Streaming chat`);
  console.log(`  POST /api/search       - Document search`);
  console.log(`  GET  /api/health       - Health check`);
  console.log(`========================================\n`);
});

module.exports = app;
