import json
import random
import os
import uuid
from datetime import datetime, timedelta

# Configuration
OUTPUT_FILE = "../data/tickets_5k.json"
COUNT = 5000

# Mock Data Components
SYSTEMS = ["macOS Sequoia", "Windows 11", "Okta", "AWS EC2", "Docker", "Kubernetes", "Slack", "Jira", "VPN", "Outlook"]
ISSUES = ["Connection Timeout", "Crash on Startup", "403 Forbidden", "Slow Performance", "Login Loop", "Blue Screen", "Kernel Panic", "API Latency"]
ACTIONS = ["Restarted service", "Cleared cache", "Updated drivers", "Reinstalled app", "Checked firewall logs", "Reset password", "Rolled back update"]
STATUSES = ["Solved", "Open", "Investigating", "Pending"]
PRIORITIES = ["Low", "Medium", "High", "Critical"]
TAGS_POOL = ["Network", "Security", "Hardware", "Software", "Cloud", "Access", "Database", "DevOps"]

def ensure_directory():
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)

def generate_ticket():
    system = random.choice(SYSTEMS)
    issue = random.choice(ISSUES)
    action = random.choice(ACTIONS)
    
    title = f"{issue} on {system}"
    content = f"User reported {issue.lower()} when trying to access {system}. Error code: {random.randint(100, 999)}. Resolution: {action} resolved the issue."
    
    return {
        "id": f"T-{random.randint(10000, 99999)}",
        "title": title,
        "content": content,
        "status": random.choice(STATUSES),
        "priority": random.choice(PRIORITIES),
        "tags": random.sample(TAGS_POOL, k=random.randint(1, 3)),
        "similarity_score": None
    }

def main():
    ensure_directory()
    print(f"Generating {COUNT} tickets...")
    
    tickets = [generate_ticket() for _ in range(COUNT)]
    
    with open(OUTPUT_FILE, "w") as f:
        json.dump(tickets, f, indent=2)
        
    print(f"Successfully saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
