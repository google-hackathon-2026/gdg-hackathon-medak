# P09 — Emergency Services Communication Agent: PRESENTATION Evaluation

## Problem Summary
Multi-agent system where a deaf/speech-impaired/confused person activates an emergency AI that understands their input (sign, fragmented speech, text), reasons about the emergency, calls dispatch on their behalf with structured info, and provides accessible feedback. Life-or-death stakes.

---

## 1. Demo Arc (Can't Call Real 112 — How to Simulate?)

**Solution: Simulated dispatch is a well-proven hackathon pattern.**

The winning approach (used by DispatchAI — UC Berkeley Grand Prize 2024, and Sentinel — ElevenLabs Worldwide Hackathon Global Winner 2026):
- Use **Twilio or similar** to make a real phone call to a teammate playing dispatcher
- The "dispatch" side shows a **real-time dashboard** with structured emergency data
- The call is an actual voice call — the AI speaks to the "dispatcher" who responds

**Recommended demo arc (10 min):**
1. **Hook (1 min):** Open with the Serbia-specific story — a deaf family in Užice wasn't informed about the 1999 bombings for DAYS until a neighbor left a note in their mailbox. "What if they'd had a medical emergency?"
2. **Problem (1.5 min):** Show the current experience — a deaf person having a crisis, trying to call 112, getting a voice prompt they can't hear. Dead silence. Helplessness. (Can be a short pre-recorded video or role-play)
3. **Demo (5 min):** Live walkthrough — user types/signs emergency → AI reasons → call happens → dispatcher dashboard updates → user gets accessible feedback
4. **Tech deep-dive (1.5 min):** Architecture diagram, agent orchestration, how input modalities are handled
5. **Close (1 min):** EU mandate, Serbia stats, call to action

**This arc is tight, narratively complete, and buildable.**

## 2. Wow Moment

**The "wow" is multi-layered and lands hard:**

- **Primary wow:** The moment the AI actually *speaks* to the dispatcher on behalf of the user. Hearing a clear, structured voice say "We have a 47-year-old male experiencing chest pain at Knez Mihailova 22, Belgrade. The caller is deaf and cannot respond to voice callbacks. Ambulance needed urgently." — that's chilling and impressive simultaneously.
- **Secondary wow:** The dispatcher dashboard updating in real-time with structured data (location, emergency type, severity, caller accessibility needs, nearest hospital).
- **Tertiary wow:** The user's screen showing accessible feedback — visual confirmation that help is on the way, ETA, what to do while waiting — all without a single spoken word.

**This has MULTIPLE "holy shit" moments, not just one. That's rare for a hackathon project.**

## 3. Emotional Hook (Life or Death)

**This is the single strongest emotional hook of any accessibility problem evaluated.**

Key emotional ammunition:
- **Serbia-specific:** The OSCE Mission to Serbia documented that during the 1999 NATO bombings, a deaf family in Užice had no idea bombing had started for *days*. During the 2014 floods, deaf communities received information late. A mother of an autistic child said "fear of an emergency is the second strongest fear, after fear for my child's future once I'm gone."
- **European scale:** Most EU countries still only offer voice calls to 112. The European Union of the Deaf has been actively campaigning for accessible 112. The EU Accessibility Act *mandates* functional equivalency by 2027 — most countries aren't ready.
- **Serbia stats:** ~14,000 deaf/hard-of-hearing people in Serbia. The Serbian PM personally launched "SOS for the Deaf" app — this is politically visible and relevant.
- **Romania parallel:** SMS-113 for deaf people has only 11.75% registration after 8 years. The current solutions are failing.
- **Universal resonance:** Anyone can temporarily lose their voice (injury, smoke inhalation, stroke, panic attack). This isn't just about the deaf community.

**Judges in Belgrade will FEEL this. The local stories make it unavoidable.**

## 4. Before/After Contrast

| Dimension | BEFORE (Today) | AFTER (With Agent) |
|-----------|---------------|-------------------|
| Experience | Deaf person dials 112, hears nothing, can't speak, hangs up in terror | Taps emergency button, types/signs what's happening, AI handles the rest |
| Information | Dispatcher gets an abandoned call, no context, no location, no callback possible | Dispatcher gets structured packet: type, severity, location, accessibility needs, medical context |
| Time | Minutes of failed attempts, maybe gives up entirely | Seconds from activation to dispatch contact |
| Feedback | Nothing. Complete silence. "Did anyone hear me?" | Visual/haptic confirmation: "Help dispatched. Ambulance ETA 7 minutes. Stay in your current location." |
| Accessibility | Must rely on someone else being present to call for you | Full autonomy. No intermediary human needed. |

**The before/after contrast is DEVASTATING. The "before" scenario is so viscerally awful that the "after" sells itself.**

## 5. Tech Depth Visible?

**Yes — this is a genuinely complex multi-agent system with visible technical substance.**

Visible layers:
- **Input understanding agent:** Handles text, fragmented speech (ASR with noise/confusion tolerance), potentially sign language via camera. Multiple modalities → single structured intent.
- **Reasoning agent:** Classifies emergency type, assesses severity, extracts structured data (who, what, where, medical conditions), decides what information dispatch needs.
- **Communication agent:** TTS-driven voice call to dispatch. Handles the structured Q&A protocol that dispatchers follow. Can respond to dispatcher questions in real-time.
- **Feedback agent:** Translates dispatch response back to accessible format for the user. Updates status in real-time.
- **Orchestrator:** Coordinates all agents, manages state, handles edge cases (dropped call, escalation).

