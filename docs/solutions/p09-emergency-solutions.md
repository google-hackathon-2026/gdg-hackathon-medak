# P09 — Emergency Services Communication Agent for Deaf/Speech-Impaired People

## Problem Statement

Deaf and speech-impaired people cannot call 112 in Serbia (and most of Europe). There is no text-to-112 infrastructure. The EU mandates accessibility by 2027. We need a **caller-side AI proxy** that takes impaired input (text, limited speech, potentially sign language), reasons about the emergency, calls dispatch on the user's behalf via voice, and relays dispatch responses back in an accessible format.

**Key constraints:** Can't call real 112 in demo. Sign language recognition unreliable in 48h. Focus on text + speech input. System must be multi-agent (3+) and genuinely agentic (makes real calls, communicates bidirectionally).

> **[POST-HACKATHON UPDATE]** The team built a system closest to **Solution 1 (Voice Bridge Pipeline)** but simplified:
> - **2 agents instead of 4:** User Agent (combines Intake + Triage + Feedback) and Dispatch Agent (Caller). No separate Feedback Agent — the User Agent handles all user-facing communication.
> - **Deterministic orchestrator** manages phase transitions (INTAKE → TRIAGE → LIVE_CALL → RESOLVED/FAILED) based on confidence scoring, not LLM decisions.
> - **Passive-first triage:** The User Agent observes mic/camera passively and may surface optional yes/no questions. User input is supplementary, never required.
> - **Confidence threshold (0.85) or 10-second timeout** triggers the dispatch call.
> - **Redis shared state** (EmergencySnapshot) is the sole communication channel between agents — no direct agent-to-agent messaging.
> - **Tech stack:** React Native (Expo 54) frontend, FastAPI backend, Gemini 2.0 Flash Live, Twilio VoIP, Redis.
>
> The project was named **"Medak"** (called "Voice Bridge" in the design doc). See `medak/docs/design-document.md`.

---

## Solution 1: Voice Bridge Pipeline

### Pitch
A linear assembly line where each agent transforms the emergency one step closer to a live voice call — from messy human input to structured emergency data to a spoken conversation with dispatch.

### Agent Architecture

```
User ──► [Intake Agent] ──► [Triage Agent] ──► [Caller Agent] ◄──► Dispatch (VoIP)
              │                    │                  │
              └────────────────────┴──────────────────┘
                                   │
                            [Feedback Agent] ──► User (visual/haptic)
```

| Agent | Role | Actions |
|-------|------|---------|
| **Intake Agent** | Understands user input regardless of modality | Accepts text (typed, AAC board, predictive), impaired speech (with enhanced ASR), or optional sign video. Normalizes into structured `EmergencyIntent` JSON (type, severity, location, details). Asks clarifying questions via accessible UI if critical fields are missing. |
| **Triage Agent** | Reasons about the emergency, structures the protocol | Takes `EmergencyIntent`, cross-references with emergency protocols (what dispatch will ask for fire vs. medical vs. police), pre-fills answers, determines urgency level, generates a `CallScript` — an ordered list of information to convey and likely questions to answer. |
| **Caller Agent** | Makes the actual phone call and speaks in real-time | Uses VoIP (Twilio/Vonage) to dial dispatch. Speaks the `CallScript` via TTS. Listens to dispatch via STT. Uses an LLM to respond dynamically to dispatcher questions, pulling from the structured emergency data. Streams the conversation state to Feedback Agent. |
| **Feedback Agent** | Keeps the user informed in their accessible format | Receives real-time call transcript. Renders as large text, simplified language, visual status indicators (🔴 calling → 🟡 connected → 🟢 help dispatched). Shows what dispatch is asking and what Caller Agent is saying. Allows user to inject corrections ("not fire, gas leak!") mid-call. |

**Communication pattern:** Linear pipeline with a feedback loop. Each agent passes a progressively richer data structure forward. Feedback Agent can send corrections backward to Caller Agent in real-time.

