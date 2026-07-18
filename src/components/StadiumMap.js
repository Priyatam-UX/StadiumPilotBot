"use client";
import React, { useState } from 'react';
import { useOperations } from '@/context/OperationsContext';
import { MapPinned } from 'lucide-react';

export default function StadiumMap() {
  const { stadiumZones, playSound, crowdHeatmap, zoneHighlight } = useOperations();
  const [hoveredZone, setHoveredZone] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);

  // Status-specific color mapping for SVGs
  const getStatusColor = (status) => {
    switch (status) {
      case 'red': return '#EA5455';
      case 'yellow': return '#FF9F43';
      case 'green':
      default:
        return '#28C76F';
    }
  };

  const getBorderColor = (status) => {
    switch (status) {
      case 'red': return 'rgba(234,84,85,0.4)';
      case 'yellow': return 'rgba(255,159,67,0.4)';
      case 'green':
      default:
        return 'rgba(40,199,111,0.4)';
    }
  };

  // Find the details of the zone currently being inspected
  const currentHoverDetails = stadiumZones.find(z => z.name === hoveredZone);
  const currentSelectDetails = stadiumZones.find(z => z.name === selectedZone);

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_280px]">
      
      {/* Interactive Map SVG Wrapper */}
      <div className="relative overflow-hidden rounded-[1.5rem] border border-border bg-card/85 p-4 min-h-[420px] flex items-center justify-center">
        
        {/* Floating Tooltip/Hover card overlay */}
        <div className="absolute left-4 top-4 z-10 rounded-2xl border border-border bg-[color:var(--surface-strong)] px-4 py-3 shadow-lg min-w-[160px]">
          <p className="text-[9px] uppercase tracking-[0.28em] text-muted-foreground">Inspecting Area</p>
          {currentHoverDetails ? (
            <div className="mt-1">
              <p className="text-sm font-semibold text-foreground">{currentHoverDetails.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`h-2 w-2 rounded-full`} style={{ backgroundColor: getStatusColor(currentHoverDetails.status) }} />
                <span className="text-xs font-semibold">{currentHoverDetails.crowdPercent}% Density</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1 leading-4">{currentHoverDetails.note}</p>
            </div>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">Hover a zone to inspect</p>
          )}
        </div>

        <svg viewBox="0 0 100 100" className="h-[380px] w-full max-w-[460px] select-none">
          <defs>
            <linearGradient id="pitch-grad" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#11304f" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0a1d34" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          
          {/* Stadium outer bowls design */}
          <ellipse cx="50" cy="50" rx="46" ry="42" fill="none" stroke="var(--border)" strokeWidth="1" />
          <ellipse cx="50" cy="50" rx="38" ry="34" fill="rgba(255,255,255,0.02)" stroke="var(--border)" strokeWidth="0.6" strokeDasharray="2,2" />
          
          {/* Loop over the structured zones and render SVG shapes */}
          {stadiumZones.map((zone) => {
            const isHovered = hoveredZone === zone.name;
            const isSelected = selectedZone === zone.name;
            
            const color = crowdHeatmap ? getStatusColor(zone.status) : 'rgba(148, 163, 184, 0.2)';
            const border = crowdHeatmap ? getBorderColor(zone.status) : 'rgba(148, 163, 184, 0.4)';
            const actualColor = getStatusColor(zone.status);
            
            return (
              <g 
                key={zone.name}
                onMouseEnter={() => setHoveredZone(zone.name)}
                onMouseLeave={() => setHoveredZone(null)}
                onClick={() => {
                  setSelectedZone(zone.name === selectedZone ? null : zone.name);
                  playSound('click');
                }}
                className="cursor-pointer focus:outline-none"
                tabIndex={0}
                role="button"
                aria-label={`Inspect ${zone.name}`}
              >
                {/* Rect representing the zone */}
                <rect 
                  x={zone.x} 
                  y={zone.y} 
                  width={zone.width} 
                  height={zone.height} 
                  rx={zone.name === "Main Pitch" ? 4 : 3}
                  fill={zone.name === "Main Pitch" ? "url(#pitch-grad)" : color}
                  stroke={isSelected ? '#00AEEF' : border}
                  strokeWidth={isSelected ? 1.5 : 0.8}
                  className="transition-all duration-200"
                  opacity={isHovered ? 0.95 : (isSelected ? 0.9 : 0.72)}
                  style={{
                    filter: (zoneHighlight && (isHovered || (zone.status === 'red' && zone.name !== 'Main Pitch'))) ? `drop-shadow(0 0 5px ${actualColor})` : 'none'
                  }}
                />
                {/* Zone text labels inside shapes */}
                <text 
                  x={zone.x + zone.width / 2} 
                  y={zone.y + zone.height / 2} 
                  textAnchor="middle" 
                  dominantBaseline="middle" 
                  className="fill-white text-[3.8px] font-semibold pointer-events-none"
                >
                  {zone.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Zone status details sidebar list */}
      <div className="space-y-3">
        <div className="rounded-[1.4rem] border border-border bg-card/85 p-4 max-h-[420px] overflow-y-auto no-scrollbar">
          <p className="text-[10px] uppercase tracking-[0.26em] text-muted-foreground flex items-center gap-1.5 mb-3">
            <MapPinned className="h-3 w-3 text-primary" /> Active Zone Status
          </p>
          <div className="space-y-2">
            {stadiumZones.map((zone) => {
              const color = getStatusColor(zone.status);
              const isSelected = selectedZone === zone.name;
              
              return (
                <button
                  key={zone.name}
                  type="button"
                  onClick={() => {
                    setSelectedZone(zone.name === selectedZone ? null : zone.name);
                    playSound('click');
                  }}
                  className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left transition-all duration-200 ${
                    isSelected 
                      ? 'border-primary bg-primary/10 shadow-sm' 
                      : 'border-border bg-muted/30 hover:border-primary/20 hover:bg-muted/50'
                  }`}
                >
                  <div>
                    <p className="text-xs font-semibold text-foreground">{zone.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate max-w-[140px]">{zone.note}</p>
                  </div>
                  <div 
                    className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wide"
                    style={{ 
                      borderColor: `${color}40`,
                      backgroundColor: `${color}12`,
                      color: color
                    }}
                  >
                    {zone.crowdPercent}%
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
    </div>
  );
}
