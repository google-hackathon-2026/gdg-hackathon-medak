# 🏆 Winning Hackathon Pitch Insights

> Compiled from Google Cloud AI Hackathon 2025 winners, GDG Solution Challenge materials, and hackathon masterclasses. Apply to Medak's pitch.

---

## What Winners Do Differently

### 0. "Judges remember the story, not the architecture" (GDG AI Hack 2026 Resources)
- ✅ **Our story IS the pitch.** Ana opens it. Ana closes it. The architecture serves the story.
- **Critical insight:** At Google hackathons, Innovation + UX typically gets 40% of the score, Tech gets 30%, Demo gets 30%. The emotional impact matters MORE than the code quality.

### 1. "Solve a real problem, not a cool demo" (SurgAgent, 1st place ODSC-Google)
- ✅ **Medak does this.** Our opening is Ana's emergency, not a tech demo.
- **Reinforce:** Every technical choice traces back to a human need.

### 2. "Prove it works early" 
- ✅ **Demo in 38 seconds.** Complete flow: SOS → call → resolved.
- **Key:** The silence during the demo IS the proof. Don't narrate over it.

### 3. "Show what's DIFFERENT, not just what's good" (biggest insight)
- ✅ **Our differentiator:** We make a **voice call**. Every competitor sends text.
- **Hammer this point:** "The dispatcher hears a normal voice call. No upgrade, no training, no new equipment."
- **On stage:** This should be the single idea judges remember. If they remember nothing else, they should remember "Medak makes a real phone call."

### 4. "For agentic themes: perception → planning → action loop" (GDG AI Hack 2026)
Google's own hackathon resources say: *"Use the perception + planning + action loop when building agents. Sense the world, decide what to do, then do it."*

Our architecture maps PERFECTLY to this:
- **Perception:** User Agent sees the scene (camera + GPS) → scene analysis
- **Planning:** FSM orchestrator evaluates confidence score → decides whether to dispatch
- **Action:** Dispatch Agent makes the voice call → relays information to operator

This is textbook agentic design. If a Google judge asks about agent architecture, reference this loop explicitly.

### 4b. "Highlight planning, tool use, validation loops"
- ✅ **Multi-agent coordination:** Two Gemini agents working in tandem.
- ✅ **Deterministic FSM orchestrator** — not just "throw everything at the LLM."
- ✅ **Confidence scoring** — validation loop before every dispatch.
- **Reinforce in Slide 6:** "The AI agents gather information. The FSM validates it. The scoring formula decides. This is deliberate architecture — not a single prompt that hopes for the best."

### 5. "Log and explain every decision" (transparency wins prizes)
- ✅ **Deterministic scoring:** Judges can see exactly WHY a call was placed.
- ✅ **Phase transitions visible:** INTAKE → TRIAGE → LIVE_CALL → RESOLVED
- ✅ **Confidence bar:** Real-time visualization of decision confidence.
- **Pitch angle:** "There is no black box in Medak. Every decision is traceable, deterministic, and auditable. You can explain to a regulator EXACTLY why the system called 112."

### 6. Technical Merit = 40% (GDG Solution Challenge criteria)
- Architecture slides (6, 7) are **critical for scoring.**
- Don't rush architecture — let it breathe. The Tech Lead should speak with confidence and precision.
- **Show the hard problem you solved** (Slide 7: confidence racing) — judges love this.

### 7. "Document as you go" (every winner emphasized this)
- ✅ **30+ strategy docs, research docs, architecture docs.**
- If judges ask "how did you build this?" → point to comprehensive documentation.
- If there's a GitHub README → link to architecture docs.

---

## Common Mistakes That Lose

| Mistake | How Medak Avoids It |
|---------|-------------------|
| Starting with the solution | We start with Ana's story (Slide 1) |
| Too many features | One core flow: SOS → AI → voice call → resolved |
| Demo doesn't work → panic | 4-tier fallback plan + recorded backup |
| Can't explain the "why" | Research → Architecture mapping (Slide 8) |
| Black-box AI | Deterministic FSM + confidence scoring |
| No business model | B2G model + EECC compliance driver |
| Team doesn't look technical | "Svi smo inženjeri. Svi kodiramo." |
| Running over time | ✂️ cut marks in script + PRESENTER_POCKET_CARD |

---

## Three Lines Judges Should Remember

After the pitch, if a judge could only recall three things, they should be:

1. **"430 million people can't call for help."** (the problem)
2. **"Medak makes a real phone call — no infrastructure change required."** (the differentiator)
3. **"38 seconds from SOS to confirmed help."** (the proof)

If the team delivers these three ideas with conviction, the pitch lands.

---

## ADK Question (Google-specific trap)

Judges at a Google hackathon may ask "Why didn't you use Google ADK?" Be ready:

**The right answer:** "ADK is built for tool-calling completion agents. Gemini 2.0 Flash Live requires persistent bidirectional WebSocket streaming — which ADK doesn't support. For real-time emergency voice relay with zero latency, direct API access is the only correct choice. Also: for a safety-critical system, we deliberately chose the lowest-level API access to maximize control and auditability."

**The flip:** "We're not going around Google's ecosystem — we're using the most powerful, most direct part of it: the Live API. ADK is a wrapper; we're working at the layer that matters for real-time voice."

This question is actually a GIFT — it shows deep understanding of Google's tool ecosystem and a principled architectural decision.

---

## Explainability Angle (bonus for "Build with AI" theme)

The "Build with AI" theme values responsible AI use. Our architecture is a showcase:

- **AI does what AI is good at:** Pattern recognition (scene analysis), natural language (voice relay).
- **Deterministic systems do what humans need to trust:** Scoring, threshold decisions, state management.
- **Separation of concerns:** The LLM never decides whether to call 112. The FSM does, based on verifiable scores.

This is "AI done right" — and judges at a Google hackathon should notice.

---

*Use this document as pre-pitch motivation. Read it morning-of, then forget it and deliver naturally.*