### Tech Stack
- **Frontend:** React Native (mobile) or Next.js (web) — large-button accessible UI
- **Intake Agent:** Whisper (enhanced ASR for impaired speech), GPT-4o for intent extraction
- **Triage Agent:** Claude/GPT-4o with emergency protocol prompt + structured output
- **Caller Agent:** Twilio Programmable Voice + ElevenLabs TTS + Deepgram STT + LLM for dynamic conversation
- **Feedback Agent:** WebSocket push to frontend, SSE for transcript streaming
- **Orchestration:** LangGraph or custom event bus (Redis Streams)

### Demo Scenario (10 min)

1. **(0:00–1:00)** Setup: Show the accessible UI on a phone. Explain the problem with a 15-second video of a deaf person trying to call 112.
2. **(1:00–3:00)** User types: "my father fall down stairs not breathing blood from head" (broken, panicked text). Show Intake Agent parsing this into structured emergency data in real-time. Show it asking one clarifying question: "What is your address?" via large accessible prompt.
3. **(3:00–4:00)** Triage Agent classifies: MEDICAL / CRITICAL / head trauma + respiratory. Generates call script. Show the structured protocol on screen.
4. **(4:00–7:00)** **The call.** Caller Agent dials a simulated dispatch number (Twilio → a second agent playing dispatcher). Audience hears the voice call on speaker:
   - *Caller Agent:* "This is an emergency relay call on behalf of a hearing-impaired person. I have a medical emergency at [address]. A 65-year-old male has fallen down stairs, is not breathing, and has a head wound with active bleeding."
   - *Simulated Dispatch:* "Is the patient conscious?"
   - *Caller Agent checks with user via Feedback Agent, user types "no eyes closed"*
   - *Caller Agent:* "The patient is unconscious, eyes closed."
   - *Dispatch confirms ambulance dispatched.*
5. **(7:00–8:30)** Show the user's screen throughout: real-time transcript, status changes, the moment "🟢 Ambulance dispatched — ETA 8 minutes" appears with a vibration.
6. **(8:30–10:00)** Recap architecture, show the data flow, discuss EU NG112 compliance path.

### Wow Moment
The audience hears a **real phone call** happening in real-time where an AI is speaking fluently to dispatch while a deaf user watches the visual transcript and injects a correction ("no, eyes closed") that the Caller Agent incorporates into its next spoken sentence within 2 seconds.

### What's Risky
- Twilio voice latency + STT/TTS round-trip could make the conversation feel sluggish (>3s response time breaks immersion)
- Impaired speech recognition accuracy — if Intake Agent misparses "blood" as "flood," the entire downstream chain is wrong
- Caller Agent might hallucinate details dispatch didn't ask for

### What's Novel
- **Real-time bidirectional human-in-the-loop during an AI voice call.** The user isn't just a passive observer — they can correct the AI mid-call. This is rare; most voice agents are autonomous or pre-scripted.
- The pipeline architecture means each agent can be independently improved/swapped (e.g., replace Whisper with a specialized impaired-speech model).

---

## Solution 2: Orchestrated Triad (Hub-and-Spoke)

### Pitch
Three specialized agents — one facing the user, one facing dispatch, one facing context sources — coordinated by a central orchestrator that ensures the right information flows to the right place at the right time.

### Agent Architecture

```
                    ┌─────────────────────┐
                    │  Orchestrator Agent  │
                    │  (Central Hub)       │
                    └──┬───────┬───────┬──┘
                       │       │       │
              ┌────────▼──┐ ┌─▼──────────┐ ┌▼────────────┐
              │ Companion  │ │  Dispatch   │ │  Context     │
              │ Agent      │ │  Agent      │ │  Agent       │
              │ (User-side)│ │ (Call-side) │ │ (World-side) │
              └────────────┘ └────────────┘ └──────────────┘
                   ▲                ▲               ▲
                   │                │               │
                 User          VoIP/Phone      GPS, Medical
                               to Dispatch     Records, Maps
```

