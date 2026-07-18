"use client";
import React, { useState } from 'react';
import AppShell from '@/components/AppShell';
import { useOperations } from '@/context/OperationsContext';
import { FileText, Download, Printer, Code, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ReportsPage() {
  const {
    visitorsCount,
    crowdDensity,
    activeVolunteers,
    medicalAlertsCount,
    securityAlertsCount,
    transportCapacity,
    stadiumZones,
    incidents,
    weather,
    aiRecommendation,
    playSound
  } = useOperations();

  const [activeTab, setActiveTab] = useState("overview");
  const [generating, setGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);

  // Tabs structure
  const reportTabs = [
    { id: "overview", label: "Stadium Overview" },
    { id: "crowd", label: "Crowd Analysis" },
    { id: "volunteers", label: "Volunteer Summary" },
    { id: "security", label: "Security Summary" },
    { id: "medical", label: "Medical Summary" },
    { id: "sustainability", label: "Sustainability Report" },
    { id: "ai", label: "AI Recommendations" }
  ];

  const handleGenerate = () => {
    setGenerating(true);
    playSound('click');
    setTimeout(() => {
      setGeneratedReport({
        timestamp: new Date().toLocaleString(),
        id: `REPORT-WC2026-${Math.floor(1000 + Math.random() * 9000)}`,
        generatedBy: "StadiumPilot AI Studio"
      });
      setGenerating(false);
      playSound('success');
    }, 1500);
  };

  const handlePrint = () => {
    playSound('click');
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleExportJSON = () => {
    playSound('click');
    const snapshot = {
      reportId: generatedReport?.id || "REPORT-DRAFT",
      timestamp: generatedReport?.timestamp || new Date().toISOString(),
      metrics: {
        visitors: visitorsCount,
        density: crowdDensity,
        volunteers: activeVolunteers,
        medicalAlerts: medicalAlertsCount,
        securityAlerts: securityAlertsCount,
        transport: transportCapacity
      },
      zones: stadiumZones,
      incidents,
      weather,
      aiRecommendation
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(snapshot, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${snapshot.reportId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <AppShell>
      {/* Print styles overrides */}
      <style jsx global>{`
        @media print {
          aside, header, nav, button, .no-print {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
            color: #000000 !important;
            background: #ffffff !important;
          }
          .glass-panel, .premium-card {
            border: none !important;
            background: transparent !important;
            box-shadow: none !important;
          }
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
        }
      `}</style>

      {/* Page Header */}
      <section className="premium-shell rounded-[2rem] border border-border bg-card/90 p-5 lg:p-7 shadow-premium no-print">
        <div className="flex flex-col gap-4 border-b border-border pb-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-primary">Reports</p>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground lg:text-5xl">
              AI Operations Report Studio
            </h1>
            <p className="max-w-4xl text-sm leading-6 text-muted-foreground lg:text-base">
              Generate a premium, executive-ready operations briefing from the live dashboard through the existing Gemini workflow.
            </p>
          </div>
        </div>

        {/* Action button to generate */}
        <div className="mt-6 flex flex-wrap gap-4 items-center justify-between rounded-2xl border border-border bg-muted/20 p-4">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-semibold text-foreground">Operational Snapshot Report</p>
              <p className="text-xs text-muted-foreground mt-0.5">Includes full metrics list, SVG status zone details, weather indices, and active security queues.</p>
            </div>
          </div>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full text-xs font-semibold bg-primary text-primary-foreground shadow-sm hover:brightness-110 h-10 px-5 transition-all disabled:opacity-60"
          >
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            {generating ? "Synthesizing Briefing..." : "Generate Executive Briefing"}
          </button>
        </div>
      </section>

      {/* Generated Report Frame */}
      {generatedReport ? (
        <section className="glass-panel rounded-[2rem] p-6 lg:p-8 space-y-6">
          
          {/* Metadata header row */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-5">
            <div>
              <p className="text-xs font-mono text-muted-foreground uppercase">Reference ID: {generatedReport.id}</p>
              <h2 className="text-2xl font-bold tracking-tight text-foreground mt-1">FIFA World Cup 2026 Operations Brief</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Generated on {generatedReport.timestamp} via {generatedReport.generatedBy}</p>
            </div>
            
            {/* Export buttons */}
            <div className="flex flex-wrap gap-2.5 no-print">
              <button
                onClick={handlePrint}
                className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full text-xs font-semibold border border-border bg-background/50 hover:bg-muted/70 h-9 px-4 transition"
              >
                <Printer className="mr-1.5 h-3.5 w-3.5 text-primary" />
                Print / Save PDF
              </button>
              <button
                onClick={handleExportJSON}
                className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full text-xs font-semibold border border-border bg-background/50 hover:bg-muted/70 h-9 px-4 transition"
              >
                <Code className="mr-1.5 h-3.5 w-3.5 text-[#28C76F]" />
                Export JSON
              </button>
            </div>
          </div>

          {/* Inner Navigation tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 border-b border-border/30 no-print no-scrollbar select-none">
            {reportTabs.map(t => (
              <button
                key={t.id}
                onClick={() => {
                  setActiveTab(t.id);
                  playSound('click');
                }}
                className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                  activeTab === t.id 
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab content rendering */}
          <div className="mt-4 min-h-[300px]">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-foreground">Operational Indicators</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-xl border border-border bg-muted/20 p-4">
                    <p className="text-xs text-muted-foreground font-semibold">Total Attendance</p>
                    <p className="text-2xl font-bold mt-1 text-foreground">{visitorsCount.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Arrival velocity: stable</p>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/20 p-4">
                    <p className="text-xs text-muted-foreground font-semibold">Venue Density Ratio</p>
                    <p className="text-2xl font-bold mt-1 text-[#FF9F43]">{crowdDensity}%</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Peak sectors: concourses</p>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/20 p-4">
                    <p className="text-xs text-muted-foreground font-semibold">Staff Deployments</p>
                    <p className="text-2xl font-bold mt-1 text-[#28C76F]">{activeVolunteers.deployed} deployed</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Standby reserve: {activeVolunteers.standby}</p>
                  </div>
                </div>
                <div className="rounded-xl border border-border p-4 bg-[color:var(--surface-muted)] text-sm leading-6 text-muted-foreground">
                  The venue operations center is maintaining a stable posture. Total ticketed spectators checked-in stands at **{visitorsCount.toLocaleString()}**. Global weather indices are positive at **{weather.temperature}** under **{weather.condition}**. Hydration alert levels are monitored but normal.
                </div>
              </div>
            )}

            {activeTab === 'crowd' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-foreground">Crowd Pressure Breakdown</h3>
                <div className="overflow-hidden rounded-xl border border-border">
                  <table className="w-full text-sm text-foreground">
                    <thead className="bg-muted/40 border-b border-border">
                      <tr>
                        <th className="h-10 px-4 text-left align-middle text-xs font-semibold text-muted-foreground">Zone</th>
                        <th className="h-10 px-4 text-left align-middle text-xs font-semibold text-muted-foreground">Density Load</th>
                        <th className="h-10 px-4 text-left align-middle text-xs font-semibold text-muted-foreground">Status Rating</th>
                        <th className="h-10 px-4 text-left align-middle text-xs font-semibold text-muted-foreground">Log Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stadiumZones.map(z => (
                        <tr key={z.name} className="border-b border-border/30 last:border-0">
                          <td className="px-4 py-3 align-middle font-medium text-foreground">{z.name}</td>
                          <td className="px-4 py-3 align-middle font-semibold text-foreground/80">{z.crowdPercent}%</td>
                          <td className="px-4 py-3 align-middle text-xs">
                            <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              z.status === 'red' ? 'bg-danger/10 text-danger' :
                              z.status === 'yellow' ? 'bg-warning/10 text-warning' :
                              'bg-success/10 text-success'
                            }`}>
                              {z.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-4 py-3 align-middle text-xs text-muted-foreground">{z.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'volunteers' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-foreground">Staffing & Marshal Allocations</h3>
                <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
                  <p className="text-sm text-foreground/90 font-medium">Shift coverage is sufficient across all primary security checks.</p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2 leading-6">
                    <li>Total marshalling team members on duty: <strong>{activeVolunteers.onDuty}</strong></li>
                    <li>Currently deployed at gates/concourse: <strong>{activeVolunteers.deployed}</strong></li>
                    <li>Retained at central control for emergency deployment: <strong>{activeVolunteers.standby}</strong></li>
                    <li>Next scheduled shift swap: <strong>{activeVolunteers.nextShift}</strong></li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-foreground">Security Escalation Feed</h3>
                <div className="overflow-hidden rounded-xl border border-border">
                  <table className="w-full text-sm text-foreground">
                    <thead className="bg-muted/40 border-b border-border">
                      <tr>
                        <th className="h-10 px-4 text-left align-middle text-xs font-semibold text-muted-foreground">Time</th>
                        <th className="h-10 px-4 text-left align-middle text-xs font-semibold text-muted-foreground">Incident Title</th>
                        <th className="h-10 px-4 text-left align-middle text-xs font-semibold text-muted-foreground">Severity Level</th>
                        <th className="h-10 px-4 text-left align-middle text-xs font-semibold text-muted-foreground">Incident Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {incidents.map(inc => (
                        <tr key={inc.id} className="border-b border-border/30 last:border-0">
                          <td className="px-4 py-3 align-middle font-mono text-xs text-muted-foreground">{inc.time}</td>
                          <td className="px-4 py-3 align-middle font-medium text-foreground/90">{inc.title}</td>
                          <td className="px-4 py-3 align-middle text-xs">
                            <span className="font-semibold text-danger">{inc.severity}</span>
                          </td>
                          <td className="px-4 py-3 align-middle text-xs text-muted-foreground">{inc.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'medical' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-foreground">Medical Incident Log</h3>
                <div className="rounded-xl border border-border bg-muted/20 p-4">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-5 w-5 text-[#28C76F]" />
                    <p className="text-sm font-semibold text-foreground">Active medical incident requests: {medicalAlertsCount}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 leading-5">
                    All currently logged medical requests are low-priority first-aid assistance. Hydration stations are fully stocked and active across spectator flow paths.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'sustainability' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-foreground">Sustainability & Waste Metrics</h3>
                <div className="grid gap-4 sm:grid-cols-2 text-center">
                  <div className="rounded-xl border border-border bg-card p-4">
                    <p className="text-xs text-muted-foreground font-semibold">Green Energy Utilisation</p>
                    <p className="text-2xl font-bold mt-1 text-[#28C76F]">84%</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Solar array offsets active</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4">
                    <p className="text-xs text-muted-foreground font-semibold">Waste Recycled Ratio</p>
                    <p className="text-2xl font-bold mt-1 text-[#28C76F]">76%</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Target threshold: 75%</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-foreground">Google Gemini AI Guidance Digest</h3>
                {aiRecommendation ? (
                  <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-primary uppercase">Grounding Summary</p>
                      <p className="text-sm text-foreground/80 leading-6 mt-1">{aiRecommendation.stadiumSummary}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-primary uppercase">Recommended Actions</p>
                      <ul className="list-decimal pl-5 mt-2 text-sm text-foreground/80 space-y-1">
                        {aiRecommendation.recommendedActions.map((action, i) => (
                          <li key={i}>{action}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No AI recommendation generated. Go to the dashboard to generate insights.</p>
                )}
              </div>
            )}
          </div>

        </section>
      ) : (
        <div className="rounded-[2rem] border border-border border-dashed p-16 text-center text-muted-foreground">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-60 mb-3" />
          <p className="text-sm font-semibold">No operational report generated yet</p>
          <p className="text-xs mt-1">Click the button above to synthesize the current stadium snapshot into an executive-ready operational briefing.</p>
        </div>
      )}
    </AppShell>
  );
}
