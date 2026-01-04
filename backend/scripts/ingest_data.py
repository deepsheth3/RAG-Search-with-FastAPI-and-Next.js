import json 
import os
import sys


sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.ticket import Ticket
from services.search_service import SearchService

DATA_FILE = "../data/tickets_5k.json"

def main():
    if not os.path.exists(DATA_FILE):
        print(f"Error: {DATA_FILE} does not exist")
        return 
    with open(DATA_FILE, "r") as f:
        raw_data = json.load(f)

    tickets = [Ticket(**ticket) for ticket in raw_data]

    search_service = SearchService()
    search_service.add_tickets(tickets)
    print("Tickets ingested successfully")

if __name__ == "__main__":
    main()

