# Medak — Monetization Model & Revenue Strategy

> **One-liner:** AI-powered emergency relay that lets deaf/speech-impaired people call 112 — no PSAP upgrades needed. The phone app observes the scene with Gemini AI, calls emergency services, and the operator receives a normal voice call.

---

## 1. Why Governments Will Pay

### The Regulatory Hammer

The **European Accessibility Act (EAA)** mandates that all EU Member States ensure accessible emergency communications to 112 by **June 28, 2027**. The **European Electronic Communications Code (EECC)** requires equivalent access for people with disabilities — including deaf and speech-impaired citizens — to emergency services.

**Current reality (2026):**
- Most EU PSAPs can **only receive voice calls**
- Only Ireland has native RTT; a handful have app-based solutions
- Upgrading PSAPs to handle video/text/Total Conversation costs **€5-50M per country** and takes years
- ~52 million people in the EU are deaf or hard of hearing (EUD, 2023)

**Medak's value proposition:** Compliance by deployment, not by infrastructure overhaul. Governments get EAA compliance **in weeks, not years**, at a fraction of the cost.

---

## 2. Revenue Model: B2G SaaS (Government License)

### Primary: Annual Country/Region License

| Tier | Population | Annual License | Includes |
|------|-----------|---------------|----------|
| **Small** | < 5M (e.g. Croatia, Slovenia, Ireland) | €200K/year | Full deployment, maintenance, 24/7 monitoring, updates |
| **Medium** | 5–20M (e.g. Netherlands, Belgium, Czechia) | €350K/year | + Dedicated support, custom language model tuning |
| **Large** | 20M+ (e.g. France, Germany, Spain, Italy) | €500K/year | + Multi-region deployment, SLA guarantees, on-site onboarding |

**What's included in every license:**
- App deployment (iOS + Android) localized for the country
- AI model tuned for local language + emergency protocols
- Twilio/telecom integration with national 112 infrastructure
- 24/7 system monitoring and incident response
- Quarterly updates and continuous AI model improvements
- Compliance documentation for EAA/EECC audits

### Alternative: Usage-Based Pricing

| Model | Price | Best For |
|-------|-------|----------|
| **Per-call** | €2–5 per emergency call | Pilot programs, small deployments |
| **Hybrid** | Base license (50% of tier) + €1.50/call overage | Countries wanting cost predictability with usage flexibility |

### Why Annual License Wins

- Governments prefer **predictable OPEX** over variable costs
- Emergency services **cannot have billing disputes** — lives depend on it
- Multi-year contracts (3-5 years) provide revenue stability
- Per-call model creates perverse incentive to limit access

---

## 3. Unit Economics: The AI Cost Advantage

### Cost Per Emergency Call (Medak)

| Component | Cost | Notes |
|-----------|------|-------|
| Gemini 2.0 Flash Live — scene analysis (video/image input) | ~$0.01 | ~2K tokens input + 500 output |
| Gemini 2.0 Flash Live — generating emergency description | ~$0.005 | Text generation for operator briefing |
| Twilio — outbound voice call to 112 (~5 min) | ~$0.07 | EU rates, $0.014/min equivalent |
| Gemini TTS — AI voice narration to operator | ~$0.02 | Text-to-speech for the call |
| Infrastructure (servers, monitoring, overhead) | ~$0.02 | Amortized cloud costs |
| **Total cost per call** | **~$0.13** | Conservative estimate |

### Cost Per Emergency Call (Human Interpreter — Status Quo)

| Service | Cost Per Call | Source |
|---------|-------------|--------|
| US Video Relay Service (VRS) | **$19.60–40.30** | FCC TRS Fund: $3.92–$8.06/min × 5 min avg call |
| France 114 Text/Video Relay | **€15–30 est.** | Human interpreters, 24/7 staffing |
| Generic sign language interpreter | **$25–50** | Industry average for on-demand interpretation |

### The Multiplier

| Metric | Medak (AI) | Human Relay | Advantage |
|--------|-----------|-------------|-----------|
| **Cost per call** | $0.13 | $20–40 | **150–300x cheaper** |
| **Availability** | 24/7/365, instant | Limited hours in most countries | ∞ |
| **Scalability** | Unlimited concurrent | Limited by interpreter pool | ∞ |
| **Language support** | Any (AI-based) | Per-language staffing needed | 10x+ |
| **Response time** | < 5 seconds | 30–90 sec (interpreter connect) | 6–18x faster |

