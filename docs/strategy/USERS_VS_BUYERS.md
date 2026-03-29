# Users vs Buyers — Medak

> AI-powered emergency relay: Phone app → Gemini AI observes scene → AI calls 112 → operator receives normal voice call.

---

## 👤 Users (Who Uses the App)

Users are the people in an emergency who cannot make a voice call to 112.

### Primary: Deaf & Hard of Hearing (D/HoH)

| Scope | Deaf | Hard of Hearing | Total |
|-------|------|-----------------|-------|
| **Serbia** | ~14,000 | ~70,000 | **~84,000** |
| **EU-27** | — | — | **~52M** (EUD, 2023) |
| **Global** | ~70M | — | **~430M** with disabling hearing loss (WHO, 2021/2026) |

- Core user base. These people **literally cannot** make a voice call.
- Everyday smartphone users — no special hardware needed.
- Strong community networks = organic adoption once deployed.

### Secondary: Speech-Impaired

- Dysarthria, severe stuttering, non-verbal autism, ALS/MND, laryngectomy
- **Serbia:** ~20,000–30,000 people with significant speech impairment
- **EU-27:** ~5–7M with conditions affecting speech intelligibility
- **Global:** ~40M+
- Often overlooked in emergency planning — no relay service exists for them today.

### Tertiary: Foreign Tourists & Migrants

- Cannot speak the local language in an emergency.
- **Serbia:** ~2M tourist arrivals/year (growing fast post-COVID).
- **EU-27:** ~400M international tourist arrivals/year.
- Medak's AI handles language translation natively — tourist speaks English, AI calls 112 in Serbian.
- This is a **massive differentiator** over traditional relay services that only handle sign language.

### Edge Case: Temporary Speech Loss

- Post-stroke aphasia (first 72h are critical — and silent)
- Intubated patients in hospitals
- Jaw/facial injury, severe allergic reaction (throat swelling)
- Domestic violence victims who cannot speak without alerting the abuser
- **Sizing:** Hard to estimate, but millions of incidents/year across the EU where someone needs 112 but physically cannot speak.

### Total Addressable Users

| Scope | Estimate |
|-------|----------|
| **Serbia** | ~135K core + 2M tourists |
| **EU-27** | ~57M core (52M D/HoH + 5M speech-impaired) + 400M tourists |
| **Global** | ~430M+ with disabling hearing loss (WHO, 2021/2026) |

---

## 💰 Buyers (Who Pays for It)

**Users ≠ Buyers.** This is **B2G** (Business-to-Government).

Users are vulnerable populations with low purchasing power. Buyers are governments with regulatory mandates and budgets.

### Primary Buyer: Government Emergency Services Agencies

| Country | Agency | Why Now |
|---------|--------|---------|
| **Serbia** | MUP (Ministry of Interior) / Sector za vanredne situacije | EU accession alignment, modernization push |
| **EU members** | National emergency services (BOS in Germany, DGSCGC in France, etc.) | **EECC Article 109 — legal deadline June 2027** |

**Why they buy:**
- **EU European Electronic Communications Code (EECC), Article 109** mandates equivalent access to emergency services for persons with disabilities.
- **Deadline: June 2027.** Member states that don't comply face EU infringement proceedings.
- Most countries have **no solution yet** — they're scrambling.
- Serbia isn't EU but is actively aligning legislation for accession.

**Budget reality:**
- Government emergency infrastructure budgets are €10M–100M+/year per country.
- Medak's price point (€200K–500K/year) is a **rounding error** in these budgets.

### Secondary Buyer: Telecom Operators

- EECC places accessibility obligations on telcos too.
- Operators like Deutsche Telekom, Orange, Telenor must ensure disabled users can reach emergency services.
- **Model:** Telco bundles Medak into accessibility compliance package.
- Telcos have existing billing relationships with governments for emergency service routing.
- **Serbia:** A1, Yettel, Telekom Srbija — all have EECC-equivalent obligations.

### Tertiary Buyer: Healthcare Systems

- Hospitals and care facilities with non-verbal patients (ICU, stroke wards, elderly care).
- **Model:** Site license for facility deployment.
- Lower revenue per deal, but high volume.
- Also: insurance companies reducing liability exposure.

### Grant & Innovation Funding

| Source | Relevance |
|--------|-----------|
| **Serbian Innovation Fund** | Precedent: TransportSign (accessibility app) got funded. Medak fits perfectly. |
| **EU Innovation Fund** | Emergency services + accessibility = double mandate alignment. |
| **EIT Digital** | Digital infrastructure for European citizens. |
| **Horizon Europe** | Cluster 3: Civil Security for Society. |
| **Google.org / Impact Challenge** | AI for social good — and we're built on Gemini. |

---

## 🔄 The Gap: Why Users Don't Buy

```
┌──────────────────┐          ┌──────────────────┐
│     USERS         │          │     BUYERS        │
│                    │          │                    │
│  Deaf/HoH people  │          │  Governments       │
│  Speech-impaired   │  ← GAP → │  Telcos            │
│  Tourists          │          │  Healthcare        │
│  Temp. speech loss │          │                    │
│                    │          │                    │
│  Low purchasing    │          │  Regulatory        │
│  power             │          │  mandates +        │
│  Don't choose      │          │  large budgets     │
│  the solution      │          │  Make the decision │
└──────────────────┘          └──────────────────┘
```

