'use client';

import { useState } from 'react';
import { Search, Filter, ShieldCheck, Clock, User, ArrowRight, Tag } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Define the shape of data coming from Python
interface Ticket {
  id: string;
  title: string;
  content: string;
  status: string;
  priority: string;
  tags: string[];
  similarity_score?: number;
}

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [tickets, setTickets] = useState<Ticket[]>([]); // Store real tickets
  const [loading, setLoading] = useState(false);

  // Function to call your Python API
  const handleSearch = async () => {
    if (!searchQuery) return;
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/search?query=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setTickets(data);
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 border-b border-border/40 bg-background/50 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="font-semibold text-lg tracking-tight">TicketSearch</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Documentation</button>
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
              <User className="w-4 h-4" />
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            How can we <span className="text-gradient">help you</span> today?
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Search across 12,400+ resolved tickets, runbooks, and internal docs.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mt-8 relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
            <div className="relative bg-card rounded-xl border border-border/50 shadow-2xl flex items-center p-2">
              <Search className="w-5 h-5 text-muted-foreground ml-4" />
              <input
                type="text"
                placeholder="Describe your issue (e.g., 'VPN keeps disconnecting')..."
                className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-lg placeholder:text-muted-foreground/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-primary/25 disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            {tickets.length > 0 ? "Found Solutions" : "Recent Solutions"}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="group relative bg-card/40 hover:bg-card/80 border border-border/50 hover:border-primary/30 rounded-xl p-5 transition-all duration-300 backdrop-blur-sm cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium border",
                      ticket.priority === 'Critical' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                        ticket.priority === 'High' ? "bg-orange-500/10 text-orange-500 border-orange-500/20" :
                          "bg-blue-500/10 text-blue-500 border-blue-500/20"
                    )}>
                      {ticket.priority}
                    </span>
                    <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                      {ticket.title}
                    </h3>
                  </div>

                  <p className="text-muted-foreground text-sm line-clamp-2 pr-8">
                    {ticket.content}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      System
                    </div>
                    {ticket.tags && (
                      <div className="flex gap-2">
                        {ticket.tags.map(tag => (
                          <span key={tag} className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-secondary hover:bg-secondary/80 transition-colors">
                            <Tag className="w-3 h-3" /> {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 min-w-[100px]">
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5",
                    ticket.status === 'Solved' ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                  )}>
                    {ticket.status === 'Solved' && <ShieldCheck className="w-3 h-3" />}
                    {ticket.status}
                  </span>

                  {ticket.similarity_score && (
                    <div className="text-xs font-mono text-green-500/80 bg-green-500/5 px-2 py-1 rounded">
                      {Math.round(ticket.similarity_score * 100)}% match
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}