> **At scale:** Even with 100,000 calls/year across the EU, Medak's total API cost would be ~€13,000. The same volume through human relay services would cost **€1.5–4M**.

---

## 4. Revenue Projections

### Conservative Scenario

| Year | Milestone | Revenue | Cumulative |
|------|-----------|---------|------------|
| **Year 1** (2026) | Serbia pilot — grant-funded, 0 paying customers | €0 | €0 |
| **Year 2** (2027) | 2–3 EU countries (EAA deadline pressure: June 2027) | €400K–€1M | €400K–€1M |
| **Year 3** (2028) | 5–8 EU countries + US accessibility pilot | €1.5M–€3M | €2M–€4M |
| **Year 4** (2029) | 10–12 countries, established government relationships | €3M–€5M | €5M–€9M |
| **Year 5** (2030) | 15+ countries, potential non-EU expansion | €5M–€8M | €10M–€17M |

### Key Assumptions
- Average deal size: €300K/year (weighted across tiers)
- Government procurement cycle: 6–18 months
- Churn: near-zero (multi-year contracts, high switching cost)
- No VC fantasy multipliers — these are achievable B2G numbers

### Revenue Mix (Year 3 Target)

```
License Revenue:     75%  (recurring SaaS)
Per-Call Overage:    10%  (usage-based hybrid deals)
Grant Funding:       15%  (non-dilutive, project-based)
```

---

## 5. Grant Funding Path (Non-Dilutive)

Grants fund the **first 12-18 months** while government procurement cycles play out.

| Grant Program | Amount | Fit | Timeline |
|---------------|--------|-----|----------|
| **Serbian Innovation Fund** | €50–200K | Direct fit — Serbian startup, accessibility tech. **Precedent: SignAvatar (sign language on Srbijavoz app) already funded.** GovTech program explicitly lists "inkluzija i pristupačnost." Catalytic Co-Investment: up to €200K for AI companies. Smart Start: up to ~€46K for MVP teams of 2-5. | 3–6 months |
| **Google.org Impact Challenge** | $100K–$2M | AI for social good, accessibility, emergency services. GDG hackathon = Google ecosystem alignment. | 6–12 months |
| **Horizon Europe** (HORIZON-CL2-2025-01-TRANSFO-09) | Up to €3.4M | "Autonomy of persons with disabilities" — direct match. Deadline: Sep 2025. Requires EU consortium. | 12–18 months |
| **EU Innovation Fund** | €500K–€2.5M | Digital innovation for public services. Emergency accessibility = strong case. | 12–18 months |
| **EENA Innovation Award** | Recognition + network | Not direct funding, but opens doors to every PSAP decision-maker in Europe. | Annual |
| **EIT Digital** | €25–50K (accelerator) + network | Digital deep tech acceleration, connects to EU gov buyers. | 6 months |

**Total addressable grants: €1–5M in non-dilutive funding over 24 months.**

---

## 6. Competitive Pricing Analysis

### What Governments Currently Spend

| Country/System | Annual Cost | Model | Limitations |
|----------------|-------------|-------|-------------|
| **US TRS Fund (VRS)** | **$629M/year** (VRS portion) | Per-minute reimbursement ($3.92–$8.06/min) | Interpreter-dependent, English-only, no video scene analysis |
| **US TRS Fund (Total)** | **~$1.49B/year** | All relay services combined | FCC-administered, telecom-funded |
| **France — 114 Relay** | **€5–10M/year est.** | Human interpreters, government-run | Limited hours, text/video only, no AI |
| **UK — 999 BSL Relay** | **€2–5M/year est.** | Video relay with BSL interpreters | Requires pre-registration, limited capacity |
| **PSAP Upgrade (NG112)** | **€5–50M per country** | Infrastructure capital expenditure | 3–5 year deployment, massive IT project |

### Medak's Position

```
Current Solutions:          €2–50M/year per country
Medak License:              €200–500K/year per country
Savings:                    90–99% cost reduction
Time to Deploy:             Weeks vs. years
PSAP Changes Required:      Zero
```

**Medak doesn't compete with existing relay services — it makes them obsolete for emergency calls.**

---

## 7. Sustainability & Defensibility

### Why This Business Survives

