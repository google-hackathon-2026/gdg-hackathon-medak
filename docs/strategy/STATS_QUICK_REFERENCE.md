# 📊 Stats Quick Reference — Single Source of Truth

> **Use ONLY these numbers in the pitch, slides, and Q&A.**  
> Every stat has a verifiable source. If a judge challenges a number, cite the source.  
> Last verified: March 29, 2026.

---

## Global Hearing Loss

| Stat | Number | Source |
|------|--------|--------|
| People with disabling hearing loss (>35dB) | **430 million** | WHO World Report on Hearing, 2021; WHO Fact Sheet (updated March 3, 2026) |
| People with some degree of hearing loss | **1.5 billion** | WHO World Report on Hearing, 2021 |
| Projected disabling hearing loss by 2050 | **700 million** | WHO Fact Sheet, 2026 |
| Projected any hearing loss by 2050 | **2.5 billion** | WHO Fact Sheet, 2026 |
| Children with disabling hearing loss | **34 million** | WHO, 2021 |
| Children aged 5-19 with hearing loss | **95.1 million** | WHO Fact Sheet, 2026 |
| Annual global cost of unaddressed hearing loss | **US $980 billion** | WHO World Report on Hearing, 2021 |
| Deaf people worldwide (sign language users) | **~70 million** | World Federation of the Deaf |
| People in LMIC with disabling hearing loss | **~80%** of 430M | WHO, 2021 |

⚠️ **IMPORTANT:** The old figure of **466 million** (from pre-2021 WHO factsheet, >40dB threshold) is outdated. Current WHO uses **>35dB** threshold = **430 million**. Do NOT use 466M.

---

## European Union

| Stat | Number | Source |
|------|--------|--------|
| Deaf and hard of hearing in EU | **~52 million** | EUD (European Union of the Deaf), 2023 |
| Deaf/HoH as % of Europe's population | **9%** | EENA Accessibility page, 2025 |
| Deaf (sign language users) in EU | **~1 million** | EUD, 2025 |
| EU countries with full equivalent 112 access | **Zero** | EUD, 2024 |
| EU countries with native RTT to 112 | **1** (Ireland only) | EC Report on EECC Implementation, Dec 2024 |
| EU countries with app-based RTT | **2** (Malta, Netherlands) | EC Report, Dec 2024 |
| EECC Article 109 compliance deadline | **June 28, 2027** | EECC, Directive 2018/1972/EU |
| EAA application date | **June 28, 2025** | EAA, Directive 2019/882/EC |

---

## Serbia

| Stat | Number | Source |
|------|--------|--------|
| Deaf citizens | **~14,000** | Statistical Office of Republic of Serbia |
| Hard of hearing citizens | **~70,000** | Statistical Office of Republic of Serbia |
| **Total deaf + HoH** | **~84,000** | Combined |
| Alternative access to 112 | **None** (no SMS, no app, no relay, nothing) | EENA Accessibility Survey |

---

## USA (for competitive context)

| Stat | Number | Source |
|------|--------|--------|
| Deaf Americans | **~12 million** | AccesSOS / NIDCD |
| Hard of hearing Americans | **~30 million** (with hearing loss in both ears) | AccesSOS, 2025 |
| Americans with limited English proficiency | **29.6 million** | AccesSOS, 2025 |
| 911 centers that accept text messages | **~50%** | FCC / PagerDuty report, 2025 |
| US VRS Fund annual cost | **~$629 million/year** | FCC TRS Fund, 2024-2025 |
| VRS compensation rates | **$3.92–$8.06/minute** | FCC, 2024-2025 |

---

## Medak System

| Stat | Number | Source |
|------|--------|--------|
| Cost per call | **$0.13** | Internal calculation (Gemini API + Twilio) |
| Demo time (SOS → RESOLVED) | **38 seconds** | Measured from demo mode |
| Monthly infrastructure (pilot) | **~$55–63** | Cloud Run + Redis + Twilio |
| Monthly infrastructure (national) | **~$580–1,380** | Scaled estimate |
| AI agents | **2** (User Agent + Dispatch Agent) | Architecture |
| Model | **Gemini 2.0 Flash Live** | Both agents |
| Orchestrator | **Deterministic FSM** (not LLM) | Architecture |
| Confidence threshold | **0.85** | Weighted formula |
| Confidence weights | Location 0.35, Type 0.25, Conscious 0.15, Breathing 0.15, Victims 0.10 | Code |
| Human relay cost per call | **$20–40** | France 114 / VRS data |
| Cost advantage | **~150× cheaper** | $0.13 vs $20–40 |
| TAM | **€50–100M/year** | EU + US + developed world |
| SAM | **€10–20M/year** | EU with EAA mandate |
| SOM (Y3–5) | **€5–8M ARR** | 10-15 EU countries |

