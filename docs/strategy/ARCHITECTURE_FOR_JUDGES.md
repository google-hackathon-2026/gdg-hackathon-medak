# 🏗️ Medak — Architecture Overview

> **AI-powered emergency relay for people who can't speak.**
> Press SOS → AI observes the scene → AI calls 112 on your behalf → Help arrives.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER'S PHONE                                  │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │            React Native / Expo Mobile App                         │  │
│  │  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │  │
│  │  │ SOS Btn │  │ Camera   │  │ Mic      │  │ GPS Location     │  │  │
│  │  └────┬────┘  └────┬─────┘  └────┬─────┘  └───────┬──────────┘  │  │
│  │       │             │             │                │              │  │
│  │       └─────────────┴──────┬──────┴────────────────┘              │  │
│  │                            │                                      │  │
│  │                    WebSocket + REST                                │  │
│  └────────────────────────────┼──────────────────────────────────────┘  │
└───────────────────────────────┼─────────────────────────────────────────┘
                                │
                    ════════════╪══════════════
                     INTERNET   │
                    ════════════╪══════════════
                                │
┌───────────────────────────────┼─────────────────────────────────────────┐
│                        BACKEND (FastAPI)                                │
│                               │                                         │
│  ┌────────────────────────────▼──────────────────────────────────────┐  │
│  │                   ORCHESTRATOR (FSM)                               │  │
│  │     INTAKE ──► TRIAGE ──► LIVE_CALL ──► RESOLVED / FAILED        │  │
│  └──────┬──────────────┬─────────────────────────┬───────────────────┘  │
│         │              │                         │                      │
│  ┌──────▼───────┐  ┌───▼──────────────┐  ┌──────▼───────────────────┐  │
│  │ Confidence   │  │ 🤖 USER AGENT    │  │ 🤖 DISPATCH AGENT       │  │
│  │ Scorer       │  │                  │  │                          │  │
│  │ (weighted    │  │ Gemini 2.0 Flash │  │ Gemini 2.0 Flash Live   │  │
│  │  formula)    │  │ Live — TEXT mode  │  │ — AUDIO+TEXT mode       │  │
│  │              │  │                  │  │                          │  │
│  │ Fields:      │  │ Observes camera  │  │ Speaks to 112 operator  │  │
│  │ • location   │  │ + mic stream     │  │ via Twilio voice call   │  │
│  │ • type       │  │                  │  │                          │  │
│  │ • conscious  │  │ 8 tool calls:    │  │ 3 tool calls:           │  │
│  │ • breathing  │  │ • confirm_loc    │  │ • queue_question        │  │
│  │ • victims    │  │ • set_type       │  │ • get_user_answer       │  │
│  │ → 0.0 – 1.0  │  │ • set_clinical   │  │ • confirm_dispatch      │  │
│  │              │  │ • append_text    │  │                          │  │
│  └──────────────┘  │ • get_question   │  └───────────┬──────────────┘  │
│                    │ • answer_q       │              │                  │
│                    │ • surface_q      │              │                  │
│                    │ • record_input   │              │                  │
│                    └────────┬─────────┘              │                  │
│                             │                        │                  │
│  ┌──────────────────────────▼────────────────────────▼───────────────┐  │
│  │                     REDIS (EmergencySnapshot)                     │  │
│  │           Shared state — both agents read/write here              │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                      │                  │
│  ┌───────────────────────────────────────────────────▼───────────────┐  │
│  │                    AUDIO BRIDGE                                    │  │
│  │         Twilio μ-law 8kHz ◄──► PCM 16/24kHz Gemini               │  │
│  │                                                                   │  │
│  │  Twilio Media Streams (WebSocket) ◄──► AudioBridge queues         │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                │
                    ════════════╪══════════════
                      PSTN      │
                    ════════════╪══════════════
                                │
                    ┌───────────▼───────────┐
                    │   112 OPERATOR         │
                    │   (emergency center)   │
                    └───────────────────────┘
