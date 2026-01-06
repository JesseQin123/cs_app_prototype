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

## Quick Start (Frontend Only)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

---

## Full Stack Setup (with RAG Chatbot)

### Step 1: Start Vespa (Docker)

```bash
# Pull and run Vespa container
docker run --detach --name vespa --hostname vespa-container \
  --publish 8080:8080 --publish 19071:19071 \
  vespaengine/vespa

# Wait for Vespa to be ready (about 30 seconds)
# Check status:
curl -s http://localhost:8080/state/v1/health

# Deploy the schema
cd vespa-app
vespa deploy --wait 300
```

### Step 2: Start Embedding Service (Python)

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

### Step 3: Configure Server Environment

```bash
cd server

# Copy environment template
cp .env.example .env

# Edit .env and add your OpenAI API key
# OPENAI_API_KEY=sk-your-api-key-here
```

### Step 4: Start API Server

```bash
# From project root
npm run server
```

The server will run on `http://localhost:3003`

### Step 5: Import Data to Vespa

```bash
# Generate extended mock data
npm run vespa:generate

# Import data (text + images)
npm run vespa:import

# Or import separately:
npm run vespa:import:text    # Text documents only
npm run vespa:import:images  # Images only
```

### Step 6: Start Frontend

```bash
npm run dev
```

Visit `http://localhost:5173` and navigate to **AI Assistant** to use the RAG chatbot.

---

## All Services Summary

| Service | Port | Command |
|---------|------|---------|
| Vespa | 8080 | `docker start vespa` |
| Embedding Service | 5000 | `cd embedding-service && source venv/bin/activate && python embedding_service.py` |
| API Server | 3003 | `npm run server` |
| Frontend | 5173 | `npm run dev` |

---

## Available Scripts

```bash
# Frontend
npm run dev           # Start frontend dev server
npm run build         # Build for production
npm run preview       # Preview production build

# Server
npm run server        # Start API server

# Vespa Data
npm run vespa:generate      # Generate extended mock data
npm run vespa:import        # Import all data to Vespa
npm run vespa:import:text   # Import text documents only
npm run vespa:import:images # Import images only
npm run vespa:export        # Export data from app
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
