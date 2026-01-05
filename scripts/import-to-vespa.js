#!/usr/bin/env node
/**
 * Import CrownSync Data to Vespa
 *
 * This script imports text documents and images from the vespa-data folder
 * into the Vespa search engine.
 *
 * Usage:
 *   node scripts/import-to-vespa.js [--text-only] [--images-only] [--extended]
 *
 * Options:
 *   --text-only    Only import text documents (skip images)
 *   --images-only  Only import images (skip text documents)
 *   --extended     Use extended-documents.json instead of text-documents.json
 *
 * Prerequisites:
 *   1. Start Vespa services: cd vespa-search && ./scripts/start.sh
 *   2. Wait for services to be ready (~30 seconds)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Configuration
const VESPA_URL = process.env.VESPA_URL || 'http://127.0.0.1:8080';
const EMBEDDING_SERVICE_URL = process.env.EMBEDDING_SERVICE_URL || 'http://127.0.0.1:5000';
const API_SERVER_URL = process.env.API_SERVER_URL || 'http://127.0.0.1:3001';

// Parse command line arguments
const args = process.argv.slice(2);
const textOnly = args.includes('--text-only');
const imagesOnly = args.includes('--images-only');
const useExtended = args.includes('--extended');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// ============================================
// Service Health Checks
// ============================================

async function checkServices() {
  log('\nChecking services...', 'cyan');

  const results = {
    vespa: false,
    embedding: false,
  };

  // Check Vespa
  try {
    const response = await fetch(`${VESPA_URL}/state/v1/health`, {
      signal: AbortSignal.timeout(5000),
    });
    if (response.ok) {
      log('  ✓ Vespa is running', 'green');
      results.vespa = true;
    } else {
      log('  ✗ Vespa returned error', 'red');
    }
  } catch (err) {
    log(`  ✗ Vespa is not running: ${err.message}`, 'red');
  }

  // Check Embedding Service
  try {
    const response = await fetch(`${EMBEDDING_SERVICE_URL}/health`, {
      signal: AbortSignal.timeout(5000),
    });
    if (response.ok) {
      const data = await response.json();
      log(`  ✓ Embedding service is running (${data.model || 'CLIP'})`, 'green');
      results.embedding = true;
    } else {
      log('  ✗ Embedding service returned error', 'red');
    }
  } catch (err) {
    log(`  ✗ Embedding service is not running: ${err.message}`, 'yellow');
    log('    (Image import will be skipped)', 'dim');
  }

  return results;
}

// ============================================
// Text Document Import
// ============================================

// Transform document to match Vespa schema (remove unsupported fields)
function transformToVespaFormat(doc) {
  const fields = doc.fields;

  // Vespa schema only has these fields:
  // id, content_type, title, body, url, image_file_name, image_embedding, created_at, language
  //
  // We'll merge 'category' and 'metadata' into the 'body' field for searchability
  let enrichedBody = fields.body || '';

  if (fields.category) {
    enrichedBody += `\n\nCategory: ${fields.category}`;
  }

  if (fields.metadata) {
    try {
      const meta = typeof fields.metadata === 'string' ? JSON.parse(fields.metadata) : fields.metadata;
      const metaStr = Object.entries(meta)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');
      enrichedBody += `\n\nDetails: ${metaStr}`;
    } catch {
      // Ignore parse errors
    }
  }

  return {
    fields: {
      id: fields.id,
      content_type: fields.content_type || 'document',
      title: fields.title || '',
      body: enrichedBody.trim(),
      url: fields.url || '',
      image_file_name: fields.image_file_name || '',
      created_at: fields.created_at || Date.now(),
    }
  };
}

async function uploadTextDocument(doc) {
  const vespaDoc = transformToVespaFormat(doc);
  const docId = vespaDoc.fields.id;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(
      `${VESPA_URL}/document/v1/multimodal/multimodal/docid/${docId}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vespaDoc),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    // Vespa returns 200 for successful document operations
    const success = response.status === 200 || response.status === 201;

    if (!success) {
      const text = await response.text();
      // Only log first error for debugging
      if (!uploadTextDocument.loggedError) {
        console.error(`\n    First error (status ${response.status}): ${text.substring(0, 200)}`);
        uploadTextDocument.loggedError = true;
      }
    }

    return success;
  } catch (err) {
    if (!uploadTextDocument.loggedError) {
      console.error(`\n    Error uploading ${docId}: ${err.message}`);
      uploadTextDocument.loggedError = true;
    }
    return false;
  }
}

async function importTextDocuments(documentsPath) {
  log('\n📄 Importing text documents...', 'cyan');

  if (!fs.existsSync(documentsPath)) {
    log(`  Error: File not found: ${documentsPath}`, 'red');
    return { success: 0, failed: 0 };
  }

  const documents = JSON.parse(fs.readFileSync(documentsPath, 'utf8'));
  log(`  Found ${documents.length} documents to import`);

  let success = 0;
  let failed = 0;

  // Group by content_type for better progress display
  const byType = {};
  documents.forEach(doc => {
    const type = doc.fields?.content_type || 'unknown';
    if (!byType[type]) byType[type] = [];
    byType[type].push(doc);
  });

  log(`  Types: ${Object.entries(byType).map(([k, v]) => `${k}(${v.length})`).join(', ')}`);
  log('');

  // Import in batches (smaller batch size to avoid overwhelming Vespa)
  const batchSize = 10;
  for (let i = 0; i < documents.length; i += batchSize) {
    const batch = documents.slice(i, Math.min(i + batchSize, documents.length));

    // Process batch in parallel
    const results = await Promise.all(
      batch.map(doc => uploadTextDocument(doc))
    );

    const batchSuccess = results.filter(r => r).length;
    success += batchSuccess;
    failed += batch.length - batchSuccess;

    // Progress update
    const progress = Math.round(((i + batch.length) / documents.length) * 100);
    process.stdout.write(`\r  Progress: ${progress}% (${i + batch.length}/${documents.length})`);

    // Small delay between batches
    if (i + batchSize < documents.length) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }

  console.log(''); // New line after progress
  log(`  ✓ Imported ${success} documents`, 'green');
  if (failed > 0) {
    log(`  ✗ Failed: ${failed} documents`, 'red');
  }

  return { success, failed };
}

// ============================================
// Image Import
// ============================================

async function generateEmbedding(imagePath) {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const filename = path.basename(imagePath);
    const ext = path.extname(imagePath).toLowerCase();

    // Determine MIME type
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
    };
    const mimeType = mimeTypes[ext] || 'image/jpeg';

    // Build multipart form data manually
    const boundary = '----FormBoundary' + Math.random().toString(36).substring(2);
    const header = `--${boundary}\r\nContent-Disposition: form-data; name="image"; filename="${filename}"\r\nContent-Type: ${mimeType}\r\n\r\n`;
    const footer = `\r\n--${boundary}--\r\n`;

    const body = Buffer.concat([
      Buffer.from(header),
      imageBuffer,
      Buffer.from(footer),
    ]);

    const response = await fetch(`${EMBEDDING_SERVICE_URL}/embed`, {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
      },
      body: body,
      signal: AbortSignal.timeout(30000),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.embedding) {
        return data.embedding;
      }
    }

    return null;
  } catch (err) {
    console.error(`    Error generating embedding: ${err.message}`);
    return null;
  }
}

async function uploadImageDocument(doc, embedding) {
  const docId = doc.id;

  // Format embedding as Vespa tensor
  const tensorValues = {};
  embedding.forEach((val, idx) => {
    tensorValues[String(idx)] = val;
  });

  const vespaDoc = {
    fields: {
      id: docId,
      content_type: 'image',
      title: doc.title,
      body: doc.body,
      image_file_name: path.basename(doc.file_path),
      image_embedding: {
        type: 'tensor<float>(x[512])',
        values: tensorValues,
      },
      created_at: Date.now(),
    },
  };

  try {
    const response = await fetch(
      `${VESPA_URL}/document/v1/multimodal/multimodal/docid/${docId}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vespaDoc),
        signal: AbortSignal.timeout(10000),
      }
    );

    return response.ok || response.status === 201;
  } catch (err) {
    console.error(`    Error uploading ${docId}: ${err.message}`);
    return false;
  }
}

async function copyImageToVespaUploads(imagePath, vespaSearchRoot) {
  const uploadsDir = path.join(vespaSearchRoot, 'server', 'uploads');

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const filename = path.basename(imagePath);
  const destPath = path.join(uploadsDir, filename);

  if (!fs.existsSync(destPath)) {
    fs.copyFileSync(imagePath, destPath);
  }

  return filename;
}

async function importImages(manifestPath) {
  log('\n🖼️  Importing images...', 'cyan');

  if (!fs.existsSync(manifestPath)) {
    log(`  Error: File not found: ${manifestPath}`, 'red');
    return { success: 0, failed: 0 };
  }

  const images = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  log(`  Found ${images.length} images to import`);

  // Check for vespa-search project
  const vespaSearchRoot = path.resolve(projectRoot, '..', 'vespa-search');
  if (!fs.existsSync(vespaSearchRoot)) {
    log(`  Warning: vespa-search project not found at ${vespaSearchRoot}`, 'yellow');
    log('  Images will not be copied to uploads folder', 'dim');
  }

  let success = 0;
  let failed = 0;

  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const imagePath = image.full_path;

    process.stdout.write(`\r  [${i + 1}/${images.length}] ${path.basename(imagePath)}...`);

    // Check if image exists
    if (!fs.existsSync(imagePath)) {
      log(` SKIP (not found)`, 'yellow');
      failed++;
      continue;
    }

    // Generate embedding
    const embedding = await generateEmbedding(imagePath);
    if (!embedding) {
      process.stdout.write(' EMBEDDING FAILED\n');
      failed++;
      continue;
    }

    // Copy image to vespa-search uploads
    if (fs.existsSync(vespaSearchRoot)) {
      await copyImageToVespaUploads(imagePath, vespaSearchRoot);
    }

    // Upload to Vespa
    const uploaded = await uploadImageDocument(image, embedding);
    if (uploaded) {
      process.stdout.write(' OK\n');
      success++;
    } else {
      process.stdout.write(' UPLOAD FAILED\n');
      failed++;
    }

    // Small delay to avoid overwhelming services
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  log(`\n  ✓ Imported ${success} images`, 'green');
  if (failed > 0) {
    log(`  ✗ Failed: ${failed} images`, 'red');
  }

  return { success, failed };
}

// ============================================
// Verify Import
// ============================================

async function verifyImport() {
  log('\n📊 Verifying import...', 'cyan');

  try {
    const response = await fetch(`${API_SERVER_URL}/api/stats`, {
      signal: AbortSignal.timeout(5000),
    });

    if (response.ok) {
      const stats = await response.json();
      log(`  Text documents: ${stats.text_documents || 0}`, 'dim');
      log(`  Images: ${stats.images || 0}`, 'dim');
      log(`  Total: ${stats.total || 0}`, 'dim');
    } else {
      log('  Could not fetch stats (API may not be running)', 'yellow');
    }
  } catch {
    log('  Could not verify stats (API server may not be running)', 'yellow');
  }
}

// ============================================
// Main
// ============================================

async function main() {
  console.log('');
  log('═'.repeat(60), 'cyan');
  log('  CrownSync Data Import to Vespa', 'cyan');
  log('═'.repeat(60), 'cyan');

  // Check services
  const services = await checkServices();

  if (!services.vespa) {
    log('\n❌ Vespa is required. Please start services first:', 'red');
    log('   cd ../vespa-search && ./scripts/start.sh', 'dim');
    process.exit(1);
  }

  // Determine data paths
  const vespaDataDir = path.join(projectRoot, 'vespa-data');
  const textDocumentsPath = useExtended
    ? path.join(vespaDataDir, 'extended-documents.json')
    : path.join(vespaDataDir, 'text-documents.json');
  const imagesManifestPath = path.join(vespaDataDir, 'images-manifest.json');

  log(`\n📁 Data source: ${path.basename(textDocumentsPath)}`, 'dim');

  let textResults = { success: 0, failed: 0 };
  let imageResults = { success: 0, failed: 0 };

  // Import text documents
  if (!imagesOnly) {
    textResults = await importTextDocuments(textDocumentsPath);
  }

  // Import images (if embedding service is available)
  if (!textOnly && services.embedding) {
    imageResults = await importImages(imagesManifestPath);
  } else if (!textOnly && !services.embedding) {
    log('\n⚠️  Skipping image import (embedding service not available)', 'yellow');
  }

  // Verify
  await verifyImport();

  // Summary
  log('\n' + '═'.repeat(60), 'cyan');
  log('  Import Complete!', 'green');
  log('═'.repeat(60), 'cyan');
  log(`  Text documents: ${textResults.success} imported, ${textResults.failed} failed`);
  log(`  Images: ${imageResults.success} imported, ${imageResults.failed} failed`);
  log(`  Total: ${textResults.success + imageResults.success} documents indexed`);
  log('═'.repeat(60), 'cyan');
  console.log('');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
