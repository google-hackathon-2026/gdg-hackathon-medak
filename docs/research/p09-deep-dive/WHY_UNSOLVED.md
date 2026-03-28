# Why This Problem Hasn't Been Solved

## The Short Answer

It's not a technology problem. It's a **structural deadlock** between 7 forces that have prevented anyone from building the obvious solution. Until now — because AI just removed the biggest barrier.

---

## The 7 Structural Barriers

### 1. 🏛️ The Fragmentation Problem — "Nobody Owns 112"

Emergency services in Europe are **national or regional**, not EU-wide. Each of the 27 member states (+ candidates) has its own:
- PSAP technology stack (often decades old)
- Procurement rules
- Budget cycles
- Technical standards (or lack thereof)

**Result:** Even if the EU mandates accessible 112 (and it does), there's no single entity to BUILD it. Each country must implement independently, at its own pace, with its own budget.

> "Even if a blanket policy was passed tomorrow to upgrade these old legacy technologies, it would take about **10 years**. Because even if a policy was passed, you still need the funding, you still need each 911 call center to implement it from a physical landline copper system into a digital cloud-based infrastructure."
> — Gabriella Wong, Founder of AccesSOS

### 2. 💰 The Market Failure — "Not Profitable, Not Prioritized"

The deaf/HoH population is ~1% of any country's population. For a telco or enterprise vendor:
- Small addressable market per country
- Government buyer = slow procurement (18-36 months)
- Low willingness-to-pay per user (it's a public service)
- No recurring revenue model for a "call 112" feature

> "Intrado tried to build their own app. Deaf people didn't know about it. Intrado saw this wasn't profitable, so **marketing it to people who lack access to 911 wasn't in their best business interest.**"
> — Gabriella Wong, AccesSOS (Crisis Response Podcast)

**Why this matters:** Private companies need ROI. A relay service for deaf emergency callers doesn't have one — unless you sell to government. And government doesn't buy from startups.

### 3. 🔌 The Infrastructure Lock-In — "PSAPs Run on Phone Lines from 1990"

Most PSAPs still use **legacy telephony** (ISDN/copper/TDM). They literally cannot receive:
- Text messages (SMS-to-112 requires an IP gateway)
- Video calls
- App-based connections
- Real-Time Text (RTT)

Upgrading to NG112 (IP-based) requires:
- New hardware at every PSAP
- New software for call-takers
- New training for dispatchers
- New certification/compliance
- Estimated cost: **€50-100M per country** for full NG112

> "Only Ireland has native RTT as of 2025. Most states are using the derogation [delay exemption] to June 2027."
> — EENA Report on Accessible Emergency Communications, 2024

**This is THE key insight:** Every previous solution tried to change the PSAP side. That's why they all failed or stayed tiny. **Our solution changes NOTHING on the PSAP side — the dispatcher gets a normal voice call.**

### 4. 🧑‍🤝‍🧑 The Community Size Problem — "Too Small to Lobby, Too Important to Ignore"

Deaf communities are:
- Small (1-2% of population)
- Linguistically diverse (each country has its own sign language)
- Often low-income (employment barriers)
- Politically fragmented (multiple advocacy organizations)

**Result:** Not enough political pressure to force action. Disability rights legislation exists but enforcement is weak. Politicians sign the mandates, then never fund them.

Compare to: visual accessibility (screen readers) — tech companies built it because blind users are also power users of phones/computers and the implementation is software-only. Emergency access for deaf people requires **infrastructure change** that no single company controls.

### 5. ⏱️ The Relay Service Bottleneck — "Humans Don't Scale"

The traditional solution is **human relay services** — a sign language interpreter on video call who relays between the deaf caller and the hearing dispatcher.

Problems:
- **Cost:** €5-20 per minute of interpreting
- **Availability:** Most countries offer limited hours (not 24/7)
- **Scaling:** Need trained sign language interpreters (scarce profession)
- **Latency:** 60+ seconds just to connect to an interpreter, then interpretation delay
- **Location:** Interpreter may not be in the same country → can't dial local emergency number
- **No emergency priority:** Relay services don't always prioritize emergency calls over regular calls

> "In 2022, Sweden's VRS handled 320,000 relay calls, of which only **518 were emergency calls** (0.16%)."
> — EENA, Accessible Emergency Communication via Relay Services, 2024

> "Relay Services operate under different SLA requirements, with response times often extending to **1 minute or several minutes** in certain countries or at night time."
> — EENA, 2024

**Why AI changes this:** AI relay costs <€0.10/call (vs €5-20/min for humans), is available 24/7, scales infinitely, and has sub-second latency. The cost barrier is obliterated.

### 6. 🤖 The AI Timing Problem — "The Tech Literally Didn't Exist Until 2024"

Real-time, low-latency, natural-sounding AI voice that can:
- Listen to a dispatcher's questions
- Understand context
- Generate appropriate spoken responses
- Do all this in <1 second

**This capability is less than 2 years old.**

Timeline:
- 2022: ChatGPT launches (text only)
- 2023: GPT-4 (smarter text, still no voice)
- 2024: OpenAI Realtime API (sub-second voice-to-voice) ← **THIS is the unlock**
- 2024: ElevenLabs + Deepgram hit <500ms latency
- 2025: Twilio + OpenAI integration makes it buildable in days

**Before 2024, an AI emergency relay was technically impossible.** You'd have needed:
- STT → processing → TTS pipeline with 3-5 second latency (unacceptable for emergency calls)
- Robotic-sounding TTS (dispatchers would hang up)
- No contextual understanding (couldn't handle follow-up questions)

**Now it's a weekend project.** That's the window we're in.

### 7. 🔒 The Liability Fear — "What If the AI Gets It Wrong?"

Emergency services are **zero-error tolerance** environments. Decision makers ask:
- "What if the AI mistranslates and sends the ambulance to the wrong address?"
- "What if the AI crashes mid-call?"
- "What if someone sues us because the AI relay failed?"
- "What if GDPR prevents us from processing emergency data?"

These are valid fears. But the counter-argument is devastating:

**The current system has a 100% failure rate for deaf callers.** Any AI system with >0% success rate is an improvement. The risk isn't deploying AI — it's NOT deploying it.

> "Data isn't being collected. But I fear — I really fear — that **people who don't have that critical lifeline to emergency services are dying.**"
> — Gabriella Wong, AccesSOS

---

## Why NOW Is the Moment

| Barrier | Before 2024 | Now (2026) |
|---------|-------------|------------|
| AI voice quality | Robotic, 3-5s latency | Natural, <1s latency |
| Cost per relay call | €5-20/min (human) | <€0.10 (AI) |
| PSAP changes needed | Total infrastructure overhaul | **Zero** (normal voice call) |
| EU regulatory pressure | Soft deadline | **Hard deadline June 2027** |
| Political will | Low | High (EAA, EECC, AI Act all converging) |
| Funding | Scattered | Multiple EU programs (CEF, IPA, Horizon) |
| AI regulatory framework | Unclear | EU AI Act provides clear rules |

**The window is 2026-2027.** After that, governments will have either:
a) Built their own (unlikely — they've failed for 15 years)
b) Adopted NG112 with RTT (partial solution, expensive)
c) Bought a commercial solution (THIS IS US)

