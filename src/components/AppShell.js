"use client";
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useOperations } from '@/context/OperationsContext';
import { LayoutDashboard, MessageSquareText, CalendarDays, Settings, X } from 'lucide-react';

export default function AppShell({ children }) {
  const pathname = usePathname();
  const { mobileSidebarOpen, setMobileSidebarOpen, playSound, currentRole } = useOperations();

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "AI Operations Assistant", href: "/operations-assistant", icon: MessageSquareText },
    { name: "Reports", href: "/reports", icon: CalendarDays },
    { name: "Settings", href: "/settings", icon: Settings },
  ];
  
  return (
    <div className="min-h-screen bg-[color:var(--background)] text-foreground lg:grid lg:grid-cols-[auto_1fr] ambient-grid relative">
      
      {/* Navigation Sidebar (Desktop) */}
      <Sidebar />

      {/* Navigation Drawer (Mobile) */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => {
            setMobileSidebarOpen(false);
            playSound('click');
          }}
        >
          <aside 
            className="w-[280px] h-full bg-[#0b1528]/95 border-r border-border p-5 flex flex-col gap-4 animate-bubble" 
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <p className="font-heading text-base font-semibold text-foreground">StadiumPilot AI</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{currentRole}</p>
              </div>
              <button 
                onClick={() => {
                  setMobileSidebarOpen(false);
                  playSound('click');
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="space-y-2 flex-1 mt-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => {
                      setMobileSidebarOpen(false);
                      playSound('click');
                    }}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition-all duration-200 ${
                      isActive 
                        ? "bg-primary/15 text-foreground border border-primary/20 shadow-sm" 
                        : "text-muted-foreground hover:bg-muted/75 hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0 text-primary" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}
      
      {/* Header and Content Frame */}
      <div className="flex min-h-screen flex-col overflow-y-auto">
        <Header />
        
        <main className="flex-1 px-4 py-5 lg:px-8 lg:py-8">
          <div className="mx-auto flex w-full max-w-[1680px] flex-col gap-6 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