| Agent | Role | Actions |
|-------|------|---------|
| **Orchestrator Agent** | Central coordinator, decides what happens when | Maintains a shared `EmergencyState` object. Routes messages between agents. Decides when enough info is gathered to initiate the call. Handles error recovery (e.g., call drops → retry). Implements a state machine: `INTAKE → ENRICHING → CALLING → MONITORING → RESOLVED`. |
| **Companion Agent** | The user's dedicated assistant | Runs a persistent, empathetic conversation with the user in their preferred modality. Uses simple language, large text, icons. Never shows raw system state. Translates Orchestrator's information needs into gentle questions. Provides emotional support ("Help is coming. Stay with your father."). Accepts corrections at any time. |
| **Dispatch Agent** | The caller — speaks to dispatch | Receives structured emergency data from Orchestrator. Makes the VoIP call. Handles the full voice conversation autonomously. If dispatch asks something not in the data, it sends an `INFO_NEEDED` event to Orchestrator, which routes it to Companion Agent → user → back. |
| **Context Agent** | Enriches emergency data from external sources | Given an address, pulls GPS coordinates, nearest hospital, building layout info if available. Given a user profile (opt-in), retrieves medical conditions, allergies, emergency contacts. Monitors the situation for changes (e.g., if user shares a photo, analyzes it). |

**Communication pattern:** Hub-and-spoke via event bus. All agents communicate through the Orchestrator using typed events (`USER_INPUT`, `INFO_NEEDED`, `CALL_STATUS`, `CONTEXT_UPDATE`). No agent talks directly to another.

### Tech Stack
- **Orchestrator:** Python/TypeScript state machine (XState or custom), Redis pub/sub for events
- **Companion Agent:** Claude 3.5 Sonnet (empathetic, good at accessible language) + React accessible frontend
- **Dispatch Agent:** Twilio Voice + OpenAI Realtime API (voice-to-voice, low latency) or Vapi.ai
- **Context Agent:** Google Maps API, OpenStreetMap, user profile DB (SQLite for demo)
- **Shared state:** Redis or in-memory event store
- **Frontend:** SvelteKit or Next.js with WCAG AAA compliance

### Demo Scenario (10 min)

1. **(0:00–1:30)** Show a split screen: left = user's phone (Companion Agent), right = system dashboard showing all 4 agents and their states.
2. **(1:30–3:00)** User types in Serbian: "Komšija leži na podu, ne diše" (Neighbor lying on floor, not breathing). Companion Agent responds in Serbian with simple language: "Razumem. Gde se nalazite? (I understand. Where are you?)" Meanwhile, Context Agent has already started pulling GPS from the phone.
3. **(3:00–4:30)** User shares location via phone. Context Agent enriches: address resolved, nearest hospital = KBC Zemun (4.2km), shows on map. Orchestrator state: `ENRICHING → CALLING`.
4. **(4:30–7:30)** **Dual-view call.** Left screen shows user getting calm updates from Companion Agent ("Zovemo hitnu pomoć..." / "We're calling emergency services..."). Right screen shows the call waveform + transcript as Dispatch Agent speaks to simulated dispatch. Dispatch asks "Is the patient diabetic?" → Dispatch Agent sends `INFO_NEEDED` → Orchestrator routes to Companion → user types "da" → flows back → Dispatch Agent says "Yes, the patient is diabetic."
5. **(7:30–9:00)** Dispatch confirms ambulance. Companion Agent shows: "🚑 Hitna pomoć dolazi — 6 minuta" with a map showing ambulance route. Context Agent provides first aid instructions relevant to the situation.
6. **(9:00–10:00)** Show the event log: every message between agents, timestamped. Discuss how this architecture scales to multiple languages, modalities.

### Wow Moment
The **split-screen showing two simultaneous AI conversations** — one calm and empathetic in Serbian with the user, one professional and clinical in English/Serbian with dispatch — while the dashboard shows events flowing between agents in real-time. The audience sees the entire nervous system of the emergency response.

### What's Risky
- Orchestrator is a single point of failure — if it crashes, everything stops
- Event routing latency: user correction → Orchestrator → Dispatch Agent → spoken response could take 5-8 seconds
- Complexity: 4 agents + event bus is a lot to build and debug in 48 hours

### What's Novel
- **Emotional intelligence separation.** The Companion Agent is optimized purely for empathy and accessibility — it never has to worry about dispatch protocols. The Dispatch Agent is optimized purely for crisp, professional emergency communication — it never has to worry about being gentle. This separation produces better results than one agent trying to do both.
- **Context enrichment running in parallel** while the user is still talking — by the time the call starts, the system already knows the nearest hospital and building access points.

---

## Solution 3: Specialist Swarm with Consensus

