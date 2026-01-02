# TicketSearch

TicketSearch is an internal knowledge base search engine designed to help support teams find historical solutions efficiently. It uses retrieval-augmented generation (RAG) concepts to match user queries with relevant support tickets based on semantic meaning rather than just keyword matching.

### The Problem
Support teams often struggle to find relevant information across disconnected platforms like Jira, Confluence, and Slack. Valuable knowledge is trapped in closed tickets, leading to:
*   Duplicate work when issues re-occur.
*   Slower resolution times for known problems.
*   Lengthy onboarding for new team members who lack access to institutional history.

### The Solution
TicketSearch indexes internal support tickets to create a searchable knowledge base. By generating vector embeddings for each ticket, the system allows users to ask natural language questions (e.g., "How to fix VPN timeout") and retrieve the most relevant past solutions, even if the keywords don't match exactly.

---

## Technology Stack

*   **Backend**: Python, FastAPI
*   **Frontend**: Next.js 14, TypeScript, Tailwind CSS
*   **Search Engine**: FAISS (for vector similarity search)
*   **Embeddings**: OpenAI `text-embedding-3-small`

## Features

*   **Semantic Search**: effective retrieval of relevant documents based on query intent.
*   **Modern Interface**: Clean, responsive UI with dark mode support.
*   **Architecture**: Modular design separating the embedding logic, search index, and API layer.

## Setup Guide

### 1. Backend (Python)
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Create .env file with your API Key
echo "OPENAI_API_KEY=sk-..." > .env

# Run Server
uvicorn api.main:app --reload
```
Server runs at: `http://127.0.0.1:8000`

### 2. Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
App runs at: `http://localhost:3000`

## Project Structure

```
backend/
├── api/          # FastAPI Routes
├── core/         # Config & Logging
├── models/       # Pydantic Schemas
├── services/     # Search & Embedding Logic
└── main.py       # Entry point

frontend/
├── app/          # Next.js Pages
└── ...
```

## Future Improvements
- [ ] Real-time Chat Interface
- [ ] index persistence (saving FAISS index to disk)
- [ ] Ingestion connectors for Jira/Confluence
