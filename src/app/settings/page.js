"use client";
import React from 'react';
import AppShell from '@/components/AppShell';
import { useOperations } from '@/context/OperationsContext';
import { Settings, Sparkles, Sliders, Bell } from 'lucide-react';

export default function SettingsPage() {
  const {
    // Config states
    theme, toggleTheme,
    compactMode, setCompactMode,
    animations, setAnimations,
    soundEffects, setSoundEffects,
    enableAIRecommendations, setEnableAIRecommendations,
    enableAIAssistant, setEnableAIAssistant,
    enableDemoMode, setEnableDemoMode,
    autoAIRefresh, setAutoAIRefresh,
    refreshInterval, setRefreshInterval,
    liveDataActive, setLiveDataActive,
    crowdHeatmap, setCrowdHeatmap,
    zoneHighlight, setZoneHighlight,
    weatherWidget, setWeatherWidget,
    crowdPrediction, setCrowdPrediction,
    transportStatusActive, setTransportStatusActive,
    sustainabilityActive, setSustainabilityActive,
    alerts, setAlerts,
    responseSpeed, setResponseSpeed,
    clearChat,
    playSound
  } = useOperations();

  const handleToggle = (setter, val) => {
    setter(!val);
    playSound('click');
  };

  const handleAlertToggle = (alertKey) => {
    setAlerts(prev => ({
      ...prev,
      [alertKey]: !prev[alertKey]
    }));
    playSound('click');
  };

  return (
    <AppShell>
      {/* Page Header */}
      <section className="premium-shell rounded-[2rem] border border-border bg-card/90 p-5 lg:p-7 shadow-premium">
        <div className="flex flex-col gap-4 border-b border-border pb-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-primary">Settings</p>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground lg:text-5xl">
              Operations Control Center
            </h1>
            <p className="max-w-4xl text-sm leading-6 text-muted-foreground lg:text-base">
              Tune the command center experience for the current event window, AI behavior, accessibility, and venue operations.
            </p>
          </div>
        </div>
      </section>

      {/* Grid Settings Panels */}
      <div className="space-y-5">
        
        {/* Application Appearance card */}
        <div className="rounded-[1.6rem] border border-border bg-card/95 p-6 shadow-premium premium-card">
          <div className="space-y-5">
            <div className="flex flex-col gap-3 border-b border-border/60 pb-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-primary">Application</p>
              <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
                Operations control surface
              </h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Every control updates the current workspace state and persists preferences locally.
              </p>
            </div>
            
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-3">
                
                {/* Theme toggle */}
                <div className="flex min-h-[4.5rem] items-center justify-between gap-3 rounded-[1.2rem] border border-border bg-card/85 px-4 py-3 transition hover:border-primary/20">
                  <div className="min-w-0 flex-1 pr-3">
                    <p className="text-sm font-semibold text-foreground">Dark / Light Theme</p>
                    <p className="mt-1 text-xs text-muted-foreground">Switch the global appearance instantly.</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button 
                      type="button" 
                      onClick={toggleTheme}
                      className="relative inline-flex h-7 w-14 items-center rounded-full border border-border p-1 bg-muted"
                    >
                      <span 
                        className={`pointer-events-none flex h-5 w-5 items-center justify-center rounded-full bg-primary shadow-sm transition-transform duration-200 ${
                          theme === 'light' ? 'translate-x-7' : 'translate-x-0'
                        }`} 
                      />
                    </button>
                  </div>
                </div>

                {/* Compact Mode toggle */}
                <div className="flex min-h-[4.5rem] items-center justify-between gap-3 rounded-[1.2rem] border border-border bg-card/85 px-4 py-3 transition hover:border-primary/20">
                  <div className="min-w-0 flex-1 pr-3">
                    <p className="text-sm font-semibold text-foreground">Compact Dashboard Mode</p>
                    <p className="mt-1 text-xs text-muted-foreground">Tighten spacing for dense monitoring views.</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button 
                      type="button" 
                      onClick={() => handleToggle(setCompactMode, compactMode)}
                      className="relative inline-flex h-7 w-14 items-center rounded-full border border-border p-1 bg-muted"
                    >
                      <span 
                        className={`pointer-events-none flex h-5 w-5 items-center justify-center rounded-full bg-primary shadow-sm transition-transform duration-200 ${
                          compactMode ? 'translate-x-7' : 'translate-x-0'
                        }`} 
                      />
                    </button>
                  </div>
                </div>

                {/* Animation toggler */}
                <div className="flex min-h-[4.5rem] items-center justify-between gap-3 rounded-[1.2rem] border border-border bg-card/85 px-4 py-3 transition hover:border-primary/20">
                  <div className="min-w-0 flex-1 pr-3">
                    <p className="text-sm font-semibold text-foreground">Animations On / Off</p>
                    <p className="mt-1 text-xs text-muted-foreground">Pause motion for calmer operations.</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button 
                      type="button" 
                      onClick={() => handleToggle(setAnimations, animations)}
                      className="relative inline-flex h-7 w-14 items-center rounded-full border border-border p-1 bg-muted"
                    >
                      <span 
                        className={`pointer-events-none flex h-5 w-5 items-center justify-center rounded-full bg-primary shadow-sm transition-transform duration-200 ${
                          animations ? 'translate-x-7' : 'translate-x-0'
                        }`} 
                      />
                    </button>
                  </div>
                </div>

                {/* Sound effects toggle */}
                <div className="flex min-h-[4.5rem] items-center justify-between gap-3 rounded-[1.2rem] border border-border bg-card/85 px-4 py-3 transition hover:border-primary/20">
                  <div className="min-w-0 flex-1 pr-3">
                    <p className="text-sm font-semibold text-foreground">Sound Effects On / Off</p>
                    <p className="mt-1 text-xs text-muted-foreground">Enable subtle browser audio feedback.</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button 
                      type="button" 
                      onClick={() => handleToggle(setSoundEffects, soundEffects)}
                      className="relative inline-flex h-7 w-14 items-center rounded-full border border-border p-1 bg-muted"
                    >
                      <span 
                        className={`pointer-events-none flex h-5 w-5 items-center justify-center rounded-full bg-primary shadow-sm transition-transform duration-200 ${
                          soundEffects ? 'translate-x-7' : 'translate-x-0'
                        }`} 
                      />
                    </button>
                  </div>
                </div>

              </div>
              
              <div className="space-y-3">
                <div className="rounded-[1.2rem] border border-border bg-[color:var(--surface-muted)] p-4">
                  <p className="text-sm font-semibold text-foreground">Theme Switcher Mode</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button 
                      onClick={theme === 'light' ? toggleTheme : undefined}
                      className={`rounded-full border px-4 py-2 text-xs font-bold transition-all ${
                        theme === 'dark' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'
                      }`}
                    >
                      Dark Mode
                    </button>
                    <button 
                      onClick={theme === 'dark' ? toggleTheme : undefined}
                      className={`rounded-full border px-4 py-2 text-xs font-bold transition-all ${
                        theme === 'light' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'
                      }`}
                    >
                      Light Mode
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI layer settings card */}
        <div className="rounded-[1.6rem] border border-border bg-card/95 p-6 shadow-premium premium-card">
          <div className="space-y-5">
            <div className="flex flex-col gap-3 border-b border-border/60 pb-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-primary">AI</p>
              <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
                Intelligence controls
              </h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Enable or disable the AI layer and tune response quality.
              </p>
            </div>
            
            <div className="grid gap-3 lg:grid-cols-2">
              <div className="flex min-h-[4.5rem] items-center justify-between gap-3 rounded-[1.2rem] border border-border bg-card/80 px-4 py-3 transition hover:border-primary/20">
                <div className="min-w-0 flex-1 pr-3">
                  <p className="text-sm font-semibold text-foreground">Enable AI Recommendations</p>
                  <p className="mt-1 text-xs text-muted-foreground">Toggle hero insight recommendation checks.</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => handleToggle(setEnableAIRecommendations, enableAIRecommendations)}
                  className="relative inline-flex h-7 w-14 items-center rounded-full border border-border p-1 bg-muted"
                >
                  <span className={`pointer-events-none flex h-5 w-5 items-center justify-center rounded-full bg-primary transition-transform ${enableAIRecommendations ? 'translate-x-7' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex min-h-[4.5rem] items-center justify-between gap-3 rounded-[1.2rem] border border-border bg-card/80 px-4 py-3 transition hover:border-primary/20">
                <div className="min-w-0 flex-1 pr-3">
                  <p className="text-sm font-semibold text-foreground">Enable AI Operations Assistant</p>
                  <p className="mt-1 text-xs text-muted-foreground">Turn the natural assistant console on or off.</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => handleToggle(setEnableAIAssistant, enableAIAssistant)}
                  className="relative inline-flex h-7 w-14 items-center rounded-full border border-border p-1 bg-muted"
                >
                  <span className={`pointer-events-none flex h-5 w-5 items-center justify-center rounded-full bg-primary transition-transform ${enableAIAssistant ? 'translate-x-7' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex min-h-[4.5rem] items-center justify-between gap-3 rounded-[1.2rem] border border-border bg-card/80 px-4 py-3 transition hover:border-primary/20">
                <div className="min-w-0 flex-1 pr-3">
                  <p className="text-sm font-semibold text-foreground">Enable Demo Mode simulations</p>
                  <p className="mt-1 text-xs text-muted-foreground">Use fallback simulations when Gemini is unavailable.</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => handleToggle(setEnableDemoMode, enableDemoMode)}
                  className="relative inline-flex h-7 w-14 items-center rounded-full border border-border p-1 bg-muted"
                >
                  <span className={`pointer-events-none flex h-5 w-5 items-center justify-center rounded-full bg-primary transition-transform ${enableDemoMode ? 'translate-x-7' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex min-h-[4.5rem] items-center justify-between gap-3 rounded-[1.2rem] border border-border bg-card/80 px-4 py-3 transition hover:border-primary/20">
                <div className="min-w-0 flex-1 pr-3">
                  <p className="text-sm font-semibold text-foreground">Automatic AI Refresh</p>
                  <p className="mt-1 text-xs text-muted-foreground">Re-request fresh guidance on dashboard updates.</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => handleToggle(setAutoAIRefresh, autoAIRefresh)}
                  className="relative inline-flex h-7 w-14 items-center rounded-full border border-border p-1 bg-muted"
                >
                  <span className={`pointer-events-none flex h-5 w-5 items-center justify-center rounded-full bg-primary transition-transform ${autoAIRefresh ? 'translate-x-7' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            <div className="rounded-[1.2rem] border border-border bg-[color:var(--surface-muted)] p-4">
              <p className="text-sm font-semibold text-foreground">AI Response Speed</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {['Fast', 'Balanced', 'Detailed'].map(speed => (
                  <button
                    key={speed}
                    onClick={() => {
                      setResponseSpeed(speed);
                      playSound('click');
                    }}
                    className={`rounded-full border px-4 py-2 text-xs font-bold transition-all ${
                      responseSpeed === speed ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'
                    }`}
                  >
                    {speed}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <button 
                onClick={clearChat}
                className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full text-xs font-semibold border border-border bg-background/70 hover:bg-muted/70 h-10 px-5 transition"
              >
                Reset AI Conversation
              </button>
            </div>
          </div>
        </div>

        {/* Live Operations widgets card */}
        <div className="rounded-[1.6rem] border border-border bg-card/95 p-6 shadow-premium premium-card">
          <div className="space-y-5">
            <div className="flex flex-col gap-3 border-b border-border/60 pb-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-primary">Dashboard</p>
              <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
                Live operations widgets
              </h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Toggle the visual layers that make the event floor easier to inspect.
              </p>
            </div>

            <div className="grid gap-3 lg:grid-cols-2">
              <div className="flex min-h-[4.5rem] items-center justify-between gap-3 rounded-[1.2rem] border border-border bg-card/85 px-4 py-3 transition hover:border-primary/20">
                <div className="min-w-0 flex-1 pr-3">
                  <p className="text-sm font-semibold text-foreground">Live Streaming Data</p>
                  <p className="mt-1 text-xs text-muted-foreground">Keep variables updating from simulated sensor feeds.</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => handleToggle(setLiveDataActive, liveDataActive)}
                  className="relative inline-flex h-7 w-14 items-center rounded-full border border-border p-1 bg-muted"
                >
                  <span className={`pointer-events-none flex h-5 w-5 items-center justify-center rounded-full bg-primary transition-transform ${liveDataActive ? 'translate-x-7' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex min-h-[4.5rem] items-center justify-between gap-3 rounded-[1.2rem] border border-border bg-card/85 px-4 py-3 transition hover:border-primary/20">
                <div className="min-w-0 flex-1 pr-3">
                  <p className="text-sm font-semibold text-foreground">Crowd Heatmap Display</p>
                  <p className="mt-1 text-xs text-muted-foreground">Show occupancy density ranges color overlays.</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => handleToggle(setCrowdHeatmap, crowdHeatmap)}
                  className="relative inline-flex h-7 w-14 items-center rounded-full border border-border p-1 bg-muted"
                >
                  <span className={`pointer-events-none flex h-5 w-5 items-center justify-center rounded-full bg-primary transition-transform ${crowdHeatmap ? 'translate-x-7' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex min-h-[4.5rem] items-center justify-between gap-3 rounded-[1.2rem] border border-border bg-card/85 px-4 py-3 transition hover:border-primary/20">
                <div className="min-w-0 flex-1 pr-3">
                  <p className="text-sm font-semibold text-foreground">High-Pressure Highlights</p>
                  <p className="mt-1 text-xs text-muted-foreground">Outline zones in critical status.</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => handleToggle(setZoneHighlight, zoneHighlight)}
                  className="relative inline-flex h-7 w-14 items-center rounded-full border border-border p-1 bg-muted"
                >
                  <span className={`pointer-events-none flex h-5 w-5 items-center justify-center rounded-full bg-primary transition-transform ${zoneHighlight ? 'translate-x-7' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex min-h-[4.5rem] items-center justify-between gap-3 rounded-[1.2rem] border border-border bg-card/85 px-4 py-3 transition hover:border-primary/20">
                <div className="min-w-0 flex-1 pr-3">
                  <p className="text-sm font-semibold text-foreground">Weather Tracker Widget</p>
                  <p className="mt-1 text-xs text-muted-foreground">Show clear sky weather stats in header.</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => handleToggle(setWeatherWidget, weatherWidget)}
                  className="relative inline-flex h-7 w-14 items-center rounded-full border border-border p-1 bg-muted"
                >
                  <span className={`pointer-events-none flex h-5 w-5 items-center justify-center rounded-full bg-primary transition-transform ${weatherWidget ? 'translate-x-7' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            <div className="rounded-[1.2rem] border border-border bg-[color:var(--surface-muted)] p-4">
              <p className="text-sm font-semibold text-foreground">Auto-Refresh Interval</p>
              <input 
                type="range" 
                min="10" 
                max="120" 
                step="5" 
                value={refreshInterval}
                onChange={(e) => {
                  setRefreshInterval(Number(e.target.value));
                  playSound('click');
                }}
                className="mt-3 w-full accent-primary cursor-pointer"
                aria-label="Refresh interval"
              />
              <p className="mt-2 text-xs text-muted-foreground font-semibold">Current Interval: {refreshInterval} seconds</p>
            </div>
          </div>
        </div>

        {/* Notifications and Alerts Routing card */}
        <div className="rounded-[1.6rem] border border-border bg-card/95 p-6 shadow-premium premium-card">
          <div className="space-y-5">
            <div className="flex flex-col gap-3 border-b border-border/60 pb-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-primary">Notifications</p>
              <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
                Alert routing
              </h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Choose which operational event channels should trigger warnings in the console header.
              </p>
            </div>

            <div className="grid gap-3 lg:grid-cols-2">
              {Object.keys(alerts).map((alertKey) => (
                <div key={alertKey} className="flex min-h-[4.5rem] items-center justify-between gap-3 rounded-[1.2rem] border border-border bg-card/85 px-4 py-3 transition hover:border-primary/20">
                  <div className="min-w-0 flex-1 pr-3">
                    <p className="text-sm font-semibold text-foreground capitalize">{alertKey} Alerts</p>
                    <p className="mt-1 text-xs text-muted-foreground">Receive updates for {alertKey} status changes.</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleAlertToggle(alertKey)}
                    className="relative inline-flex h-7 w-14 items-center rounded-full border border-border p-1 bg-muted"
                  >
                    <span className={`pointer-events-none flex h-5 w-5 items-center justify-center rounded-full bg-primary transition-transform ${alerts[alertKey] ? 'translate-x-7' : 'translate-x-0'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