```

---

## Component Descriptions

### 📱 Mobile App (React Native / Expo)
The user-facing interface. A single **SOS button** triggers the emergency flow. Streams **live camera frames** and **microphone audio** to the backend over WebSocket. Receives real-time status updates (phase transitions, confidence score, questions from the AI, final resolution). Designed for panic situations — minimal UI, maximum clarity.

### ⚙️ Orchestrator (Deterministic FSM)
The brain of session lifecycle — **not an LLM**. A strict finite state machine that moves each session through `INTAKE → TRIAGE → LIVE_CALL → RESOLVED/FAILED`. It polls Redis every second during triage, checks confidence score against threshold (0.85), enforces timeouts, manages agent startup/shutdown, and handles Twilio call retries with exponential backoff. Fully deterministic — no AI judgment in lifecycle decisions.

### 🤖 User Agent (Gemini 2.0 Flash Live — TEXT mode)
Observes the emergency scene through the phone's camera and microphone. Runs in **text-only response mode** — it listens and watches but communicates with the user only through on-screen questions. Fills the `EmergencySnapshot` via **8 structured tool calls**: location confirmation, emergency type classification, clinical assessment (conscious/breathing/victim count), free-text observation logging, and bidirectional Q&A relay with the Dispatch Agent. This is the "eyes and ears" of the system.

### 🤖 Dispatch Agent (Gemini 2.0 Flash Live — AUDIO+TEXT mode)
The AI voice that **speaks to the 112 operator** on a real phone call. Receives the emergency briefing from Redis, opens the call with a standardized statement, delivers the briefing, answers operator questions, and uses **3 tool calls** to relay unknown questions back to the User Agent and confirm dispatch with ETA. Audio flows bidirectionally through the Audio Bridge. Has voice activity detection configured for natural turn-taking.

### 🔴 Redis (EmergencySnapshot Store)
Single source of truth for each session. Stores `EmergencySnapshot` as JSON with 1-hour TTL. Both agents write to it concurrently (optimistic read-modify-write with version bumps). The snapshot contains: location, emergency type, clinical fields, free-text details, user inputs, confidence score, dispatch questions/answers, call status, and ETA. Each session is **fully isolated** — no cross-session state.

### 📊 Confidence Scorer (Deterministic)
A **pure weighted formula** (not an LLM) that scores how complete the emergency information is:

| Field | Weight |
|---|---|
| Confirmed address | **0.35** |
| GPS only (no address) | 0.20 |
| Emergency type | **0.25** |
| Consciousness status | 0.15 |
| Breathing status | 0.15 |
| Victim count | 0.10 |
| User inputs (up to 2) | 0.05 each |

When score ≥ **0.85**, the orchestrator triggers the 112 call. This threshold is configurable.

### 🔊 Audio Bridge (Twilio ↔ Gemini)
Real-time audio conversion pipeline. Twilio Media Streams delivers **μ-law 8kHz** audio over WebSocket. The bridge converts:
- **Inbound** (operator → Gemini): μ-law 8kHz → PCM 16kHz
- **Outbound** (Gemini → operator): PCM 24kHz → μ-law 8kHz

Uses `asyncio.Queue` for non-blocking audio flow. Handles Twilio `start`/`media`/`stop` events and supports interruption (queue flush when operator starts speaking).

---

## Data Flow: Complete Emergency Timeline

```
TIME    EVENT
─────   ──────────────────────────────────────────────────────────
+0s     User presses SOS → POST /api/sos with GPS + emergency type
        Backend creates EmergencySnapshot, saves to Redis
        Orchestrator starts → INTAKE → TRIAGE

+1s     User Agent (Gemini Live) connects in TEXT mode
        Receives initial context: "GPS: 44.81, 20.46. Address: ..."
        Phone starts streaming camera frames + mic audio via WebSocket

+2-3s   User Agent observes scene via camera/mic
        Calls set_emergency_type("MEDICAL")     → confidence +0.25
        Calls confirm_location("Knez Mihailova 5")  → confidence +0.35

+4-6s   User Agent assesses victim
        Calls set_clinical_fields(conscious=false, breathing=true)
        Calls surface_user_question("Is the person having a seizure?")
                                              → confidence = 0.90 ✓

