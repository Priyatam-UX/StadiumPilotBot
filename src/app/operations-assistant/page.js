"use client";
import React, { useState, useRef, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import { useOperations } from '@/context/OperationsContext';
import { Sparkles, Trash2, Send, MessageCircleCode, ArrowRight } from 'lucide-react';

export default function AssistantPage() {
  const {
    messages,
    loadingChat,
    sendMessageToAssistant,
    clearChat,
    crowdDensity,
    activeVolunteers,
    medicalAlertsCount,
    securityAlertsCount,
    stadiumZones,
    playSound
  } = useOperations();

  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loadingChat]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || loadingChat) return;
    sendMessageToAssistant(input);
    setInput("");
  };

  const suggestedPrompts = [
    "Why is Gate C becoming crowded?",
    "Predict crowd movement during the next fifteen minutes.",
    "Recommend the best volunteer deployment strategy.",
    "Which stadium gate is currently the safest for incoming spectators?",
    "Generate an emergency response plan.",
    "Summarize the current stadium operational status.",
    "Identify the highest operational risk at this moment."
  ];

  const handleSuggestClick = (promptText) => {
    sendMessageToAssistant(promptText);
  };

  return (
    <AppShell>
      {/* Page header and information */}
      <section className="premium-shell rounded-[2rem] border border-border bg-card/90 p-5 lg:p-7 shadow-premium">
        <div className="flex flex-col gap-4 border-b border-border pb-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-primary">AI Operations Assistant</p>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground lg:text-5xl">
              Stadium Command Assistant
            </h1>
            <p className="max-w-4xl text-sm leading-6 text-muted-foreground lg:text-base">
              Intelligent operational support for venue organizers during live FIFA World Cup matches. Ask about crowd flow, staffing, safety, transport, and response planning.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 animate-fade-in">
            <div className="inline-flex cursor-pointer items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors border-[#28C76F]/30 bg-[#28C76F]/12 text-[#28C76F]">
              Live Gemini supported
            </div>
            <div className="inline-flex cursor-pointer items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors border-[#FF9F43]/30 bg-[#FF9F43]/12 text-[#FF9F43]">
              Demo fallback enabled
            </div>
            <div className="inline-flex cursor-pointer items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors border-border bg-transparent text-foreground/80">
              Session history on
            </div>
          </div>
        </div>

        {/* Layout Grid: Briefs / Current snapshots */}
        <div className="mt-6 grid gap-4 xl:grid-cols-[1fr_360px]">
          
          {/* Brief info */}
          <div className="rounded-[1.6rem] border border-border bg-card/80 shadow-none">
            <div className="space-y-4 p-5">
              <div className="flex flex-col gap-3 border-b border-border/60 pb-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-primary">Assistant Brief</p>
                <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">
                  Operational response boundary
                </h2>
                <p className="text-xs text-muted-foreground leading-5">
                  The assistant answers only stadium operations questions and uses the current dashboard state with your prior chat context.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-muted/20 p-4">
                  <p className="text-[9px] uppercase tracking-[0.26em] text-muted-foreground font-bold">Operational Focus</p>
                  <p className="mt-1 text-xs leading-5 text-foreground/80">
                    Crowd density, gate pressure, volunteer allocation, incident response, transport coordination.
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-muted/20 p-4">
                  <p className="text-[9px] uppercase tracking-[0.26em] text-muted-foreground font-bold">Response Format</p>
                  <p className="mt-1 text-xs leading-5 text-foreground/80">
                    Action recommendations, predictions, security mitigations, priority levels, confidence indices.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Current Grounding Snapshot widget */}
          <div className="rounded-[1.6rem] border border-border bg-card/80 shadow-none">
            <div className="space-y-4 p-5">
              <div className="flex flex-col gap-3 border-b border-border/60 pb-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-primary">Current Snapshot</p>
                <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">
                  Dashboard Context
                </h2>
                <p className="text-xs text-muted-foreground">
                  The assistant is grounded in the latest stadium snapshot variables.
                </p>
              </div>
              <div className="space-y-2 rounded-2xl border border-border bg-muted/20 p-4 text-xs leading-5 text-foreground/85">
                <p><strong>Crowd Density:</strong> {crowdDensity}%</p>
                <p><strong>Active Volunteers:</strong> {activeVolunteers.deployed}</p>
                <p><strong>Active Incident Logs:</strong> {securityAlertsCount + medicalAlertsCount} active events</p>
                <p><strong>Busiest Gateway:</strong> {stadiumZones.find(z => z.status === 'red')?.name || "Gate C"} ({stadiumZones.find(z => z.status === 'red')?.crowdPercent || 86}%)</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Chat console frame */}
      <section className="rounded-[1.6rem] border border-border bg-card/90 flex flex-col overflow-hidden min-h-[500px] shadow-premium">
        
        {/* Chat header */}
        <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">AI Operations Assistant</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Chat with StadiumPilot AI about crowd movement, staffing, transport, safety, and response planning.
            </p>
          </div>
          <button 
            onClick={clearChat}
            className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full text-xs font-semibold border border-border bg-background/50 hover:bg-muted/70 h-9 px-4 shrink-0 transition"
          >
            <Trash2 className="mr-2 h-3.5 w-3.5" />
            Clear conversation
          </button>
        </div>

        {/* Message logs stream */}
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5 sm:px-6 max-h-[420px] no-scrollbar">
          {messages.map(msg => (
            <div 
              key={msg.id}
              className={`flex flex-col max-w-[85%] animate-bubble ${
                msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
              }`}
            >
              {/* Message bubble */}
              <div 
                className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                  msg.sender === 'user'
                    ? 'bg-primary text-primary-foreground shadow-sm rounded-tr-none'
                    : 'bg-muted/40 border border-border text-foreground/90 rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
              
              {/* Timestamp */}
              <span className="text-[9px] text-muted-foreground font-mono mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          ))}
          
          {loadingChat && (
            <div className="mr-auto max-w-[85%] items-start flex flex-col">
              <div className="rounded-2xl px-4 py-3 text-sm bg-muted/40 border border-border text-foreground/90 rounded-tl-none flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary animate-bounce" />
                <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs text-muted-foreground font-mono pl-1">Analyzing grounding data...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Suggested tags and message prompt input form */}
        <div className="border-t border-border px-5 py-4 sm:px-6 bg-[color:var(--surface)]/20">
          
          {/* Suggested options selector */}
          <div className="mb-4 space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground flex items-center gap-1.5">
              <MessageCircleCode className="h-3 w-3 text-primary" /> Suggested prompts
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1.5 no-scrollbar select-none">
              {suggestedPrompts.map((pText, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSuggestClick(pText)}
                  disabled={loadingChat}
                  className="shrink-0 rounded-full border border-border bg-card/90 px-3 py-1.5 text-xs text-foreground/80 hover:border-primary/30 hover:bg-muted/70 transition-all font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {pText}
                </button>
              ))}
            </div>
          </div>

          {/* Form input fields */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                disabled={loadingChat}
                className="flex w-full rounded-2xl border px-4 py-3 text-sm border-border bg-card/90 text-foreground placeholder:text-muted-foreground min-h-[90px] focus:outline-none focus:border-primary/50 transition-all pr-12" 
                placeholder="Ask about gates, crowd pressure, volunteer allocation, safety risks, or response planning..."
                aria-label="Ask StadiumPilot AI about current stadium operations"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || loadingChat}
                className="absolute right-3 bottom-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.22em] text-muted-foreground font-semibold">
                Session history stays active until you clear it.
              </div>
              
              <button 
                type="submit"
                disabled={!input.trim() || loadingChat}
                className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full text-xs font-semibold bg-primary text-primary-foreground shadow-[0_0_20px_rgba(0,174,239,0.2)] hover:brightness-110 h-10 px-5 min-w-[160px] disabled:opacity-60 transition-all"
              >
                <Sparkles className={`mr-1.5 h-3.5 w-3.5 ${loadingChat ? 'animate-spin' : ''}`} />
                Send to StadiumPilot AI
              </button>
            </div>
          </form>

        </div>
      </section>
    </AppShell>
  );
}
