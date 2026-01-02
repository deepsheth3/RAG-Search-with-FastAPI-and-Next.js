import faiss
from typing import List, Dict
import numpy as np
from models.ticket import Ticket
from services.embedding_service import EmbeddingService

class SearchService:
    def __init__(self):
        self.embedding_service = EmbeddingService()
        self.index = faiss.IndexFlatL2(1536)
        self.tickets: List[Ticket] = []

    def add_tickets(self, tickets: List[Ticket]):
        for ticket in tickets:
            vector = self.embedding_service.get_embeddings(
                f'{ticket.title} {ticket.content}'
            )
            self.tickets.append(ticket)
            self.index.add(np.array([vector], dtype=np.float32))
    
    def search(self, query: str, k: int = 3) -> List[Ticket]:
        query_vector = self.embedding_service.get_embeddings(text=query)
        distances, indices = self.index.search(np.array([query_vector], dtype=np.float32), k=k)

        result = []
        for i,idx in enumerate(indices[0]):
            if idx != -1 and idx <len(self.tickets):
                ticket = self.tickets[idx]
                ticket.similarity_score = float(1/(1+distances[0][i]))
                result.append(ticket)
        return result

        
        