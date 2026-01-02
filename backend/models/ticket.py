from pydantic import BaseModel
from typing import List, Optional

class Ticket(BaseModel):
    id: str
    title: str
    content: str
    status: str = 'Open'
    priority: str = 'Medium'
    tags: List[str] = []
    # Will be filled in by the vector search
    similarity_score: Optional[float] = None