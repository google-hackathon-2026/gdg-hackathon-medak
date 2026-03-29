# Our Hackathon Journey

> From "it sort of worked" to "38 seconds, every time."

## Timeline

```
PRE-HACK         DAY 1              DAY 2              NIGHT 2         DEMO DAY
───────────────┬──────────────────┬──────────────────┬───────────────┬──────────
Research &     │ Architecture &   │ Confidence Bug & │ Strategy      │ Slides,
Problem Select │ Core Build       │ Demo Mode        │ Sprint        │ Rehearse,
               │                  │                  │               │ Ship
50+ problems   │ 2 agents + FSM   │ 25 bugs fixed    │ Pitch script  │ 38s demo
screened       │ + audio bridge   │ 230 tests green  │ 26 Q&A cards  │ validated
───────────────┴──────────────────┴──────────────────┴───────────────┴──────────
  9 files         ~2,500 LoC         14 P0 squashed     12 slides       GO TIME
  235KB research  1st e2e test ✓     demo mode built    83% PMF survey
```

## Phase 0 — Pre-Hackathon (Research)

**Goal:** Pick the right problem. Don't build something we can't demo.

- Screened **50+ accessibility problems** across assistive tech, communication, emergency services
- Narrowed to two finalists: P09 (emergency dispatch) vs P11 (autism prediction)
- P09 won on three criteria: demo clarity, multi-agent fit, build confidence
- Produced **9 research files, 235KB** of domain analysis
- The insight that shaped everything:

> *"Every previous solution tried to change the PSAP. We won't. We sit in front of it."*

**Output:** Problem brief, competitive landscape, architecture sketch

## Phase 1 — Day 1: Architecture & Core Build

**Goal:** Get a call from SOS to operator, end to end, once.

| Component | What we built |
|---|---|
| **Orchestrator** | Deterministic FSM — no LLM deciding call flow |
| **User Agent** | Gemini 2.0 Flash Live, 8 tool calls (`set_emergency_type`, `confirm_location`, `set_clinical_fields`, `set_caller_condition`, `set_scene_description`, `mark_immediate_danger`, `set_consciousness_level`, `finalize_snapshot`) |
| **Dispatch Agent** | Gemini 2.0 Flash Live, 5 tool calls (`deliver_emergency_brief`, `relay_question`, `relay_answer`, `update_snapshot_field`, `resolve_call`) |
| **Audio Bridge** | Twilio μ-law 8kHz ↔ Gemini PCM 16/24kHz, real-time bidirectional |
| **Data Model** | `EmergencySnapshot` — Redis-backed, single source of truth |
| **Confidence Score** | Deterministic weighted formula (type, location, clinical, scene, danger) |

**First end-to-end test result:** It sort of worked. The AI talked, the data flowed, the operator got *something*. Not good enough — but proof the architecture held.

## Phase 2 — Day 2: The Confidence Racing Bug & Demo Mode

**Goal:** Make it reliable. Make it demonstrable.

### The Bug That Almost Killed Us

**Confidence racing** — the User Agent was too eager. It would hit 85% confidence with just emergency type + location, then hand off to the Dispatch Agent. The operator would get a call with: *"There's a medical emergency at 123 Main St."* Useless.

**The fix:**
- Rebalanced weights: `emergency_type` 0.30 → 0.25
- Added **clinical data requirements** as hard gate before handoff
- Result: operator now gets actionable intel every time

### Bug Hunting (3 rounds)

| Priority | Count | Examples |
|---|---|---|
| **P0 — Blockers** | 14 | Audio dropout on codec switch, FSM stuck in GATHERING state, snapshot race condition |
| **P1 — Important** | 6 | Confidence display lag, incomplete tool call validation |
| **Quick wins** | 5 | Typos in prompts, log formatting, timeout tuning |
| **Total** | **25** | All resolved |

### Demo Mode

Built a **scripted demo mode** — same real pipeline (FSM, audio bridge, Redis, tool calls), but agents follow a known scenario. Not a mock. Not a recording. The real system, with predictable inputs.

**Validation:** 230 tests passing. **38-second SOS → RESOLVED** demo, repeatable.

## Phase 3 — Night 2: Strategy Sprint

**Goal:** Answer every question a judge could ask.

| Sprint | Output |
|---|---|
| Business strategy | 3 personae, user/buyer separation, unit economics, cost model |
| User needs analysis | 18 survey respondents, **83% said they'd use it** (PMF signal) |
| Research mapping | 12 connections from academic papers → our implementation choices |
| Quality review | Found 17 doc issues, fixed all before morning |
| Pitch script | 12 slides, word-for-word script, timed to **600 seconds** |
| Q&A prep | **26 anticipated questions** with rehearsed answers |

## Phase 4 — Presentation Day

- Slides built from copy-paste spec (no last-minute design scramble)
- 3 full rehearsals, timed
- Demo tested on venue WiFi (the real risk)
- Go time

## By The Numbers

```
Research files written .............. 9  (235 KB)
Agents built ....................... 2  (Gemini 2.0 Flash Live)
Tool calls implemented ............ 13  (8 user + 5 dispatch)
Bugs found and fixed .............. 25  (14 P0, 6 P1, 5 quick)
Tests passing .................... 230
Survey respondents ................ 18  (83% PMF)
Q&A questions prepared ............ 26
Pitch slides ...................... 12
Demo time (SOS → RESOLVED) ....... 38 seconds
```

## The Engineering Story Arc

1. **"Can we even do this?"** → Research says yes, if we don't try to replace the PSAP
2. **"It sort of worked"** → First e2e call: messy, but the architecture held
3. **"Why is the operator getting garbage?"** → Confidence racing bug, hardest problem of the weekend
4. **"38 seconds, every time"** → Demo mode + bug fixes = reliable, repeatable, real

## What We Actually Learned

1. **Deterministic > probabilistic for orchestration.** We almost used an LLM to manage call flow. FSM was the right call — predictable, testable, debuggable.
2. **The hardest bug was a design bug, not a code bug.** Confidence racing wasn't a typo. It was a wrong assumption about when "enough info" is actually enough.
3. **Demo mode isn't cheating — it's engineering.** Same pipeline, controlled inputs. Judges see the real system. We sleep at night.
4. **Strategy work multiplies engineering work.** The 26 Q&A cards might matter more than the 230 tests. Judges can't run our tests. They can ask questions.
5. **Don't change the PSAP.** The insight that started the project was also the insight that saved it. Every time we were tempted to add operator-side features, we pulled back.
