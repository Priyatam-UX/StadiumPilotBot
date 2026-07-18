# 🤖 StadiumPilot GTM Agent

> **webcmd-powered Go-To-Market automation** — finds warm leads on Twitter/X, enriches their profiles, and generates hyper-personalized AI pitches using Google Gemini.

## 🎯 What It Does

```
Twitter Search (webcmd) → Profile Enrichment (webcmd) → AI Pitch (Gemini) → CSV Export
```

1. **Searches Twitter/X** for stadium operations & FIFA 2026 trigger posts using `webcmd twitter search`
2. **Enriches each lead** with full profile data (bio, followers, location) via `webcmd twitter profile`
3. **Generates a personalized DM** for each lead using Gemini AI grounded in their actual tweet + bio
4. **Exports a CSV** with all leads + pitches — ready to review and send

## ⚡ Quick Start

```bash
# 1. Login to Twitter first (one-time setup)
webcmd twitter login

# 2. Run the GTM Agent
node gtm-agent/agent.js

# 3. Optional flags
node gtm-agent/agent.js --query "stadium AI tools FIFA 2026" --limit 15
node gtm-agent/agent.js --dry-run   # Test mode, no Gemini calls
```

## 🔑 Environment Variables

Add these to your `.env.local` or Vercel:

| Variable | Purpose |
|---|---|
| `GEMINI_API_KEY` | Gemini AI pitch generation |
| `OPENWEATHER_API_KEY` | Live weather on dashboard |

## 📊 Sample Output (CSV)

| username | name | followers | tweet | personalized_pitch |
|---|---|---|---|---|
| venueops_usa | Stadium Ops | 3,240 | Crowd management challenge... | "Hey! Saw your tweet about crowd... " |
| stadiumtech_co | Tech Lead | 8,100 | Real-time crowd tracking... | "Love your focus on real-time data... " |

## 🏆 Hackathon Category

**🃏 Wildcard — Any GTM Motion**

This agent demonstrates:
- **Social Selling**: Monitors trigger posts about stadium ops/FIFA 2026
- **Personalized Outreach**: AI-crafted DMs grounded in real tweet context
- **Account Research**: Auto-enriches each lead's profile before outreach
- **Efficiency**: webcmd cuts token spend by ~90% vs raw browser scraping
