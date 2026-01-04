import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict

from models.ticket import Ticket
from services.search_service import SearchService
from services.chat_service import ChatService
from core.logging import configure_logging

configure_logging()

# Setup root logger for API
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Services
try:
    search_service = SearchService()
    chat_service = ChatService()
    logger.info("Services initialized successfully.")
except Exception as e:
    logger.critical(f"Failed to initialize services: {e}")

# --- Data Models ---
class ChatRequest(BaseModel):
    messages: List[Dict[str, str]]
    tickets: List[Ticket]


@app.get('/search')
async def search(query: str):
    logger.info(f"API Search Request: {query}")
    if not query:
        return []
    try:
        results = search_service.search(query)
        logger.info(f"API Search returned {len(results)} results.")
        return results
    except Exception as e:
        logger.error(f"Search endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post('/chat')
async def chat(request: ChatRequest):
    """
    Frontend sends: { messages: [...], tickets: [...] }
    Backend replies: { content: "Here is your answer..." }
    """
    logger.info("API Chat Request received.")
    try:
        response = chat_service.generate_response(request.messages, request.tickets)
        return {"content": response}
    except Exception as e:
        logger.error(f"Chat endpoint error: {e}")
        raise HTTPException(status_code=500, detail="Error generating response")