"use client";
import React, { useState, useEffect } from 'react';
import { CloudSun, Clock3, Bell, CircleUserRound, Menu } from 'lucide-react';
import { useOperations } from '@/context/OperationsContext';

export default function Header() {
  const { weather, playSound, theme, toggleTheme } = useOperations();
  const [currentTime, setCurrentTime] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Generate ticking clock format 00:00:00 or current local time
    const tick = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const notificationsList = [
    { id: 1, text: "North Gate queue expansion (High)", time: "14:18" },
    { id: 2, text: "Shuttle bay delay resolved", time: "14:12" },
    { id: 3, text: "Steward deployment complete Gate D", time: "14:05" },
    { id: 4, text: "Temperature advisory issued: hydration check", time: "13:40" }
  ];

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-[color:var(--surface)]/90 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4 px-4 py-4 lg:px-8">
        
        {/* Brand/Mobile Title */}
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-sm font-semibold text-primary lg:hidden">
            SP
          </div>
          <div className="hidden items-center gap-3 lg:flex">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-sm font-semibold text-primary">
              SP
            </div>
            <div>
              <p className="font-heading text-xl font-semibold tracking-tight text-foreground">StadiumPilot AI</p>
              <p className="text-xs text-muted-foreground">FIFA World Cup 2026 Operations Command Center</p>
            </div>
          </div>
          <div className="cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors border-[#28C76F]/30 bg-[#28C76F]/12 text-[#28C76F] hidden lg:inline-flex">
            <span className="h-2 w-2 rounded-full bg-[#28C76F] alert-pulse" />
            Live Match 67:12
          </div>
        </div>

        {/* Action Widgets */}
        <div className="flex items-center gap-2 lg:gap-3">
          
          {/* Weather summary */}
          <div className="hidden items-center gap-3 rounded-full border border-border bg-[color:var(--surface-muted)] px-4 py-2 xl:flex">
            <CloudSun className="h-4 w-4 text-primary" />
            <span className="text-sm text-foreground/80">{weather.condition}</span>
            <span className="text-sm text-muted-foreground">{weather.temperature}</span>
          </div>

          {/* Dynamic timer clock */}
          <div className="hidden items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 xl:flex">
            <Clock3 className="h-4 w-4 text-[#28C76F]" />
            <span className="text-sm font-medium text-foreground/80 font-mono">{currentTime}</span>
          </div>

          <div className="cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors border-[#28C76F]/30 bg-[#28C76F]/12 text-[#28C76F] hidden md:inline-flex">
            <span className="h-2 w-2 rounded-full bg-[#28C76F] alert-pulse" />
            Live data active
          </div>

          {/* Theme Toggle in Header for convenience */}
          <button 
            onClick={toggleTheme}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card/80 text-foreground/80 transition-all hover:bg-muted/70 text-xs font-semibold"
          >
            {theme === 'dark' ? 'LIGHT' : 'DARK'}
          </button>

          {/* Notification dropdown */}
          <div className="relative">
            <button 
              type="button" 
              onClick={() => {
                setShowNotifications(!showNotifications);
                playSound('click');
              }}
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card/80 text-foreground/80 transition-all duration-200 hover:border-primary/25 hover:bg-muted/70 hover:text-foreground" 
              aria-label="Open notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 min-w-5 rounded-full bg-[#EA5455] px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
                {notificationsList.length}
              </span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-border bg-[color:var(--surface-strong)] p-4 shadow-premium z-50">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2 mb-2">Live Alerts</p>
                <div className="space-y-3">
                  {notificationsList.map(n => (
                    <div key={n.id} className="text-xs border-b border-border/30 pb-2 last:border-0 last:pb-0">
                      <div className="flex justify-between font-medium text-foreground/90">
                        <span>{n.text}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User profile details */}
          <button className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-all duration-200 border border-border/85 bg-background/70 text-foreground hover:bg-muted/70 hover:border-primary/20 h-11 px-5 gap-2" type="button">
            <CircleUserRound className="h-4 w-4" />
            <span className="hidden sm:inline">Venue Organizer</span>
          </button>

        </div>
      </div>
    </header>
  );
}
