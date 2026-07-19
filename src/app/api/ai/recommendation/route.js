import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Only models confirmed available on v1beta as of July 2026
const MODEL_FALLBACKS = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-preview-04-17",
  "gemini-3.5-flash",
];

export async function POST(req) {
  try {
    const body = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const { snapshot, demoMode } = body;
    
    if (snapshot && typeof snapshot !== 'object') {
      return NextResponse.json({ error: "Invalid snapshot format" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const isMock = demoMode || !apiKey;
    
    if (isMock) {
      const sortedZones = [...(snapshot?.zones || [])].sort((a, b) => b.load - a.load);
      const busiestZone = sortedZones[0]?.name || "North Gate";
      const busiestLoad = sortedZones[0]?.load || 86;
      
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
        confidenceScore: Math.floor(Math.random() * 10) + 85
      };
      
      await new Promise(resolve => setTimeout(resolve, 800));
      return NextResponse.json(mockResponse);
    }
    
    const systemPrompt = `
      You are StadiumPilot AI, the decision support system for the FIFA World Cup 2026 Operations Command Center.
      Analyze the provided stadium operations metrics snapshot and generate a structured JSON report.
      
      Return ONLY a JSON object matching this schema:
       {
         "stadiumSummary": "A concise operational summary highlighting critical areas.",
         "aiPrediction": "Predictive warnings of crowd density risks or bottlenecks.",
         "aiReasoning": "Contextual reasoning based on metrics.",
         "recommendedActions": ["Tactical Action 1", "Tactical Action 2"],
         "priority": "High",
         "confidenceScore": 90
       }
       Note: The value of "priority" must be one of: "Critical", "High", "Medium", "Low". Do not use TypeScript unions or pipes. Ensure all double quotes inside string values are properly escaped.
    `;

    const userPrompt = `Current Stadium Snapshot: ${JSON.stringify(snapshot)}`;

    const genAI = new GoogleGenerativeAI(apiKey);
    let lastError = null;

    for (const modelId of MODEL_FALLBACKS) {
      try {
        console.log(`Trying model: ${modelId}`);
        const model = genAI.getGenerativeModel({
          model: modelId,
          generationConfig: { responseMimeType: "application/json" }
        });

        const result = await model.generateContent([
          { text: systemPrompt },
          { text: userPrompt }
        ]);
        
        const text = result.response.text();
        
        // Bracket-depth parser: finds the exact matching } for the first {
        // Handles string literals and escape characters so inner } in values are ignored
        const start = text.indexOf('{');
        if (start === -1) throw new Error('Model response contained no JSON object');
        
        let depth = 0, inString = false, escape = false;
        let end = -1;
        for (let i = start; i < text.length; i++) {
          const c = text[i];
          if (escape)        { escape = false; continue; }
          if (c === '\\' && inString) { escape = true; continue; }
          if (c === '"')     { inString = !inString; continue; }
          if (inString)      continue;
          if (c === '{')     depth++;
          if (c === '}')     { depth--; if (depth === 0) { end = i; break; } }
        }
        if (end === -1) throw new Error('Model response contained incomplete JSON object');
        
        const parsed = JSON.parse(text.slice(start, end + 1));
        console.log(`Success with model: ${modelId}`);
        return NextResponse.json(parsed);

      } catch (modelErr) {
        console.warn(`Model ${modelId} failed: ${modelErr.message}`);
        lastError = modelErr;
      }
    }

    throw lastError;
    
  } catch (e) {
    console.error("AI Recommendation API failed:", e);
    return NextResponse.json({ error: "API Failure", details: e.message }, { status: 500 });
  }
}