**For judges (senior engineer, CTO, university TAs):** The multi-agent architecture is immediately legible as "real engineering." The input → reasoning → communication → feedback pipeline maps cleanly to an architecture diagram. The Twilio/voice integration adds concrete infrastructure beyond "just another chatbot."

**Risk:** Sign language recognition is hard to demo live reliably. **Mitigation:** Focus on text + fragmented speech input for live demo. Show sign language as a "future modality" with a pre-recorded clip. Judges will understand the architectural extensibility.

## 6. Similar Winners?

**Emergency + AI is a PROVEN winning category:**

| Project | Event | Result |
|---------|-------|--------|
| **DispatchAI** | UC Berkeley AI Hackathon 2024 | **Grand Prize + AI for Good + Best Use of Intel AI** (triple win) |
| **Sentinel** | ElevenLabs Worldwide Hackathon (1,300 builders, 33 cities) | **Global Winner** |
| **911 Coach AI** | MediHacks 2024 | Featured project |
| **CallBridge** | Singapore Community Hackathon 2025 | Featured accessibility project for deaf users + emergency calls |
| **Katakan AI** | Microsoft AI for Accessibility Hackathon 2023 | **Country Winner (Indonesia)** |

**Emergency dispatch AI wins hackathons. Adding the accessibility angle makes it even more compelling because it layers social impact on top of technical complexity.**

The key differentiator from DispatchAI/Sentinel: those solve the *dispatcher side* (overwhelmed call centers). This solves the *caller side* (people who can't call at all). That's a fresher angle.

## 7. Live Demo Feasibility

**High feasibility. Here's the concrete setup:**

**Minimum viable demo (24h hackathon):**
- Web/mobile app with big "EMERGENCY" button → text input field
- Backend with LLM agent that structures the emergency info
- Twilio integration that calls a teammate's phone and speaks the structured message via TTS
- Simple dispatch dashboard (web page) showing incoming emergency data
- User feedback screen showing "Help is on the way" with structured updates

**What can go wrong:**
- **Twilio call fails:** Pre-record a backup video. Have the dashboard update anyway to show the data flow.
- **LLM is slow:** Pre-cache the demo scenario. Use a faster model (Claude Haiku / GPT-4o-mini).
- **Network issues:** Have a local fallback mode with pre-loaded responses.

**Enhancement options (if time allows):**
- Speech-to-text input (Whisper) for fragmented/panicked speech
- Location auto-detection via browser geolocation
- Multi-language support (Serbian + English)
- Visual alerts (flashing screen, vibration) for user feedback

**Verdict: This is VERY buildable in a hackathon timeframe. The core flow (text → LLM → Twilio call → dashboard) can work in hours.**

## 8. Business Pitch

**Regulatory tailwind makes this pitch unusually credible:**

- **EU Accessibility Act (EAA):** Mandates functional equivalency for 112 access by 2027. Most EU countries aren't compliant. This creates immediate B2G demand.
- **European Electronic Communications Code (EECC):** Requires "emergency communications" (not just calls) — PSAPs must handle text, video, and other modalities.
- **Serbia context:** Government already invested in "SOS for the Deaf" app (PM-level visibility). The Association of the Deaf and Hard-of-Hearing of Serbia is actively calling for better emergency communication.
- **Market size:** 100M+ people with disabilities in the EU. ~30M deaf/hard-of-hearing. Every PSAP (Public Safety Answering Point) in Europe is a potential customer.
- **Revenue model:** B2G SaaS — license to PSAPs/emergency services per region. Integration fee + monthly per-seat. Potential NGO/EU grant funding for pilot.
- **Competitive gap:** France has 114 Urgence (centralized, expensive, human interpreters). Netherlands has RTT to 112. Most countries have nothing. An AI-powered solution is 10x cheaper than staffing sign language interpreters 24/7.

**For a hackathon pitch, the one-liner is:** "The EU mandates accessible emergency services by 2027. Most countries aren't ready. We built the AI agent that makes it possible."

---

## Strengths Summary
- **Emotional nuclear bomb** — life-or-death stakes with local Serbian stories
- **Before/after contrast is devastating** — silence vs. rescue
- **Multiple wow moments** — the AI speaking to dispatch, the dashboard, the feedback
- **Proven winning category** — DispatchAI and Sentinel both won grand prizes
- **Technically rich** — multi-agent, multi-modal, real infrastructure (Twilio)
- **Highly feasible** — core demo buildable in hours, robust backup plans
- **Strong business case** — EU regulatory mandate creates real market pull
- **Local relevance** — Belgrade judges, Serbian deaf community stories, PM-level political visibility

## Weaknesses / Risks
- **Crowded conceptual space** — accessibility + emergency has been done (but not with this specific caller-side multi-agent angle)
- **Sign language live demo is risky** — mitigation: focus on text/speech, show sign as extension
- **Can feel manipulative if over-emotional** — mitigation: let the tech speak, keep stories brief and factual
- **10 minutes is tight** — need disciplined time management, no rambling
- **Dispatcher simulation could feel "fake"** — mitigation: be transparent ("we simulate dispatch because we can't call real 112"), judges will respect honesty

---

## PRESENTATION SCORE: 9/10

**Rationale:** This is a near-perfect hackathon presentation topic. The emotional stakes are the highest possible (literal life or death), the before/after contrast sells itself, the demo is feasible and has multiple wow moments, the tech is genuinely complex enough to impress engineers, and the business case has regulatory backing. The Serbia-specific stories will land with Belgrade judges. The only reason it's not 10/10 is the minor risk of the concept feeling familiar (emergency + accessibility) and the tight 10-minute window requiring very disciplined execution. But executed well, this is a podium contender.