+7s     Confidence ≥ 0.85 — Orchestrator: TRIAGE → LIVE_CALL
        Dispatch Agent starts
        Twilio call initiated to emergency number

+8-10s  Twilio connects → Media Streams WebSocket opens
        Audio Bridge starts converting μ-law ↔ PCM
        Dispatch Agent (Gemini Live AUDIO) speaks:
        "This is an automated emergency call on behalf of a person
         who cannot speak. Medical emergency at Knez Mihailova 5..."

+11-25s Dispatch Agent answers operator questions using snapshot data
        If unknown → queue_question_for_user() → User Agent relays
        User Agent gets answer from scene → answer back via Redis

+26-30s Operator confirms dispatch
        Dispatch Agent calls confirm_dispatch(eta_minutes=8)
        Orchestrator: LIVE_CALL → RESOLVED
        Frontend shows: "Help is on the way! ETA: 8 minutes"
```

**Total time: SOS press to confirmed dispatch ≈ 30 seconds**

---

## Google Technologies & Justification

### Gemini 2.0 Flash Live (Primary)
**Why this model specifically:**

- **Multimodal real-time streaming** — processes camera video, microphone audio, and text simultaneously in a single session. No other model supports all three input modalities in a live streaming context.
- **Sub-2-second latency** — critical for emergency response. The Live API maintains a persistent bidirectional connection, eliminating per-request overhead.
- **Native tool calling during streaming** — the model can call structured functions (`confirm_location`, `set_emergency_type`, etc.) while continuously processing audio/video. This is what makes the "observe and fill" pattern possible.
- **Native audio output** — the Dispatch Agent generates speech directly (no separate TTS step), enabling natural conversation with the 112 operator.
- **Voice Activity Detection** — built-in turn-taking support with configurable sensitivity, so the Dispatch Agent stops talking when the operator speaks.
- **Two concurrent sessions per emergency** — User Agent (observation) and Dispatch Agent (voice call) run independently but coordinate through Redis.

### Vertex AI
Backend authenticates via **Application Default Credentials** and connects through Vertex AI (`vertexai=True`). This provides enterprise-grade access management, audit logging, and quota controls. Project: `proud-quasar-310818`, Region: `us-central1`.

### Google Cloud Run (Deployment Target)
Containerized deployment target for production. The backend is already Dockerized (`docker-compose.yml`), making Cloud Run deployment a single `gcloud run deploy` command.

### Firebase (Planned — Not Implemented in PoC)
Push notification channel for background alerts — e.g., "Help dispatched, ETA 8 min" when the app is minimized. Not included in the current PoC; would be added in production for reliable background delivery.

---

## Scalability Analysis

### Current State (PoC)

| Component | Scaling Model | Bottleneck? |
|---|---|---|
| FastAPI backend | Async Python, single instance | Can handle ~100 concurrent sessions |
| Redis | Single instance, in-memory | Sub-ms reads/writes, not a bottleneck |
| Gemini Live sessions | 2 per emergency (User + Dispatch) | Google-managed, auto-scales |
| Twilio calls | 1 per emergency | Pay-per-use, Twilio scales |
| WebSocket connections | Per-session | Bounded by server memory |

### Why It Scales Naturally

1. **Session isolation** — Zero shared state between sessions. Each emergency gets its own `EmergencySnapshot` in Redis with a unique key. No global locks, no contention.

2. **Stateless backend** — The FastAPI server holds no session state in memory (everything is in Redis). Multiple backend instances can serve the same sessions.

3. **Cloud Run auto-scaling** — Deploy to Cloud Run → automatic horizontal scaling from 0 to N instances based on request volume. Each instance handles its own WebSocket connections.

4. **Redis scales horizontally** — Redis Cluster for multi-node deployments. Each session maps to a single key, so sharding is trivial.

5. **Cost per emergency call:**
   - Gemini 2.0 Flash Live (scene analysis + voice dispatch): ~$0.015
   - Twilio voice (~5 min): ~$0.07
   - Gemini TTS (voice narration): ~$0.02
   - Infrastructure: ~$0.02
   - **Total: ~$0.13 per emergency** (conservative estimate)

### Production Scaling Path

```
                    ┌─────────────────┐
                    │  Cloud Load      │
                    │  Balancer        │
                    └───────┬─────────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
        ┌─────▼─────┐ ┌─────▼─────┐ ┌─────▼─────┐
        │ Cloud Run  │ │ Cloud Run  │ │ Cloud Run  │
        │ Instance 1 │ │ Instance 2 │ │ Instance N │
        └─────┬──────┘ └─────┬──────┘ └─────┬──────┘
              │             │             │
              └─────────────┼─────────────┘
                            │
                   ┌────────▼────────┐
                   │  Redis Cluster   │
                   │  (Memorystore)   │
                   └─────────────────┘
