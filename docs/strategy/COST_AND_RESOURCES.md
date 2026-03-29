# Medak — Cost & Resources

> AI-powered emergency relay for deaf/speech-impaired people.
> React Native → FastAPI → Gemini 2.0 Flash Live → Twilio VoIP → 112 operator.

---

## Current State (Hackathon MVP)

| Component | Status |
|-----------|--------|
| Backend | FastAPI + Redis + Gemini 2.0 Flash Live + Twilio |
| Frontend | React Native / Expo |
| Demo mode | ✅ Working — 38s SOS → RESOLVED |
| Real mode | ⚠️ Partial — audio bridge + agent tool calls functional |
| Team | 5 people, 48h hackathon |

---

## Infrastructure Costs

### Fixed Monthly

| Service | Cost/month | Notes |
|---------|-----------|-------|
| Google Cloud Run | $20–30 | Auto-scales to zero when idle |
| Redis (Memorystore / managed) | $15–25 | Session state + pub/sub |
| Twilio phone number | $1 | Per number |
| Domain + SSL | ~$1.25 | ($15/year) |
| **Total fixed** | **$37–57** | |

### Variable Per-Call

| Service | Cost/call | Calculation |
|---------|----------|-------------|
| Gemini 2.0 Flash Live | ~$0.02–0.05 | ~1K tokens × ($0.075/1M in + $0.30/1M out) × 2 agents |
| Twilio voice | ~$0.02–0.06 | $0.02/min × 1–3 min avg call |
| Cloud Run compute | ~$0.001 | Per-request billing |
| **Total per call** | **~$0.05** | |

### Monthly Projections

| Usage tier | Calls/month | Variable cost | Fixed cost | **Total** |
|-----------|-------------|--------------|------------|-----------|
| Pilot (low) | 100 | $5 | $50 | **$55** |
| City-scale | 1,000 | $50 | $60 | **$110** |
| National | 10,000 | $500 | $80 | **$580** |
| EU-scale | 100,000 | $5,000 | $150 | **$5,150** |

---

## Development Roadmap to Production

### Phase 1 — Hardening (3 months)

**Team:** 2 engineers full-time

| Task | Why |
|------|-----|
| Audio pipeline hardening | Reliable bidirectional audio under real network conditions |
| Twilio integration testing | Edge cases: dropped calls, DTMF, hold, transfer |
| Security audit | Emergency system = lives at stake, zero tolerance for failure |
| App store deployment | Android + iOS, accessibility compliance (WCAG 2.1 AA) |
| Automated testing | End-to-end call flow simulation, load testing |

**Est. cost:** 2 × €5K/month = **€30K** (or grant-funded)

### Phase 2 — Compliance (3 months)

**Team:** 2 engineers + 1 compliance specialist

| Task | Why |
|------|-----|
| EU AI Act certification | High-risk AI system (emergency services) — mandatory |
| GDPR compliance | Emergency data processing legal basis (Art. 6(1)(d) vital interests) |
| Penetration testing | External security audit before public deployment |
| Multi-language support | Minimum: EN, SR, DE, FR — Gemini handles natively |
| 112 PSAP integration specs | Align with ETSI TS 103 479 (next-gen 112) |

**Est. cost:** €45K (engineers + compliance consultant)

### Phase 3 — Scale (ongoing)

**Team:** 1 engineer + 1 bizdev

| Task | Why |
|------|-----|
| Government pilot deployments | 1–2 country pilots with emergency services |
| 24/7 monitoring + alerting | SLA requirements for emergency infrastructure |
| Continuous improvement | Real usage data → model fine-tuning, flow optimization |
| Partnership development | Deaf associations, emergency services, EU funding |

**Est. cost:** €15K/month ongoing

---

## Cost Comparison vs. Alternatives

| Solution | Cost/call | Annual infra | Staffing | Availability |
|----------|----------|-------------|----------|--------------|
| **Medak (AI)** | **$0.05** | **$660–$1,300** | **0 operators** | **24/7 instant** |
| Human relay (FR 114) | $15–25 | $100K+ | 20+ operators 24/7 | Limited hours in practice |
| VRS (US model) | ~$30 | $500K+ | Interpreters on-demand | Business hours typical |
| SMS-to-112 (current EU) | ~$0.01 | Minimal | 0 | Text-only, no dialogue |

### Key Advantage

> **Medak is 100–500× cheaper per call** than human relay services while providing real-time, bidirectional voice dialogue 24/7 with zero staffing.

Even at national scale (10K calls/month), Medak's total cost ($7K/year infra) is **<2% of a human relay service**.

---

## Team Requirements

### Minimum Viable (to first pilot)

| Role | Count | Focus |
|------|-------|-------|
| Backend/AI engineer | 1 | Audio pipeline, Gemini integration, reliability |
| Mobile/fullstack engineer | 1 | App, accessibility, app stores |
| Compliance + BD | 1 | EU AI Act, GDPR, government partnerships |
| **Total** | **3** | |

### Ideal (to scale across EU)

| Role | Count | Focus |
|------|-------|-------|
| Backend engineers | 2 | Infrastructure, scaling, monitoring |
| Mobile engineer | 1 | Cross-platform app, accessibility |
| ML/AI engineer | 1 | Model optimization, multi-agent orchestration |
| Compliance specialist | 1 | Regulatory, certifications |
| BD / Sales | 1 | Government relations, pilots, funding |
| **Total** | **6** | |

---

## Funding Strategy

| Source | Amount | Timeline |
|--------|--------|----------|
| EU Digital Europe Programme | €500K–2M | 6–12 months |
| National innovation grants (Serbia/Croatia) | €50–100K | 3–6 months |
| Google.org / AI for Social Good | $100–500K | 3–6 months |
| Emergency services modernization budgets | Varies | Per-country negotiation |

**No VC needed initially.** Emergency accessibility is a public good — grant funding is the natural path. Governments are already mandated (EU Accessibility Act 2025) to provide these services and are actively seeking cost-effective solutions.

---

## Bottom Line

| Metric | Value |
|--------|-------|
| Cost to run today | **$55/month** |
| Cost per emergency call | **$0.05** |
| Time to production | **6 months** (2 phases) |
| Team needed | **3 people minimum** |
| Total investment to pilot | **~€75K** |
| Addressable users (EU) | **~1M deaf/speech-impaired** |
| Comparable services cost | **$500K+/year** |

> **Medak delivers a $500K/year service for $660/year in infrastructure.**
> The question isn't whether this should exist — it's how fast we can deploy it.
