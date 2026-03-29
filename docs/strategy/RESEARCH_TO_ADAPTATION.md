# Research → Adaptation: How User Research Shaped Every Decision

> **Grading question:** *"Did the team take the research findings into account and adapt the application accordingly?"*
>
> **Our answer:** Every major architectural decision in Medak traces back to a specific research finding — from our primary survey of 18 respondents in the deaf/HoH community, from published academic and institutional sources, or from both.

---

## Finding → Adaptation Map

### 1. Core Product Validation

**Finding:** 83% of survey respondents (15/18) said they would "definitely" or "probably" use an AI-powered emergency relay app. Zero said "definitely no." (Survey Q8)

**Adaptation:** This validated building a **full AI voice relay** — not a simpler text-only or SMS solution. We committed to the complete architecture: User Agent (Gemini Live, multimodal) observes the scene → builds an `EmergencySnapshot` → Dispatch Agent calls 112 via Twilio → delivers a structured voice brief → relays Q&A back to the user's screen. A weaker PMF signal would have led to a simpler prototype. 83% gave us the confidence to build the real thing.

**Implementation:** The full pipeline is in `orchestrator.py` (`SessionOrchestrator.run()`), which sequences INTAKE → TRIAGE → LIVE_CALL → RESOLVED phases. The Dispatch Agent (`dispatch_agent.py`) connects Gemini Live to a real phone call via `AudioBridge` and Twilio Media Streams.

---

### 2. Accuracy Is the #1 Concern — Deterministic Confidence Gating

**Finding:** 56% of respondents (10/18) cited *"accuracy of message relay"* as their top concern. Respondent R12 (sign language interpreter, 12 years experience) warned: *"Pogrešan sprat ili pogrešna adresa može da košta život"* — a wrong floor or wrong address can cost a life. (Survey Q9)

**Adaptation:** We built **deterministic confidence scoring** (`compute_confidence()` in `snapshot.py`) that gates the transition from TRIAGE to LIVE_CALL. The system will NOT call 112 until confidence reaches the `confidence_threshold` (default 0.85). This scoring is deliberately NOT LLM-based — it uses weighted field checks:

| Field | Weight |
|---|---|
| Confirmed address | +0.35 |
| GPS coordinates only | +0.20 |
| Emergency type | +0.25 |
| Consciousness status | +0.15 |
| Breathing status | +0.15 |
| Victim count | +0.10 |
| User input (capped at 2) | +0.05 each |

A missing address or unknown emergency type physically prevents the call from being placed. This is the architectural response to the community's accuracy fears: **the riskiest data (location, emergency type) has the highest weight, and the system gates on it deterministically.**

**Implementation:** `compute_confidence()` in `snapshot.py`; threshold enforced in `orchestrator.py` → `_check_triage_complete()`.

---

### 3. Eliminating Dependency on a Third Person

**Finding:** 50% of respondents (9/18) contact emergency services via "voice call with help from others." 39% (7/18) rely on "asking someone nearby." Two respondents (R3, R15) said they *don't know how to contact emergency services at all*. Respondent R1 described standing in a hallway during a building fire, unable to do anything: *"Najgori osećaj na svetu je kad ti treba pomoć a ne možeš da je tražiš."* (Survey Q10, Q13)

**Adaptation:** Medak eliminates the dependency on a third person being present, awake, willing, and competent. **The AI IS the third person** — available 24/7, never asleep, never unwilling. The User Agent (`user_agent.py`) observes the scene through the phone camera and microphone, gathers emergency data via tool calls (`set_emergency_type`, `set_clinical_fields`, `confirm_location`), and the Dispatch Agent voices it to 112. The user's only required action is pressing one button.

**Implementation:** `initiateSOSCall()` in `frontend/lib/sosFlow.ts` requires only an emergency type selection and a button press. The User Agent (`run_user_agent()`) then autonomously gathers the remaining data through observation and minimal yes/no questions (`surface_user_question` tool).

**Persona connection:** This directly addresses Ana Petrović (Persona 1) — living alone in Belgrade, whose only option at 2 AM is banging on a neighbor's door — and Jelena Marković (Persona 7) — the deaf single mother whose laminated "please call 112 for me" card works only when strangers choose to help.

---