### Pitch
Instead of one agent deciding what kind of emergency this is, a swarm of specialist agents (medical, fire, police, hazmat) independently analyze the situation and vote — then the winning specialist takes the lead, producing more accurate triage than any single generalist.

### Agent Architecture

```
                         User Input
                             │
                      ┌──────▼──────┐
                      │ Intake Agent │
                      └──────┬──────┘
                             │ (broadcast)
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
       ┌─────────────┐ ┌──────────┐ ┌────────────┐
       │Medical Agent │ │Fire Agent│ │Police Agent│  ... (extensible)
       └──────┬──────┘ └────┬─────┘ └─────┬──────┘
              │             │              │
              └──────────┬──┘──────────────┘
                         ▼
                  ┌──────────────┐
                  │Consensus Agent│
                  └──────┬───────┘
                         ▼
                  ┌──────────────┐
                  │ Caller Agent │ ◄──► Dispatch (VoIP)
                  └──────┬───────┘
                         ▼
                  ┌──────────────┐
                  │ Relay Agent  │ ──► User (accessible feedback)
                  └──────────────┘
```

| Agent | Role | Actions |
|-------|------|---------|
| **Intake Agent** | Normalizes input, broadcasts to specialists | Accepts any input modality. Produces a raw `Situation` object (unstructured text + metadata). Broadcasts to all specialist agents simultaneously. |
| **Medical Agent** | Assesses medical aspects | Analyzes for symptoms, injuries, vital signs mentioned. Scores medical severity (0-10). Outputs structured medical assessment + recommended questions for dispatch. Knows medical protocols (CPR guidance, etc.). |
| **Fire Agent** | Assesses fire/hazard aspects | Looks for fire indicators, smoke, gas, chemical, structural collapse. Scores fire/hazard severity. Knows fire-specific protocols (evacuation, gas shutoff). |
| **Police Agent** | Assesses crime/safety aspects | Looks for violence, break-in, threat indicators. Scores danger level. Knows police-specific protocols (suspect description, weapon presence). |
| **Consensus Agent** | Aggregates specialist votes, picks lead | Receives all specialist assessments. Uses weighted voting (severity × confidence). Selects primary emergency type and lead specialist. Merges all relevant information into a unified `EmergencyBrief`. Resolves conflicts (e.g., "Is this a medical emergency or a crime scene? Both — medical leads, police secondary."). |
| **Caller Agent** | Makes the call using the lead specialist's protocol | Dials dispatch. Uses the lead specialist's communication protocol and terminology. If dispatch pivots ("Actually, send police too"), Caller Agent pulls from the secondary specialist's data. |
| **Relay Agent** | Feeds back to user | Translates call progress into accessible output. Shows which specialist "won" and why. Provides relevant guidance (e.g., Medical Agent's CPR instructions while waiting). |

**Communication pattern:** Broadcast → fan-in → linear. Intake broadcasts, specialists process in parallel, Consensus Agent aggregates, then linear to Caller → Relay.

### Tech Stack
- **Intake + Specialists:** GPT-4o-mini or Claude Haiku (fast, cheap — running 3+ in parallel)
- **Consensus Agent:** Claude Sonnet or GPT-4o (needs strong reasoning for conflict resolution)
- **Caller Agent:** Twilio + Deepgram + ElevenLabs
- **Relay Agent:** WebSocket → accessible frontend
- **Orchestration:** LangGraph with fan-out/fan-in nodes, or Python asyncio with structured concurrency
- **Frontend:** React with Radix UI (accessible components)
- **Specialist knowledge:** RAG over emergency protocol PDFs (Serbian 112 protocols if available, EU guidelines)

### Demo Scenario (10 min)

1. **(0:00–1:30)** Present the problem: "A single AI trying to classify an emergency is like having one doctor do everything. Real dispatch centers have specialists. Our system does too."
2. **(1:30–3:30)** **Ambiguous scenario.** User types: "There's smoke coming from next door and I heard someone screaming." Show all three specialists analyzing simultaneously (live dashboard with three panels):
   - Medical Agent: "Possible smoke inhalation victim. Severity: 7/10. Confidence: 0.6"
   - Fire Agent: "Active fire indicators. Severity: 8/10. Confidence: 0.8"
   - Police Agent: "Screaming could indicate domestic violence. Severity: 5/10. Confidence: 0.3"
3. **(3:30–4:30)** Consensus Agent decision (animated): "Primary: FIRE (8.0 × 0.8 = 6.4). Secondary: MEDICAL (7.0 × 0.6 = 4.2). Fire leads, medical support." Show the merged `EmergencyBrief`.
4. **(4:30–7:00)** Caller Agent calls dispatch using fire protocol: "I'm reporting a fire with a possible victim at [address]. Smoke visible from neighboring apartment. Screaming heard." Dispatch asks about flames — Caller Agent draws from Fire Agent's structured data. Dispatch asks about the victim — seamlessly pulls from Medical Agent's assessment.
5. **(7:00–8:30)** Plot twist: user types "I see a man running away!" Police Agent re-scores to 7/10. Consensus Agent updates: "Add police dispatch." Caller Agent (still on the line) adds: "Update — a suspect was seen fleeing the scene. Police may also be needed."
6. **(8:30–10:00)** Show the full specialist voting log. Compare to a single-agent approach (which classified this as only fire and missed the crime element).

### Wow Moment
The **real-time specialist voting visualization** where the audience watches three AI agents independently analyze an ambiguous situation and converge on a decision — then seeing the system **dynamically re-triage mid-call** when new information arrives ("I see a man running away!").

### What's Risky
- Running 3+ LLM calls in parallel = cost and latency. If any specialist is slow, the whole pipeline waits (or Consensus works with incomplete data)
- Specialists might all disagree → Consensus Agent faces a genuinely hard decision with no clear winner
- Over-engineering for a hackathon — the "swarm" might be overkill for most clear-cut emergencies

### What's Novel
- **Ensemble reasoning for emergency classification.** No one does this — current systems use a single classifier. The swarm approach is more robust to ambiguous situations and catches multi-faceted emergencies (fire + crime) that a single agent would miss.
- **Dynamic re-triage.** The specialist swarm doesn't just classify once — it continuously re-evaluates as new information arrives, and the active call adapts.

---

## Solution 4: Rehearse-Then-Call (Pre-Flight Simulation)

### Pitch
Before making the real call, the system **rehearses the entire conversation** with a simulated dispatcher agent, identifies gaps in the user's information, fills them, and only then makes the real call — ensuring the actual dispatch interaction is fast, complete, and flawless.

### Agent Architecture

```
Phase 1: REHEARSAL                          Phase 2: LIVE CALL
┌──────────────────────────────┐    ┌──────────────────────────────┐
│                              │    │                              │
│  User ◄──► [Interview Agent] │    │  User ◄──► [Monitor Agent]   │
│                │             │    │                │             │
│         [Rehearsal Caller]   │    │         [Live Caller Agent]  │
│                │             │    │                │             │
│    [Simulated Dispatcher]    │    │          Real Dispatch       │
│                │             │    │                │             │
│         [Gap Analyzer]       │    │         [Monitor Agent]      │
│                              │    │                              │
└──────────────────────────────┘    └──────────────────────────────┘
          │                                    ▲
          └── Gap Report + Optimized Script ───┘
```

| Agent | Role | Actions |
|-------|------|---------|
| **Interview Agent** | Gathers initial information from user | Conversational agent optimized for accessibility. Asks structured questions with visual aids (body diagram for injury location, map for address). Builds initial `EmergencyProfile`. |
| **Simulated Dispatcher Agent** | Plays the role of a realistic 112 dispatcher | Trained on real dispatch protocols and conversation patterns. Asks the tough follow-up questions a real dispatcher would ask. Is deliberately demanding — "What floor? Is the door locked? How much blood? Is the patient on any medication?" |
| **Rehearsal Caller Agent** | Practices the call against the simulator | Attempts to convey the emergency to the Simulated Dispatcher. Uses the same voice/TTS it will use in the real call. The full conversation is recorded and analyzed. |
| **Gap Analyzer Agent** | Identifies what's missing after rehearsal | Compares what the Simulated Dispatcher asked vs. what the Rehearsal Caller could answer. Produces a `GapReport`: missing info (floor number, medication), weak answers (vague location), and an optimized `CallScript` that front-loads critical info. Sends missing-info questions back to Interview Agent → user. |
| **Live Caller Agent** | Makes the real call with the optimized script | Armed with the rehearsal-optimized script, makes the real VoIP call. Because gaps were pre-filled, the call is faster and smoother. Handles unexpected questions using the rehearsal experience. |
| **Monitor Agent** | Keeps user informed during the live call | Real-time transcript, status updates, and the ability to inject corrections. Also compares live call to rehearsal — if dispatch deviates from expected questions, flags it. |

**Communication pattern:** Two-phase sequential. Phase 1 is a closed-loop rehearsal (Interview ↔ User, Rehearsal Caller ↔ Simulator, Gap Analyzer feedback). Phase 2 is the optimized live call.

### Tech Stack
- **Interview Agent:** Claude Sonnet + accessible React frontend with visual aids
- **Simulated Dispatcher:** GPT-4o fine-tuned on dispatch conversation transcripts (or few-shot prompted with real protocols)
- **Rehearsal + Live Caller:** OpenAI Realtime API or Vapi.ai (voice-to-voice with <500ms latency)
- **Gap Analyzer:** Claude with structured output (JSON gap report)
- **Monitor:** WebSocket + React
- **Orchestration:** Simple Python state machine (two phases, well-defined transitions)
- **Voice:** ElevenLabs for natural TTS, Deepgram for STT

### Demo Scenario (10 min)

1. **(0:00–1:30)** Frame the insight: "What if you could practice a critical phone call before making it? That's what our system does — for emergencies, where getting it right the first time saves lives."
2. **(1:30–3:00)** User types: "Heart attack, my wife, she's on the floor." Interview Agent asks 3 quick visual questions (show the accessible UI — body tap for pain location, auto-detected address, age slider).
3. **(3:00–5:30)** **Rehearsal (the audience watches).** Split screen: Rehearsal Caller talks to Simulated Dispatcher. The Simulator pushes hard: "Is she conscious? Is she breathing? Any prior heart conditions? Is she on blood thinners?" The Rehearsal Caller stumbles on "blood thinners" — doesn't have that info.
4. **(5:30–6:30)** Gap Analyzer produces report: "Missing: medication history, prior conditions. Weak: exact age (said 'around 60'). Optimized script generated." Interview Agent asks user: "Is your wife taking any medication?" User types: "aspirin every day for heart." Gap filled.
5. **(6:30–8:30)** **Live call.** Now the audience hears a dramatically smoother call. Live Caller front-loads everything: "Medical emergency, 62-year-old female, suspected cardiac arrest, unconscious, on daily aspirin, at [exact address], ground floor, door is unlocked." Dispatch confirms ambulance in under 60 seconds. Compare to the rehearsal where it took 3 minutes.
6. **(8:30–10:00)** Side-by-side comparison: rehearsal call (choppy, gaps) vs. live call (smooth, complete). Show time saved: 3 min rehearsal call → 1 min live call. "In an emergency, those 2 minutes could save a life."

### Wow Moment
The **side-by-side comparison** between the messy rehearsal call and the polished live call. The audience viscerally sees how pre-flight simulation transforms a chaotic emergency call into a crisp, professional one — and realizes this applies to anyone, not just impaired users.

### What's Risky
- Two-phase approach adds total time. If rehearsal + gap-filling takes 5 minutes, and the actual emergency is a cardiac arrest, that delay could be fatal. Need a "fast path" for obvious critical emergencies (skip rehearsal, call immediately).
- The Simulated Dispatcher might not match real dispatch behavior, making the rehearsal less useful
- Complexity of building a convincing dispatcher simulation on top of the actual system

### What's Novel
- **Adversarial pre-testing of emergency calls.** Nobody does this. The insight is profound: emergency calls are high-stakes conversations where preparation matters enormously, but currently there's zero preparation — you just call and hope.
- **The rehearsal data is training data.** Every rehearsal + live call pair becomes a training example: "this gap was missed in rehearsal, here's how it was resolved." The system gets better at anticipating dispatch questions over time.
- **Universally useful.** This isn't just for impaired users — anyone making a stressful emergency call would benefit from a 30-second rehearsal.

---

## Solution 5: Community Relay Network

### Pitch
Don't just call dispatch — simultaneously activate a network of nearby trained volunteers, turning the emergency into a coordinated multi-stakeholder response where professional services AND community first-responders converge on the scene.

### Agent Architecture

```
                         User
                          │
                   ┌──────▼──────┐
                   │ Intake Agent │
                   └──────┬──────┘
                          │
                   ┌──────▼──────┐
                   │  Coordinator │
                   │    Agent     │
                   └──┬──────┬───┘
                      │      │
          ┌───────────▼┐   ┌▼────────────┐
          │  Dispatch   │   │  Community   │
          │  Agent      │   │  Agent       │
          └──────┬──────┘   └──────┬──────┘
                 │                 │
           Real Dispatch    Nearby Volunteers
                 │                 │
          ┌──────▼─────────────────▼──────┐
          │      Situation Agent          │
          │   (keeps everyone in sync)    │
          └───────────────────────────────┘
                         │
                    ┌────▼────┐
                    │  User   │
                    │Companion│
                    └─────────┘
```

| Agent | Role | Actions |
|-------|------|---------|
| **Intake Agent** | Parses emergency from impaired input | Same as other solutions — text/speech/sign → structured emergency data. Focus on speed, minimal questions. |
| **Coordinator Agent** | Orchestrates the multi-stakeholder response | Decides what resources to activate: always Dispatch Agent, plus Community Agent if appropriate. Maintains global situation state. Handles the sequencing (dispatch first, then community — or parallel for critical cases). |
| **Dispatch Agent** | Handles the 112 call | Makes the VoIP call to dispatch. Professional, protocol-focused. Reports back: ETA, what services are coming, any instructions. |
| **Community Agent** | Activates nearby trained volunteers | Queries a volunteer database by location + skills (CPR-certified, first aid, sign language speaker). Sends alerts via SMS/push notification with situation summary + location. Tracks volunteer responses ("I'm 2 minutes away"). A certified deaf interpreter volunteer could physically bridge communication when they arrive. |
| **Situation Agent** | Maintains shared awareness across all parties | Aggregates data from all sources: user updates, dispatch ETA, volunteer positions, first-aid guidance. Provides a real-time situation dashboard. Detects conflicts (volunteer says "patient is breathing" but user said "not breathing" → escalate). |
| **User Companion** | The user's accessible interface | Shows everything happening: dispatch status, nearest volunteer ETA + name + photo, first-aid instructions, a map with all responders converging. Calming, clear, visual. |

**Communication pattern:** Hub-and-spoke (Coordinator) + shared situation awareness (Situation Agent). The Coordinator decides what to activate; the Situation Agent keeps everyone on the same page.

### Tech Stack
- **Coordinator + Situation Agent:** Python with Redis for real-time state, LangGraph for orchestration
- **Dispatch Agent:** Twilio Voice + OpenAI Realtime API
- **Community Agent:** Twilio SMS/WhatsApp for volunteer alerts, PostGIS for geospatial volunteer lookup
- **Volunteer DB:** PostgreSQL + PostGIS (for demo: seeded with fake volunteers near demo location)
- **Frontend:** Next.js with Mapbox/Leaflet for real-time map showing converging responders
- **First-aid guidance:** RAG over Red Cross first-aid manuals, served via Companion Agent

### Demo Scenario (10 min)

1. **(0:00–1:30)** "When you're deaf and alone with an emergency, help feels impossibly far away. What if the system didn't just call 112 — but also brought help from right next door?"
2. **(1:30–3:00)** User types: "Man collapsed on sidewalk outside my building, not moving." Show Intake Agent processing, Coordinator deciding: MEDICAL + CRITICAL → activate BOTH dispatch and community.
3. **(3:00–5:00)** **Parallel activation.** Left panel: Dispatch Agent calls 112, professional voice call proceeding. Right panel: Community Agent finds 3 nearby volunteers:
   - Marko K., 200m away, CPR-certified ✅
   - Ana S., 500m away, first-aid trained ✅
   - Jelena P., 300m away, sign language interpreter ✅ (!)
   - Show SMS going out: "Emergency nearby. Man collapsed, [address]. Your skills needed. Accept? Reply DA"
4. **(5:00–7:00)** Marko replies "DA" — his dot starts moving on the map toward the location. Dispatch confirms ambulance ETA: 9 minutes. Marko's ETA: 2 minutes. Companion Agent tells user: "A CPR-certified volunteer named Marko is 2 minutes away. Ambulance in 9 minutes."
5. **(7:00–8:30)** Situation Agent coordinates: sends Marko the situation details + CPR instructions. Shows the user's screen updating in real-time: Marko's dot approaching, then "Marko arrived ✅." Meanwhile, Jelena (sign language interpreter) is also en route — "A sign language interpreter is coming too — 4 minutes."
6. **(8:30–10:00)** Final view: the convergence map with ambulance (from hospital), Marko (on scene), Jelena (approaching), all coordinated. "Professional help in 9 minutes. But help on the ground in 2 minutes. For a cardiac arrest, those 7 minutes are the difference between life and death."

### Wow Moment
The **real-time convergence map** showing professional services AND community volunteers all moving toward the emergency location, with the deaf user getting live updates about who's coming, when they'll arrive, and what skills they bring — including a sign language interpreter who can bridge communication when they arrive. The gap between "ambulance in 9 minutes" and "CPR-trained volunteer in 2 minutes" makes the audience gasp.

### What's Risky
- Volunteer network doesn't exist — would need to be built (chicken-and-egg). For demo, it's simulated, but judges may question feasibility.
- Privacy and safety: alerting strangers about vulnerable people's locations is sensitive
- Liability: what if a volunteer makes things worse?
- Most complex system of all 5 solutions — lots of moving parts to demo

### What's Novel
- **Extends the agent system beyond caller↔dispatch into a multi-stakeholder coordination problem.** No existing emergency system activates community first-responders alongside professional services for accessibility scenarios.
- **The deaf interpreter volunteer.** The system doesn't just get medical help — it finds someone who can communicate with the user in sign language. The AI agent solves the communication gap temporarily, but then delivers a human who can bridge it permanently.
- **Inspired by real systems** (PulsePoint, GoodSAM) but integrating them into an AI-driven accessible emergency relay is new.

---

## Comparison Matrix

| Dimension | 1. Voice Bridge | 2. Orchestrated Triad | 3. Specialist Swarm | 4. Rehearse-Then-Call | 5. Community Relay |
|-----------|----------------|----------------------|---------------------|----------------------|-------------------|
| **# Agents** | 4 | 4 | 7 | 6 | 6 |
| **Pattern** | Linear pipeline | Hub-and-spoke | Broadcast → fan-in | Two-phase sequential | Multi-stakeholder hub |
| **Build complexity** | Medium | Medium-High | High | Medium | High |
| **Demo impressiveness** | High (live call) | High (split screen) | Very High (voting viz) | Very High (before/after) | Highest (convergence map) |
| **Technical risk** | Medium (latency) | Medium (orchestration) | High (parallel LLMs) | Low-Medium (two phases) | High (many integrations) |
| **Novelty** | Medium | Medium | High | Very High | High |
| **Real-world viability** | High | High | Medium (overkill?) | Very High | Medium (needs volunteer network) |
| **Best for team that is...** | Strong on voice/telephony | Strong on systems design | Strong on ML/AI | Strong on UX storytelling | Strong on full-stack + maps |

## Recommendation

For a 48-hour hackathon optimizing for **demo impact + feasibility**:

- **Safest bet:** Solution 1 (Voice Bridge) — straightforward, clearly demonstrable, the live voice call is inherently impressive
- **Highest ceiling:** Solution 4 (Rehearse-Then-Call) — the before/after comparison is a killer demo moment, and the concept is genuinely novel and universally applicable
- **Biggest wow:** Solution 5 (Community Relay) — the convergence map is unforgettable, but it's the hardest to build convincingly in 48h
- **Most technically impressive:** Solution 3 (Specialist Swarm) — judges who appreciate AI architecture will love it
- **Best balance:** Solution 2 (Orchestrated Triad) — clean architecture, good demo, manageable scope

If the team is strong on frontend/UX: go with **Solution 4 or 5**.
If the team is strong on AI/backend: go with **Solution 3**.
If the team wants to minimize risk: go with **Solution 1 or 2**.
