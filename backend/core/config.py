from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    PROJECT_NAME: str = "TicketSearch"
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-3.5-turbo"
    
    # Pinecone Settings
    PINECONE_API_KEY: str = ""
    PINECONE_INDEX_NAME: str = "ticket-search"
    PINECONE_ENV: str = "us-east-1"

    class Config:
        env_file = '.env'

@lru_cache
def get_settings() -> Settings:
    return Settings()


