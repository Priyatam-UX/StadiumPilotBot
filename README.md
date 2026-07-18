# StadiumPilot AI — Smart Stadium & Tournament Operations Command Center

StadiumPilot AI is an AI-powered decision support platform designed for large-scale sporting events (such as the FIFA World Cup 2026). It enables venue operators to monitor stadium crowd density, track active staff/volunteers, view live medical and security alerts, coordinate transport shuttle capacity, and receive operational recommendations from Google Gemini AI.

## 🚀 Key Features

*   **Live Stadium Operations Dashboard:** Real-time visitor counts, density widgets, active incident logs, volunteer coverage tracking, and dynamic weather advisory cards.
*   **Interactive Stadium map:** A responsive SVG stadium layout (Gate A/B/C/D, Pitch, VIP, Parking) color-coded by occupancy with hover inspection and detail popups.
*   **AI Recommendation Engine:** Analyzes current operations context to recommend actionable tactical steps with priority levels and confidence scoring.
*   **AI Operations Assistant:** Natural language console grounded in the live metrics to query deployments ("Where should volunteers be deployed?").
*   **AI Report Studio:** Executive-ready report brief builder supporting print formatting, JSON exports, and PDF generation.
*   **Operations Control Center:** Adjustable settings interface mapping theme preferences, live streaming speeds, refresh intervals, and alerts routing.

## 🛠️ Technology Stack

*   **Framework:** Next.js 14 (App Router)
*   **Logic & Styling:** React 18 + Tailwind CSS
*   **Icons:** Lucide React
*   **Charts:** Recharts
*   **AI integration:** Google Generative AI (Gemini 1.5 Flash API with simulated Demo Mode fallback)

## 📦 Getting Started

### 1. Installation
Clone this repository (or copy the files) and run:
```bash
npm install
```

### 2. Configure Environment variables
Create a `.env.local` file in the root directory and add your Google Gemini API Key:
```env
GEMINI_API_KEY=your-gemini-api-key-here
```
*(If this key is missing, the application automatically uses built-in contextual fallback simulation data to ensure full operational demonstration!)*

### 3. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the Command Center.

### 4. Build Production Bundle
```bash
npm run build
npm start
```