| Factor | Detail |
|--------|--------|
| **Low marginal cost** | AI scales linearly; humans scale with headcount. Each new country adds ~€10K/year in cloud costs. |
| **Recurring revenue** | Government SaaS contracts are 3–5 year terms with renewal options. |
| **High switching cost** | Integration with national 112 infrastructure, regulatory certification, staff training — switching is painful. |
| **Regulatory moat** | Once certified for emergency use in a country, competitors face the same 12–24 month certification process. |
| **First-mover advantage** | No AI-native emergency relay exists. Being first means building relationships with PSAPs, regulators, and disability organizations before competitors arrive. |
| **Network effects** | Each country deployment generates data that improves the AI for all countries. Multi-language, multi-scenario training data compounds. |
| **Google ecosystem alignment** | Built on Gemini = potential for strategic Google partnership/backing. GDG hackathon origin story adds credibility. |

### Path to Profitability

| Metric | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| **Revenue** | €0 (grants) | €400K–€1M | €1.5M–€3M |
| **COGS** (API + infra) | €20K | €50K | €120K |
| **Gross Margin** | — | 88–95% | 92–96% |
| **Team** (cost) | €150K (grants) | €400K | €800K |
| **Net** | -€150K (grant-funded) | €0–€600K | €700K–€2.2M |

**Break-even: 2-3 paying countries (Year 2).**

---

## 8. Risk Analysis

### Critical Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| **Government procurement is slow** (12–24 months) | 🟡 High | Grants bridge Year 1. Serbia pilot = proof point. EAA 2027 deadline creates urgency. |
| **EU AI Act: High-Risk Classification** | 🔴 Critical | Emergency AI = Annex III, Category 5(d) = high-risk. Requires conformity assessment, human oversight, transparency. Budget ~€80–100K for compliance. |
| **Regulatory approval for AI in emergency services** | 🔴 Critical | Start with "supplementary" positioning (adds to existing services, doesn't replace). Serbia has lighter regulation = ideal testing ground. |
| **AI reliability concerns** | 🟡 High | Medak doesn't replace 112 — it enables access where there was NO access before. The alternative is literally nothing. Frame as "AI call > no call." |
| **Competitor entry (Big Tech)** | 🟢 Medium | Google/Apple could build this, but won't due to liability in emergency services. B2G sales require boots-on-ground relationships, not just technology. |
| **Gemini API pricing changes** | 🟢 Low | API costs are trending down rapidly. Multi-model fallback (Gemini → local models) is straightforward. Current cost is already negligible. |

### EU AI Act Compliance Cost

| Requirement | Estimated Cost | Timeline |
|-------------|---------------|----------|
| Risk management system | €20K | 3 months |
| Data governance & documentation | €15K | 2 months |
| Technical documentation | €10K | 1 month |
| Human oversight mechanisms | €25K | 3 months |
| Conformity assessment | €30K | 6 months |
| **Total** | **~€100K** | 6–12 months |

---

## 9. The 2-Minute Pitch (Hackathon Version)

> **"52 million deaf Europeans can't call 112. The EU says that must change by 2027. Upgrading every emergency center costs billions and takes years.**
>
> **Medak fixes this in weeks. Our app uses Gemini AI to see the emergency, then calls 112 as a normal voice call. The operator hears a clear description. No PSAP upgrades. No interpreters. No infrastructure changes.**
>
> **Cost per call: 13 cents. Human relay: $20-40. That's over 150x cheaper.**
>
> **Our model: government SaaS license, €200-500K per country per year. 27 EU countries must comply by 2027. That's a €10-20M annual market we can capture 30%+ of within 5 years.**
>
> **Year 1: Serbia pilot (grant-funded). Year 2: first paying EU countries. Year 3: profitable.**
>
> **We're not building a charity. We're building a business where doing good IS the business model."**

---

## 10. Key Metrics for Investors

| Metric | Value |
|--------|-------|
| **TAM** (Total Addressable Market) | €50–100M/year (EU + US + developed world) |
| **SAM** (Serviceable) | €10–20M/year (EU countries with EAA mandate) |
| **SOM** (Year 3–5) | €5–8M ARR (10-15 EU countries, established relationships) |
| **Gross Margin** | 90–96% (SaaS with near-zero marginal cost) |
| **LTV:CAC** | >20:1 (multi-year gov contracts, low churn) |
| **Payback Period** | < 6 months per deal (low deployment cost) |
| **Capital Efficiency** | Profitable at 2-3 customers |

---

*Last updated: March 2026 | Prepared for GDG Hackathon Belgrade*
