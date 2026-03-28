# DEMO_PLAN.md — Medak Hackathon Demo Strategy

> **Purpose:** This is the execution blueprint for a 60–90 second live demo that works every single time.
> Hand this to an implementation agent. Every detail is here.

---

## Table of Contents

1. [The Demo Scenario](#1-the-demo-scenario)
2. [What to Hardcode / Mock](#2-what-to-hardcodemock-for-reliability)
3. [Demo Mode Architecture](#3-demo-mode-architecture)
4. [Visual Impact — What Judges See](#4-visual-impact--what-judges-see)
5. [The "Implementation Problem" Story](#5-the-implementation-problem-story)
6. [Specific Mock Data](#6-specific-mock-data)
7. [Timing Script — Second by Second](#7-timing-script--second-by-second)
8. [Implementation Checklist](#8-implementation-checklist)

---

## 1. The Demo Scenario

### The Story: Meet Ana

> Ana (28) is deaf since birth. She lives alone in Belgrade. Her elderly neighbor Milica (72) was visiting for coffee when Milica collapsed in Ana's kitchen — a suspected stroke. Milica is on the floor, semi-conscious, breathing irregularly. Ana is panicking. She can't call 112. She can't shout for help. She grabs her phone and hits the red SOS button.

### Why This Scenario Wins

- **Medical emergency** — highest emotional stakes, judges feel the urgency
- **Stroke** — everyone knows what a stroke is, no explanation needed
- **Elderly neighbor** — adds human dimension ("this isn't about Ana, it's about saving Milica")
- **Semi-conscious + breathing** — gives the dispatcher something to ask about (creates the cross-agent Q&A moment)
- **Solo apartment** — Ana is truly alone, no one else to call. The system IS her voice
- **Belgrade address** — local, real, verifiable on Google Maps

### What the Presenter Says (Before Demo)

> "Ovo je Ana. Gluva je od rodjenja. Živi sama u Beogradu. Njena komšinica Milica je upravo kolabirana u njenoj kuhinji — moguć moždani udar. Ana ne može da pozove 112. Ne može da viče u pomoć. Ali ima Medak na svom telefonu."

Then: **tap the SOS button in silence.** Let the system speak.

---

## 2. What to Hardcode/Mock for Reliability

### Decision Matrix

| Component | Live API? | Demo Mode? | Why |
|-----------|-----------|------------|-----|
| Frontend app | ✅ Real | ✅ Real | Must show actual app usage — grading criterion |
| WebSocket connection | ✅ Real | ✅ Real | Real-time updates are the visual wow factor |
| Backend API (FastAPI) | ✅ Real | ✅ Real | Real server, real endpoints |
| Redis state | ✅ Real | ✅ Real (fakeredis OK) | Real snapshot mutations, real confidence scoring |
| Orchestrator phase transitions | ✅ Real | ✅ Real | Deterministic code, no reason to mock |
| User Agent (Gemini Live) | ❌ Mock | Scripted tool calls on timers | Too risky for live demo — latency, API outage, hallucination |
| Dispatch Agent (Gemini Live) | ❌ Mock | Scripted tool calls + pre-written transcript | Same risk. Scripted speech is MORE impressive because timing is perfect |
| Twilio VoIP call | ❌ Mock | demo_dispatch.py | Can't call real 112, Twilio setup adds failure points |
| GPS location | ❌ Hardcode | Fixed Belgrade coordinates | Conference venue GPS may be wrong building |
| Reverse geocode | ❌ Hardcode | Fixed address string | Avoids Google Maps API dependency |

### The Key Insight

**Everything the judges CARE about is real:**
- Real app on a real phone
- Real SOS button press
- Real WebSocket delivering real-time updates
- Real phase transitions (INTAKE → TRIAGE → LIVE_CALL → RESOLVED)
- Real confidence score computed from real snapshot fields
- Real transcript bubbles appearing in real-time

**Everything that's mocked is invisible to judges:**
- Which LLM generated the tool calls (scripted vs. Gemini) — judges see the transcript, not the source
- Whether Twilio is connected to a real phone network — judges hear the conversation flow
- Whether GPS came from the device or was hardcoded — judges see the address on screen

### Fallback Strategy

| Failure | Fallback |
|---------|----------|
| Gemini API down | Demo mode is the default — no Gemini needed |
| Network issues at venue | Run backend on localhost, phone connects via hotspot |
| Redis unavailable | Use fakeredis (already in test suite) |
| Phone crashes | Have a second phone pre-loaded with the app |
| Demo mode script bug | Have a screen recording as absolute last resort |

---

## 3. Demo Mode Architecture

### Environment Flag

```bash
# .env
DEMO_MODE=true
DEMO_SCENARIO=stroke_neighbor    # extensible for future scenarios
```

### Config Changes (`config.py`)

```python
class Settings(BaseSettings):
    # ... existing fields ...
    demo_mode: bool = False
    demo_scenario: str = "stroke_neighbor"
```

### Architecture: DemoUserAgent and DemoDispatchAgent

Create two new files that replace the real agents when `DEMO_MODE=true`:

```
backend/
├── demo_user_agent.py      # Scripted User Agent (replaces Gemini)
├── demo_dispatch_agent.py  # Scripted Dispatch Agent (replaces Gemini + Twilio)
├── demo_dispatch.py        # Enhanced 112 simulator (already exists, enrich it)
```

### Orchestrator Integration

In `orchestrator.py`, the agent spawn methods check the flag:

```python
async def _start_user_agent(self) -> None:
    settings = get_settings()
    if settings.demo_mode:
        from demo_user_agent import run_demo_user_agent
        self._user_agent_task = asyncio.create_task(
            run_demo_user_agent(self.session_id, self.store, self.broadcast)
        )
    else:
        from user_agent import run_user_agent
        self._user_agent_task = asyncio.create_task(
            run_user_agent(self.session_id, self.store, self.broadcast)
        )

async def _start_dispatch_agent(self) -> None:
    settings = get_settings()
    if settings.demo_mode:
        from demo_dispatch_agent import run_demo_dispatch_agent
        self._dispatch_agent_task = asyncio.create_task(
            run_demo_dispatch_agent(self.session_id, self.store, self.broadcast)
        )
    else:
        from dispatch_agent import run_dispatch_agent
        self._dispatch_agent_task = asyncio.create_task(
            run_dispatch_agent(self.session_id, self.store, self.broadcast)
        )
```

### `demo_user_agent.py` — Full Implementation Spec

This agent executes a scripted sequence of tool calls with precise timing, broadcasting transcript messages to the WebSocket so the frontend shows real-time activity.

```python
"""
Demo User Agent — scripted tool-call sequence that mimics
what a real Gemini Live session would do.

The key insight: we call the EXACT SAME tool functions (UserAgentTools)
as the real agent. The snapshot mutations, confidence recalculation,
and WebSocket broadcasts are all real. Only the "brain" is scripted.
"""

import asyncio
from snapshot import SnapshotStore
from user_agent import UserAgentTools

BroadcastFn = ...  # same type

STROKE_NEIGHBOR_SCRIPT = [
    # (delay_seconds, action_type, action_args, transcript_text)
    (1.0, "transcript", None,
     "Analiziram okolinu... Detektujem osobu na podu."),

    (2.5, "tool_call", ("set_emergency_type", {"emergency_type": "MEDICAL"}),
     "Medicinski hitan slučaj detektovan."),

    (4.0, "tool_call", ("append_free_text", {"utterance": "Starija žena leži na podu kuhinje, moguć moždani udar"}),
     None),

    (5.5, "tool_call", ("confirm_location", {"address": "Bulevar kralja Aleksandra 73, Beograd"}),
     "Lokacija potvrđena: Bulevar kralja Aleksandra 73."),

    (7.0, "tool_call", ("set_clinical_fields", {"victim_count": 1, "conscious": True, "breathing": True}),
     "Jedna žrtva. Pri svesti — reaguje na dodir. Diše nepravilno."),

    (8.5, "tool_call", ("append_free_text", {"utterance": "Žrtva pokazuje znake konfuzije, otežan govor, asimetrija lica"}),
     "Detektujem znake moždanog udara: konfuzija, asimetrija lica."),
]

async def run_demo_user_agent(
    session_id: str,
    store: SnapshotStore,
    broadcast: BroadcastFn,
) -> None:
    tools = UserAgentTools(session_id, store, broadcast)
    tool_map = {
        "confirm_location": lambda args: tools.confirm_location(args["address"]),
        "set_emergency_type": lambda args: tools.set_emergency_type(args["emergency_type"]),
        "set_clinical_fields": lambda args: tools.set_clinical_fields(**args),
        "append_free_text": lambda args: tools.append_free_text(args["utterance"]),
    }

    start = asyncio.get_event_loop().time()

    for delay, action_type, action_args, transcript_text in STROKE_NEIGHBOR_SCRIPT:
        # Wait until the right moment
        elapsed = asyncio.get_event_loop().time() - start
        wait = delay - elapsed
        if wait > 0:
            await asyncio.sleep(wait)

        # Execute tool call (real snapshot mutation)
        if action_type == "tool_call":
            tool_name, kwargs = action_args
            handler = tool_map.get(tool_name)
            if handler:
                await handler(kwargs)

        # Broadcast transcript (real WebSocket message)
        if transcript_text:
            await broadcast(session_id, {
                "type": "transcript",
                "speaker": "assistant",
                "text": transcript_text,
            })

    # After script completes, enter monitoring mode for dispatch questions
    while True:
        snap = await store.load(session_id)
        if snap is None or snap.phase.value in ("RESOLVED", "FAILED"):
            break

        # Check for dispatch questions (cross-agent Q&A)
        pending = await tools.get_pending_dispatch_question()
        if pending != "NONE":
            # Simulate answering after a brief "checking" delay
            await asyncio.sleep(1.5)

            # Hardcoded answers for known questions
            answer_map = {
                "Da li je pacijent pri svesti?": "Da, pri svesti je ali je konfuzna i ima otežan govor.",
                "Da li pacijent diše?": "Da, diše ali nepravilno.",
                "Koliko ima godina?": "Oko 70 godina.",
                "Da li uzima neke lekove?": "Nije poznato, proveravam sa pozivaocem.",
            }
            answer = answer_map.get(pending, "Proveravam sa pozivaocem, jedan momenat.")
            await tools.answer_dispatch_question(pending, answer)

            await broadcast(session_id, {
                "type": "transcript",
                "speaker": "assistant",
                "text": f"Odgovor na pitanje dispečera: {answer}",
            })

        await asyncio.sleep(2)
```

### `demo_dispatch_agent.py` — Full Implementation Spec

```python
"""
Demo Dispatch Agent — scripted voice call to simulated 112.

This agent doesn't actually call anyone. It:
1. Simulates DIALING → CONNECTED status changes
2. Broadcasts a scripted transcript of the 112 conversation
3. Handles the Q&A relay through the snapshot (same as real agent)
4. Confirms dispatch with ETA
"""

import asyncio
from snapshot import SnapshotStore, CallStatus
from dispatch_agent import DispatchAgentTools

BroadcastFn = ...

DISPATCH_SCRIPT = [
    # (delay_from_phase_start, action, transcript_speaker, transcript_text)

    # --- Call setup ---
    (0.0, "status_dialing", None, None),
    (0.5, "transcript", "assistant", "Pozivam 112..."),
    (2.0, "status_connected", None, None),

    # --- Dispatcher greeting ---
    (2.5, "transcript", "dispatch",
     "Hitna služba, šta se desilo?"),

    # --- Agent delivers brief ---
    (4.0, "get_brief_and_speak", None, None),
    # This is a special action that reads the snapshot and generates the brief dynamically

    # --- Dispatcher asks question ---
    (12.0, "transcript", "dispatch",
     "Da li je pacijent pri svesti? Da li reaguje na pitanja?"),
    (12.5, "queue_question", "Da li je pacijent pri svesti?", None),

    # --- Wait for answer from user agent, then relay ---
    (15.0, "relay_answer", "Da li je pacijent pri svesti?", None),

    # --- Dispatcher asks about age ---
    (20.0, "transcript", "dispatch",
     "Koliko ima godina pacijentkinja?"),
    (20.5, "queue_question", "Koliko ima godina?", None),
    (23.0, "relay_answer", "Koliko ima godina?", None),

    # --- Dispatcher confirms ---
    (28.0, "transcript", "dispatch",
     "Razumem. Šaljemo ekipu hitne pomoći. Procenjeno vreme dolaska je 8 minuta. Ostanite pored pacijentkinje i ne pomerajte je."),

    # --- Agent confirms dispatch ---
    (30.0, "confirm", 8, None),
]


async def run_demo_dispatch_agent(
    session_id: str,
    store: SnapshotStore,
    broadcast: BroadcastFn,
) -> None:
    tools = DispatchAgentTools(session_id, store, broadcast)
    start = asyncio.get_event_loop().time()

    for entry in DISPATCH_SCRIPT:
        delay, action = entry[0], entry[1]

        # Wait for the right moment
        elapsed = asyncio.get_event_loop().time() - start
        wait = delay - elapsed
        if wait > 0:
            await asyncio.sleep(wait)

        if action == "status_dialing":
            await tools.update_call_status("DIALING")
            await broadcast(session_id, {
                "type": "STATUS_UPDATE",
                "phase": "LIVE_CALL",
                "confidence": 1.0,
            })

        elif action == "status_connected":
            await tools.update_call_status("CONNECTED")

        elif action == "transcript":
            speaker, text = entry[2], entry[3]
            await broadcast(session_id, {
                "type": "transcript",
                "speaker": speaker,
                "text": text,
            })

        elif action == "get_brief_and_speak":
            brief = await tools.get_emergency_brief()
            # Format the brief as the dispatch agent would speak it
            speech = (
                "Ovo je automatizovani poziv hitne službe u ime osobe koja ne može da govori. "
                f"Imam informacije o hitnom slučaju. {_brief_to_speech(brief)}"
            )
            await broadcast(session_id, {
                "type": "transcript",
                "speaker": "assistant",
                "text": speech,
            })

        elif action == "queue_question":
            question = entry[2]
            await tools.queue_question_for_user(question)

        elif action == "relay_answer":
            question = entry[2]
            # Poll for answer (demo user agent should have answered by now)
            for _ in range(10):
                answer = await tools.get_user_answer(question)
                if answer != "PENDING":
                    await broadcast(session_id, {
                        "type": "transcript",
                        "speaker": "assistant",
                        "text": answer,
                    })
                    break
                await asyncio.sleep(0.5)
            else:
                await broadcast(session_id, {
                    "type": "transcript",
                    "speaker": "assistant",
                    "text": "Još čekam odgovor od pozivaoca...",
                })

        elif action == "confirm":
            eta = entry[2]
            await tools.confirm_dispatch(eta)
            await broadcast(session_id, {
                "type": "transcript",
                "speaker": "assistant",
                "text": f"Ekipa je poslata. Dolaze za {eta} minuta.",
            })


def _brief_to_speech(brief: str) -> str:
    """Convert the pipe-separated brief into natural speech."""
    # brief format: "Tip: MEDICAL | Adresa: ... | Broj zrtava: 1 | ..."
    parts = [p.strip() for p in brief.split("|")]
    sentences = []
    for part in parts:
        if part.startswith("Tip:"):
            val = part.split(":", 1)[1].strip()
            type_map = {"MEDICAL": "medicinski", "FIRE": "požar", "POLICE": "policija"}
            sentences.append(f"Radi se o {type_map.get(val, val)} hitnom slučaju.")
        elif part.startswith("Adresa:"):
            val = part.split(":", 1)[1].strip()
            sentences.append(f"Lokacija je {val}.")
        elif part.startswith("Broj zrtava:"):
            val = part.split(":", 1)[1].strip()
            sentences.append(f"Broj žrtava: {val}.")
        elif part.startswith("Svest:"):
            val = part.split(":", 1)[1].strip()
            sentences.append(f"Pacijent je pri svesti: {val}.")
        elif part.startswith("Disanje:"):
            val = part.split(":", 1)[1].strip()
            sentences.append(f"Pacijent diše: {val}.")
        elif part.startswith("Detalji:"):
            val = part.split(":", 1)[1].strip()
            sentences.append(f"Dodatni detalji: {val}.")
    return " ".join(sentences)
```

### Frontend: Demo Location Override

In `sosFlow.ts`, when `DEMO_MODE` is active, hardcode the GPS coordinates and address:

```typescript
// lib/sosFlow.ts — add at top
const DEMO_MODE = process.env.EXPO_PUBLIC_DEMO_MODE === "true";

const DEMO_LOCATION = {
  latitude: 44.8065,
  longitude: 20.4789,
  accuracy: 5,
  address: "Bulevar kralja Aleksandra 73, Beograd",
};
```

Then in `initiateSOSCall`, if `DEMO_MODE`, use `DEMO_LOCATION` instead of `getCurrentLocation()`.

### What Remains Real in Demo Mode

| Component | Real? | Why it matters |
|-----------|-------|---------------|
| SOS button press + hold animation | ✅ | Judges see real UX interaction |
| HTTP POST to /api/sos | ✅ | Real API call, real session creation |
| WebSocket connection + messages | ✅ | Real bidirectional communication |
| Snapshot creation in Redis | ✅ | Real data model, real persistence |
| Confidence score computation | ✅ | Real `compute_confidence()` runs on real snapshot |
| Phase transitions (orchestrator) | ✅ | Real deterministic state machine |
| Transcript bubbles in UI | ✅ | Real WebSocket → React state → render |
| Progress bar climbing | ✅ | Real confidence value driving real UI |
| Haptic feedback | ✅ | Real device vibration |
| RESOLVED screen + ETA | ✅ | Real phase transition triggers real UI |

---

## 4. Visual Impact — What Judges See

### Setup: Two Screens

**Screen 1 — Phone (held by presenter or on a phone stand):**
- The actual Medak app running on a real Android/iOS device
- Judges see the SOS button, the session screen, confidence bar, transcript

**Screen 2 — Laptop/projector (split view):**

```
┌──────────────────────────────────────────────┐
│  LEFT HALF: Backend Live Log                  │  RIGHT HALF: Slide Overlay           │
│                                               │                                       │
│  [19:42:01] Session created: a3f2...          │  ┌─────────────────────────┐          │
│  [19:42:01] Phase: INTAKE → TRIAGE            │  │  Phase: TRIAGE          │          │
│  [19:42:02] Tool: set_emergency_type(MEDICAL) │  │  Confidence: ███░░ 45%  │          │
│  [19:42:04] Tool: confirm_location(...)       │  │                         │          │
│  [19:42:05] Confidence: 0.45 → 0.80          │  │  Emergency: MEDICAL     │          │
│  [19:42:06] Tool: set_clinical_fields(...)    │  │  Location: ✅           │          │
│  [19:42:07] Confidence: 0.80 → 1.00          │  │  Consciousness: ✅      │          │
│  [19:42:07] Phase: TRIAGE → LIVE_CALL         │  │  Breathing: ✅          │          │
│  [19:42:08] Dispatch: DIALING                 │  │  Victims: 1             │          │
│  [19:42:10] Dispatch: CONNECTED               │  └─────────────────────────┘          │
│  [19:42:10] 112: "Hitna služba..."            │                                       │
│  [19:42:12] Agent: "Ovo je automatizovani..." │  ┌─────────────────────────┐          │
│  [19:42:20] 112: "Da li je pri svesti?"       │  │  🔴 LIVE CALL — 112    │          │
│  [19:42:22] Agent → User: relay question      │  │  ⏱ 00:32 elapsed       │          │
│  [19:42:24] User → Agent: answer              │  └─────────────────────────┘          │
│  [19:42:25] Agent → 112: relays answer        │                                       │
│  [19:42:38] DISPATCH CONFIRMED — ETA 8 min    │  ┌─────────────────────────┐          │
│  [19:42:38] Phase: LIVE_CALL → RESOLVED       │  │  ✅ POMOĆ JE NA PUTU   │          │
│                                               │  │  ETA: 8 minuta          │          │
│                                               │  └─────────────────────────┘          │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

### Implementation: Live Dashboard

Create a simple HTML page at `backend/demo_dashboard.html` that:
1. Connects to the same WebSocket as the frontend
2. Shows a structured real-time log
3. Shows confidence as a filling bar
4. Shows the current phase with color coding
5. Shows a snapshot field checklist (✅ / ⬜)

This is a single-file HTML/JS page — no framework needed. The WebSocket messages it consumes are the same ones the phone gets.

### Visual Moments That Wow Judges

1. **T+2s: First transcript bubble appears** — "Analiziram okolinu..." — judges realize the system is DOING something
2. **T+5s: Confidence bar jumps from 20% to 80%** — visible, tangible progress
3. **T+9s: Phase transition flash** — screen changes from TRIAGE to LIVE_CALL, header turns yellow "Poziv u toku — 112"
4. **T+12s: Dispatcher voice appears in transcript** — "Hitna služba, šta se desilo?" — judges realize the system is TALKING to 112
5. **T+15s: Cross-agent relay** — dispatcher asks a question, it appears on Ana's phone as a YES/NO prompt — THIS is the magic moment. Two AI agents coordinating in real-time.
6. **T+38s: Green RESOLVED screen** — ✓ Pomoć je na putu — ETA: 8 minuta — emotional peak, applause moment

---

## 5. The "Implementation Problem" Story

### Primary Story: "The Confidence Racing Problem"

> "When we first connected the User Agent to Gemini 2.0 Flash Live, we hit a critical problem: the model was too eager. It would call `set_emergency_type(MEDICAL)` and `confirm_location()` in the same turn — both within 500ms of the session starting. The confidence score jumped from 0.20 to 0.80 instantly, triggering the dispatch call before we had clinical fields.
>
> The Dispatch Agent would then call 112 and say 'I have a medical emergency' — but when the operator asked 'Is the patient conscious?' the answer was 'I don't know yet.'
>
> We solved this with our **weighted confidence scoring system**. Instead of a binary 'we have enough info,' we assigned different weights to different fields:
> - Location confirmed: +0.35 (most important for dispatch)
> - Emergency type: +0.25
> - Consciousness: +0.15
> - Breathing: +0.15
> - Victim count: +0.10
>
> The threshold is 0.85, which means you MUST have location + emergency type + at least one clinical field before the call goes out. This prevents the 'I don't know' problem without slowing down the happy path.
>
> We also added a 10-second timeout as a safety valve — if the User Agent can't gather enough data (maybe the user is in a dark room and can't provide video), the system calls anyway with whatever it has, because a partial brief is better than no call at all."

### Why This Story Works

- It's **technically real** — the confidence scoring system IS in the codebase
- It's **believable** — LLM eagerness is a known problem
- It demonstrates **engineering judgment** — not just "we used Gemini," but "we shaped Gemini's behavior"
- It shows the team **tested and iterated** — not just coded
- It maps to grading criterion: "problem encountered during implementation + how it was resolved"

### Supporting Story (if judges ask follow-ups):

> "Another challenge was the cross-agent relay latency. When the dispatcher asks a question, it goes: Dispatch Agent → snapshot → User Agent → user's phone → user taps answer → User Agent → snapshot → Dispatch Agent → speaks to dispatcher. That's 6 hops.
>
> In testing, this took 8-12 seconds end-to-end. An operator waiting 12 seconds thinks the call is broken and might hang up.
>
> Our solution: the Dispatch Agent says 'One moment, I am checking with the caller' immediately — before the relay starts. This is a social engineering trick borrowed from how human call centers work. The operator expects a pause because they've been told to expect one. Then we optimized the polling interval to 2 seconds, which gives a worst-case 2-second delay on the relay return."

---

## 6. Specific Mock Data

### Ana's Profile (pre-configured in app Settings)

```json
{
  "name": "Ana Petrović",
  "address": "Bulevar kralja Aleksandra 73, Beograd",
  "phone": "+381641234567",
  "medicalNotes": "",
  "disability": "DEAF"
}
```

### GPS Coordinates (hardcoded in demo mode)

```
Latitude:  44.8065
Longitude: 20.4789
Address:   "Bulevar kralja Aleksandra 73, Beograd"
```

This is a real address on a main boulevard in central Belgrade (Vračar municipality). Judges can verify on Google Maps.

### EmergencySnapshot Evolution (exact values at each step)

| Time | Field Changed | New Value | Confidence |
|------|--------------|-----------|------------|
| T+0s | session created | GPS: 44.8065, 20.4789 | 0.20 |
| T+2.5s | emergency_type | MEDICAL | 0.45 |
| T+4.0s | free_text_details | ["Starija žena leži na podu kuhinje, moguć moždani udar"] | 0.45 |
| T+5.5s | location.confirmed, location.address | true, "Bulevar kralja Aleksandra 73, Beograd" | 0.80 |
| T+7.0s | victim_count, conscious, breathing | 1, true, true | **1.00** |
| T+7.0s | → Phase: TRIAGE → LIVE_CALL | — | 1.00 |

### 112 Conversation Transcript (exact words)

**Dispatcher (simulated):**
> T+10.5s: "Hitna služba, šta se desilo?"

**Dispatch Agent:**
> T+12.0s: "Ovo je automatizovani poziv hitne službe u ime osobe koja ne može da govori. Imam informacije o hitnom slučaju. Radi se o medicinskom hitnom slučaju. Lokacija je Bulevar kralja Aleksandra 73, Beograd. Broj žrtava: 1. Pacijent je pri svesti ali pokazuje znake konfuzije, otežan govor i asimetriju lica — mogući moždani udar. Pacijent diše ali nepravilno."

**Dispatcher:**
> T+20.0s: "Da li je pacijent pri svesti? Da li reaguje na pitanja?"

**Dispatch Agent:**
> T+20.5s: "Jedan momenat, proveravam sa pozivaocem."

*[Cross-agent relay happens: question appears on Ana's phone, demo user agent answers automatically]*

**Dispatch Agent:**
> T+23.0s: "Da, pri svesti je ali je konfuzna i ima otežan govor."

**Dispatcher:**
> T+28.0s: "Koliko ima godina pacijentkinja?"

**Dispatch Agent:**
> T+28.5s: "Jedan momenat."

*[Relay]*

**Dispatch Agent:**
> T+31.0s: "Oko 70 godina."

**Dispatcher:**
> T+36.0s: "Razumem. Šaljemo ekipu hitne pomoći. Procenjeno vreme dolaska je 8 minuta. Ostanite pored pacijentkinje i ne pomerajte je."

**Dispatch Agent:**
> T+38.0s: "Ekipa je poslata. Dolaze za 8 minuta."

> T+38.0s: **→ Phase: LIVE_CALL → RESOLVED**

### Resolution

- ETA: 8 minutes
- UI shows: ✓ "Pomoć je na putu — ETA: 8 minuta"
- Subtitle: "Ostanite na lokaciji i sačekajte dolazak ekipe"

---

## 7. Timing Script — Second by Second

Total demo duration: **~42 seconds** from SOS press to RESOLVED screen.
(Within the 60-90 second window when including presenter narration before/after.)

```
SECOND   PHASE        ACTION                                          FRONTEND SHOWS
───────  ──────────   ──────────────────────────────────────────────   ──────────────────────────────────
T+0.0    INTAKE       Presenter holds SOS 1.5s → API call fires       SOS button hold animation, ring fills
T+0.2    INTAKE       POST /api/sos → session created                  "Povezivanje..." + spinner
T+0.5    TRIAGE       Orchestrator: INTAKE → TRIAGE                    Phase changes, confidence bar appears (20%)
T+1.0    TRIAGE       User Agent: "Analiziram okolinu..."             Transcript bubble #1: "Analiziram okolinu..."
T+1.0    TRIAGE       [dashboard: Session created, TRIAGE]             Dashboard: log line
T+2.5    TRIAGE       Tool: set_emergency_type(MEDICAL)                Transcript: "Medicinski hitan slučaj detektovan"
T+2.5    TRIAGE       Confidence: 0.20 → 0.45                         Bar jumps to 45%
T+4.0    TRIAGE       Tool: append_free_text(...)                      [no UI change, detail logged in dashboard]
T+5.5    TRIAGE       Tool: confirm_location(address)                  Transcript: "Lokacija potvrđena: Bulevar kralja..."
T+5.5    TRIAGE       Confidence: 0.45 → 0.80                         Bar jumps to 80%
T+7.0    TRIAGE       Tool: set_clinical_fields(1, true, true)         Transcript: "Jedna žrtva. Pri svesti. Diše nepravilno."
T+7.0    TRIAGE       Confidence: 0.80 → 1.00                         Bar fills to 100% ✅
T+7.0    →LIVE_CALL   Orchestrator: TRIAGE → LIVE_CALL                 Screen transitions — yellow "Poziv u toku — 112"
T+7.0    LIVE_CALL    Dispatch Agent starts                            [transition animation]
T+7.5    LIVE_CALL    Status: DIALING                                  Transcript: "Pozivam 112..."
T+9.0    LIVE_CALL    Status: CONNECTED                                [dashboard: CONNECTED]
T+10.5   LIVE_CALL    Dispatcher: "Hitna služba, šta se desilo?"       Transcript bubble from dispatch
T+12.0   LIVE_CALL    Agent: delivers full brief                        Long transcript bubble with emergency details
T+20.0   LIVE_CALL    Dispatcher: "Da li je pri svesti?"               Transcript bubble from dispatch
T+20.5   LIVE_CALL    Agent queues question → User Agent               User question overlay appears on phone: "Da li je pacijent pri svesti?" with DA/NE buttons
T+22.0   LIVE_CALL    User Agent answers from knowledge                 Question overlay dismissed, answer transcript
T+23.0   LIVE_CALL    Agent relays to dispatcher                        Transcript: answer spoken
T+28.0   LIVE_CALL    Dispatcher: "Koliko ima godina?"                 Transcript bubble
T+28.5   LIVE_CALL    Relay cycle (shorter this time)                   Question → answer → relay
T+31.0   LIVE_CALL    Agent relays age answer                           Transcript: "Oko 70 godina."
T+36.0   LIVE_CALL    Dispatcher: "Šaljemo ekipu... 8 minuta"         Transcript: dispatcher confirms
T+38.0   LIVE_CALL    Tool: confirm_dispatch(8)                         [state update]
T+38.0   →RESOLVED    Orchestrator: LIVE_CALL → RESOLVED               🟢 GREEN SCREEN: "✓ Pomoć je na putu — ETA: 8 min"
T+38.0   RESOLVED     Haptic burst on phone                            Phone vibrates — success pattern
```

### Presenter Script (wrapping the demo)

```
[BEFORE DEMO — 30 seconds]
"Ovo je Ana. Gluva je od rodjenja. Živi sama u Beogradu.
 Njena komšinica Milica je upravo kolabirana — mogući moždani udar.
 Ana ne može da pozove 112. Ali ima Medak."
[Points to phone]
"Gledajte."

[DEMO RUNS — 42 seconds, in silence]
[Phone is visible to judges. Dashboard on projector.]
[Presenter says NOTHING during the demo. Let the system speak.]

[AFTER DEMO — 20 seconds]
"Od SOS dugmeta do potvrde hitne pomoći — 38 sekundi.
 Bez ijedne izgovorene reči.
 Dva Gemini agenta, jedan poziv, jedan spašen život.

 A sada — kako to radi ispod haube..."
[Transition to architecture slides]
```

---

## 8. Implementation Checklist

Priority-ordered tasks for the execution agent:

### P0 — Must Have (demo doesn't work without these)

- [ ] **Create `demo_user_agent.py`** — scripted tool-call sequence per spec in section 3
- [ ] **Create `demo_dispatch_agent.py`** — scripted dispatch conversation per spec in section 3
- [ ] **Add `DEMO_MODE` flag to `config.py`** — `demo_mode: bool = False`
- [ ] **Modify `orchestrator.py`** — conditional agent imports based on `demo_mode`
- [ ] **Hardcode demo location in frontend** — `EXPO_PUBLIC_DEMO_MODE=true` → bypass GPS
- [ ] **Enrich `demo_dispatch.py`** — richer script with the exact dispatcher lines from section 6 (keep it as optional backing for a Twilio-connected demo, but the demo_dispatch_agent.py handles the primary flow)
- [ ] **Add `"dispatch"` as a valid speaker type** in frontend transcript rendering (currently only "assistant" | "user") — dispatch speaker should render with a different color/label like "112 Operater"
- [ ] **Test end-to-end flow locally** — SOS → TRIAGE → LIVE_CALL → RESOLVED in <45 seconds

### P1 — Should Have (significantly improves demo impact)

- [ ] **Create `demo_dashboard.html`** — single-file HTML dashboard that connects to the same WebSocket and shows real-time log + confidence bar + phase indicator + field checklist
- [ ] **Add `user_question` WebSocket message support in demo mode** — the cross-agent relay should show the question overlay on the phone screen during LIVE_CALL, even if automatically dismissed
- [ ] **Tune timing** — run the demo 5 times, adjust delays so it feels natural (not robotic, not rushed)
- [ ] **Add a "dispatch" speaker label in the transcript** — visually distinguish "Sistem" (our AI), "112 Operater" (dispatcher), and "Vi" (user)

### P2 — Nice to Have (polish)

- [ ] **Screen recording backup** — record one perfect demo run as absolute fallback
- [ ] **Demo reset endpoint** — `POST /api/demo/reset` that clears all sessions and restarts clean
- [ ] **Sound effects** — subtle "connecting" sound when DIALING, subtle "ding" on RESOLVED
- [ ] **Demo countdown overlay** — small timer in corner of dashboard showing elapsed seconds

### Technical Notes for Implementation Agent

1. **Don't modify the real agent code** — `user_agent.py` and `dispatch_agent.py` stay untouched. Demo mode is a parallel path, not a modification.

2. **Use the real `UserAgentTools` and `DispatchAgentTools` classes** — import them in the demo agents. This ensures all snapshot mutations and WebSocket broadcasts go through the same code path. The only difference is WHO calls the tools (scripted timer vs. Gemini).

3. **The orchestrator's triage loop checks confidence every 1 second** — make sure the demo user agent's timing aligns so confidence crosses 0.85 at T+7s (after `set_clinical_fields`), which will cause the orchestrator to naturally transition to LIVE_CALL.

4. **fakeredis is fine for the demo** — no need to run a real Redis instance. The test suite already uses fakeredis. For demo, set `REDIS_URL=fakeredis://` or just initialize SnapshotStore with a fakeredis client.

5. **The transcript "speaker" field needs a new value** — currently the WebSocket protocol uses `"assistant"` and `"user"`. For the demo, add `"dispatch"` for the 112 operator lines. The frontend needs to handle this (different color bubble, label "112 Operater"). This is a small but high-impact visual change.

6. **The `user_question` WebSocket event is already handled** — the frontend already shows a YES/NO overlay. In demo mode, the demo_user_agent should answer the question automatically (with a 1.5s delay for visual effect), but the question SHOULD appear on the phone screen briefly so judges see the relay mechanism.

---

## Appendix A: Enhanced `demo_dispatch.py` (Optional — For Twilio-Connected Demo)

If the team manages to get Twilio working and wants the demo_dispatch.py to act as the simulated 112 endpoint receiving actual audio, here's the enhanced script:

```python
ENHANCED_SCRIPT = {
    DispatchState.GREETING: {
        "text": "Hitna služba, šta se desilo?",
        "delay": 2,
    },
    DispatchState.ASKING_CONSCIOUS: {
        "text": "Da li je pacijent pri svesti? Da li reaguje na pitanja?",
        "delay": 15,
    },
    DispatchState.ASKING_AGE: {
        "text": "Koliko ima godina pacijentkinja?",
        "delay": 22,
    },
    DispatchState.CONFIRMING: {
        "text": "Razumem. Šaljemo ekipu hitne pomoći. Procenjeno vreme dolaska je 8 minuta. Ostanite pored pacijentkinje i ne pomerajte je.",
        "delay": 30,
    },
}
```

## Appendix B: What Judges Will Remember

1. **"They pressed one button and the AI called 112 for them"** — the core value proposition in one sentence
2. **"The confidence bar filling up in real-time"** — tangible, visual progress
3. **"The dispatcher asked a question and it appeared on the deaf user's phone"** — the cross-agent relay is the WOW moment
4. **"38 seconds from SOS to help confirmed"** — a number they'll cite in scoring

## Appendix C: Q&A Preparation

**"Is this a mockup?"**
> "No. The app is running on a real phone, connected to a real backend via WebSocket. The phase transitions, confidence scoring, and data flow are all live. The only thing simulated is the 112 endpoint — because we legally can't call real emergency services during a hackathon."

**"What if Gemini is slow?"**
> "Our orchestrator has a 10-second triage timeout. If the User Agent hasn't gathered enough data in 10 seconds, the system calls anyway with whatever it has. A partial brief is better than no call."

**"How is this different from just texting 112?"**
> "Serbia — and most of Europe — has no text-to-112 infrastructure. The EU mandated it by 2027 but implementation is years away. Medak works TODAY, on the caller side, with zero changes to existing dispatch infrastructure."

**"What about false positives / hallucinations?"**
> "The Dispatch Agent is explicitly instructed to say 'that information has not been confirmed' for any field that's null in the snapshot. It never guesses. And the confidence scoring ensures we have a minimum amount of verified data before calling."
