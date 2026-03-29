# 🆘 Medak — AI Emergency Voice Relay for Deaf Citizens

> **430 million people worldwide can't call for help when they need it most.**  
> Medak changes that with two AI agents, one phone call, and zero infrastructure changes.

Built for the Google **"Build with AI" Hackathon 2026**, GDG Belgrade.

---

## The Problem

Emergency number 112 is a **voice-only system**. If you can't speak — because you're deaf, have a speech impairment, or don't speak the local language — you have **no way** to call for help.

- **430 million** people worldwide have disabling hearing loss (WHO, 2021/2026)
- **84,000** deaf and hard of hearing citizens in Serbia — with **zero** alternative access to 112
- **0** EU countries offer full equivalent 112 access for deaf citizens (EUD, 2024)

## How Medak Works

```
📱 User                    🤖 AI Agents                  📞 112 Operator
─────────────             ──────────────────             ──────────────────
Holds SOS button    →     User Agent (sees)         →    Receives voice call
Camera + GPS              Dispatch Agent (speaks)        Asks questions
Types responses     ←     Relays questions           ←   Sends help
```

1. **User** presses the SOS button. Camera and GPS activate automatically.
2. **User Agent** (Gemini 2.0 Flash Live) analyzes the scene — identifies fire, collapse, accident. Collects emergency type, location, victim status.
3. **Deterministic FSM** validates data with weighted confidence scoring. Threshold: **0.85**.
4. **Dispatch Agent** (Gemini 2.0 Flash Live) calls 112 as a **normal voice call**. The operator hears a clear, structured emergency report.
5. When the operator asks questions, they appear as text on the user's phone. User types → Agent speaks the answer.

**Total time: ~38 seconds from SOS to confirmed help.**

## Architecture

```
┌─────────────────┐     ┌─────────────────┐
│   User Agent    │     │  Dispatch Agent  │
│  Gemini 2.0     │     │  Gemini 2.0      │
│  Flash Live     │     │  Flash Live      │
│  "Sees scene"   │     │  "Speaks 112"    │
└────────┬────────┘     └──────┬───────────┘
         │                     │
         │   Orchestrator      │
         │   (FSM + Score)     │
         └─────────┬───────────┘
                   │
              Twilio VoIP
                   │
                   ▼
             📞 112 Operator
```

**Confidence Scoring:**
```
Score = Location (0.35) + Type (0.25) + Conscious (0.15) + Breathing (0.15) + Victims (0.10)
Threshold: 0.85 — no LLM in the decision path
```

## Key Design Decisions

| Decision | Why |
|----------|-----|
| **Voice call output** (not text) | Operators already know how to handle voice calls. Zero PSAP changes needed. |
| **Deterministic FSM** (not LLM orchestrator) | Critical decisions must be explainable, auditable, and reproducible. |
| **Camera input** (not typing) | In a crisis, you can't type. Vision-based input reduces cognitive load. |
| **Two specialized agents** (not one) | Separation of concerns: one gathers data, one communicates. |

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React Native / Expo |
| Backend | FastAPI (Python) |
| State | Redis |
| AI | 2× Gemini 2.0 Flash Live agents |
| Telephony | Twilio VoIP |
| Infrastructure | Google Cloud Run |
| Orchestrator | Deterministic Finite State Machine |

## Cost

| Metric | Value |
|--------|-------|
| Per call | **$0.13** (Gemini API + Twilio) |
| Human relay equivalent | $20–40 per call |
| Cost advantage | **~150× cheaper** |
| Monthly pilot (Serbia) | ~$55 |
| Monthly national | ~$580 |

## Google Technologies Used

- **Gemini 2.0 Flash Live** — Real-time multimodal AI for both scene analysis and voice synthesis
- **Google Cloud Run** — Auto-scaling serverless backend
- **Vertex AI** (production path) — EU-hosted Gemini endpoint for GDPR compliance

## User Research

Our approach combines published studies and direct community research:

- **EENA 2025:** Deaf citizens describe 112 as "completely inaccessible"
- **AccesSOS survey:** 78% of deaf respondents have no way to contact emergency services
- **Our research (N=18):** 56% cannot reach 112 independently; 83% would use AI voice relay
- **Primary concern:** Accuracy ("Will the AI relay my message correctly?"), not privacy

Research directly shaped architecture decisions — see `docs/strategy/RESEARCH_TO_ADAPTATION.md`.

## Directory Structure

```
medak/              Code repository (backend + frontend + infra)
docs/
  research/         Deep-dive: GDPR, B2G model, Serbian market, sensory pain points
  solutions/        Solution architectures and scoring
  strategy/         30+ strategy docs (pitch, Q&A, competitive analysis, grading)
```

### Key Strategy Documents

| Document | What it covers |
|----------|---------------|
| `docs/strategy/PITCH_SCRIPT_10MIN.md` | Complete 10-minute pitch script (Serbian + English) |
| `docs/strategy/SLIDE_CONTENT_SPEC.md` | Copy-paste ready slide specifications |
| `docs/strategy/STATS_QUICK_REFERENCE.md` | Single source of truth for all statistics |
| `docs/strategy/MARKET_AND_COMPETITION.md` | 12 competitors analyzed |
| `docs/strategy/QA_EXTENDED.md` | 28 prepared Q&A answers |
| `docs/strategy/ARCHITECTURE_FOR_JUDGES.md` | Technical deep-dive for judges |

## Team

| Role | Name |
|------|------|
| Frontend | Branko, Filip |
| Backend | Milan Jovanovic |
| Strategy & AI | Milan Doslic, Boris Antonijev |

*"Svi smo inženjeri. Svi kodiramo."*  
(We're all engineers. We all code.)

---

**Medak** — *Dva AI agenta. Jedan poziv. Jedan spašen život.*  
(Two AI agents. One call. One life saved.)
