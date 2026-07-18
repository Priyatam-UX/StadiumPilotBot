import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req) {
  try {
    // Basic Rate Limiting check or size validation
    const body = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const { prompt, history, snapshot, demoMode } = body;

    // Sanitize and Validate Prompt
    if (typeof prompt !== 'string' || prompt.trim() === '') {
      return NextResponse.json({ error: "Prompt is required and must be a string" }, { status: 400 });
    }
    if (prompt.length > 2000) {
      return NextResponse.json({ error: "Prompt exceeds maximum allowed length" }, { status: 400 });
    }

    // Strip HTML/Script tags to prevent potential XSS injection
    const sanitizedPrompt = prompt.replace(/<[^>]*>/g, '').trim();

    // Validate history
    if (history && !Array.isArray(history)) {
      return NextResponse.json({ error: "History must be an array" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const isMock = demoMode || !apiKey;
    
    if (isMock) {
      const lowerPrompt = sanitizedPrompt.toLowerCase();
      let reply = "";
      
      const sortedZones = [...(snapshot?.zones || [])].sort((a, b) => b.load - a.load);
      const busiestZone = sortedZones[0]?.name || "North Gate";
      const busiestLoad = sortedZones[0]?.load || 86;
      
      // Match keywords to provide extremely custom, dynamic answers
      if (lowerPrompt.includes("zone") || lowerPrompt.includes("attention") || lowerPrompt.includes("crowded")) {
        reply = `Looking at the current map snapshot, **${busiestZone}** requires immediate attention, currently operating at **${busiestLoad}% crowd density**. Concourse spill risks are elevated. ${sortedZones[1] ? `**${sortedZones[1].name}** is also on alert at **${sortedZones[1].load}%** load.` : ""}`;
      } else if (lowerPrompt.includes("volunteer") || lowerPrompt.includes("steward") || lowerPrompt.includes("staff")) {
        reply = `We have **${snapshot?.volunteers || 132} volunteers deployed** on duty with **16 volunteers on standby** at the central hub. Recommendation: deploy 8 standby volunteers immediately to **${busiestZone}** to manage lanes, and 4 volunteers to assist with flow redirects at the surrounding concourses.`;
      } else if (lowerPrompt.includes("medical") || lowerPrompt.includes("health")) {
        reply = `There are currently **${snapshot?.medicalAlerts || 3} medical alerts** active. All are minor first-aid requests (heat exhaustion and hydration relief). Medical teams are stationed at Central, Gate A, and VIP bays. Coverage is currently sufficient, but shift rotations should ensure hydration booths remain active.`;
      } else if (lowerPrompt.includes("risk") || lowerPrompt.includes("danger") || lowerPrompt.includes("incident")) {
        const activeIncidents = snapshot?.incidents || [];
        reply = `The highest operational risk is queue congestion leading to plaza spillover at **${busiestZone}**. Additionally, we have **${activeIncidents.length} active incidents** in the control feed: ${
          activeIncidents.map(i => `\n- **${i.title}** (${i.severity} severity) started at ${i.time}`).join('')
        }. Focus is on clearing the North concourse and maintaining vehicle shuttle flow at the parking slots.`;
      } else if (lowerPrompt.includes("weather") || lowerPrompt.includes("rain") || lowerPrompt.includes("temp")) {
        reply = `Current conditions are **${snapshot?.weather?.condition || 'Clear skies'}** at **${snapshot?.weather?.temperature || '31°C'}** (humidity: ${snapshot?.weather?.humidity || '46%'}). Spectator heat exhaustion index is low-medium. No weather interruptions predicted.`;
      } else {
        reply = `Based on the latest stadium operations snapshot: Total visitors stands at **${snapshot?.visitors?.toLocaleString() || '48,120'}**, global crowd density is **${snapshot?.density || '78'}%**, and shuttle transit kapacities are stable at **${snapshot?.transport || '92'}%**. Busiest zone is **${busiestZone}** (${busiestLoad}% density). Please let me know what specific coordinates or deployments you would like to coordinate.`;
      }

      await new Promise(resolve => setTimeout(resolve, 600));
      return NextResponse.json({ reply });
    }
    
    // Real Gemini call
    const genAI = new GoogleGenerativeAI(apiKey);
    
    const systemPrompt = `
      You are StadiumPilot AI, the decision support system for the FIFA World Cup 2026 Operations Command Center.
      You are grounding all answers in the current stadium status snapshot:
      ${JSON.stringify(snapshot)}
      
      Respond directly, clearly, and concisely as an AI operations assistant. Answer operations and crowd questions only.
    `;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      systemInstruction: {
        role: "system",
        parts: [{ text: systemPrompt }]
      }
    });

    // Package history in correct format for Gemini SDK if provided
    const chat = model.startChat({
      history: history.slice(-6) // Send last 3 exchanges to preserve token limits
    });

    const result = await chat.sendMessage(sanitizedPrompt);
    return NextResponse.json({ reply: result.response.text() });
    
  } catch (e) {
    console.error("AI Chat API failed:", e);
    return NextResponse.json({ error: "API Failure", details: e.message }, { status: 500 });
  }
}
