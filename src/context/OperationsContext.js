"use client";
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const OperationsContext = createContext();

export function useOperations() {
  return useContext(OperationsContext);
}

export function OperationsProvider({ children }) {
  // --- Settings States ---
  const [theme] = useState('dark');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState('Venue Organizer');
  const [compactMode, setCompactMode] = useState(false);
  const [animations, setAnimations] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [enableAIRecommendations, setEnableAIRecommendations] = useState(true);
  const [enableAIAssistant, setEnableAIAssistant] = useState(true);
  const [enableDemoMode, setEnableDemoMode] = useState(true);
  const [autoAIRefresh, setAutoAIRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [liveDataActive, setLiveDataActive] = useState(true);
  const [crowdHeatmap, setCrowdHeatmap] = useState(true);
  const [zoneHighlight, setZoneHighlight] = useState(true);
  const [weatherWidget, setWeatherWidget] = useState(true);
  const [crowdPrediction, setCrowdPrediction] = useState(true);
  const [transportStatusActive, setTransportStatusActive] = useState(true);
  const [sustainabilityActive, setSustainabilityActive] = useState(true);
  
  const [alerts, setAlerts] = useState({
    crowd: true,
    medical: true,
    security: true,
    transport: true,
    weather: true,
    emergency: true,
  });
  const [responseSpeed, setResponseSpeed] = useState('Balanced');

  // --- Dynamic Dashboard States ---
  const [visitorsCount, setVisitorsCount] = useState(48120);
  const [crowdDensity, setCrowdDensity] = useState(78);
  const [activeVolunteers, setActiveVolunteers] = useState({
    onDuty: 148,
    deployed: 132,
    standby: 16,
    nextShift: "15:30"
  });
  const [medicalAlertsCount, setMedicalAlertsCount] = useState(3);
  const [securityAlertsCount, setSecurityAlertsCount] = useState(5);
  const [transportCapacity, setTransportCapacity] = useState(92);

  const [incidents, setIncidents] = useState([
    { id: 1, time: "14:18", title: "North Gate queue expansion", severity: "High", status: "Active" },
    { id: 2, time: "14:12", title: "Shuttle bay delay cleared", severity: "Medium", status: "Resolved" },
    { id: 3, time: "13:58", title: "VIP lane credential check", severity: "Low", status: "Monitoring" },
  ]);

  const [stadiumZones, setStadiumZones] = useState([
    { name: "Gate A", crowdPercent: 32, status: "green", x: 5, y: 34, width: 20, height: 13, note: "Primary ingress lane" },
    { name: "Gate B", crowdPercent: 74, status: "yellow", x: 5, y: 53, width: 20, height: 13, note: "Queue pressure building" },
    { name: "Main Pitch", crowdPercent: 11, status: "green", x: 31, y: 28, width: 38, height: 30, note: "Clear field of play" },
    { name: "Gate C", crowdPercent: 89, status: "red", x: 75, y: 34, width: 20, height: 13, note: "Concourse spill risk" },
    { name: "Gate D", crowdPercent: 47, status: "green", x: 75, y: 53, width: 20, height: 13, note: "Stable departures" },
    { name: "Food Court", crowdPercent: 63, status: "yellow", x: 31, y: 10, width: 30, height: 14, note: "Dwell time elevated" },
    { name: "Medical", crowdPercent: 18, status: "green", x: 66, y: 10, width: 29, height: 14, note: "Low occupancy" },
    { name: "Parking", crowdPercent: 58, status: "yellow", x: 5, y: 76, width: 32, height: 13, note: "Transport demand rising" },
    { name: "VIP Area", crowdPercent: 21, status: "green", x: 63, y: 76, width: 32, height: 13, note: "Controlled access" },
  ]);

  const [weather, setWeather] = useState({
    condition: "Clear skies",
    temperature: "31°C",
    humidity: "46%",
    wind: "12 km/h NE",
    city: "Dallas",
    advisory: "Heat load is manageable, but hydration support should remain visible in public routes.",
    isLive: false,
  });
  const [weatherLoading, setWeatherLoading] = useState(false);

  const [trends, setTrends] = useState([
    { time: "14:00", crowdIndex: 64, throughput: 72 },
    { time: "14:10", crowdIndex: 68, throughput: 69 },
    { time: "14:20", crowdIndex: 72, throughput: 66 },
    { time: "14:30", crowdIndex: 76, throughput: 63 },
    { time: "14:40", crowdIndex: 78, throughput: 61 },
    { time: "14:50", crowdIndex: 80, throughput: 59 },
  ]);

  // --- AI Insights States ---
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  // --- Chat Assistant States ---
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Welcome to the StadiumPilot AI Command Assistant. I am grounded in the live stadium operations snapshot. Ask me about crowd flow, staff deployments, transport status, or incident response.",
      timestamp: "14:18"
    }
  ]);
  const [loadingChat, setLoadingChat] = useState(false);

  // --- Web Audio Synthesizer (Zero asset sound effects) ---
  const playSound = (type) => {
    if (!soundEffects || typeof window === 'undefined') return;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'alert') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.setValueAtTime(1046.5, ctx.currentTime + 0.15);
        osc.frequency.setValueAtTime(1318.5, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
        osc.start();
        osc.stop(ctx.currentTime + 0.45);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3); // C6
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      }
    } catch (e) {
      console.warn("Audio Context failed to start:", e);
    }
  };

  // --- Live Weather Data Fetcher ---
  const fetchLiveWeather = async (city = 'dallas') => {
    setWeatherLoading(true);
    try {
      const res = await fetch(`/api/weather?city=${city}`);
      if (!res.ok) throw new Error('Weather fetch failed');
      const data = await res.json();
      setWeather({
        condition: data.condition,
        temperature: data.temperature,
        humidity: data.humidity,
        wind: data.wind,
        city: data.city,
        advisory: data.advisory,
        isLive: data.isLive,
      });
    } catch (e) {
      console.error('Weather fetch error:', e);
    } finally {
      setWeatherLoading(false);
    }
  };

  // Fetch weather on mount and refresh every 5 minutes
  useEffect(() => {
    fetchLiveWeather();
    const weatherInterval = setInterval(() => fetchLiveWeather(), 5 * 60 * 1000);
    return () => clearInterval(weatherInterval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Persistent Settings Sync ---
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.className = 'dark';
      
      const storedCompact = localStorage.getItem('sp-compact');
      if (storedCompact) setCompactMode(storedCompact === 'true');

      const storedSounds = localStorage.getItem('sp-sounds');
      if (storedSounds) setSoundEffects(storedSounds === 'true');

      const storedAnims = localStorage.getItem('sp-anims');
      if (storedAnims) setAnimations(storedAnims === 'true');
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sp-anims', animations.toString());
      if (animations) {
        document.body.classList.remove('no-animations');
      } else {
        document.body.classList.add('no-animations');
      }
    }
  }, [animations]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sp-compact', compactMode.toString());
    }
  }, [compactMode]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sp-sounds', soundEffects.toString());
    }
  }, [soundEffects]);

  // --- Dynamic Live Data Simulation ---
  useEffect(() => {
    if (!liveDataActive) return;

    const interval = setInterval(() => {
      // 1. Visitors fluctuate upwards
      setVisitorsCount(prev => prev + Math.floor(Math.random() * 20) - 5);
      
      // 2. Crowd Density shifts slightly
      setCrowdDensity(prev => {
        const delta = Math.floor(Math.random() * 3) - 1;
        const next = Math.max(50, Math.min(95, prev + delta));
        return next;
      });

      // 3. Fluctuate zone loads
      setStadiumZones(prev => 
        prev.map(z => {
          if (z.name === "Main Pitch") return z; // Always empty/green
          const change = Math.floor(Math.random() * 5) - 2;
          const nextPercent = Math.max(10, Math.min(98, z.crowdPercent + change));
          let nextStatus = "green";
          if (nextPercent > 80) nextStatus = "red";
          else if (nextPercent > 60) nextStatus = "yellow";
          return { ...z, crowdPercent: nextPercent, status: nextStatus };
        })
      );

      // 4. Update Recharts trends occasionally
      setTrends(prev => {
        const last = prev[prev.length - 1];
        const nextTime = (() => {
          const [h, m] = last.time.split(':').map(Number);
          const nextM = (m + 10) % 60;
          const nextH = nextM === 0 ? (h + 1) % 24 : h;
          return `${String(nextH).padStart(2, '0')}:${String(nextM).padStart(2, '0')}`;
        })();
        const nextIndex = Math.max(50, Math.min(95, last.crowdIndex + Math.floor(Math.random() * 5) - 2));
        const nextThrough = Math.max(40, Math.min(90, last.throughput + Math.floor(Math.random() * 4) - 2));
        
        return [...prev.slice(1), { time: nextTime, crowdIndex: nextIndex, throughput: nextThrough }];
      });
    }, 6000); // Shift state every 6 seconds for realistic dashboard animation

    return () => clearInterval(interval);
  }, [liveDataActive]);

  // --- Generate AI operational recommendations ---
  const generateAIRecommendations = async () => {
    setLoadingInsights(true);
    playSound('click');
    
    const snapshot = {
      visitors: visitorsCount,
      density: crowdDensity,
      volunteers: activeVolunteers.deployed,
      medicalAlerts: medicalAlertsCount,
      securityAlerts: securityAlertsCount,
      transport: transportCapacity,
      zones: stadiumZones.map(z => ({ name: z.name, load: z.crowdPercent, status: z.status })),
      incidents: incidents.filter(i => i.status === "Active"),
      weather: weather
    };

    try {
      const res = await fetch('/api/ai/recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ snapshot, demoMode: enableDemoMode })
      });
      const data = await res.json();
      setAiRecommendation(data);
      playSound('success');
    } catch (e) {
      console.error("AI Insights API error:", e);
    } finally {
      setLoadingInsights(false);
    }
  };

  // --- Send message to operations assistant ---
  const sendMessageToAssistant = async (text) => {
    if (!text.trim()) return;
    playSound('click');

    const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const userMsg = { id: Date.now(), sender: 'user', text, timestamp };
    setMessages(prev => [...prev, userMsg]);
    setLoadingChat(true);

    const snapshot = {
      visitors: visitorsCount,
      density: crowdDensity,
      volunteers: activeVolunteers.deployed,
      medicalAlerts: medicalAlertsCount,
      securityAlerts: securityAlertsCount,
      transport: transportCapacity,
      zones: stadiumZones.map(z => ({ name: z.name, load: z.crowdPercent, status: z.status })),
      incidents: incidents.filter(i => i.status === "Active"),
      weather: weather
    };

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          history: messages.map(m => ({ role: m.sender === 'ai' ? 'model' : 'user', parts: [{ text: m.text }] })),
          snapshot,
          demoMode: enableDemoMode
        })
      });
      const data = await res.json();
      
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        structured: data.structured || null
      };
      
      setMessages(prev => [...prev, aiMsg]);
      playSound('success');
    } catch (e) {
      console.error("Assistant chat error:", e);
    } finally {
      setLoadingChat(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        sender: "ai",
        text: "Conversation cleared. Grounded details refreshed. Ask me any operations queries.",
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
      }
    ]);
    playSound('click');
  };

  // --- Auto-trigger initial AI insights on load ---
  useEffect(() => {
    if (!aiRecommendation && enableAIRecommendations) {
      generateAIRecommendations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableAIRecommendations]);

  return (
    <OperationsContext.Provider value={{
      // Config states
      theme, 
      mobileSidebarOpen, setMobileSidebarOpen, 
      currentRole, setCurrentRole,
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
      
      // Data states
      visitorsCount,
      crowdDensity,
      activeVolunteers,
      medicalAlertsCount, setMedicalAlertsCount,
      securityAlertsCount, setSecurityAlertsCount,
      transportCapacity,
      incidents, setIncidents,
      stadiumZones, setStadiumZones,
      weather, weatherLoading, fetchLiveWeather,
      trends,
      
      // AI insights
      aiRecommendation,
      loadingInsights,
      generateAIRecommendations,
      
      // Chat
      messages,
      loadingChat,
      sendMessageToAssistant,
      clearChat,
      
      // Synthesizer
      playSound
    }}>
      {children}
    </OperationsContext.Provider>
  );
}