---

## Time = Life (for impact framing)

| Stat | Number | Source |
|------|--------|--------|
| Cardiac arrest survival decrease per minute | **5–12%** | Johansen et al., PMC, January 2026 |
| Survival with call 5 min earlier (Bergen study) | **47.7% → 68.6%** | Johansen et al., 2026 |
| Bystander CPR within 2 min → survival improvement | **+81%** | AHA, October 2025 |
| 1 in 10 deaf people avoid calling ambulance | **10%** | RNID/SignHealth, September 2025 |

**The framing:** For deaf people who currently **can't call 112 at all**, Medak doesn't just shorten the time — it restores the survival probability they never had access to.

---

## Competitor Stats

| Competitor | Key Stat | Source |
|------------|----------|--------|
| AccesSOS | 69,611 users, 145+ helped, 30 languages, CA + NM only | AccesSOS, Dec 2025 |
| France 114 | ~100 operators, 3-4 min response, millions €/year | France gov data |
| US VRS | $629M/year, $30-80/call, 1-5 min wait | FCC, 2024-2025 |
| DEC112 | Text-to-112, requires PSAP upgrades, limited EU deployment | DEC112 project |
| Nora (Germany) | Text chat only, Germany-only, no AI | German PSAP data |

---

## Serbia EU Accession (for B2G Q&A)

- Serbia opened **22 of 35** negotiating chapters (2 provisionally closed)
- **Cluster 3** (digital transformation, electronic communications) — technically ready to open
- EC 2025 Serbia Report recommends Serbia align with **EU Electronic Communications Code** (EECC)
- EECC Article 109 = accessible 112 mandate
- **Medak = EECC compliance demonstration → EU accession progress**
- Source: EU Commission 2025 Serbia Enlargement Package, November 4, 2025

---

## EU Policy Timeline (for regulatory tailwind narrative)

| Date | Event |
|------|-------|
| June 28, 2025 | **EAA entered into force** — EC: "112: people with comm. difficulties can access emergency services using voice, text, or video in real time" |
| Nov 27, 2025 | **EU Parliament voted 409-9** for stronger disability rights, including clear sanctions when accessibility obligations not met |
| Q2 2026 | **EU Disability Strategy 2026-2030** expected — regulatory pressure accelerating |
| June 28, 2027 | **EECC Article 109 deadline** — RTT for 112 mandatory across EU |
| March 2025 | **UN CRPD Committee** expressed "serious concern" about EU's delayed 112 accessibility |

**The bottom line:** The regulatory wave is here, getting stronger, and the penalties for non-compliance are being established NOW. Medak's timing is perfect.

---

## Key Quotes for Q&A

- "Unaddressed hearing loss poses an annual global cost of US $980 billion" — WHO
- "Over 5% of the world's population – or 430 million people – require rehabilitation to address their disabling hearing loss" — WHO Fact Sheet, March 2026
- The UN CRPD Committee expressed "serious concern" about delayed implementation of accessible 112 — CRPD Concluding Observations, March 2025
- "Emergency help should never depend on the language you use or whether you can hear or speak" — Gabriella Wong, AccesSOS founder

---

## 🚨 Numbers to AVOID (outdated/inaccurate)

| Wrong Number | Why It's Wrong | Correct Number |
|---|---|---|
| 466 million (WHO) | Pre-2021 factsheet, >40dB threshold | **430 million** (>35dB, WHO 2021/2026) |
| 900 million by 2050 | Old projection with old methodology | **700 million** (WHO 2026) |
| ~30% of US 911 accept text | Older AccesSOS research | **~50%** (FCC/PagerDuty, 2025) |
| 65 million Americans | Combined deaf+HoH+LEP from older source | **37M deaf/HoH + 29.6M LEP** (AccesSOS 2025) |
| $750 billion annual cost | Old WHO estimate | **$980 billion** (WHO 2021) |