**Key insight:** Users don't choose Medak — governments deploy it as public infrastructure. Just like:

| Precedent | Country | Model |
|-----------|---------|-------|
| **Text-to-911** | USA | FCC mandated, carriers implemented |
| **114 Relay Service** | France | Government-funded, human interpreters, costs millions |
| **NGT (Next Generation Text)** | UK | Ofcom mandated, BT implemented |
| **DRS (Deaf Relay Service)** | Australia | Government-funded national service |

**Medak's positioning:** The AI-native version of what France pays millions for with human interpreters.

---

## 🎯 Decision Makers & Influencers

### Who Signs the Check

| Role | Serbia | EU Pattern |
|------|--------|------------|
| **Final authority** | Minister of Interior (MUP) | Minister of Interior / Civil Protection |
| **Budget holder** | Director, Sector za vanredne situacije | National emergency services director |
| **Procurement lead** | MUP IT/Modernization department | National IT procurement office |
| **Technical approver** | 112 center operations chief | PSAP (Public Safety Answering Point) director |

### Who Influences the Decision

| Influencer | Why They Matter |
|------------|----------------|
| **Disability advocacy orgs** (Serbian Association of the Deaf, EUD at EU level) | Lobby governments, validate need, provide test users |
| **EENA** (European Emergency Number Association) | Sets standards, publishes best practices, advises governments — endorsement = credibility |
| **EU regulatory bodies** (BEREC, European Commission DG CONNECT) | Enforce EECC compliance, can pressure lagging states |
| **ETSI** (European Telecommunications Standards Institute) | Defines technical standards for emergency services accessibility |
| **Media** | A single "deaf person dies because they couldn't call 112" story creates overnight political urgency |

### What Triggers the Purchase

1. **EECC deadline pressure** (June 2027 — 15 months away) — the #1 trigger
2. **Public incident** — deaf person dies in emergency, media coverage, political fallout
3. **Advocacy campaign** — disability organizations publicly demanding action
4. **Peer pressure** — neighboring country deploys a solution, "why don't we have this?"
5. **EU accession requirements** — for Serbia specifically, showing alignment is political capital
6. **Cost comparison** — learning that France's human-interpreter model costs 10x more

---

## 💸 Pricing Justification

### Our Cost Structure

| Component | Cost per Call |
|-----------|-------------|
| Gemini 2.0 Flash Live — scene analysis + voice dispatch | ~$0.015 |
| Twilio — outbound voice call to 112 (~5 min) | ~$0.07 |
| Gemini TTS — AI voice narration to operator | ~$0.02 |
| Infrastructure (servers, monitoring, overhead) | ~$0.02 |
| **Total cost per emergency call** | **~$0.13** |

Average emergency calls per year for D/HoH population in a country like Serbia: ~500–2,000 calls.
**Annual variable cost: ~$65–$260.** Essentially free to operate.

### Our Pricing Model

| Tier | Price | What's Included |
|------|-------|-----------------|
| **Country license (small, <5M pop)** | €200K/year | Full deployment, integration with national 112, unlimited calls, SLA |
| **Country license (medium, 5–30M pop)** | €300K/year | Same + multi-language support, analytics dashboard |
| **Country license (large, 30M+ pop)** | €500K/year | Same + custom integrations, on-premise option, 24/7 support |
| **Telco bundle** | €50K–150K/year | White-label integration into carrier accessibility suite |
| **Healthcare facility** | €5K–20K/year | Site license for hospital/care facility |

### The Comparison That Sells It

| Solution | Annual Cost | Model |
|----------|------------|-------|
| **France 114 service** | €5–10M/year | Human sign language interpreters, 24/7 staffing |
| **UK NGT relay** | £3–5M/year | Human text relay operators |
| **Traditional relay services** | €2–8M/year | Human interpreters per country |
| **Medak** | **€200–500K/year** | **AI-powered, no human operators, scales instantly** |

**10–20x cost reduction on license; 150x cheaper per call ($0.13 vs $20–40).** Not incremental improvement — a category shift.

### Why Governments Can't Say No

1. **Legal obligation** — EECC Article 109, deadline June 2027
2. **Budget-friendly** — 10x cheaper than the alternative
3. **Faster to deploy** — no hiring/training interpreters, just API integration
4. **Better coverage** — works 24/7, handles multiple languages, no interpreter shortages
5. **Scales instantly** — handles 1 call or 1,000 simultaneous calls at the same cost
6. **Politically safe** — "we deployed AI to save deaf citizens' lives" is an easy win

---

## 📊 Summary for Pitch Slide

```
USERS                          BUYERS
───────────────────           ───────────────────
52M+ in EU alone               EU governments
Can't call 112                 MUST comply by June 2027
Low purchasing power            €200-500K/year budget
Don't choose the solution       Deploy as infrastructure

         ┌─────────────────────┐
         │       MEDAK          │
         │                      │
         │  AI emergency relay  │
         │  $0.13 per call      │
         │  150x cheaper than   │
         │  human interpreters  │
         │  Works in any        │
         │  language             │
         └─────────────────────┘
```

**One-liner:** Governments are legally required to make 112 accessible by 2027. We do it 150x cheaper per call than anyone else.
