# 🚨 Project 112 Relay — Executive Brief

## The Pitch in 30 Seconds
30 million deaf Europeans cannot call 112. The EU mandates accessible emergency access by June 2027 — 15 months away — and almost no country is compliant. We built an AI that calls 112 FOR you: you type, it speaks to the dispatcher, you see a live transcript and can correct it in real-time. The dispatcher hears a normal voice call — no PSAP upgrades needed. B2G model, €200K-500K per country, with multiple EU grant paths already identified.

---

## 5 Killer Facts for Judges

1. **"The EU mandates this. June 2027 deadline. Almost no one is compliant."**
   Source: EECC Article 109, Delegated Regulation 2023/444

2. **"30 million deaf Europeans have no way to call 112 today."**
   Source: European Disability Forum, WHO World Report on Hearing, 2021

3. **"In Serbia, 14,000 deaf citizens have ZERO direct access to emergency services."**
   Source: Serbian Deaf Association + Office for IT and eGovernment

4. **"No AI-powered emergency relay exists anywhere in the world."**
   Source: Technical landscape analysis (Carbyne, RapidSOS, EENA reports)

5. **"Every minute of delayed emergency response reduces cardiac arrest survival by 7-10%."**
   Source: European Resuscitation Council Guidelines

---

## The Story: "Meet Ana"
> Ana is 34, deaf since birth. She lives alone in Belgrade. At 2 AM, she smells gas. Her chest tightens. She grabs her phone — but there's no one to call. Serbia's 112 doesn't accept text. She can't speak. The SOS interpreter service is closed until 8 AM.
>
> She types frantically to her neighbor. No response. She runs to the hallway, banging on doors at 2 AM. Six minutes pass before someone wakes up and calls 194.
>
> **What if her phone could call for her?**

---

## Business Viability

### Revenue Model: B2G (Government Buyer)
| Tier | Per-Country | EU-27 Potential |
|------|-------------|-----------------|
| Small country license | €200-500K/yr | - |
| Medium country license | €500K-2M/yr | - |
| Large country license | €2-10M/yr | - |
| **Total EU potential** | - | **€50-200M/yr** |

### Funding Path (non-dilutive)
| Source | Amount | Timeline |
|--------|--------|----------|
| Innovation Fund Serbia (GovTech) | €50-300K | 3-6 months |
| IPA III (EU pre-accession) | €200K-1M | 6-12 months |
| CEF Digital | €500K-2M | 6-12 months |
| UNDP Serbia | €50-200K | 3-6 months |
| Horizon Europe | €1-5M | 12-18 months |

### Competitive Advantage
- **No PSAP upgrades needed** — dispatcher gets a normal voice call
- **100x cheaper than human relay** (€0.10/call vs €5-20/min)
- **24/7** — no interpreter scheduling
- **Multi-language from day 1** — LLMs handle translation natively
- **First mover** — no competitor in this lane

---

## Technical Architecture (48h Build)

```
┌──────────────────────────────┐
│   User (Deaf Person)         │
│   Types: "gas leak, cant     │
│   breathe, Knez Mihailova 5" │
└──────────┬───────────────────┘
           │ WebSocket
┌──────────▼───────────────────┐
│   Intake Agent               │
│   Parse → EmergencyIntent    │
│   {type: GAS_LEAK,           │
│    severity: CRITICAL,       │
│    address: "Knez Mihailova  │
│    5, Belgrade"}             │
└──────────┬───────────────────┘
           │
┌──────────▼───────────────────┐
│   Triage Agent               │
│   Protocol: Fire + Medical   │
│   Pre-fill dispatcher Q&A    │
│   Generate CallScript        │
└──────────┬───────────────────┘
           │
┌──────────▼───────────────────┐
│   Caller Agent               │
│   Twilio → dials 112 sim     │
│   OpenAI Realtime Voice API  │
│   Speaks ← → Listens         │
│   Sub-second latency         │
└──────────┬───────────────────┘
           │ live transcript
┌──────────▼───────────────────┐
│   Feedback Agent             │
│   Shows transcript to user   │
│   User can type corrections  │
│   "🚑 ETA 8 minutes"        │
└──────────────────────────────┘
```

**Stack:** Next.js + Twilio Voice + OpenAI Realtime API + Claude for triage
**Demo cost:** ~$5-10 total
**Key: Dispatcher hears a normal voice call. Zero infrastructure change.**

---

## Privacy (addressed proactively)

- GDPR Article 6(1)(d): "vital interests" = no consent needed during emergencies
- EU AI Act: high-risk classification (Annex III, 5(d)) → we comply from day 1
- Architecture: on-device medical profile, EU-only cloud, auto-delete transcripts 72h
- Serbia LPDP (GDPR-equivalent): same vital interests exemption applies

---

## Validation

### Google Form Survey (ready to deploy)
14 questions covering: personal experience, confidence in reaching 112, solution usefulness, AI trust, willingness to pay. Distribution plan: Serbian Deaf Association, Reddit r/deaf, EENA network.

### Expected Results (from published research)
- 80%+ deaf respondents: confidence 1-2/5 in reaching emergency services
- 90%+ will rate solution 4-5/5 useful
- 70%+ say government should provide free → validates B2G model

---

## 90-Day Post-Hackathon Plan

1. **Week 1-2:** Contact Mihailo Gordić (Belgrade Deaf Organization) + OSCE Mission
2. **Month 1:** Apply Innovation Fund Serbia GovTech grant
3. **Month 1-2:** Partner with Office for IT and eGovernment (they built SOS for Deaf app)
4. **Month 2-3:** Build production MVP with Twilio + real VoIP
5. **Month 3:** Pilot at one Belgrade PSAP with 50 deaf users
6. **Month 3-6:** Apply CEF Digital + IPA III for EU expansion

---

## Research Files (221KB total)

| File | Content | Size |
|------|---------|------|
| eu-regulations-b2g.md | EU mandates, NG112, procurement, TAM | 35KB |
| data-privacy-gdpr.md | GDPR exemptions, AI Act, architecture | 46KB |
| serbia-market-analysis.md | 112 system, deaf community, pilot path | 36KB |
| technical-landscape.md | Relay services, AI PSAPs, recommended stack | 61KB |
| user-stories-narrative.md | Real cases, pitch story, expert quotes | 31KB |
| B2G_BUSINESS_MODEL.md | Revenue tiers, go-to-market, funding | 6KB |
| VALIDATION_SURVEY.md | Google Form spec, 14 questions | 6KB |
