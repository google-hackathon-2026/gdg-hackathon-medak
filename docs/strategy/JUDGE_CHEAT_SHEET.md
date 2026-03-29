# Medak — AI Emergency Relay for Deaf Citizens

## The Problem

112 is voice-only. In Serbia and most of Europe, there is no way for deaf, hard-of-hearing, or speech-impaired people to contact emergency services independently. The EU mandates accessible 112 by June 2027 (EECC Art. 109), but no member state is ready. Meanwhile, 430 million people worldwide (WHO, 2021 World Report on Hearing) — 52 million in the EU alone (EUD 2023) — are locked out of the most basic safety net. When a stroke happens at home and you can't speak, you die waiting.

**The stakes in numbers:** Cardiac arrest survival decreases **5-12% per minute** (Johansen et al., PMC, Jan 2026). For a deaf person who can't call 112 at all — every minute is not just time lost, it's a percentage point of survival gone. **1 in 10 deaf people avoid calling an ambulance entirely** because of communication barriers (RNID, Sept 2025). Medak doesn't just speed up access — it **restores** the survival probability deaf people never had.

## Our Solution

Medak is a mobile app where a deaf user presses one SOS button. Two AI agents — powered by **Gemini 2.0 Flash Live** — take over: Agent 1 (User Agent) analyzes the scene via camera and GPS to build a structured emergency snapshot. When confidence reaches 85%, Agent 2 (Dispatch Agent) calls 112 and speaks to the operator as a human relay would — delivering the brief, answering questions, and relaying information back to the user's screen. The dispatcher receives a normal voice call. Zero infrastructure changes on the PSAP side.

```
[User presses SOS] → [User Agent: camera + GPS → structured snapshot]
                         ↓ confidence ≥ 85%
                   [Dispatch Agent: calls 112, speaks, relays Q&A]
                         ↓ dispatch confirmed
                   [User sees: ✅ Help is on the way — ETA 8 min]
```

## How It Works

1. User holds SOS button → camera + GPS activate, session created
2. User Agent analyzes scene, identifies emergency type, confirms location and clinical details
3. Confidence score reaches threshold → system auto-dials 112
4. Dispatch Agent delivers structured brief to operator, relays follow-up questions back to user's screen
5. Dispatch confirmed → user sees green screen with ETA (38 seconds total)

## Google Technologies

- **Gemini 2.0 Flash Live** — ×2 concurrent agents (scene understanding + voice dispatch)
- **Cloud Run** — auto-scaling backend (FastAPI + WebSocket)

## Key Numbers

- **430M** deaf/HoH people worldwide (WHO 2021/2026)
- **52M** in the EU (EUD 2023)
- **84K** in Serbia (14K deaf + 70K hard of hearing) — **zero** alternative access to 112
- **$0.13/call** vs $20–40 human relay → **150× cheaper**
- **38 seconds** SOS → dispatch confirmed
- **83%** of surveyed deaf respondents said they would use it
- **June 2027** — EU legal deadline for accessible emergency access (EECC Art. 109)

## Business Model

- **B2G SaaS:** €200–500K/year per country
- **Buyers:** National governments (legally required by EECC Art. 109)
- **Users:** Deaf/HoH citizens, speech-impaired, tourists, anyone who can't speak during an emergency
- **Entry market:** Serbia → EU expansion following regulatory wave

## Team

5 engineers: Branko & Filip (Frontend — React Native/Expo), Milan Jovanovic (Backend — FastAPI/Python), Milan Doslic & Boris Antonijev (Architecture, AI agents, strategy)

## Serbia = EU Accession Deliverable (use if challenged on market entry)

> *"Serbia should align its legislation on electronic communications with the EU regulatory framework, including the EU Electronic Communications Code."*  
> — EU Commission 2025 Serbia Report, November 4, 2025

The EECC includes **Article 109** — accessible 112. Medak implements exactly this.

- Serbia opened **22/35** negotiating chapters; Cluster 3 (digital) technically ready to open
- EECC alignment is an **explicit EC recommendation** for Serbia
- Medak = demonstrable EECC progress → accelerates EU accession
- This is not "nice accessibility app" — this is "EU accession deliverable"

## Regulatory Tailwind (use if challenged on market reality)

> *"EU emergency number 112: people with communication difficulties can access emergency services using voice, text, or video in real time and from anywhere in the European Union."*  
> — European Commission's own website, July 31, 2025

This is **law**, not aspiration. The EC describes exactly what Medak delivers — and zero countries deliver it natively today.

- EU Parliament voted **409-9** for sanctions when accessibility obligations aren't met (Nov 2025)
- EU Disability Strategy **2026-2030** expected Q2 2026 — more pressure coming
- Ukraine built accessible 112 **during a war** (March 12, 2026). Most EU countries haven't.

## What Makes Us Different

- **Zero PSAP changes** — operator receives a normal voice call, no new equipment
- **Scene understanding via camera** — AI sees the emergency, user doesn't need to type
- **150× cheaper** than human relay services
- **First AI-native emergency relay** — not an adapter on legacy infra, built from scratch for this problem
- **Works today** — doesn't wait for EU text-to-112 infrastructure that's years away