```

---

## What We'd Add for Production

| Area | What's Missing | Why It Matters |
|---|---|---|
| **Authentication** | No user auth, no device verification | Prevent abuse/spoofing |
| **Rate limiting** | No per-device or per-IP limits | Prevent DoS on emergency service |
| **Monitoring** | No metrics, no alerting | Need real-time ops visibility |
| **Audit logging** | Snapshots have TTL, no persistent log | Legal requirement for emergency calls |
| **Multi-language** | PoC runs in Serbian (demo) and English. Gemini supports 40+ languages natively — new language = config change. | Full EU deployment needs localized UI + emergency protocol tuning per country |
| **Redundancy** | Single Redis, no failover | Emergency service needs 99.99% uptime |
| **E2E encryption** | TLS only, no app-level encryption | Medical data requires stronger protection |
| **Real 112 integration** | Calls a test number | Requires certification with emergency services |

> **This is an honest PoC.** We built the hardest parts — multimodal AI observation, real-time voice bridging, deterministic orchestration — and proved they work together. The items above are engineering work, not research problems.

---

## Validation: Independent Projects Confirm Our Approach

Two independent projects published in early 2026 validate our technical approach:

1. **MediSense** (March 16, 2026) — A real-time emergency healthcare co-pilot built with Gemini 2.0 Flash Live API, Cloud Run, and Vertex AI. Developer conclusion: "The Multimodal Live API is a game-changer. Being able to stream video + audio bidirectionally opens up use cases that weren't possible with traditional request-response APIs. Healthcare is one of the most impactful."

2. **AI Emergency Squad** (December 2025) — Google DeepMind hackathon project using Gemini multimodal for scene analysis + multi-agent safety guardrails in emergencies.

Both validate that: (a) Gemini Live API works for real-time emergency applications, (b) multi-agent architecture with deterministic safety guards is the right pattern, and (c) Cloud Run + Vertex AI is the appropriate deployment stack.

---

## Why Direct Gemini API (Not Google ADK)?

Google ADK is excellent for **tool-calling completion agents** (function calls, search, workflow automation). Medak requires something different:

- **Bidirectional real-time audio/video streaming** — persistent WebSocket, not request/response
- **Zero-latency voice synthesis** — audio must play continuously during live phone call
- **Media streaming integration** with Twilio — raw audio bytes, not text completions

ADK currently doesn't support Gemini 2.0 Flash Live's streaming session model. We use the direct Gemini Live API because it's the correct tool for real-time voice/video agents. Additionally, for a safety-critical system, direct API access provides maximum control and auditability.

---

## Tech Stack Summary

| Layer | Technology | Role |
|---|---|---|
| Mobile | React Native + Expo | Cross-platform SOS app |
| Backend | Python + FastAPI | API, WebSocket, orchestration |
| AI (×2) | **Gemini 2.0 Flash Live** | Multimodal observation + voice dispatch |
| AI Platform | **Vertex AI** | Authentication, quotas, enterprise access |
| State | Redis | Session snapshot store |
| Voice | Twilio + Media Streams | VoIP call to 112, audio streaming |
| Audio | audioop (μ-law ↔ PCM) | Real-time codec conversion |
| Deploy | Docker Compose / **Cloud Run** | Containerized deployment |
| Push | **Firebase** (planned, not in PoC) | Background notifications |
