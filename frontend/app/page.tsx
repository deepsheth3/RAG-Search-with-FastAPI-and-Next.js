'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Filter, ShieldCheck, Clock, User, ArrowRight, Tag, MessageSquare, X, Send } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Types ---
interface Ticket {
  id: string;
  title: string;
  content: string;
  status: string;
  priority: string;
  tags: string[];
  similarity_score?: number;
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);

  // --- New Chat State ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isChatOpen]);

  // Search API
  const handleSearch = async () => {
    if (!searchQuery) return;
    setLoading(true);
    setIsChatOpen(false); // Close chat on new search
    setChatHistory([]);   // Reset chat on new search
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

  // Chat API
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    // 1. Add User Message
    const userMsg: Message = { role: 'user', content: chatInput };
    const newHistory = [...chatHistory, userMsg];
    setChatHistory(newHistory);
    setChatInput('');
    setChatLoading(true);

    try {
      // 2. Call Backend
      const res = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory,
          tickets: tickets // Send the current context!
        })
      });
      const data = await res.json();

      // 3. Add AI Message
      setChatHistory(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (error) {
      console.error("Chat failed:", error);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 border-b border-border/40 bg-background/50 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="font-semibold text-lg tracking-tight">TicketSearch</span>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-12">
        {/* Helper Hero */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            How can we <span className="text-gradient">help you</span> today?
          </h1>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mt-8 relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
            <div className="relative bg-card rounded-xl border border-border/50 shadow-2xl flex items-center p-2">
              <Search className="w-5 h-5 text-muted-foreground ml-4" />
              <input
                type="text"
                placeholder="Describe your issue..."
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

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            {tickets.length > 0 ? "Found Solutions" : "Recent Solutions"}
          </h2>
          {/* Main Chat Trigger */}
          {tickets.length > 0 && (
            <button
              onClick={() => setIsChatOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              <MessageSquare className="w-4 h-4" />
              Ask Assistant about these
            </button>
          )}
        </div>

        {/* Ticket Grid */}
        <div className="grid grid-cols-1 gap-4">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="group relative bg-card/40 hover:bg-card/80 border border-border/50 hover:border-primary/30 rounded-xl p-5 transition-all duration-300 backdrop-blur-sm cursor-pointer">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  {/* Ticket Title & content */}
                  <h3 className="font-semibold text-lg text-foreground">{ticket.title}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">{ticket.content}</p>
                </div>
                {/* Score */}
                {ticket.similarity_score && (
                  <div className="text-xs font-mono text-green-500/80 bg-green-500/5 px-2 py-1 rounded">
                    {Math.round(ticket.similarity_score * 100)}% match
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- CHAT MODAL OVERLAY --- */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[70vh]">
            {/* Header */}
            <div className="h-14 border-b border-border/50 bg-secondary/30 flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <span className="font-semibold">AI Assistant</span>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="hover:bg-red-500/10 hover:text-red-500 p-2 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50">
              {chatHistory.length === 0 && (
                <div className="text-center text-muted-foreground mt-10">
                  <p>I have analyzed the {tickets.length} tickets found.</p>
                  <p className="text-sm">Ask me anything about them!</p>
                </div>
              )}

              {chatHistory.map((msg, i) => (
                <div key={i} className={cn("flex w-full", msg.role === 'user' ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                    msg.role === 'user'
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground border border-border/50"
                  )}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-secondary rounded-2xl px-4 py-2.5 text-sm animate-pulse text-muted-foreground">Thinking...</div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border/50 bg-card">
              <div className="flex gap-2">
                <input
                  autoFocus
                  className="flex-1 bg-secondary/50 border border-border rounded-xl px-4 py-2 outline-none focus:ring-1 focus:ring-primary/50"
                  placeholder="Type your question..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={chatLoading}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground p-2.5 rounded-xl transition-all disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}