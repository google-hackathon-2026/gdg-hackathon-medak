# HACKATHON GUIDE — AI for All

## Theme Definition
**"Giving access to something that could not be made accessible before AI."**

Not incremental improvements. Not nicer UIs. Things that were literally impossible without AI — and now aren't.

## Hard Constraints
1. **Must be agentic** — the system has to DO something (take actions, interact with services, make decisions), not just provide information. No LLM wrappers, no chatbots that just answer questions.
2. **Must be multi-agent** — multiple agents collaborating, not a single agent. Agents with different roles/specializations working together.
3. **Must use Vertex AI / Gemini** (hackathon sponsor context)

## Execution Plan

### Phase 1: Problem Discovery (CURRENT)
Launch a swarm of agents to discover PROBLEMS ONLY — no solutions yet.
- Who's affected?
- What can't they do today?
- What was literally impossible before AI?
- How severe is the pain? How many people?

**Output:** Raw list of 50-100+ specific problems

### Phase 2: Problem Scoring & Ranking
Score each problem on a scoreboard:
- **IMPACT** (1-10): How many people affected × severity of pain
- **AI-UNLOCK** (1-10): How much does AI specifically unlock this? (vs could be solved with better UI)
- **AGENTIC-FIT** (1-10): Does this naturally require agents DOING things? (not just answering)
- **MULTI-AGENT-FIT** (1-10): Does this naturally decompose into multiple collaborating agents?
- **BUILDABLE** (1-10): Can we build a compelling demo in 24-48 hours?
- **WOW-FACTOR** (1-10): Will this impress judges? Emotional + technical impact?
- **Total: /60**

**GREEN ≥ 45 | YELLOW 30-44 | RED < 30**

**Output:** Ranked scoreboard of top problems

### Phase 3: Solution Discovery
For top 5-10 problems, launch agents to discover SOLUTIONS:
- What architecture? What agents needed?
- What Vertex AI / Gemini capabilities to use?
- What's the demo flow?
- What's technically risky?

### Phase 4: Pick & Build
Select the winner. Build it.

---

## Current Status
- All 4 phases complete.
- Phase 1 (Discovery): 12+ problems identified across disability landscape.
- Phase 2 (Scoring): 10 problems scored; 4 GREEN. See `PROBLEM_SCOREBOARD.md`.
- Phase 3 (Solution Discovery): 5 solution architectures for P09. See `docs/solutions/`.
- Phase 4 (Pick & Build): **P09 selected. Built as "Medak."** See `medak/docs/design-document.md`.