### 4. 112 Is Functionally Inaccessible — The Product's Raison D'être

**Finding:** The average accessibility rating for 112 was **1.72 out of 5** (median 1.5, mode 1). Not a single respondent rated it above 3. Seven respondents rated it 1 — "completely inaccessible." (Survey Q6)

**Adaptation:** The entire product exists because of this finding. A 1.72/5 rating means the current system is not "somewhat broken" — it is **fundamentally non-functional** for this population. This eliminated any consideration of incremental fixes (e.g., "just add SMS to 112") and justified building a full parallel communication layer.

**Implementation:** Medak is not an add-on to 112. It is an independent system that produces a *standard voice call* to 112 as its output. The deaf user never interacts with 112 directly. The `DispatchAgent` handles the entire voice conversation with the operator.

---

### 5. Zero PSAP Changes Required — The Core Architectural Insight

**Finding:** Every previous approach attempted to change the emergency center infrastructure. France's 114 required building a dedicated PSAP. Sweden's relay-mediated calls required trained relay operators. The EU EECC mandates RTT support at PSAPs by June 2027 — but **zero EU countries currently offer full equivalent access** (EUD EECC Report, 2024). The Netherlands pioneered RTT-to-112 in 2014, but it remains unique. National solutions are *"fragmented"* (European Commission 112 Report, 2024).

**Adaptation:** We deliberately designed Medak so the **112 operator receives a completely normal voice call**. No PSAP upgrades, no RTT support, no specialized equipment, no new protocols. The Dispatch Agent (`dispatch_agent.py`) connects via Twilio to a standard phone number and speaks using Gemini Live's native audio output. Its first sentence is: *"This is an automated emergency call on behalf of a person who cannot speak."* — then it delivers a structured brief and handles Q&A. From the operator's perspective, it's a voice call. This is our core architectural insight: **go around the infrastructure bottleneck, not through it.**

**Implementation:** `run_dispatch_agent()` initiates a standard Twilio voice call (`twilio_client.calls.create()`), connects it to a Gemini Live session via `AudioBridge`, and the AI speaks on behalf of the user. TwiML connects the call audio to a WebSocket stream (`/api/session/{session_id}/twilio/stream`), where `AudioBridge` converts between Twilio's μ-law 8kHz and Gemini's PCM 16kHz/24kHz formats.

---

### 6. Proactive Clinical Data Delivery

**Finding:** DHH ASL-users wait **30 minutes longer** in emergency departments than hearing patients, attributed to communication failures and waiting for interpreters (Kushalnagar et al., *Health Expectations*, 2023). Emergency operators must ask standard triage questions (conscious? breathing? victim count?) — questions that can't be answered over a silent phone line.

**Adaptation:** The `EmergencySnapshot` includes clinical fields (`breathing`, `conscious`, `victim_count`) that the User Agent fills **proactively** by observing the scene — before the dispatcher even asks. The Dispatch Agent delivers this data upfront in its opening brief: *"Victim count: 1. Conscious: yes. Breathing: yes."* The dispatcher doesn't have to ask for basics that would normally require a back-and-forth voice conversation the deaf user can't participate in.

**Implementation:** `set_clinical_fields()` tool in `user_agent.py` writes directly to the `EmergencySnapshot`. The `get_emergency_brief()` method in `dispatch_agent.py` formats these into a structured string delivered at the start of the call. `compute_confidence()` assigns weight to each clinical field (+0.15 for consciousness, +0.15 for breathing, +0.10 for victim count), incentivizing the User Agent to gather this data before the call proceeds.

---

### 7. Privacy by Design — Ephemeral Emergency Data

**Finding:** 44% of respondents (8/18) cited *"privacy and data protection"* as a concern — the #2 concern after accuracy. Respondent R6 (74, low tech comfort) specifically asked: *"obećajte da neće snimati moj stan"* — promise it won't record my apartment. Respondent R13 raised privacy as one of four simultaneous concerns. (Survey Q9)

**Adaptation:** Emergency session data has a **1-hour TTL** in Redis — it auto-deletes after 60 minutes. No permanent database stores call content, camera frames, or audio recordings. The `SNAPSHOT_TTL = 3600` constant in `snapshot.py` enforces this at the storage layer. Redis `EX` (expiry) is set on every `save()` and `update()` call. After the emergency is resolved, the data evaporates. This is GDPR-compliant by design — we don't just promise data deletion, we make permanent storage architecturally impossible.

