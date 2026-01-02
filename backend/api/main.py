from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models.ticket import Ticket
from services.search_service import SearchService
from typing import List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

search_service = SearchService()

@app.on_event('startup')
async def load_data():
    mock_tickets = [
        Ticket(id="T-1024", title="VPN Connection Fails on macOS Sequoia", content="Users reporting AnyConnect timeouts after updating to macOS 15.0. Workaround involves disabling IPv6 in network settings."),
        Ticket(id="T-1025", title="SSO Login Loop - Okta Integration", content="Authentication redirects indefinitely. Root cause identifed as clock skew on the auth server. Sync NTP to fix."),
        Ticket(id="T-1021", title="Docker Container OOM on Build Pipeline", content="CI jobs failing with exit code 137. Increased memory limit in values.yaml resolved the crash."),
        Ticket(id="T-1018", title="Internal API Rate Limiting for Sales Dashboard", content="Sales dashboard returning 429s. Whitelisted the dashboard IP range in the gateway.")
    ]
    search_service.add_tickets(mock_tickets)

@app.get('/search')
async def search(query: str):
    print(f"DEBUG: Received search query: {query}")
    if not query:
        return []
    results = search_service.search(query)
    return results
