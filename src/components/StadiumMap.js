"use client";
import React, { useState, useEffect } from 'react';
import { useOperations } from '@/context/OperationsContext';
import { MapPinned, Radio } from 'lucide-react';

// Floating particle positions seeded at startup
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  cx: 8 + (i * 4.2) % 84,
  cy: 8 + (i * 6.7) % 84,
  r: 0.4 + (i % 3) * 0.35,
  dur: 3 + (i % 5),
  delay: (i * 0.4) % 5,
  dx: i % 2 === 0 ? 5 : -5,
  dy: i % 3 === 0 ? 6 : -4,
}));

// Ripple ping rings rendered per zone status
function ZonePingRing({ cx, cy, color, delay }) {
  return (
    <circle cx={cx} cy={cy} r="0" fill="none" stroke={color} strokeWidth="0.6" opacity="0">
      <animate attributeName="r" values="0;7;13" dur="2.6s" begin={`${delay}s`} repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.8;0.3;0" dur="2.6s" begin={`${delay}s`} repeatCount="indefinite" />
    </circle>
  );
}

// Animated horizontal scan line sweeping L to R
function ScanLine() {
  return (
    <line x1="0" y1="25" x2="0" y2="75" stroke="rgba(0,174,239,0.18)" strokeWidth="0.5">
      <animateTransform attributeName="transform" type="translate" values="-5,0;105,0;-5,0" dur="5s" repeatCount="indefinite" calcMode="linear" />
    </line>
  );
}

// Rotating radar sweep wedge
function RadarWedge() {
  return (
    <g transform="translate(50,50)">
      {/* Gradient fill wedge */}
      <path d="M0,0 L0,-36 A36,32 0 0,1 9,-35 Z" fill="rgba(0,174,239,0.25)" opacity="0.7">
        <animateTransform attributeName="transform" type="rotate" values="0;360" dur="4s" repeatCount="indefinite" calcMode="linear" />
      </path>
      {/* Leading edge bright line */}
      <line x1="0" y1="0" x2="0" y2="-40" stroke="rgba(0,174,239,0.75)" strokeWidth="0.6">
        <animateTransform attributeName="transform" type="rotate" values="0;360" dur="4s" repeatCount="indefinite" calcMode="linear" />
      </line>
    </g>
  );
}

// Blinking orbit dot at a given angle
function OrbitNode({ angle, color }) {
  const rad = (angle * Math.PI) / 180;
  const cx = 50 + 45 * Math.cos(rad);
  const cy = 50 + 41 * Math.sin(rad);
  const delay = angle * 0.012;
  return (
    <circle cx={cx} cy={cy} r="1" fill={color} opacity="0">
      <animate attributeName="opacity" values="0;1;0" dur="2s" begin={`${delay}s`} repeatCount="indefinite" />
      <animate attributeName="r" values="1;1.8;1" dur="2s" begin={`${delay}s`} repeatCount="indefinite" />
    </circle>
  );
}

