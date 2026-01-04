from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict

from models.ticket import Ticket
from services.search_service import SearchService
from services.chat_service import ChatService

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Services
search_service = SearchService()
chat_service = ChatService()

# --- Data Models ---
class ChatRequest(BaseModel):
    messages: List[Dict[str, str]]
    tickets: List[Ticket]


@app.get('/search')
async def search(query: str):
    print(f"DEBUG: Received search query: {query}")
    if not query:
        return []
    results = search_service.search(query)
    return results

@app.post('/chat')
async def chat(request: ChatRequest):
    """
    Frontend sends: { messages: [...], tickets: [...] }
    Backend replies: { content: "Here is your answer..." }
    """
    response = chat_service.generate_response(request.messages, request.tickets)
    return {"content": response}