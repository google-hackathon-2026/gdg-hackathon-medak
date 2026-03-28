# CLAUDE.md

This is the workspace for the Medak hackathon project. It contains the code repository and supporting research/strategy docs.

## Structure

- `medak/` — The actual code repository (has its own git + CLAUDE.md). See `medak/CLAUDE.md` for code-specific commands, architecture, testing, and deployment guidance.
- `docs/` — Research and strategy files from the exploration phase, filtered to what's relevant to P09 Emergency Relay.

## Docs Overview

### docs/research/
Background research relevant to the project:
- `p09-deep-dive/` — 9 deep-dive documents: B2G business model, GDPR/data privacy, EU regulations, Serbian market analysis, technical landscape, user stories, executive brief, validation survey, why this problem is unsolved
- `eval-p09-emergency-{impact,innovation,presentation,techexec}.md` — Four-angle evaluation of P09
- `03-sensory-pain-points.md` — Hearing/speech disability research
- `05-existing-ai-accessibility.md` — AI accessibility landscape
- `google-tech-stack-reference.md` — Google API code snippets (Gemini, Maps, Health Connect)

### docs/solutions/
- `p09-emergency-solutions.md` — 4 solution architectures designed for P09
- `p09-emergency-scoreboard.md` — Comparative scoring of solutions

### docs/strategy/
Hackathon-level strategy and planning:
- `HACKATHON_GUIDE.md` — Theme, sponsor constraints, general approach
- `COMPETITIVE_ANALYSIS.md` — What other teams will build (note: references "Cocoon" as project name in header, actual project is Medak)
- `PREHACKATHON_CHECKLIST.md` — Account setup, dependencies, templates (note: some sections reference "Cocoon", adapt for Medak context)
- `PROBLEM_SCOREBOARD.md` — 12 problems ranked by combined score
- `INSIGHTS.md` — Cross-cutting research findings
- `BACKUP_REHEARSE_CALL_BRIEF.md` — Original P09 emergency brief (5-agent architecture)

## Working with Code

Always `cd medak/` first, then follow instructions in `medak/CLAUDE.md`. Key commands:

```bash
# Backend
cd medak/backend && uv sync && uv run pytest

# Frontend
cd medak/frontend && npm install && npm start

# Docker
cd medak && docker-compose up
```
