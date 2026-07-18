"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import AppShell from '@/components/AppShell';
import StadiumMap from '@/components/StadiumMap';
import { useOperations } from '@/context/OperationsContext';
import { 
  Users, 
  TriangleAlert, 
  UserCheck, 
  ShieldAlert, 
  Activity, 
  BusFront, 
  Sparkles,
  MessageSquareCode,
  ShieldHalf
} from 'lucide-react';

// Dynamically import Recharts component to avoid server hydration checks
const CrowdChart = dynamic(() => import('@/components/CrowdChart'), { ssr: false });

export default function Dashboard() {
  const {
    visitorsCount,
    crowdDensity,
    activeVolunteers,
    medicalAlertsCount,
    securityAlertsCount,
    transportCapacity,
    incidents,
    weather,
    aiRecommendation,
    loadingInsights,
    generateAIRecommendations,
    playSound,
    // Settings configs
    compactMode,
    enableAIRecommendations,
    weatherWidget,
    crowdPrediction,
    transportStatusActive
  } = useOperations();

  const stats = [
    {
      label: "Total Visitors",
      value: visitorsCount.toLocaleString(),
      status: "Peak arrival wave",
      delta: "+4.8% from last interval",
      icon: Users,
      color: "text-[#00AEEF] border-[#00AEEF]/20 bg-[#00AEEF]/10"
    },
    {
      label: "Crowd Density",
      value: `${crowdDensity}%`,
      status: "High load",
      delta: "Up 6% in 15 minutes",
      icon: TriangleAlert,
      color: "text-[#FF9F43] border-[#FF9F43]/20 bg-[#FF9F43]/10"
    },
    {
      label: "Active Volunteers",
      value: activeVolunteers.onDuty,
      status: "Adequate coverage",
      delta: `${activeVolunteers.deployed} assigned to gates`,
      icon: UserCheck,
      color: "text-[#28C76F] border-[#28C76F]/20 bg-[#28C76F]/10"
    },
    {
      label: "Medical Alerts",
      value: medicalAlertsCount,
      status: "Monitoring",
      delta: "Minor first-aid requests",
      icon: Activity,
      color: "text-[#FF9F43] border-[#FF9F43]/20 bg-[#FF9F43]/10"
    },
    {
      label: "Security Alerts",
      value: securityAlertsCount,
      status: "Elevated",
      delta: "North concourse escalation",
      icon: ShieldAlert,
      color: "text-[#EA5455] border-[#EA5455]/20 bg-[#EA5455]/10"
    },
    ...(transportStatusActive ? [{
      label: "Transport Status",
      value: `${transportCapacity}%`,
      status: "On track",
      delta: "Shuttles maintaining cadence",
      icon: BusFront,
      color: "text-[#28C76F] border-[#28C76F]/20 bg-[#28C76F]/10"
    }] : [])
  ];

  return (
    <AppShell>
      {/* Page Header Title */}
      <section className={`glass-panel rounded-[2rem] ${compactMode ? 'p-3.5 lg:p-4' : 'p-5 lg:p-7'}`}>
        <div className={`flex flex-col gap-4 border-b border-border xl:flex-row xl:items-end xl:justify-between ${compactMode ? 'pb-3' : 'pb-5'}`}>
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-primary">Dashboard</p>
            <h1 className={`font-semibold tracking-tight text-foreground ${compactMode ? 'text-2xl lg:text-3xl' : 'text-4xl lg:text-5xl'}`}>
              Stadium Operations Command Center
            </h1>
            <p className="max-w-4xl text-sm leading-6 text-muted-foreground lg:text-base">
              A premium command-room view for monitoring crowd pressure, coordinating staff, and acting on AI-ready operational guidance.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="inline-flex cursor-pointer items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors border-[#28C76F]/30 bg-[#28C76F]/12 text-[#28C76F]">
              Transport stable
            </div>
            <div className="inline-flex cursor-pointer items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors border-[#FF9F43]/30 bg-[#FF9F43]/12 text-[#FF9F43]">
              North Gate watch
            </div>
            <div className="inline-flex cursor-pointer items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors border-border bg-transparent text-foreground/80">
              Weather: clear skies
            </div>
          </div>
        </div>

        {/* AI Recommendations Console */}
        {enableAIRecommendations && (
          <div className="mt-6 animate-fade-in">
            <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card/95 shadow-[0_32px_90px_rgba(2,8,23,0.18)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,174,239,0.12),transparent_35%)] pointer-events-none" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00AEEF] to-transparent opacity-60" />
              
              <div className={`${compactMode ? 'p-4 space-y-4' : 'p-6 lg:p-8 space-y-6'}`}>
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-border bg-muted/20 p-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-muted-foreground">AI Recommendation Engine</p>
                    <p className="mt-1 text-sm leading-6 text-foreground/80">Generate a fresh operational recommendation from the current stadium snapshot.</p>
                  </div>
                  <button 
                    onClick={generateAIRecommendations}
                    disabled={loadingInsights}
                    className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-all duration-200 bg-primary text-primary-foreground shadow-[0_0_26px_rgba(0,174,239,0.24)] hover:brightness-110 h-11 px-5 min-w-[190px] disabled:opacity-60"
                  >
                    <Sparkles className={`mr-2 h-4 w-4 ${loadingInsights ? 'animate-spin' : ''}`} />
                    {loadingInsights ? "Analyzing Snapshot..." : "Generate AI Insights"}
                  </button>
                </div>

                {/* Insights View Output */}
                {aiRecommendation ? (
                  <div className="grid gap-5 lg:grid-cols-[1fr_auto]">
                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-primary tracking-wider">Summary</span>
                        <p className="text-base text-foreground leading-7 font-medium mt-1">{aiRecommendation.stadiumSummary}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-primary tracking-wider">Prediction</span>
                        <p className="text-sm text-foreground/90 leading-6 mt-1">{aiRecommendation.aiPrediction}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-primary tracking-wider">Tactical Actions</span>
                        <ul className="list-disc pl-5 mt-2 text-sm space-y-2 text-foreground/85">
                          {aiRecommendation.recommendedActions.map((action, i) => (
                            <li key={i}>{action}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    {/* Score indicators */}
                    <div className="border border-border/80 rounded-2xl bg-[color:var(--surface-muted)] p-5 flex flex-col justify-center min-w-[200px] text-center gap-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Mock Focus Priority</p>
                        <div className={`mt-2 inline-block rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider ${
                          aiRecommendation.priority === 'Critical' ? 'bg-danger/15 text-danger border border-danger/25' :
                          aiRecommendation.priority === 'High' ? 'bg-warning/15 text-warning border border-warning/25' :
                          'bg-success/15 text-success border border-success/25'
                        }`}>
                          {aiRecommendation.priority}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Confidence Score</p>
                        <p className="text-4xl font-extrabold text-foreground mt-1 font-heading">{aiRecommendation.confidenceScore}%</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-[1.5rem] border border-border bg-card/85 p-5 text-sm leading-6 text-foreground/85">
                    No AI recommendation has been generated yet. Use the button above to analyze the current stadium conditions.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Metrics Row */}
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {stats.map((s, index) => {
          const Icon = s.icon;
          const delayClass = index === 1 ? 'delay-100' : index === 2 ? 'delay-200' : index === 3 ? 'delay-300' : index >= 4 ? 'delay-400' : '';
          return (
            <div 
              key={index}
              onClick={() => playSound('click')}
              className={`cursor-pointer rounded-[1.6rem] border text-card-foreground shadow-premium transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 border-border bg-card/95 animate-fade-in ${delayClass}`}
            >
              <div className="flex h-full items-start justify-between gap-4 p-5">
                <div className="space-y-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">{s.label}</p>
                  <div className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] border-border/80 bg-transparent text-muted-foreground">
                    {s.status}
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="font-stat text-3xl font-semibold text-foreground lg:text-[2.2rem]">
                      {s.value}
                    </span>
                  </div>
                  <p className="text-[11px] leading-5 text-muted-foreground">{s.delta}</p>
                </div>
                <div className={`p-2.5 rounded-xl border ${s.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Grid: Map / Logs */}
      <section className={`grid gap-6 ${compactMode ? 'xl:grid-cols-[1.6fr_1fr]' : 'xl:grid-cols-[1.7fr_1fr]'}`}>
        
        {/* Left Side: Map panel */}
        <div className={`cursor-pointer rounded-[1.6rem] border border-border bg-card/95 shadow-premium hover:border-primary/10 transition-all duration-200 ${compactMode ? 'p-4' : 'p-6'}`}>
          <div className={`${compactMode ? 'space-y-3' : 'space-y-5'}`}>
            <div className={`flex flex-col gap-3 border-b border-border lg:flex-row lg:items-end lg:justify-between ${compactMode ? 'pb-3' : 'pb-5'}`}>
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-primary">Stadium Map</p>
                <h2 className={`font-heading font-semibold tracking-tight text-foreground ${compactMode ? 'text-xl' : 'text-2xl lg:text-3xl'}`}>Live stadium crowd map</h2>
                <p className="max-w-3xl text-sm leading-6 text-muted-foreground">Interactive SVG map representing zone-level crowd status across gates and support sections.</p>
              </div>
            </div>
            <StadiumMap />
          </div>
        </div>

        {/* Right Side: Logs / Briefs */}
        <div className={`space-y-6 ${compactMode ? 'space-y-4' : 'space-y-6'}`}>
          
          {/* Weather details */}
          {weatherWidget && (
            <div className={`cursor-pointer rounded-[1.6rem] border border-border bg-card/95 shadow-premium transition-all ${compactMode ? 'p-4 animate-fade-in' : 'p-6 animate-fade-in'}`}>
              <div className={`${compactMode ? 'space-y-3' : 'space-y-5'}`}>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-primary">Weather Summary</p>
                  <h2 className={`font-heading font-semibold tracking-tight text-foreground ${compactMode ? 'text-xl' : 'text-2xl lg:text-3xl'}`}>Venue weather conditions</h2>
                  <p className="text-sm leading-6 text-muted-foreground">Current conditions that affect crowd movement and staff endurance.</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-card/80 p-4">
                    <p className="text-[9px] uppercase tracking-[0.26em] text-muted-foreground font-semibold">Condition</p>
                    <p className="mt-1 text-sm text-foreground/90 font-medium">{weather.condition}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-card/80 p-4">
                    <p className="text-[9px] uppercase tracking-[0.26em] text-muted-foreground font-semibold">Temperature</p>
                    <p className="mt-1 text-sm text-foreground/90 font-medium">{weather.temperature}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-card/80 p-4">
                    <p className="text-[9px] uppercase tracking-[0.26em] text-muted-foreground font-semibold">Humidity</p>
                    <p className="mt-1 text-sm text-foreground/90 font-medium">{weather.humidity}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-card/80 p-4">
                    <p className="text-[9px] uppercase tracking-[0.26em] text-muted-foreground font-semibold">Wind</p>
                    <p className="mt-1 text-sm text-foreground/90 font-medium">{weather.wind}</p>
                  </div>
                </div>
                <p className="text-sm leading-6 text-muted-foreground italic">{weather.advisory}</p>
              </div>
            </div>
          )}

          {/* Incident Feed */}
          <div className={`cursor-pointer rounded-[1.6rem] border border-border bg-card/95 shadow-premium transition-all ${compactMode ? 'p-4' : 'p-6'}`}>
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-primary">Recent Incidents</p>
                <h2 className={`font-heading font-semibold tracking-tight text-foreground ${compactMode ? 'text-xl' : 'text-2xl lg:text-3xl'}`}>Control room incident feed</h2>
                <p className="text-sm leading-6 text-muted-foreground">Latest stadium incidents, current status, and operational severity.</p>
              </div>
              
              <div className="overflow-hidden rounded-[1.4rem] border border-border bg-card/80">
                <table className="w-full text-sm text-foreground">
                  <thead className="border-b border-border bg-muted/40">
                    <tr>
                      <th className="h-10 px-4 text-left align-middle text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Time</th>
                      <th className="h-10 px-4 text-left align-middle text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Incident</th>
                      <th className="h-10 px-4 text-left align-middle text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Severity</th>
                      <th className="h-10 px-4 text-left align-middle text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incidents.map(inc => (
                      <tr key={inc.id} className="border-b border-border/40 transition-colors hover:bg-muted/30 last:border-0">
                        <td className="px-4 py-3 align-middle text-xs font-mono text-muted-foreground">{inc.time}</td>
                        <td className="px-4 py-3 align-middle text-xs font-medium text-foreground/90">{inc.title}</td>
                        <td className="px-4 py-3 align-middle text-xs">
                          <span className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                            inc.severity === 'High' ? 'bg-danger/10 text-danger border border-danger/20' :
                            inc.severity === 'Medium' ? 'bg-warning/10 text-warning border border-warning/20' :
                            'bg-success/10 text-success border border-success/20'
                          }`}>
                            {inc.severity}
                          </span>
                        </td>
                        <td className="px-4 py-3 align-middle text-xs text-muted-foreground">{inc.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Volunteer Status Overview */}
          <div className={`cursor-pointer rounded-[1.6rem] border border-border bg-card/95 shadow-premium transition-all ${compactMode ? 'p-4' : 'p-6'}`}>
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-primary">Volunteer Status</p>
                <h2 className={`font-heading font-semibold tracking-tight text-foreground ${compactMode ? 'text-xl' : 'text-2xl lg:text-3xl'}`}>Operations staffing overview</h2>
                <p className="text-sm leading-6 text-muted-foreground">Command team coverage across the active control window.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3 text-center">
                <div className="rounded-2xl border border-border bg-card/80 p-4">
                  <p className="text-[9px] uppercase tracking-[0.26em] text-muted-foreground font-semibold">On duty</p>
                  <p className="mt-1 font-stat text-2xl text-foreground font-semibold">{activeVolunteers.onDuty}</p>
                </div>
                <div className="rounded-2xl border border-border bg-card/80 p-4">
                  <p className="text-[9px] uppercase tracking-[0.26em] text-muted-foreground font-semibold">Deployed</p>
                  <p className="mt-1 font-stat text-2xl text-foreground font-semibold">{activeVolunteers.deployed}</p>
                </div>
                <div className="rounded-2xl border border-border bg-card/80 p-4">
                  <p className="text-[9px] uppercase tracking-[0.26em] text-muted-foreground font-semibold">Standby</p>
                  <p className="mt-1 font-stat text-2xl text-foreground font-semibold">{activeVolunteers.standby}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground font-medium">Next shift changes: {activeVolunteers.nextShift}</p>
            </div>
          </div>

        </div>
      </section>

      {/* Recharts chart and briefing notes */}
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        
        {/* Crowd index line chart */}
        {crowdPrediction ? (
          <div className={`cursor-pointer rounded-[1.6rem] border border-border bg-card/95 shadow-premium transition-all ${compactMode ? 'p-4 animate-fade-in' : 'p-6 animate-fade-in'}`}>
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-primary">Operational Insights</p>
                <h2 className={`font-heading font-semibold tracking-tight text-foreground ${compactMode ? 'text-xl' : 'text-2xl lg:text-3xl'}`}>Crowd Density Chart</h2>
                <p className="text-sm leading-6 text-muted-foreground">Projected crowd pressure and throughput trend across the current match window.</p>
              </div>
              
              <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#00AEEF]" /> Crowd Index
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#28C76F]" /> Throughput %
                </span>
              </div>

              <CrowdChart />
            </div>
          </div>
        ) : (
          <div className="rounded-[1.6rem] border border-border bg-card/85 p-5 text-sm text-muted-foreground flex items-center justify-center">
            Crowd Density Predictions are deactivated in Control Panel settings.
          </div>
        )}

        {/* Operational Briefing Note */}
        <div className={`cursor-pointer rounded-[1.6rem] border border-border bg-card/95 shadow-premium transition-all ${compactMode ? 'p-4' : 'p-6'}`}>
          <div className="space-y-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-primary">Command Notes</p>
              <h2 className={`font-heading font-semibold tracking-tight text-foreground ${compactMode ? 'text-xl' : 'text-2xl lg:text-3xl'}`}>Operational briefing</h2>
              <p className="text-sm leading-6 text-muted-foreground">Key actions and staffing posture for the next control interval.</p>
            </div>
            
            <div className="space-y-3 rounded-[1.4rem] border border-border bg-card/80 p-4">
              <p className="text-[10px] uppercase tracking-[0.26em] text-muted-foreground font-semibold">Focus Area</p>
              <p className="text-sm leading-6 text-foreground/80">
                Prioritize North Gate, keep East Concourse directional, and preserve transport cadence without overcommitting marshals.
              </p>
            </div>
            
            <div className="grid gap-3 sm:grid-cols-2 text-center">
              <div className="rounded-2xl border border-border bg-muted/20 p-4">
                <p className="text-[9px] uppercase tracking-[0.26em] text-muted-foreground font-semibold">Visitor Forecast</p>
                <p className="mt-1 text-xs text-foreground/80 font-semibold">Inbound pressure rising</p>
              </div>
              <div className="rounded-2xl border border-border bg-muted/20 p-4">
                <p className="text-[9px] uppercase tracking-[0.26em] text-muted-foreground font-semibold">Transport Status</p>
                <p className="mt-1 text-xs text-foreground/80 font-semibold">Holding steady</p>
              </div>
            </div>

            <div className="rounded-[1.4rem] border border-border bg-card/85 p-4 space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.26em] text-muted-foreground">
                <MessageSquareCode className="h-4 w-4 text-[#28C76F]" /> AI GUIDANCE
              </div>
              <p className="text-xs leading-6 text-foreground/75">
                Live Gemini analysis updates the hero recommendation and zone drill-downs from the current stadium snapshot. Use the Generate button at the top to refresh.
              </p>
            </div>
          </div>
        </div>

      </section>
    </AppShell>
  );
}
