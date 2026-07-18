"use client";
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useOperations } from '@/context/OperationsContext';

export default function AppShell({ children }) {
  const { theme } = useOperations();
  
  return (
    <div className={`min-h-screen bg-[color:var(--background)] text-foreground lg:grid lg:grid-cols-[auto_1fr] ambient-grid`}>
      {/* Navigation Sidebar */}
      <Sidebar />
      
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
