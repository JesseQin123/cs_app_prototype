# CrownSync App Prototype

**Note**: This is a prototype for demonstration purposes. Mock data is used throughout the application.

## Tech Stack

- **React 19** - UI framework
- **Vite 7** - Build tool & dev server
- **React Router 7** - Client-side routing
- **Tailwind CSS 4** - Styling
- **Lucide React** - Icon library
- **Vespa** - Search engine & vector database
- **OpenAI GPT-4o** - RAG chatbot LLM
- **CLIP** - Image embedding model

## Prerequisites

- Node.js 20.19+ or 22.12+
- npm or yarn
- Docker (for Vespa)
- Python 3.9+ (for embedding service)
- OpenAI API Key

---

## Quick Start

### First Time Setup

```bash
# 1. Start Vespa (downloads ~1.2GB image on first run)
docker run --detach --name vespa --hostname vespa-container \
  --publish 8080:8080 --publish 19071:19071 \
  vespaengine/vespa

# 2. Wait for Vespa to be ready (~30 seconds), then deploy schema
cd vespa-app && vespa deploy --wait 300 && cd ..

# 3. Configure OpenAI API Key
cp server/.env.example server/.env
# Edit server/.env and add: OPENAI_API_KEY=sk-your-key-here

# 4. Install dependencies
npm install

# 5. Start API server (Terminal 1) - REQUIRED!
npm run server

# 6. Import test data (Terminal 2)
npm run vespa:import

# 7. Start frontend (Terminal 2, after import completes)
npm run dev
```

Visit http://localhost:5173 → **AI Assistant** to use the RAG chatbot.

### Subsequent Starts (Vespa image already exists)

When you've already set up the project before, use these commands:

```bash
# Terminal 1: Start Vespa container (if not running)
docker start vespa

# Terminal 1: Start API server (REQUIRED - must run before frontend!)
npm run server

# Terminal 2: Start frontend
npm run dev
```

**Important**: The API server (`npm run server`) must be running before starting the frontend, otherwise you'll see `ECONNREFUSED` errors.

---

## All Services Summary

You need **3 services** running for full functionality:

| Service | Port | Command | Required |
|---------|------|---------|----------|
| Vespa | 8080 | `docker start vespa` | Yes |
| API Server | 3003 | `npm run server` | Yes |
| Frontend | 5173 | `npm run dev` | Yes |
| Embedding Service | 5000 | See below | Optional |

**Startup Order**: Vespa → API Server → Frontend

---

## Vespa Data Management

### Import Data

```bash
# Import all data (text + images)
npm run vespa:import

# Import text documents only
npm run vespa:import:text

# Import images only
npm run vespa:import:images
```

### Export/Backup Data

```bash
# Export current data as backup before making changes
npm run vespa:export
```

### Delete Data

#### Delete a Single Document

```bash
# Delete by document ID
curl -X DELETE "http://localhost:8080/document/v1/default/multimodal/docid/{document-id}"

# Example: Delete campaign with ID "camp-001"
curl -X DELETE "http://localhost:8080/document/v1/default/multimodal/docid/camp-001"
```

#### Delete All Documents (Reset Data)

```bash
# Delete all documents from Vespa
curl -X DELETE "http://localhost:8080/document/v1/default/multimodal/docid?selection=true&cluster=default"

# Then re-import data if needed
npm run vespa:import
```

#### Complete Reset (Recreate Vespa Container)

If you want a completely fresh start:

```bash
# Stop and remove the container
docker stop vespa
docker rm vespa

# Start a new container (no need to download image again)
docker run --detach --name vespa --hostname vespa-container \
  --publish 8080:8080 --publish 19071:19071 \
  vespaengine/vespa

# Wait for Vespa to be ready, then redeploy schema
cd vespa-app && vespa deploy --wait 300 && cd ..

# Re-import data
npm run vespa:import
```

### Regenerate Test Data

```bash
# Generate new mock data
npm run vespa:generate

# Import the newly generated data
npm run vespa:import
```

---

## Full Stack Setup (Detailed)

### Step 1: Start Embedding Service (Python) - Optional

```bash
cd embedding-service

# Create virtual environment (first time only)
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # macOS/Linux
# or: venv\Scripts\activate  # Windows

# Install dependencies (first time only)
pip install -r requirements.txt

# Start the service
python embedding_service.py
```

