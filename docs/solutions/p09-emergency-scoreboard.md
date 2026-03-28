# P09 — Emergency Dispatch for Deaf/Speech-Impaired: Scoreboard

> **[POST-HACKATHON UPDATE]** This scoreboard evaluated 2 of the 5 proposed solutions. The team built neither as designed. The actual implementation is a modified **Voice Bridge Pipeline** (Solution 1 from `p09-emergency-solutions.md`) simplified to 2 agents + deterministic orchestrator. Key differences from "Rehearse-Then-Call" (Solution A here): no rehearsal phase, passive mic/camera triage instead of explicit interview, confidence-based dispatch trigger instead of gap analysis. See `medak/docs/design-document.md`.

## Solution A: "Rehearse-Then-Call"

**Concept:** Two-phase emergency calling — rehearse against a simulated dispatcher AI to identify info gaps, then make a polished live call with all data pre-structured.

### Agents
| Agent | Role |
|---|---|
| IntakeAgent | Text/speech input ingestion |
| TriageAgent | Emergency classification & priority |
| RehearsalAgent | Simulates dispatch Q&A, identifies information gaps |
| DispatchAgent | Executes actual Twilio call with structured data |
| FeedbackAgent | Accessible status updates to caller |

**Agent count:** 5 — clean separation, each has a distinct responsibility.

### Scores

**INNOVATION: 9/10**
The rehearsal concept is genuinely novel. Nobody in emergency tech is doing "dry-run your 911 call against a simulated dispatcher." It reframes the problem from "how do we translate speech" to "how do we eliminate information chaos before the real call happens." The before/after framing is conceptually elegant and immediately intuitive.

**TECHNICAL EXECUTION: 8/10**
Five agents with well-scoped roles. The RehearsalAgent is the technical centerpiece — it needs to simulate realistic dispatcher questioning patterns, which is a meaty but achievable LLM task. Twilio integration for the live call is well-documented and hackathon-proven. The main technical challenge (dispatcher simulation fidelity) is also the main demo asset, so effort aligns with impact. State handoff from rehearsal → live call is clean and testable.

**IMPACT: 8/10**
Directly addresses the core pain point: deaf/speech-impaired callers struggle not because they can't communicate at all, but because emergency calls demand rapid, structured information under stress. The rehearsal phase de-stresses the interaction and ensures completeness. Real-world deployable as a companion app. Limitation: adds latency in a time-critical scenario — rehearsal takes time when seconds matter.

**PRESENTATION: 9/10**
The before/after demo is a killer. Show the chaotic, incomplete first attempt (missing address, unclear emergency type, dispatcher confusion) → then the rehearsed version (structured, complete, dispatcher gets everything immediately). This is the kind of side-by-side that makes judges lean forward. Story arc is built into the architecture itself.

**TOTAL: 34/40** 🟢

### 48h Build Feasibility
**HIGH.** Core loop (intake → triage → rehearsal → call) is linear and parallelizable across the team. Twilio is well-documented. The RehearsalAgent prompt engineering is the hardest part but can be iterated quickly. Two devs on agent pipeline, one on Twilio integration, one on UI/feedback. Realistic to have a working demo by hour 36.

### Critical Risk
**Rehearsal latency vs. emergency urgency.** If someone is having a heart attack, spending 2 minutes rehearsing feels wrong. Team must implement a "skip rehearsal" fast-path for critical emergencies detected by TriageAgent, or judges will hammer this point.

### Verdict
A genuinely original idea with a built-in demo narrative — the rehearsal concept is both the innovation and the presentation hook.

---

## Solution B: "Community Relay Network"

**Concept:** Multi-stakeholder emergency response — simultaneously dispatches official emergency services AND activates nearby trained community volunteers (sign language interpreters, first responders) who converge on the caller's location.

### Agents
| Agent | Role |
|---|---|
| InputAgent | Processes caller input (text/sign/speech) |
| DispatchAgent | Calls official emergency services |
| CommunityAgent | Locates and activates nearby trained volunteers |
| ConvergenceAgent | Coordinates all parties on real-time map |
| FeedbackAgent | Status updates to all stakeholders |

**Agent count:** 5 — reasonable, though ConvergenceAgent carries heavy coordination weight.

### Scores

**INNOVATION: 7/10**
The community volunteer layer is a meaningful addition to emergency dispatch, and the parallel activation concept (official + community simultaneously) is smart. However, volunteer dispatch networks exist (PulsePoint, GoodSAM) and community-based emergency response is an established concept. The innovation is in combining these with AI agent coordination rather than in the core idea itself. The multi-stakeholder coordination angle is solid but not as surprising as Solution A's rehearsal concept.