export default function StadiumMap() {
  const { stadiumZones, playSound, crowdHeatmap, zoneHighlight } = useOperations();
  const [hoveredZone, setHoveredZone] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'red': return '#EA5455';
      case 'yellow': return '#FF9F43';
      case 'green': default: return '#28C76F';
    }
  };

  const getBorderColor = (status) => {
    switch (status) {
      case 'red': return 'rgba(234,84,85,0.55)';
      case 'yellow': return 'rgba(255,159,67,0.55)';
      case 'green': default: return 'rgba(40,199,111,0.45)';
    }
  };

  const currentHoverDetails = stadiumZones.find(z => z.name === hoveredZone);

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_280px]">

      {/* Interactive Map SVG Wrapper */}
      <div
        className="relative overflow-hidden rounded-[1.5rem] border border-border p-4 min-h-[420px] flex items-center justify-center"
        style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(0,30,60,0.9) 0%, rgba(2,8,23,1) 100%)' }}
      >

        {/* Floating inspection overlay */}
        <div className="absolute left-4 top-4 z-10 rounded-2xl border border-border bg-[color:var(--surface-strong)] px-4 py-3 shadow-lg min-w-[160px]">
          <p className="text-[9px] uppercase tracking-[0.28em] text-muted-foreground flex items-center gap-1">
            <Radio className="h-2.5 w-2.5 text-primary animate-pulse" /> Inspecting Area
          </p>
          {currentHoverDetails ? (
            <div className="mt-1">
              <p className="text-sm font-semibold text-foreground">{currentHoverDetails.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: getStatusColor(currentHoverDetails.status) }} />
                <span className="text-xs font-semibold">{currentHoverDetails.crowdPercent}% Density</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1 leading-4">{currentHoverDetails.note}</p>
            </div>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">Hover a zone to inspect</p>
          )}
        </div>

        {/* Corner status readout */}
        <div className="absolute bottom-4 right-4 z-10 text-right hidden xl:block">
          <p className="text-[8px] text-primary/60 font-mono uppercase tracking-wider">SYSTEM ONLINE</p>
          <p className="text-[8px] text-muted-foreground font-mono">Scan cycle: 4s</p>
        </div>

        <svg viewBox="0 0 100 100" className="h-[380px] w-full max-w-[480px] select-none overflow-visible">
          <defs>
            <linearGradient id="pitch-grad" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#11304f" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0a1d34" stopOpacity="0.9" />
            </linearGradient>
            <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(0,174,239,0.07)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="1.2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Bg radial glow */}
          <ellipse cx="50" cy="50" rx="48" ry="44" fill="url(#bgGlow)" />

          {/* Outer ring animated dashes */}
          <ellipse cx="50" cy="50" rx="46" ry="42" fill="none" stroke="rgba(0,174,239,0.2)" strokeWidth="0.5" strokeDasharray="4,4">
            <animate attributeName="stroke-dashoffset" values="0;-288" dur="14s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="50" cy="50" rx="38" ry="34" fill="rgba(255,255,255,0.015)" stroke="rgba(0,174,239,0.1)" strokeWidth="0.4" strokeDasharray="2,3">
            <animate attributeName="stroke-dashoffset" values="0;200" dur="22s" repeatCount="indefinite" />
          </ellipse>

          {/* Radar sweep */}
          <RadarWedge />

          {/* Horizontal scan line */}
          <ScanLine />

          {/* Ambient floating particles */}
          {PARTICLES.map(p => (
            <circle key={p.id} r={p.r} fill="rgba(0,174,239,0.6)" opacity="0">
              <animate attributeName="cx" values={`${p.cx};${p.cx + p.dx};${p.cx}`} dur={`${p.dur}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
              <animate attributeName="cy" values={`${p.cy};${p.cy + p.dy};${p.cy}`} dur={`${p.dur + 1}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.65;0" dur={`${p.dur}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
            </circle>
          ))}

          {/* Orbit blink nodes */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <OrbitNode
              key={angle}
              angle={angle}
              color={i % 3 === 0 ? '#EA5455' : i % 3 === 1 ? '#28C76F' : '#00AEEF'}
            />
          ))}

          {/* Stadium zones */}
          {stadiumZones.map((zone) => {
            const isHovered = hoveredZone === zone.name;
            const isSelected = selectedZone === zone.name;
            const fillColor = crowdHeatmap ? getStatusColor(zone.status) : 'rgba(148, 163, 184, 0.2)';
            const strokeColor = crowdHeatmap ? getBorderColor(zone.status) : 'rgba(148, 163, 184, 0.4)';
            const statusColor = getStatusColor(zone.status);
            const cx = zone.x + zone.width / 2;
            const cy = zone.y + zone.height / 2;
            const isWarning = zone.name !== "Main Pitch" && (zone.status === "red" || zone.status === "yellow");

            return (
              <g
                key={zone.name}
                onMouseEnter={() => setHoveredZone(zone.name)}
                onMouseLeave={() => setHoveredZone(null)}
                onClick={() => {
                  setSelectedZone(zone.name === selectedZone ? null : zone.name);
                  playSound('click');
                }}
                className="cursor-pointer"
                tabIndex={0}
                role="button"
                aria-label={`Inspect ${zone.name}`}
                style={{
                  filter: isHovered
                    ? `drop-shadow(0 0 5px ${statusColor})`
                    : isSelected
                    ? 'drop-shadow(0 0 7px #00AEEF)'
                    : 'none',
                  transition: 'filter 0.3s ease',
                }}
              >
                {/* Ping ripple rings for alert zones */}
                {zoneHighlight && isWarning && (
                  <>
                    <ZonePingRing cx={cx} cy={cy} color={statusColor} delay={0} />
                    <ZonePingRing cx={cx} cy={cy} color={statusColor} delay={1.3} />
                  </>
                )}

                {/* Zone rect with breathing animation */}
                <rect
                  x={zone.x}
                  y={zone.y}
                  width={zone.width}
                  height={zone.height}
                  rx={zone.name === "Main Pitch" ? 4 : 3}
                  fill={zone.name === "Main Pitch" ? "url(#pitch-grad)" : fillColor}
                  stroke={isSelected ? '#00AEEF' : strokeColor}
                  strokeWidth={isSelected ? 1.5 : 0.8}
                  opacity={isHovered ? 1 : isSelected ? 0.92 : 0.78}
                >
                  {isWarning && (
                    <animate
                      attributeName="opacity"
                      values={zone.status === "red" ? "0.75;0.97;0.75" : "0.78;0.92;0.78"}
                      dur={zone.status === "red" ? "1.6s" : "2.5s"}
                      repeatCount="indefinite"
                    />
                  )}
                </rect>

                {/* Selected zone pulsing glow border */}
                {isSelected && (
                  <rect
                    x={zone.x - 0.8}
                    y={zone.y - 0.8}
                    width={zone.width + 1.6}
                    height={zone.height + 1.6}
                    rx={zone.name === "Main Pitch" ? 5 : 3.5}
                    fill="none"
                    stroke="#00AEEF"
                    strokeWidth="0.9"
                    opacity="0"
                    filter="url(#glow)"
                  >
                    <animate attributeName="opacity" values="0;0.9;0" dur="1.2s" repeatCount="indefinite" />
                  </rect>
                )}

                {/* Zone name */}
                <text
                  x={cx}
                  y={cy - (crowdHeatmap ? 2 : 0)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="3.6"
                  fontWeight="600"
                  fill="white"
                  className="pointer-events-none"
                >
                  {zone.name}
                </text>

                {/* Crowd percent badge inside zone */}
                {crowdHeatmap && (
                  <text
                    x={cx}
                    y={cy + 4}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="2.6"
                    fill={statusColor}
                    opacity="0.9"
                    className="pointer-events-none"
                  >
                    {zone.crowdPercent}%
                  </text>
                )}
              </g>
            );
          })}

          {/* Center crosshairs */}
          <line x1="50" y1="44" x2="50" y2="56" stroke="rgba(255,255,255,0.05)" strokeWidth="0.3" />
          <line x1="44" y1="50" x2="56" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="0.3" />
          <circle cx="50" cy="50" r="1.4" fill="none" stroke="rgba(0,174,239,0.4)" strokeWidth="0.5">
            <animate attributeName="r" values="1.4;2.8;1.4" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0.85;0.4" dur="3s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>

      {/* Zone status sidebar */}
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
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{
                        backgroundColor: color,
                        boxShadow: zone.status !== 'green' ? `0 0 6px ${color}` : 'none',
                      }}
                    />
                    <div>
                      <p className="text-xs font-semibold text-foreground">{zone.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate max-w-[130px]">{zone.note}</p>
                    </div>
                  </div>
                  <div
                    className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wide shrink-0"
                    style={{
                      borderColor: `${color}40`,
                      backgroundColor: `${color}12`,
                      color,
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