The embedding service will run on `http://localhost:5000`

### Step 2: Configure Server Environment

```bash
cd server

# Copy environment template
cp .env.example .env

# Edit .env and add your OpenAI API key
# OPENAI_API_KEY=sk-your-api-key-here
```

### Step 3: Start API Server

```bash
# From project root
npm run server
```

The server will run on `http://localhost:3003`

### Step 4: Import Data to Vespa

The project includes **default test data** in `vespa-data/` directory (already committed to Git).

```bash
# Import existing test data to Vespa (recommended for quick start)
npm run vespa:import

# Or import separately:
npm run vespa:import:text    # Text documents only
npm run vespa:import:images  # Images only
```

**Test data includes:**
- 300-500 records across multiple luxury brands
- Campaigns, Products, Retailers, FAQs
- Brands: Verragio, Gucci, Tiffany, Cartier, Rolex, etc.

### Step 5: Start Frontend

```bash
npm run dev
```

Visit `http://localhost:5173` and navigate to **AI Assistant** to use the RAG chatbot.

---

## Available Scripts

```bash
# Frontend
npm run dev           # Start frontend dev server
npm run build         # Build for production
npm run preview       # Preview production build

# Server
npm run server        # Start API server (port 3003)

# Vespa Data
npm run vespa:generate      # Generate extended mock data
npm run vespa:import        # Import all data to Vespa
npm run vespa:import:text   # Import text documents only
npm run vespa:import:images # Import images only
npm run vespa:export        # Export/backup data from Vespa
```

---

## Project Structure

```
crownsync-app/
├── src/
│   ├── brand/                    # Brand-side features
│   │   └── features/
│   │       └── chatbot/          # AI Assistant (RAG Chatbot)
│   │           ├── ChatbotPage.jsx
│   │           ├── hooks/
│   │           │   ├── useVespaSearch.js
│   │           │   └── useRAGChat.js
│   │           └── components/
│   ├── retailer/                 # Retailer-side features
│   └── App.jsx
├── server/                       # Node.js API server
│   ├── server.js
│   ├── services/
│   │   ├── ragService.js         # RAG orchestration
│   │   ├── conversationService.js
│   │   └── vespaService.js
│   └── routes/
│       └── chat.js               # Chat API endpoints
├── embedding-service/            # Python CLIP service
│   ├── embedding_service.py
│   └── requirements.txt
├── vespa-app/                    # Vespa configuration
│   ├── schemas/
│   │   └── multimodal.sd
│   └── services.xml
├── vespa-data/                   # Data files for Vespa
│   ├── text-documents.json
│   ├── extended-documents.json
│   ├── images-manifest.json
│   └── rag-structured-data.json  # Structured data for RAG
├── scripts/                      # Data import/export
│   ├── import-to-vespa.js
│   ├── export-to-vespa.js
│   └── generate-extended-data.js
└── public/                       # Static assets
```

---

## Environment Variables

### Server (`server/.env`)

```env
# Required
OPENAI_API_KEY=sk-your-api-key-here

# Optional (defaults shown)
VESPA_URL=http://127.0.0.1:8080
EMBEDDING_SERVICE_URL=http://127.0.0.1:5000
PORT=3003
NODE_ENV=development
```

---

## Troubleshooting

### ECONNREFUSED errors on frontend

This means the API server is not running. Make sure to start it first:

```bash
npm run server
```

### Port already in use

```bash
# Find process using the port
lsof -i :3003

# Kill the process
kill <PID>
```

### Vespa not responding

```bash
# Check if container is running
docker ps

# Start container if stopped
docker start vespa

# Check logs
docker logs vespa

# If container doesn't exist, create it
docker run --detach --name vespa --hostname vespa-container \
  --publish 8080:8080 --publish 19071:19071 \
  vespaengine/vespa
```

### Vespa schema not deployed

```bash
cd vespa-app && vespa deploy --wait 300 && cd ..
```

### Embedding service errors

```bash
# Make sure venv is activated
source embedding-service/venv/bin/activate

# Reinstall dependencies
pip install -r embedding-service/requirements.txt
```

---

## Links

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vespa Documentation](https://docs.vespa.ai/)
- [OpenAI API](https://platform.openai.com/docs)
