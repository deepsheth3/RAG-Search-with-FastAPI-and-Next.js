from typing import List, Dict
from openai import OpenAI
from core.config import get_settings
from models.ticket import Ticket

class ChatService:
    def __init__(self):
        self.settings = get_settings()
        self.client = OpenAI(api_key=self.settings.OPENAI_API_KEY)

    def generate_response(self, messages: List[Dict[str,str]], tickets: List[Ticket]):
        if tickets:
            context_line = [
                f'Ticket {t.id}: Details - {t.title} {t.content}'
                for t in tickets
            ]
            context_block = '\n--\n'.join(context_line)
        else:
            context_block = "No relevant tickets found."
        
        system_prompt = f"""
            You are a helpful IT Support Assistant.
            Answer the question based on the context provided.
            ---Context---
            {context_block}
        """
        final_messages = [
            {"role": "system", "content": system_prompt},
            *messages
        ]

        response = self.client.chat.completions.create(
            model = self.settings.OPENAI_MODEL,
            messages = final_messages
        )
        
        return response.choices[0].message.content