**Implementation:** `SNAPSHOT_TTL = 3600` in `snapshot.py`. Every call to `SnapshotStore.save()` uses `await self._redis.set(key, ..., ex=SNAPSHOT_TTL)`. Every `update()` re-sets the TTL. There is no secondary database, no logging of call content, no persistent media storage.

---

### 8. One Button for Overwhelm Scenarios

**Finding:** Respondent R17 (parent of non-verbal autistic teen): *"Ako bi aplikacija imala što jednostavniji interfejs — jedno dugme, bez komplikacija — moj sin bi mogao da je koristi."* Respondent R6 (74, elderly): *"Ako je dugme samo jedno, možda bih probala."* Respondent R2 (74, hard-of-hearing): *"Ako je jednostavno, možda bih probao."* The AccesSOS community research found deaf users wanted **"icon-driven interfaces"** with **"big buttons"** for quick access. (Survey Q13; AccesSOS field research, 2022–2024)

**Adaptation:** The SOS flow is one tap to select emergency type + one tap to confirm. The `initiateSOSCall()` function in `sosFlow.ts` gathers location, device ID, and user ID in parallel — the user doesn't manage any of this. The User Agent then operates in *observation mode* — it watches the camera and listens, using `surface_user_question()` to show at most one yes/no question at a time on screen. The system prompt explicitly states: *"Operate in observation mode. Never demand a response from the user."* This matters for Luka (Persona 4, non-verbal autistic) — in sensory overload, even typing may be impossible. The system works with zero user input after the initial tap.

**Implementation:** `sosFlow.ts` → `initiateSOSCall()` fires with `emergencyType` + GPS in parallel. The User Agent system prompt in `user_agent.py` enforces minimal interaction: *"Ask at most one yes/no question at a time using surface_user_question."*

---

### 9. Operator Hang-Up Problem — Professional Voice Proxy

**Finding:** Respondent R7 (cerebral palsy, designer, types 90 WPM): *"The operator hung up on me after 20 seconds. They thought it was a prank call."* Respondent R9 (post-stroke aphasia): cannot speak coherently despite understanding everything. 28% of respondents cited *"trust — will emergency services take me seriously?"* as a concern. (Survey Q9, Q13)

**Adaptation:** The Dispatch Agent speaks in a **clear, professional, structured voice** — it's indistinguishable from a human relay operator. The first sentence identifies the call: *"This is an automated emergency call on behalf of a person who cannot speak."* The 112 operator receives a competent, articulate caller with structured data — not garbled speech that might be mistaken for a prank. This solves Marko's problem (Persona 3): *"The dispatcher never knows or needs to know about Marko's disability — and for once, that's exactly how Marko wants it."*

**Implementation:** `DISPATCH_AGENT_SYSTEM_PROMPT_TEMPLATE` in `dispatch_agent.py` opens with: *"First sentence: 'This is an automated emergency call on behalf of a person who cannot speak.'"* Then delivers the structured brief from `get_emergency_brief()`. The Gemini Live `response_modalities=["AUDIO"]` config produces natural speech output that flows through `AudioBridge` → Twilio → 112.

---

### 10. Real-Time Q&A Relay — Bridging the Two-Way Gap

**Finding:** Emergency calls are dialogues, not monologues. Operators ask follow-up questions: "Can you get to the exit?" "Is the patient on blood thinners?" "What floor are you on?" Respondent R2 described shouting his address three times because the operator couldn't understand. Previous text-only solutions (SMS-to-112, DEC112 app) send a one-shot message with no real-time Q&A. (Survey Q13, R2; EENA Strategies Report, 2025)

**Adaptation:** We built a full **two-way Q&A relay** between the 112 operator and the deaf user. When the operator asks something the Dispatch Agent can't answer from the `EmergencySnapshot`, it calls `queue_question_for_user()` which writes the question to the snapshot. The User Agent picks it up via `get_pending_dispatch_question()`, surfaces it to the user's screen, captures the response, writes it back via `answer_dispatch_question()`, and the Dispatch Agent voices it to the operator. This is a real conversation — just mediated by AI.

