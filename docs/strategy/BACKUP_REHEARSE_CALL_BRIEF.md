# BACKUP #3: Rehearse-Then-Call — AI Emergency Dispatch for Communication Disabilities

> **Solution Score: 34/40 GREEN | Combined: 66/80 | Status: BACKUP — deploy if top 2 blocked**

> **[POST-HACKATHON UPDATE]** This 5-agent "Rehearse-Then-Call" architecture was the pre-hackathon backup plan for P09. The team built a significantly simpler architecture as **Medak**:
> - **2 agents** (User Agent + Dispatch Agent), not 5
> - **Deterministic Python orchestrator** (no LLM in phase transitions)
> - **No rehearsal phase** — passive mic/camera triage for up to 10s, then calls directly
> - **Gemini 2.0 Flash Live** (not Gemini 2.5 Flash)
> - **React Native / Expo** (not Android Kotlin/Flutter)
> - **Confidence-based dispatch trigger** (0.85 threshold or 10s timeout)
>
> See `medak/docs/design-document.md` for the actual architecture.

---

## 1. Why This Is the #3 Backup

Life-or-death stakes make judges pay attention. Every year, people with speech disabilities, deafness, or cognitive impairments face a terrifying gap: they *can't communicate* with 112/911 dispatchers effectively. Calls get dropped, misrouted, or take 3x longer while someone is having a medical emergency. The **rehearsal concept is genuinely novel** — no existing emergency system lets you practice the call before making it. That before/after demo moment (chaotic real call → calm rehearsed call) is the highest-drama pitch in our backup roster. It scores 34/40 because the problem is visceral, the solution is intuitive, and the multi-agent architecture is technically impressive. It's backup rather than primary because telecom integration in 48h carries real risk — but the mock strategy below neutralizes that.

---

## 2. Agent Architecture (5 Agents)

**AssessmentAgent** — First contact after the emergency button press. Through simple tap/swipe/voice inputs, it triages in under 30 seconds: what type of emergency (medical, fire, crime, accident), what critical info dispatch will need (address, number of people, injuries), and the user's communication profile (nonverbal, speech impairment level, deaf, cognitive). This agent decides the entire downstream flow — if the user can speak somewhat, it optimizes for voice-assisted; if nonverbal, it shifts to text/pictogram mode entirely.

**RehearsalAgent** — The novel core. It simulates a dispatcher conversation using Gemini, playing the role of a 911 operator asking standard protocol questions. As the user responds (via any modality), it identifies communication gaps: "the dispatcher will ask your exact address — you said 'near the park,' let's get more specific." It builds a **structured emergency packet** (JSON with all dispatch fields filled) so the real call has zero ambiguity. The rehearsal takes 60-90 seconds and transforms a panicked, fragmented attempt into a prepared, complete message.

**TranslationAgent** — Active during the real call. Bidirectional: it converts the user's input (AAC symbols, typed text, impaired speech via enhanced STT) into clear, natural dispatcher-ready speech via TTS. Simultaneously, it takes the dispatcher's rapid-fire professional jargon and converts it into simplified text, pictograms, or slow-paced audio for the user. This is the real-time bridge that makes the call *work*.

**ContextAgent** — Passive but critical. On emergency button press, it silently gathers: GPS coordinates (Google Maps Geocoding for human-readable address), phone's Medical ID data (allergies, conditions, blood type), saved emergency contacts, and the user's pre-configured accessibility profile. This data pre-fills the RehearsalAgent's structured packet, so the user only confirms rather than recalls under stress.

**FollowUpAgent** — Post-call continuity. Provides estimated response time, simple visual wait instructions ("Stay where you are, help is 6 minutes away"), auto-texts emergency contacts with location and situation summary, and keeps the line warm for callback if dispatch needs more info. Reduces post-call panic.

---

## 3. Key APIs & Tech

| Layer | Technology | Role |
|-------|-----------|------|
| AI Core | **Gemini 2.0 Flash Live** | Assessment triage, voice dispatch, translation, all agent reasoning |
| Voice | **Gemini Live API / Cloud STT+TTS** | Real-time speech understanding (including impaired speech) and clear output |
| Telecom | **Twilio Voice SDK** | Programmatic call initiation, audio bridge for TranslationAgent |
| Location | **Google Maps Platform** | Geocoding GPS → address, place context ("near Children's Hospital") |
| App | **Android (Kotlin) or Flutter** | Big-button UI, accessibility-first design, device sensor access |
| Data | **Android Health Connect / Medical ID** | Pre-loaded medical and accessibility profile |

---

## 4. 48-Hour Build Plan

