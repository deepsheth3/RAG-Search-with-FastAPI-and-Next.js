from openai import OpenAI
from core.config import get_settings
from typing import List

class EmbeddingService:
    def __init__(self):
        self.setting = get_settings()
        self.client = OpenAI(api_key=self.setting.OPENAI_API_KEY)


    def get_embeddings(self, text:str) -> List[float]:
        if not text:
            return []
        
        response = self.client.embeddings.create(
            model='text-embedding-3-small',
            input=text.replace("\n", " ")
        )

        return response.data[0].embedding

    def get_batch_embeddings(self, texts: List[str]) -> List[List[float]]:
        response = self.client.embeddings.create(
            model='text-embedding-3-small',
            input=[t.replace("\n", " ") for t in texts]
        )
        return [d.embedding for d in response.data]