**Implementation:** The Q&A relay chain: `dispatch_agent.py` → `queue_question_for_user()` → `EmergencySnapshot.dispatch_questions` → `user_agent.py` → `get_pending_dispatch_question()` → `surface_user_question()` → user's screen → `answer_dispatch_question()` → `EmergencySnapshot.ua_answers` → `dispatch_agent.py` → `get_user_answer()` → voices the answer. All mediated through the shared `SnapshotStore` in Redis.

---

### 11. Call Resilience — Exponential Backoff Reconnection

**Finding:** Respondent R5 (Croatia) described an existing SOS app: *"Ne radi uvijek i treba WiFi. Problem je kad si na cesti ili negdje bez interneta."* Respondent R18 (tech professional) asked directly: *"What happens when there's no internet connection?"* Emergency situations often involve infrastructure failures — dropped calls, network congestion, overloaded cell towers. (Survey Q13, R5, R18)

**Adaptation:** The Orchestrator implements **automatic call reconnection with exponential backoff**. If the Twilio call drops (`CallStatus.DROPPED`), it retries up to `reconnect_max_attempts` times (default 3) with increasing delays (2s, 4s, 8s). Each retry spawns a fresh Dispatch Agent with the current `EmergencySnapshot` data. The call failure doesn't mean the emergency is over — the system persists.

**Implementation:** `_run_live_call_loop()` in `orchestrator.py` detects `DROPPED` status, increments `reconnect_count`, waits `2 ** reconnect_count` seconds, then calls `_start_dispatch_agent()` again. Previous dispatch agent tasks are cancelled before starting new ones to prevent ghost processes.

---

### 12. The Sudden-Disability Persona — Anyone Can Need This Tonight

**Finding:** Stroke causes acute aphasia — sudden loss of speech in a previously healthy person. *"1.9 million neurons die per minute"* without treatment. Respondent R9 described his experience: *"Pre udara bio sam sasvim normalan, mogao sam sve. Sada ne mogu da objasnim ni gde me boli."* (Survey Q13, R9; persona Stefan Ilić)

**Adaptation:** Medak requires **zero pre-configuration of disability status**. No user profile, no accessibility settings, no pre-stored medical data. The User Agent observes in real-time: facial droop, limb weakness, inability to speak. The `EmergencySnapshot` fills from observation, not from user input. This means Stefan (Persona 6) — who was a healthy man 10 minutes ago and has never installed an accessibility app — can press one button and get help. The system adapts to the user, not the other way around.

**Implementation:** The User Agent system prompt in `user_agent.py` says: *"You observe the user's environment via microphone and camera to gather information about the emergency."* The `set_clinical_fields()` tool takes `conscious`, `breathing`, and `victim_count` — observable from visual and audio context. `set_emergency_type()` classifies from the scene. GPS auto-fills location. The system is designed to work with **zero text input from the user**.

---

## Summary

Our research with **18 respondents from the deaf, hard-of-hearing, and speech-impaired communities** across Serbia and the Western Balkans, combined with **published data from the WHO, EUD, EENA, European Commission, Sorenson Communications, AccesSOS, and peer-reviewed academic sources** covering **466 million people with disabling hearing loss** worldwide, directly shaped every major architectural decision in Medak.

The community told us 112 is rated **1.72 out of 5** for accessibility — so we built a complete bypass. They told us **accuracy is the #1 concern** — so we built deterministic confidence gating. They told us they **depend on strangers being nearby** — so we made the AI the always-available third person. They told us **privacy matters** — so we made data ephemeral by design. Published research showed that **every previous solution required changing the emergency center** — so we designed Medak to produce a normal voice call. Academic evidence that deaf patients **wait 30 minutes longer** in emergency departments drove us to deliver clinical data proactively.

We didn't build Medak and then look for research to justify it. **We listened first, then built what the community told us they need.**

---

*Document compiled: March 2026 | GDG Hackathon Medak*
*Primary research: 18 respondents (deaf/HoH community networks, Serbia & Western Balkans)*
*Secondary sources: WHO (2021), EUD EECC Report (2024), EENA (2025), European Commission (2024), Sorenson (2024), AccesSOS (2022–2024), Kushalnagar et al. (2023), Atwell et al. (2024), Maguire et al. (2025)*