---

## What the Hackathon Pitch Should Say

> "This problem has existed for 30 years. The mandate has existed since 2018. So why hasn't anyone solved it?
>
> Because every previous approach tried to change the emergency center — new hardware, new protocols, new training. That costs €50-100 million per country and takes 10 years.
>
> We don't change the emergency center at all. The dispatcher gets a normal phone call. Our AI sits in the middle — the deaf user types, the AI speaks. The dispatcher responds, the AI transcribes.
>
> The technology to do this didn't exist until 2024. OpenAI's Realtime Voice API gave us sub-second, natural-sounding voice synthesis. For the first time in history, an AI can have a real-time phone conversation that a dispatcher can't distinguish from a human caller.
>
> We're not waiting for governments to upgrade. We're giving deaf people access to the system that ALREADY EXISTS — the voice phone call. Today. For €0.10 per call instead of €15 per minute."

---

## The Competitive Moat

Nobody else is building this because:
1. **Emergency services companies** (Frequentis, Carbyne) sell to PSAPs → they need PSAP infrastructure changes → slow, expensive
2. **Relay service companies** (Sorenson) sell human interpreters → AI threatens their business model → they won't cannibalize themselves  
3. **App startups** (AccesSOS, Pedius, RogerVoice) are small nonprofits/seed-stage → limited engineering capacity → couldn't build real-time AI voice relay until now
4. **Big tech** (Google, Apple, Microsoft) don't touch emergency services → liability risk, regulated market, small user base

**The lane is empty because it requires someone who:**
- Understands both AI AND government procurement
- Is willing to work in a regulated, low-margin market
- Can build the tech (now trivial) AND navigate the policy (still hard)
- Is in a small enough market to pilot nationally (Serbia = perfect)