**TECHNICAL EXECUTION: 6/10**
This is where it gets dicey. The ConvergenceAgent is doing real-time multi-party coordination with live location tracking, volunteer matching, and map rendering — that's a significant infrastructure challenge for 48 hours. The CommunityAgent needs a volunteer database with location data, availability status, and skill matching (sign language vs. first aid) — where does this data come from in a hackathon? Mocking it is fine, but it reduces demo credibility. Five agents but the complexity is unevenly distributed: ConvergenceAgent is doing the work of 2-3 agents while InputAgent and FeedbackAgent are thin.

**IMPACT: 8/10**
The real-world impact vision is arguably stronger than Solution A. Having a sign language interpreter arrive at your location while you wait for an ambulance is transformative for deaf callers. The parallel dispatch model (don't wait for one system, activate everything) is genuinely how emergency response should work. The limitation is dependency on volunteer network density — in rural areas or off-hours, the community layer might find zero volunteers, and the system degrades to just a dispatch call.

**PRESENTATION: 7/10**
The real-time map demo with converging dots is visually compelling — dispatch vehicle + 2 volunteers moving toward the caller makes for a great screenshot. But maps are hard to get right in 48h (map rendering, real-time updates, simulated movement). If the map is janky or clearly mocked, it undermines the whole demo. The narrative is also more diffuse — Solution A has a clear before/after; Solution B has to explain the volunteer ecosystem, which takes more setup time in a 5-minute pitch.

**TOTAL: 28/40** 🟡

### 48h Build Feasibility
**MEDIUM-LOW.** The real-time map with live coordination is the highest-risk component. Mapbox/Leaflet integration, WebSocket updates, simulated volunteer movement — any of these can eat 12+ hours if they go sideways. The volunteer database needs seeding with realistic fake data. The team risks spending too much time on the map wow-factor and not enough on the actual agent orchestration logic. Suggested allocation: one dev full-time on map, one on agent pipeline, one on Twilio + volunteer notification, one on UI — but it's tight.

### Critical Risk
**Demo fragility.** The map is both the showpiece and the single point of failure. If real-time updates lag, if volunteer dots don't move smoothly, if the coordinate system is off — the demo falls apart visually. There's no graceful degradation; a broken map makes the whole thing look unfinished. Solution A's demo (two audio recordings side-by-side) is far more robust.

### Verdict
Ambitious vision with real impact potential, but the technical surface area risks an undercooked demo — the map is a make-or-break gamble.

---

## Head-to-Head Summary

| Criteria | Solution A | Solution B |
|---|---|---|
| Innovation | 9 | 7 |
| Technical Execution | 8 | 6 |
| Impact | 8 | 8 |
| Presentation | 9 | 7 |
| **Total** | **34/40** 🟢 | **28/40** 🟡 |

### Key Differentiator
Solution A's rehearsal concept is both the technical core and the demo hook — effort and presentation are perfectly aligned. Solution B's most impressive element (the map) is also its most fragile, and the innovation lives more in the vision than in the agent architecture.

### Judge Lens (Senior Engineers + CTO + University TAs)
- **Senior engineers** will probe Solution B's ConvergenceAgent architecture and likely find coordination edge cases (what if a volunteer cancels mid-convergence? what if dispatch and volunteer arrive simultaneously?). Solution A's pipeline is cleaner to defend.
- **CTO** will assess real-world viability. Solution A is deployable as a standalone app tomorrow. Solution B requires a volunteer network that doesn't exist yet — chicken-and-egg problem.
- **University TAs** will appreciate Solution B's ambition but likely reward Solution A's elegant problem reframing — turning "emergency call" into "rehearsed + live call" is the kind of insight that scores well in academic evaluation.

### Recommendation
**Solution A is the stronger hackathon entry.** It has a tighter scope, a more novel core idea, a more robust demo path, and a built-in narrative arc. Solution B is the better startup pitch but the riskier 48-hour build.

---

## Actual Implementation

The built system ("Medak") most closely resembles **Solution 1 (Voice Bridge Pipeline)** from `p09-emergency-solutions.md`, not either solution scored above. It uses 2 agents (User Agent + Dispatch Agent) with a deterministic Python orchestrator, achieving the pipeline architecture's clarity without the complexity of the 5-agent Rehearse-Then-Call approach.