### Hours 0–8: Foundation
- Scaffold Android app with emergency button → assessment flow UI
- Set up Gemini API integration (single service, all agents use it)
- ContextAgent: GPS + geocoding + mock medical profile
- Define structured emergency packet schema (JSON)

### Hours 8–20: Core Agents
- AssessmentAgent: tap/swipe triage flow (3-5 screens, big icons)
- RehearsalAgent: Gemini-powered dispatcher simulation + gap detection
- Build the structured packet builder from rehearsal output
- Basic accessibility UI: high contrast, large targets, pictogram mode

### Hours 20–32: Translation & Call Bridge
- TranslationAgent: bidirectional text↔speech conversion
- Twilio integration OR mock call bridge (see §6)
- Wire full flow: button → assess → rehearse → call → follow-up
- FollowUpAgent: ETA display, emergency contact SMS via Twilio

### Hours 32–44: Polish & Demo
- End-to-end flow testing with disability simulation scenarios
- Record "before" video (chaotic call without system)
- Demo script rehearsal and timing
- Edge cases: no GPS, nonverbal user, partial speech

### Hours 44–48: Buffer
- Bug fixes, demo environment hardening, pitch practice

---

## 5. Demo Script (5 Minutes)

**[0:00–1:00] The Problem — "Before" Scenario**
Play a recorded/simulated 911 call: a person with a severe speech impairment tries to report a medical emergency. The dispatcher can't understand. Repeats "can you say that again?" three times. The call takes 2+ minutes and the address is never clearly communicated. *Let the audience feel the frustration.* End with a stat: "For 61 million Americans with disabilities, every emergency call is this hard."

**[1:00–1:30] The Insight**
"What if you could *practice* the call first? Rehearse-Then-Call gives you an AI coach that runs through the emergency call before you make it — so when you dial 112, you're prepared, not panicking."

**[1:30–3:30] Live Demo — "After" Scenario**
- **Press the big red button.** AssessmentAgent appears: "What's happening?" → user taps MEDICAL icon → taps BREATHING DIFFICULTY icon.
- **ContextAgent** auto-fills: location ("Messukeskus Helsinki, Hall 5"), medical profile ("asthma, albuterol inhaler").
- **RehearsalAgent** starts: "I'm going to pretend to be the dispatcher. Tell me what's happening." User types fragmented text. Agent identifies gaps: "They'll ask if the person is conscious — is she?" Builds complete packet.
- **"Ready to call?"** → User confirms → Twilio initiates call → **TranslationAgent** bridges: user's typed input becomes clear spoken English to dispatcher. Dispatcher's questions appear as simple text on screen.
- **FollowUpAgent**: "Ambulance dispatched. ETA 7 minutes. Your emergency contact Maria has been notified."

**[3:30–4:30] Architecture & Impact**
Show agent diagram. Emphasize: 5 specialized agents, single Gemini backbone, rehearsal concept is novel. "The structured packet means dispatch gets *better* information than a typical verbal call." Mention: 430M people worldwide with disabling hearing loss (WHO). This isn't niche — it's infrastructure.

**[4:30–5:00] Close**
"The best emergency call is one you've already practiced. Rehearse-Then-Call turns panic into preparation."

---

## 6. Key Risk: Telecom Integration — The Mock Strategy

**The risk:** Real telephony integration (Twilio → actual phone call → audio bridge) is brittle in 48h. Network issues, latency, SRTP/oAuth gotchas, and you *cannot* call real emergency numbers in a demo.

**The mock strategy (convincing):**

1. **Twilio-to-Twilio call:** Set up two Twilio numbers. The app "calls 112" which actually dials your second Twilio number. A teammate plays dispatcher on the receiving end using a script. The audience sees a *real phone call happening* — it's just routed to your team, not actual emergency services. This is trivially achievable in <4 hours.

2. **TranslationAgent stays real:** The bidirectional translation (user input → TTS to "dispatcher," dispatcher speech → simplified text to user) works identically whether the call is real or mocked. The AI layer is fully functional.

3. **Pre-recorded fallback:** If even Twilio-to-Twilio fails under demo pressure, have a pre-recorded dispatcher audio track that the TranslationAgent processes in real-time. The audience sees live AI translation — they don't know the audio source is a recording.

4. **Demo framing:** "We're calling our simulated dispatch center because — obviously — we're not going to call real 911 from a hackathon stage." This is *expected*. No judge will fault you. The impressive part is the rehearsal → structured packet → translation pipeline, not the phone call itself.

**Bottom line:** The telecom layer is the thinnest part of the stack. The AI agents are the product. Mock the call confidently and put all demo energy into the rehearsal flow — that's what's novel and that's what wins.
