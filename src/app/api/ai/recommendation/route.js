import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req) {
  try {
    const body = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const { snapshot, demoMode } = body;
    
    // Check if snapshot is valid object
    if (snapshot && typeof snapshot !== 'object') {
      return NextResponse.json({ error: "Invalid snapshot format" }, { status: 400 });
    }

    // Check if we should run in mock/simulation mode
    const apiKey = process.env.GEMINI_API_KEY;
    const isMock = demoMode || !apiKey;
    
    if (isMock) {
      // Find high occupancy zones to make mock answers extremely realistic
      const sortedZones = [...(snapshot?.zones || [])].sort((a, b) => b.load - a.load);
      const busiestZone = sortedZones[0]?.name || "North Gate";
      const busiestLoad = sortedZones[0]?.load || 86;
      
      // Simulate recommendation grounded in current metrics
      const mockResponse = {
        stadiumSummary: `${busiestZone} is currently the highest-pressure area on site with an occupancy load of ${busiestLoad}%. Ingress flow is entering peak rates. Movement remains controlled, but dwell times at adjacent plazas are beginning to climb.`,
        aiPrediction: `Crowd pressure at ${busiestZone} is projected to exceed the safety buffer in 8 minutes and reach critical capacity within 15 minutes if active gates are not supplemented.`,
        aiReasoning: `Current visitor volume is climbing by +4.8% and active volunteer coverage stands at ${snapshot?.volunteers || 132} deployed. The current incident count shows ${snapshot?.incidents?.length || 1} active emergency events requiring control room focus.`,
        recommendedActions: [
          `Open auxiliary gates at ${busiestZone} immediately to redistribute queue pressure.`,
          `Relocate 8 volunteers from standby to support transit directions near the concourse.`,
          `Activate secondary directional signage board systems on approach lanes.`,
          `Alert first-aid station ${snapshot?.medicalAlerts > 2 ? 'units' : 'reserve staffs'} for precautionary coverage.`
        ],
        priority: busiestLoad > 80 ? "Critical" : (busiestLoad > 65 ? "High" : "Medium"),
        confidenceScore: Math.floor(Math.random() * 10) + 85 // 85-95%
      };
      
      // Simulate delay for realism
      await new Promise(resolve => setTimeout(resolve, 800));
      return NextResponse.json(mockResponse);
    }
    
    // Real Gemini API call
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const systemPrompt = `
      You are StadiumPilot AI, the decision support system for the FIFA World Cup 2026 Operations Command Center.
      Analyze the provided stadium operations metrics snapshot and generate a structured JSON report.
      
      Return ONLY a JSON object matching this schema:
      {
        "stadiumSummary": "A concise operational summary highlighting critical areas.",
        "aiPrediction": "Predictive warnings of crowd density risks or bottlenecks (e.g. within 15 mins).",
        "aiReasoning": "Contextual reasoning based on incidents, weather, volunteers, and zone metrics.",
        "recommendedActions": ["List of 3-4 specific tactical actions for organizers to take."],
        "priority": "Critical" | "High" | "Medium" | "Low",
        "confidenceScore": 85
      }
    `;

    const userPrompt = `Current Stadium Snapshot: ${JSON.stringify(snapshot)}`;

    const result = await model.generateContent([
      { text: systemPrompt },
      { text: userPrompt }
    ]);
    
    const text = result.response.text();
    const parsed = JSON.parse(text.trim());
    return NextResponse.json(parsed);
    
  } catch (e) {
    console.error("AI Recommendation API failed:", e);
    return NextResponse.json({ error: "API Failure", details: e.message }, { status: 500 });
  }
}
