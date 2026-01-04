from typing import List
import numpy as np
from models.ticket import Ticket
from services.embedding_service import EmbeddingService
from pinecone import Pinecone
from core.config import get_settings

class SearchService:
    def __init__(self):
        self.setting = get_settings()
        self.embedding_service = EmbeddingService()
        self.pc = Pinecone(api_key=self.setting.PINECONE_API_KEY)
        self.index = self.pc.Index(self.setting.PINECONE_INDEX_NAME)

    def add_tickets(self, tickets: List[Ticket]):
        batch_size = 50
        print(f"Ingesting {len(tickets)} tickets in batches of {batch_size}...")

        for i in range(0, len(tickets), batch_size):
            batch = tickets[i:i+batch_size]
            
            # 1. Embed Batch
            texts = [f"{t.title} {t.content}" for t in batch]
            try:
                embeddings = self.embedding_service.get_batch_embeddings(texts)
            except Exception as e:
                print(f"Error embedding batch {i}: {e}")
                continue

            # 2. Upload Batch
            vectors = []
            for j, ticket in enumerate(batch):
                vectors.append({
                    'id': ticket.id,
                    'values': embeddings[j],
                    'metadata': {
                        'title': ticket.title,
                        'content': ticket.content,
                        'status': ticket.status,
                        'priority': ticket.priority,
                        'tags': ticket.tags
                    }
                })
            
            self.index.upsert(vectors=vectors)
            print(f"Uploaded batch {i // batch_size + 1}/{(len(tickets) + batch_size - 1) // batch_size}")
    
    def search(self, query: str, k: int = 3) -> List[Ticket]:
        query_vector = self.embedding_service.get_embeddings(text=query)
        
        response = self.index.query(
            vector=query_vector,
            top_k=k,
            include_metadata=True
        )
        
        results = []
        for match in response.matches:
            t = Ticket(
                id=match.id,
                title=match.metadata["title"],
                content=match.metadata["content"],
                status=match.metadata.get("status", "Open"),
                priority=match.metadata.get("priority", "Medium"),
                tags=match.metadata.get("tags", []),
                similarity_score=match.score
            )
            results.append(t)
            
        return results
        