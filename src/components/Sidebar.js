"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, MessageSquareText, CalendarDays, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { useOperations } from '@/context/OperationsContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { playSound } = useOperations();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "AI Operations Assistant", href: "/operations-assistant", icon: MessageSquareText },
    { name: "Reports", href: "/reports", icon: CalendarDays },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside 
      className={`hidden border-r border-border bg-[color:var(--surface-strong)]/95 px-4 py-5 shadow-premium lg:flex lg:flex-col transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-[280px]'
      }`}
    >
      {/* Brand Logo Header */}
      <div className={`flex items-center justify-between gap-3 border-b border-border pb-5`}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-sm font-semibold text-primary">
            SP
          </div>
          {!collapsed && (
            <div className="transition-opacity duration-300">
              <p className="font-heading text-lg font-semibold tracking-tight text-foreground">StadiumPilot AI</p>
              <p className="text-xs text-muted-foreground">Command Center</p>
            </div>
          )}
        </div>
        <button 
          onClick={() => {
            setCollapsed(!collapsed);
            playSound('click');
          }}
          className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-all duration-200 text-foreground/80 hover:bg-muted/70 hover:text-foreground h-11 w-11"
          aria-label="Collapse sidebar"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Nav Menu Links */}
      <nav className="mt-5 space-y-2 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => playSound('click')}
              aria-current={isActive ? 'page' : undefined}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition-all duration-200 ${
                isActive 
                  ? "bg-primary/15 text-foreground shadow-[0_0_0_1px_rgba(0,174,239,0.18)]" 
                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0 text-primary" />
              {!collapsed && <span className="font-medium">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Informational Briefing Card */}
      {!collapsed && (
        <div className="rounded-[1.4rem] border border-border bg-[color:var(--surface)]/50 p-4">
          <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Operational mode</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Live stadium monitoring, AI guidance, and incident coordination.
          </p>
        </div>
      )}
    </aside>
  );
}
